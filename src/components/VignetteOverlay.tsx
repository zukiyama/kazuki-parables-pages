import { useEffect, useRef, useState } from "react";
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

export const VignetteOverlay = ({ activeVignette, sectionRef }: VignetteOverlayProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [displayedVignette, setDisplayedVignette] = useState<string | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track section visibility with IntersectionObserver
  useEffect(() => {
    if (!sectionRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsSectionInView(entry.isIntersecting);
      },
      { threshold: 0.05 } // Trigger when at least 5% visible
    );

    observerRef.current.observe(sectionRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [sectionRef]);

  // Handle dissolve transitions between vignettes
  useEffect(() => {
    // Clear any pending transition
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }

    if (activeVignette && isSectionInView) {
      // Fade in new vignette or dissolve to new one
      if (displayedVignette !== activeVignette) {
        // First fade out current images
        setImageOpacity(0);
        
        // After fade out, switch images and fade in
        transitionTimeoutRef.current = setTimeout(() => {
          setDisplayedVignette(activeVignette);
          setIsVisible(true);
          // Small delay before fade in for smooth transition
          requestAnimationFrame(() => {
            setImageOpacity(1);
          });
        }, 400); // Match the CSS transition duration
      } else {
        // Same vignette, just ensure visible
        setIsVisible(true);
        setImageOpacity(1);
      }
    } else if (!activeVignette) {
      // Fade out when no vignette selected
      setImageOpacity(0);
      transitionTimeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        setDisplayedVignette(null);
      }, 400);
    } else if (!isSectionInView) {
      // Section scrolled away, fade out
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

  // Mask gradients - fade from visible edge inward, with top/bottom fade
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
      id="vignetteOverlay"
      className={`fixed inset-0 pointer-events-none transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ zIndex: 20 }}
      aria-hidden="true"
    >
      {/* Left Vignette - aligned to left edge of screen */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-[90vh] overflow-hidden hidden md:block"
        style={{
          left: 0,
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

      {/* Right Vignette - aligned to right edge of screen */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[90vh] overflow-hidden"
        style={{
          right: 0,
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

  // Use portal to append near end of body
  return createPortal(overlayContent, document.body);
};

export default VignetteOverlay;
