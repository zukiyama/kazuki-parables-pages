import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive layout hook with 3-tier system:
 * 
 * 1. Mobile: width <= 820px (phones, narrow tablets like 10.9" iPad portrait)
 * 2. Desktop: width > 820px AND aspect ratio < 1.5 (iPad 12.9" landscape at ~1.33:1)
 * 3. Widescreen: width > 820px AND aspect ratio >= 1.5 (laptops at 16:9 or wider)
 * 
 * Mobile detection uses width-only to prevent Safari bar flicker.
 * Widescreen uses aspect ratio because iPad 12.9" needs different layout than laptops.
 */

const MOBILE_MAX = 820;
const WIDESCREEN_ASPECT_RATIO = 1.5; // 16:9 = 1.78, iPad 12.9" = 1.33

export type LayoutTier = 'mobile' | 'desktop' | 'widescreen';

function getLayoutTier(width: number, height: number): LayoutTier {
  if (width <= MOBILE_MAX) return 'mobile';
  const aspectRatio = width / height;
  if (aspectRatio >= WIDESCREEN_ASPECT_RATIO) return 'widescreen';
  return 'desktop';
}

export const useResponsiveLayout = () => {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>(() => {
    if (typeof window !== 'undefined') {
      return getLayoutTier(window.innerWidth, window.innerHeight);
    }
    return 'mobile';
  });

  const checkLayout = useCallback(() => {
    const newTier = getLayoutTier(window.innerWidth, window.innerHeight);
    setLayoutTier(prev => prev !== newTier ? newTier : prev);
  }, []);

  useEffect(() => {
    checkLayout();
    
    window.addEventListener('resize', checkLayout);
    window.addEventListener('orientationchange', checkLayout);
    
    return () => {
      window.removeEventListener('resize', checkLayout);
      window.removeEventListener('orientationchange', checkLayout);
    };
  }, [checkLayout]);

  return {
    layoutTier,
    isMobile: layoutTier === 'mobile',
    isDesktop: layoutTier === 'desktop',
    isWidescreen: layoutTier === 'widescreen',
    isDesktopOrWidescreen: layoutTier !== 'mobile',
  };
};

/**
 * @deprecated Use useResponsiveLayout().isMobile instead
 */
export const useIsMobile = () => {
  const { isMobile } = useResponsiveLayout();
  return isMobile;
};

/**
 * @deprecated Use useResponsiveLayout().isWidescreen instead
 * Returns true only for widescreen (16:9+) displays, NOT for iPad 12.9"
 */
export const useWidescreenAspectRatio = () => {
  const { isWidescreen } = useResponsiveLayout();
  return isWidescreen;
};
