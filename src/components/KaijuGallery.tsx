import { useState } from "react";
import kaijuCover from "@/assets/kaiju-cover-shadow-1.jpg";
import kaijuScene1 from "@/assets/kaiju-scene-1.jpg";
import kaijuScene2 from "@/assets/kaiju-scene-2.jpg";
import kaijuScene3 from "@/assets/kaiju-scene-3.jpg";
import kaijuScene4 from "@/assets/kaiju-scene-4.jpg";

const galleryImages = [
  { src: kaijuCover, alt: "KAIJU Book Cover" },
  { src: kaijuScene1, alt: "Boys discovering mysterious creatures" },
  { src: kaijuScene2, alt: "Strange creatures in the sky" },
  { src: kaijuScene3, alt: "Searching for clues" },
  { src: kaijuScene4, alt: "Mysterious town at dusk" }
];

export const KaijuGallery = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="w-full max-w-md mx-auto mb-4">
        <img 
          src={galleryImages[selectedImage].src}
          alt={galleryImages[selectedImage].alt}
          className="w-full aspect-[3/4] object-cover rounded-lg shadow-2xl"
        />
      </div>
      
      {/* Thumbnail Navigation */}
      <div className="flex justify-center space-x-2 max-w-md mx-auto">
        {galleryImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-12 h-16 rounded overflow-hidden border-2 transition-all ${
              index === selectedImage 
                ? 'border-white shadow-lg scale-110' 
                : 'border-white/30 hover:border-white/60'
            }`}
          >
            <img 
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};