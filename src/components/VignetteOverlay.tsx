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
  const observerRef = useRef<IntersectionObserver | null>(null);

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

  // Show overlay when both conditions met: section in view AND a vignette is selected
  useEffect(() => {
    if (isSectionInView && activeVignette) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isSectionInView, activeVignette]);

  const currentImages = activeVignette ? vignetteImages[activeVignette] : null;

  // Common mask gradient styles
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
      {/* Left Vignette */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-1/3 h-[90vh] overflow-hidden hidden md:block"
        style={{
          left: 'clamp(8px, 3vw, 32px)',
          ...leftMaskStyle,
        }}
      >
        {currentImages && (
          <img
            src={currentImages.left}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{
              objectPosition: activeVignette === 'desert' ? '25% center' : 'center right',
              transform: activeVignette === 'desert' ? 'scale(1.15) translateX(2%)' : undefined,
            }}
          />
        )}
      </div>

      {/* Right Vignette */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[90vh] overflow-hidden"
        style={{
          right: 'clamp(8px, 3vw, 32px)',
          ...rightMaskStyle,
        }}
      >
        {currentImages && (
          <img
            src={currentImages.right}
            alt=""
            className="w-full h-full object-cover transition-opacity duration-700"
            style={{
              objectPosition: activeVignette === 'desert' ? '60% center' : 'center left',
              transform: activeVignette === 'desert' ? 'scale(1.15) translateX(-2%)' : undefined,
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
