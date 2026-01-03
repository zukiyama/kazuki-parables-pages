import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Responsive layout hook with 3-tier system + hysteresis:
 * 
 * 1. Mobile: width <= 820px (phones, narrow tablets like 10.9" iPad portrait)
 * 2. Desktop: width > 820px AND aspect ratio below thresholds (iPad 12.9" landscape at ~1.33:1)
 * 3. Widescreen: width > 820px AND aspect ratio above thresholds (10.9" iPad landscape, laptops)
 * 
 * Hysteresis prevents flicker from Safari bar changes:
 * - ENTRY threshold: 1.52 (must exceed to ENTER widescreen - 10.9" iPad with bar ~1.55 enters, 12.9" with bar ~1.5 doesn't)
 * - EXIT threshold: 1.38 (must drop below to EXIT widescreen - 10.9" without bar ~1.44 stays in widescreen)
 */

const MOBILE_MAX = 820;
const WIDESCREEN_ENTRY_RATIO = 1.52; // Must exceed this to enter widescreen
const WIDESCREEN_EXIT_RATIO = 1.38;  // Must drop below this to exit widescreen

export type LayoutTier = 'mobile' | 'desktop' | 'widescreen';

export const useResponsiveLayout = () => {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (width <= MOBILE_MAX) return 'mobile';
      const aspectRatio = width / height;
      // On initial load, use entry threshold
      return aspectRatio >= WIDESCREEN_ENTRY_RATIO ? 'widescreen' : 'desktop';
    }
    return 'mobile';
  });
  
  const currentTierRef = useRef(layoutTier);
  currentTierRef.current = layoutTier;

  const checkLayout = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Mobile is width-only (no flicker from Safari bar)
    if (width <= MOBILE_MAX) {
      setLayoutTier(prev => prev !== 'mobile' ? 'mobile' : prev);
      return;
    }
    
    const aspectRatio = width / height;
    const currentTier = currentTierRef.current;
    
    // Hysteresis: different thresholds for entering vs exiting widescreen
    let newTier: LayoutTier;
    if (currentTier === 'widescreen') {
      // Currently widescreen - only exit if ratio drops below EXIT threshold
      newTier = aspectRatio < WIDESCREEN_EXIT_RATIO ? 'desktop' : 'widescreen';
    } else {
      // Currently desktop - only enter widescreen if ratio exceeds ENTRY threshold
      newTier = aspectRatio >= WIDESCREEN_ENTRY_RATIO ? 'widescreen' : 'desktop';
    }
    
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
