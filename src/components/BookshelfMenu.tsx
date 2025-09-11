import { useState } from "react";

// Main book covers
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import hoaxCover from "@/assets/IMG_7715.png";
import siphonsCover from "@/assets/siphons-cover.jpg";
import obaCover from "@/assets/oba-cover.jpg";

// Young adult book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover.jpg";
import toFlyCover from "@/assets/to-fly-cover.jpg";
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
    id: "siphons",
    title: "SIPHONS", 
    cover: siphonsCover,
    targetSection: "siphons"
  },
  {
    id: "oba",
    title: "OBA",
    cover: obaCover,
    targetSection: "oba"
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
}

export const BookshelfMenu = ({ onBookClick }: BookshelfMenuProps) => {
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);

  const handleBookClick = (book: Book) => {
    // Set slideshow book IMMEDIATELY if it's a slideshow book to prevent flickering
    if (onBookClick && book.slideToBook !== undefined) {
      onBookClick(book.id, book.slideToBook);
      
      // Use requestAnimationFrame to ensure the slideshow updates before scrolling
      requestAnimationFrame(() => {
        const section = document.querySelector(`[data-section="${book.targetSection}"]`);
        if (section) {
          const bannerHeight = 120;
          const sectionTop = section.getBoundingClientRect().top + window.scrollY - bannerHeight;
          window.scrollTo({ 
            top: sectionTop,
            behavior: 'smooth' 
          });
        }
      });
    } else {
      // For non-slideshow books, scroll immediately
      const section = document.querySelector(`[data-section="${book.targetSection}"]`);
      if (section) {
        const bannerHeight = 120;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY - bannerHeight;
        window.scrollTo({ 
          top: sectionTop,
          behavior: 'smooth' 
        });
      }
      
      if (onBookClick) {
        onBookClick(book.id, book.slideToBook);
      }
    }
  };

  return (
    <div className="sticky top-16 z-20 bg-black/90 backdrop-blur-md border-b border-white/20 py-3">
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
              <h3 className="font-serif text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                {book.title}
              </h3>
              
              {/* Book Cover */}
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className={`h-16 w-auto object-contain rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                    hoveredBook === book.id 
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