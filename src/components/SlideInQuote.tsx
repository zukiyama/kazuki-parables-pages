import { useEffect, useRef, useState } from "react";

interface SlideInQuoteProps {
  lines: string[];
  className?: string;
}

export const SlideInQuote: React.FC<SlideInQuoteProps> = ({ lines, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleLines, setVisibleLines] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-line-index'));
          if (entry.isIntersecting) {
            setVisibleLines(prev => new Set([...prev, index]));
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px'
      }
    );

    const lineElements = containerRef.current?.querySelectorAll('[data-line-index]');
    lineElements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [lines]);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      {lines.map((line, index) => {
        const isFromRight = index % 2 === 0;
        const isVisible = visibleLines.has(index);
        
        return (
          <span
            key={index}
            data-line-index={index}
            className="block transition-all duration-700 ease-out"
            style={{
              transform: isVisible 
                ? 'translateX(0)' 
                : `translateX(${isFromRight ? '100%' : '-100%'})`,
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${index * 100}ms`
            }}
          >
            {line}
            {index < lines.length - 1 && ' '}
          </span>
        );
      })}
    </div>
  );
};
