import { useState, useEffect, useCallback } from 'react';

/**
 * Stable 4-mode responsive system that never flickers with Safari's address bar.
 * Uses device class + width + orientation only - NO height or aspect ratio.
 * 
 * Modes:
 * 1. mobile - Phones (width <= 820px, non-iPad)
 * 2. ipadPortraitMobile - iPad 10.9" portrait (narrow iPad portrait, mobile-ish layout)
 * 3. desktop - iPad 12.9" (both orientations) + iPad 10.9" landscape (tablet layout)
 * 4. widescreen - Laptops/desktops (width >= 1280px, non-iPad)
 */

// Width thresholds (stable, don't change with Safari bars)
const MOBILE_MAX = 820;
const WIDESCREEN_MIN = 1280;

// iPad 10.9" portrait width is ~820px, iPad 12.9" portrait is ~1024px
// Use 900px to catch 10.9" portrait but not 12.9" portrait
const IPAD_NARROW_PORTRAIT_MAX = 900;

export type LayoutTier = 'mobile' | 'ipadPortraitMobile' | 'desktop' | 'widescreen';

// Detect iPad once on load - this is stable and won't change
function detectIsIPad(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  // iPadOS 13+ reports as "MacIntel" but has touch support
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  const isLegacyIPad = navigator.platform === 'iPad';
  
  return isIPadOS || isLegacyIPad;
}

// Cache iPad detection result
let cachedIsIPad: boolean | null = null;

function getIsIPad(): boolean {
  if (cachedIsIPad === null) {
    cachedIsIPad = detectIsIPad();
  }
  return cachedIsIPad;
}

// Set data-device attribute on html element for CSS targeting
function setDeviceAttribute(): void {
  if (typeof document === 'undefined') return;
  
  const isIPad = getIsIPad();
  if (isIPad) {
    document.documentElement.setAttribute('data-device', 'ipad');
  }
}

// Get orientation without using height (uses screen.orientation or width comparison)
function isPortraitOrientation(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Use screen.orientation API if available (most reliable)
  if (screen.orientation?.type) {
    return screen.orientation.type.includes('portrait');
  }
  
  // Fallback: compare screen dimensions (not viewport - stable)
  if (typeof screen !== 'undefined') {
    return screen.width < screen.height;
  }
  
  return false;
}

function getLayoutTier(width: number): LayoutTier {
  const isIPad = getIsIPad();
  
  if (isIPad) {
    // iPad-specific logic using width + orientation only
    const isPortrait = isPortraitOrientation();
    
    if (isPortrait && width <= IPAD_NARROW_PORTRAIT_MAX) {
      // iPad 10.9" portrait -> mobile-ish layout
      return 'ipadPortraitMobile';
    }
    
    // All other iPad scenarios (12.9" any orientation, 10.9" landscape) -> tablet/desktop
    return 'desktop';
  }
  
  // Non-iPad devices: simple width-based detection
  if (width <= MOBILE_MAX) {
    return 'mobile';
  }
  
  if (width >= WIDESCREEN_MIN) {
    return 'widescreen';
  }
  
  // Between 821-1279px on non-iPad -> desktop (desktop-lite)
  return 'desktop';
}

export const useResponsiveLayout = () => {
  const [layoutTier, setLayoutTier] = useState<LayoutTier>(() => {
    if (typeof window !== 'undefined') {
      setDeviceAttribute(); // Set once on init
      return getLayoutTier(window.innerWidth);
    }
    return 'mobile';
  });

  const checkLayout = useCallback(() => {
    const newTier = getLayoutTier(window.innerWidth);
    setLayoutTier(prev => prev !== newTier ? newTier : prev);
  }, []);

  useEffect(() => {
    setDeviceAttribute(); // Ensure attribute is set
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
    isMobile: layoutTier === 'mobile' || layoutTier === 'ipadPortraitMobile',
    isDesktop: layoutTier === 'desktop',
    isWidescreen: layoutTier === 'widescreen',
    isDesktopOrWidescreen: layoutTier === 'desktop' || layoutTier === 'widescreen',
    isIPad: getIsIPad(),
    isIPadPortraitMobile: layoutTier === 'ipadPortraitMobile',
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
 */
export const useWidescreenAspectRatio = () => {
  const { isWidescreen } = useResponsiveLayout();
  return isWidescreen;
};
