import { useEffect, useState, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useCirclePhysics } from "@/hooks/useCirclePhysics";
import { useIsMobile } from "@/hooks/use-mobile";
import japaneseBackground from "@/assets/japanese-painting-background.jpg";
import officeView from "@/assets/office-window-view.jpg";
import boysTowerBlocks from "@/assets/boys-tower-blocks.jpeg";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.jpg";
import circlesSingleCover from "@/assets/circles-single-cover.png";
import parableEyeBackground from "@/assets/parable-eye-background-new.png";
import useEmblaCarousel from "embla-carousel-react";

const Index = () => {
  useScrollToTop();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showMagazine, setShowMagazine] = useState(false);
  const [showCirclesBanner, setShowCirclesBanner] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showTvText, setShowTvText] = useState(false);
  const [animateTvText, setAnimateTvText] = useState(false);
  const [isManualDrag, setIsManualDrag] = useState(false);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const showMagazineRef = useRef(false);
  
  // Circle sensitivities - many more circles to fill the background
  const circleSensitivities = useMemo(() => [
    // Original circles (20)
    2.5, 4.0, 1.8, 3.2, 2.8, 2.0, 3.5, 2.4, 3.0, 2.6,
    1.6, 2.0, 1.2, 2.2, 0.8, 1.5, 1.0, 1.8, 2.8, 3.2,
    // Additional circles to fill gaps (20 more)
    1.4, 2.3, 3.1, 1.9, 2.7, 1.3, 3.4, 2.1, 1.7, 2.9,
    0.9, 3.6, 1.1, 2.4, 3.0, 1.5, 2.2, 0.7, 3.3, 1.8
  ], []);
  
  // Physics-based circle animation
  const { offsets: circleOffsets } = useCirclePhysics(
    circleSensitivities.length,
    circleSensitivities
  );
  

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
      
      // Show Circles banner when scrolled past 50% of viewport
      if (scrollY > viewportHeight * 0.5) {
        setShowCirclesBanner(true);
      }
      
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
        <div className="container mx-auto px-6 pt-12 pb-6 relative">
          {/* Eye background image - fades in slowly */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            <img 
              src={parableEyeBackground}
              alt=""
              className="w-full h-full object-cover scale-150 md:scale-[1.55] opacity-0 animate-slow-fade-in-40 translate-y-4 md:translate-y-16"
            />
          </div>
          <ScrollFadeUp id="book-announcement" className="text-center mb-8 relative z-10">
            <h2 className="font-heading text-3xl md:text-5xl mb-4 text-black">
              Book One of The Parable Trilogy
            </h2>
            <h3 className="font-heading text-4xl md:text-6xl font-bold text-primary">
              KAIJU
            </h3>
            <p className="font-handwriting text-3xl md:text-4xl text-black mt-6 inline-block rotate-[-2deg] handwriting-write">
              A metaphysical fantasy
            </p>
            <p className="font-body text-xl text-black mt-6">
              Coming Soon
            </p>
          </ScrollFadeUp>
        </div>

        {/* Music Banner - Full Width Edge to Edge - slide in on scroll */}
        <div
          className={`relative w-full overflow-hidden border-t border-amber-200/50 bg-[#FDF6E8] magazine-slide ${showCirclesBanner ? "visible" : ""}`}
        >
          {/* Sharp circles background - physics-driven with natural drift back to bobbing */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Large circles at edges - Orange - sharp edges, full saturation */}
            <div 
              className="absolute -left-24 top-[10%] w-56 h-56 rounded-full bg-[hsl(25,95%,55%)]"
              style={{ transform: `translateY(${circleOffsets[0]?.y || 0}px)` }}
            ></div>
            {/* Coral/Pink */}
            <div 
              className="absolute -left-16 bottom-[5%] w-44 h-44 rounded-full bg-[hsl(350,75%,60%)]"
              style={{ transform: `translateY(${circleOffsets[1]?.y || 0}px)` }}
            ></div>
            {/* Teal */}
            <div 
              className="absolute left-[2%] top-[60%] w-36 h-36 rounded-full bg-[hsl(180,55%,50%)]"
              style={{ transform: `translateY(${circleOffsets[2]?.y || 0}px)` }}
            ></div>
            
            {/* Blue */}
            <div 
              className="absolute -right-20 top-[20%] w-52 h-52 rounded-full bg-[hsl(215,65%,55%)]"
              style={{ transform: `translateY(${circleOffsets[3]?.y || 0}px)` }}
            ></div>
            {/* Purple */}
            <div 
              className="absolute -right-28 bottom-[15%] w-60 h-60 rounded-full bg-[hsl(320,45%,50%)]"
              style={{ transform: `translateY(${circleOffsets[4]?.y || 0}px)` }}
            ></div>
            {/* Orange */}
            <div 
              className="absolute right-[3%] top-[5%] w-40 h-40 rounded-full bg-[hsl(30,90%,55%)]"
              style={{ transform: `translateY(${circleOffsets[5]?.y || 0}px)` }}
            ></div>
            
            {/* Top edge circles - Coral */}
            <div 
              className="absolute left-[15%] -top-16 w-48 h-48 rounded-full bg-[hsl(5,80%,65%)]"
              style={{ transform: `translateY(${circleOffsets[6]?.y || 0}px)` }}
            ></div>
            {/* Teal */}
            <div 
              className="absolute right-[25%] -top-12 w-40 h-40 rounded-full bg-[hsl(175,50%,48%)]"
              style={{ transform: `translateY(${circleOffsets[7]?.y || 0}px)` }}
            ></div>
            
            {/* Bottom edge circles - Blue */}
            <div 
              className="absolute left-[20%] -bottom-20 w-52 h-52 rounded-full bg-[hsl(220,60%,50%)]"
              style={{ transform: `translateY(${circleOffsets[8]?.y || 0}px)` }}
            ></div>
            {/* Pink */}
            <div 
              className="absolute right-[18%] -bottom-16 w-44 h-44 rounded-full bg-[hsl(340,70%,58%)]"
              style={{ transform: `translateY(${circleOffsets[9]?.y || 0}px)` }}
            ></div>
            
            {/* Medium circles at corners - Purple */}
            <div 
              className="absolute left-[8%] top-[25%] w-28 h-28 rounded-full bg-[hsl(310,40%,52%)]"
              style={{ transform: `translateY(${circleOffsets[10]?.y || 0}px)` }}
            ></div>
            {/* Orange */}
            <div 
              className="absolute right-[6%] bottom-[40%] w-32 h-32 rounded-full bg-[hsl(28,92%,52%)]"
              style={{ transform: `translateY(${circleOffsets[11]?.y || 0}px)` }}
            ></div>
            {/* Teal */}
            <div 
              className="absolute left-[5%] bottom-[30%] w-24 h-24 rounded-full bg-[hsl(185,55%,48%)]"
              style={{ transform: `translateY(${circleOffsets[12]?.y || 0}px)` }}
            ></div>
            {/* Blue */}
            <div 
              className="absolute right-[8%] top-[55%] w-28 h-28 rounded-full bg-[hsl(210,60%,52%)]"
              style={{ transform: `translateY(${circleOffsets[13]?.y || 0}px)` }}
            ></div>
            
            {/* Small accent circles - Pink */}
            <div 
              className="absolute left-[3%] top-[40%] w-20 h-20 rounded-full bg-[hsl(345,72%,62%)]"
              style={{ transform: `translateY(${circleOffsets[14]?.y || 0}px)` }}
            ></div>
            {/* Orange */}
            <div 
              className="absolute right-[4%] top-[35%] w-20 h-20 rounded-full bg-[hsl(35,88%,58%)]"
              style={{ transform: `translateY(${circleOffsets[15]?.y || 0}px)` }}
            ></div>
            {/* Purple */}
            <div 
              className="absolute left-[10%] bottom-[8%] w-16 h-16 rounded-full bg-[hsl(315,42%,55%)]"
              style={{ transform: `translateY(${circleOffsets[16]?.y || 0}px)` }}
            ></div>
            {/* Coral */}
            <div 
              className="absolute right-[12%] bottom-[5%] w-20 h-20 rounded-full bg-[hsl(10,75%,60%)]"
              style={{ transform: `translateY(${circleOffsets[17]?.y || 0}px)` }}
            ></div>
            
            {/* Far corner circles - Blue */}
            <div 
              className="absolute -left-10 top-[45%] w-32 h-32 rounded-full bg-[hsl(225,55%,55%)]"
              style={{ transform: `translateY(${circleOffsets[18]?.y || 0}px)` }}
            ></div>
            {/* Teal */}
            <div 
              className="absolute -right-14 top-[65%] w-36 h-36 rounded-full bg-[hsl(178,52%,52%)]"
              style={{ transform: `translateY(${circleOffsets[19]?.y || 0}px)` }}
            ></div>
            
            {/* Additional circles - only at edges, away from center text - hidden on mobile */}
            {/* Top left area - Orange */}
            <div 
              className="hidden sm:block absolute left-[12%] top-[8%] w-36 h-36 rounded-full bg-[hsl(20,85%,58%)]"
              style={{ transform: `translateY(${circleOffsets[20]?.y || 0}px)` }}
            ></div>
            {/* Bottom left - Coral */}
            <div 
              className="hidden sm:block absolute left-[8%] bottom-[15%] w-32 h-32 rounded-full bg-[hsl(355,70%,62%)]"
              style={{ transform: `translateY(${circleOffsets[21]?.y || 0}px)` }}
            ></div>
            {/* Top right - Blue */}
            <div 
              className="hidden sm:block absolute right-[10%] top-[10%] w-40 h-40 rounded-full bg-[hsl(205,62%,52%)]"
              style={{ transform: `translateY(${circleOffsets[22]?.y || 0}px)` }}
            ></div>
            {/* Bottom right - Teal */}
            <div 
              className="hidden sm:block absolute right-[8%] bottom-[20%] w-32 h-32 rounded-full bg-[hsl(172,50%,50%)]"
              style={{ transform: `translateY(${circleOffsets[23]?.y || 0}px)` }}
            ></div>
            {/* Left edge mid - Purple */}
            <div 
              className="hidden sm:block absolute left-[4%] top-[75%] w-28 h-28 rounded-full bg-[hsl(295,38%,52%)]"
              style={{ transform: `translateY(${circleOffsets[24]?.y || 0}px)` }}
            ></div>
            {/* Right edge mid - Orange */}
            <div 
              className="hidden sm:block absolute right-[5%] top-[70%] w-30 h-30 rounded-full bg-[hsl(32,88%,55%)]"
              style={{ transform: `translateY(${circleOffsets[25]?.y || 0}px)` }}
            ></div>
            {/* Far top left - Pink */}
            <div 
              className="hidden sm:block absolute -left-8 top-[30%] w-36 h-36 rounded-full bg-[hsl(338,65%,60%)]"
              style={{ transform: `translateY(${circleOffsets[26]?.y || 0}px)` }}
            ></div>
            {/* Far bottom left - Blue */}
            <div 
              className="hidden sm:block absolute -left-12 bottom-[25%] w-42 h-42 rounded-full bg-[hsl(218,58%,54%)]"
              style={{ transform: `translateY(${circleOffsets[27]?.y || 0}px)` }}
            ></div>
            {/* Far top right - Teal */}
            <div 
              className="hidden sm:block absolute -right-10 top-[35%] w-38 h-38 rounded-full bg-[hsl(168,52%,48%)]"
              style={{ transform: `translateY(${circleOffsets[28]?.y || 0}px)` }}
            ></div>
            {/* Far bottom right - Coral */}
            <div 
              className="hidden sm:block absolute -right-8 bottom-[35%] w-34 h-34 rounded-full bg-[hsl(8,78%,58%)]"
              style={{ transform: `translateY(${circleOffsets[29]?.y || 0}px)` }}
            ></div>
          </div>

          <Link to="/music" className="group relative z-10 block w-full py-10 md:py-14">

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12 px-4">
              {/* Album art - shifted left */}
              <div className="-ml-4 md:-ml-8">
                <img
                  src={circlesSingleCover}
                  alt="Circles single cover"
                  className="w-36 h-36 md:w-52 md:h-52 rounded-lg object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-black/5"
                />
              </div>

              {/* Text - shifted right, centered vertically */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 ml-2 md:ml-4 -mt-2 md:-mt-3">
                <div>
                  <p className="text-sm md:text-base font-bold uppercase tracking-widest text-rose-600/80 mb-1">
                    New Single
                  </p>
                  <h4 className="font-heading text-3xl md:text-5xl font-black text-foreground tracking-tight group-hover:text-rose-600 transition-colors duration-300 drop-shadow-sm">
                    CIRCLES
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-foreground/80 font-semibold group-hover:text-rose-600 transition-colors">
                  <span className="text-base md:text-xl uppercase tracking-wider">Out Now →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

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
