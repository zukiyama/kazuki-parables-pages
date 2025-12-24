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
      <section className="relative min-h-screen">
        {/* Full-screen Paris background */}
        <div className="absolute inset-0 w-full h-full">
          <OptimizedImage
            src={parisSquare}
            alt="Parisian square with pigeons"
            className="w-full h-full object-cover"
            priority
          />
          {/* Subtle overlay to improve text readability */}
          <div className="absolute inset-0 bg-white/10"></div>
        </div>

        {/* Editorial Top Bar */}
        <div className="relative z-10 pt-24 sm:pt-28 px-6 sm:px-12 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <p className="font-body text-xs sm:text-sm tracking-[0.3em] text-stone-700 uppercase">
              Author · Composer
            </p>
            <div className="w-full h-px bg-stone-400 mt-3"></div>
          </div>
        </div>

        {/* Magazine-style text layout over background */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-20 pt-8 sm:pt-12 pb-20">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-16">
            
            {/* Large Editorial Title */}
            <div className="flex-1 max-w-3xl">
              <h1 className="font-heading font-normal text-stone-800 leading-[0.85] tracking-tight italic">
                <span className="block" style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}>Kazuki</span>
                <span className="block -mt-2 sm:-mt-4" style={{ fontSize: 'clamp(4rem, 15vw, 12rem)' }}>Yamakawa</span>
              </h1>
              
              {/* Lead paragraph - larger text */}
              <p className="font-heading text-lg sm:text-xl lg:text-2xl text-stone-700 mt-8 sm:mt-12 max-w-xl leading-relaxed italic">
                A multi-disciplinary artist working in literature, music and visual storytelling.
              </p>
              
              {/* Body text */}
              <p className="font-body text-sm sm:text-base text-stone-600 mt-6 max-w-xl leading-relaxed italic">
                A writer in the games industry in a previous life, Kazuki decided in his thirties to pursue the work that has been his lifelong vocation. Combining metaphysics with an unusual levity and invention, his literary works explore what it is to be real while remaining, above all things, deeply human. The best way to get to know his music is to head over to the music page.
              </p>
            </div>

            {/* Author Portrait - positioned on right */}
            <div className="lg:w-80 xl:w-96 flex-shrink-0">
              <OptimizedImage
                src={artistPortrait}
                alt="Kazuki Yamakawa portrait"
                className="w-48 sm:w-64 lg:w-full grayscale"
              />
            </div>
          </div>
        </div>

        {/* Gradient transition to dark section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-black"></div>
      </section>

      {/* Dark Quote Section */}
      <section className="bg-black py-16 sm:py-24 lg:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          <blockquote className="relative">
            <span className="absolute -top-8 -left-4 sm:-top-12 sm:-left-8 text-6xl sm:text-8xl text-stone-500 font-heading leading-none">"</span>
            <p className="font-heading text-lg sm:text-xl lg:text-2xl xl:text-3xl text-stone-300 leading-relaxed italic pl-4 sm:pl-8">
              I have always had the flaw of describing myself through my interests... because I suppose that I don't feel I can be seen any other way. If it weren't for the hours I had wasted burying action figures and reading comics behind the computer monitor on my desk; if I had spent the summer revising rather than learning to hold an open A major on an old half size nylon-strung guitar—in short, if I hadn't have traded what I should be doing for what I love, achievement, elevation, and progress for erring, curiosity, and wonder, I should never have found this hapless grove in which I am so brightly sustained.
            </p>
          </blockquote>
        </div>
        {/* Gradient fade from black to white */}
        <div className="h-24 bg-gradient-to-b from-black to-white mt-16"></div>
      </section>

      {/* Background Image Section */}
      <section className="relative min-h-screen -mt-24">
        <div className="absolute inset-0">
          {/* Cityscape layer behind everything - desktop only */}
          <div className={`hidden sm:block absolute inset-0 transition-opacity duration-[10000ms] ${showCityscape ? 'opacity-60' : 'opacity-0'}`}>
            <OptimizedImage
              src={cityscapeAerial}
              alt="Aerial cityscape"
              className="w-full h-full object-cover"
            />
            {/* White gradient at top of cityscape */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-white to-transparent"></div>
          </div>
          
          {/* Mobile: Child portrait as background */}
          <OptimizedImage
            src={childPortrait}
            alt="Child portrait"
            className="sm:hidden w-full h-full object-cover opacity-40"
          />
          
          {/* Desktop: PNG overlay with transparent areas */}
          <div className="hidden sm:block absolute inset-0">
            <OptimizedImage
              src={backgroundSphere}
              alt="Artistic sphere overlay"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* White overlay */}
          <div className="absolute inset-0 bg-white/80"></div>

          {/* Second Quote Block - Gardens appear poetry */}
          <div className="absolute top-1/4 left-6 sm:left-12 lg:left-20 z-10 hidden sm:block">
            <div className="max-w-md">
              <p className="font-heading text-stone-800 leading-snug">
                <span className="block text-2xl lg:text-3xl xl:text-4xl italic">Gardens appear</span>
                <span className="block text-3xl lg:text-4xl xl:text-5xl font-bold mt-1">whether you mean</span>
                <span className="block text-3xl lg:text-4xl xl:text-5xl font-bold ml-8 lg:ml-12">them to</span>
                <span className="block text-xl lg:text-2xl xl:text-3xl italic ml-16 lg:ml-24 mt-1">or not,</span>
                <span className="block text-lg lg:text-xl xl:text-2xl italic mt-2 ml-4 lg:ml-6">and these many years later</span>
                <span className="block text-3xl lg:text-4xl xl:text-5xl font-bold mt-1">my action figures</span>
                <span className="block text-xl lg:text-2xl xl:text-3xl italic">have grown taller than</span>
                <span className="block text-lg lg:text-xl xl:text-2xl ml-2">the boy that buried them."</span>
              </p>
              {/* Kanji Signature */}
              <div className="mt-6 ml-20 lg:ml-32">
                <OptimizedImage
                  src={signatureYamakawa}
                  alt="Yamakawa signature in kanji"
                  className="w-24 lg:w-32 opacity-70"
                />
              </div>
            </div>
          </div>

          {/* Mobile text */}
          <div className="sm:hidden absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center px-8">
              <p className="font-heading text-xl text-stone-700 italic leading-relaxed">
                A writer and composer exploring the spaces between form and possibility
              </p>
            </div>
          </div>

          {/* Desktop text at bottom right - word by word fade in */}
          <div 
            data-scroll-animation="bottom-right-text"
            className={`hidden sm:block absolute bottom-24 right-12 lg:right-20 z-10 ${visibleElements.has("bottom-right-text") ? "visible" : ""}`}
          >
            <p className="font-heading text-4xl lg:text-5xl xl:text-6xl text-stone-800 tracking-wide italic">
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-1" : ""}`}>None</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-2" : ""}`}> of</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-3" : ""}`}> this</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-4" : ""}`}> is</span>
              <span className={`opacity-0 ${visibleElements.has("bottom-right-text") ? "animate-word-fade-slow-5" : ""}`}> real</span>
            </p>
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-black py-12 sm:py-16 px-6 sm:px-12 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="font-heading text-2xl sm:text-3xl text-stone-300 mb-4">Contact</h3>
          <a 
            href="mailto:kazuki@kazukiyamakawa.com" 
            className="font-body text-stone-400 hover:text-white transition-colors text-sm sm:text-base"
          >
            kazuki@kazukiyamakawa.com
          </a>
        </div>
      </footer>
    </div>
  );
};

export default About;
