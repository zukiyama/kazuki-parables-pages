import { useState, useEffect, useCallback } from 'react';

/**
 * Responsive layout hook using width-only breakpoints.
 * 
 * 3-tier layout system (PRIORITY: iPad 12.9" landscape = widescreen):
 * - Mobile: 0-820px (phones + narrow tablets like 10.9" iPad portrait)
 * - Tablet: 821-1023px (10.9" iPad landscape, smaller tablets)
 * - Widescreen: 1024px+ (iPad 12.9" portrait/landscape, laptops/desktops)
 * 
 * The user built this site on iPad 12.9" landscape (1366px), so that
 * device MUST always get the widescreen layout.
 * 
 * Uses width only - no height, aspect-ratio, or Safari bar-sensitive measurements.
 * This prevents layout flickering when Safari's address bar shows/hides.
 */

const MOBILE_MAX = 820;      // Mobile layout: 0-820px
const TABLET_MAX = 1023;     // Tablet layout: 821-1023px
                              // Widescreen: 1024px+ (includes iPad 12.9" portrait at 1024px)

export type LayoutTier = 'mobile' | 'tablet' | 'widescreen';

function getLayoutTier(width: number): LayoutTier {
  if (width <= MOBILE_MAX) return 'mobile';
  if (width <= TABLET_MAX) return 'tablet';
  return 'widescreen';
}

export const useResponsiveLayout = () => {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>(() => {
    if (typeof window !== 'undefined') {
      return getLayoutTier(window.innerWidth);
    }
    return 'mobile';
  });

  const checkWidth = useCallback(() => {
    const newTier = getLayoutTier(window.innerWidth);
    setLayoutTier(prev => prev !== newTier ? newTier : prev);
  }, []);

  useEffect(() => {
    checkWidth();
    
    window.addEventListener('resize', checkWidth);
    window.addEventListener('orientationchange', checkWidth);
    
    return () => {
      window.removeEventListener('resize', checkWidth);
      window.removeEventListener('orientationchange', checkWidth);
    };
  }, [checkWidth]);

  return {
    layoutTier,
    isMobile: layoutTier === 'mobile',
    isTablet: layoutTier === 'tablet',
    isWidescreen: layoutTier === 'widescreen',
    isDesktopOrTablet: layoutTier !== 'mobile',
  };
};

/**
 * @deprecated Use useResponsiveLayout().isMobile instead
 * Kept for backward compatibility
 */
export const useIsMobile = () => {
  const { isMobile } = useResponsiveLayout();
  return isMobile;
};

/**
 * @deprecated Use useResponsiveLayout().isWidescreen instead
 * Kept for backward compatibility - now uses width-only detection
 */
export const useWidescreenAspectRatio = () => {
  const { isWidescreen } = useResponsiveLayout();
  return isWidescreen;
};
