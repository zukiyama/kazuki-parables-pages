import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";
import artistPortrait from "@/assets/artist-portrait-new.png";
import parisSquare from "@/assets/paris-square-background.jpg";
import signatureYamakawa from "@/assets/signature-yamakawa-new.png";
import backgroundSphere from "@/assets/about-background-new.png";
import cityscapeAerial from "@/assets/about-cityscape-aerial.png";
import childPortrait from "@/assets/about-child-portrait.jpeg";

const About = () => {
  useScrollToTop();
  const visibleElements = useScrollAnimation();
  const isWidescreen = useWidescreenAspectRatio();
  const [showCityscape, setShowCityscape] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = scrollPosition / pageHeight;
      
      if (scrollPercentage >= 0.66 && !showCityscape) {
        setTimeout(() => {
          setShowCityscape(true);
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCityscape]);
  
  return (
    <div className="min-h-screen bg-neutral-100">
      <Navigation />
      
      {/* Hero Section with Paris Square Background */}
      <div className="relative min-h-screen">
        {/* Full-screen Paris background */}
        <div className="absolute inset-0">
          <OptimizedImage 
            src={parisSquare}
            alt="Parisian square with pigeons"
            className="w-full h-full object-cover"
            priority
          />
          {/* Subtle overlay to improve text readability - more opacity on mobile for better text visibility */}
          <div className="absolute inset-0 bg-white/20 max-sm:bg-white/50" />
        </div>
        
        {/* Editorial Top Bar */}
        <div className="relative z-10 pt-24 px-8 md:px-16 lg:px-24">
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
            <div className="flex gap-10 items-start">
              {/* Left column: Photo + Title + Subheading */}
              <div className="flex flex-col">
                {/* Photo and Title row - same height */}
                <div className="flex items-stretch gap-6">
                  {/* Artist photo */}
                  <div className="flex-shrink-0">
                    <OptimizedImage 
                      src={artistPortrait}
                      alt="Kazuki Yamakawa portrait"
                      className="w-[200px] xl:w-[220px] 2xl:w-[240px] aspect-square object-cover grayscale shadow-2xl"
                    />
                  </div>
                  
                  {/* Name headline - fills photo height */}
                  <div className="flex flex-col justify-between py-1">
                    <h1 className="font-heading text-[4.5rem] xl:text-[5.5rem] 2xl:text-[6.5rem] text-black leading-[0.82] tracking-tight">
                      Kazuki
                      <br />
                      <span className="italic font-light">Yamakawa</span>
                    </h1>
                  </div>
                </div>
                
                {/* Subheading - same width as photo + title */}
                <div className="mt-4">
                  <p className="font-body text-xl xl:text-2xl text-black leading-snug">
                    A multi-disciplinary artist working in literature,<br />music and visual storytelling.
                  </p>
                </div>
              </div>
              
              {/* Right column: Body text - moved down slightly */}
              <div className="flex-1 max-w-[400px] xl:max-w-[450px] pt-8">
                <p className="font-body text-base xl:text-lg text-black/85 leading-relaxed">
                  A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human.
                </p>
                <p className="font-body text-base xl:text-lg text-black/85 leading-relaxed mt-4">
                  The best way to get to know his music is to head over to the music page.
                </p>
              </div>
            </div>
          ) : (
            /* Standard layout for non-widescreen */
            <div className="flex flex-col">
              {/* Mobile phone only: Artist photo centered at top */}
              <div className="sm:hidden flex justify-center mb-8">
                <OptimizedImage 
                  src={artistPortrait}
                  alt="Kazuki Yamakawa portrait"
                  className="w-72 h-72 object-cover grayscale shadow-2xl"
                />
              </div>
              
              {/* Small iPad portrait: Title on LEFT, Photo on RIGHT at TOP */}
              <div className="hidden sm:flex lg:hidden items-start gap-6 mb-6">
                {/* Title - positioned on left */}
                <div className="flex-1 pt-0">
                  <h1 className="font-heading text-6xl md:text-7xl text-black leading-[0.85] tracking-tight">
                    Kazuki
                    <br />
                    <span className="italic font-light">Yamakawa</span>
                  </h1>
                </div>
                {/* Photo - positioned on right, aligned top */}
                <div className="flex-shrink-0">
                  <OptimizedImage 
                    src={artistPortrait}
                    alt="Kazuki Yamakawa portrait"
                    className="w-48 md:w-56 aspect-square object-cover grayscale shadow-2xl"
                  />
                </div>
              </div>
              
              {/* Small iPad portrait: Subheading + Body text */}
              <div className="hidden sm:block lg:hidden">
                <p className="font-body text-2xl md:text-3xl text-black leading-snug mb-6">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
                <p className="font-body text-lg md:text-xl text-black/80 leading-relaxed max-w-3xl mt-4">
                  A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
                </p>
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
                
                <p className="font-body text-base text-black/80 leading-relaxed max-w-3xl">
                  A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
                </p>
              </div>
              
              {/* Desktop large: Original grid layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-16 items-start">
                <div className="lg:col-span-7">
                  <h1 className="font-heading text-8xl xl:text-9xl text-black leading-[0.9] tracking-tight mb-8">
                    Kazuki
                    <br />
                    <span className="italic font-light">Yamakawa</span>
                  </h1>
                  
                  <p className="font-body text-2xl lg:text-3xl text-black leading-snug max-w-2xl mb-12">
                    A multi-disciplinary artist working in literature, music and visual storytelling.
                  </p>
                  
                  <p className="font-body text-lg text-black/80 leading-relaxed max-w-3xl -mt-6">
                    A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
                  </p>
                </div>
                
                <div className="lg:col-span-5 flex justify-end">
                  <OptimizedImage 
                    src={artistPortrait}
                    alt="Kazuki Yamakawa portrait"
                    className="w-96 h-96 object-cover grayscale shadow-2xl"
                  />
                </div>
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
                If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, I should never have found this hapless grove in which I am so brightly sustained.
              </p>
              {/* Tablet and desktop version - full quote */}
              <p className="font-body hidden sm:block text-xl lg:text-2xl text-white/90 leading-relaxed italic">
                I have always had the flaw of describing myself through my interests... because I suppose that I don't feel I can be seen any other way. If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, achievement, elevation, and progress for erring, curiosity, and wonder, I should never have found this hapless grove in which I am so brightly sustained.
              </p>
            </blockquote>
          </div>
        </div>
        {/* Short gradient fade from black to transparent - hidden on mobile phone */}
        <div className="h-16 bg-gradient-to-b from-neutral-900 to-transparent max-sm:hidden" />
      </div>
      
      {/* Background Image Section from Original About - pulled up, no gap on mobile */}
      <div className="relative z-10 -mt-8 max-sm:mt-0">
        <div 
          data-scroll-animation="background-image"
          className={`relative pointer-events-none overflow-hidden scroll-fade-up ${visibleElements.has("background-image") ? "visible" : ""}`}
        >
          {/* Cityscape layer behind everything - tablet and desktop */}
          <div 
            className={`absolute inset-0 hidden sm:block z-0 ${showCityscape ? 'animate-cityscape-fade-in' : 'opacity-0'}`}
            style={{ animationDuration: '10s', animationFillMode: 'forwards' }}
          >
            <OptimizedImage
              src={cityscapeAerial}
              alt=""
              className="w-full h-full object-cover"
            />
            {/* White gradient at top of cityscape to blend with section above */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none" />
          </div>
          
          {/* Mobile phone ONLY: Child portrait as background - hidden on small iPad */}
          <OptimizedImage
            src={childPortrait}
            alt=""
            className="w-full h-auto object-cover hidden max-sm:block"
          />
          
          {/* Tablet and Desktop: PNG overlay with transparent areas */}
          <div className="relative z-10 hidden sm:block">
            <OptimizedImage
              src={backgroundSphere}
              alt=""
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* White overlay to replicate 80% opacity faded effect - tablet and desktop */}
          <div className="absolute inset-0 bg-white/30 hidden sm:block pointer-events-none z-20" />
          
          {/* Second Quote Block - Magazine style on left over cityscape - tablet and desktop */}
          <div 
            data-scroll-animation="second-quote"
            className={`absolute top-[15%] left-[4%] w-[38%] pointer-events-auto hidden sm:block scroll-slide-left z-30 ${visibleElements.has("second-quote") ? "visible" : ""}`}
          >
            <div className="text-center px-4">
              <p className="font-body text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-black/85 leading-snug">
                <span className="italic">Gardens appear</span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium not-italic">whether you</span>
                <br />
                <span className="italic">mean them to or not,</span>
                <br />
                <span className="text-lg sm:text-xl lg:text-2xl italic">and action figures</span>
                <br />
                <span className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-medium not-italic tracking-tight">grow taller than</span>
                <br />
                <span className="italic">the boys that</span>
                <br />
                <span className="text-xl sm:text-2xl lg:text-3xl font-medium not-italic">bury them."</span>
              </p>
              {/* Kanji Signature - positioned right of quote */}
              <div className="mt-6 flex justify-end pr-8">
                <OptimizedImage 
                  src={signatureYamakawa}
                  alt="Yamakawa signature"
                  className="w-24 sm:w-32 h-auto opacity-90"
                />
              </div>
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
            className={`absolute bottom-[14%] right-[12%] pointer-events-auto hidden lg:block z-30 overflow-visible ${visibleElements.has("bottom-right-text") ? "visible" : ""}`}
          >
            <div className="font-body text-2xl sm:text-3xl lg:text-4xl text-white italic flex flex-col items-end tracking-wide overflow-visible">
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-1" : ""}`} style={{ marginRight: '20px' }}>None</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-2" : ""}`} style={{ marginRight: '5px', marginTop: '14px' }}>of</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-3" : ""}`} style={{ marginRight: '25px', marginTop: '16px' }}>this</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-4" : ""}`} style={{ marginRight: '0px', marginTop: '12px' }}>is</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-5" : ""}`} style={{ marginRight: '-15px', marginTop: '26px' }}>real</span>
            </div>
          </div>
          
          {/* Small iPad portrait ONLY: Kanji signature at bottom right */}
          <div className="absolute bottom-[10%] right-[8%] hidden sm:block lg:hidden z-30">
            <OptimizedImage 
              src={signatureYamakawa}
              alt="Yamakawa signature"
              className="w-28 md:w-36 h-auto opacity-90"
            />
          </div>
        </div>
      </div>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 relative z-10 max-sm:py-8">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-white">
            kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About;
