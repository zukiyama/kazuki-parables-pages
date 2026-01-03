import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect if the current viewport should use widescreen layout.
 * 
 * CRITICAL: This hook uses WIDTH-ONLY logic to prevent layout flipping
 * when Safari's address bar expands/collapses on scroll.
 * 
 * - Never uses viewport height for layout decisions
 * - Uses hysteresis (dead zone) to prevent flickering near breakpoints
 * - Only updates on orientation change, not on scroll-triggered resizes
 * 
 * Breakpoints with buffer zone:
 * - Desktop/Widescreen: >= 1100px (safely above iPad 11" landscape ~1024px)
 * - Tablet/Mobile: <= 1000px
 * - Dead zone: 1000-1100px uses previous state (hysteresis)
 * 
 * This ensures iPad 10.9" and iPad 12.9" in landscape always get the SAME layout.
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(() => {
    // Initial check - use width only
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= 1100;
  });
  
  const previousWidthRef = useRef<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const isInitializedRef = useRef(false);

  const checkWidth = useCallback(() => {
    const width = window.innerWidth;
    const previousWidth = previousWidthRef.current;
    
    // Hysteresis: only change state if we cross the buffer zone boundaries
    // This prevents flickering when width hovers near a breakpoint
    const WIDESCREEN_ENTER = 1100; // Must be >= this to become widescreen
    const WIDESCREEN_EXIT = 1000;  // Must be <= this to exit widescreen
    
    // Determine if this is a significant width change (orientation change)
    // vs a minor resize (Safari chrome, soft keyboard, etc.)
    const widthDelta = Math.abs(width - previousWidth);
    const isSignificantChange = widthDelta > 100 || !isInitializedRef.current;
    
    if (!isSignificantChange) {
      // Ignore minor width changes that could be caused by browser chrome
      return;
    }
    
    previousWidthRef.current = width;
    isInitializedRef.current = true;
    
    // Apply hysteresis logic
    if (width >= WIDESCREEN_ENTER) {
      setIsWidescreen(true);
    } else if (width <= WIDESCREEN_EXIT) {
      setIsWidescreen(false);
    }
    // If width is in the dead zone (1000-1100), keep previous state
  }, []);

  useEffect(() => {
    // Initial check
    checkWidth();
    
    // Only respond to orientation changes, not scroll-triggered resizes
    // This is the key to preventing Safari address bar issues
    const handleOrientationChange = () => {
      // Delay to allow layout to settle after orientation change
      setTimeout(checkWidth, 200);
    };
    
    // Debounced resize handler that ignores minor changes
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkWidth, 250);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [checkWidth]);

  return isWidescreen;
};
