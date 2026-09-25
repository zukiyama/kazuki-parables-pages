import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ScrollFadeUp } from "@/components/ScrollAnimations";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useHeroHeight } from "@/hooks/useHeroHeight";
import { useIsMobile } from "@/hooks/use-mobile";
import japaneseBackground from "@/assets/japanese-painting-background.webp";
import officeView from "@/assets/office-window-view.webp";
import boysTowerBlocks from "@/assets/boys-tower-blocks.webp";
import kyotoTvShop from "@/assets/kyoto-tv-shop-realistic.webp";
import circlesSingleCover from "@/assets/circles-single-cover.webp";
import sixtiesVarietyShow from "@/assets/sixties-variety-show.webp";
import godOfLiesManyFacesBanner from "@/assets/god-of-lies-many-faces-banner.webp";
import parableBoysStreet from "@/assets/parable-boys-street.webp";
import useEmblaCarousel from "embla-carousel-react";

const Index = () => {
  useScrollToTop();
  useHeroHeight();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showParableBanner, setShowParableBanner] = useState(false);
  const [showQuote, setShowQuote] = useState(false);
  const [showTvText, setShowTvText] = useState(false);
  const [animateTvText, setAnimateTvText] = useState(false);
  const [isManualDrag, setIsManualDrag] = useState(false);
  const [isCarouselReady, setIsCarouselReady] = useState(false);
  const [heroBackgroundReady, setHeroBackgroundReady] = useState(false);
  
  // Parable banner slideshow state - using Embla for continuous right-scroll
  const [parableBannerSlide, setParableBannerSlide] = useState(0);
  const parableBannerRef = useRef<HTMLDivElement>(null);
  
  // Embla carousel for Parable/God of Lies banner
  const [parableEmblaRef, parableEmblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });
  
  const images = [
    officeView,
    boysTowerBlocks,
    kyotoTvShop
  ];
  
  // Bottom slideshow carousel with fade effect (no sliding)
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    duration: 0, // Instant for fade effect
    watchDrag: true // Still allow touch/drag detection
  });
  
  // Parable banner auto-advance every 8 seconds - always scroll right
  // Adding parableBannerSlide to dependencies resets timer on manual transitions
  useEffect(() => {
    if (!showParableBanner || !parableEmblaApi) return;
    
    const interval = setInterval(() => {
      parableEmblaApi.scrollNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [showParableBanner, parableEmblaApi, parableBannerSlide]);
  
  // Sync Parable banner slide state with Embla
  useEffect(() => {
    if (!parableEmblaApi) return;
    
    const onSelect = () => {
      setParableBannerSlide(parableEmblaApi.selectedScrollSnap());
    };
    
    onSelect();
    parableEmblaApi.on("select", onSelect);
    return () => {
      parableEmblaApi.off("select", onSelect);
    };
  }, [parableEmblaApi]);
  
  // Handle dot clicks - always scroll forward (right)
  const scrollParableTo = (index: number) => {
    if (!parableEmblaApi) return;
    
    const currentIndex = parableEmblaApi.selectedScrollSnap();
    const totalSlides = 2;
    
    if (index !== currentIndex) {
      const forwardSteps = (index - currentIndex + totalSlides) % totalSlides;
      for (let i = 0; i < forwardSteps; i++) {
        setTimeout(() => {
          parableEmblaApi.scrollNext();
        }, i * 50);
      }
    }
  };

  const magazineRef = useRef<HTMLDivElement>(null);
  
  // Start the Parable carousel when its banner approaches the viewport.
  useEffect(() => {
    let parableTriggered = false;
    
    // Use IntersectionObserver for sequential triggering
    // Trigger when element is 200px from entering viewport (earlier than before, but still visible)
    const observerOptions = { threshold: 0.01, rootMargin: '200px 0px 0px 0px' };
    
    const parableObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !parableTriggered) {
          parableTriggered = true;
          setShowParableBanner(true);
        }
      });
    }, observerOptions);
    
    // Observe the Parable banner as the trigger point
    if (parableBannerRef.current) {
      parableObserver.observe(parableBannerRef.current);
    }
    
    // Fallback scroll handler for quote visibility
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show quote when scrolled past 50% of viewport
      if (scrollY > viewportHeight * 0.5) {
        setShowQuote(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      parableObserver.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
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
      setIsCarouselReady(true);
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

  // Ensure the carousel is ready without waiting for a section entrance animation.
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
  }, [emblaApi]);


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

  // Load and decode hero background, then fade in
  useEffect(() => {
    const img = new Image();
    img.onload = async () => {
      try {
        await img.decode();
      } catch (e) {
        // Fallback if decode fails
      } finally {
        setHeroBackgroundReady(true);
      }
    };
    img.onerror = () => {
      setHeroBackgroundReady(true);
    };
    img.src = japaneseBackground;
  }, []);

  // Pre-decode the Parable banner images on mount so scrolling down from the
  // hero never paints an empty backing while the first banner loads.
  useEffect(() => {
    [parableBoysStreet, godOfLiesManyFacesBanner].forEach((src) => {
      const img = new Image();
      img.onload = () => {
        img.decode().catch(() => {});
      };
      img.src = src;
    });
  }, []);

  return (
    <div className="relative min-h-screen-stable flex flex-col overflow-hidden">
      <Navigation />
      
      {/* Hero Section with Japanese Painting */}
      {/* All devices use --hero-h for perfect bottom alignment */}
      <section className="h-[calc(var(--hero-h,100dvh)-56px)] mt-14 flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: 'hsl(20, 30%, 15%)' }}>
        <img 
          src={japaneseBackground} 
          alt="Japanese painting background" 
          className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out"
          style={{ objectPosition: '50% center', opacity: heroBackgroundReady ? 1 : 0 }}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          width={2560}
          height={1440}
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div 
          className="relative z-20 text-center px-6 transition-opacity duration-700 ease-in-out"
          style={{ opacity: heroBackgroundReady ? 1 : 0 }}
        >
          <h1 className="font-heading text-6xl md:text-8xl font-bold text-ink-black mb-4 tracking-wide drop-shadow-md">
            Kazuki Yamakawa
          </h1>
          <p 
            className="font-body text-xl md:text-2xl text-foreground/80 transition-opacity duration-700 ease-in-out"
            style={{ opacity: heroBackgroundReady ? 1 : 0, transitionDelay: heroBackgroundReady ? '700ms' : '0ms' }}
          >
            Writer • Musician
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative bg-ink-black">
        {/* Parable Banner Slideshow - Full Width with Embla Carousel */}
        <div
          ref={parableBannerRef}
          className="relative w-full bg-ink-black"
        >
          <div className="overflow-hidden bg-ink-black" ref={parableEmblaRef}>
            <div className="flex">
              {/* Slide 1: Parable Trilogy */}
              <div className="flex-[0_0_100%] min-w-0 relative h-[280px] md:h-[320px] bg-ink-black">
                {/* Left/Right click zones for navigation */}
                <div 
                  className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => scrollParableTo(0)}
                />
                <div 
                  className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => scrollParableTo(1)}
                />
                {/* Center click zone navigates to Writing page */}
                <div 
                  className="absolute left-1/3 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => navigate('/writing#kaiju')}
                />
                <img 
                  src={parableBoysStreet}
                  alt="Parable Trilogy background"
                  className="absolute inset-0 w-full h-full object-cover object-bottom"
                  style={{ objectPosition: '52% bottom', transform: 'scale(1.02)' }}
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <ScrollFadeUp id="book-announcement" className="text-center">
                    <h2 className="font-heading text-3xl md:text-5xl mb-4 text-white drop-shadow-lg">
                      Book One of The Parable Trilogy
                    </h2>
                    <h3 
                      className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.15em] text-amber-200 drop-shadow-lg"
                      style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
                    >
                      KAIJU
                    </h3>
                    <p className="text-3xl md:text-4xl text-white mt-6 inline-block rotate-[-2deg] font-handwriting handwriting-write drop-shadow-lg">
                      <span style={{ fontFamily: 'Allura, cursive', fontSize: '1.3em' }}>A</span>
                      <span style={{ fontFamily: 'Great Vibes, cursive' }}> metaphysical fantasy</span>
                    </p>
                    <p className="font-body text-xl text-white mt-6 drop-shadow-lg">
                      Coming Soon
                    </p>
                  </ScrollFadeUp>
                </div>
              </div>
              
              {/* Slide 2: God of Lies */}
              <div 
                className="flex-[0_0_100%] min-w-0 relative h-[280px] md:h-[320px] bg-ink-black"
              >
                {/* Left/Right click zones for navigation */}
                <div 
                  className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => scrollParableTo(0)}
                />
                <div 
                  className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => navigate('/comics')}
                />
                <div 
                  className="absolute left-1/3 top-0 w-1/3 h-full z-10 cursor-pointer"
                  onClick={() => navigate('/comics')}
                />
                <img 
                  src={godOfLiesManyFacesBanner}
                  alt="God of Lies - Many Faces"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: '40% center' }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10" />
                {/* Text overlay with white background */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/95 px-6 py-4 md:px-8 md:py-5 text-center shadow-lg">
                    <p 
                      className="text-xs md:text-sm text-slate-500 uppercase tracking-[0.2em] mb-2"
                      style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}
                    >
                      Featured Comic
                    </p>
                    <div className="flex flex-col items-center gap-0.5 md:gap-1">
                      <span 
                        className="text-2xl md:text-4xl lg:text-5xl text-slate-900"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          lineHeight: 1.1
                        }}
                      >
                        GOD
                      </span>
                      <span 
                        className="text-base md:text-lg lg:text-xl text-slate-600 italic"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 400,
                          letterSpacing: '0.2em',
                          lineHeight: 1
                        }}
                      >
                        of
                      </span>
                      <span 
                        className="text-2xl md:text-4xl lg:text-5xl text-slate-900"
                        style={{ 
                          fontFamily: 'Playfair Display, Georgia, serif',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          lineHeight: 1.1
                        }}
                      >
                        LIES
                      </span>
                    </div>
                    <div className="w-12 md:w-16 h-0.5 bg-red-600 mx-auto mt-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Slideshow indicator - clickable dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollParableTo(0); }}
              className={`transition-all duration-300 cursor-pointer ${parableBannerSlide === 0 ? 'w-6 h-2 rounded-full bg-white' : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white/90'}`}
              aria-label="View Parable Trilogy"
            />
            <button 
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); scrollParableTo(1); }}
              className={`transition-all duration-300 cursor-pointer ${parableBannerSlide === 1 ? 'w-6 h-2 rounded-full bg-white' : 'w-2 h-2 rounded-full bg-white/60 hover:bg-white/90'}`}
              aria-label="View God of Lies"
            />
          </div>
        </div>

        {/* Music Banner - temporary still, ready to be replaced by a looping film */}
        <div
          className="relative w-full overflow-hidden bg-black"
        >
          <img
            src={sixtiesVarietyShow}
            alt="Singer performing with an orchestra on a 1960s television variety show"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale"
            loading="lazy"
            width={1920}
            height={768}
          />
          <div className="absolute inset-0 bg-black/45" />

          <Link to="/music" className="group relative z-10 block w-full py-8 md:py-10">

            {/* Main content */}
            <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12 px-4">
              {/* Album art - shifted left */}
              <div className="-ml-4 md:-ml-8">
                <img
                  src={circlesSingleCover}
                  alt="Circles single cover"
                  className="w-36 h-36 md:w-52 md:h-52 rounded-lg object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-black/5"
                  loading="lazy"
                />
              </div>

              {/* Text - shifted right, centered vertically */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 ml-2 md:ml-4 -mt-2 md:-mt-3">
                <div>
                  <p className="text-sm md:text-base font-bold uppercase tracking-widest text-rose-600/80 mb-1">
                    New Single
                  </p>
                  <h4 className="font-heading text-3xl md:text-5xl font-black text-white tracking-tight transition-colors duration-300 drop-shadow-lg">
                    CIRCLES
                  </h4>
                </div>
                <div className="flex items-center gap-2 text-white/90 font-semibold transition-colors">
                  <span className="text-base md:text-xl uppercase tracking-wider">Out Now →</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Magazine Cover Section - Dissolve Slideshow */}
        <div 
          ref={magazineRef}
          className="cursor-pointer relative"
          onClick={() => navigate('/writing#kaiju')}
          onTouchStart={(e) => {
            const touch = e.touches[0];
            (e.currentTarget as any).touchStartX = touch.clientX;
          }}
          onTouchEnd={(e) => {
            const touchStartX = (e.currentTarget as any).touchStartX;
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                // Swipe left - next
                if (emblaApi) emblaApi.scrollNext();
              } else {
                // Swipe right - prev
                if (emblaApi) emblaApi.scrollPrev();
              }
            }
          }}
        >
          {/* Hidden embla for state management */}
          <div className="hidden" ref={emblaRef}>
            <div className="embla__container">
              {images.map((_, index) => (
                <div key={index} className="embla__slide" />
              ))}
            </div>
          </div>
          
          {/* Dissolve slides */}
          <div className="relative w-screen overflow-hidden" style={{ height: 'calc(var(--app-height, 100dvh) * 0.905)' }}>
            {images.map((image, index) => (
              <div 
                key={index} 
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                {/* Stable wrapper - no key changes to avoid remounting */}
                <div className="absolute inset-0 overflow-hidden">
                  {/* Inner zoom container - animation runs continuously, never resets */}
                  <div 
                    className={`absolute inset-0 ${index === 0 && isCarouselReady ? "animate-slow-zoom-hold" : ""} ${index === 1 && isCarouselReady ? "animate-slow-zoom-out" : ""}`}
                    style={{ 
                      animationPlayState: currentImage === index ? 'running' : 'paused'
                    }}
                  >
                    <img 
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ objectPosition: 'center bottom' }}
                      loading="lazy"
                    />
                  </div>
                </div>
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
                {showQuote && index === 0 && currentImage === 0 && (
                  <div className="absolute top-1/4 right-1/4 max-w-md max-sm:right-[5%] max-sm:max-w-[80%]">
                    <blockquote className="literary-quote text-white/90 leading-relaxed">
                      <div className="text-4xl md:text-5xl font-bold max-sm:text-2xl">'Feelings are the thoughts of the heart.'</div>
                    </blockquote>
                  </div>
                )}
                
                {/* Text overlay for TV shop image */}
                {showQuote && index === 2 && currentImage === 2 && (
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
            ))}
          </div>
        </div>
      </section>

      <Footer variant="light" />
    </div>
  );
};

export default Index;
