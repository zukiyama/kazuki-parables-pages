import { useEffect, useState, useRef, useCallback } from "react";

export const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Reset visible elements on component mount to allow animations to replay
    setVisibleElements(new Set());
    
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-scroll-animation]");
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        const id = element.getAttribute("data-scroll-animation");
        
        if (isVisible && id) {
          setVisibleElements(prev => new Set([...prev, id]));
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Reset visible elements when component unmounts
      setVisibleElements(new Set());
    };
  }, []);

  return visibleElements;
};

interface ScrollFadeUpProps {
  children: React.ReactNode;
  id: string;
  delay?: number;
  className?: string;
}

export const ScrollFadeUp: React.FC<ScrollFadeUpProps> = ({ 
  children, 
  id, 
  delay = 0, 
  className = "" 
}) => {
  const visibleElements = useScrollAnimation();
  const isVisible = visibleElements.has(id);

  return (
    <div
      data-scroll-animation={id}
      className={`scroll-fade-up ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// Hook for scroll-based parallax effects
export const useParallax = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

// Hook to detect when element enters viewport with customizable threshold
export const useInView = (threshold: number = 0.2) => {
  const [isInView, setIsInView] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true);
          setHasAnimated(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold, hasAnimated]);

  return { ref, isInView };
};

// Parallax background component - moves slower than scroll
interface ScrollParallaxProps {
  children: React.ReactNode;
  speed?: number; // 0.5 = half speed, 1 = normal, 2 = double
  className?: string;
}

export const ScrollParallax: React.FC<ScrollParallaxProps> = ({
  children,
  speed = 0.5,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.innerHeight - rect.top;
        setOffset(scrolled * speed * 0.1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translateY(${offset}px)` }}
    >
      {children}
    </div>
  );
};

// 3D tilt card that flattens on scroll
interface ScrollTilt3DProps {
  children: React.ReactNode;
  className?: string;
  initialTilt?: number;
  direction?: 'left' | 'right';
}

export const ScrollTilt3D: React.FC<ScrollTilt3DProps> = ({
  children,
  className = "",
  initialTilt = 8,
  direction = 'right'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(initialTilt);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - elementCenter);
        const maxDistance = window.innerHeight / 2;
        
        // Tilt reduces as element approaches center of viewport
        const progress = Math.max(0, 1 - (distance / maxDistance));
        setTilt(initialTilt * (1 - progress));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialTilt]);

  const rotateY = direction === 'right' ? tilt : -tilt;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d'
      }}
    >
      <div
        style={{
          transform: `rotateY(${rotateY}deg)`,
          transition: 'transform 0.1s ease-out',
          transformStyle: 'preserve-3d'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Scale element based on scroll position
interface ScrollScaleProps {
  children: React.ReactNode;
  className?: string;
  initialScale?: number;
  finalScale?: number;
  initialBlur?: number;
}

export const ScrollScale: React.FC<ScrollScaleProps> = ({
  children,
  className = "",
  initialScale = 1.3,
  finalScale = 1,
  initialBlur = 4
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [blur, setBlur] = useState(initialBlur);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate progress from entering viewport to center
        const entryPoint = viewportHeight;
        const centerPoint = viewportHeight / 2;
        
        if (rect.top < entryPoint && rect.bottom > 0) {
          const progress = Math.min(1, Math.max(0, (entryPoint - rect.top) / (entryPoint - centerPoint + rect.height / 2)));
          setScale(initialScale - (initialScale - finalScale) * progress);
          setBlur(initialBlur * (1 - progress));
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initialScale, finalScale, initialBlur]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        transition: 'transform 0.1s ease-out, filter 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
};

// Slide up with depth effect
interface ScrollSlideUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const ScrollSlideUp: React.FC<ScrollSlideUpProps> = ({
  children,
  className = "",
  delay = 0
}) => {
  const { ref, isInView } = useInView(0.15);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out`}
      style={{
        transform: isInView ? 'translateY(0) translateZ(0)' : 'translateY(80px) translateZ(-50px)',
        opacity: isInView ? 1 : 0,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// 3D Card lift effect for comic covers
interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = "",
  delay = 0
}) => {
  const { ref, isInView } = useInView(0.2);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-500 ease-out cursor-pointer`}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        transitionDelay: `${delay}ms`
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          transform: isInView 
            ? isHovered 
              ? 'translateZ(40px) rotateX(-5deg) scale(1.05)' 
              : 'translateZ(0) rotateX(0deg) scale(1)'
            : 'translateZ(-100px) rotateX(15deg) scale(0.9)',
          opacity: isInView ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
          transitionDelay: `${delay}ms`,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered 
            ? '0 30px 60px -15px rgba(0,0,0,0.4)' 
            : '0 15px 30px -10px rgba(0,0,0,0.3)'
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Staggered reveal for multiple items
interface StaggeredRevealProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}

export const StaggeredReveal: React.FC<StaggeredRevealProps> = ({
  children,
  className = "",
  staggerDelay = 150
}) => {
  const { ref, isInView } = useInView(0.1);

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={{
            transform: isInView ? 'translateY(0)' : 'translateY(60px)',
            opacity: isInView ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transitionDelay: `${index * staggerDelay}ms`
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
