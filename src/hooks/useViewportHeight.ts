import { useEffect } from 'react';

/**
 * Sets a STABLE viewport height (--app-height) that does NOT change during scroll.
 * Updated only on load and orientation change.
 * 
 * Background layers use OVERSCAN (taller than viewport) to prevent
 * white bar when browser UI collapses, without resizing/zooming.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    let stableWidth = 0;

    const setStableHeight = () => {
      // Use innerHeight - more stable than visualViewport during orientation change
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      document.documentElement.style.setProperty('--app-height', `${height}px`);
      stableWidth = width;
    };

    // Handle orientation change only
    const handleOrientationChange = () => {
      setTimeout(setStableHeight, 150);
    };

    // Handle resize - only update on significant width change (orientation)
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      if (Math.abs(currentWidth - stableWidth) > 50) {
        setStableHeight();
      }
    };

    // Initialize
    setStableHeight();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);
};
