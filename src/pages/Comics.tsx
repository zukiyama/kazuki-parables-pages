import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import godOfLiesCover from "@/assets/god-of-lies-wide-cover.png";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-wide-cover.png";
import mangaSketchesBackground from "@/assets/manga-character-sketches-background.jpeg";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);

  const smallShelfComics = [
    {
      cover: burdenCoverNew,
      title: "The Burden",
      description: "A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.",
      teaser: "Family duty weighs heavier than expected burdens."
    },
    {
      cover: mrMiracleCoverNew,
      title: "Mr. Miracle", 
      description: "A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways.",
      teaser: "Sometimes the most ordinary man holds extraordinary secrets."
    },
    {
      cover: soulTiedCover,
      title: "Soul Tied",
      description: "Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.",
      teaser: "Destiny binds two souls in chaos and control."
    },
    {
      cover: godsCover,
      title: "Gods!",
      description: "Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career.",
      teaser: "When gods need saving, who do you call?"
    },
    {
      cover: scriptedCover,
      title: "Scripted",
      description: "A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching?",
      teaser: "Reality blurs when every life feels like a performance."
    },
    {
      cover: orangesGoldCoverNew,
      title: "Oranges are Made of Gold",
      description: "A 99-year-old Korean CEO controls a vast orange empire built on rare oranges that grow only on Jeju Island. Instead of naming an heir, he forces his two sons to compete - whoever makes the most profit in one year inherits everything. A tale spanning generations, exploring family legacy, competition, and the price of empire.",
      teaser: "In Jeju's orchards, family rivalry grows sweeter than gold."
    }
  ];

  const handleComicClick = (comic: {cover: string; title: string; description: string; teaser?: string}) => {
    setSelectedComic(comic);
  };

  const handleCloseModal = () => {
    setSelectedComic(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Manga Sketches Background */}
      <div className="fixed top-0 left-0 pointer-events-none" style={{ height: '100vh', width: '100vw' }}>
        <div 
          className="w-full h-full bg-cover bg-top opacity-60"
          style={{ 
            backgroundImage: `url(${mangaSketchesBackground})`,
            height: '100vh',
            width: '100vw'
          }}
        />
      </div>
      
      <Navigation />

      <main className="relative z-10 pt-24">
        {/* Comic Panel Title - Simplified */}
        <div className="flex justify-center py-12 px-6">
          <div className="text-center">
            <h1 className="font-serif text-6xl font-bold text-black mb-4 tracking-wide drop-shadow-lg">
              Comics & Scripts
            </h1>
            <p className="font-serif text-xl text-amber-800 leading-relaxed drop-shadow-md">
              Comics, webtoons, manga and scripts with original characters and stories
            </p>
          </div>
        </div>

        {/* Featured Comics Section */}
        <div className="container mx-auto px-6 mt-4 mb-16">
          {/* God of Lies - Wide Cover Left, Script Right */}
          <div className="mb-16">
            <div className="max-w-7xl mx-auto px-16 max-sm:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center max-sm:gap-4">
                <div className="lg:col-span-3 max-sm:order-1">
                  <img 
                    src={godOfLiesCover}
                    alt="God of Lies comic cover"
                    className="w-full object-contain shadow-2xl"
                  />
                </div>
                <div className="lg:col-span-1 max-sm:order-2">
                  <div style={{ fontFamily: 'Bangers, cursive' }}>
                    <h3 className="text-3xl text-white uppercase tracking-wider mb-4 max-sm:text-2xl text-center drop-shadow-lg">
                      GOD OF LIES
                    </h3>
                    
                    <p className="text-lg text-white leading-relaxed mb-3 max-sm:text-base drop-shadow-md" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.5px' }}>
                      A con man discovers that a demon has attached itself to his soul—making every lie he tells become reality.
                    </p>
                    
                    <p className="text-lg text-white leading-relaxed max-sm:text-base drop-shadow-md" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.5px' }}>
                      A psychological thriller exploring the price of dishonesty, where deception becomes truth and reality dissolves into fiction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Surname Pendragon - Script Left, Cover Right */}
          <div className="mb-24">
            <div className="max-w-7xl mx-auto px-16 max-sm:px-4">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center max-sm:gap-4 max-sm:flex max-sm:flex-col">
                <div className="lg:col-span-3 max-sm:order-2">
                  <div className="bg-white shadow-lg border border-gray-300 p-8 max-sm:p-4" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                    {/* Script header */}
                    <div className="text-center border-b border-gray-400 pb-4 mb-4">
                      <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Original Script</p>
                      <h3 className="text-3xl font-bold text-black uppercase tracking-wide max-sm:text-xl">
                        SURNAME PENDRAGON
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">Written by Kazuki Yamakawa</p>
                    </div>
                    
                    {/* Scene heading */}
                    <p className="text-sm font-bold text-black uppercase mb-3">
                      FADE IN:
                    </p>
                    
                    <p className="text-sm font-bold text-black uppercase mb-2">
                      INT. OFFICE BUILDING - DAY
                    </p>
                    
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Fluorescent lights hum. ARTHUR PENN (28), unremarkable in every way, stares at spreadsheets. He doesn't know what's coming.
                    </p>
                    
                    {/* Character dialogue */}
                    <p className="text-center text-sm font-bold text-black uppercase mb-1">
                      MYSTERIOUS VOICE (V.O.)
                    </p>
                    <p className="text-center text-sm text-gray-700 italic mb-4 px-8">
                      The sword chooses. The blood remembers.
                    </p>
                    
                    <p className="text-sm font-bold text-black uppercase mb-2">
                      EXT. LONDON STREETS - CONTINUOUS
                    </p>
                    
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      Arthur walks home. The city pulses around him—but something ancient stirs beneath the concrete. A SWORD materializes in his path, embedded in stone.
                    </p>
                    
                    <p className="text-center text-sm font-bold text-black uppercase mb-1">
                      ARTHUR
                    </p>
                    <p className="text-center text-sm text-gray-700 italic mb-4 px-8">
                      This can't be happening...
                    </p>
                    
                    {/* Final action line */}
                    <p className="text-sm text-gray-700 leading-relaxed border-t border-gray-300 pt-4 mt-4">
                      A modern retelling where mythical beings walk among us. Where an ordinary man discovers an extraordinary destiny. Where the fate of both realms hangs in the balance.
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-2 flex items-center justify-center max-sm:order-1">
                  <img 
                    src={surnameProPendragonCoverNew}
                    alt="Surname Pendragon comic cover"
                    className="w-full object-contain shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forthcoming Section */}
        <div className="container mx-auto px-6 pb-16">
          {/* FORTHCOMING Title with decorative lines */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-800"></div>
            <h2 className="font-serif text-4xl font-bold text-black mx-8 drop-shadow-lg">
              FORTHCOMING
            </h2>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-800"></div>
          </div>
          
          {/* First Row */}
          <div className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {smallShelfComics.slice(0, 3).map((comic, index) => (
                <ScrollFadeUp key={comic.title} id={`comic-${index}`} delay={index * 200}>
                  <div 
                    className="cursor-pointer group text-center"
                    onClick={() => handleComicClick(comic)}
                  >
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} comic cover`}
                      className="w-full max-w-xs shadow-xl transform hover:scale-105 transition-transform duration-300 mb-3"
                      loading="lazy"
                    />
                    <p className="font-serif text-base text-amber-800 italic max-w-xs">
                      {comic.teaser}
                    </p>
                  </div>
                </ScrollFadeUp>
              ))}
            </div>
          </div>

          {/* Second Row */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
              {smallShelfComics.slice(3, 6).map((comic, index) => (
                <ScrollFadeUp key={comic.title} id={`comic-${index + 3}`} delay={(index + 3) * 200}>
                  <div 
                    className="cursor-pointer group text-center"
                    onClick={() => handleComicClick(comic)}
                  >
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} comic cover`}
                      className="w-full max-w-xs shadow-xl transform hover:scale-105 transition-transform duration-300 mb-3"
                      loading="lazy"
                    />
                    <p className="font-serif text-base text-amber-800 italic max-w-xs">
                      {comic.teaser}
                    </p>
                  </div>
                </ScrollFadeUp>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 max-sm:p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border border-gray-200 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-sm:max-h-[40vh]">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-lg shadow-2xl max-sm:max-h-full max-sm:object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-4xl font-bold text-black mb-6 max-sm:text-2xl max-sm:mb-3">
                {selectedComic.title}
              </h3>
              <p className="font-serif text-lg text-amber-800 leading-relaxed max-sm:text-sm">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors self-start max-sm:mt-4 max-sm:w-full max-sm:py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-white">
            kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;