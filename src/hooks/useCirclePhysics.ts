import { useEffect, useRef, useState, useCallback } from 'react';

interface CircleState {
  y: number;              // Current vertical offset
  vy: number;             // Vertical velocity
  basePhase: number;      // Phase offset for natural drift cycle
  baseSpeed: number;      // Speed of natural drift (varies per circle)
  baseAmplitude: number;  // How far the natural drift goes
  mass: number;           // How sluggish (higher = slower reaction)
  sensitivity: number;    // How much scroll affects this circle
}

interface PhysicsConfig {
  returnStrength: number;     // How strongly circles return to drift center
  damping: number;            // Friction when disturbed
  scrollForceMultiplier: number;
}

interface CirclePhysicsResult {
  offsets: { x: number; y: number }[];
  isSettled: boolean;
}

const defaultConfig: PhysicsConfig = {
  returnStrength: 0.003,
  damping: 0.985,
  scrollForceMultiplier: 0.4,
};

export function useCirclePhysics(
  circleCount: number,
  sensitivities: number[],
  config: Partial<PhysicsConfig> = {}
): CirclePhysicsResult {
  const cfg = { ...defaultConfig, ...config };
  
  const circles = useRef<CircleState[]>([]);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const startTime = useRef(Date.now());
  
  const [result, setResult] = useState<CirclePhysicsResult>({
    offsets: Array(circleCount).fill({ x: 0, y: 0 }),
    isSettled: true,
  });
  
  // Initialize circles with varied drift parameters
  useEffect(() => {
    circles.current = sensitivities.map((sensitivity) => ({
      y: 0,
      vy: 0,
      basePhase: Math.random() * Math.PI * 2,           // Random starting phase
      baseSpeed: 0.0004 + Math.random() * 0.0003,       // Slow drift speed (varies)
      baseAmplitude: 8 + Math.random() * 12,            // Drift range 8-20px
      mass: 0.7 + Math.random() * 0.6,                  // Mass variation
      sensitivity,
    }));
  }, [sensitivities.length]);
  
  // Physics simulation loop
  const simulate = useCallback(() => {
    const now = Date.now();
    const elapsed = now - startTime.current;
    let totalDisturbance = 0;
    
    circles.current.forEach((circle) => {
      // Calculate the natural drift target position (sinusoidal bobbing)
      const naturalTarget = Math.sin(elapsed * circle.baseSpeed + circle.basePhase) * circle.baseAmplitude;
      
      // Spring force pulling toward natural drift position
      const springForce = (naturalTarget - circle.y) * cfg.returnStrength;
      
      // Apply spring force to velocity
      circle.vy += springForce / circle.mass;
      
      // Apply damping (friction)
      circle.vy *= cfg.damping;
      
      // Clamp max velocity to prevent flying off
      const maxVel = 12;
      circle.vy = Math.max(-maxVel, Math.min(maxVel, circle.vy));
      
      // Update position
      circle.y += circle.vy;
      
      // Clamp max offset
      const maxOffset = 60;
      circle.y = Math.max(-maxOffset, Math.min(maxOffset, circle.y));
      
      // Track how far from natural state (for isSettled detection)
      const distFromNatural = Math.abs(circle.y - naturalTarget);
      const excessVelocity = Math.abs(circle.vy) - Math.abs(springForce / circle.mass * 2);
      totalDisturbance += Math.max(0, excessVelocity) * 10 + Math.max(0, distFromNatural - circle.baseAmplitude);
    });
    
    // Decay scroll velocity over time
    scrollVelocity.current *= 0.95;
    
    // Settled when circles are following their natural drift
    const isSettled = totalDisturbance < 2;
    
    // Update React state
    setResult({
      offsets: circles.current.map(c => ({ x: 0, y: c.y })),
      isSettled,
    });
    
    animationFrame.current = requestAnimationFrame(simulate);
  }, [cfg]);
  
  // Handle scroll events - apply impulse forces
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDelta = Math.max(now - lastScrollTime.current, 1);
      
      // Calculate scroll velocity
      const newVelocity = (currentScrollY - lastScrollY.current) / timeDelta * 16;
      
      // Calculate acceleration (change in velocity)
      const acceleration = newVelocity - scrollVelocity.current;
      
      // Apply impulse to each circle based on scroll acceleration
      circles.current.forEach((circle) => {
        // Scroll down = positive acceleration = circles move up (negative y)
        // This creates the "floating in medium" effect
        const impulse = -acceleration * cfg.scrollForceMultiplier * circle.sensitivity / circle.mass;
        circle.vy += impulse;
      });
      
      scrollVelocity.current = newVelocity;
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;
    };
    
    // Start physics loop
    animationFrame.current = requestAnimationFrame(simulate);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [simulate, cfg.scrollForceMultiplier]);
  
  return result;
}
