import { useEffect, useState, useRef } from 'react';

interface BackgroundState {
  loaded: boolean;
  visible: boolean;
}

interface UseLazyBackgroundsProps {
  backgrounds: Record<string, string>;
  visibleSections: Set<string>;
  currentYoungAdultBook: number;
}

export const useLazyBackgrounds = ({ 
  backgrounds, 
  visibleSections, 
  currentYoungAdultBook 
}: UseLazyBackgroundsProps) => {
  const [backgroundStates, setBackgroundStates] = useState<Record<string, BackgroundState>>(
    () => Object.keys(backgrounds).reduce((acc, key) => ({
      ...acc,
      [key]: { loaded: key === 'school', visible: key === 'school' } // Only school loads initially
    }), {})
  );

  const loadingRef = useRef<Set<string>>(new Set());

  // Determine which background should be active
  const getActiveBackground = () => {
    if (visibleSections.has('vice-versa')) return 'viceVersa';
    if (visibleSections.has('how')) return 'how';
    if (visibleSections.has('states-of-motion')) return 'statesOfMotion';
    if (visibleSections.has('oba')) return 'oba';
    if (visibleSections.has('the-market')) return 'theMarket';
    if (visibleSections.has('hoax')) return 'hoax';
    if (visibleSections.has('young-adult')) {
      const youngAdultBackgrounds = ['victorianLondon', 'wasteland', 'deepSpace'];
      return youngAdultBackgrounds[currentYoungAdultBook] || 'school';
    }
    if (visibleSections.has('kaiju')) return 'school';
    return 'school';
  };

  const activeBackground = getActiveBackground();

  // Load background when it becomes active or is about to become active
  useEffect(() => {
    const backgroundsToLoad = new Set([activeBackground]);
    
    // Preload next likely backgrounds based on scroll direction
    if (activeBackground === 'school') {
      backgroundsToLoad.add('hoax');
    } else if (activeBackground === 'hoax') {
      backgroundsToLoad.add('theMarket');
    } else if (activeBackground === 'theMarket') {
      backgroundsToLoad.add('oba');
    } else if (activeBackground === 'oba') {
      backgroundsToLoad.add('statesOfMotion');
    } else if (activeBackground === 'statesOfMotion') {
      backgroundsToLoad.add('how');
    } else if (activeBackground === 'how') {
      backgroundsToLoad.add('viceVersa');
    }

    backgroundsToLoad.forEach(bgKey => {
      if (!backgroundStates[bgKey]?.loaded && !loadingRef.current.has(bgKey) && backgrounds[bgKey]) {
        loadingRef.current.add(bgKey);
        
        const img = new Image();
        img.onload = () => {
          loadingRef.current.delete(bgKey);
          setBackgroundStates(prev => ({
            ...prev,
            [bgKey]: { ...prev[bgKey], loaded: true }
          }));
        };
        img.onerror = () => {
          loadingRef.current.delete(bgKey);
          console.warn(`Failed to load background: ${bgKey}`);
        };
        img.src = backgrounds[bgKey];
      }
    });
  }, [activeBackground, backgrounds, backgroundStates]);

  // Update visibility states
  useEffect(() => {
    setBackgroundStates(prev => {
      const newStates = { ...prev };
      Object.keys(newStates).forEach(key => {
        newStates[key] = {
          ...newStates[key],
          visible: key === activeBackground
        };
      });
      return newStates;
    });
  }, [activeBackground]);

  return {
    backgroundStates,
    activeBackground
  };
};