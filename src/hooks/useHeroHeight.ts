import { useEffect, useRef } from 'react';

/**
 * Sets --hero-h CSS custom property for the landing hero.
 * 
 * Uses visualViewport.height (with fallback to innerHeight) to set initial height,
 * then remains fixed during scroll to prevent Safari address bar resize jank.
 * 
 * Only updates on:
 * - Initial load (with rAF for layout stability)
 * - Orientation change
 * - Significant height change (>120px hysteresis) to catch real resizes
 */
export const useHeroHeight = () => {
  const lastHeight = useRef<number>(0);
  const HYSTERESIS = 120; // Ignore changes smaller than this (Safari UI bar ~50-90px)

  useEffect(() => {
    const getViewportHeight = (): number => {
      // Prefer visualViewport for accurate height on mobile Safari
      if (window.visualViewport) {
        return window.visualViewport.height;
      }
      return window.innerHeight;
    };

    const setHeroHeight = (force = false) => {
      const height = getViewportHeight();
      
      // Only update if forced or height changed significantly
      if (force || Math.abs(height - lastHeight.current) > HYSTERESIS) {
        document.documentElement.style.setProperty('--hero-h', `${height}px`);
        lastHeight.current = height;
      }
    };

    // Initial set with rAF for layout stability
    requestAnimationFrame(() => {
      setHeroHeight(true);
    });

    // Also set after a short delay to catch any late layout shifts
    const timeoutId = setTimeout(() => {
      setHeroHeight(true);
    }, 100);

    // Handle orientation change (always update)
    const handleOrientationChange = () => {
      // Delay to let layout settle after orientation change
      setTimeout(() => setHeroHeight(true), 150);
    };

    // Handle resize - only for significant changes (real window resize, not Safari UI)
    const handleResize = () => {
      setHeroHeight(false); // Uses hysteresis check
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    // Also listen to visualViewport resize if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);
};
