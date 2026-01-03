import { useState, useEffect, useRef } from 'react';

/**
 * Hook to detect if the current viewport has a widescreen aspect ratio.
 * Only updates on width changes or orientation changes, NOT on height-only changes
 * (which happen when browser chrome appears/disappears during scrolling).
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);
  const lastWidthRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 0);
  const wasPortraitRef = useRef(typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false);

  useEffect(() => {
    const checkAspectRatio = (forceUpdate = false) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isPortrait = height > width;
      const orientationChanged = wasPortraitRef.current !== isPortrait;
      const widthChanged = Math.abs(width - lastWidthRef.current) > 5;

      // Only recalculate if width changed significantly OR orientation changed OR forced
      if (!forceUpdate && !widthChanged && !orientationChanged) {
        return;
      }

      lastWidthRef.current = width;
      wasPortraitRef.current = isPortrait;

      // Only apply to desktop-sized screens (laptops/monitors)
      if (width < 1024) {
        setIsWidescreen(false);
        return;
      }

      // Must be landscape orientation
      if (isPortrait) {
        setIsWidescreen(false);
        return;
      }

      const ratio = width / height;
      // 16:10 = 1.6, 16:9 = 1.777
      setIsWidescreen(ratio >= 1.6);
    };

    // Initial check
    checkAspectRatio(true);

    const handleResize = () => checkAspectRatio(false);
    const handleOrientation = () => checkAspectRatio(true);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientation);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  return isWidescreen;
};
