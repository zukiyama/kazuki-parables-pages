import { useEffect } from 'react';

/**
 * Two-viewport strategy for mobile browsers with collapsing UI:
 * 
 * 1. STABLE height (--app-height): Captured once on load, only updates on 
 *    orientation change. Used for layout/scroll-snap to prevent zoom.
 * 
 * 2. DYNAMIC height (--dvh): Updates when browser UI collapses/expands.
 *    Used ONLY for fixed background layers to fill the visible viewport.
 * 
 * This prevents both:
 * - Background zoom when scrolling (stable layout)
 * - White bar when browser UI collapses (dynamic background fill)
 */
export const useViewportHeight = () => {
  useEffect(() => {
    let stableWidth = 0;
    let rafId: number | null = null;

    // Get current viewport height
    const getViewportHeight = () => {
      return window.visualViewport?.height ?? window.innerHeight;
    };

    const getViewportWidth = () => {
      return window.visualViewport?.width ?? window.innerWidth;
    };

    // Set STABLE height - only on load and orientation change
    const setStableHeight = () => {
      const height = getViewportHeight();
      document.documentElement.style.setProperty('--app-height', `${height}px`);
      stableWidth = getViewportWidth();
    };

    // Set DYNAMIC height - updates when browser UI changes
    const setDynamicHeight = () => {
      if (rafId) return; // Already scheduled
      rafId = requestAnimationFrame(() => {
        const height = getViewportHeight();
        document.documentElement.style.setProperty('--dvh', `${height}px`);
        rafId = null;
      });
    };

    // Handle resize - update dynamic, check if stable needs update
    const handleResize = () => {
      // Always update dynamic height for background layer
      setDynamicHeight();

      // Only update stable height on major width change (orientation)
      const currentWidth = getViewportWidth();
      if (Math.abs(currentWidth - stableWidth) > 50) {
        setStableHeight();
      }
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      // Delay to let browser settle
      setTimeout(() => {
        setStableHeight();
        setDynamicHeight();
      }, 100);
    };

    // Initialize both values
    setStableHeight();
    setDynamicHeight();

    // Listen to visualViewport if available (more reliable on mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
};
