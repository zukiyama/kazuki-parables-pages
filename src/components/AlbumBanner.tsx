import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronRight } from "lucide-react";

// Album covers
import spaceshipAlbum from "@/assets/spaceship-album.png";
import starPeopleRiverAlbum from "@/assets/star-people-river-album.jpeg";
import manOnFilmAlbum from "@/assets/man-on-film-album-updated.png";
import deathOfLoveAlbum from "@/assets/death-of-love-album.png";
import sceneOfMyRestorationAlbum from "@/assets/scene-of-my-restoration-album-new.jpeg";
import centreOfWorldAlbum from "@/assets/last-city-on-earth-album.jpeg";
import toDreamtManAlbum from "@/assets/to-dreamt-man-album-new.jpeg";
import flowerEpCover from "@/assets/flower-ep-cover-banner.jpeg";

interface Album {
  id: number;
  title: string;
  cover: string;
}

const albums: Album[] = [
  {
    id: 1,
    title: "Spaceship",
    cover: spaceshipAlbum
  },
  {
    id: 2,
    title: "Star People River",
    cover: starPeopleRiverAlbum
  },
  {
    id: 3,
    title: "Man on Film",
    cover: manOnFilmAlbum
  },
  {
    id: 4,
    title: "The Death of Love",
    cover: deathOfLoveAlbum
  },
  {
    id: 5,
    title: "Scene of My Restoration",
    cover: sceneOfMyRestorationAlbum
  },
  {
    id: 6,
    title: "The Last City on Earth",
    cover: centreOfWorldAlbum
  },
  {
    id: 7,
    title: "To the Dreamt Man",
    cover: toDreamtManAlbum
  }
];

const eps: Album[] = [
  {
    id: 8,
    title: "Flower",
    cover: flowerEpCover
  }
];

interface AlbumBannerProps {
  selectedAlbumId?: number;
  onAlbumClick?: (albumId: number) => void;
}

export const AlbumBanner = ({ selectedAlbumId, onAlbumClick }: AlbumBannerProps) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
  const [showEPs, setShowEPs] = useState(true); // Default to showing EPs on desktop
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mobile carousel state
  const [mobileShowingAlbums, setMobileShowingAlbums] = useState(false); // Start with EP banner
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'preparing' | 'sliding'>('idle');
  const [targetView, setTargetView] = useState<'albums' | 'ep' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const albumsScrollRef = useRef<HTMLDivElement>(null);
  const epScrollRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const handleAlbumClick = (album: Album) => {
    if (onAlbumClick) {
      onAlbumClick(album.id);
    }
  };

  const handleToggle = () => {
    setIsRotating(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowEPs(!showEPs);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
    setTimeout(() => setIsRotating(false), 600);
  };

  // Mobile: Switch to next banner (always slides from right)
  const switchToNext = useCallback(() => {
    if (animationPhase !== 'idle') return; // Prevent double-trigger
    
    const goingToAlbums = !mobileShowingAlbums;
    setTargetView(goingToAlbums ? 'albums' : 'ep');
    
    // Phase 1: Position incoming banner off-screen right (no transition)
    setAnimationPhase('preparing');
    
    // Phase 2: Start the slide animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimationPhase('sliding');
        
        // Reset albums scroll when switching to albums
        if (goingToAlbums) {
          setTimeout(() => {
            if (albumsScrollRef.current) {
              albumsScrollRef.current.scrollLeft = 0;
            }
          }, 50);
        }
      });
    });
  }, [animationPhase, mobileShowingAlbums]);

  // Handle transition end
  const handleTransitionEnd = useCallback(() => {
    if (animationPhase === 'sliding' && targetView) {
      setMobileShowingAlbums(targetView === 'albums');
      setTargetView(null);
      setAnimationPhase('idle');
    }
  }, [animationPhase, targetView]);

  // Handle touch/drag for mobile carousel switching
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setDragCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const dragDistance = dragStartX - dragCurrentX;
    const threshold = 50; // minimum drag distance to trigger switch
    
    if (mobileShowingAlbums) {
      // On albums banner - check if scrolled to the end and dragged left
      const scrollContainer = albumsScrollRef.current;
      if (scrollContainer) {
        const isAtEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10;
        if (isAtEnd && dragDistance > threshold) {
          switchToNext();
        }
      }
    } else {
      // On EP banner - swipe left to go to albums (same direction, circular)
      if (dragDistance > threshold) {
        switchToNext();
      }
    }
    
    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  const currentItems = showEPs ? eps : albums;

  return (
    <div data-banner="album" className="py-3 max-sm:py-3 bg-black/80 backdrop-blur-sm overflow-visible relative">
      <div className="container mx-auto px-6 max-sm:px-0 relative overflow-visible">
        <div className="flex justify-center items-center pb-2 max-sm:pb-1 relative overflow-visible">
          {/* Desktop view - with transitions (landscape only, not iPad portrait) */}
          <div className="hidden sm:flex portrait:[@media(min-width:768px)_and_(max-width:1366px)]:hidden justify-center items-center gap-8 overflow-visible">
            <div
              ref={containerRef}
              className={`flex justify-center items-center gap-8 transition-all duration-500 ${
                isTransitioning ? 'translate-x-[-100%] opacity-0' : 'translate-x-0 opacity-100'
              }`}
            >
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center cursor-pointer group"
                  onMouseEnter={() => setHoveredAlbum(item.id)}
                  onMouseLeave={() => setHoveredAlbum(null)}
                  onClick={() => handleAlbumClick(item)}
                >
                  <h3 className="font-palatino text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                    {item.title}
                  </h3>
                  
                  <div className="relative">
                    {item.cover ? (
                      <>
                        <img
                          src={item.cover}
                          alt={item.title}
                          width="96"
                          height="96"
                          loading="eager"
                          className={`w-24 h-24 object-cover rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                            selectedAlbumId === item.id
                              ? 'ring-2 ring-yellow-300/60 scale-105'
                              : hoveredAlbum === item.id 
                              ? 'scale-105 shadow-2xl shadow-yellow-300/20' 
                              : ''
                          }`}
                        />
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </>
                    ) : (
                      <div className={`w-24 h-24 rounded shadow-lg bg-black/40 border border-white/20 flex items-center justify-center transition-all duration-300 ${
                        selectedAlbumId === item.id
                          ? 'ring-2 ring-yellow-300/60 scale-105'
                          : hoveredAlbum === item.id 
                          ? 'scale-105 shadow-2xl shadow-yellow-300/20' 
                          : ''
                      }`}>
                        <span className="text-white/60 text-xs font-semibold text-center px-2">
                          Coming<br/>Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile view - Swipeable carousel (phones only) */}
          <div 
            ref={carouselContainerRef}
            className="flex sm:hidden w-full overflow-hidden relative"
            style={{ minHeight: '95px' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* EP Banner */}
            <div 
              className={`w-full flex-shrink-0 will-change-transform transition-all duration-300 ease-out ${
                // Current view or transitioning
                !mobileShowingAlbums && animationPhase === 'idle' ? 'relative opacity-100 translate-x-0' :
                !mobileShowingAlbums && animationPhase === 'preparing' ? 'relative opacity-100 translate-x-0' :
                targetView === 'albums' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-0 -translate-x-full' :
                targetView === 'ep' && animationPhase === 'preparing' ? 'absolute inset-0 opacity-0 translate-x-full' :
                targetView === 'ep' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-100 translate-x-0' :
                'absolute inset-0 opacity-0 translate-x-full pointer-events-none'
              }`}
              onTransitionEnd={targetView === 'ep' && animationPhase === 'sliding' ? handleTransitionEnd : undefined}
            >
              <div 
                ref={epScrollRef}
                className="flex items-center px-4 pb-2 pt-1 w-full overflow-visible"
              >
                {/* Spacer for centering - same width as Albums indicator */}
                <div className="w-16 flex-shrink-0"></div>
                
                {/* EP Cover - True center */}
                <div className="flex-1 flex justify-center">
                  {eps.map((item) => (
                    <div
                      key={`ep-${item.id}`}
                      className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                      onClick={() => handleAlbumClick(item)}
                      style={{ width: '64px' }}
                    >
                      <h3 className={`font-palatino text-[10px] font-semibold mb-0.5 text-center transition-colors duration-300 whitespace-nowrap overflow-visible ${
                        selectedAlbumId === item.id ? 'text-yellow-300' : 'text-white group-active:text-yellow-300'
                      }`}>
                        {item.title}
                      </h3>
                      
                      <div className="relative w-16 h-16 flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
                        {item.cover ? (
                          <>
                            <img
                              src={item.cover}
                              alt={item.title}
                              width="64"
                              height="64"
                              loading="eager"
                              className={`w-full h-full object-cover rounded transition-all duration-300 ${
                                selectedAlbumId === item.id
                                  ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_4px_12px_rgba(253,224,71,0.15)]'
                                  : 'shadow-lg'
                              }`}
                            />
                            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                          </>
                        ) : (
                          <div className={`w-16 h-16 rounded bg-black/40 border border-white/20 flex items-center justify-center transition-all duration-300 ${
                            selectedAlbumId === item.id
                              ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_4px_12px_rgba(253,224,71,0.15)]'
                              : 'shadow-lg'
                          }`}>
                            <span className="text-white/60 text-[10px] font-semibold text-center px-2">
                              Coming<br/>Soon
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Albums indicator on the far right */}
                <div 
                  className="flex items-center h-16 mt-3 flex-shrink-0 cursor-pointer pr-2"
                  onClick={switchToNext}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-palatino text-[11px] font-semibold text-yellow-300 whitespace-nowrap">
                      Albums
                    </span>
                    <ChevronRight className="w-4 h-4 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>

            {/* Albums Banner */}
            <div 
              className={`w-full flex-shrink-0 will-change-transform transition-all duration-300 ease-out ${
                mobileShowingAlbums && animationPhase === 'idle' ? 'relative opacity-100 translate-x-0' :
                mobileShowingAlbums && animationPhase === 'preparing' ? 'relative opacity-100 translate-x-0' :
                targetView === 'ep' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-0 -translate-x-full' :
                targetView === 'albums' && animationPhase === 'preparing' ? 'absolute inset-0 opacity-0 translate-x-full' :
                targetView === 'albums' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-100 translate-x-0' :
                'absolute inset-0 opacity-0 translate-x-full pointer-events-none'
              }`}
              onTransitionEnd={targetView === 'albums' && animationPhase === 'sliding' ? handleTransitionEnd : undefined}
            >
              <div 
                ref={albumsScrollRef}
                className="flex items-start pl-4 pr-4 pb-2 pt-1 overflow-x-auto overflow-y-visible scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {albums.map((item, index) => {
                  const spacingMap: Record<number, string> = {
                    0: '36px',
                    1: '40px',
                    2: '44px',
                    3: '56px',
                    4: '72px',
                    5: '60px',
                    6: '32px',
                  };
                  
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                      onClick={() => item.cover && handleAlbumClick(item)}
                      style={{ width: '64px', marginRight: spacingMap[index] || '0px' }}
                    >
                      <h3 className={`font-palatino text-[10px] font-semibold mb-0.5 text-center transition-colors duration-300 whitespace-nowrap overflow-visible ${
                        selectedAlbumId === item.id ? 'text-yellow-300' : 'text-white group-active:text-yellow-300'
                      }`}>
                        {item.title}
                      </h3>
                      
                      <div className="relative w-16 h-16 flex-shrink-0" style={{ aspectRatio: '1 / 1' }}>
                        <img
                          src={item.cover}
                          alt={item.title}
                          width="64"
                          height="64"
                          loading="eager"
                          className={`w-full h-full object-cover rounded transition-all duration-300 ${
                            selectedAlbumId === item.id
                              ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_4px_12px_rgba(253,224,71,0.15)]'
                              : 'shadow-lg'
                          }`}
                        />
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </div>
                    </div>
                  );
                })}

                {/* EP indicator at the end of albums */}
                <div 
                  className="flex items-center justify-center px-4 h-16 mt-3 flex-shrink-0 cursor-pointer"
                  onClick={switchToNext}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-palatino text-[11px] font-semibold text-yellow-300 whitespace-nowrap">
                      EP
                    </span>
                    <ChevronRight className="w-4 h-4 text-yellow-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* iPad Portrait view - Swipeable with triangular button at far right */}
          <div 
            className="hidden portrait:[@media(min-width:768px)_and_(max-width:1366px)]:flex w-full overflow-hidden relative"
            style={{ minHeight: '110px' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* EP Banner - iPad Portrait */}
            <div 
              className={`w-full flex-shrink-0 will-change-transform transition-all duration-300 ease-out ${
                !mobileShowingAlbums && animationPhase === 'idle' ? 'relative opacity-100 translate-x-0' :
                !mobileShowingAlbums && animationPhase === 'preparing' ? 'relative opacity-100 translate-x-0' :
                targetView === 'albums' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-0 -translate-x-full' :
                targetView === 'ep' && animationPhase === 'preparing' ? 'absolute inset-0 opacity-0 translate-x-full' :
                targetView === 'ep' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-100 translate-x-0' :
                'absolute inset-0 opacity-0 translate-x-full pointer-events-none'
              }`}
              onTransitionEnd={targetView === 'ep' && animationPhase === 'sliding' ? handleTransitionEnd : undefined}
            >
              <div className="flex items-center justify-center w-full px-6 relative">
                {/* EP Cover - centered */}
                <div className="flex justify-center items-center gap-8 flex-1">
                  {eps.map((item) => (
                    <div
                      key={`ipad-ep-${item.id}`}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => handleAlbumClick(item)}
                    >
                      <h3 className="font-palatino text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                        {item.title}
                      </h3>
                      <div className="relative">
                        <img
                          src={item.cover}
                          alt={item.title}
                          width="96"
                          height="96"
                          loading="eager"
                          className={`w-24 h-24 object-cover rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                            selectedAlbumId === item.id
                              ? 'ring-2 ring-yellow-300/60 scale-105'
                              : ''
                          }`}
                        />
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Albums toggle button - fixed right position */}
                <button
                  onClick={switchToNext}
                  className="absolute right-4 flex flex-col items-center gap-1 group hover:scale-105 transition-transform duration-200"
                  aria-label="Switch to Albums"
                >
                  <span className="font-palatino text-sm font-semibold text-yellow-300 whitespace-nowrap">
                    Albums
                  </span>
                  <div className="w-14 h-14 flex items-center justify-center">
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-yellow-300 ${isRotating ? 'animate-[spin-forward_0.6s_ease-in-out]' : ''}`}
                    >
                      <path d="M14 8 L38 24 L14 40 Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
                      <circle cx="20" cy="18" r="4.5" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.65"/>
                      <path d="M16 28 L24 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
                      <path d="M14 32 L22 34" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            {/* Albums Banner - iPad Portrait */}
            <div 
              className={`w-full flex-shrink-0 will-change-transform transition-all duration-300 ease-out ${
                mobileShowingAlbums && animationPhase === 'idle' ? 'relative opacity-100 translate-x-0' :
                mobileShowingAlbums && animationPhase === 'preparing' ? 'relative opacity-100 translate-x-0' :
                targetView === 'ep' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-0 -translate-x-full' :
                targetView === 'albums' && animationPhase === 'preparing' ? 'absolute inset-0 opacity-0 translate-x-full' :
                targetView === 'albums' && animationPhase === 'sliding' ? 'absolute inset-0 opacity-100 translate-x-0' :
                'absolute inset-0 opacity-0 translate-x-full pointer-events-none'
              }`}
              onTransitionEnd={targetView === 'albums' && animationPhase === 'sliding' ? handleTransitionEnd : undefined}
            >
              <div 
                className="flex items-center pl-4 pr-20 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {albums.map((item, index) => (
                  <div
                    key={`ipad-album-${item.id}`}
                    className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                    onClick={() => item.cover && handleAlbumClick(item)}
                    style={{ marginRight: index < albums.length - 1 ? '32px' : '0' }}
                  >
                    <h3 className="font-palatino text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                      {item.title}
                    </h3>
                    <div className="relative">
                      <img
                        src={item.cover}
                        alt={item.title}
                        width="96"
                        height="96"
                        loading="eager"
                        className={`w-24 h-24 object-cover rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                          selectedAlbumId === item.id
                            ? 'ring-2 ring-yellow-300/60 scale-105'
                            : ''
                        }`}
                      />
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                    </div>
                  </div>
                ))}

                {/* EP toggle button at end of scroll */}
                <button
                  onClick={switchToNext}
                  className="flex flex-col items-center gap-1 group hover:scale-105 transition-transform duration-200 flex-shrink-0 ml-8"
                  aria-label="Switch to EPs"
                >
                  <span className="font-palatino text-sm font-semibold text-yellow-300 whitespace-nowrap">
                    EPs
                  </span>
                  <div className="w-14 h-14 flex items-center justify-center">
                    <svg 
                      width="48" 
                      height="48" 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className={`text-yellow-300 ${isRotating ? 'animate-[spin-forward_0.6s_ease-in-out]' : ''}`}
                    >
                      <path d="M14 8 L38 24 L14 40 Z" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
                      <circle cx="20" cy="18" r="4.5" stroke="currentColor" strokeWidth="1.8" fill="none" opacity="0.65"/>
                      <path d="M16 28 L24 30" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" strokeLinecap="round"/>
                      <path d="M14 32 L22 34" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Toggle Button - Desktop landscape only */}
          <button
            onClick={handleToggle}
            className="hidden sm:flex portrait:[@media(min-width:768px)_and_(max-width:1366px)]:hidden absolute right-0 flex-col items-end gap-1 group hover:scale-105 transition-transform duration-200"
            aria-label={showEPs ? "Switch to Albums" : "Switch to EPs"}
          >
            {/* Label with smooth transition - centered */}
            <div className="relative h-5 mb-1 w-16 flex justify-center">
              <span
                className={`absolute font-palatino text-sm font-semibold text-yellow-300 transition-all duration-200 whitespace-nowrap ${
                  showEPs ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Albums
              </span>
              <span
                className={`absolute font-palatino text-sm font-semibold text-yellow-300 transition-all duration-200 whitespace-nowrap ${
                  showEPs ? 'opacity-0' : 'opacity-100'
                }`}
              >
                EPs
              </span>
            </div>
            
            {/* Right-pointing arrow button - larger and redesigned */}
            <div className="w-14 h-14 flex items-center justify-center">
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className={`text-yellow-300 ${
                  isRotating ? 'animate-[spin-forward_0.6s_ease-in-out]' : ''
                }`}
              >
                {/* Large right-pointing triangle - main element */}
                <path 
                  d="M14 8 L38 24 L14 40 Z" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  fill="none" 
                  strokeLinejoin="round"
                />
                {/* Circle - slightly overlapping */}
                <circle 
                  cx="20" 
                  cy="18" 
                  r="4.5" 
                  stroke="currentColor" 
                  strokeWidth="1.8" 
                  fill="none" 
                  opacity="0.65" 
                />
                {/* Parallel lines - floating, smaller */}
                <path 
                  d="M16 28 L24 30" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.7" 
                  strokeLinecap="round"
                />
                <path 
                  d="M14 32 L22 34" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  fill="none" 
                  opacity="0.5" 
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};