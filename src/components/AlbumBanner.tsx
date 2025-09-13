import { useState } from "react";

// Album covers
import magicalGardenAlbumNew from "@/assets/magical-garden-album-new.jpg";
import meltingDreamsAlbumNew from "@/assets/melting-dreams-album-new.jpg";
import surrealSymphonyAlbumNew from "@/assets/surreal-symphony-album-new.jpg";
import paperCutoutAlbumNew from "@/assets/paper-cutout-album-new.jpg";
import floatingToysAlbum from "@/assets/floating-toys-album.jpg";

interface Album {
  id: number;
  title: string;
  cover: string;
}

const albums: Album[] = [
  {
    id: 1,
    title: "The Centre of the World",
    cover: magicalGardenAlbumNew
  },
  {
    id: 2,
    title: "Melting Dreams",
    cover: meltingDreamsAlbumNew
  },
  {
    id: 3,
    title: "Surreal Symphony",
    cover: surrealSymphonyAlbumNew
  },
  {
    id: 4,
    title: "Paper Cutout Dreams",
    cover: paperCutoutAlbumNew
  },
  {
    id: 5,
    title: "Floating Memories",
    cover: floatingToysAlbum
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
    <div className="bg-black/90 backdrop-blur-md border-b border-white/20 py-3">
      <div className="container mx-auto px-6">
        <div className="flex justify-center items-center gap-6 overflow-x-auto pb-2">
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
                  className={`h-16 w-auto object-contain rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                    hoveredAlbum === album.id 
                      ? 'scale-125 shadow-2xl shadow-yellow-300/20' 
                      : selectedAlbumId === album.id
                      ? 'ring-2 ring-yellow-300/60 scale-110'
                      : 'hover:scale-110'
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