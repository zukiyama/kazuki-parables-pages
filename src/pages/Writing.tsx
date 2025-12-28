import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";

import { YoungAdultSlideshow, YoungAdultSlideshowRef } from "@/components/YoungAdultSlideshow";
import { BookCoverSlideshow } from "@/components/BookCoverSlideshow";
import { BookshelfMenu } from "@/components/BookshelfMenu";
import { FloatingQuote } from "@/components/FloatingQuote";
import { MagazineBlurb } from "@/components/MagazineBlurb";

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
  const isWidescreen = useWidescreenAspectRatio();
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentYoungAdultBook, setCurrentYoungAdultBook] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(true); // For widescreen banner toggle
  const [parableTrilogyVisible, setParableTrilogyVisible] = useState(true); // For fade animation
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
  const isDraggingScrollbar = useRef(false);
  const parableTrilogyRef = useRef<HTMLDivElement>(null);

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


  // Scroll snap logic - loose snapping, only when section fills most of screen, DESKTOP ONLY
  // DISABLED for 16:9/16:10 widescreen devices
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastSnappedSection: string | null = null;
    
    // Sections that should NOT have snap behavior (except young-adult which has special handling)
    const noSnapSections = ['kaiju'];

    const getBookSections = () => {
      // Disable scroll snap on mobile
      if (window.innerWidth < 950) return [];
      
      // Scroll snap is now enabled for widescreen devices as well
      
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

    // Use visualViewport.height on iOS for accurate measurements
    const getViewportHeight = () => {
      return window.visualViewport?.height ?? window.innerHeight;
    };

    const getCenterSnapPoint = (section: HTMLElement, sectionName: string) => {
      const headerBottom = getHeaderBottom();
      // For widescreen: ignore banner completely - snap is independent of banner visibility
      const isWidescreenDevice = window.innerWidth / window.innerHeight >= 1.6;
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreenDevice) ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      const viewportHeight = getViewportHeight();
      const availableHeight = viewportHeight - topOffset;
      
      // Special handling for young-adult section
      if (sectionName === 'young-adult') {
        // Find the title element and slideshow container
        const titleEl = section.querySelector('h2') as HTMLElement;
        const slideshowContainer = section.querySelector('.transition-opacity.duration-1000.delay-500') as HTMLElement;
        
        if (!titleEl || !slideshowContainer) return null;
        
        const titleRect = titleEl.getBoundingClientRect();
        const slideshowRect = slideshowContainer.getBoundingClientRect();
        
        // Calculate total height of title + subtitle + slideshow (in viewport coords)
        const titleTopInViewport = titleRect.top;
        const slideshowBottomInViewport = slideshowRect.bottom;
        const totalContentHeight = slideshowBottomInViewport - titleTopInViewport;
        
        // Recalculate available height dynamically (accounts for browser chrome changes)
        const currentAvailableHeight = viewportHeight - topOffset;
        
        // Scenario A: Can fit all content (title + "Young Adult Series" text + slideshow)
        if (currentAvailableHeight >= totalContentHeight + 40) { // 40px buffer
          // Center the entire content in the available space
          const titleTop = titleRect.top + window.scrollY;
          const slideshowBottom = slideshowRect.bottom + window.scrollY;
          const contentCenter = titleTop + ((slideshowBottom - titleTop) / 2);
          const desiredCenterY = topOffset + (currentAvailableHeight / 2);
          return Math.max(0, contentCenter - desiredCenterY);
        } else {
          // Scenario B: Can't fit all, just center the slideshow alone
          const slideshowTop = slideshowRect.top + window.scrollY;
          const slideshowHeight = slideshowRect.height;
          const slideshowCenter = slideshowTop + (slideshowHeight / 2);
          const desiredCenterY = topOffset + (currentAvailableHeight / 2);
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
      // Disable scroll snap on mobile/tablet (matches MOBILE_BREAKPOINT of 950px)
      if (window.innerWidth < 950) return;
      if (isSnapping.current) return;
      // Disable scroll snap while dragging the scrollbar
      if (isDraggingScrollbar.current) return;
      
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
      // For widescreen: ignore banner completely - snap is independent of banner visibility
      const isWidescreenDevice = window.innerWidth / window.innerHeight >= 1.6;
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreenDevice) ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      const viewportHeight = getViewportHeight();
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

      // For young-adult section when approaching from ABOVE, require much higher visibility threshold
      // This allows reading the "Young Adult Series" text without snapping back
      let snapThreshold = 0.5; // Default threshold
      
      if (bestSection && bestSection.name === 'young-adult') {
        const slideshowRect = bestSection.el.getBoundingClientRect();
        // If slideshow is mostly below viewport center, we're approaching from above
        // Need to be very close to slideshow to trigger snap from above
        if (slideshowRect.top > viewportHeight * 0.2) {
          snapThreshold = 0.85; // Much higher threshold when approaching from above
        }
      }

      // Only snap if:
      // 1. Section fills > threshold of viewport
      // 2. It's not the section we just snapped away from
      if (bestSection && highestVisibility > snapThreshold) {
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
      // Skip snap timeout if dragging scrollbar
      if (isDraggingScrollbar.current) return;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    // Detect scrollbar dragging: mousedown in scrollbar area + mouse movement
    const scrollbarWidth = 20;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.clientX >= window.innerWidth - scrollbarWidth) {
        isDraggingScrollbar.current = true;
      }
    };
    
    const handleMouseUp = () => {
      if (isDraggingScrollbar.current) {
        isDraggingScrollbar.current = false;
        // After releasing scrollbar, allow snap to resume normally
        // Clear any pending timeout and set a fresh one
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScrollEnd, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      clearTimeout(scrollTimeout);
    };
  }, [getHeaderBottom, isWidescreen]);

  // Track Parable Trilogy visibility for fade animation
  useEffect(() => {
    const checkParableTrilogyVisibility = () => {
      const headerBottom = getHeaderBottom();
      
      // If we're near the top of the page, always show
      if (window.scrollY < 50) {
        setParableTrilogyVisible(true);
        return;
      }
      
      if (!parableTrilogyRef.current) return;
      
      const rect = parableTrilogyRef.current.getBoundingClientRect();
      const titleEl = parableTrilogyRef.current.querySelector('h2');
      
      if (titleEl) {
        const titleRect = titleEl.getBoundingClientRect();
        
        // Fade OUT: when the title is completely above the header (scrolled past)
        if (titleRect.bottom < headerBottom) {
          setParableTrilogyVisible(false);
        }
        // Fade IN: when any part of the text container is visible below header
        else if (rect.bottom > headerBottom) {
          setParableTrilogyVisible(true);
        }
      }
    };
    
    window.addEventListener('scroll', checkParableTrilogyVisibility, { passive: true });
    checkParableTrilogyVisibility(); // Initial check
    
    return () => window.removeEventListener('scroll', checkParableTrilogyVisibility);
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

  // Handle click to toggle banner on widescreen devices
  const handlePageClick = useCallback((e: React.MouseEvent) => {
    if (!isWidescreen) return;
    
    // At or near the top of the page, don't allow hiding the banner
    if (window.scrollY <= 50) return;
    
    // Don't toggle if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('nav') ||
      target.closest('[role="button"]') ||
      target.closest('[data-slideshow-control]') ||
      target.closest('.fixed.top-16') // The bookshelf menu itself
    ) {
      return;
    }
    
    setBannerVisible(prev => !prev);
  }, [isWidescreen]);

  // Widescreen only: Auto-show banner at top of page, hide on scroll down
  useEffect(() => {
    if (!isWidescreen) return;

    let lastScrollY = window.scrollY;

    const handleScrollForBanner = () => {
      const scrollTop = window.scrollY;
      
      // If at or near the top (within 50px), show banner
      if (scrollTop <= 50) {
        setBannerVisible(true);
      } else if (scrollTop > lastScrollY && scrollTop > 50) {
        // Scrolling down and past initial area - hide banner
        setBannerVisible(false);
      }
      
      lastScrollY = scrollTop;
    };

    window.addEventListener('scroll', handleScrollForBanner, { passive: true });
    // Check initial position
    handleScrollForBanner();
    
    return () => window.removeEventListener('scroll', handleScrollForBanner);
  }, [isWidescreen]);

  // Track if cursor was previously outside banner area (for enter detection)
  const cursorWasOutsideBannerRef = useRef(true);
  const bannerClickedRef = useRef(false); // Track if banner was just clicked

  // Widescreen only: Separate trigger systems for banner appearance vs disappearance
  // Trigger A: Top-edge proximity zone (for APPEARANCE only) - unchanged
  // Trigger B: Actual banner DOM bottom edge (for DISAPPEARANCE only)
  useEffect(() => {
    if (!isWidescreen) return;

    // Helper to check if event is in scrollbar area
    const isInScrollbarArea = (e: MouseEvent) => {
      const scrollbarWidth = 20;
      return e.clientX >= window.innerWidth - scrollbarWidth;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // IGNORE if cursor is in scrollbar area (right edge of window)
      if (isInScrollbarArea(e)) {
        return; // Don't trigger any banner behavior when in scrollbar area
      }
      
      // Get the header/nav height
      const nav = document.querySelector('nav.fixed, [data-header]') as HTMLElement;
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 64;
      
      // TRIGGER A: Top-edge hover zone for APPEARANCE (unchanged distance)
      const appearanceZoneTop = navBottom;
      const appearanceZoneBottom = navBottom + 100; // Original proximity zone
      const isInAppearanceZone = e.clientY >= appearanceZoneTop && e.clientY <= appearanceZoneBottom;
      
      // TRIGGER B: Actual banner bottom edge for DISAPPEARANCE
      // Query the real banner element to get its actual rendered bottom
      const bannerElement = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerActualBottom = bannerElement ? bannerElement.getBoundingClientRect().bottom : navBottom + 150;
      const isAboveBannerBottom = e.clientY <= bannerActualBottom;
      
      if (isInAppearanceZone) {
        // TRIGGER A: Cursor in appearance zone - show banner if entering from outside
        if (cursorWasOutsideBannerRef.current && !bannerClickedRef.current && !bannerVisible) {
          setBannerVisible(true);
        }
        cursorWasOutsideBannerRef.current = false;
        bannerClickedRef.current = false;
      } else if (isAboveBannerBottom && bannerVisible) {
        // Cursor is below appearance zone but still above banner bottom - keep banner visible
        cursorWasOutsideBannerRef.current = false;
        bannerClickedRef.current = false;
      } else {
        // Cursor is below the actual banner bottom
        if (!cursorWasOutsideBannerRef.current && bannerVisible) {
          // TRIGGER B: Cursor just left the banner area (moved below actual bottom)
          // Only hide if not at top of page
          if (window.scrollY > 50) {
            setBannerVisible(false);
          }
        }
        cursorWasOutsideBannerRef.current = true;
        bannerClickedRef.current = false;
      }
    };

    // Also ignore clicks in scrollbar area
    const handleClick = (e: MouseEvent) => {
      if (isInScrollbarArea(e)) {
        e.stopPropagation();
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, true); // Capture phase
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, true);
    };
  }, [isWidescreen, bannerVisible]);

  // Callback for when a book in banner is clicked (to prevent flickering)
  const handleBannerBookClick = useCallback(() => {
    bannerClickedRef.current = true;
    cursorWasOutsideBannerRef.current = false; // Cursor is inside since we clicked there
    setBannerVisible(false);
  }, []);

  return (
    <div 
      className="min-h-screen relative overflow-x-hidden"
      onClick={handlePageClick}
    >
      <Navigation />
      <BookshelfMenu 
        onBookClick={handleBookClick} 
        visibleSections={visibleSections} 
        currentYoungAdultBook={currentYoungAdultBook}
        isWidescreen={isWidescreen}
        bannerVisible={bannerVisible}
        onBannerHide={handleBannerBookClick}
        getHeaderBottom={getHeaderBottom}
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
      
      {/* Main content - FIXED padding for widescreen, independent of banner visibility */}
      <main ref={mainRef} className={`relative z-10 transition-all duration-500 ${
        isWidescreen 
          ? 'pt-56' 
          : 'pt-52 max-sm:pt-52'
      }`}>
        {/* KAIJU - The Parable Trilogy Section */}
        <section data-section="kaiju" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-6xl mx-auto">
              {/* Page Title */}
              {/* Widescreen: larger mb (mb-20), iPad: larger mb (mb-20) */}
              <div className={`text-center lg:pt-12 pt-8 ${isWidescreen ? 'mb-20' : 'mb-20'}`}>
                <h1 
                  className={`font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white transition-opacity duration-500 ${
                    visibleSections.has('kaiju') ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Novels
                </h1>
              </div>
              
              {/* The Parable Trilogy Introduction - fades out/in based on scroll trigger */}
              <div 
                ref={parableTrilogyRef}
                className={`text-center mt-8 max-sm:mt-6 ${
                  visibleSections.has('kaiju') ? 'translate-y-0' : 'translate-y-10'
                } ${isWidescreen ? 'mb-24' : 'mb-28 max-sm:mb-16'}`}
                style={{
                  opacity: visibleSections.has('kaiju') ? (parableTrilogyVisible ? 1 : 0) : 0,
                  transition: 'opacity 1.2s ease-in-out, transform 1s ease-out'
                }}
              >
                {/* iPad: slightly larger text (text-5xl), Widescreen: same (text-5xl) */}
                <h2 className={`font-serif font-bold text-yellow-300 mb-6 ${isWidescreen ? 'text-5xl' : 'text-5xl max-sm:text-3xl'}`}>
                  The Parable Trilogy
                </h2>
                <p className={`font-serif leading-relaxed text-white max-w-4xl mx-auto ${isWidescreen ? 'text-xl' : 'text-lg md:text-xl max-sm:text-base'}`}>
                  A metaphysical saga unfolding across the shifting decades of an alternate 20th-century Japan, from mysterious towns and abandoned film sets to mountain temples and secret research facilities far from this world. With a cast as varied as its setting, childhood wonder collides with philosophy and fantasy in this compelling trilogy that explores the boundaries between truth and fiction.
                </p>
              </div>
              
              {/* Book One Title - Centered above both cover and blurb */}
              {/* iPad desktop: less padding (mb-4), Widescreen: more padding (mb-16), iPad portrait mobile: more padding (sm:mb-8) */}
              <div className={`text-center max-sm:mb-10 sm:mb-8 transition-all duration-1000 delay-300 ${
                isWidescreen ? 'mb-16' : 'lg:mb-4'
              } ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <span 
                  className={`uppercase tracking-[0.3em] text-stone-300 block mb-4 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-base'}`}
                  style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif', fontWeight: 400 }}
                >
                  Book One of the Parable Trilogy
                </span>
                <h2 
                  className={`font-light tracking-[0.15em] text-white ${isWidescreen ? 'text-6xl' : 'text-7xl max-sm:text-6xl'}`}
                  style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                >
                  KAIJU
                </h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
                <div className={`transition-all duration-1000 delay-400 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: kaijuCover, alt: "KAIJU - Book One Cover" }
                    ]}
                    title="KAIJU"
                    loading="eager"
                    isWidescreen={isWidescreen}
                  />
                </div>
                {/* Animated wrapper - this moves, frost layer inside stays untransformed */}
                {/* iPad: narrower (73%), Widescreen: wider (88%) and offset right */}
                <div 
                  className={`transition-all duration-1000 delay-500 will-change-transform ${
                    isWidescreen ? 'lg:max-w-[88%] lg:ml-10' : 'lg:max-w-[73%]'
                  } ${
                    visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                  }`}
                >
                  
                  {/* Magazine-style article - wrapper for frost effect */}
                  <div className="relative rounded-lg">
                    {/* Frost layer - NOT transformed, covers the panel */}
                    <div 
                      className="absolute inset-0 rounded-lg border border-white/10"
                      style={{ 
                        backdropFilter: 'blur(12px)', 
                        WebkitBackdropFilter: 'blur(12px)',
                        backgroundColor: 'rgba(0, 0, 0, 0.4)'
                      }}
                    ></div>
                    
                    {/* Content layer - above the frost */}
                    <div className="relative z-10 p-5 max-sm:p-4">
                      {/* Simple horizontal rule - magazine style */}
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-px bg-white/30"></div>
                      </div>
                      
                      {/* Article body - elegant magazine typesetting */}
                      <div className="space-y-3 max-sm:space-y-2">
                        <p 
                          className={`leading-relaxed text-white/90 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-sm'}`}
                          style={{ fontFamily: 'Georgia, serif', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto' }}
                        >
                          <span 
                            className="float-left text-5xl max-sm:text-4xl mr-2 pr-0.5"
                            style={{ fontFamily: 'Baskerville, "Libre Baskerville", Georgia, serif', fontWeight: 400, color: 'rgb(180, 130, 130)', lineHeight: '0.85', marginTop: '0.05em' }}
                          >W</span>hen an object crashes from the sky in <span className="italic text-white/80">Osaka, Japan</span>, and a bizarre figure steps from the wreckage, psychiatrist <span className="italic">Shigemitsu</span> is enlisted by the military to draw on what he remembers of a man he hasn't thought of in twenty years.
                        </p>
                        <p 
                          className={`leading-relaxed text-white/90 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-sm'}`}
                          style={{ fontFamily: 'Georgia, serif', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto' }}
                        >
                          For <span className="italic">Kenji</span>, new to nearby <span className="italic text-white/80">Nakamura</span>, all that matters is not being the only kid sitting alone in class. He soon finds himself friends with <span className="italic">Masako</span>, <span className="italic">Kubo</span> and a group of misfits, who realise that they each share a secret, and begin to suspect the town is not all it seems.
                        </p>
                        <p 
                          className={`leading-relaxed text-white/90 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-sm'}`}
                          style={{ fontFamily: 'Georgia, serif', textAlign: 'justify', hyphens: 'auto', WebkitHyphens: 'auto' }}
                        >
                          <span className="italic">Hinata Togawa</span>, a policewoman relegated to a dead-end posting at a remote local station, is resigned to an uneventful career. But when a seemingly minor disappearance leads to a trail of unexplained vanishings and deepening corruption, she is forced to confront something far closer to home — and far more dangerous — than she ever imagined.
                        </p>
                      </div>
                      
                      {/* Simple horizontal rule - magazine style */}
                      <div className="flex justify-center mt-4">
                        <div className="w-12 h-px bg-white/30"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* iPad desktop: less top margin (lg:mt-10), mobile phone: less top margin (max-sm:mt-10) */}
              <p className={`font-serif leading-relaxed text-white italic text-center mt-14 max-sm:mt-10 mb-16 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${isWidescreen ? 'text-lg' : 'text-xl lg:mt-10 max-sm:text-base'}`}>
                Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three groups of people in a 1979 that happened only for those who were there.
              </p>
            </div>
          </div>
        </section>

        {/* HOAX Section - Memo style */}
        <section data-section="hoax" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
                <div className={`lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                {/* Title above the memo */}
                  <h2 className={`font-serif font-bold mb-6 text-white tracking-wide drop-shadow-lg ${isWidescreen ? 'text-4xl' : 'text-5xl'}`}>
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
                    <div className={`shadow-lg ${isWidescreen ? 'p-6 pt-8' : 'p-8 pt-10'}`} style={{
                      background: 'linear-gradient(180deg, #fffef5 0%, #fefce8 50%, #fef9c3 100%)',
                      boxShadow: '2px 4px 12px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)'
                    }}>
                      <p className={`font-serif leading-loose text-stone-600 mb-4 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ lineHeight: '1.9' }}>
                        Peter Mayhew had hit rock bottom when he wrote Hoax, a mystical parody intended as his sign-off, a final insult to an industry he had grown to despise… and worst of all an overnight bestseller. He had finally made his name — and could never use it again.
                      </p>
                      <p className={`font-serif leading-loose text-stone-600 mb-4 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ lineHeight: '1.9' }}>
                        A year later, fleeing his reputation in an Australian motel, paralysed by writer's block, with his only opportunities those to write a sequel, he receives a phone call from someone who claims to be part of a cult modelled on his book.
                      </p>
                      <p className={`font-serif leading-loose text-stone-600 mb-4 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ lineHeight: '1.9' }}>
                        Walking into what feels like his own work come to life, Peter must convince a community it was all a hoax—but in doing so, he begins to question where his book truly came from.
                      </p>
                      <p className={`font-serif leading-loose text-stone-600 italic ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ lineHeight: '1.9' }}>
                        A mind bending tale of literary fiction.
                      </p>
                    </div>
                    
                    {/* Decorative visa stamps overlapping corner */}
                    <div className="absolute -top-4 -right-6 pointer-events-none" style={{ transform: 'rotate(12deg)' }}>
                      {/* Main eye-pyramid stamp */}
                      <div className="relative">
                        <svg width="80" height="80" viewBox="0 0 80 80" className="opacity-60">
                          <circle cx="40" cy="40" r="36" fill="none" stroke="#8B4513" strokeWidth="2" strokeDasharray="4 2" />
                          <circle cx="40" cy="40" r="28" fill="none" stroke="#8B4513" strokeWidth="1" />
                          {/* Pyramid */}
                          <path d="M40 20 L58 55 L22 55 Z" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                          {/* Eye */}
                          <ellipse cx="40" cy="42" rx="10" ry="6" fill="none" stroke="#8B4513" strokeWidth="1.5" />
                          <circle cx="40" cy="42" r="3" fill="#8B4513" />
                        </svg>
                      </div>
                      
                      {/* Secondary smaller stamp */}
                      <div className="absolute -bottom-6 -left-10" style={{ transform: 'rotate(-25deg)' }}>
                        <svg width="50" height="50" viewBox="0 0 50 50" className="opacity-40">
                          <rect x="5" y="5" width="40" height="40" fill="none" stroke="#654321" strokeWidth="2" />
                          <text x="25" y="30" textAnchor="middle" fill="#654321" fontSize="10" fontFamily="serif">✦</text>
                        </svg>
                      </div>
                      
                      {/* Third circular mark */}
                      <div className="absolute -top-2 -left-14" style={{ transform: 'rotate(5deg)' }}>
                        <svg width="45" height="45" viewBox="0 0 45 45" className="opacity-35">
                          <circle cx="22.5" cy="22.5" r="18" fill="none" stroke="#704214" strokeWidth="1.5" strokeDasharray="2 3" />
                          <circle cx="22.5" cy="22.5" r="5" fill="none" stroke="#704214" strokeWidth="1" />
                        </svg>
                      </div>
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
        <section data-section="the-market" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('the-market') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Futuristic holographic display */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-lg transition-all duration-500 group-hover:bg-cyan-400/30"></div>
                    <div className={`relative bg-gradient-to-br from-slate-900/90 via-cyan-950/80 to-slate-900/90 rounded border border-cyan-400/40 transition-all duration-500 group-hover:border-cyan-400/70 ${isWidescreen ? 'p-5' : 'p-6'}`} style={{
                      boxShadow: '0 0 30px rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(34, 211, 238, 0.2)'
                    }}>
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-400/30 transition-all duration-500 group-hover:border-cyan-400/50">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                        <span className="text-cyan-400/80 text-xs font-mono tracking-widest transition-all duration-500 group-hover:text-cyan-400">CORP_01 // CLASSIFIED</span>
                      </div>
                      <h2 className={`font-mono font-bold mb-4 text-cyan-300 tracking-tight transition-all duration-500 group-hover:text-cyan-200 ${isWidescreen ? 'text-3xl' : 'text-4xl'}`}>
                        THE MARKET
                      </h2>
                      <p className={`font-sans leading-relaxed text-cyan-100/90 mb-3 transition-all duration-500 group-hover:text-cyan-100 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                        James Tarreden's new life on <em>Island</em>—the world's first corporate nation-state—seems to be off without a hitch. Zero crime, colleagues who like him—even his love life is going disconcertingly well. In fact, everything is falling into place a little too easily…
                      </p>
                      <p className={`font-sans leading-relaxed text-cyan-100/90 mb-3 transition-all duration-500 group-hover:text-cyan-100 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                        Under the wing of an enigmatic young CEO, James is inducted into the secrets behind his company's new technology, and with everything he knew about reality unravelling, finds himself in an increasingly high-stakes game of cat and mouse to discover the truth of <em>Island</em>, one that gives an entirely new meaning to corporate survival.
                      </p>
                      <p className={`font-sans italic text-cyan-200/80 transition-all duration-500 group-hover:text-cyan-200 ${isWidescreen ? 'text-xs' : 'text-sm max-sm:text-xs'}`}>
                        An existential psychological thriller.
                      </p>
                      <div className="mt-4 flex justify-between items-center text-cyan-400/50 text-xs font-mono transition-all duration-500 group-hover:text-cyan-400/80">
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
        <section data-section="oba" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
                <div className={`lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <MagazineBlurb
                    title="AMYA"
                    paragraphs={[
                      "Set in Nairobi, Kenya. A linguist specialising in rare languages is seconded, reluctantly, to a village where there have been reports of an ancient undiscovered language still being spoken.",
                      "Existing on the fringes of the forest, the village brings back memories of a childhood he has tried to bury in his adult academic life.",
                      "While there, he comes across a mute girl who has not spoken since she was born. Silent and guarded around people, in the forest she comes alive, awakening something that has lain silent in him for longer than he can remember.",
                      "Memories of the past interweave with the present as in attempting to help the young girl communicate, he discovers that he may have more to learn from her than she does from him."
                    ]}
                    isVisible={visibleSections.has('oba')}
                    isWidescreen={isWidescreen}
                  />
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
        <section data-section="states-of-motion" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('states-of-motion') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <h2 className={`font-serif font-bold mb-4 text-white ${isWidescreen ? 'text-4xl' : 'text-5xl'}`}>
                    STATES OF MOTION
                  </h2>
                  {/* Original dark overlay style - same as AMYA */}
                  <div className={`bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 ${isWidescreen ? 'p-4' : 'p-5'}`}>
                    <p className={`font-serif leading-relaxed text-white italic mb-3 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      "…the city was not the arrangement of many things but the shifting posture of one…"
                    </p>
                    <p className={`font-serif leading-relaxed text-white mb-2 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      A physicist on his way to a conference, carrying in his head a theory too fragile to document.
                    </p>
                    <p className={`font-serif leading-relaxed text-white mb-2 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      A pianist haunted by a melody from childhood, a song he has been chasing his entire life.
                    </p>
                    <p className={`font-serif leading-relaxed text-white mb-2 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      A man unable to distinguish truth from fiction, whose words are so dangerous they can alter reality itself.
                    </p>
                    <p className={`font-serif leading-relaxed text-white mb-2 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      A secret cabal of plumbers employed in an age old scheme that has evolved in the wastes beneath the city.
                    </p>
                    <p className={`font-serif leading-relaxed text-white mb-2 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      And above it all, one long summer, from which nothing ever seems to emerge...
                    </p>
                    <p className={`font-serif leading-relaxed text-white italic ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
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
        <section data-section="how" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
                <div className={`transition-all duration-1000 delay-500 ${
                  visibleSections.has('how') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  {/* Zen scroll / meditation card - softer background */}
                  <div className="relative">
                    <div className={`text-center ${isWidescreen ? 'p-6' : 'p-8'}`} style={{
                      background: 'linear-gradient(180deg, rgba(250, 250, 249, 0.75) 0%, rgba(245, 245, 244, 0.8) 100%)',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                      borderTop: '3px solid rgba(120, 113, 108, 0.6)',
                      borderBottom: '3px solid rgba(120, 113, 108, 0.6)'
                    }}>
                      <div className="mb-6">
                        <span className="text-stone-500 text-2xl">道</span>
                      </div>
                      <h2 className={`font-light mb-6 text-stone-700 tracking-widest ${isWidescreen ? 'text-5xl' : 'text-6xl'}`} style={{ fontFamily: 'Palatino, Georgia, serif' }}>
                        HOW
                      </h2>
                      <div className="w-16 h-px bg-stone-400/50 mx-auto mb-6"></div>
                      <p className={`leading-loose text-stone-600 max-w-md mx-auto ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
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
        <section data-section="vice-versa" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center lg:px-8">
                <div className={`order-2 lg:order-1 transition-all duration-1000 delay-500 ${
                  visibleSections.has('vice-versa') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <h2 className={`font-serif font-bold mb-4 text-white ${isWidescreen ? 'text-4xl' : 'text-5xl'}`}>
                    VICE VERSA
                  </h2>
                  {/* Original dark overlay style */}
                  <div className={`bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 ${isWidescreen ? 'p-5' : 'p-6'}`}>
                    <p className={`font-serif leading-relaxed text-white ${isWidescreen ? 'text-sm' : 'text-lg max-sm:text-sm'}`}>
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
                    isWidescreen={isWidescreen}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Young Adult Books Section */}
        <section data-section="young-adult" className={`flex items-center justify-center relative ${
          isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
        }`}>
          <div className="container mx-auto px-6 py-24">
            <div className="max-w-6xl mx-auto">
              {/* Use opacity-only reveal (no translate-y) to prevent layout shift during scroll navigation */}
              <h2 className={`font-serif font-bold text-white mb-4 text-center tracking-wide transition-opacity duration-1000 ${
                visibleSections.has('young-adult') ? 'opacity-100' : 'opacity-0'
              } ${isWidescreen ? 'text-4xl' : 'text-5xl'}`}>
                Young Adult Series
              </h2>
              <p className={`font-serif text-yellow-300 mb-12 text-center transition-opacity duration-1000 delay-300 ${
                visibleSections.has('young-adult') ? 'opacity-100' : 'opacity-0'
              } ${isWidescreen ? 'text-lg' : 'text-xl'}`}>
                Books of imagination for any age
              </p>
              
              <div className={`transition-opacity duration-1000 delay-500 ${
                visibleSections.has('young-adult') ? 'opacity-100' : 'opacity-0'
              }`}>
                <YoungAdultSlideshow 
                  ref={youngAdultSlideshowRef} 
                  onBookChange={setCurrentYoungAdultBook}
                  isWidescreen={isWidescreen}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 max-sm:mt-12 relative z-10">
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