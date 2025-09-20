import { useState } from "react";
import Navigation from "@/components/Navigation";
import woodenNewsstandImg from "@/assets/wooden-newsstand-professional.jpg";
import crayonUfoImg from "@/assets/crayon-ufo-drawing.png";
import stationeryImg from "@/assets/stationery-items.png";

import godOfLiesImg from "@/assets/god-of-lies-cover.jpg";
import surnamePendragonImg from "@/assets/surname-pendragon-cover-new.jpg";
import theBurdenImg from "@/assets/the-burden-cover.jpg";
import mrMiracleImg from "@/assets/mr-miracle-cover.jpg";
import soulTiedImg from "@/assets/soul-tied-cover.jpg";
import godsImg from "@/assets/gods-cover.jpg";
import scriptedImg from "@/assets/scripted-cover.jpg";
import orangesImg from "@/assets/oranges-gold-cover.jpg";

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string} | null>(null);

  const smallShelfComics = [
    {
      cover: theBurdenImg,
      title: "The Burden",
      description: "A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care."
    },
    {
      cover: mrMiracleImg,
      title: "Mr. Miracle", 
      description: "A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways."
    },
    {
      cover: soulTiedImg,
      title: "Soul Tied",
      description: "Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul."
    },
    {
      cover: godsImg,
      title: "Gods!",
      description: "Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career."
    },
    {
      cover: scriptedImg,
      title: "Scripted",
      description: "A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching?"
    },
    {
      cover: orangesImg,
      title: "Oranges are Made of Gold",
      description: "A 99-year-old Korean CEO controls a vast orange empire built on rare oranges that grow only on Jeju Island. Instead of naming an heir, he forces his two sons to compete - whoever makes the most profit in one year inherits everything. A tale spanning generations, exploring family legacy, competition, and the price of empire."
    }
  ];

  const handleComicClick = (comic: {cover: string; title: string; description: string}) => {
    setSelectedComic(comic);
  };

  const handleCloseModal = () => {
    setSelectedComic(null);
  };

  return (
    <div className="min-h-screen bg-canvas-base">
      <Navigation />
      
      <main className="relative">
        {/* Page Title */}
        <div className="text-center py-12 px-6 relative z-10">
          <h1 className="font-heading text-6xl font-bold text-ink-primary mb-4">
            Comics Newsstand
          </h1>
          <p className="font-body text-xl text-ink-secondary">
            Korean style web comics and manga with original stories and characters
          </p>
        </div>

        {/* Wooden Newsstand Structure with Comics */}
        <div className="relative max-w-7xl mx-auto px-6">
          {/* Main newsstand image */}
          <div className="relative">
            <img 
              src={woodenNewsstandImg}
              alt="Wooden newsstand structure"
              className="w-full h-auto"
            />
            
            {/* Top Shelf - God of Lies */}
            <div className="absolute top-[8%] left-[15%] w-[30%] flex items-center">
              <div className="relative flex-shrink-0 mr-6">
                <img 
                  src={godOfLiesImg}
                  alt="God of Lies comic cover"
                  className="w-full max-w-[200px] shadow-lg rounded-sm transform hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="bg-canvas-base/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-neutral-200">
                <h2 className="font-heading text-2xl font-bold text-ink-primary mb-2">
                  God of Lies
                </h2>
                <p className="font-body text-sm text-ink-secondary leading-relaxed">
                  A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality.
                </p>
              </div>
            </div>

            {/* Second Shelf - Surname Pendragon */}
            <div className="absolute top-[28%] right-[15%] w-[30%] flex items-center">
              <div className="bg-canvas-base/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-neutral-200 mr-6">
                <h2 className="font-heading text-2xl font-bold text-ink-primary mb-2">
                  Surname Pendragon
                </h2>
                <p className="font-body text-sm text-ink-secondary leading-relaxed">
                  A modern retelling of the King Arthur stories set in contemporary times.
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <img 
                  src={surnamePendragonImg}
                  alt="Surname Pendragon comic cover"
                  className="w-full max-w-[200px] shadow-lg rounded-sm transform hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Third Shelf - First three comics */}
            <div className="absolute top-[48%] left-[12%] w-[76%] flex justify-between items-end">
              {smallShelfComics.slice(0, 3).map((comic, index) => (
                <div 
                  key={comic.title}
                  className="relative cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full max-w-[180px] shadow-lg rounded-sm"
                  />
                </div>
              ))}
            </div>

            {/* Fourth Shelf - Last three comics */}
            <div className="absolute top-[68%] left-[12%] w-[76%] flex justify-between items-end">
              {smallShelfComics.slice(3, 6).map((comic, index) => (
                <div 
                  key={comic.title}
                  className="relative cursor-pointer transform hover:scale-105 transition-transform duration-300"
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full max-w-[180px] shadow-lg rounded-sm"
                  />
                </div>
              ))}
            </div>

            {/* Decorative Elements on Shelves */}
            <img 
              src={crayonUfoImg}
              alt=""
              className="absolute top-[42%] right-[20%] w-12 h-12 opacity-70"
            />
            
            <img 
              src={stationeryImg}
              alt=""
              className="absolute top-[62%] left-[25%] w-10 h-10 opacity-60"
            />
            
            <img 
              src={stationeryImg}
              alt=""
              className="absolute top-[38%] left-[60%] w-8 h-8 opacity-50"
            />
          </div>

          {/* Coming Soon Section */}
          <div className="text-center py-12 px-6">
            <div className="flex items-center justify-center gap-6">
              <div className="hand-drawn-line flex-1"></div>
              <h2 className="hand-drawn-text text-4xl font-bold text-ink-primary">
                Coming 2026
              </h2>
              <div className="hand-drawn-line flex-1"></div>
            </div>
          </div>
        </div>
      </main>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-canvas-base rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-lg shadow-2xl rounded-xl"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-heading text-4xl font-bold text-ink-primary mb-6">
                {selectedComic.title}
              </h3>
              <p className="font-body text-lg text-ink-secondary leading-relaxed">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors self-start"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-muted border-t border-border py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;