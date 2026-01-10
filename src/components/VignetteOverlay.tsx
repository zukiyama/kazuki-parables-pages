import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

// Vignette images
import vignetteDesertLeftAlt from "@/assets/vignette-desert-left-alt.jpeg";
import vignetteDesertRightEdited from "@/assets/vignette-desert-right-edited.jpeg";
import vignetteLightsLeft from "@/assets/vignette-lights-left.png";
import vignetteLightsRight from "@/assets/vignette-lights-right.png";
import vignetteFasterLeft from "@/assets/vignette-faster-left.png";
import vignetteFasterRight from "@/assets/vignette-faster-right.png";
import vignettePlasticLeft from "@/assets/vignette-threeqs-left.png";
import vignettePlasticRight from "@/assets/vignette-threeqs-right.png";
import vignetteRevisionsLeft from "@/assets/vignette-revisions-left.png";
import vignetteRevisionsRight from "@/assets/vignette-revisions-right.png";
import vignetteSyphonsLeft from "@/assets/vignette-syphons-left.png";
import vignetteSyphonsRight from "@/assets/vignette-syphons-right.png";

interface VignetteOverlayProps {
  activeVignette: string | null;
  sectionRef: React.RefObject<HTMLElement>;
}

const vignetteImages: Record<string, { left: string; right: string }> = {
  desert: { left: vignetteDesertLeftAlt, right: vignetteDesertRightEdited },
  elephant: { left: vignetteLightsLeft, right: vignetteLightsRight },
  faster: { left: vignetteFasterLeft, right: vignetteFasterRight },
  plastic: { left: vignettePlasticLeft, right: vignettePlasticRight },
  revisions: { left: vignetteRevisionsLeft, right: vignetteRevisionsRight },
  syphons: { left: vignetteSyphonsLeft, right: vignetteSyphonsRight },
};

// Hysteresis constants - only for vignette overlay
const HYSTERESIS_PX = 32;
const SETTLE_MS = 140;

export const VignetteOverlay = ({ activeVignette, sectionRef }: VignetteOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [displayedVignette, setDisplayedVignette] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0);
  const [stableCenterY, setStableCenterY] = useState<number | null>(null);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const settleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  // Compute current viewport center (overlay-specific)
  const computeViewportCenter = useCallback(() => {
    const vv = window.visualViewport;
    if (vv) {
      return vv.offsetTop + vv.height / 2;
    }
    return window.innerHeight / 2;
  }, []);

  // Apply center Y to overlay via CSS variable
  const applyCenterY = useCallback((centerY: number) => {
    if (overlayRef.current) {
      overlayRef.current.style.setProperty('--vv-center-y', `${centerY}px`);
    }
  }, []);

  // Hysteresis update logic - only affects vignette overlay
  const updateStableCenterY = useCallback((immediate = false) => {
    const currentCenter = computeViewportCenter();
    
    setStableCenterY(prevStable => {
      // First time or immediate update
      if (prevStable === null || immediate) {
        applyCenterY(currentCenter);
        return currentCenter;
      }
      
      // Only update if change exceeds hysteresis threshold
      if (Math.abs(currentCenter - prevStable) > HYSTERESIS_PX) {
        applyCenterY(currentCenter);
        return currentCenter;
      }
      
      // Keep stable, don't update
      return prevStable;
    });
  }, [computeViewportCenter, applyCenterY]);

  // Debounced settle - catches up after browser bars finish animating
  const scheduleSettle = useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
    }
    settleTimerRef.current = setTimeout(() => {
      updateStableCenterY(true); // Force update after settle
    }, SETTLE_MS);
  }, [updateStableCenterY]);

  // Handle viewport/scroll events for hysteresis
  useEffect(() => {
    const handleViewportChange = () => {
      updateStableCenterY(false);
      scheduleSettle();
    };

    // Initialize stable center
    updateStableCenterY(true);

    // Listen to visualViewport events (crucial for iOS Safari)
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener('resize', handleViewportChange);
      vv.addEventListener('scroll', handleViewportChange);
    }
    
    // Fallback scroll listener
    window.addEventListener('scroll', handleViewportChange, { passive: true });
    window.addEventListener('resize', handleViewportChange, { passive: true });

    return () => {
      if (vv) {
        vv.removeEventListener('resize', handleViewportChange);
        vv.removeEventListener('scroll', handleViewportChange);
      }
      window.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
      if (settleTimerRef.current) {
        clearTimeout(settleTimerRef.current);
      }
    };
  }, [updateStableCenterY, scheduleSettle]);

  // Track section visibility with IntersectionObserver
  useEffect(() => {
    if (!sectionRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observerRef.current.observe(sectionRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionRef]);

  // Handle dissolve transitions between vignettes
  useEffect(() => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (activeVignette && isSectionInView) {
      if (displayedVignette !== activeVignette) {
        setImageOpacity(0);
        
        transitionTimeoutRef.current = setTimeout(() => {
          setDisplayedVignette(activeVignette);
          setIsVisible(true);
          requestAnimationFrame(() => {
            setImageOpacity(1);
          });
        }, 400);
      } else {
        setIsVisible(true);
        setImageOpacity(1);
      }
    } else if (!activeVignette) {
      setImageOpacity(0);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setDisplayedVignette(null);
      }, 400);
    } else if (!isSectionInView) {
      setImageOpacity(0);
      setIsVisible(false);
    }

    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, [activeVignette, isSectionInView, displayedVignette]);

  const currentImages = displayedVignette ? vignetteImages[displayedVignette] : null;

  // Mask gradients
  const leftMaskStyle = {
    maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
    maskComposite: 'intersect' as const,
    WebkitMaskComposite: 'source-in' as const,
  };

  const rightMaskStyle = {
    maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
    WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
    maskComposite: 'intersect' as const,
    WebkitMaskComposite: 'source-in' as const,
  };

  const overlayContent = (
    <div
      ref={overlayRef}
      id="vignetteOverlay"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        zIndex: 20,
        // CSS variable for hysteresis-controlled center, fallback to 50vh
        '--vv-center-y': stableCenterY !== null ? `${stableCenterY}px` : '50vh',
      } as React.CSSProperties}
      aria-hidden="true"
    >
      {/* Left Vignette - uses hysteresis center */}
      <div
        className="absolute left-0 w-1/3 h-[90vh] overflow-hidden hidden md:block"
        style={{
          left: 0,
          top: 'var(--vv-center-y)',
          transform: 'translateY(-50%)',
          ...leftMaskStyle,
        }}
      >
        {currentImages && (
          <img
            src={currentImages.left}
            alt=""
            className="w-full h-full object-cover"
            style={{
              opacity: imageOpacity,
              transition: 'opacity 400ms ease-in-out',
              objectPosition: displayedVignette === 'desert' ? '25% center' : 'center right',
              transform: displayedVignette === 'desert' ? 'scale(1.15) translateX(2%)' : undefined,
            }}
          />
        )}
      </div>

      {/* Right Vignette - uses hysteresis center */}
      <div
        className="absolute right-0 w-1/3 h-[90vh] overflow-hidden"
        style={{
          right: 0,
          top: 'var(--vv-center-y)',
          transform: 'translateY(-50%)',
          ...rightMaskStyle,
        }}
      >
        {currentImages && (
          <img
            src={currentImages.right}
            alt=""
            className="w-full h-full object-cover"
            style={{
              opacity: imageOpacity,
              transition: 'opacity 400ms ease-in-out',
              objectPosition: displayedVignette === 'desert' ? '60% center' : 'center left',
              transform: displayedVignette === 'desert' ? 'scale(1.15) translateX(-2%)' : undefined,
            }}
          />
        )}
      </div>
    </div>
  );

  return createPortal(overlayContent, document.body);
};

export default VignetteOverlay;
