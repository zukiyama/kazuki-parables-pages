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
const WIDESCREEN_ASPECT_RATIO = 1.6; // 16:9 = 1.78, 16:10 = 1.6, iPad 12.9" with browser bar = ~1.52
const ASPECT_RATIO_HYSTERESIS = 0.12; // Prevents flickering on iPad 10.9" landscape (~1.44-1.59 range)

export type LayoutTier = 'mobile' | 'desktop' | 'widescreen';

function getLayoutTier(width: number, height: number, currentTier?: LayoutTier): LayoutTier {
  if (width <= MOBILE_MAX) return 'mobile';
  
  const aspectRatio = width / height;
  
  // Apply hysteresis to prevent flickering when viewport changes slightly (e.g., Safari bar show/hide)
  if (currentTier && currentTier !== 'mobile') {
    if (currentTier === 'widescreen') {
      // Stay widescreen unless aspect ratio drops well below threshold
      if (aspectRatio >= WIDESCREEN_ASPECT_RATIO - ASPECT_RATIO_HYSTERESIS) {
        return 'widescreen';
      }
    } else if (currentTier === 'desktop') {
      // Stay desktop unless aspect ratio rises well above threshold
      if (aspectRatio < WIDESCREEN_ASPECT_RATIO + ASPECT_RATIO_HYSTERESIS) {
        return 'desktop';
      }
    }
  }
  
  // Default behavior for initial load or significant changes
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
    setLayoutTier(prev => {
      const newTier = getLayoutTier(window.innerWidth, window.innerHeight, prev);
      return newTier;
    });
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
