import React from 'react';

interface MagazineBlurbProps {
  title: string;
  paragraphs: string[];
  tagline?: string;
  isVisible: boolean;
  isWidescreen: boolean;
  titleColor?: string;
}

export const MagazineBlurb: React.FC<MagazineBlurbProps> = ({
  title,
  paragraphs,
  tagline,
  isVisible,
  isWidescreen,
  titleColor = 'white'
}) => {
  const baseDelay = 0.3;
  const staggerDelay = 0.12;

  return (
    <div className="relative">
      {/* Title */}
      <h2 
        className={`font-playfair font-bold mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isWidescreen ? 'text-4xl' : 'text-5xl'}`}
        style={{ 
          color: titleColor,
          transitionDelay: `${baseDelay}s`
        }}
      >
        {title}
      </h2>

      {/* Content container with left accent border */}
      <div 
        className={`relative pl-6 border-l-2 border-white/40 transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${baseDelay + 0.1}s` }}
      >
        {/* Paragraphs with alternating slide-in animations */}
        {paragraphs.map((paragraph, index) => {
          const isEven = index % 2 === 0;
          const delay = baseDelay + (index * staggerDelay) + 0.2;
          
          return (
            <p
              key={index}
              className={`font-merriweather leading-relaxed text-white/90 mb-4 last:mb-0 transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-x-0 blur-0' 
                  : `opacity-0 ${isEven ? '-translate-x-8' : 'translate-x-8'} blur-sm`
              } ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}
              style={{ 
                transitionDelay: `${delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {paragraph}
            </p>
          );
        })}

        {/* Optional tagline */}
        {tagline && (
          <p
            className={`font-merriweather italic text-white/70 mt-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isWidescreen ? 'text-xs' : 'text-sm'}`}
            style={{ 
              transitionDelay: `${baseDelay + (paragraphs.length * staggerDelay) + 0.3}s`
            }}
          >
            {tagline}
          </p>
        )}

        {/* Decorative accent line at bottom */}
        <div 
          className={`mt-6 h-px bg-gradient-to-r from-white/30 via-white/10 to-transparent transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ 
            transitionDelay: `${baseDelay + (paragraphs.length * staggerDelay) + 0.4}s`,
            transformOrigin: 'left'
          }}
        />
      </div>
    </div>
  );
};
