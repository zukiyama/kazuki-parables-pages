import { useState } from "react";

// Import parable-related images
import silverEyedGirlPlayground1 from "@/assets/silver-eyed-girl-playground-1.jpg";
import silverEyedGirlPlayground2 from "@/assets/silver-eyed-girl-playground-2.jpg";
import residentialAerial from "@/assets/residential-aerial-1.jpg";
import residentialCourtyard from "@/assets/residential-courtyard-1.jpg";
import residentialHighAngle from "@/assets/residential-high-angle-1.jpg";
import residentialWide from "@/assets/residential-wide-1.jpg";
import playgroundScene from "@/assets/playground-scene.jpg";
import playgroundSunset from "@/assets/playground-sunset-1.jpg";
import childrenSilhouette from "@/assets/children-silhouette-kyoto.jpg";

const parableImages = [
  { image: silverEyedGirlPlayground1, alt: "Girl in playground with mysterious elements" },
  { image: silverEyedGirlPlayground2, alt: "Girl in playground scene 2" },
  { image: residentialAerial, alt: "Aerial view of Japanese residential area" },
  { image: residentialCourtyard, alt: "Japanese residential courtyard" },
  { image: residentialHighAngle, alt: "High angle view of residential area" },
  { image: residentialWide, alt: "Wide view of residential buildings" },
  { image: playgroundScene, alt: "Children's playground scene" },
  { image: playgroundSunset, alt: "Playground at sunset" },
  { image: childrenSilhouette, alt: "Children silhouettes in Kyoto" }
];

export const ParableImageSelector = () => {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="w-full">
      {/* Main Image Display */}
      <div className="relative mb-4">
        <img 
          key={`parable-${selectedImage}`}
          src={parableImages[selectedImage].image} 
          alt={parableImages[selectedImage].alt}
          className="w-full aspect-[4/3] object-cover rounded-lg shadow-2xl transition-opacity duration-300"
        />
      </div>
      
      {/* Image Selector Bar */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {parableImages.map((item, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all duration-200 ${
              index === selectedImage 
                ? 'border-white shadow-lg scale-105' 
                : 'border-white/40 hover:border-white/60 hover:scale-102'
            }`}
          >
            <img 
              src={item.image} 
              alt={item.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};