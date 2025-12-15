import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { ScrollScale } from "@/components/ScrollAnimations";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import godOfLiesCover from "@/assets/god-of-lies-cover-new.png";
import surnameProPendragonCoverNew from "@/assets/surname-pendragon-wide-cover.png";
import mangaSketchesBackground from "@/assets/manga-character-sketches-background.jpeg";
import godsCoverNew from "@/assets/gods-cover-new.png";
import mrMiracleCoverNew from "@/assets/mr-miracle-cover-new.png";
import scriptedCoverNew from "@/assets/scripted-cover-new.png";
import burdenCoverNew from "@/assets/burden-cover-new.png";
import toFlyCoverNew from "@/assets/to-fly-cover-new.png";
import orangesGoldCoverNew from "@/assets/oranges-gold-cover-new.jpeg";

const Comics = () => {
  // Preload God of Lies cover to prevent layout shift
  useImagePreloader({ images: [godOfLiesCover], priority: true });
  const [selectedComic, setSelectedComic] = useState<{cover: string; title: string; description: string; teaser?: string} | null>(null);
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());
  const [hasZoomed, setHasZoomed] = useState(false);
  const [pendragonVisible, setPendragonVisible] = useState(false);
  const pendragonRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const forthcomingComics = [
    { 
      cover: godsCoverNew, 
      title: "Gods", 
      description: "A mythological epic exploring the nature of divinity and mortality.",
      teaser: ""
    },
    { 
      cover: mrMiracleCoverNew, 
      title: "Mr. Miracle", 
      description: "The extraordinary life of an ordinary man who discovers he can perform miracles.",
      teaser: ""
    },
    { 
      cover: scriptedCoverNew, 
      title: "Scripted", 
      description: "When reality follows a screenplay no one remembers writing.",
      teaser: ""
    },
    { 
      cover: burdenCoverNew, 
      title: "The Burden", 
      description: "A weight that cannot be put down, a journey that cannot be avoided.",
      teaser: ""
    },
    { 
      cover: toFlyCoverNew, 
      title: "To Fly", 
      description: "The dream of flight becomes something far more complex.",
      teaser: ""
    },
    { 
      cover: orangesGoldCoverNew, 
      title: "Oranges & Gold", 
      description: "Color, memory, and the spaces between what we see and what we remember.",
      teaser: ""
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 50 && !hasZoomed) {
        setHasZoomed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasZoomed]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const rowId = entry.target.getAttribute('data-row');
            if (rowId) {
              setVisibleRows(prev => new Set([...prev, rowId]));
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setPendragonVisible(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (pendragonRef.current) {
      observer.observe(pendragonRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 z-0 transition-transform duration-700 ease-out"
        style={{
          backgroundImage: `url(${mangaSketchesBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: hasZoomed ? 'scale(1.02)' : 'scale(1)',
        }}
      />
      
      {/* Scrollable Content */}
      <div className="relative z-10">
        <Navigation />
        
        {/* Page Title */}
        <section className="pt-40 pb-16 px-6">
          <div className="container mx-auto text-center">
            <h1 className="text-6xl md:text-7xl max-sm:text-4xl font-bold text-white drop-shadow-lg font-bangers tracking-wide">
              Comics & Scripts
            </h1>
            <p className="text-xl md:text-2xl max-sm:text-lg text-white/90 mt-4 font-serif">
              Original stories in graphic novel and screenplay format
            </p>
          </div>
        </section>

        {/* God of Lies Section - Full width image with text below */}
        <section className="py-8 md:py-12">
          {/* Full-width image */}
          <div className="w-full">
            <img 
              src={godOfLiesCover}
              alt="God of Lies comic cover"
              className="w-full"
            />
          </div>
          
          {/* Text Content - centered below image */}
          <div className="text-center px-6 mt-8">
            <div style={{ fontFamily: 'Bangers, cursive' }}>
              <h3 className="text-5xl md:text-6xl text-black uppercase tracking-wider mb-6 drop-shadow-lg">
                GOD OF LIES
              </h3>
            </div>
            <p className="text-xl max-sm:text-lg text-black leading-relaxed max-w-3xl mx-auto">
              <span className="italic">
                What happens if you're a god... who doesn't believe in gods?
              </span>
              <br /><br />
              <span className="font-semibold">
                Conceived and written as manga-style graphic novel
              </span>
            </p>
          </div>
        </section>

        {/* Pull Quote Section */}
        <section className="relative py-10 md:py-16 overflow-hidden">
          <div className="container mx-auto px-6">
            <ScrollScale 
              initialScale={1.15} 
              finalScale={1} 
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
              {/* Text Content - Script format */}
              <div 
                ref={pendragonRef}
                className={`lg:col-span-2 order-2 lg:order-1 max-[480px]:px-6 transition-all duration-700 ease-out ${
                  pendragonVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}
              >
                <h2 className="text-5xl max-sm:text-3xl font-bold mb-6 text-white drop-shadow-lg font-bangers tracking-wide">
                  Surname Pendragon
                </h2>
                <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg font-mono text-sm text-white/90 space-y-4">
                  <p className="text-white/60 uppercase tracking-wider text-xs">INT. LONDON TOWNHOUSE - NIGHT</p>
                  <p>
                    <span className="text-white/60">FADE IN:</span>
                  </p>
                  <p>
                    A sprawling Victorian study. Books line every wall. ARTHUR PENDRAGON (40s, disheveled, brilliant) 
                    paces before a crackling fire.
                  </p>
                  <p className="text-center text-white/60 uppercase">ARTHUR</p>
                  <p className="text-center italic">
                    The name carries weight, doesn't it?<br/>
                    Pendragon. Dragon's head.<br/>
                    Everyone expects a king.
                  </p>
                  <p className="text-white/50 text-xs mt-4">
                    Original screenplay • Feature length
                  </p>
                </div>
              </div>
              
              {/* Cover Image */}
              <div className="lg:col-span-3 order-1 lg:order-2 max-[480px]:px-0">
                <img 
                  src={surnameProPendragonCoverNew}
                  alt="Surname Pendragon screenplay cover"
                  className="w-full object-contain shadow-2xl rounded-sm transform rotate-1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Forthcoming Comics Section */}
        <section className="py-16 md:py-24 px-6">
          <div className="container mx-auto max-w-7xl">
            <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 text-white drop-shadow-lg font-bangers tracking-wide">
              FORTHCOMING
            </h2>
            
            {/* First Row - 3 comics */}
            <div 
              ref={row1Ref}
              data-row="row1"
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              {forthcomingComics.slice(0, 3).map((comic, index) => (
                <div 
                  key={comic.title}
                  className={`group cursor-pointer transition-all duration-500 ${
                    visibleRows.has('row1') 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => setSelectedComic(comic)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} cover`}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Second Row - 3 comics */}
            <div 
              ref={row2Ref}
              data-row="row2"
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {forthcomingComics.slice(3, 6).map((comic, index) => (
                <div 
                  key={comic.title}
                  className={`group cursor-pointer transition-all duration-500 ${
                    visibleRows.has('row2') 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onClick={() => setSelectedComic(comic)}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img 
                      src={comic.cover}
                      alt={`${comic.title} cover`}
                      className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center -mt-8">
          <p className="text-white/70 font-serif text-sm">
            kazuki@kazukiyamakawa.com
          </p>
        </footer>
      </div>

      {/* Comic Detail Modal */}
      {selectedComic && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          onClick={() => setSelectedComic(null)}
        >
          <div 
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} cover`}
                className="w-full md:w-1/2 aspect-[2/3] object-cover rounded-lg shadow-xl"
              />
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-4 font-bangers tracking-wide">
                  {selectedComic.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {selectedComic.description}
                </p>
                {selectedComic.teaser && (
                  <p className="text-white/60 italic mt-4">
                    {selectedComic.teaser}
                  </p>
                )}
              </div>
            </div>
            <button 
              className="mt-6 px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
              onClick={() => setSelectedComic(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Comics;