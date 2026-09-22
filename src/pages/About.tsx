import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";

// Above-the-fold assets - loaded eagerly with high priority
import artistPortrait from "@/assets/about-portrait-postcard.png";
import parisSquare from "@/assets/about-music-room.webp";

// Below-the-fold assets - lazy loaded
import backgroundSphere from "@/assets/about-background-new.webp";
import cityscapeAerial from "@/assets/about-cityscape-aerial.webp";
import childPortrait from "@/assets/about-child-portrait.webp";
import surrealCat from "@/assets/about-surreal-cat.png";
import handwrittenIntro from "@/assets/about-intro-handwritten.png";

type CrumbleLineProps = {
  children: string;
  className?: string;
  offset: number;
  active: boolean;
  baseDelay?: number;
};

const CrumbleLine = ({ children, className = "", offset, active, baseDelay = 3000 }: CrumbleLineProps) => (
  <span className={className}>
    {Array.from(children).map((character, index) => {
      const characterIndex = offset + index;
      const horizontalDistance = ((characterIndex * 47) % 181) - 90;
      const initialDrop = 4 + ((characterIndex * 19) % 24);
      const rotation = ((characterIndex * 73) % 241) - 120;
      const delay = baseDelay + ((characterIndex * 41) % 420);
      const duration = 2600 + ((characterIndex * 29) % 900);

      return (
        <span
          key={`${characterIndex}-${character}`}
          aria-hidden="true"
          className={`about-quote-character ${active ? "about-quote-character--falling" : ""}`}
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

// Handwritten intro note (transparent background, black ink) replacing the typed paragraph
const HandwrittenIntro = ({ className = "" }: { className?: string }) => (
  <img
    src={handwrittenIntro}
    alt="Handwritten note: Previously a writer in the Korean games industry, Kazuki decided in his thirties to pursue the work that is his lifelong vocation. Treating metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page."
    width={1949}
    height={807}
    loading="eager"
    decoding="async"
    className={`block h-auto ${className}`}
  />
);

const About = () => {
  useScrollToTop();
  const visibleElements = useScrollAnimation();
  const isWidescreen = useWidescreenAspectRatio();
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

  // Load and decode hero background (Paris Square), then fade in
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
    img.src = parisSquare;
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
      
      {/* Hero Section with Paris Square Background - top aligned exactly to header bottom */}
      <div 
        className="relative min-h-screen-stable"
        style={{ paddingTop: headerHeight }}
      >
        {/* Full-screen Paris background - covers entire section including under header */}
        <div className="absolute inset-0 bg-black" style={{ top: headerHeight }}>
          {/* LCP hero image - highest priority with explicit dimensions to prevent layout shift */}
          <img 
            src={parisSquare}
            alt="Music room with guitars and keyboards"
            width={1670}
            height={750}
            loading="eager"
            decoding="sync"
            {...{ fetchpriority: "high" } as React.ImgHTMLAttributes<HTMLImageElement>}
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
            style={{ opacity: heroBackgroundReady ? 1 : 0 }}
          />
          {/* Subtle overlay to improve text readability - more opacity on mobile and iPad desktop for better text visibility */}
          <div className="absolute inset-0 bg-white/35 max-sm:bg-white/55 lg:bg-white/50 2xl:bg-white/30 xl:bg-white/45" />
        </div>
        
        {/* Editorial Top Bar - dynamically positioned below header */}
        <div className="relative z-10 px-8 md:px-16 lg:px-24 pt-4">
          <div className="border-b-2 border-black pb-4 mb-8">
            <span className="font-body text-sm tracking-[0.3em] uppercase text-black">
              Author · Composer
            </span>
          </div>
        </div>
        
        {/* Magazine-style text layout over background */}
        <div className="relative z-10 px-8 md:px-16 lg:px-24 pb-24 mt-4">
          {/* Widescreen layout: Photo + Name + Subheading on left, Body text on right */}
          {isWidescreen ? (
            <div className="flex gap-8 items-start">
              {/* Left column: Photo + Title with Subheading aligned to photo bottom */}
              <div className="flex-shrink-0">
                {/* Photo and Title row */}
                <div className="flex items-start gap-6">
                  {/* Artist photo - above-fold, eager loaded with explicit dimensions */}
                  <div className="flex-shrink-0">
                    <StampPortrait className="w-[200px] xl:w-[220px] 2xl:w-[240px] aspect-square" />
                  </div>
                  
                  {/* Title + Subheading - subheading aligned to bottom of photo */}
                  <div className="flex flex-col justify-between h-[200px] xl:h-[220px] 2xl:h-[240px] py-1">
                    <h1 className="font-heading text-[5rem] xl:text-[6rem] 2xl:text-[7rem] text-black leading-[0.82] tracking-tight">
                      Kazuki
                      <br />
                      <span className="italic font-light">Yamakawa</span>
                    </h1>
                    {/* Subheading at bottom, aligned with photo bottom */}
                    <p className="font-body text-xl xl:text-2xl text-black leading-snug mt-4">
                      A multi-disciplinary artist working in literature,<br />music and visual storytelling.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Right column: Body text - aligned to top */}
              <div className="flex-1 max-w-[440px] xl:max-w-[500px] pt-0">
                <HandwrittenIntro className="w-full" />
              </div>
            </div>
          ) : (
            /* Standard layout for non-widescreen */
            <div className="flex flex-col">
              {/* Mobile phone only: Artist photo centered at top - above-fold, eager */}
              <div className="sm:hidden flex justify-center mb-8">
                <StampPortrait className="w-64 aspect-square" />
              </div>
              
              {/* Small iPad portrait: Photo floated to top-right */}
              <div className="hidden sm:block lg:hidden relative">
                {/* Photo floated to top-right */}
                <div className="float-right ml-8 mb-6 mr-3">
                  <StampPortrait className="w-48 md:w-56 aspect-square" />
                </div>
                
                {/* Title on left - extra top padding for 10.9" iPad portrait alignment */}
                <h1 className="font-heading text-7xl md:text-8xl text-black leading-[0.85] tracking-tight mb-4 md:pt-3">
                  Kazuki
                  <br />
                  <span className="italic font-light">Yamakawa</span>
                </h1>
                
                {/* Subheading below title - increased top margin for 10.9" iPad */}
                <p className="font-body text-2xl md:text-3xl text-black leading-snug mb-6 md:mt-6">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
                
                {/* Handwritten intro - replaces the typed paragraph, wraps below floated photo */}
                <div className="md:mt-4">
                  <HandwrittenIntro className="w-full max-w-[600px]" />
                </div>
              </div>
              
              {/* Mobile phone: Title + content */}
              <div className="sm:hidden">
                <h1 className="font-heading text-6xl text-black leading-[0.9] tracking-tight mb-6">
                  Kazuki
                  <br />
                  <span className="italic font-light">Yamakawa</span>
                </h1>
                
                <p className="font-body text-xl text-black leading-snug max-w-2xl mb-4">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
                
                <div className="mt-1 mb-7">
                  <HandwrittenIntro className="w-full" />
                </div>
              </div>
              
              {/* iPad DESKTOP only (lg to 2xl): Photo + Title row, subheading + body below */}
              <div className="hidden lg:flex 2xl:hidden flex-col">
                {/* Header row: Title on left, Photo on right */}
                <div className="flex items-start gap-6 mb-10">
                  {/* Title - positioned on left */}
                  <div className="flex-1 pt-0">
                    <h1 className="font-heading text-7xl md:text-8xl lg:text-[8rem] text-black leading-[0.85] tracking-tight">
                      Kazuki
                      <br />
                      <span className="italic font-light">Yamakawa</span>
                    </h1>
                  </div>
                  {/* Photo - positioned on right, aligned top */}
                  <div className="flex-shrink-0">
                    <StampPortrait className="w-48 md:w-56 lg:w-64 aspect-square" />
                  </div>
                </div>
                
                {/* Subheading + Body text below */}
                <p className="font-body text-2xl md:text-3xl text-black leading-snug mb-6">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
                <div className="mt-2">
                  <HandwrittenIntro className="w-full max-w-[680px]" />
                </div>
              </div>
              
              {/* Widescreen (2xl and up): Original horizontal layout */}
              <div className="hidden 2xl:flex flex-col">
                {/* Top row: Photo + Title + Body text */}
                <div className="flex items-start gap-6">
                  {/* Photo - small, same height as title - above-fold, eager */}
                  <div className="flex-shrink-0">
                    <StampPortrait className="w-[160px] aspect-square" />
                  </div>
                  
                  {/* Title */}
                  <div className="flex-shrink-0">
                    <h1 className="font-heading text-8xl text-black leading-[0.85] tracking-tight">
                      Kazuki
                      <br />
                      <span className="italic font-light">Yamakawa</span>
                    </h1>
                  </div>
                  
                  {/* Handwritten intro - right of title */}
                  <div className="flex-1 max-w-[500px] pt-1">
                    <HandwrittenIntro className="w-full" />
                  </div>
                </div>
                
                {/* Subheading below */}
                <p className="font-body text-3xl text-black leading-snug max-w-2xl mt-8">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Gradient transition to dark section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-neutral-900 z-10" />
      </div>
      
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
