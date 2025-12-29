import { useEffect } from 'react';

/**
 * Hook to set a stable viewport height CSS variable that doesn't change
 * when mobile browser UI bars appear/disappear.
 * 
 * Sets --app-vh to 1% of the visual viewport height.
 * Use with: min-height: calc(var(--app-vh, 1vh) * 100)
 * 
 * This prevents the "zoom in/out" effect on background images when
 * scrolling on mobile browsers.
 */
export const useViewportHeight = () => {
  useEffect(() => {
    let rafId: number;
    let lastHeight = 0;

    const updateViewportHeight = () => {
      // Use visualViewport API when available (most modern browsers)
      // This gives us the actual visible viewport, accounting for browser UI
      const height = window.visualViewport?.height ?? window.innerHeight;
      
      // Only update if height actually changed (avoid unnecessary repaints)
      if (Math.abs(height - lastHeight) > 1) {
        lastHeight = height;
        const vh = height * 0.01;
        document.documentElement.style.setProperty('--app-vh', `${vh}px`);
      }
    };

    const throttledUpdate = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateViewportHeight);
    };

    // Initial set
    updateViewportHeight();

    // Listen to visualViewport resize if available
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', throttledUpdate);
    }
    
    // Fallback/additional listeners
    window.addEventListener('resize', throttledUpdate);
    window.addEventListener('orientationchange', throttledUpdate);

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', throttledUpdate);
      }
      window.removeEventListener('resize', throttledUpdate);
      window.removeEventListener('orientationchange', throttledUpdate);
    };
  }, []);
};
