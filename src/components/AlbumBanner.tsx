import { Carousel3D } from "./Carousel3D";

// Album covers
import magicalGardenAlbumNew from "@/assets/magical-garden-album-new.jpg";
import meltingDreamsAlbumNew from "@/assets/melting-dreams-album-new.jpg";
import surrealSymphonyAlbumNew from "@/assets/surreal-symphony-album-new.jpg";
import paperCutoutAlbumNew from "@/assets/paper-cutout-album-new.jpg";
import floatingToysAlbum from "@/assets/floating-toys-album.jpg";

const albums = [
  {
    id: 1,
    title: "The Centre of the World",
    image: magicalGardenAlbumNew
  },
  {
    id: 2,
    title: "Melting Dreams",
    image: meltingDreamsAlbumNew
  },
  {
    id: 3,
    title: "Surreal Symphony",
    image: surrealSymphonyAlbumNew
  },
  {
    id: 4,
    title: "Paper Cutout Dreams",
    image: paperCutoutAlbumNew
  },
  {
    id: 5,
    title: "Floating Memories",
    image: floatingToysAlbum
  }
];

interface AlbumBannerProps {
  selectedAlbumId?: number;
  onAlbumClick?: (albumId: number) => void;
}

export const AlbumBanner = ({ selectedAlbumId, onAlbumClick }: AlbumBannerProps) => {
  return (
    <div className="bg-black/90 backdrop-blur-md border-b border-white/20 py-6">
      <div className="container mx-auto px-6">
        <Carousel3D
          items={albums}
          selectedItemId={selectedAlbumId}
          onItemSelect={(albumId) => {
            if (onAlbumClick) {
              onAlbumClick(albumId as number);
            }
          }}
          className="h-32"
        />
      </div>
    </div>
  );
};