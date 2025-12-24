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
import newReleaseLabel from "@/assets/new-release-label.jpeg";
import godOfLiesStreetScene from "@/assets/god-of-lies-street-scene.png";
import godOfLiesManyFaces from "@/assets/god-of-lies-many-faces.png";
import godOfLiesHandshake from "@/assets/god-of-lies-handshake.png";
import comicCornerLeft from "@/assets/comic-corner-left.png";
import comicCornerRight from "@/assets/comic-corner-right.png";

const Comics = () => {
  useScrollToTop();
  const isMobile = useIsMobile();
  const isWidescreen = useWidescreenAspectRatio();
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [zoomedImage, setZoomedImage] = useState<{src: string; alt: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [showGodOfLiesDescription, setShowGodOfLiesDescription] = useState(false);
  const [godOfLiesDescriptionVisible, setGodOfLiesDescriptionVisible] = useState(true); // tap toggle state
  const [showBusStopSection, setShowBusStopSection] = useState(false);
  const [showMagazineHeader, setShowMagazineHeader] = useState(false);
  const [showMagazineImages, setShowMagazineImages] = useState(false);
  const [showMagazineText, setShowMagazineText] = useState(false);
  const [showPendragon, setShowPendragon] = useState(false);
  const [showPendragonCaption, setShowPendragonCaption] = useState(false);
  const [pendragonCaptionVisible, setPendragonCaptionVisible] = useState(true); // tap toggle state (like godOfLiesDescriptionVisible)
  const [mobilePendragonExpanded, setMobilePendragonExpanded] = useState(false);
  const [pageReady, setPageReady] = useState(false);
  const [isNarrowPortrait, setIsNarrowPortrait] = useState(false); // 13-inch iPad portrait detection
  const [godOfLiesImageLoaded, setGodOfLiesImageLoaded] = useState(false); // Track God of Lies image load
  const [topSectionsLoaded, setTopSectionsLoaded] = useState(false); // Track when top sections are loaded
  const mobilePendragonRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const hasScrolledIntoPendragon = useRef(false);
  
  // Refs for snap sections
  const bannerSectionRef = useRef<HTMLElement>(null);
  const godOfLiesSectionRef = useRef<HTMLElement>(null);
  const busStopSectionRef = useRef<HTMLElement>(null);
  const pendragonSectionRef = useRef<HTMLElement>(null);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const fixedHeaderHeight = 64; // Fixed header height to avoid browser bar variability

  // Track scroll for slide-in animations
  useEffect(() => {
    const handleScroll = () => {
      // Show God of Lies description when user starts scrolling (even just a little)
      if (window.scrollY > 20) {
        setShowGodOfLiesDescription(true);
      }
      
      if (godOfLiesSectionRef.current) {
        const rect = godOfLiesSectionRef.current.getBoundingClientRect();
        
        // Show bus stop section when ANY white space appears below God of Lies image
        const busStopThreshold = window.innerHeight - rect.bottom;
        setShowBusStopSection(busStopThreshold > 0);
        
        // Staggered animations for magazine section elements
        if (busStopThreshold > 50) {
          setShowMagazineHeader(true);
        }
        if (busStopThreshold > 150) {
          setShowMagazineImages(true);
        }
        if (busStopThreshold > 250) {
          setShowMagazineText(true);
        }
      }
      
      // Show Pendragon when magazine section is scrolled past (near end of it)
      if (busStopSectionRef.current && !isMobile && !isNarrowPortrait) {
        const magazineRect = busStopSectionRef.current.getBoundingClientRect();
        // Trigger Pendragon when magazine section starts to scroll off (appears much earlier)
        const pendragonTrigger = magazineRect.bottom < window.innerHeight * 0.85;
        setShowPendragon(pendragonTrigger);
      } else if (godOfLiesSectionRef.current) {
        // Fallback for mobile/narrow portrait
        const rect = godOfLiesSectionRef.current.getBoundingClientRect();
        const pendragonThreshold = rect.height * 0.3;
        setShowPendragon(rect.top < -pendragonThreshold);
      }
      
      // Show Pendragon caption when Pendragon section is visible
      if (pendragonSectionRef.current) {
        const pendragonRect = pendragonSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // For narrow portrait desktop (13" iPad): Only show caption when Pendragon occupies most of the page
        const isNarrowPortraitNow = window.innerWidth >= 950 && window.innerWidth <= 1100 && window.innerHeight > window.innerWidth;
        
        if (isNarrowPortraitNow) {
          const pendragonEntirelyVisible = pendragonRect.top >= fixedHeaderHeight && pendragonRect.bottom <= viewportHeight;
          setShowPendragonCaption(pendragonEntirelyVisible || pendragonRect.top <= fixedHeaderHeight);
        } else {
          setShowPendragonCaption(pendragonRect.bottom > 0 && pendragonRect.top < viewportHeight);
        }
      }
      
      // Mobile: Expand Pendragon caption based on scroll position relative to the caption bar
      if (mobilePendragonRef.current) {
        const captionRect = mobilePendragonRef.current.getBoundingClientRect();
        const shouldExpand = captionRect.top < window.innerHeight * 0.6;
        setMobilePendragonExpanded(shouldExpand);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isNarrowPortrait]);

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

  // Force scroll to top on page load/navigation and preload God of Lies image
  useEffect(() => {
    // Immediately scroll to top
    window.scrollTo(0, 0);
    
    // Show page immediately - don't wait for image preload
    // This prevents blank page issues in preview panes and iframes
    setPageReady(true);
    
    // Preload God of Lies image in background
    const img = new Image();
    img.onload = () => {
      // Allow bottom sections to load after image is ready
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.onerror = () => {
      // Allow bottom sections anyway if image fails to load
      setTimeout(() => setTopSectionsLoaded(true), 300);
    };
    img.src = godOfLiesCover;
    
    // Fallback: allow bottom sections after 800ms regardless
    const timeout = setTimeout(() => {
      setTopSectionsLoaded(true);
    }, 800);
    
    return () => clearTimeout(timeout);
  }, []);

  // Check if we're on a narrow portrait desktop (13-inch iPad in portrait)
  // This is desktop mode (width >= 950) but in portrait orientation with limited height
  const isNarrowPortraitDesktop = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Desktop mode (>= 950px width) but portrait-ish aspect ratio (height > width or close)
    // 13-inch iPad portrait is around 1024x1366
    return width >= 950 && width <= 1100 && height > width;
  }, []);

  // On narrow portrait desktop, show Pendragon immediately and track state for UI
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

  return (
    <div className={`min-h-screen bg-white overflow-x-hidden overflow-y-visible transition-opacity duration-300 flex flex-col ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />

      <main className="relative flex-1">
        {/* Header Banner - Sticky so content scrolls over it */}
        <header 
          ref={bannerSectionRef}
          className="py-6 xs:py-10 sm:py-8 lg:py-10 px-4 sm:px-8 lg:px-12 mt-[64px] sticky top-[64px] z-0 overflow-hidden"
          style={{ backgroundColor: '#f5f0e1' }}
        >
          {/* Decorative comic-style border */}
          <div className="absolute inset-x-4 sm:inset-x-8 top-2 bottom-2 border-2 border-dashed border-amber-700/30 pointer-events-none" />
          
          {/* Main title */}
          <div className="text-center relative z-10">
            <h1 
              className="font-bold tracking-wide text-5xl xs:text-7xl sm:text-6xl lg:text-7xl xl:text-8xl text-black"
              style={{ 
                fontFamily: 'Boogaloo, cursive'
              }}
            >
              {/* Phone only: & symbol */}
              <span className="xs:hidden">COMICS & SCRIPTS</span>
              {/* Tablet and Desktop: full "AND" word */}
              <span className="hidden xs:inline">COMICS AND SCRIPTS</span>
            </h1>
          </div>
          
          {/* Subtitle with red/amber text and lines */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-3 relative z-10">
            <div className="flex-1 h-1 bg-amber-700 max-w-8 sm:max-w-20" />
            <p className="text-[10px] sm:text-sm text-amber-700 tracking-widest uppercase font-medium text-center">
              Original Stories in Sequential Art & Screenplay
            </p>
            <div className="flex-1 h-1 bg-amber-700 max-w-8 sm:max-w-20" />
          </div>
        </header>

        {/* GOD OF LIES - Higher z-index so it scrolls over the banner */}
        <section 
          ref={godOfLiesSectionRef} 
          className="w-full relative z-10 bg-white"
        >
          {/* Clickable overlay for tap-to-toggle on desktop */}
          <div 
            className="absolute inset-0 cursor-pointer z-10 hidden sm:block"
            onClick={() => setGodOfLiesDescriptionVisible(prev => !prev)}
          />
          
          <img 
            src={godOfLiesCover}
            alt="God of Lies"
            className="w-full"
            onLoad={() => setGodOfLiesImageLoaded(true)}
          />
          
          {/* MANGA • WEBTOON text at bottom - only shows after image loads */}
          {godOfLiesImageLoaded && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden sm:block z-20 pointer-events-none">
              <p 
                className="text-white/90 text-sm tracking-[0.3em] uppercase font-medium"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  textShadow: '1px 1px 3px rgba(0,0,0,0.8)'
                }}
              >
                MANGA <span className="mx-2">•</span> WEBTOON
              </p>
            </div>
          )}
          
          {/* New Release label - only shows after image loads */}
          {godOfLiesImageLoaded && (
            <div 
              className="absolute right-[3%] top-[45%] w-20 xs:w-40 sm:right-[4%] sm:top-[52%] sm:w-48 lg:w-56 z-20 pointer-events-none"
            >
              <img 
                src={newReleaseLabel}
                alt="First Issue! New Release"
                className="w-full h-auto drop-shadow-lg"
              />
            </div>
          )}

        </section>

        {/* GOD OF LIES Magazine-Style Promo Section - Desktop Only */}
        {!isMobile && !isNarrowPortrait && (
          <section 
            ref={busStopSectionRef}
            className={`w-full bg-gradient-to-b from-[#f5f0e1] to-[#e8e0cc] overflow-hidden transition-all duration-700 ease-out ${
              showBusStopSection 
                ? 'max-h-[2000px] opacity-100' 
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className="max-w-5xl mx-auto px-6 py-8 lg:py-10">
              {/* Magazine Header - Fades in first */}
              <div className={`text-center mb-6 transition-all duration-700 ease-out ${
                showMagazineHeader ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <p 
                  className="text-xs uppercase tracking-[0.4em] text-amber-800/70 mb-2"
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                >
                  Featured Series
                </p>
                <h2 
                  className="text-4xl lg:text-5xl font-bold text-slate-900 mb-3"
                  style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.02em' }}
                >
                  GOD OF LIES
                </h2>
                <div className="w-24 h-1 bg-amber-700 mx-auto" />
              </div>

              {/* Magazine Layout Grid - Images and Text side by side */}
              <div className={`grid grid-cols-12 gap-5 transition-all duration-700 ease-out delay-100 ${
                showMagazineImages ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {/* Left Column - First Image + Text Below */}
                <div className="col-span-5 flex flex-col gap-4">
                  {/* First Image */}
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setZoomedImage({ src: godOfLiesManyFaces, alt: 'The Man of Many Faces' })}
                  >
                    <img 
                      src={godOfLiesManyFaces}
                      alt="The Man of Many Faces"
                      className="w-full shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p 
                        className="text-white/90 text-xs uppercase tracking-widest"
                        style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      >
                        The Man of Many Faces
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">Click to enlarge</span>
                    </div>
                  </div>
                  
                  {/* Text Below Left Image */}
                  <div className={`transition-all duration-700 ease-out delay-200 ${
                    showMagazineText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <p 
                      className="text-slate-700 text-base leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-amber-800"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      In a world where truth is currency, one man discovers he can make anyone believe anything. 
                      Takeshi Mori has mastered the art of deception—manipulating politicians, businessmen, and entire corporations with surgical precision.
                      For years, he operated in the shadows, a phantom pulling strings that shaped nations. But when a single child sees through his carefully constructed lies, 
                      his empire of illusions begins to crumble. Now hunted by those he once controlled, Takeshi must confront the one truth he's spent his life avoiding: 
                      that every lie demands a reckoning.
                    </p>
                    <p 
                      className="text-amber-800 text-xs uppercase tracking-widest mt-3"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • Webtoon • 2026
                    </p>
                  </div>
                </div>

                {/* Right Column - Two Stacked Images */}
                <div className="col-span-7 flex flex-col gap-4">
                  {/* Top Right Image */}
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setZoomedImage({ src: godOfLiesStreetScene, alt: 'Street scene' })}
                  >
                    <img 
                      src={godOfLiesStreetScene}
                      alt="Street scene"
                      className="w-full shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">Click to enlarge</span>
                    </div>
                  </div>

                  {/* Bottom Right Image */}
                  <div 
                    className="relative cursor-pointer group"
                    onClick={() => setZoomedImage({ src: godOfLiesHandshake, alt: 'The deal' })}
                  >
                    <img 
                      src={godOfLiesHandshake}
                      alt="The deal"
                      className="w-full shadow-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">Click to enlarge</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GOD OF LIES Text Section - MOBILE AND 13" iPad Portrait */}
        {/* Shows between God of Lies image and Surname Pendragon, slides in on scroll */}
        {(isMobile || isNarrowPortrait) && (
          <section 
            className="w-full relative"
          >
            <div className="flex flex-col">
              {/* Bus stop image - only on actual mobile phones, not on tablets or 13" iPad portrait */}
              {isMobile && (
                <div className="w-full">
                  <img 
                    src={godOfLiesBusStop}
                    alt="God of Lies - Bus Stop Scene"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* GOD OF LIES text - slides down vertically on scroll (same style as Pendragon caption) */}
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

        {/* SURNAME PENDRAGON - Snap Section 3 */}
        {/* On mobile: wait for God of Lies image to load first, then show */}
        {/* On desktop: fades in on scroll */}
        <section 
          ref={pendragonSectionRef} 
          className={`w-full relative transition-all duration-700 ease-out ${
            // Mobile/narrow portrait: wait for God of Lies image to load, then show
            // Desktop: fade/slide animation based on scroll
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
          
          
          {/* Slide-in caption panel from left - classy film magazine style - hidden on mobile */}
          {/* Tapping anywhere on the Pendragon image toggles the caption visibility */}
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
          
          {/* Mobile caption - below image, expands on scroll */}
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
        

        {/* Stories Waiting to be Told - Snap Section 4 */}
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

        {/* Forthcoming Comics Grid - Only loads after top sections */}
        <section className="pb-6 sm:pb-20 px-4 sm:px-6 bg-white relative">
          {/* All 6 comics in a grid - 2 columns on mobile, 3 on desktop */}
          {topSectionsLoaded && (
            <div 
              ref={row1Ref}
              data-row="row1"
              className={`transition-all duration-700 ${
                visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Comic images - smaller hover scale on tablet mobile to prevent overlap */}
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
          
          {/* Hidden ref for row2 to maintain observer */}
          <div ref={row2Ref} data-row="row2" className="hidden" />
        </section>
      </main>
      
      {/* Footer with mascot character */}
      <footer className="bg-[#1a1a1a] py-10 max-sm:py-6 relative overflow-visible">
        {/* Footer character - positioned with right elbow 6px from page edge, hidden when not enough space */}
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
            className="max-w-full max-h-full object-contain animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white text-xl font-light transition-colors"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default Comics;
