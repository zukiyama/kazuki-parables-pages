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
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/30" />
        </div>

        {/* Editorial Top Bar with line */}
        <div className="relative z-10 pt-6 sm:pt-8">
          <div className="container mx-auto px-6 sm:px-12 lg:px-16">
            <p 
              className="text-xs sm:text-sm tracking-[0.25em] uppercase text-gray-800 mb-2"
              style={{ fontFamily: 'Source Serif Pro, serif' }}
            >
              AUTHOR · COMPOSER
            </p>
            <div className="w-full h-[1px] bg-gray-800" />
          </div>
        </div>

        {/* Magazine-style text layout over background */}
        <div className="relative z-10 container mx-auto px-6 sm:px-12 lg:px-16 pt-6 sm:pt-10 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Large Editorial Title */}
            <div className="lg:col-span-7">
              <h1 
                className="tracking-tight text-gray-900 leading-[0.85]"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                <span 
                  className="block italic"
                  style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
                >
                  Kazuki
                </span>
                <span 
                  className="block italic"
                  style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}
                >
                  Yamakawa
                </span>
              </h1>
              
              {/* Lead paragraph - larger text */}
              <p 
                className="text-xl sm:text-2xl lg:text-3xl leading-snug text-gray-800 mt-8 lg:mt-10 max-w-2xl italic"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                A multi-disciplinary artist working in literature, music and visual storytelling.
              </p>
              
              {/* Body text */}
              <p 
                className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-700 mt-6 max-w-xl italic"
                style={{ fontFamily: 'Source Serif Pro, serif' }}
              >
                A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
              </p>
            </div>
            
            {/* Author Portrait - positioned on right */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end items-start lg:pt-8">
              <div className="w-64 sm:w-72 lg:w-80 xl:w-96 relative">
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
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent z-10" />
      </div>

      {/* Dark Quote Section */}
      <div className="bg-black py-16 sm:py-20 lg:py-24 relative">
        <div className="container mx-auto px-6 sm:px-12 lg:px-16 max-w-5xl">
          <blockquote className="relative">
            {/* Large quotation mark */}
            <span 
              className="absolute -left-2 sm:-left-4 -top-4 sm:-top-6 text-5xl sm:text-6xl lg:text-7xl text-white/50"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              "
            </span>
            <p 
              className="text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed text-white/90 italic pl-6 sm:pl-8"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              I have always had the flaw of describing myself through my interests... because I suppose that I don't feel I can be seen any other way. If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, achievement, elevation, and progress for erring, curiosity, and wonder, I should never have found this hapless grove in which I am so brightly sustained.
            </p>
          </blockquote>
        </div>
        
        {/* Gradient fade from black to white */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </div>

      {/* Background Image Section */}
      <div className="relative -mt-4">
        <div 
          data-scroll-animation="background-image"
          className={`relative pointer-events-none overflow-hidden scroll-fade-up ${visibleElements.has("background-image") ? "visible" : ""}`}
          style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
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
            {/* White gradient at top */}
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
          
          {/* White overlay */}
          <div className="absolute inset-0 bg-white/30 max-sm:hidden pointer-events-none z-20" />
          
          {/* Gardens appear quote - Magazine style with mixed typography */}
          <div 
            data-scroll-animation="quote-text"
            className={`absolute top-[15%] left-[6%] sm:left-[8%] lg:left-[10%] pointer-events-auto max-sm:hidden scroll-slide-left z-30 ${visibleElements.has("quote-text") ? "visible" : ""}`}
          >
            <div className="text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              {/* Gardens appear - italic, medium */}
              <p className="text-2xl lg:text-3xl xl:text-4xl italic mb-1">Gardens appear</p>
              {/* whether you mean - large bold */}
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">whether you mean</p>
              {/* them to - large bold, indented */}
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight ml-8 lg:ml-12">them to</p>
              {/* or not, - small italic, more indented */}
              <p className="text-xl lg:text-2xl xl:text-3xl italic ml-16 lg:ml-24 mt-1">or not,</p>
              {/* and these many years later - small italic */}
              <p className="text-lg lg:text-xl xl:text-2xl italic mt-2 ml-4 lg:ml-6">and these many years later</p>
              {/* my action figures - large bold */}
              <p className="text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">my action figures</p>
              {/* have grown taller than - medium italic */}
              <p className="text-xl lg:text-2xl xl:text-3xl italic">have grown taller than</p>
              {/* the boy that buried them." - regular weight */}
              <p className="text-lg lg:text-xl xl:text-2xl ml-2">the boy that buried them."</p>
            </div>
            
            {/* Kanji Signature - positioned below quote in red/orange */}
            <div className="mt-6 ml-20 lg:ml-32">
              <OptimizedImage 
                src={signatureYamakawa}
                alt="Yamakawa signature"
                className="w-24 lg:w-32 h-auto"
              />
            </div>
          </div>
          
          {/* Mobile text */}
          <div className="hidden max-sm:block absolute inset-0 bg-black/40 pointer-events-auto">
            <div className="flex items-center justify-center h-full px-6 text-center">
              <p className="font-body text-xl text-white leading-relaxed max-w-md drop-shadow-lg">
                A writer and composer exploring the spaces between form and possibility
              </p>
            </div>
          </div>
          
          {/* "None of this is real" - word by word fade in on right */}
          <div 
            data-scroll-animation="bottom-right-text"
            className={`absolute bottom-[12%] right-[8%] lg:right-[12%] pointer-events-auto max-sm:hidden z-30 overflow-visible ${visibleElements.has("bottom-right-text") ? "visible" : ""}`}
          >
            <div 
              className="text-3xl lg:text-4xl xl:text-5xl text-white italic flex flex-col items-end tracking-wide overflow-visible"
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-1" : ""}`} style={{ marginRight: '20px' }}>None</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-2" : ""}`} style={{ marginRight: '5px', marginTop: '16px' }}>of</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-3" : ""}`} style={{ marginRight: '25px', marginTop: '20px' }}>this</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-4" : ""}`} style={{ marginRight: '0px', marginTop: '16px' }}>is</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-5" : ""}`} style={{ marginRight: '-15px', marginTop: '30px' }}>real</span>
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
