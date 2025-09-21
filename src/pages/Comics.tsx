import { useState } from "react";
import Navigation from "@/components/Navigation";
import woodenDeskBackground from "@/assets/wooden-desk-background.png";

import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-cover-new.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";
import mrMiracleCover from "@/assets/mr-miracle-cover.jpg";
import godsCover from "@/assets/gods-cover.jpg";
import scriptedCover from "@/assets/scripted-cover.jpg";
import orangesGoldCover from "@/assets/oranges-gold-cover.jpg";

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string} | null>(null);

  const smallShelfComics = [
    {
      cover: theBurdenCover,
      title: "The Burden",
      description: "A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care."
    },
    {
      cover: mrMiracleCover,
      title: "Mr. Miracle", 
      description: "A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways."
    },
    {
      cover: soulTiedCover,
      title: "Soul Tied",
      description: "Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul."
    },
    {
      cover: godsCover,
      title: "Gods!",
      description: "Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career."
    },
    {
      cover: scriptedCover,
      title: "Scripted",
      description: "A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching?"
    },
    {
      cover: orangesGoldCover,
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
    <div className="min-h-screen relative">
      {/* Wooden Desk Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${woodenDeskBackground})`
          }}
        />
      </div>
      
      <Navigation />

      <main className="relative z-10 pt-24">
        {/* Page Title */}
        <div className="text-center py-8 px-6">
          <h1 className="font-serif text-6xl font-bold text-white mb-4 tracking-wide">
            Comics
          </h1>
          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20 max-w-4xl mx-auto">
            <p className="font-serif text-lg text-white">
              Korean style web comics and manga with original stories and characters
            </p>
          </div>
        </div>

        {/* Large Top Shelf - God of Lies */}
        <div className="newsstand-shelf-large mb-8 mt-12">
          <div className="container mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
              <div className="relative">
                <div className="comic-on-shelf">
                  <img 
                    src={godOfLiesCover}
                    alt="God of Lies comic cover"
                    className="w-full max-w-md mx-auto shadow-2xl transform -rotate-1"
                  />
                  <div className="comic-shadow" />
                </div>
              </div>
              <div className="lg:pr-12">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h2 className="font-serif text-5xl font-bold text-white mb-6">
                    God of Lies
                  </h2>
                  <p className="font-serif text-lg text-white leading-relaxed">
                    A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Large Second Shelf - Surname Pendragon */}
        <div className="newsstand-shelf-large mb-12">
          <div className="container mx-auto px-6 relative">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[60vh]">
              <div className="lg:order-2 relative">
                <div className="comic-on-shelf">
                  <img 
                    src={surnameProPendragonCoverNew}
                    alt="Surname Pendragon comic cover"
                    className="w-full max-w-md mx-auto shadow-2xl transform rotate-1"
                  />
                  <div className="comic-shadow" />
                </div>
              </div>
              <div className="lg:order-1 lg:pl-12">
                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                  <h2 className="font-serif text-5xl font-bold text-white mb-6">
                    Surname Pendragon
                  </h2>
                  <p className="font-serif text-lg text-white leading-relaxed">
                    A modern retelling of the King Arthur stories set in contemporary times. Follow a young office worker who unknowingly carries the bloodline of the legendary king. As ancient powers awaken in the modern world, he must discover his true heritage and embrace a destiny he never imagined possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Section */}
        <div className="text-center py-8 px-6">
          <div className="flex items-center justify-center gap-6">
            <div className="hand-drawn-line flex-1"></div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg px-8 py-4 border border-white/20">
              <h2 className="hand-drawn-text text-4xl font-bold text-white">
                Coming 2026
              </h2>
            </div>
            <div className="hand-drawn-line flex-1"></div>
          </div>
        </div>

        {/* Smaller Shelves - Two Rows of Three */}
        <div className="container mx-auto px-6 pb-16">
          {/* First Small Shelf */}
          <div className="newsstand-shelf-small mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {smallShelfComics.slice(0, 3).map((comic, index) => (
                <div 
                  key={comic.title}
                  className="comic-on-shelf-small cursor-pointer"
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full max-w-xs shadow-xl transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="comic-shadow-small" />
                </div>
              ))}
            </div>
          </div>

          {/* Second Small Shelf */}
          <div className="newsstand-shelf-small">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
              {smallShelfComics.slice(3, 6).map((comic, index) => (
                <div 
                  key={comic.title}
                  className="comic-on-shelf-small cursor-pointer"
                  onClick={() => handleComicClick(comic)}
                >
                  <img 
                    src={comic.cover}
                    alt={`${comic.title} comic cover`}
                    className="w-full max-w-xs shadow-xl transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="comic-shadow-small" />
                </div>
              ))}
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
            className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border border-white/20"
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
              <h3 className="font-serif text-4xl font-bold text-white mb-6">
                {selectedComic.title}
              </h3>
              <p className="font-serif text-lg text-white leading-relaxed">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold hover:bg-white/30 transition-colors self-start border border-white/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-white">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;