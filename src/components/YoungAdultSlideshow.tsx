import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.png";
import toFlyCover from "@/assets/to-fly-cover-new.jpeg";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.png";

const books = [
  {
    title: "The Congress of Worlds",
    series: "Professor Barnabas and Darwin",
    subtitle: "",
    summary: "Set in Victorian London, twelve-year-old Darwin finds himself—despite his best efforts—working as an errand boy at a curiosity shop for the eccentric |Professor Barnabas|, who seems no more keen on the arrangement than Darwin himself.|BREAK|But it is there that he discovers a doorway to another London: one where people take a submarine to work, where wrens and robins can talk, and where ancient kings of England might be found running the local tavern. |Undon|, however, is rarely what it seems, and when a delivery goes awry, Darwin will have to draw on all of his courage and invention to escape its clutches—and an early brush with the ingenious |Renard|—in this first of the adventures of |Professor Barnabas and Darwin|.",
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
    title: "We Become Starpilots!",
    series: "To Fly",
    subtitle: "",
    summary: "|The war is over. And we lost.||BREAK|Humans and Angels have coexisted for two hundred years, with humanity long accepting its status as subject to the extragalactic species. Now something is changing, inside space itself…|BREAK||Isaak| failed the tests. Crashed every simulation. So he can barely believe it when he's selected for a place at the elite |Harmann School of Aviation|. But his selection was no accident—and the war is far from over.|BREAK|In this first instalment in the series, rivalries and allegiances are forged as |Isaak| struggles to find his place among the gifted students. When a training mission turns into a perilous encounter, he learns that friends and rivals are not always what they first seem…",
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
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const swipeDecided = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  
  // Thresholds for swipe detection
  const SWIPE_START_THRESHOLD = 15; // Minimum horizontal movement to start tracking swipe
  const SWIPE_COMPLETE_THRESHOLD = 50; // Minimum to complete a slide change

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

  const goToBook = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, books.length - 1));
    setCurrentBook(clampedIndex);
  };

  const nextBook = () => {
    if (currentBook < books.length - 1) {
      goToBook(currentBook + 1);
    }
  };

  const prevBook = () => {
    if (currentBook > 0) {
      goToBook(currentBook - 1);
    }
  };

  // Touch/swipe handlers - only activate on intentional horizontal swipes
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    swipeDecided.current = false;
    setIsSwipeActive(false);
    setIsDragging(false);
    setTranslateX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = currentX - touchStartX.current;
    const diffY = currentY - touchStartY.current;
    
    // If we haven't decided yet whether this is a swipe or scroll
    if (!swipeDecided.current) {
      const absDiffX = Math.abs(diffX);
      const absDiffY = Math.abs(diffY);
      
      // Need minimum movement before deciding
      if (absDiffX < SWIPE_START_THRESHOLD && absDiffY < SWIPE_START_THRESHOLD) {
        return; // Not enough movement yet, don't do anything
      }
      
      // Decide: if horizontal movement is greater than vertical, it's a swipe
      if (absDiffX > absDiffY && absDiffX >= SWIPE_START_THRESHOLD) {
        swipeDecided.current = true;
        setIsSwipeActive(true);
        setIsDragging(true);
      } else {
        // Vertical scroll - ignore this touch sequence for swiping
        swipeDecided.current = true;
        setIsSwipeActive(false);
        return;
      }
    }
    
    // Only track horizontal movement if we decided this is a swipe
    if (!isSwipeActive && !swipeDecided.current) return;
    if (swipeDecided.current && !isSwipeActive) return;
    
    // Add resistance at edges
    if ((currentBook === 0 && diffX > 0) || (currentBook === books.length - 1 && diffX < 0)) {
      setTranslateX(diffX * 0.3); // Reduced movement at edges
    } else {
      setTranslateX(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) {
      return;
    }
    
    // Only process swipe if we were actively swiping
    if (isSwipeActive) {
      if (translateX < -SWIPE_COMPLETE_THRESHOLD && currentBook < books.length - 1) {
        // Swiped left - go to next book
        goToBook(currentBook + 1);
      } else if (translateX > SWIPE_COMPLETE_THRESHOLD && currentBook > 0) {
        // Swiped right - go to previous book
        goToBook(currentBook - 1);
      }
    }
    
    setTranslateX(0);
    setIsDragging(false);
    setIsSwipeActive(false);
    touchStartX.current = null;
    touchStartY.current = null;
    swipeDecided.current = false;
  };

  // Widescreen: scale the entire slideshow to fit viewport WITHOUT banner (80vh matches book cover heights)
  const containerClasses = isWidescreen
    ? "relative w-full max-w-5xl mx-auto bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20 h-[calc(80vh)] flex flex-col"
    : "relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20";

  const contentPadding = isWidescreen
    ? "relative px-20 pt-8 md:px-16 lg:px-12 pb-10 max-sm:px-8 max-sm:py-4 max-sm:pb-12 flex-1 flex items-center"
    : "relative px-20 py-8 md:px-16 lg:px-12 pb-16 max-sm:px-4 max-sm:py-4 max-sm:pb-12";

  // Widescreen book covers: larger to fill the container better
  const imageClasses = isWidescreen
    ? "h-[calc(65vh)] w-auto mx-auto object-contain rounded-lg shadow-lg"
    : "w-full max-w-xs mx-auto object-contain rounded-lg shadow-lg max-sm:max-w-[200px]";

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
    ? "font-serif text-xs leading-relaxed text-white/90 drop-shadow-md max-w-full"
    : "font-serif text-sm leading-relaxed text-white/90 drop-shadow-md max-sm:text-xs max-sm:leading-normal max-w-[95%]";

  // Helper to render summary with italic words and paragraph breaks
  const renderSummary = (summary: string) => {
    // Split by paragraph break first
    const paragraphs = summary.split('|BREAK|');
    
    // Process each paragraph to handle italic markers
    const processText = (text: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let key = 0;
      
      // Find all italic markers |word| and process them
      const italicPattern = /\|([^|]+)\|/g;
      let lastIndex = 0;
      let match;
      
      while ((match = italicPattern.exec(text)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add the italic word
        parts.push(<em key={key++} className="italic">{match[1]}</em>);
        lastIndex = match.index + match[0].length;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      return parts;
    };
    
    if (paragraphs.length > 1) {
      return (
        <>
          {paragraphs.map((para, idx) => (
            <span key={idx} className={idx > 0 ? "block mt-3" : ""}>
              {processText(para)}
            </span>
          ))}
        </>
      );
    }
    
    return processText(summary);
  };

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides container - all slides rendered, positioned side by side */}
      <div 
        ref={slidesRef}
        className="flex w-full h-full"
        style={{
          transform: `translateX(calc(-${currentBook * 100}% + ${translateX}px))`,
          transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          willChange: 'transform'
        }}
      >
        {books.map((book, index) => (
          <div 
            key={index}
            className="flex-shrink-0 w-full h-full"
          >
            <div className={contentPadding}>
              <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 items-center max-sm:gap-4 ${
                book.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""
              } ${isWidescreen ? "h-full" : ""}`}>
                {/* Book Cover */}
                <div className={book.layout === "cover-right" ? "lg:col-start-2" : ""}>
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className={imageClasses}
                    loading="eager"
                    draggable={false}
                  />
                </div>
                
                {/* Book Info */}
                <div className={`${book.layout === "cover-right" ? "lg:col-start-1 pl-24 pr-8" : "pr-12 pl-8"} md:pl-16 md:pr-12 max-sm:px-4 max-sm:text-center ${isWidescreen ? "flex flex-col justify-center" : ""}`}>
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
          </div>
        ))}
      </div>
      
      {/* Navigation - hidden on mobile, use swipe instead */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 max-sm:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={prevBook}
          disabled={currentBook === 0}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 max-sm:hidden">
        <Button
          variant="outline"
          size="lg"
          onClick={nextBook}
          disabled={currentBook === books.length - 1}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Book Indicator */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 flex space-x-2 ${isWidescreen ? "bottom-2" : "bottom-4"}`}>
        {books.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors duration-300 ${
              index === currentBook ? 'bg-yellow-300' : 'bg-yellow-300/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
});

YoungAdultSlideshow.displayName = "YoungAdultSlideshow";