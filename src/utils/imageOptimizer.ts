// Image optimization utilities

export const createImagePreloader = (sources: string[], priority: boolean = false) => {
  if (!priority) return [];
  
  return sources.map(src => {
    const img = new Image();
    img.src = src;
    return img;
  });
};

export const optimizeImageLoading = (element: HTMLImageElement, options: {
  width?: number;
  height?: number;
  quality?: number;
}) => {
  if (options.width) {
    element.style.maxWidth = `${options.width}px`;
  }
  if (options.height) {
    element.style.maxHeight = `${options.height}px`;
  }
  element.style.objectFit = 'contain';
};

// Lazy loading intersection observer
export const createLazyImageObserver = (callback: (entries: IntersectionObserverEntry[]) => void) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1
  });
};