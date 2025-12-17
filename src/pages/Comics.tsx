import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-wide-cover.png";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const Comics = () => {
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const rowId = entry.target.getAttribute('data-row');
            if (rowId) {
              setVisibleRows((prev) => new Set(prev).add(rowId));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    if (row1Ref.current) observer.observe(row1Ref.current);
    if (row2Ref.current) observer.observe(row2Ref.current);

    return () => observer.disconnect();
  }, []);

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
    <div className="min-h-screen bg-[#f5f0e6]">
      <Navigation />

      <main className="relative z-10 pt-20">
        {/* Magazine Masthead */}
        <header className="text-center px-4 mb-6">
          <div className="max-w-4xl mx-auto">
            {/* Main Title - Tintin Style */}
            <div className="bg-[#4a9ec9] py-3 px-6 rounded-sm shadow-md mb-2">
              <h1 
                className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#f5e6a3] tracking-wide"
                style={{ 
                  fontFamily: 'Boogaloo, cursive',
                  textShadow: '2px 2px 0 #2d6a8a, -1px -1px 0 #2d6a8a'
                }}
              >
                COMICS AND SCRIPTS
              </h1>
            </div>
            
            {/* Subtitle */}
            <div className="flex items-center justify-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-400 max-w-16" />
              <p className="text-xs sm:text-sm text-slate-700 tracking-widest uppercase">
                Original Stories in Sequential Art & Screenplay
              </p>
              <span className="text-xs text-slate-500">No. 1</span>
              <div className="flex-1 h-px bg-slate-400 max-w-16" />
            </div>
          </div>
        </header>

        {/* Main Magazine Content */}
        <div className="px-3 sm:px-4 lg:px-6">
          <div className="max-w-5xl mx-auto">
            
            {/* GOD OF LIES - Main Feature Section */}
            <section className="mb-4 relative">
              <div className="relative w-full overflow-hidden rounded-sm shadow-xl">
                {/* Background Image - Expanded */}
                <img 
                  src={godOfLiesCover}
                  alt="God of Lies"
                  className="w-full h-auto object-cover"
                  style={{ minHeight: '500px', objectPosition: 'center' }}
                />
                
                {/* Overlay Content - Positioned on the image */}
                <div className="absolute inset-0 flex">
                  {/* Left Side - Title and Text */}
                  <div className="w-1/2 sm:w-2/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
                    {/* Large Title */}
                    <h2 
                      className="text-4xl sm:text-6xl lg:text-7xl font-bold text-[#d4a84b] leading-none mb-4"
                      style={{ 
                        fontFamily: 'Boogaloo, cursive',
                        textShadow: '3px 3px 0 #1a1a1a, -1px -1px 0 #1a1a1a, 1px -1px 0 #1a1a1a, -1px 1px 0 #1a1a1a'
                      }}
                    >
                      GOD<br/>OF<br/>LIES
                    </h2>
                    
                    {/* Text Box */}
                    <div className="bg-[#f5f0e6]/95 p-3 sm:p-4 rounded-sm shadow-lg max-w-xs">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        Be careful who you trust...
                      </p>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed mb-2">
                        Dissatisfied with life, Seo Jun finds the mundane world quickly spiraling out of control when he enters into a perilous deal with a demonic god of lies who now lives in his shadow. A gripping dark urban fantasy with mystery, danger, and betrayal.
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                          Special Preview!
                        </span>
                        <span className="text-amber-600">→</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Webtoon Badge */}
                  <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6">
                    <div className="bg-red-700 text-white px-3 py-2 rounded-sm shadow-lg transform rotate-3">
                      <span className="text-xs font-bold tracking-wider">WEBTOON</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SURNAME PENDRAGON - Secondary Feature */}
            <section className="mb-8 relative">
              <div className="relative w-full overflow-hidden rounded-sm shadow-xl">
                {/* Background Image */}
                <img 
                  src={surnameProPendragonCoverNew}
                  alt="Surname Pendragon"
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '400px', objectPosition: 'center top' }}
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 flex">
                  {/* Left Side - Title and Text */}
                  <div className="w-3/5 sm:w-1/2 p-4 sm:p-6 flex flex-col justify-start pt-6 sm:pt-8">
                    {/* Title */}
                    <h2 
                      className="text-2xl sm:text-4xl lg:text-5xl font-bold text-[#d4a84b] leading-tight mb-3"
                      style={{ 
                        fontFamily: 'Boogaloo, cursive',
                        textShadow: '2px 2px 0 #1a1a1a, -1px -1px 0 #1a1a1a'
                      }}
                    >
                      SURNAME<br/>PENDRAGON
                    </h2>
                    
                    {/* Text Box */}
                    <div className="bg-[#f5f0e6]/95 p-3 rounded-sm shadow-lg max-w-sm">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                        An Epic Modern Fantasy...
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Arthur Penn, an unremarkable office worker drowning in spreadsheets, finds his mundane existence shattered when he encounters a sword embedded in stone on a London street. The blood of kings flows through his veins.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stories Waiting to be Told Section */}
            <section className="text-center py-8 sm:py-12">
              <ScrollScale 
                initialScale={1.1} 
                finalScale={1} 
                initialBlur={2}
                className="text-center"
              >
                <h2 
                  className="text-2xl sm:text-4xl lg:text-5xl text-slate-800 italic mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  "Stories waiting to be told..."
                </h2>
                <div className="w-20 h-1 bg-amber-700 mx-auto rounded-full" />
              </ScrollScale>
            </section>

            {/* Forthcoming Comics Grid */}
            <section className="pb-12">
              {/* First Row */}
              <div 
                ref={row1Ref}
                data-row="row1"
                className={`mb-6 transition-all duration-700 ${
                  visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
                  {smallShelfComics.slice(0, 3).map((comic, index) => (
                    <div 
                      key={comic.title} 
                      className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded overflow-hidden ${
                        visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: visibleRows.has('row1') ? `${index * 150}ms` : '0ms' }}
                      onClick={() => handleComicClick(comic)}
                    >
                      <img 
                        src={comic.cover}
                        alt={`${comic.title} comic cover`}
                        className="w-full shadow-lg"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Row */}
              <div
                ref={row2Ref}
                data-row="row2"
                className={`transition-all duration-700 ${
                  visibleRows.has('row2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 max-w-4xl mx-auto">
                  {smallShelfComics.slice(3, 6).map((comic, index) => (
                    <div 
                      key={comic.title} 
                      className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded overflow-hidden ${
                        visibleRows.has('row2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: visibleRows.has('row2') ? `${index * 150}ms` : '0ms' }}
                      onClick={() => handleComicClick(comic)}
                    >
                      <img 
                        src={comic.cover}
                        alt={`${comic.title} comic cover`}
                        className="w-full shadow-lg"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <footer className="bg-slate-900 py-10 max-sm:py-6">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-xl mb-3 text-white">Contact</h3>
          <p className="font-serif text-slate-300 text-sm">
            kazuki@kazukiyamakawa.com
          </p>
        </div>
      </footer>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 max-sm:p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-sm:max-h-[40vh]">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-md shadow-2xl rounded-lg max-sm:max-h-full max-sm:object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 
                className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 max-sm:text-xl"
                style={{ fontFamily: 'Boogaloo, cursive' }}
              >
                {selectedComic.title}
              </h3>
              <p className="font-serif text-sm md:text-base text-slate-700 leading-relaxed mb-4 max-sm:text-sm">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="self-start px-5 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comics;