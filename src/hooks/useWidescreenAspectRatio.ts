import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to detect if the current viewport is approximately 16:9 or 16:10 aspect ratio.
 * This typically corresponds to laptops and HDTVs in landscape orientation.
 * 
 * 16:9 ratio = 1.777...
 * 16:10 ratio = 1.6
 * 
 * We use a range of 1.55 to 1.85 to account for slight variations (browser chrome, etc.)
 * and only on desktop-sized screens (width >= 1024px)
 */
export const useWidescreenAspectRatio = () => {
  const [isWidescreen, setIsWidescreen] = useState(false);

  const checkAspectRatio = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Only apply to desktop-sized screens (laptops/monitors)
    if (width < 1024) {
      setIsWidescreen(false);
      return;
    }
    
    // Must be landscape orientation
    if (height >= width) {
      setIsWidescreen(false);
      return;
    }
    
    const ratio = width / height;
    
    // 16:10 = 1.6, 16:9 = 1.777
    // Using range 1.55 to 1.85 to catch both with some tolerance
    const is16x9or16x10 = ratio >= 1.55 && ratio <= 1.85;
    
    setIsWidescreen(is16x9or16x10);
  }, []);

  useEffect(() => {
    checkAspectRatio();
    
    window.addEventListener('resize', checkAspectRatio);
    window.addEventListener('orientationchange', checkAspectRatio);
    
    return () => {
      window.removeEventListener('resize', checkAspectRatio);
      window.removeEventListener('orientationchange', checkAspectRatio);
    };
  }, [checkAspectRatio]);

  return isWidescreen;
};
