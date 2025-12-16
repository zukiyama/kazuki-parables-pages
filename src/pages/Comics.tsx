import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
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
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [hasZoomed, setHasZoomed] = useState(false);
  const [pendragonVisible, setPendragonVisible] = useState(false);
  const [godOfLiesLoaded, setGodOfLiesLoaded] = useState(false);
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

      <main className="relative z-10 pt-32 pb-20">
        {/* === MOBILE VERSION === */}
        <div className="sm:hidden">
          {/* Mobile Title Section */}
          <section className="text-center px-6 mb-6">
            <h1 className="font-serif text-4xl font-bold text-black mb-4 tracking-wide drop-shadow-lg">
              Comics & Scripts
            </h1>
            <p className="font-serif text-lg text-amber-800 leading-relaxed drop-shadow-md max-w-2xl mx-auto">
              Original comics, manga, webtoons and scripts
            </p>
          </section>

          {/* Mobile God of Lies */}
          <section className="py-8 px-0">
            <div className="mb-6">
              <img 
                src={godOfLiesCover}
                alt="God of Lies comic cover"
                className="w-full object-contain"
                onLoad={() => setGodOfLiesLoaded(true)}
              />
            </div>
            <div className="px-6">
              <div style={{ fontFamily: 'Bangers, cursive' }}>
                <h3 className="text-4xl text-black uppercase tracking-wider mb-4 text-center">
                  GOD OF LIES
                </h3>
                <p className="text-lg text-black leading-relaxed mb-4" style={{ letterSpacing: '0.5px' }}>
                  A con man discovers that a demon has attached itself to his soul—making every lie he tells become reality.
                </p>
                <p className="text-lg text-black leading-relaxed" style={{ letterSpacing: '0.5px' }}>
                  A psychological thriller exploring the price of dishonesty, where deception becomes truth and reality dissolves into fiction.
                </p>
              </div>
            </div>
          </section>

          {/* Mobile Pull Quote */}
          {godOfLiesLoaded && (
            <section className="relative py-10 overflow-hidden">
              <div className="container mx-auto px-6">
                <ScrollScale 
                  initialScale={1.15} 
                  finalScale={1} 
                  initialBlur={3}
                  className="text-center"
                >
                  <blockquote className="font-serif text-3xl text-black/80 italic leading-tight max-w-4xl mx-auto">
                    "Stories waiting to be told..."
                  </blockquote>
                  <div className="mt-6 w-24 h-1 bg-amber-800 mx-auto rounded-full" />
                </ScrollScale>
              </div>
            </section>
          )}

          {/* Mobile Surname Pendragon */}
          <section className="py-8 px-6">
            <img 
              src={surnameProPendragonCoverNew}
              alt="Surname Pendragon comic cover"
              className="w-full shadow-xl rounded-sm mb-6"
            />
            <h3 className="text-2xl font-bold text-black uppercase tracking-wide text-center mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              SURNAME PENDRAGON
            </h3>
            <p className="text-base text-black leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              A modern retelling where mythical beings walk among us. Where an ordinary man discovers an extraordinary destiny. Where the fate of both realms hangs in the balance. Arthur Penn, an unremarkable office worker, finds his life upended when he discovers a sword embedded in stone on a London street—and realizes the blood of kings flows through his veins.
            </p>
          </section>
        </div>

        {/* === DESKTOP NEWSPAPER VERSION === */}
        <div className="hidden sm:block">
          {/* Newspaper Masthead */}
          <section className="px-6 mb-8">
            <div className="max-w-6xl mx-auto">
              {/* Top date line */}
              <div className="flex justify-between items-center border-b border-black pb-2 mb-4">
                <span className="font-serif text-sm text-black/70 italic">Est. 2024</span>
                <span className="font-serif text-sm text-black/70">The Creative Chronicle</span>
                <span className="font-serif text-sm text-black/70 italic">Vol. I, No. 1</span>
              </div>
              
              {/* Main Masthead Title */}
              <div className="text-center py-6 border-b-4 border-double border-black">
                <h1 className="font-serif text-7xl lg:text-8xl font-black text-black tracking-tight" style={{ fontFamily: 'Times New Roman, Georgia, serif', fontWeight: 900 }}>
                  COMICS & SCRIPTS
                </h1>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <div className="w-16 h-px bg-black"></div>
                  <p className="font-serif text-lg text-black/80 italic tracking-wide">
                    Original stories in sequential art and screenplay
                  </p>
                  <div className="w-16 h-px bg-black"></div>
                </div>
              </div>
              
              {/* Decorative rule */}
              <div className="h-1 bg-black mt-2"></div>
            </div>
          </section>

          {/* Newspaper Articles Section */}
          <section className="px-6 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Two-column newspaper layout */}
              <div className="grid grid-cols-12 gap-0">
                
                {/* LEFT COLUMN - God of Lies (Main Story) */}
                <div className="col-span-7 pr-6 border-r border-black/30">
                  {/* Headline */}
                  <h2 className="font-serif text-5xl lg:text-6xl font-bold text-black leading-none mb-3" style={{ fontFamily: 'Times New Roman, Georgia, serif' }}>
                    GOD OF LIES
                  </h2>
                  <p className="font-serif text-sm text-black/60 italic mb-4 border-b border-black/20 pb-3">
                    A Psychological Thriller of Deception and Reality
                  </p>
                  
                  {/* Featured Image */}
                  <div className="mb-4">
                    <img 
                      src={godOfLiesCover}
                      alt="God of Lies comic cover"
                      className="w-full shadow-lg"
                      onLoad={() => setGodOfLiesLoaded(true)}
                    />
                    <p className="font-serif text-xs text-black/50 italic mt-2 text-center">
                      Cover artwork for the upcoming graphic novel
                    </p>
                  </div>
                  
                  {/* Article text in columns */}
                  <div className="columns-2 gap-6 text-justify" style={{ fontFamily: 'Georgia, serif' }}>
                    <p className="text-base text-black leading-relaxed mb-4 first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                      A con man discovers that a demon has attached itself to his soul—making every lie he tells become reality. What begins as a gift soon reveals itself as a curse, as the boundaries between truth and fiction begin to dissolve.
                    </p>
                    <p className="text-base text-black leading-relaxed mb-4">
                      This psychological thriller explores the price of dishonesty in a world where words have the power to reshape reality itself. The protagonist must navigate a treacherous landscape where every deception creates a new truth, and every truth he once knew crumbles to dust.
                    </p>
                    <p className="text-base text-black leading-relaxed">
                      As lies compound upon lies, he finds himself trapped in a labyrinth of his own making—a world that becomes more unrecognizable with each falsehood he utters. The demon feeds on chaos, growing stronger as reality itself begins to fracture.
                    </p>
                  </div>
                </div>
                
                {/* RIGHT COLUMN - Surname Pendragon */}
                <div className="col-span-5 pl-6">
                  {/* Secondary Headline */}
                  <h2 className="font-serif text-3xl lg:text-4xl font-bold text-black leading-tight mb-2" style={{ fontFamily: 'Times New Roman, Georgia, serif' }}>
                    SURNAME PENDRAGON
                  </h2>
                  <p className="font-serif text-xs text-black/60 uppercase tracking-widest mb-4 border-b border-black/20 pb-2">
                    A Modern Arthurian Legend
                  </p>
                  
                  {/* Article text */}
                  <div style={{ fontFamily: 'Georgia, serif' }}>
                    <p className="text-sm text-black leading-relaxed mb-4 text-justify first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
                      Arthur Penn, an unremarkable office worker drowning in spreadsheets, finds his mundane existence shattered when he encounters a sword embedded in stone on a London street.
                    </p>
                    <p className="text-sm text-black leading-relaxed mb-4 text-justify">
                      The blood of kings flows through his veins, awakening powers and responsibilities he never asked for. Mythical beings walk among us, hidden in plain sight, and they have been waiting for him.
                    </p>
                  </div>
                  
                  {/* Secondary Image */}
                  <div className="my-4">
                    <img 
                      src={surnameProPendragonCoverNew}
                      alt="Surname Pendragon comic cover"
                      className="w-full shadow-lg"
                    />
                    <p className="font-serif text-xs text-black/50 italic mt-2 text-center">
                      Concept artwork for the screenplay
                    </p>
                  </div>
                  
                  <div style={{ fontFamily: 'Georgia, serif' }}>
                    <p className="text-sm text-black leading-relaxed text-justify">
                      A modern retelling where the fate of two realms—the mundane and the magical—hangs in the balance. The ancient stories were never fiction. They were prophecy.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Bottom decorative rule */}
              <div className="border-t-2 border-black mt-8 pt-2">
                <div className="h-px bg-black"></div>
              </div>
            </div>
          </section>

          {/* Pull Quote Section - Desktop */}
          {godOfLiesLoaded && (
            <section className="relative py-12 overflow-hidden">
              <div className="container mx-auto px-6">
                <ScrollScale 
                  initialScale={1.15} 
                  finalScale={1} 
                  initialBlur={3}
                  className="text-center"
                >
                  <blockquote className="font-serif text-5xl lg:text-6xl text-black/80 italic leading-tight max-w-4xl mx-auto">
                    "Stories waiting to be told..."
                  </blockquote>
                  <div className="mt-6 w-24 h-1 bg-amber-800 mx-auto rounded-full" />
                </ScrollScale>
              </div>
            </section>
          )}
        </div>

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
