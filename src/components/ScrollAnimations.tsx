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
          // Special case: cityscape background triggers 5-6 seconds after background-image
          if (id === "cityscape-background" && visibleElements.has("background-image")) {
            setTimeout(() => {
              setVisibleElements(prev => new Set([...prev, id]));
            }, 5000);
          } else if (id !== "cityscape-background") {
            setVisibleElements(prev => new Set([...prev, id]));
          }
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