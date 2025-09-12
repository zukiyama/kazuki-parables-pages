import { useState } from "react";
import { Carousel3D } from "./Carousel3D";

// Main book covers
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import siphonsCover from "@/assets/siphons-cover.jpg";
import obaCover from "@/assets/oba-cover.jpg";

// Young adult book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover.jpg";
import toFlyCover from "@/assets/to-fly-cover.jpg";
import landDreamSkyCover from "@/assets/land-dream-sky-cover.jpg";

interface Book {
  id: string;
  title: string;
  image: string;
  targetSection: string;
  slideToBook?: number; // For young adult books that are in a slideshow
}

const books: Book[] = [
  {
    id: "kaiju",
    title: "KAIJU",
    image: kaijuCover,
    targetSection: "kaiju"
  },
  {
    id: "hoax", 
    title: "HOAX",
    image: hoaxCover,
    targetSection: "hoax"
  },
  {
    id: "siphons",
    title: "SIPHONS", 
    image: siphonsCover,
    targetSection: "siphons"
  },
  {
    id: "oba",
    title: "OBA",
    image: obaCover,
    targetSection: "oba"
  },
  {
    id: "professor-barnabas",
    title: "Professor Barnabas",
    image: professorBarnabasCover,
    targetSection: "young-adult",
    slideToBook: 0
  },
  {
    id: "land-dream",
    title: "Land Dream Sky",
    image: landDreamSkyCover,
    targetSection: "young-adult",
    slideToBook: 1
  },
  {
    id: "to-fly",
    title: "To Fly",
    image: toFlyCover,
    targetSection: "young-adult", 
    slideToBook: 2
  }
];

interface BookshelfMenuProps {
  onBookClick?: (bookId: string, slideToBook?: number) => void;
  selectedBookId?: string;
}

export const BookshelfMenu = ({ onBookClick, selectedBookId }: BookshelfMenuProps) => {
  // Preload critical book cover images for better performance
  useState(() => {
    const criticalImages = [kaijuCover, hoaxCover];
    criticalImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  });

  const handleBookSelect = (bookId: string | number) => {
    const book = books.find(b => b.id === bookId);
    if (!book) return;

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
    <div className="sticky top-16 z-20 bg-black/90 backdrop-blur-md border-b border-white/20 py-6">
      <div className="container mx-auto px-6">
        <Carousel3D
          items={books}
          selectedItemId={selectedBookId}
          onItemSelect={handleBookSelect}
          className="h-32"
        />
      </div>
    </div>
  );
};