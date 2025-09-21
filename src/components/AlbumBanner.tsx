import { useState } from "react";

// Album covers
import spaceshipAlbum from "@/assets/spaceship-album.png";
import floatingInstrumentsAlbum from "@/assets/floating-instruments-album.jpeg";
import manOnFilmAlbum from "@/assets/man-on-film-album.jpeg";
import toDreamtManAlbum from "@/assets/to-the-dreamt-man-album.png";
import centreOfWorldAlbum from "@/assets/centre-of-world-album.png";

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
    title: "Floating Instruments",
    cover: floatingInstrumentsAlbum
  },
  {
    id: 3,
    title: "Man on Film",
    cover: manOnFilmAlbum
  },
  {
    id: 4,
    title: "To the Dreamt Man",
    cover: toDreamtManAlbum
  },
  {
    id: 5,
    title: "The Centre of the World",
    cover: centreOfWorldAlbum
  }
];

interface AlbumBannerProps {
  selectedAlbumId?: number;
  onAlbumClick?: (albumId: number) => void;
}

export const AlbumBanner = ({ selectedAlbumId, onAlbumClick }: AlbumBannerProps) => {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);

  const handleAlbumClick = (album: Album) => {
    if (onAlbumClick) {
      onAlbumClick(album.id);
    }
  };

  return (
    <div className="py-3 bg-black/80 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-center items-center gap-6 pb-2">
          {albums.map((album) => (
            <div
              key={album.id}
              className="flex flex-col items-center cursor-pointer group min-w-[80px]"
              onMouseEnter={() => setHoveredAlbum(album.id)}
              onMouseLeave={() => setHoveredAlbum(null)}
              onClick={() => handleAlbumClick(album)}
            >
              {/* Album Title */}
              <h3 className="font-serif text-xs font-semibold text-white mb-1 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                {album.title}
              </h3>
              
              {/* Album Cover */}
              <div className="relative">
                <img
                  src={album.cover}
                  alt={album.title}
                  width="64"
                  height="64"
                  loading="eager"
                  className={`rounded shadow-lg transition-all duration-300 group-hover:shadow-xl object-cover ${
                    selectedAlbumId === album.id
                      ? 'ring-2 ring-yellow-300/60 scale-105'
                      : hoveredAlbum === album.id 
                      ? 'scale-105 shadow-2xl shadow-yellow-300/20' 
                      : ''
                  }`}
                />
                
                {/* Subtle shelf effect */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};