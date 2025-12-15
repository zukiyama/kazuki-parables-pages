import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-wide-cover.png";
import mangaSketchesBackground from "@/assets/manga-character-sketches-background.jpeg";
import soulTiedCover from "@/assets/soul-tied-cover-new.jpeg";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import godsCover from "@/assets/gods-cover-new.png";
import scriptedCover from "@/assets/scripted-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const Comics = () => {
  // Preload God of Lies cover to prevent layout shift
  useImagePreloader({ images: [godOfLiesCover], priority: true });
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [hasZoomed, setHasZoomed] = useState(false);
  const [pendragonVisible, setPendragonVisible] = useState(false);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const pendragonRef = useRef<HTMLDivElement>(null);

  // One-way background zoom effect on initial scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasZoomed && window.scrollY > 50) {
        setHasZoomed(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasZoomed]);

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

  // Pendragon section slide-in observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setPendragonVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (pendragonRef.current) observer.observe(pendragonRef.current);

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
    <div className="min-h-screen relative">
      {/* Manga Sketches Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 pointer-events-none transition-transform duration-700 ease-out"
        style={{ 
          backgroundImage: `url(${mangaSketchesBackground})`,
          transform: hasZoomed ? 'scale(1.02)' : 'scale(1)'
        }}
      />
      
      <Navigation />

      <main className="relative z-10 pt-40 pb-20">
        {/* Title Section */}
        <section className="text-center px-6 mb-16 max-sm:mb-6">
          <h1 className="font-serif text-6xl md:text-7xl font-bold text-black mb-4 tracking-wide drop-shadow-lg">
            Comics & Scripts
          </h1>
          <p className="font-serif text-xl md:text-2xl text-amber-800 leading-relaxed drop-shadow-md max-w-2xl mx-auto">
            Original comics, manga, webtoons and scripts
          </p>
        </section>

        {/* God of Lies Section */}
        <section className="py-12 md:py-16 px-6 max-sm:px-0">
          <div className="container mx-auto max-w-7xl max-sm:px-0">
            {/* Mobile: Full-width banner image above text - reserve space with min-height */}
            <div className="hidden max-sm:block mb-6 min-h-[200px]">
              <img 
                src={godOfLiesCover}
                alt="God of Lies comic cover"
                className="w-full object-contain"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center max-sm:px-6">
              {/* Cover Image - Desktop only - overflow-hidden clips rotated edges, rotate-1 mirrors Pendragon's rotation */}
              <div className="lg:col-span-3 max-sm:hidden overflow-hidden rounded-sm shadow-2xl" style={{ aspectRatio: '1200/675' }}>
                <img 
                  src={godOfLiesCover}
                  alt="God of Lies comic cover"
                  className="w-full h-full object-contain transform rotate-1 scale-[1.02]"
                />
              </div>
              
              {/* Text Panel */}
              <div className="lg:col-span-2">
                <div style={{ fontFamily: 'Bangers, cursive' }}>
                  <h3 className="text-5xl md:text-6xl text-black uppercase tracking-wider mb-6 drop-shadow-lg max-sm:text-center">
                    GOD OF LIES
                  </h3>
                  
                  <p className="text-lg md:text-xl text-black leading-relaxed mb-4" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.5px' }}>
                    A con man discovers that a demon has attached itself to his soul—making every lie he tells become reality.
                  </p>
                  
                  <p className="text-lg md:text-xl text-black leading-relaxed" style={{ fontFamily: 'Bangers, cursive', letterSpacing: '0.5px' }}>
                    A psychological thriller exploring the price of dishonesty, where deception becomes truth and reality dissolves into fiction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pull Quote Section - KEPT */}
        <section className="relative py-10 md:py-16 overflow-hidden">
          <div className="container mx-auto px-6">
            <ScrollScale 
              initialScale={1.15} 
              finalScale={1} 
              initialBlur={3}
              className="text-center"
            >
              <blockquote className="font-serif text-3xl md:text-5xl lg:text-6xl text-black/80 italic leading-tight max-w-4xl mx-auto">
                "Stories waiting to be told..."
              </blockquote>
              <div className="mt-6 w-24 h-1 bg-amber-800 mx-auto rounded-full" />
            </ScrollScale>
          </div>
        </section>

        {/* Surname Pendragon Section */}
        <section className="py-8 md:py-12 px-6 max-[480px]:px-0 overflow-hidden">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              {/* Script Panel - Left side on desktop */}
              <div 
                ref={pendragonRef}
                className={`lg:col-span-3 order-2 lg:order-1 transition-all duration-700 ease-out ${
                  pendragonVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}
              >
                <div 
                  className="bg-white shadow-xl border border-gray-200 p-6 md:p-8 rounded-lg max-sm:max-w-[85vw] max-sm:mx-auto max-[480px]:max-w-full max-[480px]:rounded-none max-[480px]:border-x-0" 
                  style={{ fontFamily: 'Courier New, Courier, monospace' }}
                >
                  {/* Script header */}
                  <div className="text-center border-b border-gray-400 pb-4 mb-4">
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Original Script</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-black uppercase tracking-wide">
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
              
              {/* Cover Image - Right side on desktop */}
              <div className="lg:col-span-2 flex items-center justify-center order-1 lg:order-2">
                <img 
                  src={surnameProPendragonCoverNew}
                  alt="Surname Pendragon comic cover"
                  className="w-full max-w-md object-contain shadow-2xl rounded-sm transform rotate-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Forthcoming Section */}
        <section className="pt-16 pb-8 md:pt-24 md:pb-12 px-6">
          <div className="container mx-auto">
            {/* FORTHCOMING Title with decorative lines */}
            <div className="flex items-center justify-center mb-20">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-800 max-w-xs max-sm:max-w-[60px] max-[480px]:max-w-[30px]"></div>
              <h2 className="font-bangers text-5xl md:text-6xl max-sm:text-3xl text-black mx-8 max-sm:mx-4 max-[480px]:mx-2 drop-shadow-lg tracking-wide">
                FORTHCOMING
              </h2>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-800 max-w-xs max-sm:max-w-[60px] max-[480px]:max-w-[30px]"></div>
            </div>
            
            {/* First Row */}
            <div 
              ref={row1Ref}
              data-row="row1"
              className={`mb-12 transition-all duration-700 ${
                visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 justify-items-center max-w-6xl mx-auto">
                {smallShelfComics.slice(0, 3).map((comic, index) => (
                  <div 
                    key={comic.title} 
                    className={`w-full max-w-xs cursor-pointer transition-all duration-500 hover:scale-105 ${
                      visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: visibleRows.has('row1') ? `${index * 150}ms` : '0ms' }}
                    onClick={() => handleComicClick(comic)}
                  >
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} comic cover`}
                      className="w-full shadow-xl rounded-sm"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 justify-items-center max-w-6xl mx-auto">
                {smallShelfComics.slice(3, 6).map((comic, index) => (
                  <div 
                    key={comic.title} 
                    className={`w-full max-w-xs cursor-pointer transition-all duration-500 hover:scale-105 ${
                      visibleRows.has('row2') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: visibleRows.has('row2') ? `${index * 150}ms` : '0ms' }}
                    onClick={() => handleComicClick(comic)}
                  >
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} comic cover`}
                      className="w-full shadow-xl rounded-sm"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 relative z-10 max-sm:py-8 -mt-8">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-white">
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
            className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 border border-gray-200 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-sm:max-h-[40vh]">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-lg shadow-2xl rounded-sm max-sm:max-h-full max-sm:object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-black mb-4 max-sm:text-2xl">
                {selectedComic.title}
              </h3>
              <p className="font-serif text-base md:text-lg text-gray-700 leading-relaxed mb-6 max-sm:text-sm">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="self-start px-6 py-2 bg-amber-800 text-white font-medium rounded-lg hover:bg-amber-900 transition-colors"
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
