import { useState } from "react";

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
  const [currentCover, setCurrentCover] = useState(0);

  // Widescreen: size relative to viewport WITHOUT banner (100vh - 4rem header - 4rem breathing = ~80vh)
  // Non-widescreen (iPad, etc.): Use original proportional sizing that worked before
  const imageClasses = isWidescreen
    ? "h-[calc(80vh)] w-auto mx-auto object-contain rounded-lg shadow-2xl"
    : "w-full max-w-md mx-auto object-contain rounded-lg shadow-2xl";

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
      <img 
        key={`cover-${currentCover}`}
        src={covers[currentCover].image} 
        alt={covers[currentCover].alt}
        className={imageClasses + " transition-opacity duration-300"}
        loading={loading}
      />
      
      {/* Clickable dots indicator */}
      <div className="flex justify-center space-x-2 mt-4">
        {covers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentCover(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentCover 
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
