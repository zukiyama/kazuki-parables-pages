import { useState } from "react";

interface BookCover {
  image: string;
  alt: string;
}

interface BookCoverSlideshowProps {
  covers: BookCover[];
  title: string;
  className?: string;
}

export const BookCoverSlideshow = ({ covers, title, className = "" }: BookCoverSlideshowProps) => {
  const [currentCover, setCurrentCover] = useState(0);

  if (covers.length <= 1) {
    return (
      <div className={`relative ${className}`}>
        <div className="book-cover-container">
          <img 
            src={covers[0]?.image} 
            alt={covers[0]?.alt || title}
            className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl book-cover-effect"
          />
          <div className="book-spine"></div>
          <div className="book-pages"></div>
          <div className="book-title-overlay">
            <h3 className="text-white font-serif text-xl font-bold drop-shadow-lg">{title}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="book-cover-container">
        <img 
          key={`cover-${currentCover}`}
          src={covers[currentCover].image} 
          alt={covers[currentCover].alt}
          className="w-full max-w-md mx-auto aspect-[3/4] object-cover rounded-lg shadow-2xl book-cover-effect transition-opacity duration-300"
          loading="eager"
        />
        <div className="book-spine"></div>
        <div className="book-pages"></div>
        <div className="book-title-overlay">
          <h3 className="text-white font-serif text-xl font-bold drop-shadow-lg">{title}</h3>
        </div>
      </div>
      
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