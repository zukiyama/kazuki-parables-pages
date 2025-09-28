import { useState } from "react";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import godOfLiesCover from "@/assets/god-of-lies-wide-cover.png";
import mangaSketchesBackground from "@/assets/manga-character-sketches-background.jpeg";
import surnameProPendragonCover from "@/assets/surname-pendragon-cover-updated.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import spaceIdolCover from "@/assets/space-idol-cover.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCover from "@/assets/oranges-gold-cover.jpg";

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string} | null>(null);

  const otherComics = [
    {
      cover: surnameProPendragonCover,
      title: "Surname Pendragon",
      description: "A modern retelling of the King Arthur stories set in contemporary times. Follow a young office worker who unknowingly carries the bloodline of the legendary king. As ancient powers awaken in the modern world, he must discover his true heritage and embrace a destiny he never imagined possible. When Merlin's ancient magic begins to surface in corporate boardrooms and mystical creatures emerge from London's underground, Arthur must navigate both office politics and otherworldly threats while learning to wield Excalibur in a world of smartphones and social media.",
      size: "small",
      layout: "image-right"
    },
    {
      cover: burdenCoverNew,
      title: "The Burden",
      description: "A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care. The narrative weaves through decades of shared experiences, from childhood bedtime stories to adult role reversals, examining how love can become both a blessing and a burden. Set against the backdrop of a changing neighborhood, this intimate tale reveals the profound connections that bind us across generations.",
      size: "medium",
      layout: "image-left"
    },
    {
      cover: mrMiracleCoverNew,
      title: "Mr. Miracle", 
      description: "A mysterious 40-year-old man moves into a tight-knit neighborhood where everyone knows everyone's business. Unmarried and with no known background, he becomes the subject of intense gossip among the local ladies. But as the community slowly gets to know him, perceptions begin to change in unexpected ways. His quiet acts of kindness - fixing Mrs. Chen's garden gate, helping the Johnsons' teenager with math, walking elderly dogs during rainstorms - gradually reveal a man running from a past that threatens to catch up with him. As secrets unravel and hearts open, the neighborhood discovers that sometimes the most ordinary miracles are the most extraordinary.",
      size: "large",
      layout: "image-top"
    },
    {
      cover: soulTiedCover,
      title: "Soul Tied",
      description: "Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul. Kai lives recklessly, making spontaneous decisions that ripple through dimensions, while Hiroshi meticulously plans every moment, trying to contain the cosmic chaos his counterpart creates. When their parallel lives begin to merge across realities, they must learn that true connection requires both surrender and strength, chaos and order.",
      size: "small",
      layout: "text-below"
    },
    {
      cover: spaceIdolCover,
      title: "Space Idol",
      description: "Set on a cosmic space station where idol-gods from different galaxies meet for a rare cosmic gathering. When disaster strikes and invasion threatens, a cynical female security officer who despises space idols and their fanatic followers must protect the very beings she can't stand. It's the worst day of her career. Commander Zara never believed in the mystical power of galactic pop stars until alien forces specifically target the station during the Celestial Concert Festival. Now she must navigate screaming fans, temperamental deities who communicate only in song, and an invasion force that feeds on musical energy. Her only hope is learning to work with the very idols she's spent years avoiding.",
      size: "medium",
      layout: "image-right"
    },
    {
      cover: scriptedCover,
      title: "Scripted",
      description: "A group of actors keep being reincarnated in different shows as different characters with no memory of their past roles. But relationships from previous shows start bleeding through. When they seek help to uncover their past lives, they begin to question reality itself. Are they actors? Or is being actors just another script? And if so... who's watching? Sarah remembers loving someone in a period drama, but can't recall his face. Marcus feels inexplicably protective of a woman he's never met. As the cast of 'Suburban Secrets' experiences déjà vu and impossible emotions, they discover their off-camera lives might be the most carefully scripted performance of all.",
      size: "large",
      layout: "image-left"
    },
    {
      cover: orangesGoldCover,
      title: "Oranges are Made of Gold",
      description: "A 99-year-old Korean CEO controls a vast orange empire built on rare oranges that grow only on Jeju Island. Instead of naming an heir, he forces his two sons to compete - whoever makes the most profit in one year inherits everything. A tale spanning generations, exploring family legacy, competition, and the price of empire. Min-jun relies on traditional farming methods and family connections, while his brother Woo-jin embraces modern technology and global markets. But as the year progresses, they discover their father's true test isn't about oranges or profit—it's about understanding the difference between inheriting wealth and earning wisdom.",
      size: "medium",
      layout: "text-below"
    }
  ];

  const handleComicClick = (comic: {cover: string; title: string; description: string; size?: string; layout?: string}) => {
    setSelectedComic(comic);
  };

  const handleCloseModal = () => {
    setSelectedComic(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* Manga Sketches Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="w-full h-full bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: `url(${mangaSketchesBackground})`
          }}
        />
      </div>
      
      <Navigation />

      <main className="relative z-10 pt-24">
        {/* Comic Panel Title - Simplified */}
        <div className="flex justify-center py-32 px-6">
          <div className="text-center">
            <h1 className="font-serif text-6xl font-bold text-black mb-4 tracking-wide drop-shadow-lg">
              COMICS
            </h1>
            <p className="font-serif text-xl text-amber-800 leading-relaxed drop-shadow-md">
              Korean style web comics and manga with original stories and characters!
            </p>
          </div>
        </div>

        {/* Featured Comics Section */}
        <div className="container mx-auto px-6 mt-12 mb-16">
          {/* God of Lies - Wide Cover Left, Summary Right */}
          <div className="mb-16">
            <div className="max-w-7xl mx-auto px-16">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-center">
                <div className="lg:col-span-3">
                  <img 
                    src={godOfLiesCover}
                    alt="God of Lies comic cover"
                    className="w-full object-contain shadow-2xl"
                  />
                </div>
                <div className="lg:col-span-1">
                  <div className="w-full">
                    <h3 className="font-serif text-4xl font-bold text-black mb-6">
                      God of Lies
                    </h3>
                    <p className="font-serif text-lg text-amber-800 leading-relaxed">
                      A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Newspaper Style Comics Layout */}
        <div className="container mx-auto px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            {/* Newspaper-style layout with varied arrangements */}
            <div className="space-y-6">
              {otherComics.map((comic, index) => {
                if (comic.layout === "image-left") {
                  return (
                    <ScrollFadeUp key={comic.title} id={`comic-${index}`} delay={index * 100}>
                      <div className="mb-8 flex gap-4 items-start">
                        <div className={`flex-shrink-0 ${comic.size === 'small' ? 'w-32' : comic.size === 'medium' ? 'w-48' : 'w-64'}`}>
                          <img 
                            src={comic.cover}
                            alt={`${comic.title} comic cover`}
                            className="w-full cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300"
                            onClick={() => handleComicClick(comic)}
                          />
                        </div>
                        <div className="flex-1 ml-4">
                          <h3 className="font-serif text-xl font-bold text-black mb-2">
                            {comic.title}
                          </h3>
                          <p className="font-serif text-sm text-amber-800 leading-relaxed">
                            {comic.description}
                          </p>
                        </div>
                      </div>
                    </ScrollFadeUp>
                  );
                } else if (comic.layout === "image-right") {
                  return (
                    <ScrollFadeUp key={comic.title} id={`comic-${index}`} delay={index * 100}>
                      <div className="mb-8 flex gap-4 items-start">
                        <div className="flex-1 mr-4">
                          <h3 className="font-serif text-xl font-bold text-black mb-2">
                            {comic.title}
                          </h3>
                          <p className="font-serif text-sm text-amber-800 leading-relaxed">
                            {comic.description}
                          </p>
                        </div>
                        <div className={`flex-shrink-0 ${comic.size === 'small' ? 'w-32' : comic.size === 'medium' ? 'w-48' : 'w-64'}`}>
                          <img 
                            src={comic.cover}
                            alt={`${comic.title} comic cover`}
                            className="w-full cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300"
                            onClick={() => handleComicClick(comic)}
                          />
                        </div>
                      </div>
                    </ScrollFadeUp>
                  );
                } else if (comic.layout === "image-top") {
                  return (
                    <ScrollFadeUp key={comic.title} id={`comic-${index}`} delay={index * 100}>
                      <div className="mb-8">
                        <div className="flex justify-center mb-4">
                          <img 
                            src={comic.cover}
                            alt={`${comic.title} comic cover`}
                            className={`${comic.size === 'small' ? 'w-32' : comic.size === 'medium' ? 'w-48' : 'w-64'} cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300`}
                            onClick={() => handleComicClick(comic)}
                          />
                        </div>
                        <h3 className="font-serif text-xl font-bold text-black mb-2 text-center">
                          {comic.title}
                        </h3>
                        <p className="font-serif text-sm text-amber-800 leading-relaxed text-justify">
                          {comic.description}
                        </p>
                      </div>
                    </ScrollFadeUp>
                  );
                } else {
                  // text-below layout
                  return (
                    <ScrollFadeUp key={comic.title} id={`comic-${index}`} delay={index * 100}>
                      <div className="mb-8">
                        <h3 className="font-serif text-xl font-bold text-black mb-2">
                          {comic.title}
                        </h3>
                        <div className="flex gap-4 items-start">
                          <div className={`flex-shrink-0 ${comic.size === 'small' ? 'w-32' : comic.size === 'medium' ? 'w-48' : 'w-64'}`}>
                            <img 
                              src={comic.cover}
                              alt={`${comic.title} comic cover`}
                              className="w-full cursor-pointer shadow-lg transform hover:scale-105 transition-transform duration-300"
                              onClick={() => handleComicClick(comic)}
                            />
                          </div>
                          <div className="flex-1 ml-4">
                            <p className="font-serif text-sm text-amber-800 leading-relaxed">
                              {comic.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </ScrollFadeUp>
                  );
                }
              })}
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
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-lg shadow-2xl"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-4xl font-bold text-black mb-6">
                {selectedComic.title}
              </h3>
              <p className="font-serif text-lg text-amber-800 leading-relaxed">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="mt-6 px-6 py-3 bg-amber-800 text-white rounded-lg font-semibold hover:bg-amber-900 transition-colors self-start"
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