import { useState, useEffect, useCallback, useRef } from 'react';

export const useHeaderVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        
        // Show header when scrolling up or at the top
        if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
          setIsVisible(true);
        } 
        // Hide header when scrolling down
        else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          setIsVisible(false);
        }
        
        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  const handleTap = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTap, { passive: true });
    window.addEventListener('click', handleTap, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTap);
      window.removeEventListener('click', handleTap);
    };
  }, [handleScroll, handleTap]);

  return isVisible;
};
