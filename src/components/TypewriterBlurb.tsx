import { useEffect, useState } from "react";

interface TypewriterBlurbProps {
  title: string;
  paragraphs: string[];
  isVisible: boolean;
  isWidescreen: boolean;
}

export const TypewriterBlurb = ({ 
  title, 
  paragraphs, 
  isVisible, 
  isWidescreen 
}: TypewriterBlurbProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isVisible && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isVisible, hasAnimated]);

  return (
    <div className="relative">
      {/* Paper background with typewriter aesthetic */}
      <div 
        className="relative"
        style={{
          background: 'linear-gradient(180deg, #f5f0e6 0%, #ede7d8 50%, #e8e0d0 100%)',
          padding: isWidescreen ? '1.5rem' : '2rem',
          boxShadow: '3px 3px 15px rgba(0,0,0,0.3), inset 0 0 60px rgba(0,0,0,0.05)',
          border: '1px solid rgba(139, 119, 101, 0.3)',
        }}
      >
        {/* Subtle paper texture overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Title - typed header */}
        <h2 
          className={`mb-6 tracking-wider transition-all duration-700 ${
            hasAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
          style={{ 
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: isWidescreen ? '1.75rem' : '2rem',
            color: '#2d2a26',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 'bold',
          }}
        >
          {title}
        </h2>

        {/* Paragraph text - typewriter style */}
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`leading-relaxed mb-4 last:mb-0 transition-all duration-700`}
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: isWidescreen ? '0.85rem' : '0.95rem',
              lineHeight: isWidescreen ? '1.7' : '1.85',
              color: '#3d3a36',
              letterSpacing: '0.02em',
              opacity: hasAnimated ? 1 : 0,
              transform: hasAnimated ? 'translateY(0)' : 'translateY(15px)',
              transitionDelay: `${0.2 + (index * 0.15)}s`,
            }}
          >
            {paragraph}
          </p>
        ))}

        {/* Ink smudge decoration */}
        <div 
          className="absolute bottom-4 right-4 w-16 h-16 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, #2d2a26 0%, transparent 70%)',
            transform: 'rotate(-15deg)',
          }}
        />
      </div>
    </div>
  );
};
