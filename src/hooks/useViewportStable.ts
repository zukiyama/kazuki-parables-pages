import { useEffect, useState, useRef } from 'react';

/**
 * Hook to detect when the viewport has stabilized after navigation.
 * 
 * On iOS Safari, navigating while the browser UI is collapsed causes
 * viewport metrics to be unreliable on first paint. This hook waits for:
 * 1. Two animation frames (layout has happened)
 * 2. No visualViewport resize events for a short period
 * 
 * Returns `true` once stable, `false` during boot.
 */
export const useViewportStable = (stabilizeDelay = 200) => {
  const [isStable, setIsStable] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let mounted = true;

    const markStable = () => {
      if (mounted) setIsStable(true);
    };

    const resetTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(markStable, stabilizeDelay);
    };

    // Wait for two animation frames, then start listening for resize events
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!mounted) return;

        // Start the stabilization timer
        resetTimer();

        // Reset timer on visualViewport resize
        const vv = window.visualViewport;
        if (vv) {
          const handleResize = () => {
            if (mounted) resetTimer();
          };
          vv.addEventListener('resize', handleResize);

          // Cleanup for visualViewport listener
          return () => {
            vv.removeEventListener('resize', handleResize);
          };
        }
      });
    });

    return () => {
      mounted = false;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [stabilizeDelay]);

  return isStable;
};
