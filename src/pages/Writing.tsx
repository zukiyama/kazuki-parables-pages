import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
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

// Vignette images for Other Works section
import vignetteDesertLeft from "@/assets/vignette-desert-left.png";
import vignetteDesertRight from "@/assets/vignette-desert-right.png";
import vignetteLightsLeft from "@/assets/vignette-lights-left.png";
import vignetteLightsRight from "@/assets/vignette-lights-right.png";
import vignetteFasterLeft from "@/assets/vignette-faster-left.png";
import vignetteFasterRight from "@/assets/vignette-faster-right.png";
import vignettePlasticLeft from "@/assets/vignette-threeqs-left.png";
import vignettePlasticRight from "@/assets/vignette-threeqs-right.png";
import vignetteRevisionsLeft from "@/assets/vignette-revisions-left.png";
import vignetteRevisionsRight from "@/assets/vignette-revisions-right.png";
import vignetteSyphonsLeft from "@/assets/vignette-syphons-left.png";
import vignetteSyphonsRight from "@/assets/vignette-syphons-right.png";

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
  const bannerManuallyHiddenRef = useRef(false); // Track when banner was programmatically hidden
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
    deepSpace: 0,
    otherWorks: 0
  });
  
  // Other Works section state
  const [slideshowOpacity, setSlideshowOpacity] = useState(1);
  const [otherWorksContentOpacity, setOtherWorksContentOpacity] = useState(0);
  const [otherWorksWhiteMode, setOtherWorksWhiteMode] = useState(false);
  const [expandedWork, setExpandedWork] = useState<string | null>(null);
  const [activeVignette, setActiveVignette] = useState<string | null>(null);
  const youngAdultSlideshowRef = useRef<YoungAdultSlideshowRef>(null);
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const isSnapping = useRef(false);
  const isDraggingScrollbar = useRef(false);
  const parableTrilogyRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  // Defensive cleanup: Reset scroll state on mount to prevent stale states after hot-reloads
  useEffect(() => {
    isSnapping.current = false;
    isDraggingScrollbar.current = false;
  }, []);

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
  // Fixed for iOS: uses visualViewport at snap time + listens to visualViewport resize
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    let lastSnappedSection: string | null = null;
    let pendingResnap: number | null = null;
    
    // Sections that should NOT have snap behavior (except young-adult which has special handling)
    const noSnapSections = ['kaiju'];

    const getBookSections = () => {
      // Disable scroll snap on mobile
      if (window.innerWidth < 950) return [];
      
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

    // Get LIVE viewport height at snap time - no caching/hysteresis
    // This is the key fix: always use current visualViewport for accurate measurements
    const getViewportHeight = () => {
      const vv = window.visualViewport;
      return vv ? vv.height : window.innerHeight;
    };
    
    // Get visualViewport offset (crucial for iOS Safari when browser bar is visible)
    const getViewportOffsetTop = () => {
      const vv = window.visualViewport;
      return vv ? vv.offsetTop : 0;
    };

    const getCenterSnapPoint = (section: HTMLElement, sectionName: string) => {
      const headerBottom = getHeaderBottom();
      // FIXED: Use stable isWidescreen from hook instead of live aspect ratio calculation
      // This prevents snap branch from changing when browser bar collapses/expands on iPad
      console.log('[SNAP DEBUG] getCenterSnapPoint - isWidescreen:', isWidescreen, 'innerWidth:', window.innerWidth, 'innerHeight:', window.innerHeight);
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreen) ? banner.offsetHeight : 0;
      
      // Account for visualViewport offset (crucial on iOS Safari when browser bar is visible)
      const vvOffsetTop = getViewportOffsetTop();
      const topOffset = headerBottom + bannerHeight + vvOffsetTop;
      const viewportHeight = getViewportHeight();
      const availableHeight = viewportHeight - (headerBottom + bannerHeight); // Don't subtract vvOffsetTop twice
      
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
      // FIXED: Use stable isWidescreen from hook instead of live aspect ratio calculation
      // This prevents snap branch from changing when browser bar collapses/expands on iPad
      console.log('[SNAP DEBUG] handleScrollEnd - isWidescreen:', isWidescreen, 'innerWidth:', window.innerWidth, 'innerHeight:', window.innerHeight, 'branch:', isWidescreen ? 'WIDESCREEN' : 'DESKTOP');
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreen) ? banner.offsetHeight : 0;
      
      // Account for visualViewport offset (crucial on iOS Safari)
      const vvOffsetTop = getViewportOffsetTop();
      const topOffset = headerBottom + bannerHeight + vvOffsetTop;
      const viewportHeight = getViewportHeight();
      const availableViewport = viewportHeight - (headerBottom + bannerHeight);

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
        deepSpace: 0,
        otherWorks: 0
      };
      
      // Handle Other Works section visibility
      if (newVisibleSections.has('other-works')) {
        newOpacities.otherWorks = 1;
        setSlideshowOpacity(0);
        setOtherWorksContentOpacity(1);
        // IMPORTANT: When other-works is visible, do NOT set any other background opacity
        // This prevents the KAIJU (school) background from flashing during the transition
      } else {
        setSlideshowOpacity(1);
        setOtherWorksContentOpacity(0);
        setOtherWorksWhiteMode(false);
        setExpandedWork(null);
        setActiveVignette(null);
        
        // Only determine which section background to show when NOT in other-works
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
          // Keep ALL young-adult backgrounds in their current opacity state initially
          // Only the selected one will be set to 1, CSS transitions handle the crossfade
          newOpacities.victorianLondon = currentYoungAdultBook === 0 ? 1 : 0;
          newOpacities.wasteland = currentYoungAdultBook === 1 ? 1 : 0;
          newOpacities.deepSpace = currentYoungAdultBook === 2 ? 1 : 0;
          // If somehow out of range, show school background
          if (currentYoungAdultBook < 0 || currentYoungAdultBook > 2) {
            newOpacities.school = 1;
          }
        } else {
          newOpacities.school = 1;
        }
      }

      setBackgroundOpacities(newOpacities);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Separate effect for young-adult book changes - only updates young-adult backgrounds
  // This prevents black flash by updating only the relevant backgrounds
  useEffect(() => {
    if (!visibleSections.has('young-adult')) return;
    
    setBackgroundOpacities(prev => ({
      ...prev,
      victorianLondon: currentYoungAdultBook === 0 ? 1 : 0,
      wasteland: currentYoungAdultBook === 1 ? 1 : 0,
      deepSpace: currentYoungAdultBook === 2 ? 1 : 0
    }));
  }, [currentYoungAdultBook, visibleSections]);

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

  // Widescreen only: Auto-show banner at top of page, hide only when scrolling DOWN from the top area
  useEffect(() => {
    if (!isWidescreen) return;

    let lastScrollY = window.scrollY;
    let wasAtTop = window.scrollY <= 50;

    const handleScrollForBanner = () => {
      const scrollTop = window.scrollY;
      const isAtTop = scrollTop <= 50;
      const isScrollingDown = scrollTop > lastScrollY;
      
      // If at or near the top (within 50px), show banner
      // BUT only if we didn't just manually hide it (e.g., by clicking a book cover in banner)
      if (isAtTop) {
        if (!bannerManuallyHiddenRef.current) {
          setBannerVisible(true);
        }
        wasAtTop = true;
      } else if (isScrollingDown && wasAtTop) {
        // Clear the manual hide flag once we've scrolled away from top
        bannerManuallyHiddenRef.current = false;
        // Only hide banner when scrolling DOWN from the top area
        setBannerVisible(false);
        wasAtTop = false;
      } else if (!isAtTop) {
        // Once past the top, mark as no longer at top
        wasAtTop = false;
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
    bannerManuallyHiddenRef.current = true; // Prevent scroll handler from re-showing banner at top
    setBannerVisible(false);
    
    // Clear the manual hide flag after programmatic scroll completes (~800ms)
    // This allows manual scrolling back to top to show the banner
    setTimeout(() => {
      bannerManuallyHiddenRef.current = false;
    }, 800);
  }, []);

  return (
    <div 
      className="min-h-screen-stable relative overflow-x-hidden"
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
      
      {/* Stacked Background Images - GPU-accelerated fixed layer */}
      <div className="bg-layer-fixed z-0">
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
        
        {/* Background for Other Works section - transitions from black to white */}
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-in-out"
          style={{ 
            opacity: backgroundOpacities.otherWorks,
            backgroundColor: otherWorksWhiteMode ? '#ffffff' : '#000000'
          }}
        />
        
        <div 
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ 
            opacity: otherWorksWhiteMode ? 0 : 1 
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
        </div>
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
              {/* Widescreen: mb-20, iPad desktop: slightly more (mb-24) */}
              <div className={`text-center lg:pt-12 pt-8 ${isWidescreen ? 'mb-20' : 'mb-24 max-sm:mb-12'}`}>
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
                } ${isWidescreen ? 'mb-24' : 'mb-28 max-sm:mb-14'}`}
                style={{
                  opacity: visibleSections.has('kaiju') ? (parableTrilogyVisible ? 1 : 0) : 0,
                  transition: 'opacity 1.2s ease-in-out, transform 1s ease-out'
                }}
              >
                {/* iPad: slightly larger text (text-5xl), Widescreen: same (text-5xl), Mobile phone: larger (text-4xl) */}
                <h2 className={`font-serif font-bold text-yellow-300 mb-6 ${isWidescreen ? 'text-5xl' : 'text-5xl max-sm:text-4xl'}`}>
                  The Parable Trilogy
                </h2>
                <p className={`font-serif leading-relaxed text-white max-w-4xl mx-auto ${isWidescreen ? 'text-xl' : 'text-lg md:text-xl max-sm:text-base'}`}>
                  A metaphysical saga unfolding across the shifting decades of an alternate 20th-century Japan, from mysterious towns and abandoned film sets to mountain temples and secret research facilities far from this world. With a cast as varied as its setting, childhood wonder collides with philosophy and fantasy in this compelling trilogy that explores the boundaries between truth and fiction.
                </p>
              </div>
              
              {/* Book One Title - Centered above both cover and blurb */}
              {/* iPad desktop: less padding (mb-4), Widescreen: more padding (mb-24), iPad portrait mobile: more padding (sm:mb-10), reduce top margin on iPad portrait (sm:mt-[-8px]) */}
              <div 
                className={`text-center max-sm:mb-10 sm:mb-10 sm:mt-[-4px] transition-all duration-1000 delay-300 ${
                  !isWidescreen ? 'lg:mb-4' : ''
                } ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={isWidescreen ? { marginBottom: '5rem' } : undefined}
              >
                <span 
                  className={`uppercase tracking-[0.3em] text-stone-300 block mb-4 max-sm:mb-2 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-base'}`}
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
              {/* iPad desktop: significantly less top margin (lg:mt-2), mobile phone: less top margin (max-sm:mt-10) */}
              <p className={`font-serif leading-relaxed text-white italic text-center mt-14 max-sm:mt-10 mb-16 max-w-4xl mx-auto transition-all duration-1000 delay-700 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              } ${isWidescreen ? 'text-lg' : 'text-xl lg:mt-2 max-sm:text-base'}`}>
                Part coming of age, part mystery, and part supernatural drama, this surreal adventure ties together the lives of three groups of people in a 1979 that only happened for those who were there.
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
                  <div className="relative group cursor-pointer">
                    {/* Subtle outer glow layer */}
                    <div className="absolute -inset-2 bg-cyan-400/5 blur-xl rounded-xl transition-all duration-500 ease-out group-hover:bg-cyan-400/15 group-hover:blur-2xl group-hover:-inset-3"></div>
                    {/* Inner glow layer */}
                    <div className="absolute inset-0 bg-cyan-400/10 blur-lg rounded-lg transition-all duration-400 group-hover:bg-cyan-400/25"></div>
                    <div className={`relative bg-gradient-to-br from-slate-900/90 via-cyan-950/80 to-slate-900/90 rounded border border-cyan-400/40 transition-all duration-400 ease-out group-hover:border-cyan-400/80 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.25),inset_0_1px_0_rgba(34,211,238,0.3)] ${isWidescreen ? 'p-5' : 'p-6'}`} style={{
                      boxShadow: '0 0 20px rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(34, 211, 238, 0.15)'
                    }}>
                      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-cyan-400/30 transition-all duration-400 group-hover:border-cyan-400/50">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse transition-all duration-300"></div>
                        <span className="text-cyan-400/80 text-xs font-mono tracking-widest transition-all duration-400 group-hover:text-cyan-400">CORP_01 // CLASSIFIED</span>
                      </div>
                      <h2 className={`font-mono font-bold mb-4 text-cyan-300 tracking-tight transition-all duration-500 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] ${isWidescreen ? 'text-3xl' : 'text-4xl'}`}>
                        THE MARKET
                      </h2>
                      <p className={`font-sans leading-relaxed text-cyan-100/90 mb-3 transition-all duration-500 group-hover:text-cyan-50 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                        James Tarreden's new life on <em>Island</em>—the world's first corporate nation-state—seems to be off without a hitch. Zero crime, colleagues who like him—even his love life is going disconcertingly well. In fact, everything is falling into place a little too easily…
                      </p>
                      <p className={`font-sans leading-relaxed text-cyan-100/90 mb-3 transition-all duration-500 group-hover:text-cyan-50 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                        Under the wing of an enigmatic young CEO, James is inducted into the secrets behind his company's new technology, and with everything he knew about reality unravelling, finds himself in an increasingly high-stakes game of cat and mouse to discover the truth of <em>Island</em>, one that gives an entirely new meaning to corporate survival.
                      </p>
                      <p className={`font-sans italic text-cyan-200/80 transition-all duration-500 group-hover:text-cyan-100 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] ${isWidescreen ? 'text-xs' : 'text-sm max-sm:text-xs'}`}>
                        An existential psychological thriller.
                      </p>
                      <div className="mt-4 flex justify-between items-center text-cyan-400/50 text-xs font-mono transition-all duration-500 group-hover:text-cyan-300">
                        <span className="group-hover:animate-pulse">ACCESS: LEVEL-7</span>
                        <span className="animate-pulse group-hover:text-cyan-200">●●● LIVE</span>
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
                      A physicist on his way to a conference, with agents of unknown enemies closing in, carrying in his head a theory too fragile to document.
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
                      And through it all, one long summer, from which nothing ever seems to emerge...
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
                      <h2 className={`font-light mb-4 text-stone-700 tracking-widest ${isWidescreen ? 'text-5xl' : 'text-6xl'}`} style={{ fontFamily: 'Palatino, Georgia, serif' }}>
                        HOW
                      </h2>
                      <p className={`leading-loose text-stone-600 max-w-md mx-auto mb-4 italic ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
                        This is how.
                      </p>
                      <p className={`leading-loose text-stone-600 max-w-md mx-auto mb-4 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
                        With this realisation monk-shoemaker Shen Sho-Bi awakens from his trance of forty cycles, renounces the water-school of Luau and sets out on a journey to know the world.
                      </p>
                      <p className={`leading-loose text-stone-600 max-w-md mx-auto mb-4 ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
                        Part journal, part travelogue and part freeform reflection, here is the record of the wandering of the heretic Sho-Bi, which takes him from bandits and courtesans to <em>kō</em> matches with emperors, thought-contests with the great sages—including an enlightened rock that has been the subject of pilgrimage for more than a thousand years—and an audience with the gods themselves.
                      </p>
                      <p className={`leading-loose text-stone-600 max-w-md mx-auto ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`} style={{ fontFamily: 'Georgia, serif' }}>
                        Yet the greatest dialogue of all takes place between places, in Sho-Bi's conversations with the grass, leaves, rivers, and wind, with the world and the knowing of it.
                      </p>
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
                  <h2 className={`font-serif font-bold mb-3 text-white ${isWidescreen ? 'text-3xl' : 'text-4xl'}`}>
                    VICE VERSA
                  </h2>
                  {/* Original dark overlay style */}
                  <div className={`bg-black/60 backdrop-blur-sm rounded-lg border border-white/20 ${isWidescreen ? 'p-4' : 'p-5'}`}>
                    <blockquote className={`border-l-2 border-white/40 pl-4 mb-3 ${isWidescreen ? 'py-1' : 'py-2'}`}>
                      <p className={`font-serif leading-relaxed text-white/90 ${isWidescreen ? 'text-base' : 'text-lg max-sm:text-base'} italic`}>
                        "I am a man without imagination…"
                      </p>
                    </blockquote>
                    <p className={`font-serif leading-relaxed text-white ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}>
                      <em>Oswald T</em> is a chaser, an investigator at one of the elite metacorporations that preside over <em>Nexus</em>, tasked with sniffing out undercover agents using black market technology to alter their personality. But when he is called in to a routine investigation of a rival company, something seems amiss… and the trail leads to the last place he expected.
                    </p>
                    <p className={`font-serif leading-relaxed text-white ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'} mt-2`}>
                      With a new—more deadly—form of biotech hitting the streets, <em>Oz</em> finds himself the hunted. To survive, he must solve the most bizarre case of his career: who killed Oswald T?
                    </p>
                    <p className={`font-serif leading-relaxed text-white ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'} mt-3`}>
                      A strange noir where bioengineered worker species, aquatic telephones and sentient corporations are part of everyday life.
                    </p>
                    <p className={`font-serif leading-relaxed text-white ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'} mt-3 italic`}>
                      In a world built on belief, the inability to imagine becomes the ultimate advantage.
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
        <section 
          data-section="young-adult" 
          className={`flex items-center justify-center relative ${
            isWidescreen ? 'min-h-[calc(100vh-4rem)]' : 'min-h-[80vh]'
          }`}
          style={{ opacity: slideshowOpacity, transition: 'opacity 1000ms ease-in-out' }}
        >
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

        {/* Other Works Section */}
        <section 
          data-section="other-works" 
          className={`flex items-start justify-center relative ${
            isWidescreen ? 'h-[calc(100vh-4rem)]' : 'h-screen'
          }`}
          style={{ marginBottom: 0, paddingBottom: 0, touchAction: 'manipulation' }}
        >
          {/* Vignette images - positioned on sides with gradient fade */}
          {/* Desert vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'desert' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteDesertLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'desert' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteDesertRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'left center',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Elephant (lights) vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'elephant' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteLightsLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'elephant' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteLightsRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Faster vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'faster' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteFasterLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-[7%] h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'faster' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteFasterRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Plastic vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'plastic' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignettePlasticLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'plastic' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignettePlasticRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Revisions vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'revisions' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteRevisionsLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'revisions' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteRevisionsRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Syphons vignettes */}
          <div 
            className="absolute left-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'syphons' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteSyphonsLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center right',
              maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          <div 
            className="absolute right-0 top-0 h-screen w-1/3 pointer-events-none transition-opacity duration-700 ease-in-out"
            style={{
              opacity: activeVignette === 'syphons' ? otherWorksContentOpacity : 0,
              backgroundImage: `url(${vignetteSyphonsRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center left',
              maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
              maskComposite: 'intersect',
              WebkitMaskComposite: 'source-in'
            }}
          />
          
          {/* Main Content Container */}
          <div 
            className="relative z-20 container mx-auto px-6 py-24 transition-opacity duration-700 ease-in-out"
            style={{ opacity: otherWorksContentOpacity }}
          >
            <div className="max-w-xl mx-auto">
              {/* Elegant Magazine Header */}
              <header className="text-center mb-4">
                <div className="inline-block">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className={`text-[0.75rem] tracking-[0.25em] uppercase transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`} style={{ fontVariant: 'small-caps' }}><span className="max-sm:hidden">Short Stories</span><span className="sm:hidden">Shorts</span></span>
                    <span className={`transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-400' : 'text-neutral-600'}`}>·</span>
                    <span className={`text-[0.75rem] tracking-[0.25em] uppercase transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`} style={{ fontVariant: 'small-caps' }}>Novellas</span>
                    <span className={`transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-400' : 'text-neutral-600'}`}>·</span>
                    <span className={`text-[0.75rem] tracking-[0.25em] uppercase transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`} style={{ fontVariant: 'small-caps' }}><span className="max-sm:hidden">Experimental Fiction</span><span className="sm:hidden">Experimental</span></span>
                  </div>
                  <h2 className={`font-serif text-5xl md:text-6xl font-extralight tracking-tight transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-900' : 'text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                    Other Works
                  </h2>
                </div>
              </header>

              {/* Day/Night Toggle Button */}
              <div className="flex justify-center mt-4 mb-4" style={{ perspective: '200px' }}>
                <button
                  onClick={() => setOtherWorksWhiteMode(prev => !prev)}
                  className={`relative w-6 h-6 transition-all duration-700 ease-in-out ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`}
                  style={{ 
                    transform: otherWorksWhiteMode ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d'
                  }}
                  aria-label={otherWorksWhiteMode ? 'Switch to night mode' : 'Switch to daylight mode'}
                >
                  {/* Sun icon */}
                  <svg
                    className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ${otherWorksWhiteMode ? 'opacity-0' : 'opacity-100'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="m4.93 4.93 1.41 1.41" />
                    <path d="m17.66 17.66 1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="m6.34 17.66-1.41 1.41" />
                    <path d="m19.07 4.93-1.41 1.41" />
                  </svg>
                  {/* Moon icon (crescent moon outline) */}
                  <svg
                    className={`absolute inset-0 w-4 h-4 m-1 transition-opacity duration-300 ${otherWorksWhiteMode ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                </button>
              </div>

              {/* Click for more details instruction */}
              <p className={`text-center font-serif text-[0.7rem] tracking-[0.2em] uppercase mb-12 transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                click for more details
              </p>

              {/* Interactive Title List */}
              <div className="space-y-6">
                {/* Things That Happen in the Desert */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'desert';
                      setExpandedWork(isClosing ? null : 'desert');
                      setActiveVignette(isClosing ? null : 'desert');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      Things That Happen in the Desert
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'desert' ? 'max-h-64 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      An anthology—two boys in diving helmets wandering the dunes; a holiday where people go to war; an actor who becomes lost in the character he's playing; a writer revising the same page only to find reality shifting with each draft; and an oncoming invasion where we must create a defence force to counter them—blueprints our only hope, with help from a previously defeated people.
                    </p>
                  </div>
                </article>

                {/* Elephant */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'elephant';
                      setExpandedWork(isClosing ? null : 'elephant');
                      setActiveVignette(isClosing ? null : 'elephant');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      Elephant
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'elephant' ? 'max-h-32 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      The great grey sprawling granite of a tenement block in Eastern Europe, a strange stateless mechanism of the lives within it. One day, lights begin to appear to some of the residents…
                    </p>
                  </div>
                </article>

                {/* The Revisions */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'revisions';
                      setExpandedWork(isClosing ? null : 'revisions');
                      setActiveVignette(isClosing ? null : 'revisions');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      The Revisions
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'revisions' ? 'max-h-32 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Coming soon.
                    </p>
                  </div>
                </article>

                {/* Faster */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'faster';
                      setExpandedWork(isClosing ? null : 'faster');
                      setActiveVignette(isClosing ? null : 'faster');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      Faster
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'faster' ? 'max-h-32 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      A man becomes part of an experimental device travelling beyond the speed of light—entering a blur where the psychological and the real merge, encountering forms of life that exist only at certain velocities.
                    </p>
                  </div>
                </article>

                {/* The Syphons */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'syphons';
                      setExpandedWork(isClosing ? null : 'syphons');
                      setActiveVignette(isClosing ? null : 'syphons');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      The Syphons
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'syphons' ? 'max-h-40 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      A man searching for a children's show he used to watch. He can't remember it clearly, and when he tries to look it up, he finds it doesn't exist. No record anywhere. No one else remembers it except him. This leads him on a trail into increasingly bizarre conclusions.
                    </p>
                  </div>
                </article>

                {/* Plastic */}
                <article className="text-center">
                  <button 
                    onClick={() => {
                      const isClosing = expandedWork === 'plastic';
                      setExpandedWork(isClosing ? null : 'plastic');
                      setActiveVignette(isClosing ? null : 'plastic');
                    }}
                    className="group cursor-pointer"
                  >
                    <h3 className={`font-serif text-xl md:text-2xl font-light tracking-wide transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-700 hover:text-neutral-900' : 'text-neutral-200 hover:text-white'}`} style={{ fontFamily: 'Playfair Display, Georgia, serif' }}>
                      ???
                    </h3>
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-500 ease-out ${
                      expandedWork === 'plastic' ? 'max-h-32 opacity-100 mt-5' : 'max-h-0 opacity-0 mt-0'
                    }`}
                  >
                    <p className={`font-serif text-sm leading-relaxed max-w-md mx-auto transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      Secret bases beneath the ocean. Inter-dimensional conspiracy. A strange story of paranoia and hidden depths.
                    </p>
                  </div>
                </article>
              </div>

              {/* Elegant closing */}
              <div className="text-center mt-24">
                <div className={`w-px h-8 mx-auto mb-4 transition-colors duration-700 ${otherWorksWhiteMode ? 'bg-neutral-400' : 'bg-neutral-600'}`} />
                <span className={`font-serif text-[0.6rem] tracking-[0.4em] uppercase transition-colors duration-700 ${otherWorksWhiteMode ? 'text-neutral-500' : 'text-neutral-500'}`}>& more to come</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer variant="dark" showNavLinks={false} />
    </div>
  );
};

export default Writing;