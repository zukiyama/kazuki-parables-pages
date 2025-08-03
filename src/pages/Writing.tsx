import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { CharacterSlideshow } from "@/components/CharacterSlideshow";
import { YoungAdultSlideshow } from "@/components/YoungAdultSlideshow";

// Background and book covers
import schoolBackground from "@/assets/school-background-montage.jpg";
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import siphonsCover from "@/assets/siphons-cover.jpg";
import obaCover from "@/assets/oba-cover.jpg";

const Writing = () => {
  const [scrollY, setScrollY] = useState(0);
  const parallaxRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${schoolBackground})`
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      <main className="relative z-10 pt-24">
        {/* KAIJU Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h1 className="font-heading text-5xl font-bold text-white mb-12 text-center">
                Writing
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src={kaijuCover} 
                    alt="KAIJU Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="text-white">
                  <h2 className="font-heading text-4xl font-bold mb-4">
                    KAIJU
                  </h2>
                  <h3 className="font-heading text-2xl text-accent mb-6">
                    Book One of The Parable Trilogy
                  </h3>
                  <p className="font-body text-lg leading-relaxed opacity-90 mb-8">
                    A mystery unfolds in a small Japanese town in summer 1979, where a group of boys discover that no one remembers how they got there. Strange creatures appear in the sky while the children search for answers in their forgotten past.
                  </p>
                  
                  {/* Character Slideshow */}
                  <CharacterSlideshow />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOAX Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white order-2 lg:order-1">
                  <h2 className="font-heading text-4xl font-bold mb-6">
                    HOAX
                  </h2>
                  <p className="font-body text-lg leading-relaxed opacity-90">
                    A writer named Peter Carlyle wrote a book, then received a mysterious phone call. When he drove to the location, it felt like he was living inside his own story. Set in a strange commune in the Australian outback, where fairy lights drape over entrance arches and secrets hide in the vegetable patches.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
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
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <img 
                    src={siphonsCover} 
                    alt="SIPHONS Book Cover"
                    className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl"
                  />
                </div>
                <div className="text-white">
                  <h2 className="font-heading text-4xl font-bold mb-6">
                    SIPHONS
                  </h2>
                  <p className="font-body text-lg leading-relaxed opacity-90">
                    A man remembers watching a TV show as a kid, but when he tries to find any details about it, it becomes a mystery. The deeper he searches, the stranger the mystery becomes, leading him into a world of bizarre children's shows with otherworldly implications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OBA Section */}
        <section className="min-h-screen flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-white order-2 lg:order-1">
                  <h2 className="font-heading text-4xl font-bold mb-6">
                    OBA
                  </h2>
                  <p className="font-body text-lg leading-relaxed opacity-90">
                    Set in Zimbabwe, this story follows a man with an African name who returns to his hometown at the edge of a receding jungle. He's there to teach as a speech therapist, working with a young girl in his home village, but ends up learning more from her than he could ever teach.
                  </p>
                </div>
                <div className="order-1 lg:order-2">
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
        <section className="min-h-screen flex items-center justify-center relative bg-black/80">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className="font-heading text-4xl font-bold text-white mb-4 text-center">
                Young Adult Novels
              </h2>
              <p className="font-body text-xl text-white/80 mb-12 text-center">
                Books of imagination for any age
              </p>
              
              <YoungAdultSlideshow />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Writing;