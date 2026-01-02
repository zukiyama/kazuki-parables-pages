import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface BookCover {
  image: string;
  alt: string;
}

interface BookCoverSlideshowProps {
  covers: BookCover[];
  title: string;
  className?: string;
  loading?: "lazy" | "eager";
  isWidescreen?: boolean;
}

export const BookCoverSlideshow = ({ covers, title, className = "", loading = "eager", isWidescreen = false }: BookCoverSlideshowProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    skipSnaps: false,
    dragFree: false,
  });

  // Widescreen: size relative to viewport WITHOUT banner (100vh - 4rem header - 4rem breathing = ~80vh)
  const imageClasses = isWidescreen
    ? "h-[calc(80vh)] w-auto mx-auto object-contain rounded-lg shadow-2xl"
    : "w-full max-w-sm mx-auto object-contain rounded-lg shadow-2xl";

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    
    const currentIndex = emblaApi.selectedScrollSnap();
    const totalSlides = covers.length;
    
    // Always scroll forward (right) by calculating the forward distance
    if (index !== currentIndex) {
      // Calculate how many steps forward to reach the target
      const forwardSteps = (index - currentIndex + totalSlides) % totalSlides;
      
      // Scroll forward one step at a time to ensure right direction
      for (let i = 0; i < forwardSteps; i++) {
        setTimeout(() => {
          emblaApi.scrollNext();
        }, i * 50); // Small delay between steps for smooth transition
      }
    }
  }, [emblaApi, covers.length]);

  if (covers.length <= 1) {
    return (
      <div className={`relative book-cover-slideshow ${className}`}>
        <img 
          src={covers[0]?.image} 
          alt={covers[0]?.alt || title}
          className={imageClasses + " transition-opacity duration-300"}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div className={`relative book-cover-slideshow ${className}`}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {covers.map((cover, index) => (
            <div 
              key={index} 
              className="flex-[0_0_100%] min-w-0"
            >
              <img 
                src={cover.image} 
                alt={cover.alt}
                className={imageClasses}
                loading={loading}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Clickable dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {covers.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex 
                ? 'bg-white' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`View cover ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
