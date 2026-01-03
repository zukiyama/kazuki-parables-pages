import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect if the current viewport has a widescreen aspect ratio.
 * This typically corresponds to laptops and HDTVs in landscape orientation.
 * 
 * CRITICAL: Uses STABLE height measurement to prevent layout flipping
 * when Safari's address bar expands/collapses on scroll.
 * 
 * Strategy:
 * - Capture initial dimensions on mount
 * - Only recalculate on TRUE orientation changes (large width delta)
 * - Ignore minor height changes from Safari chrome
 * 
 * 16:10 ratio = 1.6
 * 16:9 ratio = 1.777...
 * iPads in landscape are typically ~1.33 (4:3), so they won't trigger widescreen.
 */
export const useWidescreenAspectRatio = () => {
  const stableWidthRef = useRef<number>(0);
  const stableHeightRef = useRef<number>(0);
  
  const [isWidescreen, setIsWidescreen] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Use screen dimensions for initial stable measurement on touch devices
    // This avoids Safari's fluctuating viewport height entirely
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let width: number;
    let height: number;
    
    if (isTouchDevice) {
      // On touch devices, use screen dimensions which don't change with browser chrome
      width = window.screen.width;
      height = window.screen.height;
      // Account for current orientation
      if (window.innerWidth > window.innerHeight) {
        // Landscape - screen.width/height may be in portrait orientation
        width = Math.max(window.screen.width, window.screen.height);
        height = Math.min(window.screen.width, window.screen.height);
      } else {
        width = Math.min(window.screen.width, window.screen.height);
        height = Math.max(window.screen.width, window.screen.height);
      }
    } else {
      // On desktop, use window dimensions
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    stableWidthRef.current = width;
    stableHeightRef.current = height;
    
    return calculateWidescreen(width, height);
  });

  const calculateWidescreen = useCallback((width: number, height: number): boolean => {
    // Only apply to desktop-sized screens (laptops/monitors)
    if (width < 1024) return false;
    
    // Must be landscape orientation
    if (height >= width) return false;
    
    const ratio = width / height;
    
    // 16:10 = 1.6, 16:9 = 1.777
    // iPads are ~1.33 (4:3) so they won't trigger this
    // Detect anything 16:10 or wider (ratio >= 1.6)
    return ratio >= 1.6;
  }, []);

  const checkDimensions = useCallback(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    let width: number;
    let height: number;
    
    if (isTouchDevice) {
      // On touch devices, use screen dimensions
      if (window.innerWidth > window.innerHeight) {
        width = Math.max(window.screen.width, window.screen.height);
        height = Math.min(window.screen.width, window.screen.height);
      } else {
        width = Math.min(window.screen.width, window.screen.height);
        height = Math.max(window.screen.width, window.screen.height);
      }
    } else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    
    // Only update if there's a significant change (orientation flip)
    const widthDelta = Math.abs(width - stableWidthRef.current);
    if (widthDelta > 100) {
      stableWidthRef.current = width;
      stableHeightRef.current = height;
      setIsWidescreen(calculateWidescreen(width, height));
    }
  }, [calculateWidescreen]);

  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(checkDimensions, 200);
    };
    
    // Debounced resize for desktop only
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      if (isTouchDevice) return; // Ignore resize on touch devices, use orientationchange
      
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkDimensions, 250);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [checkDimensions]);

  return isWidescreen;
};
