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
  const [mobileShowingAlbums, setMobileShowingAlbums] = useState(true);
  const [mobileSlideDirection, setMobileSlideDirection] = useState<'left' | 'right' | null>(null);
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

  // Mobile: Switch to EP banner
  const switchToEP = useCallback(() => {
    setMobileSlideDirection('left');
    setTimeout(() => {
      setMobileShowingAlbums(false);
      setMobileSlideDirection(null);
    }, 300);
  }, []);

  // Mobile: Switch to Albums banner
  const switchToAlbums = useCallback(() => {
    setMobileSlideDirection('right');
    setTimeout(() => {
      setMobileShowingAlbums(true);
      setMobileSlideDirection(null);
    }, 300);
  }, []);

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
          switchToEP();
        }
      }
    } else {
      // On EP banner - check if dragged right to go back to albums
      if (dragDistance < -threshold) {
        switchToAlbums();
      }
    }
    
    setIsDragging(false);
    setDragStartX(0);
    setDragCurrentX(0);
  };

  const currentItems = showEPs ? eps : albums;

  return (
    <div data-banner="album" className="py-3 max-sm:py-4 bg-black/80 backdrop-blur-sm overflow-visible relative">
      <div className="container mx-auto px-6 max-sm:px-0 relative">
        <div className="flex justify-center items-center pb-2 relative overflow-y-visible">
          {/* Desktop view - with transitions */}
          <div className="hidden sm:flex justify-center items-center gap-8 overflow-visible">
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

          {/* Mobile view - Swipeable carousel between Albums and EP */}
          <div 
            ref={carouselContainerRef}
            className="flex sm:hidden w-full overflow-hidden relative"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Albums Banner */}
            <div 
              className={`w-full flex-shrink-0 transition-transform duration-300 ease-out ${
                mobileSlideDirection === 'left' ? '-translate-x-full' : 
                mobileSlideDirection === 'right' ? 'translate-x-full' : 
                mobileShowingAlbums ? 'translate-x-0' : '-translate-x-full absolute'
              } ${!mobileShowingAlbums && !mobileSlideDirection ? 'hidden' : ''}`}
            >
              <div 
                ref={albumsScrollRef}
                className="flex items-start pl-4 pr-4 overflow-x-auto scrollbar-hide"
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
                              ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_10px_30px_rgba(253,224,71,0.3)]'
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
                  onClick={switchToEP}
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

            {/* EP Banner */}
            <div 
              className={`w-full flex-shrink-0 transition-transform duration-300 ease-out ${
                mobileSlideDirection === 'right' ? '-translate-x-full' : 
                mobileSlideDirection === 'left' ? 'translate-x-0' : 
                !mobileShowingAlbums ? 'translate-x-0' : 'translate-x-full absolute'
              } ${mobileShowingAlbums && !mobileSlideDirection ? 'hidden' : ''}`}
            >
              <div 
                ref={epScrollRef}
                className="flex items-start justify-center px-4"
              >
                {/* Albums indicator at the start */}
                <div 
                  className="flex items-center justify-center px-4 h-16 mt-3 flex-shrink-0 cursor-pointer mr-8"
                  onClick={switchToAlbums}
                >
                  <div className="flex items-center gap-1">
                    <ChevronRight className="w-4 h-4 text-yellow-300 rotate-180" />
                    <span className="font-palatino text-[11px] font-semibold text-yellow-300 whitespace-nowrap">
                      Albums
                    </span>
                  </div>
                </div>

                {/* EP Cover - Centered */}
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
                                ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_10px_30px_rgba(253,224,71,0.3)]'
                                : 'shadow-lg'
                            }`}
                          />
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                        </>
                      ) : (
                        <div className={`w-16 h-16 rounded bg-black/40 border border-white/20 flex items-center justify-center transition-all duration-300 ${
                          selectedAlbumId === item.id
                            ? 'shadow-[0_0_0_2px_rgba(253,224,71,0.6),0_10px_30px_rgba(253,224,71,0.3)]'
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

                {/* Albums indicator at the end */}
                <div 
                  className="flex items-center justify-center px-4 h-16 mt-3 flex-shrink-0 cursor-pointer ml-8"
                  onClick={switchToAlbums}
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
          </div>

          {/* Toggle Button - Desktop only */}
          <button
            onClick={handleToggle}
            className="hidden sm:flex absolute right-0 flex-col items-end gap-1 group hover:scale-105 transition-transform duration-200"
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