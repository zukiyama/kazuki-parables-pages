import { useEffect, useState, useRef, useCallback } from 'react';

interface ScrollState {
  offset: number;        // Smooth offset value for parallax
  isScrolling: boolean;  // Whether user is actively scrolling
}

export function useScrollVelocity(maxOffset: number = 40) {
  const [state, setState] = useState<ScrollState>({
    offset: 0,
    isScrolling: false
  });
  
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const currentOffset = useRef(0);
  const targetOffset = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isScrollingRef = useRef(false);
  
  // Smooth animation loop - runs continuously for buttery motion
  const animate = useCallback(() => {
    // Smoothly interpolate current offset toward target
    // Use different easing based on whether scrolling or returning
    const easingFactor = isScrollingRef.current ? 0.15 : 0.04; // Slower return
    
    const diff = targetOffset.current - currentOffset.current;
    
    if (Math.abs(diff) > 0.01) {
      currentOffset.current += diff * easingFactor;
      
      setState({
        offset: currentOffset.current,
        isScrolling: isScrollingRef.current
      });
    } else if (!isScrollingRef.current && Math.abs(currentOffset.current) > 0.01) {
      // Continue animating back to 0
      currentOffset.current += diff * easingFactor;
      setState({
        offset: currentOffset.current,
        isScrolling: false
      });
    }
    
    animationFrame.current = requestAnimationFrame(animate);
  }, []);
  
  useEffect(() => {
    // Start the animation loop
    animationFrame.current = requestAnimationFrame(animate);
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = Math.max(currentTime - lastTime.current, 1);
      
      // Calculate scroll velocity
      const scrollDelta = currentScrollY - lastScrollY.current;
      const velocity = (scrollDelta / timeDelta) * 16; // Normalize to ~60fps
      
      // Add velocity to target offset with momentum
      // Multiply by a factor to make it feel responsive
      const momentumFactor = 2.5;
      targetOffset.current += velocity * momentumFactor;
      
      // Clamp target offset to max bounds
      targetOffset.current = Math.max(-maxOffset, Math.min(maxOffset, targetOffset.current));
      
      // Mark as scrolling
      isScrollingRef.current = true;
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set timeout to detect scroll stop
      scrollTimeout.current = setTimeout(() => {
        isScrollingRef.current = false;
        // Start returning to 0
        targetOffset.current = 0;
      }, 100);
      
      lastScrollY.current = currentScrollY;
      lastTime.current = currentTime;
    };
    
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
  }, [maxOffset, animate]);
  
  return state;
}
