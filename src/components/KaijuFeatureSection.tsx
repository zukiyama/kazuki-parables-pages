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

const KAIJU_BLURB = `When a foreign object crashes from the sky in Osaka, Japan, and a strange figure steps from the wreckage, psychiatrist Shigemitsu is enlisted by the military to draw on what he remembers of a man he hasn't thought of in twenty years. For Kenji, new to nearby Nakamura, all that matters is not being the only kid sitting alone in class. He soon finds himself friends with Masako, Kubo and a group of misfits, who realise that they each share a secret, and begin to suspect the town is not all it seems. Hinata Togawa, a policewoman relegated to a dead-end posting at a remote local station, is resigned to an uneventful career. But when a seemingly minor disappearance leads to a trail of unexplained vanishings and deepening corruption, she is forced to confront something far closer to home — and far more dangerous — than she ever imagined.`;

export const KaijuFeatureSection = ({ isWidescreen, visibleSections }: KaijuFeatureSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const whiteOverlayRef = useRef<HTMLDivElement>(null);
  const vignetteTopRef = useRef<HTMLDivElement>(null);
  const vignetteBottomRef = useRef<HTMLDivElement>(null);
  const blurbContainerRef = useRef<HTMLDivElement>(null);
  const [isFeatureActive, setIsFeatureActive] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showBlurb, setShowBlurb] = useState(false);
  const typewriterRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect
  const startTypewriter = useCallback(() => {
    if (typewriterRef.current) clearTimeout(typewriterRef.current);
    setTypedText("");
    setShowBlurb(true);
    
    let index = 0;
    const typeNextChar = () => {
      if (index < KAIJU_BLURB.length) {
        setTypedText(KAIJU_BLURB.slice(0, index + 1));
        index++;
        // Fast typewriter - 8ms per character
        typewriterRef.current = setTimeout(typeNextChar, 8);
      }
    };
    // Start after a small delay for the layout to settle
    typewriterRef.current = setTimeout(typeNextChar, 400);
  }, []);

  const stopTypewriter = useCallback(() => {
    if (typewriterRef.current) {
      clearTimeout(typewriterRef.current);
      typewriterRef.current = null;
    }
    setShowBlurb(false);
    setTypedText("");
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

    if (!section || !trigger || !cover || !whiteOverlay || !vignetteTop || !vignetteBottom) return;

    // Set initial states
    gsap.set(whiteOverlay, { scaleX: 0, transformOrigin: "left center" });
    gsap.set(cover, { x: 0, scale: 1 });
    gsap.set(vignetteTop, { x: "100%", opacity: 0 });
    gsap.set(vignetteBottom, { x: "100%", opacity: 0 });

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
          startTypewriter();
        },
        onLeave: () => {
          setIsFeatureActive(false);
          stopTypewriter();
        },
        onEnterBack: () => {
          setIsFeatureActive(true);
          startTypewriter();
        },
        onLeaveBack: () => {
          setIsFeatureActive(false);
          stopTypewriter();
        },
      },
    });

    // Animation sequence
    // 1. White wipe sweeps across (0 to 0.3)
    tl.to(whiteOverlay, {
      scaleX: 1,
      duration: 0.3,
      ease: "power2.inOut",
    }, 0);

    // 2. Cover moves left and scales down (0.1 to 0.4)
    tl.to(cover, {
      x: "-25vw",
      scale: 0.85,
      duration: 0.3,
      ease: "power2.out",
    }, 0.1);

    // 3. Vignettes slide in from right (0.2 to 0.5)
    tl.to(vignetteTop, {
      x: "0%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0.2);

    tl.to(vignetteBottom, {
      x: "0%",
      opacity: 1,
      duration: 0.3,
      ease: "power2.out",
    }, 0.25);

    // Hold at feature state (0.5 to 0.7)
    // The blurb typewriter happens during this hold via React state

    // Exit sequence (0.7 to 1.0)
    // Vignettes slide out
    tl.to([vignetteTop, vignetteBottom], {
      x: "100%",
      opacity: 0,
      duration: 0.15,
      ease: "power2.in",
    }, 0.7);

    // Cover returns to center
    tl.to(cover, {
      x: 0,
      scale: 1,
      duration: 0.15,
      ease: "power2.out",
    }, 0.75);

    // White wipe reverses
    tl.to(whiteOverlay, {
      scaleX: 0,
      duration: 0.15,
      ease: "power2.inOut",
    }, 0.85);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      stopTypewriter();
    };
  }, [startTypewriter, stopTypewriter]);

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
        className={`relative flex items-center justify-center overflow-hidden ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}
        style={{ height: '100vh' }}
      >
        {/* White wipe overlay */}
        <div 
          ref={whiteOverlayRef}
          className="absolute inset-0 bg-white z-10 pointer-events-none"
          style={{ transformOrigin: "left center" }}
        />

        {/* Main content container */}
        <div className="container mx-auto px-6 py-12 relative z-20">
          <div className="max-w-6xl mx-auto">
            {/* Cover container - centered by default, animated to left */}
            <div 
              ref={coverRef}
              className="flex flex-col items-center justify-center"
              style={{ willChange: 'transform' }}
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
              <p className={`font-serif leading-relaxed text-white italic text-center mt-8 max-w-2xl transition-opacity duration-500 ${
                isWidescreen ? 'text-lg' : 'text-xl'
              } ${isFeatureActive ? 'opacity-0' : 'opacity-100'}`}>
                Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three people in a 1979 that happened only for those who were there.
              </p>
            </div>
          </div>
        </div>

        {/* Blurb container - appears during feature state */}
        <div 
          ref={blurbContainerRef}
          className={`absolute z-30 transition-opacity duration-500 ${
            showBlurb ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 'clamp(280px, 35vw, 450px)',
            maxHeight: '70vh',
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-gray-200">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">KAIJU</h2>
            <h3 className="font-serif text-sm text-amber-700 uppercase tracking-widest mb-6">
              Book One of The Parable Trilogy
            </h3>
            <div className="font-serif text-sm text-gray-800 leading-relaxed overflow-hidden">
              <span className="kaiju-typewriter">{typedText}</span>
              <span className={`inline-block w-0.5 h-4 bg-gray-800 ml-0.5 ${showBlurb ? 'animate-blink' : ''}`} />
            </div>
          </div>
        </div>

        {/* Top-right vignette - full bleed corner */}
        <div 
          ref={vignetteTopRef}
          className="absolute top-0 right-0 z-20 pointer-events-none"
          style={{ 
            width: 'clamp(200px, 28vw, 380px)',
            height: 'clamp(150px, 22vh, 280px)',
          }}
        >
          <img 
            src={kaijuVignetteTop}
            alt=""
            className="w-full h-full object-cover object-left-bottom"
            style={{
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to top, black 60%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>

        {/* Bottom-right vignette - full bleed corner */}
        <div 
          ref={vignetteBottomRef}
          className="absolute bottom-0 right-0 z-20 pointer-events-none"
          style={{ 
            width: 'clamp(180px, 25vw, 340px)',
            height: 'clamp(140px, 20vh, 260px)',
          }}
        >
          <img 
            src={kaijuVignetteBottom}
            alt=""
            className="w-full h-full object-cover object-left-top"
            style={{
              maskImage: 'linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%), linear-gradient(to bottom, black 60%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in',
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default KaijuFeatureSection;
