import { useEffect, useRef, useState } from "react";

interface FloatingQuoteProps {
  text: string;
  position: 'left' | 'right';
  size?: 'md' | 'lg' | 'xl';
  offsetY?: string; // Vertical offset like "-10%" or "5%"
}

export const FloatingQuote: React.FC<FloatingQuoteProps> = ({
  text,
  position,
  size = 'lg',
  offsetY = '0%'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visibility, setVisibility] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementCenter = rect.top + rect.height / 2;
        
        // Calculate visibility based on position in viewport
        // Quote should be most visible when it's in the upper-middle portion
        // and fade out as it approaches center (when book section is centered)
        const entryPoint = viewportHeight * 0.9;
        const peakPoint = viewportHeight * 0.5;
        const exitPoint = viewportHeight * 0.25;
        
        let opacity = 0;
        
        if (elementCenter > peakPoint && elementCenter < entryPoint) {
          // Fading in - from entry to peak
          opacity = (entryPoint - elementCenter) / (entryPoint - peakPoint);
        } else if (elementCenter > exitPoint && elementCenter <= peakPoint) {
          // Fading out - from peak to exit
          opacity = (elementCenter - exitPoint) / (peakPoint - exitPoint);
        }
        
        // Cap at 0.5 opacity (half visible as requested)
        setVisibility(Math.max(0, Math.min(0.5, opacity * 0.5)));
        
        // Parallax effect - move slower than scroll
        const scrollProgress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        setTranslateY(scrollProgress * 100 - 50);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sizeClasses = {
    md: 'text-5xl md:text-6xl',
    lg: 'text-6xl md:text-7xl',
    xl: 'text-7xl md:text-8xl'
  };

  const positionStyles = position === 'left' 
    ? { left: '-5%', textAlign: 'left' as const }
    : { right: '-5%', textAlign: 'right' as const };

  return (
    <div
      ref={ref}
      className={`absolute ${sizeClasses[size]} font-serif italic text-white pointer-events-none select-none whitespace-nowrap`}
      style={{
        ...positionStyles,
        top: `calc(50% + ${offsetY})`,
        opacity: visibility,
        filter: `blur(${3 - visibility * 4}px)`,
        transform: `translateY(${translateY}px) scale(${0.95 + visibility * 0.1})`,
        transition: 'opacity 0.3s ease-out, filter 0.3s ease-out, transform 0.1s ease-out',
        zIndex: 5,
        letterSpacing: '0.02em',
        fontWeight: 300,
        textShadow: '0 4px 30px rgba(0,0,0,0.3)'
      }}
    >
      {text}
    </div>
  );
};
