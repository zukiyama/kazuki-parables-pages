import { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new2.webp";
import toFlyCover from "@/assets/to-fly-cover-new.webp";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.webp";

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
    series: "The Waste Trilogy",
    subtitle: "",
    summary: "Deep in the endless wastes, a blind child-prince lives in a walled city with his machine father. The only human among its inhabitants, |Piotr| has never questioned his place in the world—until the arrival of a group of pilgrims from beyond the walls.|BREAK|Among them is |Flim|, a wilful, glitchy automaton the same age as |Piotr|, who shows little respect for the city or its ruler. Their rivalry unsettles |Piotr|, awakening a dangerous question he has never dared to ask: why is he the only living boy?|BREAK|On the night he seeks answers, a terrifying attack befalls the town. Cast into the vast and unforgiving wastes, |Piotr| and |Flim| must work together if they are to cross the forgotten lands and their ancient dangers, toward the truth of |Piotr|'s origins.",
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

  // Preload book covers when component mounts (triggered by IntersectionObserver in parent)
  // This runs when the young-adult section approaches viewport
  useEffect(() => {
    // Use requestIdleCallback to defer preloading until browser is idle
    const preloadCovers = () => {
      books.forEach(book => {
        const img = new Image();
        img.src = book.cover;
      });
    };
    
    if ('requestIdleCallback' in window) {
      (window as typeof window & { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadCovers);
    } else {
      setTimeout(preloadCovers, 100);
    }
  }, []);

  const goToBook = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, books.length - 1));
    setCurrentBook(clampedIndex);
  };

  const nextBook = () => {
    goToBook((currentBook + 1) % books.length);
  };

  const prevBook = () => {
    goToBook((currentBook - 1 + books.length) % books.length);
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
    
    setTranslateX(diffX);
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) {
      return;
    }
    
    // Only process swipe if we were actively swiping (wraps around like a carousel)
    if (isSwipeActive) {
      if (translateX < -SWIPE_COMPLETE_THRESHOLD) {
        // Swiped left - go to next book (wraps to the first)
        goToBook((currentBook + 1) % books.length);
      } else if (translateX > SWIPE_COMPLETE_THRESHOLD) {
        // Swiped right - go to previous book (wraps to the last)
        goToBook((currentBook - 1 + books.length) % books.length);
      }
    }
    
    setTranslateX(0);
    setIsDragging(false);
    setIsSwipeActive(false);
    touchStartX.current = null;
    touchStartY.current = null;
    swipeDecided.current = false;
  };

  // Widescreen: use 2-row grid to separate content from dots, ensuring consistent centering
  const containerClasses = isWidescreen
    ? "relative w-full max-w-5xl mx-auto bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20 min-h-[80vh] grid grid-rows-[1fr_auto]"
    : "relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20";

  // Content padding - on widescreen, the slide wrapper handles centering
  const contentPadding = isWidescreen
    ? "relative px-20 pt-4 md:px-16 lg:px-12 pb-4 max-sm:px-8 max-sm:py-4 h-full flex items-center justify-center"
    : "relative px-20 py-8 md:px-16 lg:px-12 pb-16 max-sm:px-4 max-sm:py-4 max-sm:pb-12";

  // Widescreen book covers: larger to fill the container better
  const imageClasses = isWidescreen
    ? "h-[calc(65vh)] w-auto mx-auto object-contain rounded-lg shadow-lg"
    : "w-full max-w-xs mx-auto object-contain rounded-lg shadow-lg max-sm:max-w-[200px]";

  const seriesClasses = isWidescreen
    ? "font-serif text-xs uppercase tracking-widest text-yellow-300/80 mb-1.5 drop-shadow-lg"
    : "font-serif text-sm uppercase tracking-widest text-yellow-300/80 mb-1 drop-shadow-lg max-sm:text-xs";

  const titleClasses = isWidescreen
    ? "font-serif text-lg font-bold text-white mb-2 drop-shadow-lg"
    : "font-serif text-2xl font-bold text-white mb-2 drop-shadow-lg max-sm:text-lg max-sm:mb-1";

  const subtitleClasses = isWidescreen
    ? "font-serif text-sm text-yellow-300 mb-2 drop-shadow-lg"
    : "font-serif text-lg text-yellow-300 mb-3 drop-shadow-lg max-sm:text-sm max-sm:mb-2";

  const summaryClasses = isWidescreen
    ? "font-serif text-sm leading-relaxed text-white/90 drop-shadow-md max-w-full"
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
      {/* Row 1: Slides container - content area with consistent height for centering */}
      <div className={isWidescreen ? "row-start-1 h-full overflow-hidden" : ""}>
        <div 
          ref={slidesRef}
          className={`flex w-full ${isWidescreen ? "h-full" : ""}`}
          style={{
            transform: `translateX(calc(-${currentBook * 100}% + ${translateX}px))`,
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform'
          }}
        >
          {books.map((book, index) => (
            <div 
              key={index}
              className={`flex-shrink-0 w-full ${isWidescreen ? "h-full" : ""}`}
            >
              <div className={contentPadding}>
                <div className={`grid grid-cols-1 gap-6 md:gap-10 items-center max-sm:gap-4 ${
                  isWidescreen ? "lg:grid-cols-[1fr_1.2fr]" : "lg:grid-cols-2"
                } ${book.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""}`}>
                  {/* Book Cover */}
                  <div className={book.layout === "cover-right" ? "lg:col-start-2" : ""}>
                    <img 
                      src={book.cover} 
                      alt={book.title}
                      width={300}
                      height={450}
                      className={imageClasses}
                      loading="lazy"
                      decoding="async"
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
      </div>
      
      {/* Navigation - modern translucent edge tabs, wraps around like a carousel; hidden on mobile, use swipe instead */}
      <button
        type="button"
        onClick={prevBook}
        aria-label="Previous book"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 max-sm:hidden flex items-center justify-start w-12 h-24 md:w-14 md:h-28 rounded-r-full bg-white/10 hover:bg-white/20 focus-visible:bg-white/20 backdrop-blur-md border border-l-0 border-white/20 text-white/90 transition-all duration-300 shadow-lg group"
      >
        <ChevronLeft className="w-7 h-7 ml-2 transition-transform duration-300 group-hover:-translate-x-0.5" />
      </button>
      <button
        type="button"
        onClick={nextBook}
        aria-label="Next book"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 max-sm:hidden flex items-center justify-end w-12 h-24 md:w-14 md:h-28 rounded-l-full bg-white/10 hover:bg-white/20 focus-visible:bg-white/20 backdrop-blur-md border border-r-0 border-white/20 text-white/90 transition-all duration-300 shadow-lg group"
      >
        <ChevronRight className="w-7 h-7 mr-2 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
      
      {/* Row 2: Book Indicator - separate from content to not affect centering */}
      <div className={`flex justify-center items-center space-x-2 ${isWidescreen ? "row-start-2 py-3" : "absolute bottom-4 left-1/2 transform -translate-x-1/2"}`}>
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