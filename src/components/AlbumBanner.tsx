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
  const [centerIndex, setCenterIndex] = useState(2); // Start with middle album centered

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    setCenterIndex(api.selectedScrollSnap() + 2); // Account for center position

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
      setCenterIndex(api.selectedScrollSnap() + 2);
    });
  }, [api]);

  useEffect(() => {
    // Auto-select the centered album
    if (onAlbumClick && albums[centerIndex - 2]) {
      onAlbumClick(albums[centerIndex - 2].id);
    }
  }, [centerIndex, onAlbumClick]);

  const handleAlbumClick = (album: Album, index: number) => {
    if (onAlbumClick) {
      onAlbumClick(album.id);
    }
    
    // Scroll to center this album
    if (api) {
      api.scrollTo(index - 2);
    }
  };

  // Calculate position relative to center for styling
  const getAlbumStyle = (index: number) => {
    const distanceFromCenter = Math.abs(index - centerIndex);
    const isCenter = distanceFromCenter === 0;
    const isNearCenter = distanceFromCenter <= 1;
    const isMidDistance = distanceFromCenter <= 2;
    
    let scale = 1;
    let opacity = 1;
    
    if (isCenter) {
      scale = 1.4;
      opacity = 1;
    } else if (isNearCenter) {
      scale = 1.1;
      opacity = 0.8;
    } else if (isMidDistance) {
      scale = 0.9;
      opacity = 0.6;
    } else {
      scale = 0.7;
      opacity = 0.3;
    }
    
    return { scale, opacity };
  };

  return (
    <div className="bg-black/90 backdrop-blur-md border-b border-white/20 py-6">
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
            <CarouselContent className="-ml-4">
              {albums.map((album, index) => {
                const { scale, opacity } = getAlbumStyle(index);
                const isSelected = selectedAlbumId === album.id;
                
                return (
                  <CarouselItem key={album.id} className="pl-4 basis-1/5 flex justify-center">
                    <div
                      className="flex flex-col items-center cursor-pointer group transition-all duration-500 ease-out"
                      onClick={() => handleAlbumClick(album, index)}
                      style={{
                        transform: `scale(${scale})`,
                        opacity
                      }}
                    >
                      {/* Album Title */}
                      <h3 className="font-serif text-xs font-semibold text-white mb-2 text-center group-hover:text-yellow-300 transition-colors duration-300 whitespace-nowrap">
                        {album.title}
                      </h3>
                      
                      {/* Album Cover */}
                      <div className="relative">
                        <img
                          src={album.cover}
                          alt={album.title}
                          className={`h-20 w-auto object-contain rounded shadow-lg transition-all duration-300 group-hover:shadow-xl ${
                            isSelected
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
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white border border-white/20 h-10 w-10 rounded-full backdrop-blur-sm"
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white border border-white/20 h-10 w-10 rounded-full backdrop-blur-sm"
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </Carousel>
      </div>
    </div>
  );
};