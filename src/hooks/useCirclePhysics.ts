import { useEffect, useRef, useState, useCallback } from 'react';

interface CircleState {
  x: number;           // Current offset from home
  y: number;
  vx: number;          // Velocity
  vy: number;
  mass: number;        // How heavy/sluggish (higher = slower reaction)
  sensitivity: number; // How much scroll affects this circle
}

interface PhysicsConfig {
  springStrength: number;  // How strongly circles return to home
  damping: number;         // Friction/air resistance
  scrollForceMultiplier: number;
}

interface CirclePhysicsResult {
  offsets: { x: number; y: number }[];
  isSettled: boolean;  // True when all circles are nearly at rest
}

const defaultConfig: PhysicsConfig = {
  springStrength: 0.015,
  damping: 0.92,
  scrollForceMultiplier: 0.8,
};

export function useCirclePhysics(
  circleCount: number,
  sensitivities: number[],
  config: Partial<PhysicsConfig> = {}
): CirclePhysicsResult {
  const cfg = { ...defaultConfig, ...config };
  
  // Physics state stored in refs for performance (avoid re-renders during animation)
  const circles = useRef<CircleState[]>([]);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const scrollVelocity = useRef(0);
  const scrollAcceleration = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // State for React re-renders (throttled)
  const [result, setResult] = useState<CirclePhysicsResult>({
    offsets: Array(circleCount).fill({ x: 0, y: 0 }),
    isSettled: true,
  });
  
  // Initialize circles
  useEffect(() => {
    circles.current = sensitivities.map((sensitivity, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      mass: 0.8 + Math.random() * 0.4, // Slight variation in mass
      sensitivity,
    }));
  }, [sensitivities.length]);
  
  // Physics simulation loop
  const simulate = useCallback(() => {
    const now = Date.now();
    let totalEnergy = 0;
    
    circles.current.forEach((circle) => {
      // Apply scroll force (primarily vertical, with slight horizontal shake)
      if (isScrolling.current) {
        const scrollForce = scrollAcceleration.current * cfg.scrollForceMultiplier;
        const horizontalShake = scrollAcceleration.current * 0.3 * (Math.random() - 0.5);
        
        circle.vy += (scrollForce * circle.sensitivity) / circle.mass;
        circle.vx += (horizontalShake * circle.sensitivity) / circle.mass;
      }
      
      // Spring force - pulls back toward home (0, 0)
      const springX = -circle.x * cfg.springStrength;
      const springY = -circle.y * cfg.springStrength;
      
      circle.vx += springX / circle.mass;
      circle.vy += springY / circle.mass;
      
      // Apply damping (air resistance)
      circle.vx *= cfg.damping;
      circle.vy *= cfg.damping;
      
      // Clamp max velocity to prevent circles flying off screen
      const maxVel = 15;
      circle.vx = Math.max(-maxVel, Math.min(maxVel, circle.vx));
      circle.vy = Math.max(-maxVel, Math.min(maxVel, circle.vy));
      
      // Update position
      circle.x += circle.vx;
      circle.y += circle.vy;
      
      // Clamp max position offset
      const maxOffset = 80;
      circle.x = Math.max(-maxOffset, Math.min(maxOffset, circle.x));
      circle.y = Math.max(-maxOffset, Math.min(maxOffset, circle.y));
      
      // Calculate energy for settled detection
      totalEnergy += Math.abs(circle.vx) + Math.abs(circle.vy) + 
                     Math.abs(circle.x) * 0.1 + Math.abs(circle.y) * 0.1;
    });
    
    // Decay scroll acceleration when not actively scrolling
    if (!isScrolling.current) {
      scrollAcceleration.current *= 0.9;
    }
    
    // Check if settled (low energy state)
    const isSettled = totalEnergy < 0.5;
    
    // Update React state (throttled to ~30fps for performance)
    setResult({
      offsets: circles.current.map(c => ({ x: c.x, y: c.y })),
      isSettled,
    });
    
    animationFrame.current = requestAnimationFrame(simulate);
  }, [cfg]);
  
  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const timeDelta = Math.max(now - lastScrollTime.current, 1);
      
      // Calculate scroll velocity and acceleration
      const newVelocity = (currentScrollY - lastScrollY.current) / timeDelta * 16;
      scrollAcceleration.current = (newVelocity - scrollVelocity.current) * 2;
      scrollVelocity.current = newVelocity;
      
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = now;
      isScrolling.current = true;
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set timeout to detect scroll stop
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 80);
    };
    
    // Start physics loop
    animationFrame.current = requestAnimationFrame(simulate);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [simulate]);
  
  return result;
}
