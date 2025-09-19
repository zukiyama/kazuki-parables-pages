import { useState } from "react";
import { OptimizedImage } from "./OptimizedImage";

// Main book covers
import kaijuCover from "@/assets/kaiju-cover-new.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import theMarketCover from "@/assets/the-market-cover-new.jpg";
import howCover from "@/assets/how-cover.jpg";
import viceVersaCover from "@/assets/vice-versa-cover.jpg";
import amyaCover from "@/assets/amya-cover.png";
import statesOfMotionCover from "@/assets/states-of-motion-cover.png";

// Young adult book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover.jpg";
import toFlyCover from "@/assets/to-fly-cover-new.png";
import landDreamSkyCover from "@/assets/land-dream-sky-cover.jpg";

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
    title: "KAIJU",
    cover: kaijuCover,
    targetSection: "kaiju"
  },
  {
    id: "hoax", 
    title: "HOAX",
    cover: hoaxCover,
    targetSection: "hoax"
  },
  {
    id: "the-market",
    title: "THE MARKET",
    cover: theMarketCover,
    targetSection: "the-market"
  },
  {
    id: "oba",
    title: "AMYA",
    cover: amyaCover,
    targetSection: "oba"
  },
  {
    id: "states-of-motion",
    title: "STATES OF MOTION",
    cover: statesOfMotionCover,
    targetSection: "states-of-motion"
  },
  {
    id: "how",
    title: "HOW", 
    cover: howCover,
    targetSection: "how"
  },
  {
    id: "vice-versa",
    title: "VICE VERSA",
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
    title: "Land Dream Sky",
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
}

export const BookshelfMenu = ({ onBookClick, visibleSections, currentYoungAdultBook = 0 }: BookshelfMenuProps) => {
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
    
    return 'kaiju'; // Default fallback
  };
  
  const activeBook = getActiveBook();

  // Only preload the first few critical covers for immediate visibility
  useState(() => {
    const criticalImages = [kaijuCover, hoaxCover];
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });

  const handleBookClick = (book: Book) => {
    const scrollToSection = (retryCount = 0) => {
      const section = document.querySelector(`[data-section="${book.targetSection}"]`) as HTMLElement;
      if (section) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const fixedElementsHeight = 160; // navigation + bookshelf menu
            const viewportHeight = window.innerHeight;
            const availableHeight = viewportHeight - fixedElementsHeight;
            
            let targetScrollPosition;
            
            if (book.targetSection === 'young-adult') {
              // For slideshow: center the "Young Adult Series" title with equal spacing
              const titleElement = section.querySelector('h2');
              if (titleElement) {
                const titleTop = titleElement.getBoundingClientRect().top + window.scrollY;
                const slideshowContainer = section.querySelector('.container');
                const slideshowBottom = slideshowContainer ? 
                  slideshowContainer.getBoundingClientRect().bottom + window.scrollY : 
                  section.getBoundingClientRect().bottom + window.scrollY;
                
                const slideshowHeight = slideshowBottom - titleTop;
                const centerOffset = (availableHeight - slideshowHeight) / 2;
                targetScrollPosition = titleTop - fixedElementsHeight - centerOffset;
              }
            } else {
              // For individual books: center the book cover image with equal spacing
              const bookCoverImg = section.querySelector('img[alt*="Cover"]');
              if (bookCoverImg) {
                const imgRect = bookCoverImg.getBoundingClientRect();
                const imgTop = imgRect.top + window.scrollY;
                const imgHeight = imgRect.height;
                const centerOffset = (availableHeight - imgHeight) / 2;
                targetScrollPosition = imgTop - fixedElementsHeight - centerOffset;
              } else {
                // Fallback: center the section
                const sectionTop = section.getBoundingClientRect().top + window.scrollY;
                const sectionHeight = section.offsetHeight;
                const centerOffset = (availableHeight - sectionHeight) / 2;
                targetScrollPosition = sectionTop - fixedElementsHeight - Math.max(0, centerOffset);
              }
            }
            
            if (targetScrollPosition !== undefined) {
              window.scrollTo({ 
                top: Math.max(0, targetScrollPosition),
                behavior: 'smooth' 
              });
            }
            
            // Retry once if needed during page load
            if (retryCount === 0 && document.readyState !== 'complete') {
              setTimeout(() => scrollToSection(1), 300);
            }
          });
        });
      }
    };

    // Set slideshow book IMMEDIATELY if it's a slideshow book to prevent flickering
    if (onBookClick && book.slideToBook !== undefined) {
      onBookClick(book.id, book.slideToBook);
      
      // Allow slideshow to update before scrolling
      setTimeout(() => scrollToSection(), 100);
    } else {
      // For non-slideshow books, scroll after a brief delay to ensure layout is ready
      setTimeout(() => scrollToSection(), 50);
      
      if (onBookClick) {
        onBookClick(book.id, book.slideToBook);
      }
    }
  };

  return (
    <div className="sticky top-16 z-20 bg-black/80 backdrop-blur-md border-b border-white/20 py-3">
      <div className="container mx-auto px-6">
        <div className="flex justify-center items-center gap-6 overflow-x-auto pb-2">
          {books.map((book) => (
            <div
              key={book.id}
              className="flex flex-col items-center cursor-pointer group min-w-[80px]"
              onMouseEnter={() => setHoveredBook(book.id)}
              onMouseLeave={() => setHoveredBook(null)}
              onClick={() => handleBookClick(book)}
            >
              {/* Book Title */}
              <h3 className={`font-serif text-xs font-semibold mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap ${
                activeBook === book.id ? 'text-yellow-300' : 'text-white'
              }`}>
                {book.title}
              </h3>
              
              {/* Book Cover */}
              <div className="relative">
                <OptimizedImage
                  src={book.cover}
                  alt={book.title}
                  loading={['kaiju', 'hoax', 'the-market', 'oba', 'states-of-motion', 'how', 'vice-versa'].includes(book.id) ? 'eager' : 'lazy'}
                  className={`h-16 w-auto object-contain rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
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