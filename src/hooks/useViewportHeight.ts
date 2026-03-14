import { useEffect } from 'react';

/**
 * Sets a viewport height CSS variable (--app-height) with different behavior:
 * 
 * DESKTOP (hover + fine pointer): Updates on every resize for proper window resizing.
 * MOBILE/TABLET: Updates only on load + orientation change to prevent zoom during scroll.
 * 
 * Background layers use OVERSCAN (taller than viewport) on mobile to prevent
 * white bar when browser UI collapses, without resizing/zooming.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    // Detect desktop vs mobile/tablet based on input capabilities
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    let rafId: number | null = null;
    let stableWidth = 0;

    // Use visualViewport.height for accuracy on iPad Chrome/Edge,
    // where innerHeight can be stale after toolbar retraction
    const getViewportHeight = (): number => {
      if (window.visualViewport) {
        return window.visualViewport.height;
      }
      return document.documentElement.clientHeight || window.innerHeight;
    };

    const setHeight = () => {
      const height = getViewportHeight();
      document.documentElement.style.setProperty('--app-height', `${height}px`);
      stableWidth = window.innerWidth;
    };

    // Desktop: update on every resize (throttled with rAF)
    const handleDesktopResize = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        setHeight();
        rafId = null;
      });
    };

    // Mobile: only update on significant width change (orientation)
    const handleMobileResize = () => {
      const currentWidth = window.innerWidth;
      // Only update if width changed significantly (indicates orientation change, not URL bar)
      if (Math.abs(currentWidth - stableWidth) > 50) {
        setHeight();
      }
    };

    // Handle orientation change (mobile only, with delay for layout settle)
    const handleOrientationChange = () => {
      setTimeout(setHeight, 150);
    };

    // Initialize
    setHeight();

    // Delayed re-measure to catch iPad Chrome/Edge toolbar settling
    // (toolbars may retract shortly after initial load, changing viewport height)
    const settleTimeout = setTimeout(() => {
      setHeight();
    }, 500);

    if (isDesktop) {
      // Desktop: responsive to all window resizes
      window.addEventListener('resize', handleDesktopResize);
    } else {
      // Mobile/tablet: only orientation changes
      window.addEventListener('resize', handleMobileResize);
      window.addEventListener('orientationchange', handleOrientationChange);
    }

    return () => {
      clearTimeout(settleTimeout);
      if (rafId) cancelAnimationFrame(rafId);
      if (isDesktop) {
        window.removeEventListener('resize', handleDesktopResize);
      } else {
        window.removeEventListener('resize', handleMobileResize);
        window.removeEventListener('orientationchange', handleOrientationChange);
      }
    };
  }, []);
};
