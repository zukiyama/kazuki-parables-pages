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

  // Helper functions for visual viewport calculations (ChatGPT fix for iPad Safari)
  const getVV = () => window.visualViewport || null;
  
  const getVVCenterInDocY = () => {
    const vv = getVV();
    const top = vv ? vv.offsetTop : 0;
    const h = vv ? vv.height : window.innerHeight;
    return top + h / 2;
  };
  
  const getVVTop = () => {
    const vv = getVV();
    return vv ? vv.offsetTop : 0;
  };
  
  const getVVHeight = () => {
    const vv = getVV();
    return vv ? vv.height : window.innerHeight;
  };

  // Wait until visual viewport stops changing (toolbar collapse/expand finished)
  const waitForViewportStable = (stableMs = 150, maxWaitMs = 800): Promise<void> => {
    return new Promise((resolve) => {
      const vv = getVV();
      if (!vv) return resolve();
      
      let lastH = vv.height;
      let lastTop = vv.offsetTop;
      let startTime = performance.now();
      let lastChange = performance.now();
      
      const tick = () => {
        const now = performance.now();
        const h = vv.height;
        const top = vv.offsetTop;
        
        if (h !== lastH || top !== lastTop) {
          lastH = h;
          lastTop = top;
          lastChange = now;
        }
        
        if (now - lastChange >= stableMs || now - startTime >= maxWaitMs) {
          resolve();
        } else {
          requestAnimationFrame(tick);
        }
      };
      
      requestAnimationFrame(tick);
    });
  };

  // Debug overlay for widescreen iPad Safari
  const showDebugOverlay = (data: {
    scrollY: number;
    vvHeight: number;
    vvOffsetTop: number;
    vvCenter: number;
    elCenter: number;
    target: number;
    phase: string;
  }) => {
    // Only show debug overlay on widescreen
    const isWidescreenDevice = window.innerWidth / window.innerHeight >= 1.6;
    if (!isWidescreenDevice) return;
    
    // Remove existing overlay
    const existing = document.getElementById('snap-debug-overlay');
    if (existing) existing.remove();
    
    const overlay = document.createElement('div');
    overlay.id = 'snap-debug-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.9);
      color: #0f0;
      font-family: monospace;
      font-size: 11px;
      padding: 10px;
      border-radius: 4px;
      z-index: 99999;
      pointer-events: none;
      white-space: pre;
    `;
    overlay.textContent = `[${data.phase}]
scrollY: ${data.scrollY.toFixed(1)}
vv.height: ${data.vvHeight.toFixed(1)}
vv.offsetTop: ${data.vvOffsetTop.toFixed(1)}
vvCenter: ${data.vvCenter.toFixed(1)}
elCenter: ${data.elCenter.toFixed(1)}
target: ${data.target.toFixed(1)}`;
    document.body.appendChild(overlay);
    
    // Auto-remove after 5 seconds
    setTimeout(() => overlay.remove(), 5000);
  };

  const handleBookClick = async (book: Book) => {
    // For widescreen: hide banner when clicking any book
    if (isWidescreen && onBannerHide) {
      onBannerHide();
    }
    
    const isWidescreenDevice = window.innerWidth / window.innerHeight >= 1.6;

    // Calculate snap position using visual viewport (ChatGPT fix)
    const calculateSnapPositionVisualViewport = () => {
      const section = document.querySelector(`[data-section="${book.targetSection}"]`) as HTMLElement;
      if (!section) return null;

      // Get fixed elements - use passed getHeaderBottom for widescreen, fallback otherwise
      const headerBottom = getHeaderBottom ? getHeaderBottom() : 64;
      
      // For widescreen: the banner will disappear immediately after click
      // For non-widescreen: include banner height
      const banner = document.querySelector('[data-banner="bookshelf"]') as HTMLElement;
      const bannerHeight = (banner && !isWidescreenDevice) ? banner.offsetHeight : 0;
      const topOffset = headerBottom + bannerHeight;
      
      // Use visual viewport for accurate measurements
      const vvHeight = getVVHeight();
      const vvOffsetTop = getVVTop();
      const availableHeight = vvHeight - topOffset;
      
      // Calculate visual viewport center in document coordinates
      // This is the key fix: use offsetTop + height/2, not just height/2
      const vvCenterInDocY = window.scrollY + vvOffsetTop + (vvHeight / 2);
      
      let targetScrollPosition: number | undefined;
      let elementCenterDocY: number = 0;
      
      if (book.targetSection === 'young-adult') {
        // For young-adult slideshow
        const titleEl = section.querySelector('h2') as HTMLElement;
        const slideshowContainer = section.querySelector('.transition-opacity.duration-1000.delay-500') as HTMLElement;
        
        // For mobile phones only: position slideshow container top just below banner with breathing room
        if (isMobilePhone() && slideshowContainer) {
          const slideshowRect = slideshowContainer.getBoundingClientRect();
          const slideshowTop = slideshowRect.top + window.scrollY;
          targetScrollPosition = Math.max(0, slideshowTop - topOffset - 20);
          elementCenterDocY = slideshowTop;
        } else if (titleEl && slideshowContainer) {
          const titleRect = titleEl.getBoundingClientRect();
          const slideshowRect = slideshowContainer.getBoundingClientRect();
          
          const titleTopInViewport = titleRect.top;
          const slideshowBottomInViewport = slideshowRect.bottom;
          const totalContentHeight = slideshowBottomInViewport - titleTopInViewport;
          
          // Use visual viewport-based centering for widescreen
          if (isWidescreenDevice) {
            // Scenario A: Can fit all content
            if (availableHeight >= totalContentHeight + 40) {
              const titleTop = titleRect.top + window.scrollY;
              const slideshowBottom = slideshowRect.bottom + window.scrollY;
              elementCenterDocY = titleTop + ((slideshowBottom - titleTop) / 2);
              
              // Target = elementCenter - (vvOffsetTop + topOffset + availableHeight/2)
              const desiredCenterInDocY = vvOffsetTop + topOffset + (availableHeight / 2);
              targetScrollPosition = Math.max(0, elementCenterDocY - desiredCenterInDocY + window.scrollY);
            } else {
              // Scenario B: Center slideshow alone
              const slideshowTop = slideshowRect.top + window.scrollY;
              const slideshowHeight = slideshowRect.height;
              elementCenterDocY = slideshowTop + (slideshowHeight / 2);
              
              const desiredCenterInDocY = vvOffsetTop + topOffset + (availableHeight / 2);
              targetScrollPosition = Math.max(0, elementCenterDocY - desiredCenterInDocY + window.scrollY);
            }
          } else {
            // Non-widescreen fallback
            if (availableHeight >= totalContentHeight + 40) {
              const titleTop = titleRect.top + window.scrollY;
              const slideshowBottom = slideshowRect.bottom + window.scrollY;
              const contentCenter = titleTop + ((slideshowBottom - titleTop) / 2);
              const desiredCenterY = topOffset + (availableHeight / 2);
              targetScrollPosition = Math.max(0, contentCenter - desiredCenterY);
              elementCenterDocY = contentCenter;
            } else {
              const slideshowTop = slideshowRect.top + window.scrollY;
              const slideshowHeight = slideshowRect.height;
              const slideshowCenter = slideshowTop + (slideshowHeight / 2);
              const desiredCenterY = topOffset + (availableHeight / 2);
              targetScrollPosition = Math.max(0, slideshowCenter - desiredCenterY);
              elementCenterDocY = slideshowCenter;
            }
          }
        } else if (titleEl) {
          const titleTop = titleEl.getBoundingClientRect().top + window.scrollY;
          targetScrollPosition = titleTop - topOffset - 20;
          elementCenterDocY = titleTop;
        }
      } else {
        // For individual books: center the book cover
        const bookCoverImg = section.querySelector('img[alt*="Cover"]');
        if (bookCoverImg) {
          const imgRect = bookCoverImg.getBoundingClientRect();
          const imgHeight = imgRect.height;
          const imgTop = imgRect.top + window.scrollY;
          elementCenterDocY = imgTop + (imgHeight / 2);
          
          // For iPad 10.9" portrait mode only
          const tabletPortraitOffset = isTabletPortrait() ? 50 : 0;
          
          if (isWidescreenDevice) {
            // Use visual viewport center: elCenter - vvCenter
            const vvCenter = getVVCenterInDocY();
            targetScrollPosition = Math.max(0, elementCenterDocY - vvCenter + window.scrollY);
          } else {
            const desiredCenterY = topOffset + (availableHeight / 2) - tabletPortraitOffset;
            targetScrollPosition = Math.max(0, elementCenterDocY - desiredCenterY);
          }
        } else {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          targetScrollPosition = sectionTop - topOffset - 80;
          elementCenterDocY = sectionTop;
        }
      }
      
      return { targetScrollPosition, elementCenterDocY, vvOffsetTop, vvHeight };
    };

    const scrollToSection = async () => {
      // For widescreen: wait for visual viewport to stabilize before calculating
      if (isWidescreenDevice) {
        await waitForViewportStable(150, 800);
      }
      
      const result = calculateSnapPositionVisualViewport();
      if (!result || result.targetScrollPosition === undefined) return;
      
      const { targetScrollPosition, elementCenterDocY, vvOffsetTop, vvHeight } = result;
      const vvCenter = getVVCenterInDocY();
      
      // Show debug overlay BEFORE snap
      if (isWidescreenDevice) {
        showDebugOverlay({
          scrollY: window.scrollY,
          vvHeight,
          vvOffsetTop,
          vvCenter,
          elCenter: elementCenterDocY,
          target: targetScrollPosition,
          phase: 'BEFORE'
        });
      }
      
      const currentScroll = window.scrollY;
      if (Math.abs(currentScroll - targetScrollPosition) > 5) {
        // Disable scroll-snap during programmatic scroll
        const scrollContainer = document.documentElement;
        const originalSnapType = scrollContainer.style.scrollSnapType;
        scrollContainer.style.scrollSnapType = 'none';
        
        // Smooth scroll to target
        window.scrollTo({ 
          top: Math.max(0, targetScrollPosition),
          behavior: 'smooth' 
        });
        
        // Stabilization loop
        const stabilizeAndCorrect = async () => {
          let lastScrollY = window.scrollY;
          let stableFrameCount = 0;
          const requiredStableFrames = 3;
          
          const checkStability = async () => {
            const currentScrollY = window.scrollY;
            
            if (Math.abs(currentScrollY - lastScrollY) < 1) {
              stableFrameCount++;
            } else {
              stableFrameCount = 0;
            }
            lastScrollY = currentScrollY;
            
            if (stableFrameCount >= requiredStableFrames) {
              // Wait for viewport to stabilize again before correction
              if (isWidescreenDevice) {
                await waitForViewportStable(100, 400);
              }
              
              // Re-measure and correct
              const correctedResult = calculateSnapPositionVisualViewport();
              if (correctedResult && correctedResult.targetScrollPosition !== undefined) {
                const finalScroll = window.scrollY;
                const correctedPosition = correctedResult.targetScrollPosition;
                
                // Show debug overlay AFTER snap
                if (isWidescreenDevice) {
                  showDebugOverlay({
                    scrollY: finalScroll,
                    vvHeight: correctedResult.vvHeight,
                    vvOffsetTop: correctedResult.vvOffsetTop,
                    vvCenter: getVVCenterInDocY(),
                    elCenter: correctedResult.elementCenterDocY,
                    target: correctedPosition,
                    phase: 'AFTER'
                  });
                }
                
                if (Math.abs(finalScroll - correctedPosition) > 2) {
                  window.scrollTo({ 
                    top: Math.max(0, correctedPosition),
                    behavior: 'auto'
                  });
                }
              }
              
              // Re-enable scroll-snap
              scrollContainer.style.scrollSnapType = originalSnapType;
              
              // One more correction after snap re-enable
              requestAnimationFrame(() => {
                const postResult = calculateSnapPositionVisualViewport();
                if (postResult && postResult.targetScrollPosition !== undefined) {
                  const postSnapScroll = window.scrollY;
                  if (Math.abs(postSnapScroll - postResult.targetScrollPosition) > 2) {
                    window.scrollTo({ 
                      top: Math.max(0, postResult.targetScrollPosition),
                      behavior: 'auto'
                    });
                  }
                }
              });
            } else {
              requestAnimationFrame(() => checkStability());
            }
          };
          
          requestAnimationFrame(() => checkStability());
        };
        
        setTimeout(stabilizeAndCorrect, 500);
      }
    };

    // Set slideshow book IMMEDIATELY if it's a slideshow book
    if (onBookClick && book.slideToBook !== undefined) {
      onBookClick(book.id, book.slideToBook);
      
      requestAnimationFrame(() => {
        scrollToSection();
      });
    } else {
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