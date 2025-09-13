import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/Navigation";
import { CharacterSlideshow } from "@/components/CharacterSlideshow";
import { YoungAdultSlideshow, YoungAdultSlideshowRef } from "@/components/YoungAdultSlideshow";
import { BookCoverSlideshow } from "@/components/BookCoverSlideshow";
import { ParableImageSelector } from "@/components/ParableImageSelector";
import { BookshelfMenu } from "@/components/BookshelfMenu";

// Background images
import schoolBackground from "@/assets/school-background-montage.jpg";
import hoaxBackground from "@/assets/hoax-background.jpg";
import theMarketBackground from "@/assets/the-market-background.jpg";
import howBackground from "@/assets/how-background.jpg";
import obaBackground from "@/assets/oba-background.jpg";
import wastelandCityBackground from "@/assets/wasteland-city-background.jpg";

// Book covers
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import hoaxCover from "@/assets/hoax-cover.jpg";
import theMarketCover from "@/assets/the-market-cover.jpg";
import howCover from "@/assets/how-cover.jpg";
import obaCover from "@/assets/oba-cover.jpg";

const Writing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [currentYoungAdultBook, setCurrentYoungAdultBook] = useState(0);
  const [backgroundOpacities, setBackgroundOpacities] = useState({
    school: 1,
    hoax: 0,
    theMarket: 0,
    how: 0,
    oba: 0
  });
  const youngAdultSlideshowRef = useRef<YoungAdultSlideshowRef>(null);

  // Preload critical images for better performance
  useEffect(() => {
    const preloadImages = [
      schoolBackground, 
      hoaxBackground, 
      theMarketBackground, 
      howBackground,
      obaBackground,
      wastelandCityBackground,
      hoaxCover, 
      theMarketCover,
      howCover,
      obaCover
    ];
    preloadImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Check which sections are visible
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

      // Update background opacities based on visible section
      const newOpacities = {
        school: 0,
        hoax: 0,
        theMarket: 0,
        how: 0,
        oba: 0
      };

      if (newVisibleSections.has('oba')) {
        newOpacities.oba = 1;
      } else if (newVisibleSections.has('how')) {
        newOpacities.how = 1;
      } else if (newVisibleSections.has('the-market')) {
        newOpacities.theMarket = 1;
      } else if (newVisibleSections.has('hoax')) {
        newOpacities.hoax = 1;
      } else {
        newOpacities.school = 1;
      }

      setBackgroundOpacities(newOpacities);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBookClick = (bookId: string, slideToBook?: number) => {
    // If it's a young adult book, set the slideshow to show that book IMMEDIATELY
    if (slideToBook !== undefined && youngAdultSlideshowRef.current) {
      youngAdultSlideshowRef.current.setCurrentBook(slideToBook);
    }
  };

  return (
    <div className="min-h-screen relative">
      <Navigation />
      <BookshelfMenu 
        onBookClick={handleBookClick} 
        visibleSections={visibleSections} 
        currentYoungAdultBook={currentYoungAdultBook}
      />
      
      {/* Stacked Background Images */}
      <div className="fixed inset-0 z-0">
        <img 
          src={schoolBackground} 
          alt="School background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.school }}
        />
        <img 
          src={hoaxBackground} 
          alt="Hoax background"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.hoax }}
        />
        <img 
          src={theMarketBackground} 
          alt="The Market background"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.theMarket }}
        />
        <img 
          src={howBackground} 
          alt="HOW background"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.how }}
        />
        <img 
          src={obaBackground} 
          alt="Oba background"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
          style={{ opacity: backgroundOpacities.oba }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/40"></div>
      </div>
      
      <main className="relative z-10 pt-24">
        {/* KAIJU Section */}
        <section data-section="kaiju" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h1 className={`font-serif text-6xl font-bold text-white mb-12 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}>
                Novels
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('kaiju') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <ParableImageSelector />
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
        <section data-section="hoax" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`order-1 transition-all duration-1000 delay-300 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: hoaxCover, alt: "HOAX Book Cover" }
                    ]}
                    title="HOAX"
                  />
                </div>
                <div className={`text-white order-2 transition-all duration-1000 delay-500 ${
                  visibleSections.has('hoax') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
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
              </div>
            </div>
          </div>
        </section>

        {/* THE MARKET Section */}
        <section data-section="the-market" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('the-market') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: theMarketCover, alt: "THE MARKET Book Cover" }
                    ]}
                    title="THE MARKET"
                  />
                </div>
                <div className={`text-white transition-all duration-1000 delay-500 ${
                  visibleSections.has('the-market') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-6 text-shadow-lg">
                    THE MARKET
                  </h2>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A man journeys to the first corporate nation on Earth, where towering glass structures pierce the sky and autonomous vehicles glide through pristine streets. But beneath the gleaming facade of this technological paradise, all is not as it seems. Dark secrets lurk in the shadows of progress, and the price of perfection may be higher than anyone imagined.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW Section */}
        <section data-section="how" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`transition-all duration-1000 delay-300 ${
                  visibleSections.has('how') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: howCover, alt: "HOW Book Cover" }
                    ]}
                    title="HOW"
                  />
                </div>
                <div className={`text-white transition-all duration-1000 delay-500 ${
                  visibleSections.has('how') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}>
                  <h2 className="font-serif text-5xl font-bold mb-6 text-shadow-lg">
                    HOW
                  </h2>
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <p className="font-serif text-lg leading-relaxed text-white">
                      A philosophical exploration of understanding and wisdom. Through ancient teachings and modern perspectives, this book delves into the fundamental questions of existence, consciousness, and the path to enlightenment. A journey that bridges Eastern philosophy with contemporary thought.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OBA Section */}
        <section data-section="oba" className="min-h-[90vh] flex items-center justify-center relative">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className={`order-1 transition-all duration-1000 delay-300 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'
                }`}>
                  <BookCoverSlideshow 
                    covers={[
                      { image: obaCover, alt: "OBA Book Cover" }
                    ]}
                    title="OBA"
                  />
                </div>
                <div className={`text-white order-2 transition-all duration-1000 delay-500 ${
                  visibleSections.has('oba') ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
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
              </div>
            </div>
          </div>
        </section>

        {/* Young Adult Books Section */}
        <section data-section="young-adult" className="min-h-[90vh] flex items-center justify-center relative bg-gradient-to-br from-primary/20 to-accent/10">
          <div className="container mx-auto px-6 py-20">
            <div className="max-w-6xl mx-auto">
              <h2 className={`font-serif text-5xl font-bold text-white mb-4 text-center tracking-wide transition-all duration-1000 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Young Adult Series
              </h2>
              <p className={`font-serif text-xl text-yellow-300 mb-12 text-center transition-all duration-1000 delay-300 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                Books of imagination for any age
              </p>
              
              <div className={`transition-all duration-1000 delay-500 ${
                visibleSections.has('young-adult') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
                <YoungAdultSlideshow 
                  ref={youngAdultSlideshowRef} 
                  onBookChange={setCurrentYoungAdultBook}
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Writing;