import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";

import surnamePendragonBanner from "@/assets/surname-pendragon-banner.png";
import surnamePendragonMobile from "@/assets/surname-pendragon-mobile.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";
import comicsFooterCharacter from "@/assets/comics-footer-character.png";
import godOfLiesStreetScene from "@/assets/god-of-lies-street-scene.png";
import vignetteApartments from "@/assets/god-of-lies-apartments.png";
import vignetteBoardgame from "@/assets/god-of-lies-boardgame.png";
import vignetteManyFaces from "@/assets/god-of-lies-characters.png";
import comicPanelsBackground from "@/assets/comic-panels-background.png";


const Comics = () => {
  useScrollToTop();
  const isMobile = useIsMobile();
  const isWidescreen = useWidescreenAspectRatio();
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{src: string; alt: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [showGodOfLiesDescription, setShowGodOfLiesDescription] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [isNarrowPortrait, setIsNarrowPortrait] = useState(false);
  const [topSectionsLoaded, setTopSectionsLoaded] = useState(false);
  
  // Pendragon caption toggle state
  const [pendragonCaptionVisible, setPendragonCaptionVisible] = useState(true);
  
  // SCROLL-HIJACKING STATE - Discrete sections with snap behavior
  // Section 0 = Title, 1 = Vignettes, 2 = Cream, 3 = Pendragon (last dissolve section)
  // After section 3, normal scrolling begins
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0); // 0-1 transition progress within section
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pinnedContainerOpacity, setPinnedContainerOpacity] = useState(1); // For dissolve to/from Pendragon
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const storiesSectionRef = useRef<HTMLElement>(null);

  const maxPinnedSection = 2; // After section 2 (Cream), normal scrolling begins - Pendragon is in scrollable content

  // SCROLL-HIJACKING: Intercept wheel/touch events and snap between sections
  useEffect(() => {
    let scrollAccumulator = 0;
    const scrollThreshold = 80; // Amount of scroll needed to trigger section change
    let debounceTimer: NodeJS.Timeout | null = null;
    
    const triggerSectionChange = (direction: 'next' | 'prev') => {
      if (isTransitioning) return;
      
      setCurrentSection(prev => {
        // Prevent going below 0
        if (direction === 'prev' && prev <= 0) return 0;
        
        const newSection = direction === 'next' 
          ? Math.min(maxPinnedSection + 1, prev + 1)
          : Math.max(0, prev - 1);
        
        // If moving past the last pinned section - dissolve to Pendragon
        if (newSection > maxPinnedSection) {
          // Animate the dissolve from Cream to Pendragon
          setIsTransitioning(true);
          const animationDuration = 600;
          const startTime = performance.now();
          
          const animateFadeOut = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / animationDuration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setPinnedContainerOpacity(1 - eased);
            
            if (progress < 1) {
              requestAnimationFrame(animateFadeOut);
            } else {
              setPinnedContainerOpacity(0);
              setIsScrollLocked(false);
              setIsTransitioning(false);
            }
          };
          
          requestAnimationFrame(animateFadeOut);
          setSectionProgress(1);
          return maxPinnedSection;
        }
        
        return newSection;
      });
      
      // Only animate if staying in pinned mode
      if (direction === 'next' && currentSection >= maxPinnedSection) {
        // Already handled above with dissolve animation
        return;
      }
      
      // Animate the transition
      setIsTransitioning(true);
      setSectionProgress(0);
      
      // Animate progress from 0 to 1
      const animationDuration = 600; // ms
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / animationDuration);
        
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setSectionProgress(eased);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setSectionProgress(1);
          setIsTransitioning(false);
        }
      };
      
      requestAnimationFrame(animate);
      scrollAccumulator = 0;
    };
    
    const handleWheel = (e: WheelEvent) => {
      // If in normal scroll mode - allow normal scrolling
      if (!isScrollLocked) {
        // Check if user scrolled to top and wants to go up - dissolve back to Cream
        if (window.scrollY <= 0 && e.deltaY < 0) {
          e.preventDefault();
          setIsScrollLocked(true);
          setCurrentSection(maxPinnedSection); // Re-lock at Cream (section 2)
          setSectionProgress(1);
          
          // Animate the dissolve back in (Pendragon fades, Cream appears)
          setIsTransitioning(true);
          const animationDuration = 600;
          const startTime = performance.now();
          
          const animateFadeIn = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(1, elapsed / animationDuration);
            const eased = 1 - Math.pow(1 - progress, 3);
            setPinnedContainerOpacity(eased);
            
            if (progress < 1) {
              requestAnimationFrame(animateFadeIn);
            } else {
              setPinnedContainerOpacity(1);
              setIsTransitioning(false);
            }
          };
          
          requestAnimationFrame(animateFadeIn);
        }
        return;
      }
      
      // In pinned mode - prevent default scroll
      e.preventDefault();
      e.stopPropagation();
      
      if (isTransitioning) return;
      
      scrollAccumulator += e.deltaY;
      
      // Debounce to prevent rapid section changes
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        scrollAccumulator = 0;
      }, 150);
      
      if (scrollAccumulator > scrollThreshold) {
        triggerSectionChange('next');
      } else if (scrollAccumulator < -scrollThreshold) {
        triggerSectionChange('prev');
      }
    };
    
    // Touch handling for mobile
    let touchStartY = 0;
    let touchAccumulator = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchAccumulator = 0;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // If in normal scroll mode - allow normal scrolling
      if (!isScrollLocked) {
        // Check if user scrolled to top and wants to go up - dissolve back to Cream
        if (window.scrollY <= 0) {
          const touchY = e.touches[0].clientY;
          const delta = touchStartY - touchY;
          if (delta < -60) {
            e.preventDefault();
            setIsScrollLocked(true);
            setCurrentSection(maxPinnedSection);
            setSectionProgress(1);
            
            // Animate the dissolve back in
            setIsTransitioning(true);
            const animationDuration = 600;
            const startTime = performance.now();
            
            const animateFadeIn = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(1, elapsed / animationDuration);
              const eased = 1 - Math.pow(1 - progress, 3);
              setPinnedContainerOpacity(eased);
              
              if (progress < 1) {
                requestAnimationFrame(animateFadeIn);
              } else {
                setPinnedContainerOpacity(1);
                setIsTransitioning(false);
              }
            };
            
            requestAnimationFrame(animateFadeIn);
            touchStartY = touchY;
          }
        }
        return;
      }
      
      e.preventDefault();
      
      if (isTransitioning) return;
      
      const touchY = e.touches[0].clientY;
      const delta = touchStartY - touchY;
      touchAccumulator = delta;
      
      if (touchAccumulator > 60) {
        triggerSectionChange('next');
        touchStartY = touchY;
      } else if (touchAccumulator < -60) {
        triggerSectionChange('prev');
        touchStartY = touchY;
      }
    };
    
    // Add event listeners with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [currentSection, isTransitioning, isScrollLocked]);

  // Lock/unlock body scroll based on animation state
  useEffect(() => {
    if (isScrollLocked) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
    
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    };
  }, [isScrollLocked]);

  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageReady(true);
    setCurrentSection(0);
    setSectionProgress(1);
    setIsScrollLocked(true);
    
    const img = new Image();
    img.onload = () => {
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.onerror = () => {
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.src = surnamePendragonBanner;
    
    const timeout = setTimeout(() => {
      setTopSectionsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, []);

  // Check narrow portrait desktop
  const isNarrowPortraitDesktop = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return width >= 950 && width <= 1100 && height > width;
  }, []);

  useEffect(() => {
    const checkNarrowPortrait = () => {
      const narrow = isNarrowPortraitDesktop();
      setIsNarrowPortrait(narrow);
    };
    
    checkNarrowPortrait();
    window.addEventListener('resize', checkNarrowPortrait);
    return () => window.removeEventListener('resize', checkNarrowPortrait);
  }, [isNarrowPortraitDesktop]);

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
  }, [topSectionsLoaded]);

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


  // ANIMATION CALCULATIONS based on discrete sections with smooth transitions
  // Section 0 = Title, 1 = Vignettes, 2 = Cream, 3 = Pendragon (LAST dissolve section)
  // After section 3, normal scrolling begins
  
  // Title screen: visible ONLY on section 0, fades out when transitioning to section 1
  const titleVisible = currentSection === 0;
  const titleOpacity = currentSection === 0 ? 1 : 0;
  
  // Vignettes: visible on section 1, fades in when arriving, fades out when leaving to section 2
  const vignetteVisible = currentSection === 1;
  const vignetteOpacity = currentSection === 1 ? 1 : 0;
  
  // Cream section: visible on section 2, fades out when leaving to section 3
  const creamVisible = currentSection === 2;
  const creamOpacity = currentSection === 2 ? 1 : 0;
  
  // Pendragon is now ONLY in scrollable content - no pinned version

  return (
    <div className={`min-h-screen bg-white overflow-x-hidden transition-opacity duration-300 flex flex-col ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />

      <main className="relative flex-1">
        {/* PINNED ANIMATION CONTAINER - Fixed during scroll-lock phase, fades for Pendragon transition */}
        {(isScrollLocked || pinnedContainerOpacity > 0) && (
          <div 
            className="fixed inset-0 z-10 bg-white"
            style={{ 
              pointerEvents: isScrollLocked ? 'auto' : 'none',
              opacity: pinnedContainerOpacity,
              transition: 'opacity 0.05s ease-out'
            }}
          >
            
            {/* SECTION 0: TITLE SCREEN - Centered title with scroll hint */}
            <section 
              className="absolute inset-0 flex flex-col items-center justify-center"
              style={{ 
                opacity: titleOpacity,
                pointerEvents: titleVisible ? 'auto' : 'none',
                transition: 'opacity 0.5s ease-out'
              }}
            >
              <div className="text-center relative">
                {/* Faded comic panels behind */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img 
                    src={comicPanelsBackground}
                    alt=""
                    className="w-full max-w-2xl opacity-10"
                  />
                </div>
                
                <h1 
                  className="text-5xl xs:text-6xl sm:text-6xl lg:text-7xl xl:text-8xl uppercase text-black relative z-10"
                  style={{ 
                    fontFamily: 'Bangers, cursive',
                    fontWeight: 400,
                    letterSpacing: '0.08em'
                  }}
                >
                  COMICS & SCRIPTS
                </h1>

                <div className="w-32 sm:w-48 h-0.5 bg-black/30 mx-auto mt-4" />

                <p 
                  className="text-xs sm:text-sm lg:text-base tracking-[0.2em] uppercase text-black/70 mt-4 sm:mt-5 relative z-10"
                  style={{ 
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Original Stories in Sequential Art & Screenplay
                </p>
              </div>
              
              {/* Scroll hint - centrally aligned */}
              <div 
                className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-2 text-black/40 animate-bounce"
              >
                <span className="text-xs uppercase tracking-widest text-center">Scroll to explore</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </section>

            {/* SECTION 1: VIGNETTES - Slide in from sides with summary text */}
            <section 
              className="absolute inset-0"
              style={{ 
                opacity: vignetteOpacity,
                pointerEvents: vignetteVisible ? 'auto' : 'none',
                transition: 'opacity 0.5s ease-out'
              }}
            >
              {/* DESKTOP VIGNETTES LAYOUT */}
              <div className="w-full h-full hidden sm:flex items-center px-4 sm:px-6 lg:px-8">
                
              {/* LEFT SIDE - Many Faces character collage (full height) */}
                <div 
                  className={`w-[40%] h-full flex items-center justify-center ${isWidescreen ? 'py-8 pt-16' : 'py-6'}`}
                  style={{
                    transform: `translateX(${currentSection >= 1 ? (currentSection >= 2 ? -150 * sectionProgress : 0) : -100}%)`,
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <img 
                    src={vignetteManyFaces}
                    alt="The many faces - God of Lies"
                    className="h-full w-auto object-contain"
                    style={{ maxHeight: isWidescreen ? 'calc(100vh - 80px)' : 'calc(100vh - 120px)' }}
                  />
                </div>
                
                {/* CENTER - Summary text with distinct vertical GOD OF LIES title */}
                <div 
                  className="w-[14%] h-full flex items-center justify-center px-2"
                  style={{
                    opacity: currentSection === 1 ? 1 : 0,
                    transform: `scale(${currentSection === 1 ? 1 : 0.8})`,
                    transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s'
                  }}
                >
                  <div className="text-center flex flex-col items-center justify-center h-full py-8">
                    <p 
                      className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500 mb-4"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Featured
                    </p>
                    
                    {/* Vertical GOD OF LIES with distinct font */}
                    <div className="flex flex-col items-center gap-1 my-2">
                      <span 
                        className="text-2xl sm:text-3xl lg:text-5xl text-slate-900"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          lineHeight: 1
                        }}
                      >
                        GOD
                      </span>
                      <span 
                        className="text-base sm:text-lg lg:text-2xl text-slate-600 italic"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 400,
                          letterSpacing: '0.2em',
                          lineHeight: 1
                        }}
                      >
                        of
                      </span>
                      <span 
                        className="text-2xl sm:text-3xl lg:text-5xl text-slate-900"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          lineHeight: 1
                        }}
                      >
                        LIES
                      </span>
                    </div>
                    
                    <div className="w-8 sm:w-12 h-0.5 sm:h-1 bg-red-600 mx-auto my-3" />
                    <p 
                      className="text-[9px] sm:text-[11px] text-slate-600 leading-relaxed mb-2"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      A psychological manga about deception and truth
                    </p>
                    <p 
                      className="text-[8px] sm:text-[10px] text-blue-700 uppercase tracking-[0.15em]"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • 2026
                    </p>
                  </div>
                </div>
                
                {/* RIGHT SIDE - Two images stacked (apartments top, boardgame bottom) */}
                <div 
                  className={`w-[46%] h-full flex flex-col gap-2 sm:gap-3 ${isWidescreen ? 'py-6 pt-20' : 'py-6'}`}
                  style={{
                    transform: `translateX(${currentSection >= 1 ? (currentSection >= 2 ? 150 * sectionProgress : 0) : 100}%)`,
                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Top right - Apartments */}
                  <div className="flex-1 flex items-end justify-center overflow-hidden">
                    <img 
                      src={vignetteApartments}
                      alt="The neighborhood - God of Lies"
                      className="w-auto h-full object-contain"
                      style={{ maxHeight: isWidescreen ? '42vh' : '48vh' }}
                    />
                  </div>
                  {/* Bottom right - Boardgame (same size as top) */}
                  <div className="flex-1 flex items-start justify-center overflow-hidden">
                    <img 
                      src={vignetteBoardgame}
                      alt="Family moments - God of Lies"
                      className="w-auto h-full object-contain"
                      style={{ maxHeight: isWidescreen ? '40vh' : '42vh' }}
                    />
                  </div>
                </div>
              </div>
              
              {/* MOBILE VIGNETTES LAYOUT - Full screen image with overlaid text */}
              <div className="w-full h-full flex sm:hidden items-center justify-center relative">
                {/* Full page Many Faces image with padding */}
                <div 
                  className="absolute inset-0 flex items-center justify-center p-6"
                  style={{
                    opacity: currentSection >= 1 ? 1 : 0,
                    transform: `scale(${currentSection >= 1 ? 1 : 0.9})`,
                    transition: 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <img 
                    src={vignetteManyFaces}
                    alt="The many faces - God of Lies"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                
                {/* Overlaid text at bottom */}
                <div 
                  className="absolute bottom-0 left-0 right-0 px-4 pb-16 pt-20"
                  style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)',
                    opacity: currentSection === 1 ? 1 : 0,
                    transform: `translateY(${currentSection === 1 ? 0 : 30}px)`,
                    transition: 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s'
                  }}
                >
                  <div className="text-center">
                    <p 
                      className="text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Featured
                    </p>
                    
                    {/* Horizontal GOD OF LIES for mobile overlay */}
                    <h2 
                      className="text-3xl text-white mb-2"
                      style={{ 
                        fontFamily: 'Playfair Display, Georgia, serif',
                        fontWeight: 700,
                        letterSpacing: '0.1em'
                      }}
                    >
                      GOD <span className="italic font-normal text-xl">of</span> LIES
                    </h2>
                    
                    <div className="w-16 h-0.5 bg-red-500 mx-auto my-2" />
                    <p 
                      className="text-[11px] text-white/80 leading-relaxed mb-1"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      A psychological manga about deception and truth
                    </p>
                    <p 
                      className="text-[9px] text-blue-300 uppercase tracking-[0.15em]"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • 2026
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: CREAM SCREEN - Street scene with description (LAST DISSOLVE SECTION) */}
            <section 
              className="absolute inset-0"
              style={{ 
                opacity: creamOpacity,
                pointerEvents: creamVisible ? 'auto' : 'none',
                background: 'linear-gradient(to bottom, #f5f0e1, #e8e0cc)',
                transition: 'opacity 0.5s ease-out'
              }}
            >
              <div className={`w-full h-full flex items-center justify-center px-4 sm:px-6 ${isWidescreen ? 'pt-8' : ''}`}>
                <div className={`w-full max-w-6xl flex flex-col lg:flex-row items-center ${isWidescreen ? 'gap-12 lg:gap-16' : 'gap-6 lg:gap-8'}`}>
                  
                  {/* Main Image - Slides in from LEFT */}
                  <div 
                    className="lg:w-1/2 flex justify-center"
                    style={{
                      transform: `translateX(${currentSection >= 2 ? 0 : -100}%)`,
                      opacity: currentSection >= 2 ? 1 : 0,
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease-out'
                    }}
                  >
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setZoomedImage({ src: godOfLiesStreetScene, alt: 'The Masked Figure' })}
                    >
                      <img 
                        src={godOfLiesStreetScene}
                        alt="The Masked Figure following"
                        className="max-h-[65vh] object-contain shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Content - Slides in from RIGHT */}
                  <div 
                    className="lg:w-1/2"
                    style={{
                      transform: `translateX(${currentSection >= 2 ? 0 : 100}%)`,
                      opacity: currentSection >= 2 ? 1 : 0,
                      transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, opacity 0.5s ease-out 0.1s'
                    }}
                  >
                    <div className="text-center lg:text-left mb-4 lg:mb-6">
                      <p 
                        className="text-xs uppercase tracking-[0.4em] text-amber-800/70 mb-2"
                        style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      >
                        Featured Series
                      </p>
                      <h2 
                        className="text-2xl lg:text-5xl font-bold text-slate-900 mb-2 lg:mb-3"
                        style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.02em' }}
                      >
                        GOD OF LIES
                      </h2>
                      <div className="w-20 lg:w-24 h-1 bg-amber-700 mx-auto lg:mx-0" />
                    </div>

                    <p 
                      className="text-slate-700 text-sm lg:text-lg leading-relaxed first-letter:text-4xl lg:first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 lg:first-letter:mr-3 first-letter:text-amber-800"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      In a world where truth is currency, one man discovers he can make anyone believe anything. 
                      <span className="text-red-700 font-semibold"> Takeshi Mori</span> has mastered the art of deception—manipulating politicians, businessmen, and entire corporations with surgical precision.
                    </p>
                    <p 
                      className="text-slate-700 text-sm lg:text-lg leading-relaxed mt-3 lg:mt-5 hidden sm:block"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      For years, he operated in the shadows, a phantom pulling strings that shaped nations. But when a 
                      <span className="text-blue-700 font-semibold"> single child</span> sees through his carefully constructed lies, 
                      his empire of illusions begins to crumble.
                    </p>
                    <p 
                      className="text-amber-800 text-xs uppercase tracking-widest mt-3 lg:mt-5"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • Webtoon • 2026
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Scroll hint at bottom of cream section */}
              <div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-amber-800/60 animate-bounce"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
              </div>
            </section>

            {/* Pendragon is now ONLY in scrollable content - dissolves from Cream, then scrolls */}

          </div>
        )}

        {/* SCROLLABLE CONTENT - Pendragon sits behind pinned container, revealed when scroll unlocks */}
        <div 
          ref={scrollableContentRef}
          style={{ marginTop: '64px' }} // Align with header bottom
        >
          {/* Pendragon - the ONLY instance, sits behind pinned dissolve container */}
          <section 
            className="relative w-full overflow-hidden cursor-pointer"
            onClick={() => setPendragonCaptionVisible(!pendragonCaptionVisible)}
          >
            {/* Desktop image - widescreen shows full image without cropping */}
            <img 
              src={surnamePendragonBanner}
              alt="Surname Pendragon"
              className={`hidden lg:block w-full ${isWidescreen ? 'h-auto object-contain' : 'h-[calc(100vh-64px)] object-cover'}`}
              style={{ objectPosition: isWidescreen ? undefined : 'center 20%' }}
            />
            {/* Mobile + small iPad image - full width, top edge aligned with header bottom (top of viewport) */}
            <img 
              src={surnamePendragonMobile}
              alt="Surname Pendragon"
              className="lg:hidden w-full h-auto object-contain block"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {/* Caption - positioned at bottom-left of image on mobile/tablet, bottom of viewport area on desktop */}
            <div 
              className="absolute left-4 sm:left-6 lg:left-12 max-w-sm transition-all duration-500 bottom-4 sm:bottom-6 lg:bottom-16"
              style={{
                opacity: pendragonCaptionVisible ? 1 : 0,
                transform: pendragonCaptionVisible ? 'translateX(0)' : 'translateX(-20px)',
                pointerEvents: pendragonCaptionVisible ? 'auto' : 'none'
              }}
            >
              <h4 
                className="text-white/90 text-sm md:text-base uppercase tracking-[0.3em] mb-2 lg:mb-3"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                Screenplay Adaptation
              </h4>
              <h3 
                className="text-white text-xl md:text-2xl lg:text-3xl font-light mb-2 lg:mb-3 tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Surname Pendragon
              </h3>
              <p 
                className="text-white/70 text-sm md:text-base leading-relaxed mb-3 lg:mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                A sweeping family saga spanning three generations, where legacy is both burden and blessing.
              </p>
              <p 
                className="text-white/50 text-xs md:text-sm uppercase tracking-widest"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                Feature Film • Drama • In Development
              </p>
            </div>
          </section>

          {/* Stories Waiting to be Told - appears as Pendragon scrolls away */}
          <section ref={storiesSectionRef as React.RefObject<HTMLElement>} className="text-center py-16 sm:py-24 bg-white">
            <ScrollScale 
              initialScale={1.3} 
              finalScale={1} 
              initialBlur={3}
              className="text-center"
            >
              <h2 
                className="font-serif text-3xl sm:text-5xl lg:text-6xl text-black/80 italic leading-tight mb-6"
              >
                "Stories waiting to be told..."
              </h2>
              <div className="w-24 h-1 bg-amber-800 mx-auto rounded-full mb-2" />
              <div className="w-16 h-0.5 bg-amber-800/60 mx-auto rounded-full" />
            </ScrollScale>
          </section>

          {/* Forthcoming Comics Grid */}
          <section className="pb-6 sm:pb-20 px-4 sm:px-6 bg-white relative">
            {topSectionsLoaded && (
              <div 
                ref={row1Ref}
                data-row="row1"
                className={`transition-all duration-700 ${
                  visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xs:gap-4 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
                  {smallShelfComics.map((comic, index) => (
                    <div 
                      key={comic.title} 
                      className={`cursor-pointer overflow-visible ${
                        visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ 
                        transition: 'opacity 0.7s ease, transform 0.7s ease',
                        transitionDelay: visibleRows.has('row1') ? `${index * 200}ms` : '0ms' 
                      }}
                      onClick={() => handleComicClick(comic)}
                    >
                      <img 
                        src={comic.cover}
                        alt={`${comic.title} comic cover`}
                        className="w-full shadow-lg transition-transform duration-200 ease-out hover:scale-[1.02] xs:hover:scale-[1.03] sm:hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div ref={row2Ref} data-row="row2" className="hidden" />
          </section>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`bg-[#1a1a1a] py-10 max-sm:py-6 relative overflow-visible ${isScrollLocked ? 'hidden' : ''}`}>
        <img 
          src={comicsFooterCharacter}
          alt="Comics mascot"
          className="absolute w-auto pointer-events-none z-10 hidden xl:block"
          style={{
            height: '8.5cm',
            bottom: '100%',
            right: '-10px'
          }}
        />
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-xl mb-3 text-[#e8d9a0]">Contact</h3>
          <p className="font-serif text-[#e8d9a0]/80 text-sm">
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
            className={`bg-white rounded-xl shadow-2xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto animate-scale-in ${
              isWidescreen 
                ? 'max-w-4xl max-h-[85vh]' 
                : 'max-w-5xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-center max-sm:max-h-[40vh] ${
              isWidescreen ? 'max-h-[70vh]' : ''
            }`}>
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className={`w-full shadow-2xl rounded-lg max-sm:max-h-full max-sm:object-contain ${
                  isWidescreen 
                    ? 'max-w-sm max-h-[65vh] object-contain' 
                    : 'max-w-md'
                }`}
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

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <img 
            src={zoomedImage.src}
            alt={zoomedImage.alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Comics;
