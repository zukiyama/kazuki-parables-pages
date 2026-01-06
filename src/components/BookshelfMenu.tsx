import { useState } from "react";

// Book cover images for banner
import kaijuCover from "@/assets/kaiju-cover-new.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import theMarketCover from "@/assets/the-market-cover-new.jpg";
import howCover from "@/assets/how-cover.jpg";
import viceVersaCover from "@/assets/vice-versa-cover.jpg";
import amyaCover from "@/assets/amya-cover.png";
import statesOfMotionCover from "@/assets/states-of-motion-cover.png";

// Young adult book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.png";
import toFlyCover from "@/assets/to-fly-cover-new.png";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.png";

interface Book {
  id: string;
  title: string;
  cover: string;
  targetSection: string;
  slideToBook?: number; // For young adult books that are in a slideshow
}

const books: Book[] = [
  {
    id: "kaiju",
    title: "Kaiju",
    cover: kaijuCover,
    targetSection: "kaiju"
  },
  {
    id: "hoax", 
    title: "Hoax",
    cover: hoaxCover,
    targetSection: "hoax"
  },
  {
    id: "the-market",
    title: "The Market",
    cover: theMarketCover,
    targetSection: "the-market"
  },
  {
    id: "oba",
    title: "Amya",
    cover: amyaCover,
    targetSection: "oba"
  },
  {
    id: "states-of-motion",
    title: "States of Motion",
    cover: statesOfMotionCover,
    targetSection: "states-of-motion"
  },
  {
    id: "how",
    title: "How", 
    cover: howCover,
    targetSection: "how"
  },
  {
    id: "vice-versa",
    title: "Vice Versa",
    cover: viceVersaCover,
    targetSection: "vice-versa"
  },
  {
    id: "professor-barnabas",
    title: "Professor Barnabas",
    cover: professorBarnabasCover,
    targetSection: "young-adult",
    slideToBook: 0
  },
  {
    id: "land-dream",
    title: "The Waste Trilogy",
    cover: landDreamSkyCover,
    targetSection: "young-adult",
    slideToBook: 1
  },
  {
    id: "to-fly",
    title: "To Fly",
    cover: toFlyCover,
    targetSection: "young-adult", 
    slideToBook: 2
  }
];

interface BookshelfMenuProps {
  onBookClick?: (bookId: string, slideToBook?: number) => void;
  visibleSections?: Set<string>;
  currentYoungAdultBook?: number;
  isWidescreen?: boolean;
  bannerVisible?: boolean;
  onBannerHide?: () => void; // Callback to hide banner on widescreen
  getHeaderBottom?: () => number; // Get header bottom position for snap calculations
}

export const BookshelfMenu = ({ onBookClick, visibleSections, currentYoungAdultBook = 0, isWidescreen = false, bannerVisible = true, onBannerHide, getHeaderBottom }: BookshelfMenuProps) => {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  
  // Determine which book should be highlighted based on visible sections
  const getActiveBook = () => {
    if (!visibleSections) return null;
    
    // Priority order matches the scroll order on the page
    if (visibleSections.has('vice-versa')) return 'vice-versa';
    if (visibleSections.has('how')) return 'how';
    if (visibleSections.has('states-of-motion')) return 'states-of-motion';
    if (visibleSections.has('oba')) return 'oba';
    if (visibleSections.has('the-market')) return 'the-market';
    if (visibleSections.has('hoax')) return 'hoax';
    if (visibleSections.has('kaiju')) return 'kaiju';
    if (visibleSections.has('young-adult')) {
      // Return the currently selected young adult book
      const youngAdultBooks = ['professor-barnabas', 'land-dream', 'to-fly'];
      return youngAdultBooks[currentYoungAdultBook] || 'professor-barnabas';
    }
    
    return null; // No default - only highlight when actually visible
  };
  
  const activeBook = getActiveBook();

  // Preload critical book cover images for better performance
  useState(() => {
    const criticalImages = [kaijuCover, hoaxCover, theMarketCover, amyaCover, statesOfMotionCover, howCover, viceVersaCover];
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });

  // Detect if device is iPad 10.9" in portrait mode (not a phone)
  // iPad 10.9" portrait is approximately 820x1180 with aspect ratio ~1.44
  // Phones are typically narrower (< 500px) or have different aspect ratios
  const isTabletPortrait = (): boolean => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = height / width;
    
    // Tablet portrait: width between 700-900px and aspect ratio > 1.3 (taller than wide)
    // This excludes phones which are typically narrower
    return width >= 700 && width <= 900 && aspectRatio > 1.3;
  };

  // Detect if device is a mobile phone (not tablet)
  // Phones are typically narrower than 700px
  const isMobilePhone = (): boolean => {
    const width = window.innerWidth;
    return width < 700;
  };

  const handleBookClick = (book: Book) => {
    // For widescreen: hide banner when clicking any book
    if (isWidescreen && onBannerHide) {
      onBannerHide();
    }
    
    // Use visualViewport.height on iOS for accurate measurements (ChatGPT suggestion)
    const getViewportHeight = () => {
      return window.visualViewport?.height ?? window.innerHeight;
    };

    const calculateSnapPosition = () => {
      const section = document.querySelector(`[data-section="${book.targetSection}"]`) as HTMLElement;
      if (!section) return null;

      // FIXED: Use stable isWidescreen prop instead of live aspect ratio calculation
      // This prevents snap branch from changing when browser bar collapses/expands on iPad
      console.log('[BANNER CLICK DEBUG] calculateSnapPosition - isWidescreen:', isWidescreen, 'innerWidth:', window.innerWidth, 'innerHeight:', window.innerHeight, 'visualViewport.height:', window.visualViewport?.height);
      const headerBottom = getHeaderBottom ? getHeaderBottom() : 64;
      
      // For widescreen: the banner will disappear immediately after click, so calculate
      // the scroll position as if the banner is already gone (topOffset = header only)
      // For non-widescreen: include banner height in calculations since banner stays visible
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreen) ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      const viewportHeight = getViewportHeight();
      const availableHeight = viewportHeight - topOffset;
      console.log('[BANNER CLICK DEBUG] topOffset:', topOffset, 'viewportHeight:', viewportHeight, 'availableHeight:', availableHeight, 'bannerHeight:', bannerHeight);
      
      let targetScrollPosition: number | undefined;
      
      if (book.targetSection === 'young-adult') {
        // For young-adult slideshow: use EXACT same logic as getCenterSnapPoint in Writing.tsx
        const titleEl = section.querySelector('h2') as HTMLElement;
        const slideshowContainer = section.querySelector('.transition-opacity.duration-1000.delay-500') as HTMLElement;
        
        // For mobile phones only: position slideshow container top just below banner with breathing room
        if (isMobilePhone() && slideshowContainer) {
          const slideshowRect = slideshowContainer.getBoundingClientRect();
          const slideshowTop = slideshowRect.top + window.scrollY;
          // Position so slideshow top is at topOffset + small breathing room (20px)
          targetScrollPosition = Math.max(0, slideshowTop - topOffset - 20);
        } else if (titleEl && slideshowContainer) {
          const titleRect = titleEl.getBoundingClientRect();
          const slideshowRect = slideshowContainer.getBoundingClientRect();
          
          // Calculate total height of title + subtitle + slideshow (in viewport coords)
          const titleTopInViewport = titleRect.top;
          const slideshowBottomInViewport = slideshowRect.bottom;
          const totalContentHeight = slideshowBottomInViewport - titleTopInViewport;
          
          // Scenario A: Can fit all content (title + "Young Adult Series" text + slideshow)
          if (availableHeight >= totalContentHeight + 40) { // 40px buffer
            // Center the entire content in the available space
            const titleTop = titleRect.top + window.scrollY;
            const slideshowBottom = slideshowRect.bottom + window.scrollY;
            const contentCenter = titleTop + ((slideshowBottom - titleTop) / 2);
            const desiredCenterY = topOffset + (availableHeight / 2);
            targetScrollPosition = Math.max(0, contentCenter - desiredCenterY);
          } else {
            // Scenario B: Can't fit all, just center the slideshow alone
            const slideshowTop = slideshowRect.top + window.scrollY;
            const slideshowHeight = slideshowRect.height;
            const slideshowCenter = slideshowTop + (slideshowHeight / 2);
            const desiredCenterY = topOffset + (availableHeight / 2);
            targetScrollPosition = Math.max(0, slideshowCenter - desiredCenterY);
          }
        } else if (titleEl) {
          // Fallback to simple positioning
          const titleTop = titleEl.getBoundingClientRect().top + window.scrollY;
          targetScrollPosition = titleTop - topOffset - 20;
        }
      } else {
        // For individual books: center the book cover in the available viewport
        const bookCoverImg = section.querySelector('img[alt*="Cover"]');
        if (bookCoverImg) {
          const imgRect = bookCoverImg.getBoundingClientRect();
          const imgHeight = imgRect.height;
          const imgTop = imgRect.top + window.scrollY;
          const imgCenter = imgTop + (imgHeight / 2);
          
          // For iPad 10.9" portrait mode only: shift the target higher to give more breathing room
          // The book covers appear too low in the viewport on this device
          const tabletPortraitOffset = isTabletPortrait() ? 50 : 0;
          
          const desiredCenterY = topOffset + (availableHeight / 2) - tabletPortraitOffset;
          targetScrollPosition = Math.max(0, imgCenter - desiredCenterY);
        } else {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          targetScrollPosition = sectionTop - topOffset - 80;
        }
      }
      
      return targetScrollPosition;
    };

    const scrollToSection = () => {
      const targetScrollPosition = calculateSnapPosition();
      
      if (targetScrollPosition !== undefined) {
        // Check if we're already at or very close to the target position
        const currentScroll = window.scrollY;
        if (Math.abs(currentScroll - targetScrollPosition) > 5) {
          // Step 1: Disable scroll-snap during programmatic scroll (ChatGPT suggestion)
          const scrollContainer = document.documentElement;
          const originalSnapType = scrollContainer.style.scrollSnapType;
          scrollContainer.style.scrollSnapType = 'none';
          
          // Step 2: Smooth scroll to target
          window.scrollTo({ 
            top: Math.max(0, targetScrollPosition),
            behavior: 'smooth' 
          });
          
          // Step 3: Stabilization loop - wait for scroll to stop changing across 3+ frames
          const stabilizeAndCorrect = () => {
            let lastScrollY = window.scrollY;
            let stableFrameCount = 0;
            const requiredStableFrames = 3;
            
            const checkStability = () => {
              const currentScrollY = window.scrollY;
              
              if (Math.abs(currentScrollY - lastScrollY) < 1) {
                stableFrameCount++;
              } else {
                stableFrameCount = 0;
              }
              lastScrollY = currentScrollY;
              
              if (stableFrameCount >= requiredStableFrames) {
                // Step 4: Scroll is stable - re-measure and correct
                const correctedPosition = calculateSnapPosition();
                if (correctedPosition !== undefined) {
                  const finalScroll = window.scrollY;
                  // Correct if we're off by more than 2px
                  if (Math.abs(finalScroll - correctedPosition) > 2) {
                    window.scrollTo({ 
                      top: Math.max(0, correctedPosition),
                      behavior: 'auto' // Instant correction
                    });
                  }
                }
                
                // Step 5: Re-enable scroll-snap after correction
                scrollContainer.style.scrollSnapType = originalSnapType;
                
                // Step 6: One more correction after snap re-enable (prevents snap nudging)
                requestAnimationFrame(() => {
                  const postSnapPosition = calculateSnapPosition();
                  if (postSnapPosition !== undefined) {
                    const postSnapScroll = window.scrollY;
                    if (Math.abs(postSnapScroll - postSnapPosition) > 2) {
                      window.scrollTo({ 
                        top: Math.max(0, postSnapPosition),
                        behavior: 'auto'
                      });
                    }
                  }
                });
              } else {
                // Keep checking
                requestAnimationFrame(checkStability);
              }
            };
            
            requestAnimationFrame(checkStability);
          };
          
          // Wait for smooth scroll to mostly finish (~500ms) then run stabilization
          setTimeout(stabilizeAndCorrect, 500);
        }
        // If we're already at the right position, don't scroll at all
      }
    };

    // Set slideshow book IMMEDIATELY if it's a slideshow book to prevent flickering
    if (onBookClick && book.slideToBook !== undefined) {
      onBookClick(book.id, book.slideToBook);
      
      // Small delay to let slideshow update, then scroll only if needed
      requestAnimationFrame(() => {
        scrollToSection();
      });
    } else {
      // For non-slideshow books, scroll immediately
      scrollToSection();
      
      if (onBookClick) {
        onBookClick(book.id, book.slideToBook);
      }
    }
  };

  return (
    <div 
      data-banner="bookshelf"
      className={`fixed top-16 left-0 right-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/20 py-4 max-sm:pt-5 max-sm:pb-6 transition-all duration-500 ease-out ${
        isWidescreen && !bannerVisible 
          ? 'opacity-0 -translate-y-full pointer-events-none' 
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="container mx-auto px-6 max-sm:px-4 relative">
        <div className="flex justify-center items-center gap-6 overflow-x-auto overflow-y-visible pb-2 max-sm:gap-4 max-sm:pb-1 max-sm:justify-start max-sm:overflow-x-scroll max-sm:overflow-y-visible scrollbar-hide">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center cursor-pointer group min-w-[80px] max-sm:min-w-[64px]"
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
              onClick={() => handleBookClick(book)}
            >
              {/* Book Title */}
              <h3 className={`font-palatino text-xs font-semibold mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap max-sm:text-[10px] max-sm:whitespace-normal max-sm:leading-tight max-sm:min-h-[32px] max-sm:flex max-sm:items-center max-sm:justify-center ${
                activeBook === book.id ? 'text-yellow-300' : 'text-white'
              }`}>
                {book.title}
              </h3>
              
              {/* Book Cover */}
              <div className="relative max-sm:mb-1">
                <img
                  src={book.cover}
                  alt={book.title}
                  width="64"
                  height="96"
                  loading="eager"
                  className={`rounded shadow-lg transition-all duration-200 group-hover:shadow-xl object-contain w-16 h-auto max-sm:w-10 max-sm:max-h-none ${
                    activeBook === book.id
                      ? 'scale-110 shadow-xl shadow-yellow-300/30 ring-2 ring-yellow-300/50'
                      : 'hover:scale-110'
                  }`}
                />
                
                {/* Subtle bookshelf effect */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};