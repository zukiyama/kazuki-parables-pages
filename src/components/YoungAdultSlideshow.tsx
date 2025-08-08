import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Book covers
import professorBarnabasCover from "@/assets/professor-barnabas-cover.jpg";
import toFlyCover from "@/assets/to-fly-cover.jpg";
import landDreamSkyCover from "@/assets/land-dream-sky-cover.jpg";

const books = [
  {
    title: "Professor Barnabas and Darwin",
    subtitle: "A Congress of Worlds",
    summary: "A Victorian tale of an eccentric professor's mysterious shop filled with strange globes and bizarre telescopes. When young orphan Darwin comes to work there, he discovers the shop holds magical secrets beyond imagination.",
    cover: professorBarnabasCover,
    layout: "cover-left"
  },
  {
    title: "The Land is a Dream of the Sky",
    subtitle: "",
    summary: "In a walled city within a great wasteland, a small blind boy with white eyes lives under the rule of his robot father. When a pilgrim arrives, everything the boy believed about his world comes into question, and disaster threatens his city.",
    cover: landDreamSkyCover,
    layout: "cover-right"
  },
  {
    title: "To Fly",
    subtitle: "",
    summary: "Isaac can't believe he's been chosen for a prestigious school, but when he arrives, he discovers it's a TestFlight Academy. In a universe where the war is already over and humanity has lost, these boys are test pilots for experimental spaceships - humanity's last hope.",
    cover: toFlyCover,
    layout: "cover-left"
  }
];

export const YoungAdultSlideshow = () => {
  const [currentBook, setCurrentBook] = useState(0);

  const nextBook = () => {
    setCurrentBook((prev) => (prev + 1) % books.length);
  };

  const prevBook = () => {
    setCurrentBook((prev) => (prev - 1 + books.length) % books.length);
  };

  const book = books[currentBook];

  return (
    <div className="relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20">
      <div className="px-16 py-8 md:px-12 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
          book.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""
        }`}>
          {/* Book Cover */}
          <div className={book.layout === "cover-right" ? "lg:col-start-2" : ""}>
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full max-w-sm mx-auto aspect-[3/4] object-cover rounded-lg shadow-lg"
            />
          </div>
          
          {/* Book Info */}
          <div className={book.layout === "cover-right" ? "lg:col-start-1" : ""}>
            <h3 className="font-serif text-3xl font-bold text-white mb-2">{book.title}</h3>
            {book.subtitle && (
              <h4 className="font-serif text-xl text-yellow-300 mb-4">{book.subtitle}</h4>
            )}
            <p className="font-serif text-lg leading-relaxed text-white/90">
              {book.summary}
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="lg"
          onClick={prevBook}
          className="bg-black/60 border-2 border-yellow-300/60 text-yellow-300 hover:bg-black/80 hover:border-yellow-300 hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
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
};