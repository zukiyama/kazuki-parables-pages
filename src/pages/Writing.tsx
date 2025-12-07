import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";

import { YoungAdultSlideshow, YoungAdultSlideshowRef } from "@/components/YoungAdultSlideshow";
import { BookCoverSlideshow } from "@/components/BookCoverSlideshow";
import { BookshelfMenu } from "@/components/BookshelfMenu";

// Background images
import schoolBackground from "@/assets/school-background-montage.jpg";
import hoaxBackground from "@/assets/hoax-background.jpg";
import theMarketBackground from "@/assets/the-market-background-new.jpg";
import howBackground from "@/assets/how-background.jpg";
import viceVersaBackground from "@/assets/vice-versa-background.jpg";
import amyaVillageBackground from "@/assets/amya-village-background.png";
import amyaNewBackground from "@/assets/amya-new-background.png";
import statesOfMotionBackground from "@/assets/states-of-motion-background.png";
import wastelandCityBackground from "@/assets/land-dream-sky-background.png";
import victorianLondonBackground from "@/assets/victorian-london-winter-background.jpg";
import deepSpaceBackground from "@/assets/to-fly-space-battle-background.jpg";
import professorBarnabasBackground from "@/assets/professor-barnabas-background.jpg";

// Book covers
import kaijuCover from "@/assets/kaiju-cover-new.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import theMarketCover from "@/assets/the-market-cover-new.jpg";
import howCover from "@/assets/how-cover.jpg";
import viceVersaCover from "@/assets/vice-versa-cover.jpg";
import amyaCover from "@/assets/amya-cover.png";
import statesOfMotionCover from "@/assets/states-of-motion-cover.png";
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.png";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.png";
import toFlyCover from "@/assets/to-fly-cover-new.png";

const Writing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentYoungAdultBook, setCurrentYoungAdultBook] = useState(0);
  const [backgroundOpacities, setBackgroundOpacities] = useState({
    school: 1,
    hoax: 0,
    theMarket: 0,
    oba: 0,
    statesOfMotion: 0,
    how: 0,
    viceVersa: 0,
    victorianLondon: 0,
    wasteland: 0,
    deepSpace: 0
  });
  const youngAdultSlideshowRef = useRef<YoungAdultSlideshowRef>(null);

  // Preload all background images and book covers at once
  useEffect(() => {
    const allImages = [
      // Backgrounds
      schoolBackground,
      hoaxBackground,
      theMarketBackground,
      amyaNewBackground,
      statesOfMotionBackground,
      howBackground,
      viceVersaBackground,
      professorBarnabasBackground,
      wastelandCityBackground,
      deepSpaceBackground,
      // Young Adult book covers
      professorBarnabasCover,
      landDreamSkyCover,
      toFlyCover
    ];
    
    allImages.forEach(imgSrc => {
      const img = new Image();
      img.src = imgSrc;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Check which sections are visible
      const sections = document.querySelectorAll('[data-section]');
      const newVisibleSections = new Set<string>();
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionId = section.getAttribute('data-section');
        
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
          if (sectionId) newVisibleSections.add(sectionId);
        }
      });
      
      setVisibleSections(newVisibleSections);

      // Update background opacities based on visible section
      const newOpacities = {
        school: 0,
        hoax: 0,
        theMarket: 0,
        oba: 0,
        statesOfMotion: 0,
        how: 0,
        viceVersa: 0,
        victorianLondon: 0,
        wasteland: 0,
        deepSpace: 0
      };

      if (newVisibleSections.has('vice-versa')) {
        newOpacities.viceVersa = 1;
      } else if (newVisibleSections.has('how')) {
        newOpacities.how = 1;
      } else if (newVisibleSections.has('states-of-motion')) {
        newOpacities.statesOfMotion = 1;
      } else if (newVisibleSections.has('oba')) {
        newOpacities.oba = 1;
      } else if (newVisibleSections.has('the-market')) {
        newOpacities.theMarket = 1;
      } else if (newVisibleSections.has('hoax')) {
        newOpacities.hoax = 1;
      } else if (newVisibleSections.has('young-adult')) {
        // Show different backgrounds based on current young adult book
        if (currentYoungAdultBook === 0) {
          newOpacities.victorianLondon = 1; // Professor Barnabas
        } else if (currentYoungAdultBook === 1) {
          newOpacities.wasteland = 1; // The Land is a Dream of the Sky
        } else if (currentYoungAdultBook === 2) {
          newOpacities.deepSpace = 1; // To Fly
        } else {
          newOpacities.school = 1; // Default school background
        }
      } else {
        newOpacities.school = 1;
      }

      setBackgroundOpacities(newOpacities);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, [currentYoungAdultBook]);

  const handleBookClick = (bookId: string, slideToBook?: number) => {
    // If it's a young adult book, set the slideshow to show that book IMMEDIATELY
    if (slideToBook !== undefined && youngAdultSlideshowRef.current) {
      youngAdultSlideshowRef.current.setCurrentBook(slideToBook);
    }
  };

  return (
    <div className="min-h-screen relative max-sm:overflow-x-hidden">
      <Navigation />
      <BookshelfMenu 
        onBookClick={handleBookClick} 
        visibleSections={visibleSections} 
        currentYoungAdultBook={currentYoungAdultBook}
      />
      
      {/* Stacked Background Images - All preloaded */}
      <div className="fixed top-0 left-0 z-0" style={{ height: '100vh', width: '100vw' }}>
        <img 
          src={schoolBackground} 
          alt="School background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.school }}
        />
        <img 
          src={hoaxBackground} 
          alt="Hoax background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.hoax }}
        />
        <img 
          src={theMarketBackground} 
          alt="The Market background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.theMarket }}
        />
        <img 
          src={howBackground} 
          alt="HOW background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.how }}
        />
        <img 
          src={viceVersaBackground} 
          alt="Vice Versa background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.viceVersa }}
        />
        <img 
          src={amyaNewBackground} 
          alt="AMYA background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out brightness-150"
          style={{ opacity: backgroundOpacities.oba }}
        />
        <img 
          src={statesOfMotionBackground} 
          alt="States of Motion background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out brightness-125"
          style={{ opacity: backgroundOpacities.statesOfMotion }}
        />
        <img 
          src={professorBarnabasBackground} 
          alt="Professor Barnabas background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.victorianLondon }}
        />
        <img 
          src={wastelandCityBackground} 
          alt="Wasteland City background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.wasteland }}
        />
        <img 
          src={deepSpaceBackground} 
          alt="Space battle background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.deepSpace }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
      </div>
      
      <main className="relative z-10 pt-32 max-sm:pt-48">
        {/* KAIJU - The Parable Trilogy Section */}
        <section data-section="kaiju" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h1 className={`font-serif text-6xl font-bold text-white mb-20 max-sm:mb-16 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Novels
              </h1>
              
              {/* The Parable Trilogy Introduction */}
              <div className={`text-center mb-16 transition-all duration-1000 delay-200 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <h2 className="font-serif text-4xl font-bold text-yellow-300 mb-6">The Parable Trilogy</h2>
                <p className="font-serif text-lg leading-relaxed text-white max-w-4xl mx-auto">
                  A metaphysical saga spanning 1970s Japan, weaving together childhood wonder and otherworldly encounters. Out of this world adventures await in this compelling trilogy that explores the boundaries between reality and imagination.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: kaijuCover, alt: "KAIJU - Book One Cover" }
                    ]}
                    title="KAIJU"
                    loading="eager"
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Japanese newspaper clipping style */}
                  <div className="relative transform rotate-1">
                    <div className="bg-amber-50 p-6 shadow-xl" style={{
                      clipPath: 'polygon(2% 0%, 98% 1%, 100% 97%, 3% 100%)',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fef3c7 100%)'
                    }}>
                      <div className="border-b-2 border-amber-900/30 pb-3 mb-4">
                        <span className="text-amber-900/60 text-xs tracking-widest font-mono">夏 1979 • SUMMER CHRONICLE</span>
                      </div>
                      <h2 className="font-serif text-5xl font-bold mb-2 text-amber-900">
                        KAIJU
                      </h2>
                      <h3 className="font-serif text-xl text-amber-700 mb-4 tracking-wide border-b border-amber-900/20 pb-3">
                        Book One of The Parable Trilogy
                      </h3>
                      <p className="font-serif text-base leading-relaxed text-amber-900/90">
                        A mystery unfolds in a small Japanese town in summer 1979, where a group of boys discover that no one remembers how they got there. Strange creatures appear in the sky while the children search for answers in their forgotten past.
                      </p>
                      <div className="mt-4 flex justify-end">
                        <span className="text-amber-800/50 text-xs font-mono">第一巻</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOAX Section - Fixed require error */}
        <section data-section="hoax" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`order-1 transition-all duration-1000 delay-300 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: hoaxCover, alt: "HOAX Book Cover" }
                    ]}
                    title="HOAX"
                    loading="lazy"
                  />
                </div>
                <div className={`order-2 transition-all duration-1000 delay-500 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Post-it note taped to screen */}
                  <div className="relative transform -rotate-2">
                    {/* Tape strips */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-amber-100/70 transform rotate-3 shadow-sm" style={{ backdropFilter: 'blur(1px)' }}></div>
                    <div className="bg-yellow-200 p-6 shadow-lg transform" style={{
                      background: 'linear-gradient(180deg, #fef08a 0%, #fde047 100%)',
                      boxShadow: '4px 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5)'
                    }}>
                      <h2 className="font-serif text-4xl font-bold mb-4 text-amber-900" style={{ fontFamily: 'Georgia, serif' }}>
                        HOAX
                      </h2>
                      <p className="text-lg leading-relaxed text-amber-900/90" style={{ fontFamily: 'Georgia, serif' }}>
                        A writer named Peter Carlyle wrote a book, then received a mysterious phone call. When he drove to the location, it felt like he was living inside his own story. Set in a strange commune in the Australian outback, where fairy lights drape over entrance arches and secrets hide in the vegetable patches.
                      </p>
                      <div className="mt-4 text-right">
                        <span className="text-amber-700/60 text-sm italic">— read this one</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE MARKET Section */}
        <section data-section="the-market" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('the-market') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: theMarketCover, alt: "THE MARKET Book Cover" }
                    ]}
                    title="THE MARKET"
                    loading="lazy"
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('the-market') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Futuristic holographic display */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg"></div>
                    <div className="relative bg-gradient-to-br from-slate-900/90 via-cyan-950/80 to-slate-900/90 p-6 rounded border border-cyan-400/40" style={{
                      boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(34, 211, 238, 0.2)'
                    }}>
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-400/30">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-cyan-400/80 text-xs font-mono tracking-widest">CORP_NATION_01 // CLASSIFIED</span>
                      </div>
                      <h2 className="font-mono text-4xl font-bold mb-4 text-cyan-300 tracking-tight">
                        THE MARKET
                      </h2>
                      <p className="font-sans text-base leading-relaxed text-cyan-100/90">
                        A man journeys to the first corporate nation on Earth, where towering glass structures pierce the sky and autonomous vehicles glide through pristine streets. But beneath the gleaming facade of this technological paradise, all is not as it seems. Dark secrets lurk in the shadows of progress, and the price of perfection may be higher than anyone imagined.
                      </p>
                      <div className="mt-4 flex justify-between items-center text-cyan-400/50 text-xs font-mono">
                        <span>ACCESS: LEVEL-7</span>
                        <span className="animate-pulse">●●● LIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AMYA Section */}
        <section data-section="oba" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`lg:order-2 transition-all duration-1000 delay-300 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: amyaCover, alt: "AMYA Book Cover" }
                    ]}
                    title="AMYA"
                    loading="lazy"
                  />
                </div>
                <div className={`lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Aged parchment letter style */}
                  <div className="relative transform rotate-1">
                    <div className="bg-stone-100 p-8 shadow-xl" style={{
                      background: 'linear-gradient(145deg, #f5f0e6 0%, #e8dfd0 50%, #f5f0e6 100%)',
                      boxShadow: '6px 6px 20px rgba(0,0,0,0.3)',
                      borderRadius: '2px'
                    }}>
                      <div className="border-b border-stone-400/40 pb-2 mb-4">
                        <span className="text-stone-500 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>From the journals of a wanderer...</span>
                      </div>
                      <h2 className="text-5xl font-bold mb-4 text-stone-800" style={{ fontFamily: 'Palatino, Georgia, serif' }}>
                        AMYA
                      </h2>
                      <p className="text-base leading-relaxed text-stone-700" style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}>
                        A haunting tale of mystery and transformation. In a world where ancient secrets collide with modern reality, a young woman discovers that her destiny is intertwined with forces beyond her understanding. As she navigates through layers of deception and truth, she must choose between the life she knows and the path that calls to her soul.
                      </p>
                      <div className="mt-6 flex justify-end">
                        <span className="text-stone-500 italic text-sm" style={{ fontFamily: 'Brush Script MT, cursive' }}>~ a story waiting to be told</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STATES OF MOTION Section */}
        <section data-section="states-of-motion" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('states-of-motion') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: statesOfMotionCover, alt: "STATES OF MOTION Book Cover" }
                    ]}
                    title="STATES OF MOTION"
                    loading="lazy"
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('states-of-motion') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Blueprint / technical diagram style */}
                  <div className="relative">
                    <div className="bg-blue-950 p-6 border-2 border-blue-400/50" style={{
                      background: 'linear-gradient(180deg, #172554 0%, #1e3a5f 100%)',
                      boxShadow: 'inset 0 0 60px rgba(59, 130, 246, 0.1)'
                    }}>
                      {/* Grid overlay */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: 'linear-gradient(rgba(147, 197, 253, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147, 197, 253, 0.3) 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }}></div>
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-400/30">
                          <span className="text-blue-300/70 text-xs font-mono">SPEC // REV.03</span>
                          <div className="flex-1 border-t border-dashed border-blue-400/30"></div>
                        </div>
                        <h2 className="font-mono text-4xl font-bold mb-4 text-blue-200 tracking-wide">
                          STATES OF MOTION
                        </h2>
                        <p className="font-mono text-sm leading-relaxed text-blue-100/80">
                          A captivating exploration of movement, momentum, and the forces that shape our world. Through the lens of physics and human emotion, this novel follows characters whose lives intersect in ways as predictable as gravity and as chaotic as quantum mechanics. A story where science and humanity collide in beautiful, unexpected ways.
                        </p>
                        <div className="mt-4 flex gap-4 text-blue-400/60 text-xs font-mono">
                          <span>v = Δx/Δt</span>
                          <span>•</span>
                          <span>F = ma</span>
                          <span>•</span>
                          <span>E = mc²</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW Section */}
        <section data-section="how" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('how') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: howCover, alt: "HOW Book Cover" }
                    ]}
                    title="HOW"
                    loading="lazy"
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('how') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Zen scroll / meditation card */}
                  <div className="relative">
                    <div className="bg-stone-50 p-8 text-center" style={{
                      background: 'linear-gradient(180deg, #fafaf9 0%, #f5f5f4 100%)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                      borderTop: '4px solid #78716c',
                      borderBottom: '4px solid #78716c'
                    }}>
                      <div className="mb-6">
                        <span className="text-stone-400 text-2xl">道</span>
                      </div>
                      <h2 className="text-6xl font-light mb-6 text-stone-700 tracking-widest" style={{ fontFamily: 'Palatino, Georgia, serif' }}>
                        HOW
                      </h2>
                      <div className="w-16 h-px bg-stone-300 mx-auto mb-6"></div>
                      <p className="text-base leading-loose text-stone-600 max-w-md mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
                        A philosophical exploration of understanding and wisdom. Through ancient teachings and modern perspectives, this book delves into the fundamental questions of existence, consciousness, and the path to enlightenment.
                      </p>
                      <div className="mt-8">
                        <span className="text-stone-400 text-sm italic">A journey that bridges East and West</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* VICE VERSA Section */}
        <section data-section="vice-versa" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`order-2 lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('vice-versa') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  {/* Noir detective case file / manila folder */}
                  <div className="relative transform -rotate-1">
                    {/* Red CLASSIFIED stamp */}
                    <div className="absolute -top-2 -right-2 z-10 transform rotate-12">
                      <span className="text-red-600 font-bold text-sm tracking-widest border-2 border-red-600 px-2 py-1 bg-amber-50/90" style={{ fontFamily: 'Impact, sans-serif' }}>CLASSIFIED</span>
                    </div>
                    <div className="bg-amber-100 p-6 shadow-lg" style={{
                      background: 'linear-gradient(135deg, #d4a574 0%, #c9a66b 20%, #e8d5b7 100%)',
                      boxShadow: '4px 4px 15px rgba(0,0,0,0.4)'
                    }}>
                      <div className="border-b border-amber-800/30 pb-2 mb-4 flex justify-between items-center">
                        <span className="text-amber-900/60 text-xs font-mono">CASE FILE #VV-1947</span>
                        <span className="text-red-700/70 text-xs font-bold">UNSOLVED</span>
                      </div>
                      <h2 className="font-serif text-4xl font-bold mb-4 text-amber-950" style={{ fontFamily: 'Courier New, monospace' }}>
                        VICE VERSA
                      </h2>
                      <p className="text-base leading-relaxed text-amber-900/90" style={{ fontFamily: 'Courier New, monospace' }}>
                        A noir mystery set in the shadowy streets of a retro-futuristic metropolis. When detective Marcus Kane investigates a series of impossible crimes, he discovers that reality itself is not what it seems. In a world where identities can be stolen and memories can be traded, nothing is as it appears.
                      </p>
                      <div className="mt-4 pt-3 border-t border-amber-800/20 flex justify-between">
                        <span className="text-amber-800/50 text-xs font-mono">DETECTIVE: M. KANE</span>
                        <span className="text-amber-800/50 text-xs font-mono">STATUS: ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 ${
                  visibleSections.has('vice-versa') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: viceVersaCover, alt: "VICE VERSA Book Cover" }
                    ]}
                    title="VICE VERSA"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Young Adult Books Section */}
        <section data-section="young-adult" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className={`font-serif text-5xl font-bold text-white mb-4 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Young Adult Series
              </h2>
              <p className={`font-serif text-xl text-yellow-300 mb-12 text-center transition-all duration-1000 delay-300 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Books of imagination for any age
              </p>
              
              <div className={`transition-all duration-1000 delay-500 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <YoungAdultSlideshow 
                  ref={youngAdultSlideshowRef} 
                  onBookChange={setCurrentYoungAdultBook}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 relative z-10">
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

export default Writing;