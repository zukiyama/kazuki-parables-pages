import { useState, useRef, useEffect } from "react";

// Album covers
import spaceshipAlbum from "@/assets/spaceship-album.png";
import starPeopleRiverAlbum from "@/assets/star-people-river-album.jpeg";
import manOnFilmAlbum from "@/assets/man-on-film-album-new.jpeg";
import deathOfLoveAlbum from "@/assets/death-of-love-album.png";
import sceneOfMyRestorationAlbum from "@/assets/scene-of-my-restoration-album.png";
import centreOfWorldAlbum from "@/assets/centre-of-world-album-new.jpeg";
import toDreamtManAlbum from "@/assets/to-dreamt-man-album-new.jpeg";

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
    title: "The Centre of the World",
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
    title: "Coming Soon",
    cover: ""
  }
];

interface AlbumBannerProps {
  selectedAlbumId?: number;
  onAlbumClick?: (albumId: number) => void;
}

export const AlbumBanner = ({ selectedAlbumId, onAlbumClick }: AlbumBannerProps) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
  const [showEPs, setShowEPs] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAlbumClick = (album: Album) => {
    if (onAlbumClick) {
      onAlbumClick(album.id);
    }
  };

  const handleToggle = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowEPs(!showEPs);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 400);
  };

  const currentItems = showEPs ? eps : albums;

  return (
    <div className="py-3 max-sm:py-4 bg-black/80 backdrop-blur-sm overflow-visible relative">
      <div className="container mx-auto px-6 max-sm:px-2">
        <div className="flex justify-center items-center pb-2 relative overflow-y-visible">
          {/* Items Container */}
          <div className="flex justify-center items-center gap-8 overflow-visible max-sm:gap-3 max-sm:overflow-x-auto max-sm:overflow-y-visible max-sm:justify-start max-sm:flex-1 max-sm:scrollbar-hide max-sm:pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Desktop view - with transitions */}
            <div
              ref={containerRef}
              className={`hidden sm:flex justify-center items-center gap-8 transition-all duration-500 ${
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
                  <h3 className="font-serif text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
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
                      <div className="w-24 h-24 rounded shadow-lg bg-black/40 border border-white/20 flex items-center justify-center">
                        <span className="text-white/60 text-xs font-semibold text-center px-2">
                          Coming<br/>Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          {/* Mobile view - all albums + EPs label + EPs */}
          <div className="flex sm:hidden justify-start items-start gap-[72px] pl-4 pr-4">
              {/* Albums */}
              {albums.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                  onClick={() => item.cover && handleAlbumClick(item)}
                  style={{ width: '64px' }}
                >
                  <h3 className="font-serif text-[10px] font-semibold text-white mb-0.5 text-center group-active:text-yellow-300 transition-colors duration-300 whitespace-nowrap overflow-visible">
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
              ))}

              {/* EPs Label Separator */}
              <div className="flex items-center justify-center px-1 h-16 mt-5">
                <h3 className="font-serif text-[10px] font-semibold text-yellow-300 whitespace-nowrap">
                  EPs
                </h3>
              </div>

              {/* EPs */}
              {eps.map((item) => (
                <div
                  key={`ep-${item.id}`}
                  className="flex flex-col items-center cursor-pointer group flex-shrink-0"
                  onClick={() => handleAlbumClick(item)}
                  style={{ width: '64px' }}
                >
                  <h3 className="font-serif text-[10px] font-semibold text-white mb-0.5 text-center group-active:text-yellow-300 transition-colors duration-300 whitespace-nowrap overflow-visible">
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
                      <div className="w-16 h-16 rounded shadow-lg bg-black/40 border border-white/20 flex items-center justify-center">
                        <span className="text-white/60 text-[10px] font-semibold text-center px-2">
                          Coming<br/>Soon
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                className={`absolute font-serif text-sm font-semibold text-yellow-300 transition-all duration-200 whitespace-nowrap ${
                  showEPs ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Albums
              </span>
              <span
                className={`absolute font-serif text-sm font-semibold text-yellow-300 transition-all duration-200 whitespace-nowrap ${
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
                className="text-yellow-300 transition-colors duration-300"
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