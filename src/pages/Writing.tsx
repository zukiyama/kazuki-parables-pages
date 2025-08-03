import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { CharacterSlideshow } from "@/components/CharacterSlideshow";
import { YoungAdultSlideshow } from "@/components/YoungAdultSlideshow";

// Background images
import schoolBackground from "@/assets/school-background-montage.jpg";
import hoaxBackground from "@/assets/hoax-background.jpg";
import siphonsBackground from "@/assets/siphons-background.jpg";
import obaBackground from "@/assets/oba-background.jpg";

// Book covers
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import siphonsCover from "@/assets/siphons-cover.jpg";
import obaCover from "@/assets/oba-cover.jpg";

const Writing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [currentBackground, setCurrentBackground] = useState(schoolBackground);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Check which sections are visible and update background
      const sections = document.querySelectorAll('[data-section]');
      const newVisibleSections = new Set<string>();
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionId = section.getAttribute('data-section');
        
        if (rect.top < window.innerHeight * 0.7 && rect.bottom > window.innerHeight * 0.3) {
          if (sectionId) newVisibleSections.add(sectionId);
        }
      });
      
      setVisibleSections(newVisibleSections);

      // Update background based on visible section
      if (newVisibleSections.has('oba')) {
        setCurrentBackground(obaBackground);
      } else if (newVisibleSections.has('siphons')) {
        setCurrentBackground(siphonsBackground);
      } else if (newVisibleSections.has('hoax')) {
        setCurrentBackground(hoaxBackground);
      } else {
        setCurrentBackground(schoolBackground);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      
      {/* Fixed Background Image with Transitions */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url(${currentBackground})`
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>
      </div>
      
      <main className="relative z-10 pt-24">
        {/* KAIJU Section */}
        <section data-section="kaiju" className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h1 className={`font-serif text-6xl font-bold text-white mb-12 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Writing
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <img 
                    src={kaijuCover} 
                    alt="KAIJU Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className={`text-white transition-all duration-1000 delay-500 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 mb-8 border border-white/20">
                    <h2 className="font-serif text-5xl font-bold mb-4 text-white">
                      KAIJU
                    </h2>
                    <h3 className="font-serif text-2xl text-yellow-300 mb-6 tracking-wide">
                      Book One of The Parable Trilogy
                    </h3>
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A mystery unfolds in a small Japanese town in summer 1979, where a group of boys discover that no one remembers how they got there. Strange creatures appear in the sky while the children search for answers in their forgotten past.
                    </p>
                  </div>
                  
                  {/* Character Slideshow */}
                  <CharacterSlideshow />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOAX Section */}
        <section data-section="hoax" className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`text-white order-2 lg:order-1 transition-all duration-1000 delay-300 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-6 text-shadow-lg">
                    HOAX
                  </h2>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A writer named Peter Carlyle wrote a book, then received a mysterious phone call. When he drove to the location, it felt like he was living inside his own story. Set in a strange commune in the Australian outback, where fairy lights drape over entrance arches and secrets hide in the vegetable patches.
                    </p>
                  </div>
                </div>
                <div className={`order-1 lg:order-2 transition-all duration-1000 delay-500 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <img 
                    src={hoaxCover} 
                    alt="HOAX Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIPHONS Section */}
        <section data-section="siphons" className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('siphons') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <img 
                    src={siphonsCover} 
                    alt="SIPHONS Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className={`text-white transition-all duration-1000 delay-500 ${
                  visibleSections.has('siphons') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-6 text-shadow-lg">
                    SIPHONS
                  </h2>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A man remembers watching a TV show as a kid, but when he tries to find any details about it, it becomes a mystery. The deeper he searches, the stranger the mystery becomes, leading him into a world of bizarre children's shows with otherworldly implications.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OBA Section */}
        <section data-section="oba" className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`text-white order-2 lg:order-1 transition-all duration-1000 delay-300 ${
                  visibleSections.has('oba') ? 'opacity-100 -translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-6 text-shadow-lg">
                    OBA
                  </h2>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      Set in Zimbabwe, this story follows a man with an African name who returns to his hometown at the edge of a receding jungle. He's there to teach as a speech therapist, working with a young girl in his home village, but ends up learning more from her than he could ever teach.
                    </p>
                  </div>
                </div>
                <div className={`order-1 lg:order-2 transition-all duration-1000 delay-500 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <img 
                    src={obaCover} 
                    alt="OBA Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Young Adult Books Section */}
        <section data-section="young-adult" className="min-h-screen flex items-center justify-center relative bg-black/80">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className={`font-serif text-5xl font-bold text-white mb-4 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Young Adult Novels
              </h2>
              <p className={`font-serif text-xl text-yellow-300 mb-12 text-center transition-all duration-1000 delay-300 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Books of imagination for any age
              </p>
              
              <div className={`transition-all duration-1000 delay-500 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <YoungAdultSlideshow />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Writing;