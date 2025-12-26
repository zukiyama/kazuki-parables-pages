import { useEffect, useRef, useState } from "react";

interface MagazineBlurbProps {
  title: string;
  paragraphs: string[];
  tagline?: string;
  isVisible: boolean;
  isWidescreen: boolean;
  titleColor?: string;
}

export const MagazineBlurb = ({ 
  title, 
  paragraphs, 
  tagline,
  isVisible, 
  isWidescreen,
  titleColor = "text-white"
}: MagazineBlurbProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  // Get animation properties for each paragraph line
  const getAnimationDelay = (paragraphIndex: number) => {
    const baseDelay = 0.2 + (paragraphIndex * 0.12);
    return `${baseDelay}s`;
  };

  const getAnimationDirection = (index: number) => {
    // Alternate: left, right, left, right...
    return index % 2 === 0 ? 'left' : 'right';
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Title with editorial styling */}
      <h2 
        className={`font-serif font-bold mb-6 ${titleColor} tracking-wide drop-shadow-lg transition-all duration-700 ${
          hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ 
          fontSize: isWidescreen ? '2.5rem' : '3rem',
          fontFamily: "'Playfair Display', Georgia, serif",
          letterSpacing: '0.02em'
        }}
      >
        {title}
      </h2>

      {/* Magazine article body */}
      <div 
        className="relative overflow-hidden"
        style={{
          // Subtle left border accent like magazine pull quotes
          borderLeft: '3px solid rgba(255, 255, 255, 0.3)',
          paddingLeft: isWidescreen ? '1.25rem' : '1.5rem'
        }}
      >
        {paragraphs.map((paragraph, index) => {
          const direction = getAnimationDirection(index);
          const delay = getAnimationDelay(index);
          
          return (
            <p
              key={index}
              className={`font-serif leading-relaxed text-white/95 ${
                isWidescreen ? 'text-sm mb-4' : 'text-base mb-5'
              }`}
              style={{
                fontFamily: "'Merriweather', Georgia, serif",
                lineHeight: isWidescreen ? '1.75' : '1.85',
                letterSpacing: '0.01em',
                // Animation styles with blur
                opacity: hasAnimated ? 1 : 0,
                filter: hasAnimated ? 'blur(0px)' : 'blur(8px)',
                transform: hasAnimated 
                  ? 'translateX(0)' 
                  : direction === 'left' 
                    ? 'translateX(-60px)' 
                    : 'translateX(60px)',
                transition: `opacity 0.7s ease-out, filter 0.7s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
                transitionDelay: delay,
                // Subtle text shadow for legibility
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}
            >
              {paragraph}
            </p>
          );
        })}

        {/* Tagline / italic closing */}
        {tagline && (
          <p
            className={`font-serif italic text-white/80 ${
              isWidescreen ? 'text-sm mt-4' : 'text-base mt-5'
            }`}
            style={{
              fontFamily: "'Merriweather', Georgia, serif",
              letterSpacing: '0.02em',
              opacity: hasAnimated ? 1 : 0,
              filter: hasAnimated ? 'blur(0px)' : 'blur(6px)',
              transform: hasAnimated ? 'translateX(0)' : 'translateX(40px)',
              transition: 'opacity 0.7s ease-out, filter 0.7s ease-out, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transitionDelay: `${0.2 + (paragraphs.length * 0.12) + 0.1}s`,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
            }}
          >
            {tagline}
          </p>
        )}
      </div>

      {/* Decorative accent line at bottom */}
      <div 
        className="mt-6 h-px bg-gradient-to-r from-white/40 via-white/20 to-transparent"
        style={{
          opacity: hasAnimated ? 1 : 0,
          transform: hasAnimated ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'all 1s ease-out',
          transitionDelay: `${0.2 + (paragraphs.length * 0.12) + 0.3}s`
        }}
      />
    </div>
  );
};
