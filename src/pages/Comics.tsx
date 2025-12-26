import { useState, useEffect, useRef, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnamePendragonBanner from "@/assets/surname-pendragon-banner.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";
import godOfLiesBusStop from "@/assets/god-of-lies-bus-stop-cropped.jpeg";
import comicsFooterCharacter from "@/assets/comics-footer-character.png";
import godOfLiesStreetScene from "@/assets/god-of-lies-street-scene.png";
import vignetteApartments from "@/assets/god-of-lies-apartments.png";
import vignetteSweeping from "@/assets/god-of-lies-sweeping.png";
import vignetteBoardgame from "@/assets/god-of-lies-boardgame.png";
import comicPanelsBackground from "@/assets/comic-panels-background.png";


const Comics = () => {
  useScrollToTop();
  const isMobile = useIsMobile();
  const isWidescreen = useWidescreenAspectRatio();
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{src: string; alt: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [showGodOfLiesDescription, setShowGodOfLiesDescription] = useState(false);
  const [showPendragon, setShowPendragon] = useState(false);
  const [showPendragonCaption, setShowPendragonCaption] = useState(false);
  const [pendragonCaptionVisible, setPendragonCaptionVisible] = useState(true);
  const [mobilePendragonExpanded, setMobilePendragonExpanded] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [isNarrowPortrait, setIsNarrowPortrait] = useState(false);
  const [godOfLiesImageLoaded, setGodOfLiesImageLoaded] = useState(false);
  const [topSectionsLoaded, setTopSectionsLoaded] = useState(false);
  
  // SCROLL-HIJACKING STATE
  // animationProgress: 0 = cover, 1 = vignettes fully in, 2 = cream fully in, 3+ = normal scroll
  const [animationProgress, setAnimationProgress] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(true);
  const animationProgressRef = useRef(0);
  const scrollableContentRef = useRef<HTMLDivElement>(null);
  
  const mobilePendragonRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  
  const pendragonSectionRef = useRef<HTMLElement>(null);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const fixedHeaderHeight = 64;

  // SCROLL-HIJACKING: Intercept wheel/touch events and use them to drive animation
  useEffect(() => {
    const sensitivity = 0.002; // How fast scroll input advances animation
    const maxProgress = 3; // After this, normal scrolling begins
    
    const handleWheel = (e: WheelEvent) => {
      // If we're still in the locked animation phase
      if (animationProgressRef.current < maxProgress) {
        e.preventDefault();
        e.stopPropagation();
        
        // Use wheel delta to advance animation
        const delta = e.deltaY * sensitivity;
        const newProgress = Math.max(0, Math.min(maxProgress, animationProgressRef.current + delta));
        
        animationProgressRef.current = newProgress;
        setAnimationProgress(newProgress);
        
        // When we reach max progress, unlock scrolling
        if (newProgress >= maxProgress) {
          setIsScrollLocked(false);
        }
      } else {
        // Normal scrolling - but check if user scrolls back up to top
        if (window.scrollY === 0 && e.deltaY < 0) {
          // At top and scrolling up - go back into locked mode
          e.preventDefault();
          const newProgress = Math.max(0, animationProgressRef.current + e.deltaY * sensitivity);
          animationProgressRef.current = newProgress;
          setAnimationProgress(newProgress);
          if (newProgress < maxProgress) {
            setIsScrollLocked(true);
          }
        }
      }
    };
    
    // Touch handling for mobile
    let touchStartY = 0;
    let lastTouchY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      lastTouchY = touchStartY;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (animationProgressRef.current < maxProgress) {
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        const delta = (lastTouchY - touchY) * sensitivity * 2; // Touch is more sensitive
        lastTouchY = touchY;
        
        const newProgress = Math.max(0, Math.min(maxProgress, animationProgressRef.current + delta));
        animationProgressRef.current = newProgress;
        setAnimationProgress(newProgress);
        
        if (newProgress >= maxProgress) {
          setIsScrollLocked(false);
        }
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
    };
  }, []);

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

  // Handle normal scroll events (after animation is done)
  useEffect(() => {
    if (isScrollLocked) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // Show Pendragon when scrolled a bit
      if (scrollY > 100) {
        setShowPendragon(true);
      }
      
      // Show Pendragon caption
      if (pendragonSectionRef.current) {
        const pendragonRect = pendragonSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        setShowPendragonCaption(pendragonRect.bottom > 0 && pendragonRect.top < viewportHeight);
      }
      
      // Mobile: Expand Pendragon caption
      if (mobilePendragonRef.current) {
        const captionRect = mobilePendragonRef.current.getBoundingClientRect();
        const shouldExpand = captionRect.top < window.innerHeight * 0.6;
        setMobilePendragonExpanded(shouldExpand);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrollLocked, isMobile, isNarrowPortrait]);

  // Get dynamic header height
  const getHeaderBottom = useCallback(() => {
    const header = document.querySelector('header.fixed, nav.fixed, [data-header]') as HTMLElement;
    if (header) {
      return header.getBoundingClientRect().bottom;
    }
    return 64;
  }, []);

  // Force scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
    setPageReady(true);
    setAnimationProgress(0);
    animationProgressRef.current = 0;
    setIsScrollLocked(true);
    
    const img = new Image();
    img.onload = () => {
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.onerror = () => {
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.src = godOfLiesCover;
    
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
      if (narrow) {
        setShowPendragon(true);
      }
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

  // ANIMATION CALCULATIONS based on progress (0 to 3)
  // 0-1: Cover fades out, vignettes slide in
  // 1-2: Vignettes stay visible (user can appreciate them)
  // 2-3: Vignettes slide out, cream slides in
  // 3+: Normal scrolling
  
  // Cover: visible 0-1, fades out
  const coverOpacity = animationProgress <= 1 ? Math.max(0, 1 - animationProgress) : 0;
  const coverVisible = animationProgress < 1;
  
  // Vignettes: slide in 0-1, stay 1-2, slide out 2-3
  const vignetteSlideIn = Math.min(1, animationProgress); // 0 to 1
  const vignetteSlideOut = animationProgress > 2 ? Math.min(1, animationProgress - 2) : 0; // 0 to 1 after progress 2
  const vignetteOpacity = animationProgress < 0.2 
    ? animationProgress * 5 // Fade in
    : animationProgress > 2.5 
      ? Math.max(0, 1 - (animationProgress - 2.5) * 2) // Fade out
      : 1;
  const vignetteActive = animationProgress >= 0.2 && animationProgress < 3;
  
  // Cream section: slides in during 2-3
  const creamProgress = animationProgress > 2 ? Math.min(1, (animationProgress - 2)) : 0;
  const creamOpacity = creamProgress;
  const creamActive = animationProgress >= 2;

  return (
    <div className={`min-h-screen bg-white overflow-x-hidden transition-opacity duration-300 flex flex-col ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />

      <main className="relative flex-1">
        {/* PINNED ANIMATION CONTAINER - Fixed during scroll-lock phase */}
        {isScrollLocked && (
          <div className="fixed inset-0 z-10 bg-white">
            
            {/* Header Banner - Always visible at top */}
            <header className="absolute top-0 left-0 right-0 py-6 sm:py-10 lg:py-12 px-4 sm:px-8 lg:px-12 mt-[64px] z-30">
              <div className="text-center relative">
                {/* Faded comic panels behind subtitle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <img 
                    src={comicPanelsBackground}
                    alt=""
                    className="w-full max-w-2xl opacity-10"
                    style={{ marginTop: '2rem' }}
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
            </header>

            {/* SECTION 0: GOD OF LIES Cover - Fades out as vignettes slide in */}
            <section 
              className="absolute inset-0 flex items-center justify-center"
              style={{ 
                opacity: coverOpacity, 
                pointerEvents: coverVisible ? 'auto' : 'none',
                transition: 'opacity 0.15s ease-out',
                paddingTop: '140px'
              }}
            >
              <div className="w-full h-full flex items-center justify-center px-4 sm:px-8 lg:px-16">
                <img 
                  src={godOfLiesCover}
                  alt="God of Lies"
                  className="max-w-full max-h-[calc(100vh-180px)] object-contain"
                  onLoad={() => setGodOfLiesImageLoaded(true)}
                />
              </div>
            </section>

            {/* SECTION 1: VIGNETTES - HUGE, fill the entire viewport, slide in from sides */}
            <section 
              className="absolute inset-0"
              style={{ 
                opacity: vignetteOpacity,
                pointerEvents: vignetteActive ? 'auto' : 'none',
                paddingTop: '100px'
              }}
            >
              <div className="w-full h-[calc(100vh-100px)] flex">
                
                {/* LEFT SIDE - Board game image (HUGE - fills left 45%) */}
                <div 
                  className="w-[45%] h-full flex items-center justify-center p-2 sm:p-4"
                  style={{
                    transform: `translateX(${(-100 + vignetteSlideIn * 100) - vignetteSlideOut * 150}%)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  <img 
                    src={vignetteBoardgame}
                    alt="Family moments - God of Lies"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    style={{ maxHeight: '85vh' }}
                  />
                </div>
                
                {/* CENTER - Magazine text content (10%) - smaller to give more room to images */}
                <div 
                  className="w-[10%] h-full flex items-center justify-center px-1"
                  style={{
                    opacity: Math.max(0, vignetteSlideIn - vignetteSlideOut * 2),
                    transform: `scale(${0.8 + vignetteSlideIn * 0.2 - vignetteSlideOut * 0.5})`,
                    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out'
                  }}
                >
                  <div className="text-center">
                    <p 
                      className="text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-500 mb-1 sm:mb-2"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Featured
                    </p>
                    <h2 
                      className="text-sm sm:text-xl lg:text-3xl xl:text-4xl mb-1 sm:mb-2 text-slate-900"
                      style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.04em' }}
                    >
                      GOD OF<br />LIES
                    </h2>
                    <div className="w-4 sm:w-10 lg:w-14 h-0.5 sm:h-1 bg-red-600 mx-auto mb-1 sm:mb-2" />
                    <p 
                      className="text-[8px] sm:text-[10px] lg:text-xs text-blue-700 uppercase tracking-[0.1em] sm:tracking-[0.2em]"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • 2026
                    </p>
                  </div>
                </div>
                
                {/* RIGHT SIDE - Two images stacked (HUGE - fills right 45%) */}
                <div 
                  className="w-[45%] h-full flex flex-col gap-1 sm:gap-2 p-2 sm:p-4"
                  style={{
                    transform: `translateX(${(100 - vignetteSlideIn * 100) + vignetteSlideOut * 150}%)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  {/* Top right image - Apartments */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <img 
                      src={vignetteApartments}
                      alt="The neighborhood - God of Lies"
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{ maxHeight: '42vh' }}
                    />
                  </div>
                  
                  {/* Bottom right image - Sweeping */}
                  <div className="flex-1 flex items-center justify-center overflow-hidden">
                    <img 
                      src={vignetteSweeping}
                      alt="Daily life - God of Lies"
                      className="w-full h-full object-contain drop-shadow-2xl"
                      style={{ maxHeight: '42vh' }}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: CREAM BLURB - Elements slide in from different directions */}
            <section 
              className="absolute inset-0"
              style={{ 
                opacity: creamOpacity, 
                pointerEvents: creamActive ? 'auto' : 'none',
                background: 'linear-gradient(to bottom, #f5f0e1, #e8e0cc)',
                paddingTop: '100px'
              }}
            >
              <div className="w-full h-[calc(100vh-100px)] flex items-center justify-center px-4 sm:px-6">
                <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 lg:gap-8 items-center">
                  
                  {/* Main Image - Slides in from LEFT */}
                  <div 
                    className="lg:w-1/2 flex justify-center"
                    style={{
                      transform: `translateX(${-100 + creamProgress * 100}%)`,
                      opacity: creamProgress,
                      transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
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
                      transform: `translateX(${100 - creamProgress * 100}%)`,
                      opacity: creamProgress,
                      transition: 'transform 0.2s ease-out 0.05s, opacity 0.2s ease-out 0.05s'
                    }}
                  >
                    {/* Magazine Header - Slides down from TOP */}
                    <div 
                      className="text-center lg:text-left mb-4 lg:mb-6"
                      style={{
                        transform: `translateY(${-30 + creamProgress * 30}px)`,
                        transition: 'transform 0.2s ease-out 0.1s'
                      }}
                    >
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
            </section>

            {/* Scroll hint */}
            {animationProgress < 0.3 && (
              <div 
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-black/40 text-sm animate-bounce z-40"
                style={{ opacity: 1 - animationProgress * 3 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NORMAL SCROLLABLE CONTENT - Shown after animation completes */}
        <div 
          ref={scrollableContentRef}
          className={isScrollLocked ? 'invisible' : 'visible'}
        >
          {/* Spacer to account for the fixed animation sections we just saw */}
          {!isScrollLocked && <div className="h-0" />}
          
          {/* GOD OF LIES Text Section - MOBILE */}
          {isMobile && (
            <section className="w-full relative">
              <div className="flex flex-col">
                <div className="w-full">
                  <img 
                    src={godOfLiesBusStop}
                    alt="God of Lies - Bus Stop Scene"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div 
                  className={`w-full bg-amber-50/95 transition-all duration-700 ease-out overflow-hidden ${
                    showGodOfLiesDescription 
                      ? 'max-h-96 opacity-100' 
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className={`p-4 transition-transform duration-700 ease-out ${
                    showGodOfLiesDescription ? 'translate-y-0' : '-translate-y-full'
                  }`}>
                    <h3 
                      className="text-2xl font-bold text-slate-900 mb-4"
                      style={{ fontFamily: 'Bangers, cursive' }}
                    >
                      GOD OF LIES
                    </h3>
                    <p 
                      className="text-slate-700 text-sm leading-relaxed mb-2"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      In a world where every truth bends to the will of one man, reality itself becomes a question. 
                      Takeshi Mori has spent decades mastering the art of deception—but when a child sees through 
                      his lies for the first time, everything begins to unravel.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* SURNAME PENDRAGON */}
          <section 
            ref={pendragonSectionRef} 
            className={`w-full relative transition-all duration-700 ease-out ${
              (isMobile || isNarrowPortrait) 
                ? (godOfLiesImageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0')
                : (showPendragon ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16')
            }`}
          >
            <img 
              src={surnamePendragonBanner}
              alt="Surname Pendragon"
              className="w-full"
              loading={(isMobile || isNarrowPortrait) ? 'lazy' : 'eager'}
            />
            
            {/* Slide-in caption panel from left */}
            <div 
              className="absolute inset-0 cursor-pointer hidden sm:block"
              onClick={() => setPendragonCaptionVisible(prev => !prev)}
            />
            <div 
              className={`absolute bottom-[8%] left-0 max-w-[40%] lg:max-w-[30%] bg-black/90 backdrop-blur-sm p-5 sm:p-6 lg:p-8 transition-all duration-700 ease-out pointer-events-none hidden sm:block ${
                showPendragonCaption && pendragonCaptionVisible
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-full'
              }`}
            >
              <h4 
                className="text-white/90 text-xs sm:text-sm uppercase tracking-[0.3em] mb-3"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                Screenplay Adaptation
              </h4>
              <h3 
                className="text-white text-xl sm:text-2xl lg:text-3xl font-light mb-3 tracking-wide"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Surname Pendragon
              </h3>
              <p 
                className="text-white/70 text-sm sm:text-base leading-relaxed mb-4"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                A sweeping family saga spanning three generations, where legacy is both burden and blessing. 
                When secrets from the past resurface, the Pendragon name becomes a curse worth fighting for.
              </p>
              <p 
                className="text-white/50 text-xs uppercase tracking-widest"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                Feature Film • Drama • In Development
              </p>
            </div>
            
            {/* Mobile caption */}
            <div 
              ref={mobilePendragonRef}
              className={`sm:hidden w-full bg-black/90 overflow-hidden transition-all duration-500 ease-out ${
                mobilePendragonExpanded ? 'max-h-96 p-4 pb-6' : 'max-h-12 p-4 py-3'
              }`}
            >
              <h4 
                className="text-white/90 text-xs uppercase tracking-[0.2em] mb-2"
                style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
              >
                Screenplay Adaptation
              </h4>
              <div className={`transition-opacity duration-500 ${mobilePendragonExpanded ? 'opacity-100' : 'opacity-0'}`}>
                <h3 
                  className="text-white text-xl font-light mb-3 tracking-wide"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Surname Pendragon
                </h3>
                <p 
                  className="text-white/70 text-sm leading-relaxed mb-3"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  A sweeping family saga spanning three generations, where legacy is both burden and blessing. 
                  When secrets from the past resurface, the Pendragon name becomes a curse worth fighting for.
                </p>
                <p 
                  className="text-white/50 text-xs uppercase tracking-widest"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                >
                  Feature Film • Drama • In Development
                </p>
              </div>
            </div>
          </section>

          {/* Stories Waiting to be Told */}
          <section ref={storiesSectionRef} className="text-center py-16 sm:py-24 bg-white">
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
