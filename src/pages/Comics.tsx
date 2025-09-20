import { useState } from "react";
import Navigation from "@/components/Navigation";
import woodenNewsstandStructure from "@/assets/wooden-newsstand-structure.jpg";
import crayonUfoDrawing from "@/assets/crayon-ufo-drawing.png";
import stationeryItems from "@/assets/stationery-items.png";

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <Navigation />
      
      {/* Page Title */}
      <div className="text-center py-8 px-6">
        <h1 className="font-heading text-6xl font-bold text-amber-900 mb-4 drop-shadow-sm">
          Comics Newsstand
        </h1>
        <p className="font-body text-xl text-amber-700">
          Korean style web comics and manga with original stories and characters
        </p>
      </div>

      {/* Main Newsstand Structure - Foreground */}
      <div className="relative pb-16">
        {/* Newsstand Structure Image */}
        <div className="relative mx-auto max-w-6xl">
          <img 
            src={woodenNewsstandStructure}
            alt="Wooden newsstand structure"
            className="w-full h-auto"
          />
          
          {/* Comics positioned on shelves */}
          {/* Top Shelf - God of Lies */}
          <div className="absolute top-[15%] left-[5%] w-[40%] flex items-center">
            <div className="comic-on-shelf">
              <img 
                src={godOfLiesCover}
                alt="God of Lies comic cover"
                className="w-full max-w-xs shadow-2xl transform -rotate-1"
              />
            </div>
          </div>
          
          {/* God of Lies Text */}
          <div className="absolute top-[15%] right-[5%] w-[45%] bg-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-amber-900 mb-4">
              God of Lies
            </h2>
            <p className="font-body text-base text-amber-800 leading-relaxed">
              A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
            </p>
          </div>

          {/* Second Shelf - Surname Pendragon */}
          <div className="absolute top-[35%] right-[5%] w-[40%] flex items-center justify-end">
            <div className="comic-on-shelf">
              <img 
                src={surnameProPendragonCoverNew}
                alt="Surname Pendragon comic cover"
                className="w-full max-w-xs shadow-2xl transform rotate-1"
              />
            </div>
          </div>
          
          {/* Surname Pendragon Text */}
          <div className="absolute top-[35%] left-[5%] w-[45%] bg-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg">
            <h2 className="font-heading text-3xl font-bold text-amber-900 mb-4">
              Surname Pendragon
            </h2>
            <p className="font-body text-base text-amber-800 leading-relaxed">
              A modern retelling of the King Arthur stories set in contemporary times. Follow a young office worker who unknowingly carries the bloodline of the legendary king. As ancient powers awaken in the modern world, he must discover his true heritage and embrace a destiny he never imagined possible.
            </p>
          </div>

          {/* Coming Soon Divider */}
          <div className="absolute top-[55%] left-[10%] right-[10%] text-center">
            <div className="bg-amber-100/90 backdrop-blur-sm rounded-lg py-4 px-6 shadow-md">
              <h3 className="font-heading text-2xl font-bold text-amber-900">
                Coming 2026
              </h3>
            </div>
          </div>

          {/* Third Shelf - First 3 Comics */}
          <div className="absolute top-[65%] left-[8%] right-[8%] flex justify-between items-end">
            {smallShelfComics.slice(0, 3).map((comic, index) => (
              <div 
                key={comic.title}
                className="comic-on-shelf-small cursor-pointer flex-1 max-w-[28%]"
                onClick={() => handleComicClick(comic)}
              >
                <img 
                  src={comic.cover}
                  alt={`${comic.title} comic cover`}
                  className="w-full shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Fourth Shelf - Last 3 Comics */}
          <div className="absolute top-[80%] left-[8%] right-[8%] flex justify-between items-end">
            {smallShelfComics.slice(3, 6).map((comic, index) => (
              <div 
                key={comic.title}
                className="comic-on-shelf-small cursor-pointer flex-1 max-w-[28%]"
                onClick={() => handleComicClick(comic)}
              >
                <img 
                  src={comic.cover}
                  alt={`${comic.title} comic cover`}
                  className="w-full shadow-xl hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>

          {/* Decorative Elements */}
          <img 
            src={crayonUfoDrawing}
            alt=""
            className="absolute top-[25%] right-[15%] w-8 h-8 opacity-60 rotate-12"
          />
          
          <img 
            src={stationeryItems}
            alt=""
            className="absolute top-[48%] left-[20%] w-6 h-6 opacity-50"
          />
          
          <img 
            src={stationeryItems}
            alt=""
            className="absolute top-[72%] right-[25%] w-5 h-5 opacity-40 rotate-45"
          />
        </div>
      </div>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-amber-50 rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8"
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
              <h3 className="font-heading text-4xl font-bold text-amber-900 mb-6">
                {selectedComic.title}
              </h3>
              <p className="font-body text-lg text-amber-800 leading-relaxed">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors self-start"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-amber-800/90 backdrop-blur-sm border-t border-amber-700 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-amber-100">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;