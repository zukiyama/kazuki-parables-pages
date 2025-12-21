import { useState } from "react";

// Thumbnail versions for banner (optimized for faster loading)
import kaijuCover from "@/assets/kaiju-cover-thumb.jpg";
import hoaxCover from "@/assets/hoax-cover-thumb.jpg";
import theMarketCover from "@/assets/the-market-cover-thumb.jpg";
import howCover from "@/assets/how-cover-thumb.jpg";
import viceVersaCover from "@/assets/vice-versa-cover-thumb.jpg";
import amyaCover from "@/assets/amya-cover-thumb.jpg";
import statesOfMotionCover from "@/assets/states-of-motion-cover-thumb.jpg";

// Young adult book cover thumbnails
import professorBarnabasCover from "@/assets/professor-barnabas-cover-thumb.jpg";
import toFlyCover from "@/assets/to-fly-cover-thumb.jpg";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-thumb.jpg";

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

  const handleBookClick = (book: Book) => {
    // For widescreen: hide banner when clicking any book
    if (isWidescreen && onBannerHide) {
      onBannerHide();
    }
    
    const scrollToSection = () => {
      const section = document.querySelector(`[data-section="${book.targetSection}"]`) as HTMLElement;
      if (!section) return;

      // Get fixed elements - use passed getHeaderBottom for widescreen, fallback otherwise
      const isWidescreenDevice = window.innerWidth / window.innerHeight >= 1.6;
      const headerBottom = getHeaderBottom ? getHeaderBottom() : 64;
      
      // For widescreen: ignore banner in calculations (snap is independent of banner)
      const topOffset = headerBottom; // No banner offset for widescreen
      const viewportHeight = window.innerHeight;
      const availableHeight = viewportHeight - topOffset;
      
      let targetScrollPosition;
      
      if (book.targetSection === 'young-adult') {
        // For young-adult slideshow: use EXACT same logic as getCenterSnapPoint in Writing.tsx
        const titleEl = section.querySelector('h2') as HTMLElement;
        const slideshowContainer = section.querySelector('.transition-all.duration-1000.delay-500') as HTMLElement;
        
        if (titleEl && slideshowContainer) {
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
        // For individual books: ensure full book cover is visible
        const bookCoverImg = section.querySelector('img[alt*="Cover"]');
        if (bookCoverImg) {
          const imgRect = bookCoverImg.getBoundingClientRect();
          const imgTop = imgRect.top + window.scrollY;
          targetScrollPosition = imgTop - topOffset - 80;
        } else {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY;
          targetScrollPosition = sectionTop - topOffset - 80;
        }
      }
      
      if (targetScrollPosition !== undefined) {
        // Check if we're already at or very close to the target position
        const currentScroll = window.scrollY;
        if (Math.abs(currentScroll - targetScrollPosition) > 5) {
          window.scrollTo({ 
            top: Math.max(0, targetScrollPosition),
            behavior: 'smooth' 
          });
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
      className={`fixed top-16 left-0 right-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/20 py-4 max-sm:pt-5 max-sm:pb-6 transition-all duration-500 ease-out ${
        isWidescreen && !bannerVisible 
          ? 'opacity-0 -translate-y-full pointer-events-none' 
          : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="container mx-auto px-6 max-sm:px-4">
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
                  className={`rounded shadow-lg transition-all duration-300 group-hover:shadow-xl object-contain w-16 h-auto max-sm:w-10 max-sm:max-h-none ${
                    activeBook === book.id
                      ? 'scale-110 shadow-xl shadow-yellow-300/30 ring-2 ring-yellow-300/50'
                      : hoveredBook === book.id 
                        ? 'scale-125 shadow-2xl shadow-yellow-300/20' 
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