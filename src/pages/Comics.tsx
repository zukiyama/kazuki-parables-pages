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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />

      <main className="relative z-10 pt-24 pb-20">
        {/* Modern Magazine Header */}
        <header className="text-center px-6 mb-12 sm:mb-16">
          <div className="max-w-5xl mx-auto">
            {/* Main Title - Tintin Style */}
            <h1 
              className="text-5xl sm:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tight mb-4"
              style={{ fontFamily: 'Boogaloo, cursive' }}
            >
              COMICS AND SCRIPTS
            </h1>
            
            {/* Subtitle with decorative lines */}
            <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="flex-1 h-px bg-slate-300" />
              <p className="text-sm sm:text-base text-slate-600 tracking-widest uppercase whitespace-nowrap">
                Original Stories in Sequential Art & Screenplay
              </p>
              <div className="flex-1 h-px bg-slate-300" />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-4 sm:px-6 lg:px-12">
          <div className="max-w-7xl mx-auto">
            
            {/* God of Lies Section */}
            <section className="mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Desktop Layout */}
                <div className="hidden sm:grid sm:grid-cols-5 lg:grid-cols-3 gap-0">
                  {/* Cover Image - Takes more space */}
                  <div className="sm:col-span-3 lg:col-span-2 relative">
                    <img 
                      src={godOfLiesCover}
                      alt="God of Lies comic cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Text Content */}
                  <div className="sm:col-span-2 lg:col-span-1 p-8 lg:p-10 flex flex-col justify-center bg-slate-900 text-white">
                    <h2 
                      className="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                      style={{ fontFamily: 'Boogaloo, cursive' }}
                    >
                      GOD OF LIES
                    </h2>
                    <p className="text-amber-400 text-sm uppercase tracking-widest mb-6 font-medium">
                      Be careful who you trust...
                    </p>
                    <p className="text-slate-300 leading-relaxed mb-6 text-base lg:text-lg">
                      Dissatisfied with life, Seo Jun finds the mundane world quickly spiraling out of control when he enters into a perilous deal with a demonic god of lies who now lives in his shadow.
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      A gripping dark urban fantasy with mystery, danger, and betrayal.
                    </p>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <img 
                    src={godOfLiesCover}
                    alt="God of Lies comic cover"
                    className="w-full"
                  />
                  <div className="p-6 bg-slate-900 text-white">
                    <h2 
                      className="text-3xl font-bold mb-3"
                      style={{ fontFamily: 'Boogaloo, cursive' }}
                    >
                      GOD OF LIES
                    </h2>
                    <p className="text-amber-400 text-xs uppercase tracking-widest mb-4 font-medium">
                      Be careful who you trust...
                    </p>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      Dissatisfied with life, Seo Jun finds the mundane world quickly spiraling out of control when he enters into a perilous deal with a demonic god of lies who now lives in his shadow. A gripping dark urban fantasy with mystery, danger, and betrayal.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Surname Pendragon Section */}
            <section className="mb-16 sm:mb-24">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                {/* Desktop Layout */}
                <div className="hidden sm:grid sm:grid-cols-5 lg:grid-cols-3 gap-0">
                  {/* Text Content - Left side */}
                  <div className="sm:col-span-2 lg:col-span-1 p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
                    <span className="text-emerald-400 text-xs uppercase tracking-widest mb-2 font-medium">
                      Original Screenplay
                    </span>
                    <h2 
                      className="text-3xl lg:text-4xl font-bold mb-4 leading-tight"
                      style={{ fontFamily: 'Boogaloo, cursive' }}
                    >
                      SURNAME PENDRAGON
                    </h2>
                    <p className="text-amber-400 text-sm uppercase tracking-widest mb-6 font-medium">
                      An Epic Modern Fantasy...
                    </p>
                    <p className="text-slate-300 leading-relaxed text-base">
                      Arthur Penn, an unremarkable office worker drowning in spreadsheets, finds his mundane existence shattered when he encounters a sword embedded in stone on a London street. The blood of kings flows through his veins, awakening powers and responsibilities he never asked for.
                    </p>
                  </div>
                  
                  {/* Cover Image */}
                  <div className="sm:col-span-3 lg:col-span-2 relative">
                    <img 
                      src={surnameProPendragonCoverNew}
                      alt="Surname Pendragon cover"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="sm:hidden">
                  <img 
                    src={surnameProPendragonCoverNew}
                    alt="Surname Pendragon cover"
                    className="w-full"
                  />
                  <div className="p-6 bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
                    <span className="text-emerald-400 text-xs uppercase tracking-widest mb-2 font-medium block">
                      Original Screenplay
                    </span>
                    <h2 
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: 'Boogaloo, cursive' }}
                    >
                      SURNAME PENDRAGON
                    </h2>
                    <p className="text-amber-400 text-xs uppercase tracking-widest mb-4 font-medium">
                      An Epic Modern Fantasy...
                    </p>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      Arthur Penn, an unremarkable office worker, finds his mundane existence shattered when he encounters a sword embedded in stone. The blood of kings flows through his veins.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Stories Waiting to be Told Section */}
            <section className="text-center mb-12 sm:mb-16">
              <ScrollScale 
                initialScale={1.1} 
                finalScale={1} 
                initialBlur={2}
                className="text-center"
              >
                <h2 
                  className="text-3xl sm:text-5xl lg:text-6xl text-slate-800 italic mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  "Stories waiting to be told..."
                </h2>
                <div className="w-24 h-1 bg-amber-600 mx-auto rounded-full" />
              </ScrollScale>
            </section>

            {/* Forthcoming Comics Grid */}
            <section className="pb-8">
              {/* First Row */}
              <div 
                ref={row1Ref}
                data-row="row1"
                className={`mb-10 transition-all duration-700 ${
                  visibleRows.has('row1') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
                  {smallShelfComics.slice(0, 3).map((comic, index) => (
                    <div 
                      key={comic.title} 
                      className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden ${
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
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
                  {smallShelfComics.slice(3, 6).map((comic, index) => (
                    <div 
                      key={comic.title} 
                      className={`cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-lg overflow-hidden ${
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
      
      <footer className="bg-slate-900 py-12 max-sm:py-8">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-slate-300">
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
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-sm:p-4 max-sm:gap-4 max-sm:max-h-[90vh] max-sm:overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center max-sm:max-h-[40vh]">
              <img 
                src={selectedComic.cover}
                alt={`${selectedComic.title} comic cover`}
                className="w-full max-w-lg shadow-2xl rounded-lg max-sm:max-h-full max-sm:object-contain"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 
                className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 max-sm:text-2xl"
                style={{ fontFamily: 'Boogaloo, cursive' }}
              >
                {selectedComic.title}
              </h3>
              <p className="font-serif text-base md:text-lg text-slate-700 leading-relaxed mb-6 max-sm:text-sm">
                {selectedComic.description}
              </p>
              <button
                onClick={handleCloseModal}
                className="self-start px-6 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
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
