import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import japaneseBackground from "@/assets/japanese-painting-background.jpg";
import officeView from "@/assets/office-window-view.jpg";
import boysSummerField from "@/assets/boys-summer-field-1970s.jpg";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.jpg";

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showMagazine, setShowMagazine] = useState(false);
  const [showQuote, setShowQuote] = useState(false);

  const images = [officeView, boysSummerField, kyotoTvShop];

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show magazine when scrolled past 80% of viewport
      if (scrollY > viewportHeight * 0.8) {
        setShowMagazine(true);
      }
      
      // Show quote quickly when scrolled past 60% of viewport
      if (scrollY > viewportHeight * 0.6) {
        setShowQuote(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Auto-dissolve between images with proper timing for quote
    if (showMagazine) {
      const interval = setInterval(() => {
        setCurrentImage(prev => {
          const next = (prev + 1) % images.length;
          return next;
        });
      }, currentImage === 0 ? 12600 : currentImage === 1 ? 8400 : 42000); // First: 12.6s, Second: 8.4s, Third: 42s (30% faster)
      
      return () => clearInterval(interval);
    }
  }, [showMagazine, images.length, currentImage]);

  return (
    <div className="relative">
      <Navigation />
      
      {/* Hero Section with Japanese Painting */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-background">
        {/* Wooden frame top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-amber-900 via-amber-700 to-amber-800 shadow-lg z-10" 
             style={{
               background: 'linear-gradient(180deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
               boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
             }}>
          <div className="h-full bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
        </div>
        
        {/* Wooden frame bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-amber-900 via-amber-700 to-amber-800 shadow-lg z-10"
             style={{
               background: 'linear-gradient(0deg, #8B4513 0%, #A0522D 50%, #654321 100%)',
               boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.3), 0 -4px 8px rgba(0,0,0,0.2)'
             }}>
          <div className="h-full bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>
        </div>
        
        <img 
          src={japaneseBackground} 
          alt="Japanese painting background" 
          className="absolute inset-0 w-full h-full object-contain object-center"
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-20 text-center px-6">
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-ink-black mb-4 tracking-wide drop-shadow-md">
            Kazuki Yamakawa
          </h1>
          <p className="font-body text-xl md:text-2xl text-foreground/80 animate-fade-in-delayed">
            Writer • Musician
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="min-h-screen relative bg-background">
        {/* Book Announcement */}
        <div className="container mx-auto px-6 py-12">
          <ScrollFadeUp id="book-announcement" className="text-center mb-16">
            <h2 className="font-heading text-3xl md:text-5xl mb-4" style={{ color: '#2d1b1b' }}>
              Book One of The Parable Trilogy
            </h2>
            <h3 className="font-heading text-4xl md:text-6xl font-bold text-primary">
              KAIJU
            </h3>
            <p className="font-handwriting text-3xl md:text-4xl text-primary mt-6 inline-block rotate-[-2deg] handwriting-write">
              A metaphysical fantasy
            </p>
            <p className="font-body text-xl text-muted-foreground mt-6">
              Coming Soon
            </p>
          </ScrollFadeUp>
        </div>

        {/* Magazine Cover Section */}
        <div className={`magazine-slide ${showMagazine ? "visible" : ""} relative`}>
          <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[7000ms] ease-in-out ${
                  index === currentImage ? "opacity-100" : "opacity-0"
                } ${index === 1 ? "animate-slow-zoom-to-sky" : "animate-slow-zoom"}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            ))}
            
            {/* Floating Quote - consistent 2-line format throughout first two images */}
            {showQuote && (currentImage === 0 || currentImage === 1) && (
              <div className="absolute top-1/4 right-1/4 max-w-md">
                <div className={`transition-opacity duration-[5000ms] ${currentImage === 0 ? 'opacity-100' : 'opacity-0'}`}>
                  <blockquote className="literary-quote text-white/90 leading-relaxed">
                    <div className="text-4xl md:text-5xl font-bold">Feelings</div>
                    <div className="text-3xl md:text-4xl font-semibold">are the thoughts of the heart.</div>
                  </blockquote>
                </div>
              </div>
            )}
            
            {/* Text overlay for TV shop image */}
            {showQuote && currentImage === 2 && (
              <div className="absolute top-1/3 left-1/4 max-w-md">
                <ScrollFadeUp id="tv-shop-text" delay={500}>
                  <div className="text-white/90 leading-relaxed animate-fade-in">
                    <h2 className="font-heading text-3xl md:text-4xl mb-2">summer 1979</h2>
                    <h3 className="font-heading text-2xl md:text-3xl mb-4">Kyoto Japan</h3>
                    <div className="border-t border-white/30 pt-4">
                      <h4 className="font-heading text-2xl md:text-3xl font-bold mb-2">KAIJU</h4>
                      <div className="font-body text-sm md:text-base text-white/80">
                        <span className="italic">noun</span> /ˈkaɪdʒuː/<br/>
                        <span className="font-medium">mysterious beast</span>
                      </div>
                    </div>
                    <div className="mt-8 text-center">
                      <div className="font-mono text-2xl md:text-4xl font-bold text-white animate-pulse tracking-wider">
                        <span className="filter blur-[0.5px] opacity-90">SOMETHING IS COMING</span>
                      </div>
                    </div>
                  </div>
                </ScrollFadeUp>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer/Contact */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-6 text-ink-black">Contact</h3>
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
          <div className="flex justify-center space-x-8 mt-8">
            <a href="#/writing" className="font-body text-accent hover:text-accent/80 transition-colors">
              Writing
            </a>
            <a href="#/music" className="font-body text-accent hover:text-accent/80 transition-colors">
              Music
            </a>
            <a href="#/comics" className="font-body text-accent hover:text-accent/80 transition-colors">
              Comics
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
