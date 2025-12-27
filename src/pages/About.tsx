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
          {/* Subtle overlay to improve text readability */}
          <div className="absolute inset-0 bg-white/20" />
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
          {/* Widescreen layout: Photo + Name side by side, subheading below, body text to the right */}
          {isWidescreen ? (
            <div className="flex flex-col">
              {/* Top row: Photo and Name side by side */}
              <div className="flex items-stretch gap-6 mb-6">
                {/* Artist photo - larger, same height as name */}
                <div className="flex-shrink-0">
                  <OptimizedImage 
                    src={artistPortrait}
                    alt="Kazuki Yamakawa portrait"
                    className="w-[200px] xl:w-[240px] aspect-square object-cover grayscale shadow-2xl"
                  />
                </div>
                
                {/* Name headline - sized to match photo height */}
                <div className="flex flex-col justify-center">
                  <h1 className="font-heading text-6xl xl:text-7xl 2xl:text-8xl text-black leading-[0.85] tracking-tight">
                    Kazuki
                    <br />
                    <span className="italic font-light">Yamakawa</span>
                  </h1>
                </div>
              </div>
              
              {/* Subheading - spans width of photo + name */}
              <div className="max-w-[600px] xl:max-w-[700px] mb-8">
                <p className="font-body text-xl xl:text-2xl text-black leading-snug">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
              </div>
              
              {/* Body text - moved left for legibility over lighter background areas */}
              <div className="max-w-[550px] xl:max-w-[600px]">
                <p className="font-body text-base xl:text-lg text-black/85 leading-relaxed">
                  A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
                </p>
              </div>
            </div>
          ) : (
            /* Standard layout for non-widescreen */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              
              {/* Large Editorial Title */}
              <div className="lg:col-span-7">
                <h1 className="font-heading text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-black leading-[0.9] tracking-tight mb-8">
                  Kazuki
                  <br />
                  <span className="italic font-light">Yamakawa</span>
                </h1>
                
                {/* Lead paragraph - larger text */}
                <p className="font-body text-xl md:text-2xl lg:text-3xl text-black leading-snug max-w-2xl mb-12">
                  A multi-disciplinary artist working in literature, music and visual storytelling.
                </p>
                
                {/* Body text in columns */}
                <p className="font-body text-base lg:text-lg text-black/80 leading-relaxed max-w-3xl -mt-6">
                  A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
                </p>
              </div>
              
              {/* Author Portrait - positioned on right */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <OptimizedImage 
                  src={artistPortrait}
                  alt="Kazuki Yamakawa portrait"
                  className="w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 object-cover grayscale shadow-2xl"
                />
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
              <p className="font-body text-lg md:text-xl lg:text-2xl text-white/90 leading-relaxed italic">
                I have always had the flaw of describing myself through my interests... because I suppose that I don't feel I can be seen any other way. If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, achievement, elevation, and progress for erring, curiosity, and wonder, I should never have found this hapless grove in which I am so brightly sustained.
              </p>
            </blockquote>
          </div>
        </div>
        {/* Short gradient fade from black to transparent */}
        <div className="h-16 bg-gradient-to-b from-neutral-900 to-transparent" />
      </div>
      
      {/* Background Image Section from Original About - pulled up */}
      <div className="relative z-10 -mt-8">
        <div 
          data-scroll-animation="background-image"
          className={`relative pointer-events-none overflow-hidden scroll-fade-up ${visibleElements.has("background-image") ? "visible" : ""}`}
        >
          {/* Cityscape layer behind everything - desktop only */}
          <div 
            className={`absolute inset-0 max-sm:hidden z-0 ${showCityscape ? 'animate-cityscape-fade-in' : 'opacity-0'}`}
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
          
          {/* Mobile: Child portrait as background */}
          <OptimizedImage
            src={childPortrait}
            alt=""
            className="w-full h-auto object-cover sm:hidden"
          />
          
          {/* Desktop: PNG overlay with transparent areas */}
          <div className="relative z-10 max-sm:hidden">
            <OptimizedImage
              src={backgroundSphere}
              alt=""
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* White overlay to replicate 80% opacity faded effect - affects both cityscape and background */}
          <div className="absolute inset-0 bg-white/30 max-sm:hidden pointer-events-none z-20" />
          
          {/* Second Quote Block - Magazine style on left over cityscape */}
          <div 
            data-scroll-animation="second-quote"
            className={`absolute top-[15%] left-[4%] w-[38%] pointer-events-auto max-sm:hidden scroll-slide-left z-30 ${visibleElements.has("second-quote") ? "visible" : ""}`}
          >
            <div className="text-center px-4">
              <p className="font-body text-2xl lg:text-3xl xl:text-4xl text-black/85 leading-snug">
                <span className="italic">Gardens appear</span>
                <br />
                <span className="text-3xl lg:text-4xl xl:text-5xl font-medium not-italic">whether you</span>
                <br />
                <span className="italic">mean them to or not,</span>
                <br />
                <span className="text-xl lg:text-2xl italic">and action figures</span>
                <br />
                <span className="text-3xl lg:text-4xl xl:text-5xl font-medium not-italic tracking-tight">grow taller than</span>
                <br />
                <span className="italic">the boys that</span>
                <br />
                <span className="text-2xl lg:text-3xl font-medium not-italic">bury them."</span>
              </p>
              {/* Kanji Signature - positioned right of quote */}
              <div className="mt-6 flex justify-end pr-8">
                <OptimizedImage 
                  src={signatureYamakawa}
                  alt="Yamakawa signature"
                  className="w-32 h-auto opacity-90"
                />
              </div>
            </div>
          </div>
          
          {/* Mobile text - shown only on mobile */}
          <div className="hidden max-sm:block absolute inset-0 bg-black/40 pointer-events-auto">
            <div className="flex items-center justify-center h-full px-6 text-center">
              <p className="font-body text-xl text-white leading-relaxed max-w-md drop-shadow-lg">
                A writer and composer exploring the spaces between form and possibility
              </p>
            </div>
          </div>
          
          {/* Desktop text at bottom right - word by word fade in - hidden on mobile */}
          <div 
            data-scroll-animation="bottom-right-text"
            className={`absolute bottom-[14%] right-[12%] pointer-events-auto max-sm:hidden z-30 overflow-visible ${visibleElements.has("bottom-right-text") ? "visible" : ""}`}
          >
            <div className="font-body text-3xl lg:text-4xl text-white italic flex flex-col items-end tracking-wide overflow-visible">
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-1" : ""}`} style={{ marginRight: '20px' }}>None</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-2" : ""}`} style={{ marginRight: '5px', marginTop: '14px' }}>of</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-3" : ""}`} style={{ marginRight: '25px', marginTop: '16px' }}>this</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-4" : ""}`} style={{ marginRight: '0px', marginTop: '12px' }}>is</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-5" : ""}`} style={{ marginRight: '-15px', marginTop: '26px' }}>real</span>
            </div>
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
