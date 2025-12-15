import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import japaneseBackground from "@/assets/japanese-painting-background.jpg";
import officeView from "@/assets/office-window-view.jpg";
import boysTowerBlocks from "@/assets/boys-tower-blocks.jpeg";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.jpg";
import circlesSingleCover from "@/assets/circles-single-cover.png";
import useEmblaCarousel from 'embla-carousel-react';

const Index = () => {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showMagazine, setShowMagazine] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showTvText, setShowTvText] = useState(false);
  const [animateTvText, setAnimateTvText] = useState(false);
  const [isManualDrag, setIsManualDrag] = useState(false);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const showMagazineRef = useRef(false);

  const images = [
    officeView,
    boysTowerBlocks,
    kyotoTvShop
  ];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 40
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show magazine when scrolled past 80% of viewport
      if (scrollY > viewportHeight * 0.8) {
        console.log('[SLIDESHOW] Setting showMagazine to true');
        setShowMagazine(true);
        showMagazineRef.current = true;
      }
      
      // Show quote quickly when scrolled past 60% of viewport
      if (scrollY > viewportHeight * 0.6) {
        setShowQuote(true);
      }
    };

    // Check on mount in case page loads already scrolled
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync embla with currentImage state and track manual dragging
  useEffect(() => {
    if (!emblaApi) return;
    
    const onPointerDown = (evt: any) => {
      // Only set manual drag if user is actually dragging on the carousel
      // Ignore if it's just a scroll gesture
      if (evt && evt.type === 'pointerdown') {
        setIsManualDrag(true);
      }
    };
    
    const onSettle = () => {
      setIsManualDrag(false);
    };
    
    const onReInit = () => {
      // Only set ready after reInit completes
      // Use ref to avoid stale closure
      console.log('[SLIDESHOW] onReInit fired, showMagazineRef.current:', showMagazineRef.current);
      if (showMagazineRef.current) {
        console.log('[SLIDESHOW] Setting isCarouselReady to true');
        setIsCarouselReady(true);
      }
    };
    
    emblaApi.on('select', () => {
      setCurrentImage(emblaApi.selectedScrollSnap());
    });
    
    emblaApi.on('pointerDown', onPointerDown);
    emblaApi.on('settle', onSettle);
    emblaApi.on('reInit', onReInit);
    
    return () => {
      emblaApi.off('pointerDown', onPointerDown);
      emblaApi.off('settle', onSettle);
      emblaApi.off('reInit', onReInit);
    };
  }, [emblaApi]); // Removed showMagazine dependency to prevent race condition

  // Ensure carousel is ready when slideshow becomes visible
  useEffect(() => {
    if (showMagazine && emblaApi) {
      console.log('[SLIDESHOW] Calling reInit');
      emblaApi.reInit(); // This will trigger the 'reInit' event
    }
  }, [showMagazine, emblaApi]);


  useEffect(() => {
    // Auto-dissolve between images - starts immediately when carousel is ready
    // Adding currentImage to dependencies ensures timer resets after manual slide changes
    if (isCarouselReady && emblaApi && !isManualDrag) {
      // Read current slide index dynamically to avoid stale closure
      const currentSlide = emblaApi.selectedScrollSnap();
      console.log('[SLIDESHOW] Starting auto-advance interval for image:', currentSlide);
      
      // Calculate duration based on current slide
      const duration = currentSlide === 0 ? 12600 : currentSlide === 1 ? 11400 : 42000;
      
      const interval = setInterval(() => {
        const slideBeforeAdvance = emblaApi.selectedScrollSnap();
        console.log('[SLIDESHOW] Auto-advancing from image:', slideBeforeAdvance);
        setIsManualDrag(false); // Ensure we know this is automatic
        emblaApi.scrollNext();
      }, duration);
      
      return () => {
        console.log('[SLIDESHOW] Clearing interval');
        clearInterval(interval);
      };
    } else {
      console.log('[SLIDESHOW] NOT starting interval - isCarouselReady:', isCarouselReady, 'emblaApi:', !!emblaApi, 'isManualDrag:', isManualDrag);
    }
  }, [isCarouselReady, emblaApi, isManualDrag, currentImage]);

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
          className="absolute inset-0 w-full h-full object-cover object-center bg-slate-100"
          style={{ objectPosition: '50% center' }}
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
      <section className="relative bg-background">
        {/* Book Announcement */}
        <div className="container mx-auto px-6 py-12">
          <ScrollFadeUp id="book-announcement" className="text-center mb-8">
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

        {/* Music Banner - Full Width Edge to Edge */}
        <ScrollFadeUp id="music-banner" delay={300} className="w-full">
          <a 
            href="#/music" 
            className="group block w-full"
          >
            <div className="relative w-full overflow-hidden bg-background border-t border-border py-10 md:py-14">
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Main content */}
              <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12 px-4">
                {/* Album art */}
                <img 
                  src={circlesSingleCover} 
                  alt="Circles single cover"
                  className="w-24 h-24 md:w-36 md:h-36 rounded object-cover shadow-xl group-hover:scale-105 transition-transform duration-300"
                />

                {/* Text */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <div>
                    <p className="text-sm md:text-base font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      New Single
                    </p>
                    <h4 className="font-heading text-3xl md:text-5xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
                      CIRCLES
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-semibold group-hover:text-primary transition-colors">
                    <span className="text-base md:text-xl uppercase tracking-wider">Out Now →</span>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </ScrollFadeUp>

        {/* Magazine Cover Section */}
        <div 
          className={`magazine-slide ${showMagazine ? "visible" : ""} embla cursor-pointer`}
          onClick={() => navigate('/writing#kaiju')}
        >
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {images.map((image, index) => (
                <div key={index} className="embla__slide">
                  <div className="relative w-screen h-screen overflow-hidden">
                    <img 
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover ${index === 0 && currentImage === 0 && isCarouselReady ? "animate-slow-zoom" : ""} ${index === 1 && currentImage === 1 && isCarouselReady ? "animate-slow-zoom-out" : ""}`}
                      style={{ objectPosition: 'center' }}
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* PARABLE falling text - only on second image */}
                    {index === 1 && currentImage === 1 && isCarouselReady && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="flex gap-2 md:gap-4 text-white font-bold tracking-wider" style={{ fontFamily: 'Impact, Haettenschweiler, Arial Narrow Bold, sans-serif' }}>
                          <span className="text-6xl md:text-9xl animate-letter-fall-1 opacity-0">P</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-4 opacity-0">A</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-2 opacity-0">R</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-6 opacity-0">A</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-3 opacity-0">B</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-5 opacity-0">L</span>
                          <span className="text-6xl md:text-9xl animate-letter-fall-7 opacity-0">E</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Floating Quote - only appears on first image */}
                    {showQuote && index === 0 && (
                      <div className="absolute top-1/4 right-1/4 max-w-md max-sm:right-[5%] max-sm:max-w-[80%]">
                        <blockquote className="literary-quote text-white/90 leading-relaxed">
                          <div className="text-4xl md:text-5xl font-bold max-sm:text-2xl">'Feelings are the thoughts of the heart.'</div>
                        </blockquote>
                      </div>
                    )}
                    
                    {/* Text overlay for TV shop image */}
                    {showQuote && index === 2 && (
                      <div className="absolute top-1/3 left-1/4 max-w-md max-sm:left-[8%] max-sm:max-w-[80%]">
                        <div className={`tv-shop-text-reveal ${animateTvText ? 'visible' : ''} text-white/90 leading-relaxed max-sm:text-sm`}>
                          <h2 className="font-heading text-3xl md:text-4xl mb-2 max-sm:text-2xl">summer 1979</h2>
                          <h3 className="font-heading text-2xl md:text-3xl mb-4 max-sm:text-xl">Osaka Japan</h3>
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer/Contact */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-6 text-ink-black">Contact</h3>
          <p className="font-body text-muted-foreground">
            kazuki@kazukiyamakawa.com
          </p>
          <div className="flex justify-center space-x-8 mt-8">
            <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="font-body text-ink-black hover:text-ink-black/80 transition-colors">
              About
            </Link>
            <Link to="/writing" onClick={() => window.scrollTo(0, 0)} className="font-body text-ink-black hover:text-ink-black/80 transition-colors">
              Writing
            </Link>
            <Link to="/music" onClick={() => window.scrollTo(0, 0)} className="font-body text-ink-black hover:text-ink-black/80 transition-colors">
              Music
            </Link>
            <Link to="/comics" onClick={() => window.scrollTo(0, 0)} className="font-body text-ink-black hover:text-ink-black/80 transition-colors">
              Comics & Scripts
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
