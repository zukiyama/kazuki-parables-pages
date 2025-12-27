import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookCoverSlideshow } from "@/components/BookCoverSlideshow";
import kaijuCover from "@/assets/kaiju-cover-new.jpg";
import kaijuVignetteTop from "@/assets/kaiju-vignette-top.png";
import kaijuVignetteBottom from "@/assets/kaiju-vignette-bottom.png";

gsap.registerPlugin(ScrollTrigger);

interface KaijuFeatureSectionProps {
  isWidescreen: boolean;
  visibleSections: Set<string>;
}

// Split blurb into paragraphs for line-by-line reveal
const KAIJU_PARAGRAPHS = [
  "When a foreign object crashes from the sky in Osaka, Japan, and a strange figure steps from the wreckage, psychiatrist Shigemitsu is enlisted by the military to draw on what he remembers of a man he hasn't thought of in twenty years.",
  "For Kenji, new to nearby Nakamura, all that matters is not being the only kid sitting alone in class. He soon finds himself friends with Masako, Kubo and a group of misfits, who realise that they each share a secret, and begin to suspect the town is not all it seems.",
  "Hinata Togawa, a policewoman relegated to a dead-end posting at a remote local station, is resigned to an uneventful career. But when a seemingly minor disappearance leads to a trail of unexplained vanishings and deepening corruption, she is forced to confront something far closer to home — and far more dangerous — than she ever imagined."
];

export const KaijuFeatureSection = ({ isWidescreen, visibleSections }: KaijuFeatureSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const vignetteTopRef = useRef<HTMLDivElement>(null);
  const vignetteBottomRef = useRef<HTMLDivElement>(null);
  const blurbRef = useRef<HTMLDivElement>(null);
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [visibleParagraphs, setVisibleParagraphs] = useState<number[]>([]);
  const [showBlurb, setShowBlurb] = useState(false);
  const paragraphTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Line-by-line paragraph reveal effect
  const startParagraphReveal = useCallback(() => {
    if (paragraphTimerRef.current) clearTimeout(paragraphTimerRef.current);
    setVisibleParagraphs([]);
    setShowBlurb(true);
    
    let index = 0;
    const revealNext = () => {
      if (index < KAIJU_PARAGRAPHS.length) {
        setVisibleParagraphs(prev => [...prev, index]);
        index++;
        // Fast reveal - 300ms between paragraphs
        paragraphTimerRef.current = setTimeout(revealNext, 300);
      }
    };
    // Start after a small delay
    paragraphTimerRef.current = setTimeout(revealNext, 200);
  }, []);

  const stopParagraphReveal = useCallback(() => {
    if (paragraphTimerRef.current) {
      clearTimeout(paragraphTimerRef.current);
      paragraphTimerRef.current = null;
    }
    setShowBlurb(false);
    setVisibleParagraphs([]);
  }, []);

  useEffect(() => {
    // Only run GSAP on desktop
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const cover = coverRef.current;
    const whiteOverlay = whiteOverlayRef.current;
    const vignetteTop = vignetteTopRef.current;
    const vignetteBottom = vignetteBottomRef.current;
    const blurb = blurbRef.current;

    if (!section || !trigger || !cover || !whiteOverlay || !vignetteTop || !vignetteBottom || !blurb) return;

    // Set initial states - white overlay starts invisible with 0 opacity
    gsap.set(whiteOverlay, { opacity: 0, x: "-100%" });
    gsap.set(cover, { x: 0, scale: 1 });
    gsap.set(vignetteTop, { x: "100%", opacity: 0 });
    gsap.set(vignetteBottom, { x: "100%", opacity: 0 });
    gsap.set(blurb, { opacity: 0 });

    // Create the main ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: "top 60%",
        end: "bottom 20%",
        scrub: 0.5,
        pin: section,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: () => {
          setIsFeatureActive(true);
          startParagraphReveal();
        },
        onLeave: () => {
          setIsFeatureActive(false);
          stopParagraphReveal();
        },
        onEnterBack: () => {
          setIsFeatureActive(true);
          startParagraphReveal();
        },
        onLeaveBack: () => {
          setIsFeatureActive(false);
          stopParagraphReveal();
        },
      },
    });

    // Animation sequence
    // 1. White overlay fades in while sliding across (gradient wipe effect)
    tl.to(whiteOverlay, {
      opacity: 1,
      x: "0%",
      duration: 0.35,
      ease: "power2.out",
    }, 0);

    // 2. Cover moves left and scales down (slightly delayed)
    tl.to(cover, {
      x: "-28vw",
      scale: 0.82,
      duration: 0.3,
      ease: "power2.out",
    }, 0.05);

    // 3. Vignettes slide in from right
    tl.to(vignetteTop, {
      x: "0%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0.15);

    tl.to(vignetteBottom, {
      x: "0%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0.2);

    // 4. Blurb fades in
    tl.to(blurb, {
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    }, 0.25);

    // Hold at feature state (0.5 to 0.7)

    // Exit sequence (0.7 to 1.0)
    // Blurb fades out
    tl.to(blurb, {
      opacity: 0,
      duration: 0.1,
      ease: "power2.in",
    }, 0.7);

    // Vignettes slide out
    tl.to([vignetteTop, vignetteBottom], {
      x: "100%",
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
    }, 0.72);

    // Cover returns to center
    tl.to(cover, {
      x: 0,
      scale: 1,
      duration: 0.15,
      ease: "power2.out",
    }, 0.78);

    // White overlay fades out while sliding away
    tl.to(whiteOverlay, {
      opacity: 0,
      x: "100%",
      duration: 0.2,
      ease: "power2.inOut",
    }, 0.82);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      stopParagraphReveal();
    };
  }, [startParagraphReveal, stopParagraphReveal]);

  // Mobile/tablet fallback - simpler layout without GSAP
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  if (isMobile) {
    return (
      <section data-section="kaiju" className="flex items-center justify-center relative min-h-[80vh]">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Centered cover for mobile */}
            <div className={`flex flex-col items-center transition-all duration-1000 delay-300 ${
              visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <BookCoverSlideshow 
                covers={[{ image: kaijuCover, alt: "KAIJU - Book One Cover" }]}
                title="KAIJU"
                loading="eager"
                isWidescreen={isWidescreen}
              />
              <p className={`font-serif leading-relaxed text-white italic text-center mt-8 max-w-2xl ${
                isWidescreen ? 'text-lg' : 'text-xl'
              }`}>
                Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three people in a 1979 that happened only for those who were there.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div ref={triggerRef} className="relative">
      <section 
        ref={sectionRef}
        data-section="kaiju" 
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: '100vh', width: '100vw' }}
      >
        {/* White wipe overlay with gradient fade edge - fills exact viewport */}
        <div 
          ref={whiteOverlayRef}
          className="fixed inset-0 pointer-events-none z-10"
          style={{ 
            background: 'linear-gradient(to right, white 85%, transparent 100%)',
            top: 0,
            left: 0,
            width: '120vw',
            height: '100vh',
          }}
        />

        {/* Main content container - positioned relative to viewport */}
        <div className="fixed inset-0 z-20 pointer-events-none" style={{ top: 0, left: 0, width: '100vw', height: '100vh' }}>
          {/* Cover container - centered vertically, positioned left */}
          <div 
            ref={coverRef}
            className="absolute flex items-center justify-center pointer-events-auto"
            style={{ 
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform' 
            }}
          >
            <div className={`transition-all duration-1000 delay-300 ${
              visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <BookCoverSlideshow 
                covers={[{ image: kaijuCover, alt: "KAIJU - Book One Cover" }]}
                title="KAIJU"
                loading="eager"
                isWidescreen={isWidescreen}
              />
            </div>
            
            {/* Summary line - visible in normal state, hidden in feature state */}
            <p className={`absolute -bottom-16 left-1/2 -translate-x-1/2 font-serif leading-relaxed text-white italic text-center whitespace-nowrap transition-opacity duration-500 ${
              isWidescreen ? 'text-lg' : 'text-xl'
            } ${isFeatureActive ? 'opacity-0' : 'opacity-100'}`}>
              Part coming of age, part mystery, and part supernatural drama
            </p>
          </div>

          {/* Magazine-style blurb - printed directly on white background */}
          <div 
            ref={blurbRef}
            className={`absolute pointer-events-auto ${showBlurb ? '' : 'pointer-events-none'}`}
            style={{
              top: '50%',
              left: '52%',
              transform: 'translateY(-50%)',
              width: 'clamp(320px, 32vw, 480px)',
              maxHeight: '75vh',
              paddingRight: '2rem',
            }}
          >
            {/* Elegant magazine title */}
            <h2 
              className="font-serif font-bold mb-1 tracking-tight"
              style={{ 
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                color: '#2d3748', // Elegant dark slate
                letterSpacing: '-0.02em',
              }}
            >
              KAIJU
            </h2>
            <h3 
              className="font-serif uppercase tracking-[0.25em] mb-8"
              style={{ 
                fontSize: 'clamp(0.65rem, 0.9vw, 0.85rem)',
                color: '#8b6914', // Warm amber/gold
              }}
            >
              Book One of The Parable Trilogy
            </h3>
            
            {/* Paragraphs with line-by-line reveal */}
            <div className="space-y-5">
              {KAIJU_PARAGRAPHS.map((paragraph, index) => (
                <p 
                  key={index}
                  className="font-serif leading-relaxed transition-all duration-500"
                  style={{ 
                    fontSize: 'clamp(0.85rem, 1.1vw, 1rem)',
                    color: '#374151',
                    lineHeight: '1.75',
                    opacity: visibleParagraphs.includes(index) ? 1 : 0,
                    transform: visibleParagraphs.includes(index) ? 'translateY(0)' : 'translateY(8px)',
                  }}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Top-right vignette - flush to viewport corner */}
          <div 
            ref={vignetteTopRef}
            className="absolute pointer-events-none"
            style={{ 
              top: 0,
              right: 0,
              width: 'clamp(220px, 30vw, 420px)',
              height: 'clamp(160px, 28vh, 320px)',
            }}
          >
            <img 
              src={kaijuVignetteTop}
              alt=""
              className="w-full h-full object-cover object-left-bottom"
              style={{
                maskImage: 'linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to top, black 50%, transparent 95%)',
                WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to top, black 50%, transparent 95%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
            />
          </div>

          {/* Bottom-right vignette - flush to viewport corner */}
          <div 
            ref={vignetteBottomRef}
            className="absolute pointer-events-none"
            style={{ 
              bottom: 0,
              right: 0,
              width: 'clamp(200px, 28vw, 380px)',
              height: 'clamp(150px, 26vh, 300px)',
            }}
          >
            <img 
              src={kaijuVignetteBottom}
              alt=""
              className="w-full h-full object-cover object-left-top"
              style={{
                maskImage: 'linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to bottom, black 50%, transparent 95%)',
                WebkitMaskImage: 'linear-gradient(to left, black 50%, transparent 95%), linear-gradient(to bottom, black 50%, transparent 95%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'source-in',
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default KaijuFeatureSection;
