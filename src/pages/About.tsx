import React from "react";
import { OptimizedImage } from "@/components/OptimizedImage";
import Navigation from "@/components/Navigation";
import { useScrollAnimation } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import artistPortrait from "@/assets/artist-portrait-new.png";
import parisSquare from "@/assets/paris-square-background.jpg";
import signatureYamakawa from "@/assets/signature-yamakawa-new.png";
import backgroundSphere from "@/assets/about-background-new.png";
import cityscapeAerial from "@/assets/about-cityscape-aerial.png";
import childPortrait from "@/assets/about-child-portrait.jpeg";

const About = () => {
  useScrollToTop();
  const visibleElements = useScrollAnimation();
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navigation />

      {/* Hero Section with Paris Square Background */}
      <div className="relative min-h-screen mt-16">
        {/* Full-screen Paris background */}
        <div className="absolute inset-0 z-0">
          <OptimizedImage
            src={parisSquare}
            alt="Parisian square with pigeons"
            className="w-full h-full object-cover"
            priority
          />
          {/* Subtle overlay to improve text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/40" />
        </div>

        {/* Editorial Top Bar */}
        <div className="relative z-10 pt-6 sm:pt-8">
          <div className="container mx-auto px-6">
            <p className="font-accent text-sm tracking-[0.3em] uppercase text-gray-600">
              Author · Composer
            </p>
          </div>
        </div>

        {/* Magazine-style text layout over background */}
        <div className="relative z-10 container mx-auto px-6 pt-8 sm:pt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Large Editorial Title */}
            <div className="lg:col-span-7">
              <h1 className="font-heading text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tight text-gray-900 leading-none">
                <span className="block">Kazuki</span>
                <span className="block mt-2 lg:mt-4 lg:ml-12">Yamakawa</span>
              </h1>
              
              {/* Lead paragraph - larger text */}
              <p className="font-body text-xl sm:text-2xl leading-relaxed text-gray-700 mt-8 lg:mt-12 max-w-xl">
                A multi-disciplinary artist working in literature, music and visual storytelling.
              </p>
              
              {/* Body text in columns */}
              <p className="font-body text-base sm:text-lg leading-relaxed text-gray-600 mt-6 max-w-xl">
                A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
              </p>
            </div>
            
            {/* Author Portrait - positioned on right */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:pt-12">
              <div className="w-64 sm:w-80 lg:w-96 relative">
                <OptimizedImage 
                  src={artistPortrait}
                  alt="Kazuki Yamakawa portrait"
                  className="w-full h-auto grayscale"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient transition to dark section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10" />
      </div>

      {/* Dark Quote Section - First Quote Only */}
      <div className="bg-black py-16 sm:py-24 relative">
        <div className="container mx-auto px-6 max-w-4xl">
          <blockquote className="font-accent text-lg sm:text-xl lg:text-2xl leading-relaxed text-white/90 italic">
            <span className="text-4xl text-white/60 font-heading mr-2">"</span>
            <span className="text-white/80">
              I have always had the flaw of describing myself through my interests... because I suppose that I don't feel I can be seen any other way. If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, achievement, elevation, and progress for erring, curiosity, and wonder, I should never have found this hapless grove in which I am so brightly sustained.
            </span>
          </blockquote>
        </div>
        
        {/* Short gradient fade from black to transparent */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Background Image Section from Original About - pulled up */}
      <div className="relative -mt-4">
        <div 
          data-scroll-animation="background-image"
          className={`relative pointer-events-none overflow-hidden scroll-fade-up ${visibleElements.has("background-image") ? "visible" : ""}`}
          style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
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
          <div 
            className="relative z-10 max-sm:hidden" 
            style={{ 
              transform: 'scale(1.02)',
              transformOrigin: 'center bottom'
            }}
          >
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
            data-scroll-animation="quote-text"
            className={`absolute top-[calc(15%-57px)] left-[8%] max-w-md pointer-events-auto max-sm:hidden scroll-slide-left z-30 ${visibleElements.has("quote-text") ? "visible" : ""}`}
          >
            <p className="font-body text-base lg:text-lg leading-relaxed text-foreground mb-6 italic">
              <span className="block">Gardens appear</span>
              <span className="block">whether or not you</span>
              <span className="block">mean them to,</span>
              <span className="block">and action figures</span>
              <span className="block">grow taller than</span>
              <span className="block">the boys that</span>
              <span className="block">bury them."</span>
            </p>
            
            {/* Kanji Signature - positioned right of quote */}
            <OptimizedImage 
              src={signatureYamakawa}
              alt="Yamakawa signature"
              className="w-32 h-auto ml-3 opacity-90"
            />
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
      
      {/* Contact Footer */}
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 relative z-10 max-sm:py-8 -mt-[73px]">
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
