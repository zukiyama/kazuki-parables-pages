import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnamePendragonBanner from "@/assets/surname-pendragon-banner.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const Comics = () => {
  useScrollToTop();
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [showGodOfLiesDescription, setShowGodOfLiesDescription] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  
  // Refs for snap sections
  const bannerSectionRef = useRef<HTMLElement>(null);
  const godOfLiesSectionRef = useRef<HTMLElement>(null);
  const pendragonSectionRef = useRef<HTMLElement>(null);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  // Track scroll for God of Lies description slide-in
  useEffect(() => {
    const handleScroll = () => {
      if (godOfLiesSectionRef.current) {
        const rect = godOfLiesSectionRef.current.getBoundingClientRect();
        // Show description when scrolled past 30% of the image
        const threshold = rect.height * 0.3;
        setShowGodOfLiesDescription(rect.top < -threshold);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get dynamic header height (accounts for browser chrome showing/hiding)
  const getHeaderBottom = useCallback(() => {
    // Try to get the actual header element
    if (!headerRef.current) {
      headerRef.current = document.querySelector('header.fixed, nav.fixed, [data-header]') as HTMLElement;
    }
    if (headerRef.current) {
      return headerRef.current.getBoundingClientRect().bottom;
    }
    // Fallback to fixed 64px if header not found
    return 64;
  }, []);

  // Reset scroll position on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll snap logic - loose snapping, only when section fills most of screen
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let isSnapping = false;
    let lastSnappedSection: string | null = null;

    const getSnapSections = () => {
      const bannerEl = bannerSectionRef.current;
      const godOfLiesEl = godOfLiesSectionRef.current;
      const pendragonEl = pendragonSectionRef.current;
      
      if (!bannerEl || !godOfLiesEl || !pendragonEl) return [];

      const headerBottom = getHeaderBottom();
      
      return [
        { 
          el: bannerEl, 
          name: 'banner',
          snapPoint: 0
        },
        { 
          el: godOfLiesEl, 
          name: 'godOfLies',
          snapPoint: godOfLiesEl.getBoundingClientRect().top + window.scrollY - headerBottom
        },
        { 
          el: pendragonEl, 
          name: 'pendragon',
          snapPoint: pendragonEl.getBoundingClientRect().top + window.scrollY - headerBottom
        }
      ];
    };

    const snapToPoint = (targetY: number, sectionName: string) => {
      isSnapping = true;
      lastSnappedSection = sectionName;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
      setTimeout(() => {
        isSnapping = false;
      }, 500);
    };

    const handleScrollEnd = () => {
      if (isSnapping) return;
      
      const sections = getSnapSections();
      if (sections.length === 0) return;

      const headerBottom = getHeaderBottom();
      const viewportHeight = window.innerHeight;
      const viewportTop = headerBottom;
      const viewportBottom = viewportHeight;
      const availableViewport = viewportBottom - viewportTop;
      
      // Check if we're in the free-scroll zone below pendragon
      const pendragonSection = sections.find(s => s.name === 'pendragon');
      if (pendragonSection) {
        const pendragonRect = pendragonSection.el.getBoundingClientRect();
        
        // If pendragon's bottom is above the header (we're past it)
        if (pendragonRect.bottom < headerBottom) {
          // Free scroll zone - no snapping at all (even when scrolling up close to it)
          return;
        }
      }

      // Find section that fills MOST of the screen (>50%)
      let bestSection: typeof sections[0] | null = null;
      let highestVisibility = 0;

      for (const section of sections) {
        const rect = section.el.getBoundingClientRect();
        const sectionHeight = rect.height;
        
        const visibleTop = Math.max(rect.top, viewportTop);
        const visibleBottom = Math.min(rect.bottom, viewportBottom);
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
        
        const currentScroll = window.scrollY;
        if (Math.abs(currentScroll - bestSection.snapPoint) > 10) {
          snapToPoint(bestSection.snapPoint, bestSection.name);
        }
      } else {
        // Not enough visibility - clear last snapped so we can snap fresh
        lastSnappedSection = null;
      }
    };

    const handleScroll = () => {
      if (isSnapping) return;
      
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rowId = entry.target.getAttribute('data-row');
            if (rowId) {
              setVisibleRows((prev) => new Set(prev).add(rowId));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (row1Ref.current) observer.observe(row1Ref.current);
    if (row2Ref.current) observer.observe(row2Ref.current);

    return () => observer.disconnect();
  }, []);

  const smallShelfComics = [
    {
      cover: burdenCoverNew,
      title: "The Burden",
      description: "A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.",
      teaser: "Family duty weighs heavier than expected burdens."
    },
    {
      cover: mrMiracleCoverNew,
      title: "Mr. Miracle", 
      description: "A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways.",
      teaser: "Sometimes the most ordinary man holds extraordinary secrets."
    },
    {
      cover: soulTiedCover,
      title: "Soul Tied",
      description: "Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.",
      teaser: "Destiny binds two souls in chaos and control."
    },
    {
      cover: godsCover,
      title: "Gods!",
      description: "Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career.",
      teaser: "When gods need saving, who do you call?"
    },
    {
      cover: scriptedCover,
      title: "Scripted",
      description: "A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching?",
      teaser: "Reality blurs when every life feels like a performance."
    },
    {
      cover: orangesGoldCoverNew,
      title: "Oranges are Made of Gold",
      description: "A 99-year-old Korean CEO controls a vast orange empire built on rare oranges that grow only on Jeju Island. Instead of naming an heir, he forces his two sons to compete - whoever makes the most profit in one year inherits everything. A tale spanning generations, exploring family legacy, competition, and the price of empire.",
      teaser: "In Jeju's orchards, family rivalry grows sweeter than gold."
    }
  ];

  const handleComicClick = (comic: {cover: string; title: string; description: string; teaser?: string}) => {
    setSelectedComic(comic);
  };

  const handleCloseModal = () => {
    setSelectedComic(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] overflow-x-hidden">
      <Navigation />

      <main className="relative z-10">
        {/* Header Banner - Snap Section 1 */}
        <header 
          ref={bannerSectionRef}
          className="bg-black text-center py-6 px-4 mt-16"
        >
          <h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#e8d9a0] tracking-wide"
            style={{ 
              fontFamily: 'Boogaloo, cursive',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            COMICS AND SCRIPTS
          </h1>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="flex-1 h-px bg-[#e8d9a0]/40 max-w-20" />
            <p className="text-xs sm:text-sm text-[#e8d9a0]/80 tracking-widest uppercase font-light">
              Original Stories in Sequential Art & Screenplay
            </p>
            <div className="flex-1 h-px bg-[#e8d9a0]/40 max-w-20" />
          </div>
        </header>

        {/* GOD OF LIES - Snap Section 2 */}
        <section ref={godOfLiesSectionRef} className="w-screen relative -ml-[calc((100vw-100%)/2)]">
          <img 
            src={godOfLiesCover}
            alt="God of Lies"
            className="w-full block"
            style={{ width: '100vw', maxWidth: 'none' }}
          />
          
          {/* Magazine-style "New Release" badge - right side, above middle */}
          <div 
            className="absolute right-[5%] top-[35%] bg-[#8B0000] px-4 py-2 sm:px-6 sm:py-3 shadow-lg"
            style={{
              transform: 'rotate(2deg)',
              boxShadow: '2px 3px 8px rgba(0,0,0,0.4)',
            }}
          >
            <p 
              className="text-white text-xs sm:text-sm font-bold tracking-wide uppercase"
              style={{ fontFamily: 'Impact, Haettenschweiler, sans-serif' }}
            >
              NEW RELEASE
            </p>
            <p 
              className="text-white/90 text-[10px] sm:text-xs tracking-wider"
              style={{ fontFamily: 'Arial, sans-serif' }}
            >
              First Issue Available Soon
            </p>
          </div>

          {/* Slide-in description box from left */}
          <div 
            className={`absolute bottom-[8%] left-0 max-w-[90%] sm:max-w-[60%] lg:max-w-[45%] transition-all duration-700 ease-out ${
              showGodOfLiesDescription 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-full'
            }`}
          >
            <div 
              className="bg-black/85 backdrop-blur-sm border-l-4 border-[#8B0000] px-4 py-3 sm:px-6 sm:py-4"
              style={{ boxShadow: '4px 4px 15px rgba(0,0,0,0.5)' }}
            >
              <h3 
                className="text-[#e8d9a0] text-lg sm:text-xl font-bold mb-2 tracking-wide"
                style={{ fontFamily: 'Bangers, cursive' }}
              >
                GOD OF LIES
              </h3>
              <p 
                className="text-white/90 text-xs sm:text-sm leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                In a world where truth is currency, one man discovers he can make anyone believe anything. 
                But every lie has a price, and the God of Lies is about to learn that some truths 
                cannot be buried forever. A dark supernatural thriller exploring the thin line 
                between deception and reality.
              </p>
            </div>
          </div>
        </section>

        {/* SURNAME PENDRAGON - Snap Section 3 */}
        <section ref={pendragonSectionRef} className="w-screen relative -ml-[calc((100vw-100%)/2)]">
          <img 
            src={surnamePendragonBanner}
            alt="Surname Pendragon"
            className="w-full block"
            style={{ width: '100vw', maxWidth: 'none' }}
          />
        </section>

        {/* Stories Waiting to be Told - Snap Section 4 */}
        <section ref={storiesSectionRef} className="text-center py-16 sm:py-24 bg-[#f5f0e6]">
          <ScrollScale 
            initialScale={1.3} 
            finalScale={1} 
            initialBlur={3}
            className="text-center"
          >
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl text-black/80 italic leading-tight mb-6"
              style={{ fontFamily: 'EB Garamond, serif' }}
            >
              "Stories waiting to be told..."
            </h2>
            <div className="w-24 h-1 bg-amber-800 mx-auto rounded-full mb-2" />
            <div className="w-16 h-0.5 bg-amber-800/60 mx-auto rounded-full" />
          </ScrollScale>
        </section>

        {/* Forthcoming Comics Grid */}
        <section className="pb-16 px-4 sm:px-6 bg-[#f5f0e6]">
          {/* First Row */}
          <div 
            ref={row1Ref}
            data-row="row1"
            className={`mb-6 transition-all duration-700 ${
              visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
              {smallShelfComics.slice(0, 3).map((comic, index) => (
                <div 
                  key={comic.title} 
                  className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                    visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: visibleRows.has('row1') ? `${index * 150}ms` : '0ms' }}
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full shadow-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div
            ref={row2Ref}
            data-row="row2"
            className={`transition-all duration-700 ${
              visibleRows.has('row2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
              {smallShelfComics.slice(3, 6).map((comic, index) => (
                <div 
                  key={comic.title} 
                  className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl overflow-hidden ${
                    visibleRows.has('row2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: visibleRows.has('row2') ? `${index * 150}ms` : '0ms' }}
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full shadow-lg"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-slate-900 py-10 max-sm:py-6">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-xl mb-3 text-white">Contact</h3>
          <p className="font-serif text-slate-300 text-sm">
            kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 max-sm:p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-sm:max-h-[40vh]">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-md shadow-2xl rounded-lg max-sm:max-h-full max-sm:object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 max-sm:text-xl"
                style={{ fontFamily: 'Boogaloo, cursive' }}
              >
                {selectedComic.title}
              </h3>
              <p className="font-serif text-sm md:text-base text-slate-700 leading-relaxed mb-4 max-sm:text-sm">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="self-start px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comics;