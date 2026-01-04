import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.png";
import toFlyCover from "@/assets/to-fly-cover-new.png";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.png";

const books = [
  {
    title: "The Congress of Worlds",
    series: "Professor Barnabas and Darwin",
    subtitle: "",
    summary: "Set in Victorian London, twelve-year-old Darwin finds himself, despite his best efforts, working as errand-boy at a curiosity shop for the eccentric Professor Barnabas—who seems no more keen on the arrangement than Darwin himself. But it is there that he discovers a doorway to another London, one where people take a submarine to work, where wrens and robins can talk, and ancient kings of England might be found running the local tavern. |Undon| however is rarely what it seems, and when a delivery goes awry, Darwin will have to draw on all of his courage and invention to escape its clutches—and an early brush with the ingenious Renard—in this first of the adventures of Professor Barnabas and Darwin.",
    cover: professorBarnabasCover,
    layout: "cover-left"
  },
  {
    title: "The Land is a Dream of the Sky",
    series: "",
    subtitle: "",
    summary: "In a walled city within a great wasteland, a small blind boy with white eyes lives under the rule of his robot father. When a pilgrim arrives, everything the boy believed about his world comes into question, and disaster threatens his city.",
    cover: landDreamSkyCover,
    layout: "cover-left"
  },
  {
    title: "To Fly",
    series: "",
    subtitle: "",
    summary: "Isaac can't believe he's been chosen for a prestigious school, but when he arrives, he discovers it's a TestFlight Academy. In a universe where the war is already over and humanity has lost, these boys are test pilots for experimental spaceships - humanity's last hope.",
    cover: toFlyCover,
    layout: "cover-left"
  }
];

interface YoungAdultSlideshowProps {
  onBookChange?: (index: number) => void;
  isWidescreen?: boolean;
}

export interface YoungAdultSlideshowRef {
  setCurrentBook: (index: number) => void;
}

export const YoungAdultSlideshow = forwardRef<YoungAdultSlideshowRef, YoungAdultSlideshowProps>(({ onBookChange, isWidescreen = false }, ref) => {
  const [currentBook, setCurrentBookState] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const setCurrentBook = (index: number) => {
    setCurrentBookState(index);
    onBookChange?.(index);
  };

  useImperativeHandle(ref, () => ({
    setCurrentBook
  }));

  // Notify parent of initial book selection
  useEffect(() => {
    onBookChange?.(0);
  }, [onBookChange]);

  // Preload all book covers immediately
  useEffect(() => {
    books.forEach(book => {
      const img = new Image();
      img.src = book.cover;
    });
  }, []);

  const nextBook = () => {
    const newIndex = (currentBook + 1) % books.length;
    setCurrentBook(newIndex);
  };

  const prevBook = () => {
    const newIndex = (currentBook - 1 + books.length) % books.length;
    setCurrentBook(newIndex);
  };

  // Touch/swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum swipe distance to trigger navigation
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped left - go to next book
        nextBook();
      } else {
        // Swiped right - go to previous book
        prevBook();
      }
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const book = books[currentBook];

  // Widescreen: scale the entire slideshow to fit viewport WITHOUT banner (80vh matches book cover heights)
  // max-w-5xl adds breathing space on wider screens
  const containerClasses = isWidescreen
    ? "relative w-full max-w-5xl mx-auto bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20 h-[calc(80vh)] flex flex-col"
    : "relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20";

  const contentPadding = isWidescreen
    ? "relative px-20 py-4 md:px-16 lg:px-12 pb-10 max-sm:px-8 max-sm:py-4 max-sm:pb-12 flex-1"
    : "relative px-20 py-8 md:px-16 lg:px-12 pb-16 max-sm:px-4 max-sm:py-4 max-sm:pb-12";

  // Widescreen book covers: larger to fill the container better
  const imageClasses = isWidescreen
    ? "h-[calc(65vh)] w-auto mx-auto object-contain rounded-lg shadow-lg transition-opacity duration-100"
    : "w-full max-w-xs mx-auto object-contain rounded-lg shadow-lg transition-opacity duration-100 max-sm:max-w-[200px]";

  const seriesClasses = isWidescreen
    ? "font-serif text-xs uppercase tracking-widest text-yellow-300/80 mb-1 drop-shadow-lg"
    : "font-serif text-sm uppercase tracking-widest text-yellow-300/80 mb-1 drop-shadow-lg max-sm:text-xs";

  const titleClasses = isWidescreen
    ? "font-serif text-xl font-bold text-white mb-2 drop-shadow-lg"
    : "font-serif text-2xl font-bold text-white mb-2 drop-shadow-lg max-sm:text-lg max-sm:mb-1";

  const subtitleClasses = isWidescreen
    ? "font-serif text-base text-yellow-300 mb-2 drop-shadow-lg"
    : "font-serif text-lg text-yellow-300 mb-3 drop-shadow-lg max-sm:text-sm max-sm:mb-2";

  const summaryClasses = isWidescreen
    ? "font-serif text-xs leading-relaxed text-white/90 drop-shadow-md max-w-[95%]"
    : "font-serif text-sm leading-relaxed text-white/90 drop-shadow-md max-sm:text-xs max-sm:leading-normal max-w-[95%]";

  // Helper to render summary with italic Undon
  const renderSummary = (summary: string) => {
    if (summary.includes('|Undon|')) {
      const parts = summary.split('|Undon|');
      return (
        <>
          {parts[0]}<em className="italic">Undon</em>{parts[1]}
        </>
      );
    }
    return summary;
  };

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={contentPadding}>
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-sm:gap-4 ${
          book.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""
        } ${isWidescreen ? "h-full" : ""}`}>
          {/* Book Cover */}
          <div className={book.layout === "cover-right" ? "lg:col-start-2" : ""}>
            <img 
              key={`cover-${currentBook}`}
              src={book.cover} 
              alt={book.title}
              className={imageClasses}
              loading="eager"
            />
          </div>
          
          {/* Book Info */}
          <div className={`${book.layout === "cover-right" ? "lg:col-start-1 pl-24 pr-8" : "pr-24 pl-8"} md:pl-24 md:pr-24 max-sm:px-0 ${isWidescreen ? "flex flex-col justify-center" : ""}`}>
            {book.series && (
              <p className={seriesClasses}>{book.series}</p>
            )}
            <h3 className={titleClasses}>{book.title}</h3>
            {book.subtitle && (
              <h4 className={subtitleClasses}>{book.subtitle}</h4>
            )}
            <p className={summaryClasses}>
              {renderSummary(book.summary)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation - hidden on mobile, use swipe instead */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 max-sm:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={prevBook}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 max-sm:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={nextBook}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Book Indicator */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 flex space-x-2 ${isWidescreen ? "bottom-2" : "bottom-4"}`}>
        {books.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentBook ? 'bg-yellow-300' : 'bg-yellow-300/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

YoungAdultSlideshow.displayName = "YoungAdultSlideshow";