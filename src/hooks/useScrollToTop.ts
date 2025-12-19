import { useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to scroll to absolute top of page on route change or initial load
 * Uses multiple scroll attempts to handle mobile browser bar viewport changes
 */
export const useScrollToTop = () => {
  const { pathname } = useLocation();

  // Use useLayoutEffect for synchronous scroll before paint
  useLayoutEffect(() => {
    // Immediately scroll to absolute top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  useEffect(() => {
    // Additional scroll attempts to handle mobile browser bar issues
    const scrollToAbsoluteTop = () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Immediate scroll
    scrollToAbsoluteTop();
    
    // Delayed scrolls to catch any viewport adjustments from browser bars
    const timeouts = [
      setTimeout(scrollToAbsoluteTop, 0),
      setTimeout(scrollToAbsoluteTop, 50),
      setTimeout(scrollToAbsoluteTop, 100),
      setTimeout(scrollToAbsoluteTop, 200),
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [pathname]);
};
