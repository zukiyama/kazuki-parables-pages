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
        <div className="container mx-auto px-6 pt-12 pb-6">
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
            <div className="relative w-full overflow-hidden border-t border-amber-200/50 py-10 md:py-14" style={{ backgroundColor: '#FDF6E8' }}>
              {/* Decorative bokeh circles - warm cream/coral palette matching single cover */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Extra large partial circles extending off edges */}
                <div className="absolute -right-28 -bottom-32 w-72 h-72 rounded-full bg-rose-400/35 animate-bokeh-pulse-1 animate-drift-1"></div>
                <div className="absolute -left-24 -top-22 w-60 h-60 rounded-full bg-amber-400/30 animate-bokeh-pulse-3 animate-drift-2"></div>
                <div className="absolute -left-18 bottom-[12%] w-48 h-48 rounded-full bg-orange-300/28 animate-bokeh-pulse-5 animate-drift-3"></div>
                <div className="absolute -right-16 top-[8%] w-44 h-44 rounded-full bg-rose-300/30 animate-bokeh-pulse-7 animate-drift-4"></div>
                <div className="absolute -bottom-20 left-[28%] w-56 h-56 rounded-full animate-bokeh-pulse-2 animate-drift-5" style={{ backgroundColor: 'rgba(248, 131, 121, 0.25)' }}></div>
                <div className="absolute -top-24 right-[22%] w-52 h-52 rounded-full bg-amber-300/28 animate-bokeh-pulse-6 animate-drift-6"></div>
                <div className="absolute -left-32 top-[40%] w-52 h-52 rounded-full bg-amber-300/22 animate-bokeh-pulse-9 animate-drift-1"></div>
                <div className="absolute -right-36 bottom-[20%] w-68 h-68 rounded-full animate-bokeh-pulse-8 animate-drift-3" style={{ backgroundColor: 'rgba(255, 204, 170, 0.25)' }}></div>
                
                {/* Large circles */}
                <div className="absolute left-[2%] top-[18%] w-36 h-36 rounded-full bg-rose-300/38 animate-bokeh-pulse-2 animate-drift-3"></div>
                <div className="absolute right-[12%] bottom-[6%] w-34 h-34 rounded-full bg-amber-400/35 animate-bokeh-pulse-4 animate-drift-1"></div>
                <div className="absolute left-[50%] top-[3%] w-32 h-32 rounded-full bg-orange-300/38 animate-bokeh-pulse-6 animate-drift-5"></div>
                <div className="absolute right-[30%] bottom-[20%] w-30 h-30 rounded-full bg-rose-400/40 animate-bokeh-pulse-8 animate-drift-2"></div>
                <div className="absolute left-[72%] bottom-[3%] w-34 h-34 rounded-full bg-pink-300/32 animate-bokeh-pulse-1 animate-drift-4"></div>
                <div className="absolute right-[58%] top-[0%] w-32 h-32 rounded-full bg-amber-300/36 animate-bokeh-pulse-3 animate-drift-6"></div>
                <div className="absolute left-[18%] bottom-[0%] w-30 h-30 rounded-full bg-rose-200/35 animate-bokeh-pulse-5 animate-drift-1"></div>
                <div className="absolute right-[0%] top-[38%] w-28 h-28 rounded-full bg-orange-400/32 animate-bokeh-pulse-7 animate-drift-3"></div>
                <div className="absolute left-[85%] top-[5%] w-32 h-32 rounded-full animate-bokeh-pulse-2 animate-drift-5" style={{ backgroundColor: 'rgba(248, 131, 121, 0.30)' }}></div>
                <div className="absolute right-[75%] bottom-[8%] w-30 h-30 rounded-full bg-amber-200/38 animate-bokeh-pulse-4 animate-drift-2"></div>
                
                {/* Medium-large circles */}
                <div className="absolute left-[6%] top-[48%] w-26 h-26 rounded-full bg-rose-400/40 animate-bokeh-pulse-1 animate-drift-2"></div>
                <div className="absolute right-[22%] top-[15%] w-24 h-24 rounded-full bg-amber-400/42 animate-bokeh-pulse-3 animate-drift-4"></div>
                <div className="absolute left-[33%] top-[38%] w-22 h-22 rounded-full bg-pink-400/38 animate-bokeh-pulse-5 animate-drift-6"></div>
                <div className="absolute right-[4%] bottom-[38%] w-24 h-24 rounded-full bg-orange-400/40 animate-bokeh-pulse-7 animate-drift-1"></div>
                <div className="absolute left-[62%] bottom-[10%] w-22 h-22 rounded-full bg-rose-300/40 animate-bokeh-pulse-2 animate-drift-3"></div>
                <div className="absolute right-[48%] top-[8%] w-20 h-20 rounded-full bg-amber-500/35 animate-bokeh-pulse-4 animate-drift-5"></div>
                <div className="absolute left-[8%] top-[72%] w-21 h-21 rounded-full bg-pink-200/42 animate-bokeh-pulse-6 animate-drift-2"></div>
                <div className="absolute right-[38%] bottom-[46%] w-20 h-20 rounded-full bg-rose-200/40 animate-bokeh-pulse-9 animate-drift-4"></div>
                <div className="absolute left-[42%] bottom-[5%] w-24 h-24 rounded-full animate-bokeh-pulse-1 animate-drift-6" style={{ backgroundColor: 'rgba(255, 180, 150, 0.35)' }}></div>
                <div className="absolute right-[65%] top-[25%] w-22 h-22 rounded-full bg-amber-300/40 animate-bokeh-pulse-5 animate-drift-1"></div>
                
                {/* Medium circles */}
                <div className="absolute left-[20%] bottom-[36%] w-20 h-20 rounded-full bg-rose-400/42 animate-bokeh-pulse-1 animate-drift-5"></div>
                <div className="absolute right-[26%] top-[26%] w-18 h-18 rounded-full bg-amber-400/45 animate-bokeh-pulse-3 animate-drift-1"></div>
                <div className="absolute left-[43%] top-[52%] w-17 h-17 rounded-full bg-pink-400/40 animate-bokeh-pulse-5 animate-drift-3"></div>
                <div className="absolute right-[10%] bottom-[52%] w-19 h-19 rounded-full bg-orange-400/42 animate-bokeh-pulse-7 animate-drift-6"></div>
                <div className="absolute left-[56%] bottom-[23%] w-18 h-18 rounded-full bg-rose-300/42 animate-bokeh-pulse-2 animate-drift-2"></div>
                <div className="absolute right-[53%] top-[33%] w-16 h-16 rounded-full bg-amber-500/40 animate-bokeh-pulse-4 animate-drift-4"></div>
                <div className="absolute left-[80%] top-[22%] w-17 h-17 rounded-full bg-pink-300/45 animate-bokeh-pulse-6 animate-drift-1"></div>
                <div className="absolute right-[70%] bottom-[28%] w-16 h-16 rounded-full bg-rose-200/42 animate-bokeh-pulse-10 animate-drift-5"></div>
                <div className="absolute left-[38%] top-[10%] w-18 h-18 rounded-full bg-orange-300/38 animate-bokeh-pulse-2 animate-drift-3"></div>
                <div className="absolute right-[80%] top-[52%] w-17 h-17 rounded-full bg-amber-200/42 animate-bokeh-pulse-6 animate-drift-6"></div>
                <div className="absolute left-[68%] top-[60%] w-16 h-16 rounded-full bg-rose-400/38 animate-bokeh-pulse-3 animate-drift-2"></div>
                <div className="absolute right-[15%] bottom-[18%] w-18 h-18 rounded-full bg-pink-400/40 animate-bokeh-pulse-7 animate-drift-4"></div>
                
                {/* Small-medium circles */}
                <div className="absolute left-[46%] bottom-[40%] w-16 h-16 rounded-full bg-rose-300/45 animate-bokeh-pulse-1 animate-drift-4"></div>
                <div className="absolute right-[16%] top-[42%] w-15 h-15 rounded-full bg-amber-500/42 animate-bokeh-pulse-3 animate-drift-2"></div>
                <div className="absolute left-[70%] top-[35%] w-14 h-14 rounded-full bg-pink-300/45 animate-bokeh-pulse-5 animate-drift-6"></div>
                <div className="absolute right-[60%] bottom-[16%] w-16 h-16 rounded-full bg-orange-400/42 animate-bokeh-pulse-9 animate-drift-1"></div>
                <div className="absolute left-[26%] top-[20%] w-15 h-15 rounded-full bg-rose-200/45 animate-bokeh-pulse-2 animate-drift-5"></div>
                <div className="absolute right-[6%] bottom-[26%] w-14 h-14 rounded-full bg-amber-400/42 animate-bokeh-pulse-4 animate-drift-3"></div>
                <div className="absolute left-[86%] bottom-[46%] w-13 h-13 rounded-full bg-rose-400/45 animate-bokeh-pulse-6 animate-drift-2"></div>
                <div className="absolute right-[76%] top-[30%] w-14 h-14 rounded-full bg-orange-300/42 animate-bokeh-pulse-8 animate-drift-4"></div>
                <div className="absolute left-[12%] bottom-[12%] w-15 h-15 rounded-full animate-bokeh-pulse-1 animate-drift-6" style={{ backgroundColor: 'rgba(255, 160, 130, 0.40)' }}></div>
                <div className="absolute right-[42%] top-[58%] w-14 h-14 rounded-full bg-amber-300/45 animate-bokeh-pulse-5 animate-drift-1"></div>
                
                {/* Small circles */}
                <div className="absolute left-[13%] bottom-[56%] w-13 h-13 rounded-full bg-rose-400/48 animate-bokeh-pulse-1 animate-drift-6"></div>
                <div className="absolute right-[33%] top-[60%] w-12 h-12 rounded-full bg-amber-400/45 animate-bokeh-pulse-3 animate-drift-1"></div>
                <div className="absolute left-[60%] top-[66%] w-11 h-11 rounded-full bg-pink-500/42 animate-bokeh-pulse-5 animate-drift-3"></div>
                <div className="absolute right-[43%] bottom-[10%] w-13 h-13 rounded-full bg-orange-300/48 animate-bokeh-pulse-10 animate-drift-5"></div>
                <div className="absolute left-[36%] bottom-[63%] w-12 h-12 rounded-full bg-rose-300/45 animate-bokeh-pulse-2 animate-drift-2"></div>
                <div className="absolute right-[20%] top-[70%] w-11 h-11 rounded-full bg-amber-400/48 animate-bokeh-pulse-4 animate-drift-4"></div>
                <div className="absolute left-[3%] top-[62%] w-12 h-12 rounded-full bg-rose-200/45 animate-bokeh-pulse-6 animate-drift-6"></div>
                <div className="absolute right-[50%] top-[76%] w-10 h-10 rounded-full bg-orange-400/48 animate-bokeh-pulse-8 animate-drift-1"></div>
                <div className="absolute left-[90%] top-[12%] w-13 h-13 rounded-full bg-pink-300/43 animate-bokeh-pulse-3 animate-drift-3"></div>
                <div className="absolute right-[86%] bottom-[13%] w-12 h-12 rounded-full bg-amber-300/45 animate-bokeh-pulse-5 animate-drift-5"></div>
                <div className="absolute left-[52%] bottom-[55%] w-11 h-11 rounded-full bg-rose-400/42 animate-bokeh-pulse-7 animate-drift-2"></div>
                <div className="absolute right-[28%] bottom-[62%] w-12 h-12 rounded-full bg-orange-200/48 animate-bokeh-pulse-1 animate-drift-4"></div>
                
                {/* Tiny accent circles */}
                <div className="absolute left-[16%] bottom-[20%] w-10 h-10 rounded-full bg-rose-400/50 animate-bokeh-pulse-1 animate-drift-2"></div>
                <div className="absolute right-[23%] top-[50%] w-9 h-9 rounded-full bg-amber-400/48 animate-bokeh-pulse-3 animate-drift-4"></div>
                <div className="absolute left-[53%] top-[56%] w-8 h-8 rounded-full bg-pink-500/45 animate-bokeh-pulse-5 animate-drift-6"></div>
                <div className="absolute right-[40%] bottom-[3%] w-10 h-10 rounded-full bg-orange-300/50 animate-bokeh-pulse-9 animate-drift-1"></div>
                <div className="absolute left-[30%] bottom-[70%] w-9 h-9 rounded-full bg-rose-300/48 animate-bokeh-pulse-2 animate-drift-3"></div>
                <div className="absolute right-[30%] top-[66%] w-8 h-8 rounded-full bg-amber-400/50 animate-bokeh-pulse-4 animate-drift-5"></div>
                <div className="absolute left-[10%] top-[80%] w-10 h-10 rounded-full bg-rose-200/48 animate-bokeh-pulse-6 animate-drift-2"></div>
                <div className="absolute right-[63%] top-[80%] w-7 h-7 rounded-full bg-orange-400/50 animate-bokeh-pulse-8 animate-drift-4"></div>
                <div className="absolute left-[76%] bottom-[60%] w-9 h-9 rounded-full bg-pink-500/45 animate-bokeh-pulse-1 animate-drift-6"></div>
                <div className="absolute right-[90%] top-[40%] w-8 h-8 rounded-full bg-amber-500/48 animate-bokeh-pulse-5 animate-drift-1"></div>
                <div className="absolute left-[23%] top-[86%] w-10 h-10 rounded-full bg-rose-400/48 animate-bokeh-pulse-3 animate-drift-3"></div>
                <div className="absolute right-[13%] bottom-[70%] w-9 h-9 rounded-full bg-orange-300/50 animate-bokeh-pulse-7 animate-drift-5"></div>
                <div className="absolute left-[64%] bottom-[72%] w-8 h-8 rounded-full bg-amber-200/52 animate-bokeh-pulse-2 animate-drift-2"></div>
                <div className="absolute right-[55%] bottom-[75%] w-9 h-9 rounded-full bg-rose-300/48 animate-bokeh-pulse-6 animate-drift-4"></div>
                
                {/* Extra tiny sparkle circles */}
                <div className="absolute left-[48%] top-[16%] w-7 h-7 rounded-full bg-rose-500/48 animate-bokeh-pulse-2 animate-drift-4"></div>
                <div className="absolute right-[28%] bottom-[43%] w-6 h-6 rounded-full bg-amber-300/52 animate-bokeh-pulse-4 animate-drift-6"></div>
                <div className="absolute left-[23%] top-[70%] w-7 h-7 rounded-full bg-pink-400/50 animate-bokeh-pulse-6 animate-drift-1"></div>
                <div className="absolute right-[66%] bottom-[66%] w-6 h-6 rounded-full bg-orange-400/55 animate-bokeh-pulse-10 animate-drift-3"></div>
                <div className="absolute left-[73%] bottom-[43%] w-7 h-7 rounded-full bg-rose-300/50 animate-bokeh-pulse-1 animate-drift-5"></div>
                <div className="absolute right-[8%] top-[66%] w-6 h-6 rounded-full bg-amber-500/48 animate-bokeh-pulse-3 animate-drift-2"></div>
                <div className="absolute left-[30%] bottom-[6%] w-8 h-8 rounded-full bg-rose-200/50 animate-bokeh-pulse-5 animate-drift-4"></div>
                <div className="absolute right-[83%] top-[6%] w-7 h-7 rounded-full bg-orange-300/55 animate-bokeh-pulse-7 animate-drift-6"></div>
                <div className="absolute left-[58%] top-[45%] w-6 h-6 rounded-full bg-pink-400/52 animate-bokeh-pulse-2 animate-drift-1"></div>
                <div className="absolute right-[45%] top-[38%] w-7 h-7 rounded-full bg-amber-400/50 animate-bokeh-pulse-6 animate-drift-3"></div>
                <div className="absolute left-[82%] top-[75%] w-6 h-6 rounded-full bg-rose-400/52 animate-bokeh-pulse-4 animate-drift-5"></div>
                <div className="absolute right-[72%] bottom-[42%] w-5 h-5 rounded-full bg-orange-400/55 animate-bokeh-pulse-8 animate-drift-2"></div>
                
                {/* Micro circles for depth */}
                <div className="absolute left-[15%] top-[45%] w-5 h-5 rounded-full bg-rose-500/50 animate-bokeh-pulse-1 animate-drift-3"></div>
                <div className="absolute right-[18%] bottom-[35%] w-4 h-4 rounded-full bg-amber-400/55 animate-bokeh-pulse-3 animate-drift-5"></div>
                <div className="absolute left-[45%] bottom-[32%] w-5 h-5 rounded-full bg-pink-400/52 animate-bokeh-pulse-5 animate-drift-1"></div>
                <div className="absolute right-[35%] top-[82%] w-4 h-4 rounded-full bg-orange-300/58 animate-bokeh-pulse-10 animate-drift-4"></div>
                <div className="absolute left-[78%] top-[48%] w-5 h-5 rounded-full bg-rose-300/52 animate-bokeh-pulse-2 animate-drift-6"></div>
                <div className="absolute right-[58%] bottom-[52%] w-4 h-4 rounded-full bg-amber-500/55 animate-bokeh-pulse-4 animate-drift-2"></div>
                <div className="absolute left-[35%] top-[78%] w-5 h-5 rounded-full bg-rose-400/50 animate-bokeh-pulse-6 animate-drift-3"></div>
                <div className="absolute right-[82%] top-[68%] w-4 h-4 rounded-full bg-orange-400/58 animate-bokeh-pulse-8 animate-drift-5"></div>
              </div>
              
              {/* Shine effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Main content */}
              <div className="relative z-10 flex items-center justify-center gap-8 md:gap-12 px-4">
                {/* Album art */}
                <img 
                  src={circlesSingleCover} 
                  alt="Circles single cover"
                  className="w-32 h-32 md:w-44 md:h-44 rounded-lg object-cover shadow-2xl group-hover:scale-105 transition-transform duration-300 ring-1 ring-black/5"
                />

                {/* Text */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
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
