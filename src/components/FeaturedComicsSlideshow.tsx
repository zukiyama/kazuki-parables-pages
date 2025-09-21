import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-cover-new.jpg";

const featuredComics = [
  {
    title: "God of Lies",
    summary: "A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.",
    cover: godOfLiesCover,
    layout: "cover-left"
  },
  {
    title: "Surname Pendragon", 
    summary: "A modern retelling of the King Arthur stories set in contemporary times. Follow a young office worker who unknowingly carries the bloodline of the legendary king. As ancient powers awaken in the modern world, he must discover his true heritage and embrace a destiny he never imagined possible.",
    cover: surnameProPendragonCoverNew,
    layout: "cover-right"
  }
];

export const FeaturedComicsSlideshow = () => {
  const [currentComic, setCurrentComic] = useState(0);

  const nextComic = () => {
    setCurrentComic((prev) => (prev + 1) % featuredComics.length);
  };

  const prevComic = () => {
    setCurrentComic((prev) => (prev - 1 + featuredComics.length) % featuredComics.length);
  };

  const comic = featuredComics[currentComic];

  return (
    <div className="relative w-full bg-black/60 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg border border-white/20">
      <div className="relative px-20 py-8 md:px-16 lg:px-12 pb-16">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh] ${
          comic.layout === "cover-right" ? "lg:grid-flow-col-dense" : ""
        }`}>
          {/* Comic Cover */}
          <div className={comic.layout === "cover-right" ? "lg:col-start-2" : ""}>
            <img 
              key={`cover-${currentComic}`}
              src={comic.cover} 
              alt={`${comic.title} comic cover`}
              className="w-full max-w-md mx-auto object-contain rounded-lg shadow-2xl transition-opacity duration-100"
              loading="eager"
            />
          </div>
          
          {/* Comic Info */}
          <div className={`${comic.layout === "cover-right" ? "lg:col-start-1 pl-24 pr-8" : "pr-24 pl-8"} md:pl-24 md:pr-24`}>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h2 className="font-serif text-5xl font-bold text-white mb-6">
                {comic.title}
              </h2>
              <p className="font-serif text-lg text-white leading-relaxed">
                {comic.summary}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="lg"
          onClick={prevComic}
          className="bg-black/60 border-2 border-white/60 text-white hover:bg-black/80 hover:border-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <Button
          variant="outline"
          size="lg"
          onClick={nextComic}
          className="bg-black/60 border-2 border-white/60 text-white hover:bg-black/80 hover:border-white hover:scale-110 transition-all duration-300 rounded-full w-12 h-12 p-0 backdrop-blur-sm shadow-xl"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      {/* Comic Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {featuredComics.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index === currentComic ? 'bg-white' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
};