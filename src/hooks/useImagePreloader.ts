import { useEffect } from "react";

interface UseImagePreloaderOptions {
  images: string[];
  priority?: boolean;
}

export const useImagePreloader = ({ images, priority = false }: UseImagePreloaderOptions) => {
  useEffect(() => {
    if (!priority) return;

    const preloadImages = images.map((src) => {
      const img = new Image();
      img.src = src;
      return img;
    });

    return () => {
      preloadImages.forEach((img) => {
        img.src = '';
      });
    };
  }, [images, priority]);
};