import React from 'react';

interface LiteraryMagazineBlurbProps {
  bookNumber: string;
  seriesName: string;
  paragraphs: {
    text: string;
    highlights?: { phrase: string; color: string }[];
  }[];
  isVisible: boolean;
  isWidescreen: boolean;
}

export const LiteraryMagazineBlurb: React.FC<LiteraryMagazineBlurbProps> = ({
  bookNumber,
  seriesName,
  paragraphs,
  isVisible,
  isWidescreen
}) => {
  const baseDelay = 0.3;
  const staggerDelay = 0.15;

  // Function to render text with highlighted phrases
  const renderHighlightedText = (text: string, highlights?: { phrase: string; color: string }[]) => {
    if (!highlights || highlights.length === 0) {
      return text;
    }

    let result: (string | JSX.Element)[] = [text];
    
    highlights.forEach((highlight, highlightIndex) => {
      const newResult: (string | JSX.Element)[] = [];
      result.forEach((segment, segmentIndex) => {
        if (typeof segment === 'string') {
          const parts = segment.split(highlight.phrase);
          parts.forEach((part, partIndex) => {
            if (part) newResult.push(part);
            if (partIndex < parts.length - 1) {
              newResult.push(
                <span 
                  key={`${highlightIndex}-${segmentIndex}-${partIndex}`}
                  className="font-medium"
                  style={{ color: highlight.color }}
                >
                  {highlight.phrase}
                </span>
              );
            }
          });
        } else {
          newResult.push(segment);
        }
      });
      result = newResult;
    });

    return result;
  };

  return (
    <div className="relative">
      {/* Series badge */}
      <div 
        className={`mb-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
        style={{ transitionDelay: `${baseDelay}s` }}
      >
        <span 
          className={`inline-block font-serif tracking-[0.2em] uppercase text-stone-500 border-b border-stone-300 pb-1 ${
            isWidescreen ? 'text-xs' : 'text-sm'
          }`}
        >
          {bookNumber}
        </span>
      </div>

      {/* Series name with decorative elements */}
      <div 
        className={`mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: `${baseDelay + 0.1}s` }}
      >
        <h3 
          className={`font-serif italic text-amber-700 ${
            isWidescreen ? 'text-lg' : 'text-xl'
          }`}
        >
          {seriesName}
        </h3>
      </div>

      {/* Decorative divider */}
      <div 
        className={`flex items-center gap-3 mb-6 transition-all duration-700 ${
          isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
        }`}
        style={{ 
          transitionDelay: `${baseDelay + 0.15}s`,
          transformOrigin: 'left'
        }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-stone-400 via-stone-300 to-transparent"></div>
        <div className="w-1.5 h-1.5 bg-amber-600 rotate-45"></div>
        <div className="h-px w-8 bg-stone-300"></div>
      </div>

      {/* Paragraphs with elegant typography */}
      <div className="space-y-4">
        {paragraphs.map((para, index) => {
          const delay = baseDelay + (index * staggerDelay) + 0.2;
          const isFirst = index === 0;
          
          return (
            <p
              key={index}
              className={`font-serif leading-[1.85] text-stone-700 transition-all duration-700 ${
                isVisible 
                  ? 'opacity-100 translate-y-0 blur-0' 
                  : 'opacity-0 translate-y-6 blur-sm'
              } ${isWidescreen ? 'text-sm' : 'text-base'}`}
              style={{ 
                transitionDelay: `${delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                textIndent: isFirst ? '0' : '1.5em'
              }}
            >
              {isFirst && (
                <span 
                  className="float-left font-serif text-amber-700 mr-2 leading-none"
                  style={{ 
                    fontSize: isWidescreen ? '2.5rem' : '3rem',
                    marginTop: isWidescreen ? '0.1em' : '0.05em'
                  }}
                >
                  {para.text.charAt(0)}
                </span>
              )}
              {renderHighlightedText(
                isFirst ? para.text.slice(1) : para.text, 
                para.highlights
              )}
            </p>
          );
        })}
      </div>

      {/* Bottom decorative element */}
      <div 
        className={`mt-8 flex items-center gap-2 transition-all duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          transitionDelay: `${baseDelay + (paragraphs.length * staggerDelay) + 0.4}s`
        }}
      >
        <div className="w-1.5 h-1.5 bg-amber-600 rotate-45"></div>
        <div className="w-1.5 h-1.5 bg-stone-400 rotate-45"></div>
        <div className="w-1.5 h-1.5 bg-stone-300 rotate-45"></div>
      </div>
    </div>
  );
};
