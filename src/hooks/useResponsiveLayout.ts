import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive layout hook with 3-tier system (hybrid width + aspect ratio):
 * 
 * 1. Mobile: width <= 820px
 * 2. Desktop: width 821-1279px, OR width >= 1280px but aspect ratio < 1.58 (catches iPad 12.9" at 1366px)
 * 3. Widescreen: width >= 1280px AND aspect ratio >= 1.58 (laptops with 16:10 or wider viewports)
 * 
 * Width is primary check; aspect ratio handles edge case of iPad 12.9" which is 1366px wide
 * but has ~1.33-1.50 aspect ratio vs laptops at 1.6+ aspect ratio.
 */

const MOBILE_MAX = 820;
const WIDESCREEN_MIN_WIDTH = 1280;
const WIDESCREEN_MIN_ASPECT = 1.58; // Above iPad 10.9" max (~1.55), below MacBook 16:10 (1.6)

export type LayoutTier = 'mobile' | 'desktop' | 'widescreen';

function getLayoutTier(width: number, height: number): LayoutTier {
  if (width <= MOBILE_MAX) return 'mobile';
  
  // Primary: width check
  if (width < WIDESCREEN_MIN_WIDTH) return 'desktop';
  
  // Secondary: for wide screens, check aspect ratio to catch iPad 12.9" (1366px wide, ~1.33 aspect)
  const aspectRatio = width / height;
  if (aspectRatio >= WIDESCREEN_MIN_ASPECT) return 'widescreen';
  
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
