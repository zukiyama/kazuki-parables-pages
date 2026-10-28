import React from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";

// Above-the-fold assets - loaded eagerly with high priority
import artistPortrait from "@/assets/about-portrait-postcard.png";
import writerBackground from "@/assets/about-writer-background.jpeg.asset.json";

// Below-the-fold assets - lazy loaded
import backgroundSphere from "@/assets/about-background-new.webp";
import cityscapeAerial from "@/assets/about-cityscape-aerial.webp";
import childPortrait from "@/assets/about-child-portrait.webp";
import surrealCat from "@/assets/about-surreal-cat.png";
type CrumbleLineProps = {
  children: string;
  className?: string;
  offset: number;
  active: boolean;
  baseDelay?: number;
};

const CrumbleLine = ({ children, className = "", offset, active, baseDelay = 3000 }: CrumbleLineProps) => {
  // Keep the text as a single, natively rendered run (crisp kerning, ligatures and
  // italic overhang) until the moment it actually needs to fall apart.
  const [split, setSplit] = React.useState(false);

  React.useEffect(() => {
    if (!active) {
      setSplit(false);
      return;
    }
    const splitTimer = setTimeout(() => setSplit(true), Math.max(0, baseDelay - 150));
    return () => clearTimeout(splitTimer);
  }, [active, baseDelay]);

  if (!split) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className}>
      {Array.from(children).map((character, index) => {
        const characterIndex = offset + index;
        const horizontalDistance = ((characterIndex * 47) % 181) - 90;
        const initialDrop = 4 + ((characterIndex * 19) % 24);
        const rotation = ((characterIndex * 73) % 241) - 120;
        const delay = 150 + ((characterIndex * 41) % 420);
        const duration = 2600 + ((characterIndex * 29) % 900);

        return (
          <span
            key={`${characterIndex}-${character}`}
            aria-hidden="true"
            className="about-quote-character about-quote-character--falling"
            style={{
              "--crumble-x": `${horizontalDistance}px`,
              "--crumble-y": `${initialDrop}px`,
              "--crumble-rotation": `${rotation}deg`,
              "--crumble-delay": `${delay}ms`,
              "--crumble-duration": `${duration}ms`,
            } as React.CSSProperties}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        );
      })}
    </span>
  );
};


const StampPortrait = ({ className }: { className: string }) => (
  <div className={`relative rotate-[-3deg] ${className}`}>
    <img
      src={artistPortrait}
      alt="Kazuki Yamakawa wearing a hat in a vintage postage-stamp frame"
      width={1254}
      height={1254}
      loading="eager"
      decoding="async"
      className="block h-full w-full object-contain drop-shadow-2xl"
    />
  </div>
);

const About = () => {
  useScrollToTop();
  const visibleElements = useScrollAnimation();
  const [showCityscape, setShowCityscape] = React.useState(false);
  const [showCat, setShowCat] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const [belowFoldVisible, setBelowFoldVisible] = React.useState(false);
  const [heroBackgroundReady, setHeroBackgroundReady] = React.useState(false);
  const belowFoldRef = React.useRef<HTMLDivElement>(null);

  // Measure header height on mount and orientation change
  React.useEffect(() => {
    const measureHeader = () => {
      const header = document.querySelector('[data-header="true"]');
      if (header) {
        const height = header.getBoundingClientRect().height;
        setHeaderHeight(height);
      }
    };

    measureHeader();
    window.addEventListener('resize', measureHeader);
    window.addEventListener('orientationchange', measureHeader);
    
    return () => {
      window.removeEventListener('resize', measureHeader);
      window.removeEventListener('orientationchange', measureHeader);
    };
  }, []);

  // Lazy load below-fold images with IntersectionObserver
  React.useEffect(() => {
    if (!belowFoldRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setBelowFoldVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '800px' } // Start loading 800px before visible
    );
    
    observer.observe(belowFoldRef.current);
    return () => observer.disconnect();
  }, []);

  // Decode the opening photograph before revealing it.
  React.useEffect(() => {
    const img = new Image();
    img.onload = async () => {
      try {
        await img.decode();
      } catch (e) {
        // Fallback if decode fails
      } finally {
        setHeroBackgroundReady(true);
      }
    };
    img.onerror = () => {
      setHeroBackgroundReady(true);
    };
    img.src = writerBackground.url;
  }, []);

  // Reveal the cityscape (and the cat fading with it) once the lower artwork
  // section actually enters the viewport - reliable in any window size or tab.
  React.useEffect(() => {
    if (showCityscape) return;
    const target = belowFoldRef.current;
    if (!target) return;

    let revealTimer: ReturnType<typeof setTimeout> | undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          revealTimer = setTimeout(() => setShowCityscape(true), 300);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(target);
    return () => {
      observer.disconnect();
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, [showCityscape]);

  const quoteSequenceActive = visibleElements.has("second-quote");

  // Begin the cat fade at the exact moment both quotations start crumbling.
  React.useEffect(() => {
    if (!quoteSequenceActive || showCat) return;

    const catFadeTimer = setTimeout(() => setShowCat(true), 8000);
    return () => clearTimeout(catFadeTimer);
  }, [quoteSequenceActive, showCat]);

  
  return (
    <div className="min-h-screen-stable bg-neutral-100">
      <Navigation />
      
      <section className="about-writer-hero" style={{ paddingTop: headerHeight }}>
        <div className="about-writer-stage">
          <div className="about-writer-artwork">
            <img
              src={writerBackground.url}
              alt="An overhead view of a writer at a typewriter, framed by the sound hole of a guitar"
              width={1711}
              height={768}
              loading="eager"
              decoding="async"
              {...{ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>}
              className={`about-writer-background ${heroBackgroundReady ? "is-ready" : ""}`}
            />
          </div>
          <div className="about-writer-copy">
            <p className="about-writer-eyebrow">Author · Composer</p>
            <h1>Kazuki<br /><span>Yamakawa</span></h1>
            <p className="about-writer-deck">A multi-disciplinary artist working in literature, music and visual storytelling.</p>
            <div className="about-writer-biography">
              <p>Previously a writer in the Korean games industry, Kazuki decided in his thirties to pursue the work that is his lifelong vocation.</p>
              <p>Treating metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human.</p>
              <p>The best way to get to know his music is to head over to the <Link to="/music">music page</Link>.</p>
            </div>
          </div>
          <StampPortrait className="about-writer-portrait aspect-square" />
        </div>
      </section>
      
      {/* Dark Quote Section - First Quote Only */}
      <div className="relative z-20 -mt-20">
        <div className="bg-neutral-900 pt-12 pb-8 px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <blockquote className="relative">
              <span className="absolute -top-6 -left-4 text-8xl text-white/20 font-serif">"</span>
              {/* Mobile phone version - shorter quote */}
              <p className="font-body text-lg text-white/90 leading-relaxed italic sm:hidden">
                If it weren't for the hours I wasted burying action figures and reading comics behind the monitor on my desk; if I had spent the summer revising rather than learning to hold an A Major on a battered old nylon-strung guitar—in short, if I hadn't traded what I should be doing for what I love, I should never have found this hapless grove in which I am so brightly sustained.
              </p>
              {/* Tablet and desktop version - full quote */}
              <p className="font-body hidden sm:block text-xl lg:text-2xl text-white/90 leading-relaxed italic">
                If it weren't for the hours I wasted burying action figures and reading comics behind the monitor on my desk; if I had spent the summer revising rather than learning to hold an A Major on a battered old nylon-strung guitar—in short, if I hadn't traded what I should be doing for what I love, I should never have found this hapless grove in which I am so brightly sustained.
              </p>
            </blockquote>
          </div>
        </div>
        {/* Short gradient fade from black to transparent - hidden on mobile phone */}
        <div className="h-16 bg-gradient-to-b from-neutral-900 to-transparent max-sm:hidden" />
      </div>
      
      {/* Background Image Section from Original About - pulled up, no gap on mobile */}
      <div ref={belowFoldRef} className="relative z-10 -mt-8 max-sm:mt-0">
        <div 
          data-scroll-animation="background-image"
          className={`relative pointer-events-none overflow-hidden scroll-fade-plain ${visibleElements.has("background-image") ? "visible" : ""}`}
        >
          {/* Cityscape layer behind everything - tablet and desktop - lazy loaded */}
          <div 
            className={`absolute inset-0 hidden sm:block z-0 ${showCityscape ? 'animate-cityscape-fade-in' : 'opacity-0'}`}
            style={{ animationDuration: '10s', animationFillMode: 'forwards' }}
          >
            {belowFoldVisible && (
              <img
                src={cityscapeAerial}
                alt=""
                width={2560}
                height={1440}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
            {/* White gradient at top of cityscape to blend with section above */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          </div>
          
          {/* Mobile phone ONLY: Child portrait as background - lazy loaded */}
          {belowFoldVisible && (
            <img
              src={childPortrait}
              alt=""
              width={800}
              height={1200}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover hidden max-sm:block"
            />
          )}

          {/* Surreal cat between the city and mountain collage; excluded from phone and small-iPad layouts */}
          <div
            style={{ transition: 'opacity 3500ms ease-out' }}
            className={`absolute -bottom-[2%] left-[8%] z-[5] hidden w-[65%] origin-bottom-left -rotate-[10deg] min-[820px]:block lg:left-[8%] lg:w-[60%] xl:left-[8%] xl:w-[56%] ${showCat ? 'opacity-90' : 'opacity-0'}`}
          >

            {belowFoldVisible && (
              <img
                src={surrealCat}
                alt=""
                width={1145}
                height={1374}
                loading="lazy"
                decoding="async"
                className="h-auto w-full"
              />
            )}
          </div>
          
          {/* Tablet and Desktop: PNG overlay with transparent areas - lazy loaded */}
          <div className="relative z-10 hidden sm:block">
            {belowFoldVisible && (
              <img
                src={backgroundSphere}
                alt=""
                width={2560}
                height={1440}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover"
              />
            )}
          </div>
          
          {/* White overlay to replicate 80% opacity faded effect - tablet and desktop */}
          <div className="absolute inset-0 bg-white/30 hidden sm:block pointer-events-none z-20" />
          
          {/* Second Quote Block - Magazine style on left over cityscape - tablet and desktop */}
          <div 
            data-scroll-animation="second-quote"
            className={`absolute top-[20%] left-[4%] w-[38%] pointer-events-auto hidden sm:block scroll-slide-left z-30 ${visibleElements.has("second-quote") ? "visible" : ""}`}
          >
            <div className="text-center px-4">
              <p
                aria-label={'Gardens appear whether you mean them to or not, and action figures grow taller than the boys that bury them."'}
                className="font-body text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-black/85 leading-snug"
              >
                <CrumbleLine className="italic" offset={40} active={quoteSequenceActive} baseDelay={8000}>Gardens appear</CrumbleLine>
                <br />
                <CrumbleLine className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium not-italic" offset={56} active={quoteSequenceActive} baseDelay={8000}>whether you</CrumbleLine>
                <br />
                <CrumbleLine className="italic" offset={69} active={quoteSequenceActive} baseDelay={8000}>mean them to or not,</CrumbleLine>
                <br />
                <CrumbleLine className="text-xl sm:text-2xl lg:text-3xl italic" offset={91} active={quoteSequenceActive} baseDelay={8000}>and action figures</CrumbleLine>
                <br />
                <CrumbleLine className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium not-italic tracking-tight" offset={110} active={quoteSequenceActive} baseDelay={8000}>grow taller than</CrumbleLine>
                <br />
                <CrumbleLine className="italic" offset={127} active={quoteSequenceActive} baseDelay={8000}>the boys that</CrumbleLine>
                <br />
                <CrumbleLine className="text-2xl sm:text-3xl lg:text-4xl font-medium not-italic" offset={141} active={quoteSequenceActive} baseDelay={8000}>{'bury them."'}</CrumbleLine>
              </p>
            </div>
          </div>

          
          {/* Mobile phone ONLY text overlay - hidden on small iPad */}
          <div className="hidden max-sm:block absolute inset-0 bg-black/40 pointer-events-auto">
            <div className="flex items-center justify-center h-full px-6 text-center">
              <p className="font-body text-xl text-white leading-relaxed max-w-md drop-shadow-lg">
                "Gardens appear whether you mean them to or not, and action figures grow taller than the boys that bury them."
              </p>
            </div>
          </div>
          
          {/* Desktop ONLY text at bottom right - word by word fade in - hidden on small iPad */}
          <div 
            data-scroll-animation="bottom-right-text"
            className={`absolute bottom-[14%] right-[12%] pointer-events-auto hidden lg:block z-30 overflow-visible ${quoteSequenceActive ? "visible" : ""}`}
          >
            <div className="font-body text-2xl sm:text-3xl lg:text-4xl text-white italic flex flex-col items-end tracking-wide overflow-visible">
              <span className={`opacity-0 ${quoteSequenceActive ? "animate-word-fade-slow-1" : ""}`} style={{ marginRight: '20px' }}>
                <CrumbleLine offset={0} active={quoteSequenceActive} baseDelay={8000}>None</CrumbleLine>
              </span>
              <span className={`opacity-0 ${quoteSequenceActive ? "animate-word-fade-slow-2" : ""}`} style={{ marginRight: '5px', marginTop: '14px' }}>
                <CrumbleLine offset={7} active={quoteSequenceActive} baseDelay={8000}>of</CrumbleLine>
              </span>
              <span className={`opacity-0 ${quoteSequenceActive ? "animate-word-fade-slow-3" : ""}`} style={{ marginRight: '25px', marginTop: '16px' }}>
                <CrumbleLine offset={13} active={quoteSequenceActive} baseDelay={8000}>this</CrumbleLine>
              </span>
              <span className={`opacity-0 ${quoteSequenceActive ? "animate-word-fade-slow-4" : ""}`} style={{ marginRight: '0px', marginTop: '12px' }}>
                <CrumbleLine offset={21} active={quoteSequenceActive} baseDelay={8000}>is</CrumbleLine>
              </span>
              <span className={`opacity-0 ${quoteSequenceActive ? "animate-word-fade-slow-5" : ""}`} style={{ marginRight: '-15px', marginTop: '26px' }}>
                <CrumbleLine offset={29} active={quoteSequenceActive} baseDelay={8000}>real</CrumbleLine>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <Footer variant="dark" />
    </div>
  );
};

export default About;
