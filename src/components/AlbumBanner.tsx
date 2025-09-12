import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      
      // Auto-select the centered album when carousel changes
      const centeredAlbum = albums[api.selectedScrollSnap()];
      if (onAlbumClick && centeredAlbum) {
        onAlbumClick(centeredAlbum.id);
      }
    });
  }, [api, onAlbumClick]);

  const handleAlbumClick = (album: Album, index: number) => {
    if (onAlbumClick) {
      onAlbumClick(album.id);
    }
    
    // Scroll to center this album
    if (api) {
      api.scrollTo(index);
    }
  };

  // Calculate position relative to center for styling
  const getAlbumStyle = (index: number) => {
    const distanceFromCenter = Math.abs(index - current);
    
    let scale = 1;
    let opacity = 1;
    let zIndex = 10;
    let translateZ = 0;
    
    if (distanceFromCenter === 0) {
      // Center album - largest and fully visible
      scale = 1.2;
      opacity = 1;
      zIndex = 30;
      translateZ = 0;
    } else if (distanceFromCenter === 1) {
      // Adjacent albums - smaller and slightly behind
      scale = 0.9;
      opacity = 0.8;
      zIndex = 20;
      translateZ = -20;
    } else if (distanceFromCenter === 2) {
      // Second tier - even smaller and more behind
      scale = 0.75;
      opacity = 0.6;
      zIndex = 15;
      translateZ = -40;
    } else {
      // Far albums - smallest and most hidden
      scale = 0.6;
      opacity = 0.3;
      zIndex = 10;
      translateZ = -60;
    }
    
    return { scale, opacity, zIndex, translateZ };
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border-b border-white/20 py-8">
      <div className="container mx-auto px-4">
        <Carousel
          setApi={setApi}
          className="w-full"
          opts={{
            align: "center",
            loop: true,
            dragFree: true,
            containScroll: "trimSnaps"
          }}
        >
          <div className="relative">
            <CarouselContent className="-ml-2 perspective-1000">
              {albums.map((album, index) => {
                const { scale, opacity, zIndex, translateZ } = getAlbumStyle(index);
                const isSelected = selectedAlbumId === album.id;
                const isCentered = index === current;
                
                return (
                  <CarouselItem key={album.id} className="pl-2 basis-1/5 flex justify-center">
                    <div
                      className="flex flex-col items-center cursor-pointer group transition-all duration-500 ease-out relative"
                      onClick={() => handleAlbumClick(album, index)}
                      style={{
                        transform: `scale(${scale}) translateZ(${translateZ}px)`,
                        opacity,
                        zIndex
                      }}
                    >
                      {/* Album Title */}
                      <h3 className={`font-serif text-sm font-semibold text-white mb-3 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap ${
                        isCentered ? 'text-yellow-300' : ''
                      }`}>
                        {album.title}
                      </h3>
                      
                      {/* Album Cover */}
                      <div className="relative">
                        <img
                          src={album.cover}
                          alt={album.title}
                          className={`h-24 w-auto object-contain rounded-lg shadow-lg transition-all duration-500 group-hover:shadow-xl ${
                            isCentered
                              ? 'ring-2 ring-yellow-300/80 shadow-2xl shadow-yellow-300/30'
                              : 'hover:shadow-2xl hover:shadow-yellow-300/20'
                          }`}
                        />
                        
                        {/* Subtle shelf effect */}
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Custom Navigation Arrows */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white border border-white/20 h-12 w-12 rounded-full backdrop-blur-sm z-40"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white border border-white/20 h-12 w-12 rounded-full backdrop-blur-sm z-40"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </Carousel>
      </div>
    </div>
  );
};