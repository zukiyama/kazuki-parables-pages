import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to scroll to absolute top of page on route change or initial load
 * Uses multiple scroll attempts to handle mobile browser bar viewport changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();
  const isInitialMount = useRef(true);

  const scrollToAbsoluteTop = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  // Handle initial page load/refresh - runs once on mount
  useEffect(() => {
    scrollToAbsoluteTop();
    
    const t1 = setTimeout(scrollToAbsoluteTop, 0);
    const t2 = setTimeout(scrollToAbsoluteTop, 50);
    const t3 = setTimeout(scrollToAbsoluteTop, 100);
    const t4 = setTimeout(scrollToAbsoluteTop, 200);
    const t5 = setTimeout(scrollToAbsoluteTop, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  // Handle route changes (navigation between pages)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    scrollToAbsoluteTop();
    
    const t1 = setTimeout(scrollToAbsoluteTop, 0);
    const t2 = setTimeout(scrollToAbsoluteTop, 50);
    const t3 = setTimeout(scrollToAbsoluteTop, 100);
    const t4 = setTimeout(scrollToAbsoluteTop, 200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [pathname]);
};
