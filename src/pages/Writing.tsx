import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";

import { YoungAdultSlideshow, YoungAdultSlideshowRef } from "@/components/YoungAdultSlideshow";
import { BookCoverSlideshow } from "@/components/BookCoverSlideshow";
import { BookshelfMenu } from "@/components/BookshelfMenu";
import { FloatingQuote } from "@/components/FloatingQuote";

// Background images
import schoolBackground from "@/assets/school-background-montage.jpg";
import hoaxBackground from "@/assets/hoax-background-desert-road.jpeg";
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
  useScrollToTop();
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
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const isSnapping = useRef(false);

  const location = useLocation();

  // Get dynamic header bottom position
  const getHeaderBottom = useCallback(() => {
    if (!headerRef.current) {
      headerRef.current = document.querySelector('nav.fixed, [data-header]') as HTMLElement;
    }
    if (headerRef.current) {
      return headerRef.current.getBoundingClientRect().bottom;
    }
    return 64;
  }, []);


  // Handle hash navigation to scroll to Parable Trilogy section
  useEffect(() => {
    if (location.hash === '#kaiju') {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        const parableTrilogy = document.querySelector('[data-section="kaiju"] h2');
        if (parableTrilogy) {
          const rect = parableTrilogy.getBoundingClientRect();
          const scrollTop = window.pageYOffset + rect.top - 100; // 100px offset for nav
          window.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Scroll to top for non-hash navigation
      window.scrollTo(0, 0);
    }
  }, [location]);

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


  // Scroll snap logic - loose snapping, only when section fills most of screen
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastSnappedSection: string | null = null;
    
    // Sections that should NOT have snap behavior (except young-adult which has special handling)
    const noSnapSections = ['kaiju'];

    const getBookSections = () => {
      const sections = document.querySelectorAll('[data-section]');
      const bookSections: { el: HTMLElement; name: string }[] = [];
      
      sections.forEach(section => {
        const name = section.getAttribute('data-section');
        // Only include sections that should have snap behavior
        if (name && !noSnapSections.includes(name)) {
          bookSections.push({ el: section as HTMLElement, name });
        }
      });
      
      return bookSections;
    };

    const getCenterSnapPoint = (section: HTMLElement, sectionName: string) => {
      const headerBottom = getHeaderBottom();
      const banner = document.querySelector('.sticky.top-16') as HTMLElement;
      const bannerHeight = banner ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - topOffset;
      
      // Special handling for young-adult section
      if (sectionName === 'young-adult') {
        const footer = document.querySelector('footer') as HTMLElement;
        const footerTop = footer ? footer.getBoundingClientRect().top + window.scrollY : document.body.scrollHeight;
        
        // Find the title element and slideshow container
        const titleEl = section.querySelector('h2') as HTMLElement;
        const slideshowContainer = section.querySelector('.transition-all.duration-1000.delay-500') as HTMLElement;
        
        if (!titleEl || !slideshowContainer) return null;
        
        const titleRect = titleEl.getBoundingClientRect();
        const slideshowRect = slideshowContainer.getBoundingClientRect();
        
        // Calculate total height of title + subtitle + slideshow
        const titleTop = titleRect.top + window.scrollY;
        const slideshowBottom = slideshowRect.bottom + window.scrollY;
        const totalContentHeight = slideshowBottom - titleTop;
        
        // Calculate available space between banner bottom and footer top at current scroll
        const footerTopInViewport = footerTop - window.scrollY;
        const availableSpaceForContent = footerTopInViewport - topOffset;
        
        // Scenario A: Can fit all content (title + slideshow)
        if (availableSpaceForContent >= totalContentHeight + 40) { // 40px buffer
          // Center the entire content (title to slideshow bottom) in the available space
          const contentCenter = titleTop + (totalContentHeight / 2);
          const desiredCenterY = topOffset + (availableHeight / 2);
          return Math.max(0, contentCenter - desiredCenterY);
        } else {
          // Scenario B: Can't fit all, just center the slideshow
          const slideshowTop = slideshowRect.top + window.scrollY;
          const slideshowHeight = slideshowRect.height;
          const slideshowCenter = slideshowTop + (slideshowHeight / 2);
          const desiredCenterY = topOffset + (availableHeight / 2);
          return Math.max(0, slideshowCenter - desiredCenterY);
        }
      }
      
      // For book sections: center the book cover
      const bookCover = section.querySelector('.book-cover-slideshow img, [data-book-cover], img[alt*="Cover"]') as HTMLElement;
      if (!bookCover) {
        return null;
      }

      const coverRect = bookCover.getBoundingClientRect();
      const coverHeight = coverRect.height;
      const coverTop = coverRect.top + window.scrollY;
      const coverCenter = coverTop + (coverHeight / 2);
      const desiredCenterY = topOffset + (availableHeight / 2);
      
      return Math.max(0, coverCenter - desiredCenterY);
    };

    const snapToPoint = (targetY: number, sectionName: string) => {
      if (isSnapping.current) return;
      isSnapping.current = true;
      lastSnappedSection = sectionName;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isSnapping.current = false;
      }, 600);
    };

    const handleScrollEnd = () => {
      if (isSnapping.current) return;
      
      const bookSections = getBookSections();
      if (bookSections.length === 0) return;

      // Check if we're in the no-snap zone (before HOAX)
      const hoaxSection = document.querySelector('[data-section="hoax"]') as HTMLElement;
      if (hoaxSection) {
        const hoaxRect = hoaxSection.getBoundingClientRect();
        // If HOAX is below the viewport center, we're still in the no-snap zone
        if (hoaxRect.top > window.innerHeight * 0.7) {
          return; // Don't snap
        }
      }

      const headerBottom = getHeaderBottom();
      const banner = document.querySelector('.sticky.top-16') as HTMLElement;
      const bannerHeight = banner ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      const viewportHeight = window.innerHeight;
      const availableViewport = viewportHeight - topOffset;

      // Find section that fills MOST of the screen (>50%)
      let bestSection: typeof bookSections[0] | null = null;
      let highestVisibility = 0;

      for (const section of bookSections) {
        const rect = section.el.getBoundingClientRect();
        
        const visibleTop = Math.max(rect.top, topOffset);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        
        // Calculate what percentage of the VIEWPORT this section fills
        const viewportFillRatio = visibleHeight / availableViewport;
        
        if (viewportFillRatio > highestVisibility) {
          highestVisibility = viewportFillRatio;
          bestSection = section;
        }
      }

      // Only snap if:
      // 1. Section fills >50% of viewport
      // 2. It's not the section we just snapped away from
      if (bestSection && highestVisibility > 0.5) {
        // If scrolling away from last snapped section, don't snap back
        if (lastSnappedSection === bestSection.name) {
          // Clear the last snapped section so we can snap to it again later
          // but only if it now fills >70% (truly dominant)
          if (highestVisibility < 0.7) {
            lastSnappedSection = null;
            return;
          }
        }
        
        const snapPoint = getCenterSnapPoint(bestSection.el, bestSection.name);
        const currentScroll = window.scrollY;
        if (snapPoint !== null && Math.abs(currentScroll - snapPoint) > 15) {
          snapToPoint(snapPoint, bestSection.name);
        }
      } else {
        // Not enough visibility - clear last snapped so we can snap fresh
        lastSnappedSection = null;
      }
    };

    const handleScroll = () => {
      if (isSnapping.current) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [getHeaderBottom]);

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
      <div className="fixed top-0 left-0 z-0" style={{ height: '100svh', width: '100vw' }}>
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
      
      <main className="relative z-10 pt-24 max-sm:pt-40">
        {/* KAIJU - The Parable Trilogy Section */}
        <section data-section="kaiju" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h1 className={`font-serif text-6xl font-bold text-white mb-24 max-sm:mb-16 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Novels
              </h1>
              
              {/* The Parable Trilogy Introduction */}
              <div className={`text-center mb-20 transition-all duration-1000 delay-200 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <h2 className="font-serif text-4xl font-bold text-yellow-300 mb-6">The Parable Trilogy</h2>
                <p className="font-serif text-lg md:text-xl leading-relaxed text-white max-w-4xl mx-auto">
                  A metaphysical saga unfolding across the shifting decades of an alternate 20th-century Japan, taking the reader from mysterious towns and abandoned film sets to mountain temples and secret research facilities far from this world. With a cast as varied as its setting, childhood wonder collides with philosophy and fantasy in this compelling trilogy that explores the boundaries between truth and fiction.
                </p>
              </div>
              
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start lg:px-8">
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
                  <h2 className="font-serif font-bold mb-2 text-white" style={{ fontSize: '3rem' }}>
                    KAIJU
                  </h2>
                  <div className="bg-black/75 backdrop-blur-sm rounded-lg px-6 pt-4 pb-6 border border-white/20">
                    <h3 className="font-serif text-yellow-300 mb-6 tracking-wide" style={{ fontSize: 'calc(1rem + 2pt)' }}>
                      Book One of The Parable Trilogy
                    </h3>
                    <p className="font-serif text-base leading-relaxed text-white mb-3">
                      When a foreign object crashes from the sky in Osaka, Japan, and a strange figure steps from the wreckage, psychiatrist Shigemitsu is enlisted by the military to draw on what he remembers of a man he hasn't thought of in twenty years.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-3">
                      For Kenji, new to nearby Nakamura, all that matters is not being the only kid sitting alone in class. He soon finds himself friends with Masako, Kubo and a group of misfits, who realise that they each share a secret, and begin to suspect the town is not all it seems.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white">
                      Hinata Togawa, a policewoman relegated to a dead-end posting at a remote local station, is resigned to an uneventful career. But when a seemingly minor disappearance leads to a trail of unexplained vanishings and deepening corruption, she is forced to confront something far closer to home — and far more dangerous — than she ever imagined.
                    </p>
                  </div>
                </div>
              </div>
              <p className={`font-serif text-xl leading-relaxed text-white italic text-center mt-10 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three groups of people in a 1979 that happened only for those who were there.
              </p>
            </div>
          </div>
        </section>

        {/* HOAX Section - Memo style */}
        <section data-section="hoax" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
                <div className={`lg:order-2 transition-all duration-1000 delay-300 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: hoaxCover, alt: "HOAX Book Cover" }
                    ]}
                    title="HOAX"
                    loading="lazy"
                  />
                </div>
                <div className={`lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                {/* Title above the memo */}
                  <h2 className="font-serif text-5xl font-bold mb-6 text-white tracking-wide drop-shadow-lg">
                    HOAX
                  </h2>
                  
                  {/* Memo sheet taped to page */}
                  <div className="relative">
                    {/* Tape corners */}
                    <div className="absolute -top-2 -left-2 w-10 h-6 bg-amber-100/80 rotate-[-15deg] shadow-sm" style={{ 
                      background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.9) 0%, rgba(253, 224, 71, 0.6) 100%)'
                    }}></div>
                    <div className="absolute -top-2 -right-2 w-10 h-6 bg-amber-100/80 rotate-[12deg] shadow-sm" style={{ 
                      background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.9) 0%, rgba(253, 224, 71, 0.6) 100%)'
                    }}></div>
                    <div className="absolute -bottom-2 -left-2 w-10 h-6 bg-amber-100/80 rotate-[10deg] shadow-sm" style={{ 
                      background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.9) 0%, rgba(253, 224, 71, 0.6) 100%)'
                    }}></div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-6 bg-amber-100/80 rotate-[-8deg] shadow-sm" style={{ 
                      background: 'linear-gradient(135deg, rgba(254, 249, 195, 0.9) 0%, rgba(253, 224, 71, 0.6) 100%)'
                    }}></div>
                    
                    {/* Memo paper */}
                    <div className="p-8 shadow-lg" style={{
                      background: 'linear-gradient(180deg, #fffef5 0%, #fefce8 50%, #fef9c3 100%)',
                      boxShadow: '2px 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}>
                      <p className="font-serif text-base leading-loose text-stone-600 mb-4" style={{ lineHeight: '1.9' }}>
                        Peter Mayhew had hit rock bottom when he wrote Hoax, a pseudo-spiritual parody intended as his sign-off, a final insult to an industry he had grown to despise… and worst of all an overnight bestseller. He had finally made his name — and could never use it again.
                      </p>
                      <p className="font-serif text-base leading-loose text-stone-600 mb-4" style={{ lineHeight: '1.9' }}>
                        A year later, fleeing his reputation in an Australian motel, paralysed by writer's block, with his only opportunities those to write a sequel, he receives a phone call from someone who claims to be part of a cult modelled on his book.
                      </p>
                      <p className="font-serif text-base leading-loose text-stone-600 mb-4" style={{ lineHeight: '1.9' }}>
                        Walking into what feels like his own work come to life, Peter must convince a community it was all a hoax—but in doing so, he begins to question where his book truly came from.
                      </p>
                      <p className="font-serif text-base leading-loose text-stone-600 italic" style={{ lineHeight: '1.9' }}>
                        A mind bending tale of literary fiction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Quote between HOAX and THE MARKET */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <FloatingQuote 
            text="where truth became fiction"
            position="right"
            size="lg"
            offsetY="-20%"
          />
        </div>

        {/* THE MARKET Section */}
        <section data-section="the-market" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
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
                        <span className="text-cyan-400/80 text-xs font-mono tracking-widest">CORP_01 // CLASSIFIED</span>
                      </div>
                      <h2 className="font-mono text-4xl font-bold mb-4 text-cyan-300 tracking-tight">
                        THE MARKET
                      </h2>
                      <p className="font-sans text-base leading-relaxed text-cyan-100/90 mb-3">
                        James Tarreden's new life on <em>Island</em>—the world's first corporate nation-state—seems to be off without a hitch. Zero crime, colleagues who like him—even his love life is going disconcertingly well. In fact, everything is falling into place a little too easily…
                      </p>
                      <p className="font-sans text-base leading-relaxed text-cyan-100/90 mb-3">
                        Under the wing of an enigmatic young CEO, James is inducted into the secrets behind his company's new technology, and with everything he knew about reality unravelling, finds himself in an increasingly high-stakes game of cat and mouse to discover the truth of <em>Island</em>, one that gives an entirely new meaning to corporate survival.
                      </p>
                      <p className="font-sans text-sm italic text-cyan-200/80">
                        An existential psychological thriller.
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

        {/* Floating Quote between THE MARKET and AMYA */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <FloatingQuote 
            text="the silence spoke"
            position="left"
            size="xl"
            offsetY="-15%"
          />
        </div>

        {/* AMYA Section */}
        <section data-section="oba" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
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
                  <h2 className="font-serif text-5xl font-bold mb-4 text-white">
                    AMYA
                  </h2>
                  {/* Original dark overlay style */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white mb-3">
                      Set in Nairobi, Kenya. A linguist specialising in rare languages is seconded, reluctantly, to a village where there have been reports of an ancient undiscovered language still being spoken. The village, existing on the fringes of the forest, brings back memories of a childhood he has tried to bury in his urban adult life. While there, he comes across a mute girl who has not spoken since she was born. Silent and guarded around people, in the forest she comes alive, awakening something that has lain silent in him for longer than he can remember.
                    </p>
                    <p className="font-serif text-lg leading-relaxed text-white">
                      Memories of the past interweave with the present as in attempting to help the young girl communicate, he discovers that he may have more to learn from her than she does from him.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Quote between AMYA and STATES OF MOTION */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <FloatingQuote 
            text="a world between worlds"
            position="right"
            size="md"
            offsetY="-15%"
          />
        </div>

        {/* STATES OF MOTION Section */}
        <section data-section="states-of-motion" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
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
                  <h2 className="font-serif text-5xl font-bold mb-4 text-white">
                    STATES OF MOTION
                  </h2>
                  {/* Original dark overlay style - same as AMYA */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-5 border border-white/20">
                    <p className="font-serif text-base leading-relaxed text-white italic mb-3">
                      "…the city was not the arrangement of many things but the shifting posture of one…"
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-2">
                      There is an America between Americas, an idea that every now and then is touched in the course of one life or another before fading, leaving behind a trace of itself and a sense of its own unreality on that which touched it.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-2">
                      A physicist on his way to a conference, carrying in his head a theory too precious to document; as enemy agents close in, is this paranoia, or is paranoia how they operate?
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-2">
                      A pianist haunted by a melody from childhood, a song he has been chasing his entire life.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-2">
                      A man unable to distinguish truth from fiction, whose words are so dangerous they can alter reality itself.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white mb-2">
                      A secret cabal of plumbers employed in an age old scheme that has evolved in the wastes beneath the cities they connect.
                    </p>
                    <p className="font-serif text-base leading-relaxed text-white italic">
                      A novel of multitudes and convergences; a sequel to a story that doesn't exist; a portrait of time and place; all these and more describe a nation seen only at its margins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Quote between STATES OF MOTION and HOW */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <FloatingQuote 
            text="the path unfolds"
            position="left"
            size="lg"
            offsetY="5%"
          />
        </div>

        {/* HOW Section */}
        <section data-section="how" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
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
                  {/* Zen scroll / meditation card - softer background */}
                  <div className="relative">
                    <div className="p-8 text-center" style={{
                      background: 'linear-gradient(180deg, rgba(250, 250, 249, 0.75) 0%, rgba(245, 245, 244, 0.8) 100%)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      borderTop: '3px solid rgba(120, 113, 108, 0.6)',
                      borderBottom: '3px solid rgba(120, 113, 108, 0.6)'
                    }}>
                      <div className="mb-6">
                        <span className="text-stone-500 text-2xl">道</span>
                      </div>
                      <h2 className="text-6xl font-light mb-6 text-stone-700 tracking-widest" style={{ fontFamily: 'Palatino, Georgia, serif' }}>
                        HOW
                      </h2>
                      <div className="w-16 h-px bg-stone-400/50 mx-auto mb-6"></div>
                      <p className="text-base leading-loose text-stone-600 max-w-md mx-auto" style={{ fontFamily: 'Georgia, serif' }}>
                        A philosophical exploration of understanding and wisdom. Through ancient teachings and modern perspectives, this book delves into the fundamental questions of existence, consciousness, and the path to enlightenment.
                      </p>
                      <div className="mt-8">
                        <span className="text-stone-500 text-sm italic">A journey that bridges East and West</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Quote between HOW and VICE VERSA */}
        <div className="relative h-32 md:h-48 overflow-hidden">
          <FloatingQuote 
            text="nothing as it seems"
            position="right"
            size="xl"
            offsetY="-10%"
          />
        </div>

        {/* VICE VERSA Section */}
        <section data-section="vice-versa" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
                <div className={`order-2 lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('vice-versa') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-4 text-white">
                    VICE VERSA
                  </h2>
                  {/* Original dark overlay style */}
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A noir mystery set in the shadowy streets of a retro-futuristic metropolis. When detective Marcus Kane investigates a series of impossible crimes, he discovers that reality itself is not what it seems. In a world where identities can be stolen and memories can be traded, nothing is as it appears.
                    </p>
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
        <section data-section="young-adult" className="min-h-[80vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-24">
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