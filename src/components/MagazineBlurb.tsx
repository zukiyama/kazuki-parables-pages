import React from 'react';

/** Colour palettes tuned to each book's background; 'default' is AMYA's plain white. */
export type BlurbPalette = 'default' | 'dusk' | 'outback' | 'summer' | 'noir';

interface MagazineBlurbProps {
  title: string;
  paragraphs: React.ReactNode[];
  /** Optional italic epigraph shown first inside the accent border. */
  quote?: React.ReactNode;
  tagline?: React.ReactNode;
  isVisible: boolean;
  isWidescreen: boolean;
  titleColor?: string;
  /** Non-default palettes tint the type and add a soft veil for bright, busy backgrounds. */
  variant?: BlurbPalette;
  /** Title size override for long titles. */
  titleSize?: 'default' | 'small';
  /** Tighter paragraph spacing for longer blurbs, so their sections keep the page's existing height. */
  compact?: boolean;
}

export const MagazineBlurb: React.FC<MagazineBlurbProps> = ({
  title,
  paragraphs,
  quote,
  tagline,
  isVisible,
  isWidescreen,
  titleColor = 'white',
  variant = 'default',
  titleSize = 'default',
  compact = false
}) => {
  const baseDelay = 0.3;
  const staggerDelay = 0.12;
  const tinted = variant !== 'default';
  const lead = quote ? 1 : 0;
  const gap = compact ? 'mb-2.5' : 'mb-4';
  const spaced = compact ? 'mt-4' : 'mt-6';
  const count = paragraphs.length + lead;
  const titleMargin = compact ? 'mb-4' : 'mb-6';
  const titleClass = titleSize === 'small'
    ? (isWidescreen ? 'text-3xl' : 'text-4xl')
    : (isWidescreen ? 'text-4xl' : 'text-5xl');
  const slideClass = (index: number) => isVisible
    ? 'opacity-100 translate-x-0 blur-0'
    : `opacity-0 ${index % 2 === 0 ? '-translate-x-8' : 'translate-x-8'} blur-sm`;

  return (
    <div className={tinted ? 'relative tinted-blurb' : 'relative'} data-palette={tinted ? variant : undefined} data-visible={isVisible}>
      {/* Title */}
      <h2 
        className={`font-playfair font-bold ${titleMargin} transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${titleClass}`}
        style={{ 
          color: tinted ? undefined : titleColor,
          transitionDelay: `${baseDelay}s`
        }}
      >
        {title}
      </h2>

      {/* Content container with left accent border */}
      <div 
        className={`relative pl-6 border-l-2 ${tinted ? 'tinted-blurb__body' : 'border-white/40'} transition-all duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: `${baseDelay + 0.1}s` }}
      >
        {quote && (
          <p
            className={`tinted-blurb__quote font-merriweather italic leading-relaxed ${gap} transition-all duration-700 ${slideClass(0)} ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}
            style={{ transitionDelay: `${baseDelay + 0.2}s`, transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            {quote}
          </p>
        )}

        {/* Paragraphs with alternating slide-in animations */}
        {paragraphs.map((paragraph, i) => {
          const index = i + lead;
          const delay = baseDelay + (index * staggerDelay) + 0.2;
          
          return (
            <p
              key={i}
              className={`font-merriweather leading-relaxed ${tinted ? '' : 'text-white/90'} ${gap} last:mb-0 transition-all duration-700 ${slideClass(index)} ${isWidescreen ? 'text-sm' : 'text-base max-sm:text-sm'}`}
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
            className={`font-merriweather italic ${tinted ? 'tinted-blurb__tagline' : 'text-white/70'} ${spaced} transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${isWidescreen ? 'text-xs' : 'text-sm'}`}
            style={{ 
              transitionDelay: `${baseDelay + (count * staggerDelay) + 0.3}s`
            }}
          >
            {tagline}
          </p>
        )}

        {/* Decorative accent line at bottom */}
        <div 
          className={`${spaced} h-px ${tinted ? 'tinted-blurb__line' : 'bg-gradient-to-r from-white/30 via-white/10 to-transparent'} transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{ 
            transitionDelay: `${baseDelay + (count * staggerDelay) + 0.4}s`,
            transformOrigin: 'left'
          }}
        />
      </div>
    </div>
  );
};
