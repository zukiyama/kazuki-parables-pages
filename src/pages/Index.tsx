import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import japaneseBackground from "@/assets/japanese-painting-background.jpg";
import officeView from "@/assets/office-window-view.jpg";
import boysCometOilPainting from "@/assets/boys-comet-oil-painting-1970s.jpg";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.jpg";
import ohioSingleCover from "@/assets/IMG_7765.png";

const Index = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showMagazine, setShowMagazine] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showTvText, setShowTvText] = useState(false);
  const [animateTvText, setAnimateTvText] = useState(false);

  const images = [
    officeView,
    boysCometOilPainting,
    kyotoTvShop
  ];

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
    // Auto-dissolve between images
    if (showMagazine) {
      const interval = setInterval(() => {
        setCurrentImage(prev => (prev + 1) % images.length);
      }, currentImage === 0 ? 12600 : currentImage === 1 ? 8400 : 42000); // First: 12.6s, Second: 8.4s, Third: 42s
      
      return () => clearInterval(interval);
    }
  }, [showMagazine, images.length, currentImage]);

  // Handle TV text animation timing
  useEffect(() => {
    if (currentImage === 2) {
      setShowTvText(true);
      // Small delay to allow CSS initial state to render before animation
      const animationTimer = setTimeout(() => {
        setAnimateTvText(true);
      }, 100);
      return () => clearTimeout(animationTimer);
    } else {
      setShowTvText(false);
      setAnimateTvText(false);
    }
  }, [currentImage]);

  return (
    <div className="relative">
      <Navigation />
      
      {/* Hero Section with Japanese Painting */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden bg-background">
        <img 
          src={japaneseBackground} 
          alt="Japanese painting background" 
          className="absolute inset-0 w-full h-full object-cover object-center"
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

          {/* Music Banner */}
          <ScrollFadeUp id="music-banner" delay={300} className="flex justify-center mt-12">
            <a 
              href="#/music" 
              className="group block w-full max-w-2xl hover-scale transition-all duration-300"
            >
              <div className="bg-gradient-to-r from-card/90 to-card/70 backdrop-blur-sm border border-border rounded-xl p-8 flex items-center gap-8 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
                <div className="relative">
                  <img 
                    src={ohioSingleCover} 
                    alt="Ohio single cover" 
                    className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-contain shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                    NEW
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-heading text-sm md:text-base font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    New Single
                  </p>
                  <h4 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    Ohio
                  </h4>
                  <p className="font-body text-base md:text-lg text-muted-foreground mb-4">
                    Available Now
                  </p>
                  <div className="flex items-center gap-2 text-primary group-hover:gap-4 transition-all duration-300">
                    <span className="font-body font-medium">Listen Now</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
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
                } ${index === 1 ? "animate-slow-zoom-meteor" : "animate-slow-zoom"}`}
                style={{ backgroundImage: `url(${image})` }}
              >
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            ))}
            
            {/* Floating Quote - fades in during first image, stays during most of second, fades out at end of second */}
            {showQuote && (currentImage === 0 || currentImage === 1) && (
              <div className="absolute top-1/4 right-1/4 max-w-md">
                <div className={`${
                  currentImage === 0 ? 'opacity-100' : 
                  currentImage === 1 ? 'opacity-100 animate-quote-fade-out-delayed' : 'opacity-0'
                }`}>
                  <blockquote className="literary-quote text-white/90 leading-relaxed">
                    <div className="text-4xl md:text-5xl font-bold">'Feelings are the thoughts of the heart.'</div>
                  </blockquote>
                </div>
              </div>
            )}
            
            {/* Text overlay for TV shop image */}
            {showQuote && currentImage === 2 && (
              <div className="absolute top-1/3 left-1/4 max-w-md">
                <div className={`tv-shop-text-reveal ${animateTvText ? 'visible' : ''} text-white/90 leading-relaxed`}>
                  <h2 className="font-heading text-3xl md:text-4xl mb-2">summer 1979</h2>
                  <h3 className="font-heading text-2xl md:text-3xl mb-4">Osaka Japan</h3>
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
