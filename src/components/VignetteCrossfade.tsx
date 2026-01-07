import { useState, useEffect, useRef, useCallback } from 'react';

interface VignetteImage {
  key: string;
  left: string;
  right: string;
}

interface VignetteCrossfadeProps {
  images: VignetteImage[];
  activeKey: string | null;
  opacity: number;
}

interface VignetteSlotProps {
  currentSrc: string | null;
  nextSrc: string | null;
  onTransitionComplete: () => void;
  opacity: number;
  side: 'left' | 'right';
}

const VignetteSlot = ({ currentSrc, nextSrc, onTransitionComplete, opacity, side }: VignetteSlotProps) => {
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [nextOpacity, setNextOpacity] = useState(0);
  const [displayedCurrent, setDisplayedCurrent] = useState<string | null>(currentSrc);
  const [displayedNext, setDisplayedNext] = useState<string | null>(null);
  const isTransitioning = useRef(false);

  // Preload and decode image before starting fade
  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      if (img.decode) {
        img.decode().then(() => resolve()).catch(() => resolve());
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      }
    });
  }, []);

  useEffect(() => {
    // Handle initial mount or when nextSrc changes
    if (nextSrc && nextSrc !== displayedCurrent && !isTransitioning.current) {
      isTransitioning.current = true;
      
      // Preload the new image first
      preloadImage(nextSrc).then(() => {
        setDisplayedNext(nextSrc);
        // Small delay to ensure DOM has the image ready
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setCurrentOpacity(0);
            setNextOpacity(1);
          });
        });
      });
    } else if (!nextSrc && !currentSrc && displayedCurrent) {
      // Fading out completely
      setCurrentOpacity(0);
      setNextOpacity(0);
    }
  }, [nextSrc, currentSrc, displayedCurrent, preloadImage]);

  // Handle transition end
  const handleTransitionEnd = useCallback(() => {
    if (isTransitioning.current && displayedNext) {
      // Move next to current
      setDisplayedCurrent(displayedNext);
      setDisplayedNext(null);
      setCurrentOpacity(1);
      setNextOpacity(0);
      isTransitioning.current = false;
      onTransitionComplete();
    }
  }, [displayedNext, onTransitionComplete]);

  const maskStyle = side === 'left' 
    ? {
        maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
        maskComposite: 'intersect' as const,
        WebkitMaskComposite: 'source-in' as const,
      }
    : {
        maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%), linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 80%, transparent 100%)',
        maskComposite: 'intersect' as const,
        WebkitMaskComposite: 'source-in' as const,
      };

  const positionClass = side === 'left' ? 'left-0' : 'right-0';
  const bgPosition = side === 'left' ? 'center right' : 'center left';

  return (
    <div 
      className={`absolute ${positionClass} top-0 bottom-0 w-1/3 pointer-events-none overflow-hidden`}
      style={{ 
        opacity,
        transition: 'opacity 700ms ease-in-out',
      }}
    >
      {/* Current layer */}
      {displayedCurrent && (
        <img
          src={displayedCurrent}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: bgPosition,
            opacity: currentOpacity,
            transition: 'opacity 500ms ease-in-out',
            ...maskStyle,
          }}
          onTransitionEnd={handleTransitionEnd}
        />
      )}
      
      {/* Next layer (for crossfade) */}
      {displayedNext && (
        <img
          src={displayedNext}
          alt=""
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: bgPosition,
            opacity: nextOpacity,
            transition: 'opacity 500ms ease-in-out',
            ...maskStyle,
          }}
        />
      )}
    </div>
  );
};

export const VignetteCrossfade = ({ images, activeKey, opacity }: VignetteCrossfadeProps) => {
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [nextKey, setNextKey] = useState<string | null>(null);
  const prevActiveKey = useRef<string | null>(null);

  // Find image sources for a given key
  const getImageSources = useCallback((key: string | null) => {
    if (!key) return null;
    return images.find(img => img.key === key) || null;
  }, [images]);

  useEffect(() => {
    if (activeKey !== prevActiveKey.current) {
      if (activeKey) {
        // New vignette selected
        if (currentKey) {
          // Crossfade from current to next
          setNextKey(activeKey);
        } else {
          // First selection, just show it
          setCurrentKey(activeKey);
        }
      } else {
        // Deselecting - fade out current
        setNextKey(null);
      }
      prevActiveKey.current = activeKey;
    }
  }, [activeKey, currentKey]);

  const handleTransitionComplete = useCallback(() => {
    if (nextKey) {
      setCurrentKey(nextKey);
      setNextKey(null);
    } else if (!activeKey) {
      setCurrentKey(null);
    }
  }, [nextKey, activeKey]);

  const currentImages = getImageSources(currentKey);
  const nextImages = getImageSources(nextKey);

  // Determine what to show in each slot
  const leftCurrentSrc = currentImages?.left || null;
  const leftNextSrc = nextImages?.left || null;
  const rightCurrentSrc = currentImages?.right || null;
  const rightNextSrc = nextImages?.right || null;

  return (
    <>
      <VignetteSlot
        currentSrc={leftCurrentSrc}
        nextSrc={leftNextSrc}
        onTransitionComplete={handleTransitionComplete}
        opacity={opacity}
        side="left"
      />
      <VignetteSlot
        currentSrc={rightCurrentSrc}
        nextSrc={rightNextSrc}
        onTransitionComplete={handleTransitionComplete}
        opacity={opacity}
        side="right"
      />
    </>
  );
};
