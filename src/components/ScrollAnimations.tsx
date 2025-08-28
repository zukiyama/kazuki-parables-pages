import { useEffect, useState } from "react";

export const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll("[data-scroll-animation]");
      
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        // Only trigger when 25% of element is visible
        const isVisible = rect.top < window.innerHeight * 0.75;
        const id = element.getAttribute("data-scroll-animation");
        
        if (isVisible && id && !visibleElements.has(id)) {
          setVisibleElements(prev => new Set([...prev, id]));
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Remove initial check to prevent animations on page load
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleElements]);

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