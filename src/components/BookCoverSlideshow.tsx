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
}

export const BookCoverSlideshow = ({ covers, title, className = "", loading = "eager" }: BookCoverSlideshowProps) => {
  const [currentCover, setCurrentCover] = useState(0);

  if (covers.length <= 1) {
    return (
      <div className={`relative book-cover-slideshow ${className}`}>
        <img 
          src={covers[0]?.image} 
          alt={covers[0]?.alt || title}
          className="w-full max-w-sm mx-auto object-contain rounded-lg shadow-2xl"
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
        className="w-full max-w-sm mx-auto object-contain rounded-lg shadow-2xl transition-opacity duration-300"
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