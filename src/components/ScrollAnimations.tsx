import { useEffect, useState } from "react";

export const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-scroll-animation]");
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Only reveal when 25% of element is visible to prevent early animation
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        const id = element.getAttribute("data-scroll-animation");
        
        if (isVisible && id) {
          setVisibleElements(prev => new Set([...prev, id]));
        }
      });
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.addEventListener("scroll", handleScroll);
    
    // Only do initial check after a small delay to prevent initial flash
    // and only if page was scrolled during load
    const initialCheckTimer = setTimeout(() => {
      if (window.scrollY > 50) {
        handleScroll();
      }
    }, 100);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(initialCheckTimer);
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