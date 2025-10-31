import { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover-new.png";
import toFlyCover from "@/assets/to-fly-cover-new.png";
import landDreamSkyCover from "@/assets/land-dream-sky-cover-new.png";

const books = [
  {
    title: "Professor Barnabas and Darwin",
    subtitle: "The Congress of Worlds",
    summary: "A Victorian tale of an eccentric professor's mysterious shop filled with strange globes and bizarre telescopes. When young orphan Darwin comes to work there, he discovers the shop holds magical secrets beyond imagination.",
    cover: professorBarnabasCover,
    layout: "cover-left"
  },
  {
    title: "The Land is a Dream of the Sky",
    subtitle: "",
    summary: "In a walled city within a great wasteland, a small blind boy with white eyes lives under the rule of his robot father. When a pilgrim arrives, everything the boy believed about his world comes into question, and disaster threatens his city.",
    cover: landDreamSkyCover,
    layout: "cover-left"
  },
  {
    title: "To Fly",
    subtitle: "",
    summary: "Isaac can't believe he's been chosen for a prestigious school, but when he arrives, he discovers it's a TestFlight Academy. In a universe where the war is already over and humanity has lost, these boys are test pilots for experimental spaceships - humanity's last hope.",
    cover: toFlyCover,
    layout: "cover-left"
  }
];

interface YoungAdultSlideshowProps {
  onBookChange?: (index: number) => void;
}

export interface YoungAdultSlideshowRef {
  setCurrentBook: (index: number) => void;
}

export const YoungAdultSlideshow = forwardRef<YoungAdultSlideshowRef, YoungAdultSlideshowProps>(({ onBookChange }, ref) => {
  const [currentBook, setCurrentBookState] = useState(0);

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

  const nextBook = () => {
    const newIndex = (currentBook + 1) % books.length;
    setCurrentBook(newIndex);
  };

  const prevBook = () => {
    const newIndex = (currentBook - 1 + books.length) % books.length;
    setCurrentBook(newIndex);
  };

  const book = books[currentBook];

  return (
    <div className="relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20">
      <div className="relative px-20 py-8 md:px-16 lg:px-12 pb-16 max-sm:px-8 max-sm:py-4 max-sm:pb-12">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-sm:gap-4 ${
          book.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""
        }`}>
          {/* Book Cover */}
          <div className={book.layout === "cover-right" ? "lg:col-start-2" : ""}>
            <img 
              key={`cover-${currentBook}`}
              src={book.cover} 
              alt={book.title}
              className="w-full max-w-xs mx-auto object-contain shadow-lg transition-opacity duration-100 max-sm:max-w-[200px]"
              loading="eager"
            />
          </div>
          
          {/* Book Info */}
          <div className={`${book.layout === "cover-right" ? "lg:col-start-1 pl-24 pr-8" : "pr-24 pl-8"} md:pl-24 md:pr-24 max-sm:px-0`}>
            <h3 className="font-serif text-3xl font-bold text-white mb-2 drop-shadow-lg max-sm:text-xl max-sm:mb-1">{book.title}</h3>
            {book.subtitle && (
              <h4 className="font-serif text-xl text-yellow-300 mb-4 drop-shadow-lg max-sm:text-base max-sm:mb-2">{book.subtitle}</h4>
            )}
            <p className="font-serif text-lg leading-relaxed text-white/90 drop-shadow-md max-sm:text-sm max-sm:leading-normal">
              {book.summary}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 max-sm:left-2">
        <Button
          variant="outline"
          size="lg"
          onClick={prevBook}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl max-sm:w-8 max-sm:h-8"
        >
          <ChevronLeft className="w-6 h-6 max-sm:w-4 max-sm:h-4" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 max-sm:right-2">
        <Button
          variant="outline"
          size="lg"
          onClick={nextBook}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl max-sm:w-8 max-sm:h-8"
        >
          <ChevronRight className="w-6 h-6 max-sm:w-4 max-sm:h-4" />
        </Button>
      </div>
      
      {/* Book Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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