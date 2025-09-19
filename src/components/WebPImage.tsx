import { OptimizedImage } from "./OptimizedImage";

interface WebPImageProps {
  src: string;
  webpSrc?: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: "lazy" | "eager";
  priority?: boolean;
}

export const WebPImage = ({ src, webpSrc, ...props }: WebPImageProps) => {
  // If WebP source is provided, use picture element for modern browsers
  if (webpSrc) {
    return (
      <picture>
        <source srcSet={webpSrc} type="image/webp" />
        <OptimizedImage src={src} {...props} />
      </picture>
    );
  }

  // Fallback to regular optimized image
  return <OptimizedImage src={src} {...props} />;
};