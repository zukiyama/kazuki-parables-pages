import { useEffect, useState } from "react";

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

    // Initial check with delay to catch elements already in view
    const initialCheck = setTimeout(() => {
      handleScroll();
    }, 100);

    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearTimeout(initialCheck);
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