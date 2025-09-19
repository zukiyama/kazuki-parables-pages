import { useEffect, useState, useRef } from 'react';

interface BackgroundImage {
  src: string;
  alt: string;
  section: string;
}

interface LazyBackgroundsState {
  loadedImages: Set<string>;
  loadingImages: Set<string>;
}

export const useLazyBackgrounds = (
  backgrounds: BackgroundImage[],
  visibleSections: Set<string>,
  currentYoungAdultBook: number
) => {
  const [state, setState] = useState<LazyBackgroundsState>({
    loadedImages: new Set(['school']), // Always load school background eagerly
    loadingImages: new Set()
  });
  
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Determine which background should be visible
  const getActiveBackground = () => {
    if (visibleSections.has('vice-versa')) return 'viceVersa';
    if (visibleSections.has('how')) return 'how';
    if (visibleSections.has('states-of-motion')) return 'statesOfMotion';
    if (visibleSections.has('oba')) return 'oba';
    if (visibleSections.has('the-market')) return 'theMarket';
    if (visibleSections.has('hoax')) return 'hoax';
    if (visibleSections.has('young-adult')) {
      if (currentYoungAdultBook === 0) return 'victorianLondon';
      if (currentYoungAdultBook === 1) return 'wasteland';
      if (currentYoungAdultBook === 2) return 'deepSpace';
      return 'school';
    }
    return 'school';
  };

  const activeBackground = getActiveBackground();

  // Load image when needed
  const loadImage = (backgroundKey: string, imageSrc: string) => {
    if (state.loadedImages.has(backgroundKey) || state.loadingImages.has(backgroundKey)) {
      return;
    }

    setState(prev => ({
      ...prev,
      loadingImages: new Set([...prev.loadingImages, backgroundKey])
    }));

    const img = new Image();
    img.onload = () => {
      loadedImagesRef.current.set(backgroundKey, img);
      setState(prev => ({
        loadedImages: new Set([...prev.loadedImages, backgroundKey]),
        loadingImages: new Set([...prev.loadingImages].filter(key => key !== backgroundKey))
      }));
    };
    img.onerror = () => {
      setState(prev => ({
        ...prev,
        loadingImages: new Set([...prev.loadingImages].filter(key => key !== backgroundKey))
      }));
    };
    img.src = imageSrc;
  };

  // Effect to load images when sections become visible or are about to become visible
  useEffect(() => {
    const backgroundMap: Record<string, string> = {};
    backgrounds.forEach(bg => {
      backgroundMap[bg.section] = bg.src;
    });

    // Load the currently active background
    const activeKey = activeBackground;
    const activeSrc = backgroundMap[activeKey];
    if (activeSrc && !state.loadedImages.has(activeKey)) {
      loadImage(activeKey, activeSrc);
    }

    // Preload images for sections that are close to being visible
    const sectionsArray = Array.from(visibleSections);
    sectionsArray.forEach(sectionId => {
      const backgroundKey = sectionId.replace('-', '').replace('young-adult', activeBackground);
      const src = backgroundMap[backgroundKey];
      if (src && !state.loadedImages.has(backgroundKey)) {
        loadImage(backgroundKey, src);
      }
    });
  }, [visibleSections, activeBackground, currentYoungAdultBook]);

  return {
    isLoaded: (backgroundKey: string) => state.loadedImages.has(backgroundKey),
    isLoading: (backgroundKey: string) => state.loadingImages.has(backgroundKey),
    activeBackground
  };
};