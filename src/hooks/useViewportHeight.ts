import { useEffect } from 'react';

/**
 * Hook to set a STABLE viewport height CSS variable that does NOT change
 * when mobile browser UI bars appear/disappear during scroll.
 * 
 * Sets --app-height to the initial viewport height in pixels.
 * This value is LOCKED on load and only updates on:
 * - Orientation change (portrait <-> landscape)
 * - Significant resize (e.g., desktop window resize, NOT mobile browser UI)
 * 
 * Use with: height: var(--app-height, 100svh)
 * 
 * This prevents the "zoom in/out" effect on background images when
 * scrolling on mobile browsers.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    let initialHeight = 0;
    let initialWidth = 0;

    const setViewportHeight = () => {
      // Use visualViewport when available, fallback to innerHeight
      const height = window.visualViewport?.height ?? window.innerHeight;
      const width = window.visualViewport?.width ?? window.innerWidth;
      
      document.documentElement.style.setProperty('--app-height', `${height}px`);
      initialHeight = height;
      initialWidth = width;
    };

    const handleResize = () => {
      const currentWidth = window.visualViewport?.width ?? window.innerWidth;
      const currentHeight = window.visualViewport?.height ?? window.innerHeight;
      
      // Only update on SIGNIFICANT changes (orientation change or actual window resize)
      // Ignore small height changes caused by browser UI showing/hiding
      const widthChanged = Math.abs(currentWidth - initialWidth) > 50;
      const isOrientationChange = widthChanged;
      
      // For height-only changes, only update if it's a MAJOR change (>20% of screen)
      // This ignores browser bar show/hide but catches actual resize events
      const heightDelta = Math.abs(currentHeight - initialHeight);
      const isMajorHeightChange = heightDelta > initialHeight * 0.2;
      
      if (isOrientationChange || isMajorHeightChange) {
        requestAnimationFrame(setViewportHeight);
      }
    };

    // Set initial value immediately
    setViewportHeight();

    // Only listen to events that indicate real layout changes
    window.addEventListener('orientationchange', () => {
      // Delay slightly to let browser settle after orientation change
      setTimeout(setViewportHeight, 100);
    });
    
    // For desktop resize support
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);
};
