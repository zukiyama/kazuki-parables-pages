import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnamePendragonBanner from "@/assets/surname-pendragon-banner.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const NAV_HEIGHT = 80;

type SnapPosition = 'banner' | 'god-of-lies' | 'surname-pendragon' | 'free';

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [bannerFaded, setBannerFaded] = useState(false);
  const [godOfLiesLoaded, setGodOfLiesLoaded] = useState(false);
  const [currentSnap, setCurrentSnap] = useState<SnapPosition>('banner');
  const [isSnapping, setIsSnapping] = useState(false);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLElement>(null);
  const godOfLiesRef = useRef<HTMLElement>(null);
  const surnamePendragonRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  // Always scroll to top on mount/navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    setCurrentSnap('banner');
    setBannerFaded(false);
  }, []);

  // Calculate snap positions
  const getSnapPositions = useCallback(() => {
    const container = scrollContainerRef.current;
    const godOfLiesEl = godOfLiesRef.current;
    const surnamePendragonEl = surnamePendragonRef.current;
    const bannerEl = bannerRef.current;
    
    if (!container || !godOfLiesEl || !surnamePendragonEl || !bannerEl) return null;
    
    const viewportHeight = window.innerHeight;
    const bannerHeight = bannerEl.offsetHeight;
    const godOfLiesHeight = godOfLiesEl.offsetHeight;
    
    // God of Lies: bottom of image aligns with bottom of screen
    // scrollY position where bottom of God of Lies image = bottom of viewport
    const godOfLiesSnapY = NAV_HEIGHT + bannerHeight + godOfLiesHeight - viewportHeight;
    
    // Surname Pendragon: top of image aligns with top of screen (no header visible)
    const surnamePendragonSnapY = NAV_HEIGHT + bannerHeight + godOfLiesHeight;
    
    // Free scroll starts after Surname Pendragon
    const freeScrollStartY = surnamePendragonSnapY + surnamePendragonEl.offsetHeight;
    
    return {
      banner: 0,
      godOfLies: Math.max(0, godOfLiesSnapY),
      surnamePendragon: surnamePendragonSnapY,
      freeScrollStart: freeScrollStartY,
    };
  }, []);

  // Handle scroll snap
  const handleScroll = useCallback(() => {
    if (isSnapping) return;
    
    const scrollY = window.scrollY;
    const positions = getSnapPositions();
    if (!positions) return;
    
    const scrollingDown = scrollY > lastScrollY.current;
    lastScrollY.current = scrollY;
    
    // Clear existing timeout
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }
    
    // Debounce snap decision
    scrollTimeout.current = setTimeout(() => {
      const currentY = window.scrollY;
      const newPositions = getSnapPositions();
      if (!newPositions) return;
      
      // Determine which section we should snap to
      if (currentY < newPositions.godOfLies - 50) {
        // Near banner area
        if (scrollingDown && currentY > 30) {
          // Snap to God of Lies (bottom aligned)
          snapTo(newPositions.godOfLies, 'god-of-lies');
        }
      } else if (currentY >= newPositions.godOfLies - 50 && currentY < newPositions.surnamePendragon - 100) {
        // In God of Lies zone
        if (scrollingDown) {
          // Snap to Surname Pendragon (top aligned)
          snapTo(newPositions.surnamePendragon, 'surname-pendragon');
        } else {
          // Snap back to God of Lies
          snapTo(newPositions.godOfLies, 'god-of-lies');
        }
      } else if (currentY >= newPositions.surnamePendragon - 100 && currentY < newPositions.freeScrollStart - 100) {
        // In Surname Pendragon zone
        if (!scrollingDown && currentY < newPositions.surnamePendragon + 100) {
          // Scrolling up, snap back to God of Lies
          snapTo(newPositions.godOfLies, 'god-of-lies');
        } else if (scrollingDown) {
          // Let it scroll free past Surname Pendragon
          setCurrentSnap('free');
        }
      } else if (currentY >= newPositions.freeScrollStart - 100) {
        // Free scroll zone - but check if scrolling up
        if (!scrollingDown && currentY < newPositions.freeScrollStart + 200) {
          // Scrolling up from free zone, snap to Surname Pendragon
          snapTo(newPositions.surnamePendragon, 'surname-pendragon');
        } else {
          setCurrentSnap('free');
        }
      }
    }, 100);
    
    // Update banner fade based on scroll position
    const bannerHeight = bannerRef.current?.offsetHeight || 0;
    if (scrollY > bannerHeight / 2) {
      setBannerFaded(true);
    } else {
      setBannerFaded(false);
    }
  }, [isSnapping, getSnapPositions]);

  const snapTo = useCallback((y: number, snapPosition: SnapPosition) => {
    setIsSnapping(true);
    setCurrentSnap(snapPosition);
    
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
    
    // Reset snapping flag after animation
    setTimeout(() => {
      setIsSnapping(false);
    }, 500);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [handleScroll]);

  // Observe comic rows for staggered reveal
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

      {/* Main Content */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-hidden"
        style={{ paddingTop: `${NAV_HEIGHT}px` }}
      >
        {/* Title Banner - Fades on first snap */}
        <header 
          ref={bannerRef}
          className="bg-black text-center py-6 px-4 transition-opacity duration-500 ease-out"
          style={{
            opacity: bannerFaded ? 0 : 1,
            pointerEvents: bannerFaded ? 'none' : 'auto',
          }}
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

        {/* GOD OF LIES - Snap Section */}
        <section 
          ref={godOfLiesRef}
          className="w-full"
        >
          <img 
            src={godOfLiesCover}
            alt="God of Lies"
            className="w-full"
            onLoad={() => setGodOfLiesLoaded(true)}
          />
        </section>

        {/* SURNAME PENDRAGON - Snap Section */}
        <section 
          ref={surnamePendragonRef}
          className="w-full"
        >
          <img 
            src={surnamePendragonBanner}
            alt="Surname Pendragon"
            className="w-full"
          />
        </section>

        {/* Stories Waiting to be Told Section - Free scroll from here */}
        <section className="text-center py-16 sm:py-24 bg-[#f5f0e6]">
          {godOfLiesLoaded && (
            <ScrollScale 
              initialScale={1.3} 
              finalScale={1} 
              initialBlur={3}
              className="text-center"
            >
              <blockquote>
                <h2 
                  className="text-3xl sm:text-5xl lg:text-6xl text-foreground/70 italic leading-relaxed tracking-wide mb-6"
                  style={{ fontFamily: 'EB Garamond, serif' }}
                >
                  "Stories waiting to be told..."
                </h2>
              </blockquote>
              <div className="w-24 h-1 bg-amber-800 mx-auto rounded-full mb-2" />
              <div className="w-16 h-0.5 bg-amber-800/60 mx-auto rounded-full" />
            </ScrollScale>
          )}
        </section>

        {/* Forthcoming Comics Grid - Scrolls freely */}
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
        
        <footer className="bg-slate-900 py-10 max-sm:py-6">
          <div className="container mx-auto px-6 text-center">
            <h3 className="font-heading text-xl mb-3 text-white">Contact</h3>
            <p className="font-serif text-slate-300 text-sm">
              kazuki@kazukiyamakawa.com
            </p>
          </div>
        </footer>
      </div>

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
