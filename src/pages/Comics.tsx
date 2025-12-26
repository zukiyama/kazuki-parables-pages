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
  
  // Scroll-locked sections state (0 = cover, 1 = vignettes, 2 = cream blurb, 3+ = normal scroll)
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionProgress, setSectionProgress] = useState(0);
  
  const mobilePendragonRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  
  const pendragonSectionRef = useRef<HTMLElement>(null);
  const storiesSectionRef = useRef<HTMLElement>(null);
  const fixedHeaderHeight = 64;

  // Calculate section visibility based on scroll - POP-UP BOOK EFFECT
  // Scrolling doesn't move content down - it triggers transitions between fixed sections
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      
      // Each "section" takes about 1 viewport height of scroll to transition
      // But the content stays fixed - only the transitions change
      const section0End = vh * 0.6;   // Cover dissolves, vignettes slide in
      const section1End = vh * 1.4;   // Vignettes slide out, cream slides in  
      const section2End = vh * 2.2;   // Cream stays, then normal scroll begins
      
      if (scrollY < section0End) {
        // Section 0: Cover visible, fading out as we scroll
        setCurrentSection(0);
        setSectionProgress(scrollY / section0End);
      } else if (scrollY < section1End) {
        // Section 1: Vignettes visible, they slide in then out
        setCurrentSection(1);
        setSectionProgress((scrollY - section0End) / (section1End - section0End));
      } else if (scrollY < section2End) {
        // Section 2: Cream section visible
        setCurrentSection(2);
        setSectionProgress((scrollY - section1End) / (section2End - section1End));
      } else {
        // Past section 2: Normal scrolling begins
        setCurrentSection(3);
        setSectionProgress(1);
      }
      
      // Mobile God of Lies description
      if (scrollY > 20) {
        setShowGodOfLiesDescription(true);
      }
      
      // Show Pendragon when past section 2
      if (scrollY > vh * 2.5) {
        setShowPendragon(true);
      }
      
      // Show Pendragon caption
      if (pendragonSectionRef.current) {
        const pendragonRect = pendragonSectionRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const isNarrowPortraitNow = window.innerWidth >= 950 && window.innerWidth <= 1100 && window.innerHeight > window.innerWidth;
        
        if (isNarrowPortraitNow) {
          const pendragonEntirelyVisible = pendragonRect.top >= fixedHeaderHeight && pendragonRect.bottom <= viewportHeight;
          setShowPendragonCaption(pendragonEntirelyVisible || pendragonRect.top <= fixedHeaderHeight);
        } else {
          setShowPendragonCaption(pendragonRect.bottom > 0 && pendragonRect.top < viewportHeight);
        }
      }
      
      // Mobile: Expand Pendragon caption
      if (mobilePendragonRef.current) {
        const captionRect = mobilePendragonRef.current.getBoundingClientRect();
        const shouldExpand = captionRect.top < window.innerHeight * 0.6;
        setMobilePendragonExpanded(shouldExpand);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile, isNarrowPortrait]);

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

  // Calculate opacities and transforms for each section - POP-UP BOOK STYLE
  // Cover: visible at start, fades out as vignettes slide in
  const coverOpacity = currentSection === 0 ? 1 - sectionProgress : 0;
  const coverVisible = currentSection === 0;
  
  // Vignettes: slide in from sides when cover fades (section 0), stay during section 1, slide out when cream comes (section 2)
  const vignetteActive = (currentSection === 0 && sectionProgress > 0.2) || currentSection === 1 || (currentSection === 2 && sectionProgress < 0.5);
  const vignetteSlideIn = currentSection === 0 ? Math.min(1, sectionProgress * 2) : 1;
  const vignetteSlideOut = currentSection === 2 ? sectionProgress : 0;
  const vignetteOpacity = currentSection === 0 
    ? Math.min(1, sectionProgress * 2.5) 
    : currentSection === 1 
      ? 1 
      : currentSection === 2 
        ? 1 - sectionProgress 
        : 0;
  
  // Cream section: slides in when vignettes slide out (section 2)
  const creamActive = currentSection >= 2;
  const creamSlideProgress = currentSection === 2 ? sectionProgress : currentSection >= 3 ? 1 : 0;
  const creamOpacity = currentSection >= 2 ? Math.min(1, sectionProgress * 1.5) : 0;

  return (
    <div className={`min-h-screen bg-white overflow-x-hidden transition-opacity duration-300 flex flex-col ${pageReady ? 'opacity-100' : 'opacity-0'}`}>
      <Navigation />

      <main className="relative flex-1">
        {/* FIXED SCROLL CONTAINER - First 3 sections occupy 3vh of scroll but content is fixed */}
        <div className="relative" style={{ height: '300vh' }}>
          {/* Sticky container that holds all 3 animated sections */}
          <div className="sticky top-0 h-screen overflow-hidden">
            
            {/* Header Banner - Always visible at top */}
            <header className="absolute top-0 left-0 right-0 py-8 sm:py-12 lg:py-16 px-4 sm:px-8 lg:px-12 mt-[64px] bg-white z-30">
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
                
                {/* Main title - Tintin/Adventure comic style with bigger letters */}
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

                {/* Subtitle */}
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
              className="absolute inset-0 flex items-center justify-center pt-32 sm:pt-40"
              style={{ 
                opacity: coverOpacity, 
                pointerEvents: coverVisible ? 'auto' : 'none',
                transition: 'opacity 0.4s ease-out'
              }}
            >
              <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24">
                <img 
                  src={godOfLiesCover}
                  alt="God of Lies"
                  className="w-full max-h-[70vh] object-contain mx-auto"
                  onLoad={() => setGodOfLiesImageLoaded(true)}
                />
              </div>
            </section>

            {/* SECTION 1: VIGNETTES - Slide in from sides to FILL the screen */}
            <section 
              className="absolute inset-0 pt-32 sm:pt-40"
              style={{ 
                opacity: vignetteOpacity,
                pointerEvents: vignetteActive ? 'auto' : 'none'
              }}
            >
              <div className="w-full h-full flex items-center px-2 sm:px-4 lg:px-6">
                {/* Full-screen layout with larger images */}
                <div className="w-full h-full max-h-[calc(100vh-10rem)] flex items-center">
                  
                  {/* LEFT SIDE - Board game image (LARGE, fills left half) */}
                  <div 
                    className="w-[38%] h-full flex items-center justify-center pr-2"
                    style={{
                      transform: `translateX(${-100 + (vignetteSlideIn * 100) - (vignetteSlideOut * 100)}%)`,
                      transition: 'transform 0.5s ease-out'
                    }}
                  >
                    <img 
                      src={vignetteBoardgame}
                      alt="Family moments - God of Lies"
                      className="w-full h-full max-h-[75vh] object-contain drop-shadow-2xl"
                    />
                  </div>
                  
                  {/* CENTER - Magazine text content */}
                  <div 
                    className="w-[24%] flex items-center justify-center px-2"
                    style={{
                      opacity: vignetteSlideIn - vignetteSlideOut,
                      transform: `translateY(${20 - (vignetteSlideIn * 20) + (vignetteSlideOut * 20)}px)`,
                      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                    }}
                  >
                    <div className="text-center">
                      <p 
                        className="text-[10px] sm:text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-500 mb-2 sm:mb-3"
                        style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      >
                        Featured
                      </p>
                      <h2 
                        className="text-xl sm:text-3xl lg:text-5xl xl:text-6xl mb-2 sm:mb-4 text-slate-900"
                        style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.04em' }}
                      >
                        GOD OF LIES
                      </h2>
                      <div className="w-8 sm:w-16 lg:w-20 h-0.5 sm:h-1 bg-red-600 mx-auto mb-2 sm:mb-4" />
                      <p 
                        className="text-xs sm:text-sm lg:text-base xl:text-lg text-slate-700 leading-relaxed mb-2 sm:mb-3 hidden sm:block"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        In a world where truth is currency, one man discovers he can make anyone believe anything.
                      </p>
                      <p 
                        className="text-[10px] sm:text-xs lg:text-sm text-blue-700 uppercase tracking-[0.15em] sm:tracking-[0.25em]"
                        style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                      >
                        Manga • 2026
                      </p>
                    </div>
                  </div>
                  
                  {/* RIGHT SIDE - Two images stacked (LARGER, fill right side) */}
                  <div 
                    className="w-[38%] h-full flex flex-col gap-2 lg:gap-3 justify-center pl-2"
                    style={{
                      transform: `translateX(${100 - (vignetteSlideIn * 100) + (vignetteSlideOut * 100)}%)`,
                      transition: 'transform 0.5s ease-out'
                    }}
                  >
                    {/* Top right image - Apartments */}
                    <div className="flex-1 flex items-end justify-center max-h-[37vh]">
                      <img 
                        src={vignetteApartments}
                        alt="The neighborhood - God of Lies"
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                    
                    {/* Bottom right image - Sweeping */}
                    <div className="flex-1 flex items-start justify-center max-h-[37vh]">
                      <img 
                        src={vignetteSweeping}
                        alt="Daily life - God of Lies"
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: CREAM BLURB - Slides up to replace vignettes */}
            <section 
              className="absolute inset-0 flex items-center justify-center pt-32 sm:pt-40"
              style={{ 
                opacity: creamOpacity, 
                pointerEvents: creamActive ? 'auto' : 'none',
                background: 'linear-gradient(to bottom, #f5f0e1, #e8e0cc)',
                transform: `translateY(${100 - (creamSlideProgress * 100)}%)`,
                transition: 'transform 0.5s ease-out, opacity 0.4s ease-out'
              }}
            >
              <div className="w-full max-w-5xl mx-auto px-6 py-8">
                {/* Magazine Header */}
                <div className="text-center mb-8">
                  <p 
                    className="text-xs uppercase tracking-[0.4em] text-amber-800/70 mb-2"
                    style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                  >
                    Featured Series
                  </p>
                  <h2 
                    className="text-4xl lg:text-6xl font-bold text-slate-900 mb-3"
                    style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.02em' }}
                  >
                    GOD OF LIES
                  </h2>
                  <div className="w-24 h-1 bg-amber-700 mx-auto" />
                </div>

                {/* Single large image with text - Magazine style layout */}
                <div className="flex flex-col lg:flex-row gap-8 items-center">
                  {/* Main Image - Street scene with masked figure (LARGER) */}
                  <div className="lg:w-1/2">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setZoomedImage({ src: godOfLiesStreetScene, alt: 'The Masked Figure' })}
                    >
                      <img 
                        src={godOfLiesStreetScene}
                        alt="The Masked Figure following"
                        className="w-full max-h-[55vh] object-contain shadow-xl transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm">Click to enlarge</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Text Content */}
                  <div className="lg:w-1/2">
                    <p 
                      className="text-slate-700 text-base lg:text-lg leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-amber-800"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      In a world where truth is currency, one man discovers he can make anyone believe anything. 
                      <span className="text-red-700 font-semibold"> Takeshi Mori</span> has mastered the art of deception—manipulating politicians, businessmen, and entire corporations with surgical precision.
                    </p>
                    <p 
                      className="text-slate-700 text-base lg:text-lg leading-relaxed mt-5"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      For years, he operated in the shadows, a phantom pulling strings that shaped nations. But when a 
                      <span className="text-blue-700 font-semibold"> single child</span> sees through his carefully constructed lies, 
                      his empire of illusions begins to crumble. Now hunted by those he once controlled, Takeshi must confront the one truth he's spent his life avoiding: 
                      <span className="italic"> that every lie demands a reckoning.</span>
                    </p>
                    <p 
                      className="text-amber-800 text-xs uppercase tracking-widest mt-5"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Manga • Webtoon • 2026
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* NORMAL SCROLLING CONTENT BELOW */}
        
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
      </main>
      
      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-10 max-sm:py-6 relative overflow-visible">
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