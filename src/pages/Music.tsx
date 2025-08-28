import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Background images for different themes
import desertKidsBg from "@/assets/music-bg-desert-kids.jpg";
import saltKitesBg from "@/assets/music-bg-salt-kites.jpg";
import pastelRiverBg from "@/assets/music-bg-pastel-river.jpg";
import cloudPlainBg from "@/assets/music-bg-cloud-plain.jpg";
import scifiSetBackground from "@/assets/scifi-set-background.jpg";

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
    cover: magicalGardenAlbumNew,
    background: desertKidsBg,
    theme: "stately-home",
    tracks: [
      "Through the Garden Gate",
      "Fairy Light Serenade",
      "Whispers in the Willows",
      "Secret Pathways",
      "Dancing Shadows",
      "Moonlit Corridors",
      "Crystal Reflections",
      "Garden of Mysteries",
      "Velvet Dreams",
      "Midnight Waltz",
      "Ethereal Echoes",
      "Silver Fountains",
      "Enchanted Evening",
      "Beyond the Veil"
    ]
  },
  {
    id: 2,
    title: "Melting Dreams",
    cover: meltingDreamsAlbumNew,
    background: saltKitesBg,
    theme: "kabuki-theatre",
    tracks: [
      "Liquid Strings",
      "Wax and Memory",
      "Bending Time",
      "Molten Harmonies",
      "Fluid Emotions",
      "Dripping Reality",
      "Soft Dissolution",
      "Warm Currents",
      "Flowing Thoughts",
      "Melted Glass",
      "Liquid Light",
      "Streaming Consciousness",
      "Viscous Visions",
      "Melting Point"
    ]
  },
  {
    id: 3,
    title: "Surreal Symphony",
    cover: surrealSymphonyAlbumNew,
    background: pastelRiverBg,
    theme: "seaside-scene",
    tracks: [
      "Objects in Flight",
      "Floating Melodies",
      "Sky Orchestra",
      "Weightless Wonder",
      "Gravity's Absence",
      "Suspended Animation",
      "Aerial Ballet",
      "Drifting Harmonics",
      "Levitating Dreams",
      "Atmospheric Pressure",
      "Cloud Chamber",
      "Zero Point",
      "Ascending Notes",
      "Celestial Dance"
    ]
  },
  {
    id: 4,
    title: "Paper Cutout Dreams",
    cover: paperCutoutAlbumNew,
    background: cloudPlainBg,
    theme: "mount-fuji",
    tracks: [
      "Torn Sheet Music",
      "Collage of Sound",
      "Paper Moon Rising",
      "Cutout Conversations",
      "Scissors Symphony",
      "Folded Memories",
      "Origami Melodies",
      "Creased Emotions",
      "Paper Trail",
      "Layered Stories",
      "Textured Silence",
      "Cardboard Dreams",
      "Pulp Fiction",
      "Final Cut"
    ]
  },
  {
    id: 5,
    title: "Floating Memories",
    cover: floatingToysAlbum,
    background: scifiSetBackground,
    theme: "scifi-set",
    tracks: [
      "Teddy Bear Waltz",
      "Wooden Block Percussion",
      "Spinning Top Melody",
      "Childhood Echoes",
      "Playground Phantoms",
      "Toy Box Secrets",
      "Marble Rolling",
      "Jack-in-the-Box",
      "Rocking Horse Blues",
      "Building Block Symphony",
      "Dollhouse Whispers",
      "Wind-up Dreams",
      "Nostalgic Lullaby",
      "Memory Lane"
    ]
  }
];

const Music = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  
  // Two-layer crossfade system
  const [layerA, setLayerA] = useState({ image: albums[0].background, opacity: 1 });
  const [layerB, setLayerB] = useState({ image: albums[0].background, opacity: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Preload images
  useEffect(() => {
    albums.forEach(album => {
      const img = new Image();
      img.src = album.background;
    });
  }, []);

  const handleAlbumSelect = (album: typeof albums[0]) => {
    if (album.id === selectedAlbum.id || isTransitioning) return;
    
    // Clear any existing transition
    if (transitionRef.current) {
      clearTimeout(transitionRef.current);
    }
    
    setIsTransitioning(true);
    
    // Preload the target image
    const img = new Image();
    img.onload = () => {
      // Determine which layer is currently visible
      const isLayerAVisible = layerA.opacity === 1;
      
      if (isLayerAVisible) {
        // Layer A is visible, prepare layer B with new image and fade it in
        setLayerB({ image: album.background, opacity: 0 });
        
        // Use requestAnimationFrame to ensure the new image is set before starting transition
        requestAnimationFrame(() => {
          setLayerA(prev => ({ ...prev, opacity: 0 }));
          setLayerB(prev => ({ ...prev, opacity: 1 }));
        });
      } else {
        // Layer B is visible, prepare layer A with new image and fade it in
        setLayerA({ image: album.background, opacity: 0 });
        
        requestAnimationFrame(() => {
          setLayerB(prev => ({ ...prev, opacity: 0 }));
          setLayerA(prev => ({ ...prev, opacity: 1 }));
        });
      }
      
      // Update album immediately as fade begins
      setSelectedAlbum(album);
      
      // Clear transition state after animation completes
      transitionRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 800); // Match CSS transition duration
    };
    
    img.src = album.background;
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <Navigation />
      
      {/* Two-Layer Crossfade Background System */}
      <div className="fixed inset-0">
        {/* Layer A */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{ 
            backgroundImage: `url(${layerA.image})`,
            opacity: layerA.opacity
          }}
        />
        {/* Layer B */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out"
          style={{ 
            backgroundImage: `url(${layerB.image})`,
            opacity: layerB.opacity
          }}
        />
        {/* Static overlay for readability - not animated */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
      </div>
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-6xl font-bold text-white mb-4 tracking-wide animate-fade-in">
              Music
            </h1>
            <p className="text-white/80 text-xl font-serif">
              A collection of surreal soundscapes and magical melodies
            </p>
          </div>
          
          {/* Video Player - Moved to top */}
          <div className="mb-16">
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4 font-serif">Music Video</h3>
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                <div className="text-white/60 text-center">
                  <div className="text-6xl mb-4">🎬</div>
                  <p className="text-lg font-serif">Video for "{selectedAlbum.title}"</p>
                  <p className="text-sm">Coming soon...</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Album */}
          <div className="mb-16">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 animate-scale-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Album Cover - Left Side */}
                <div className="text-center">
                  <img 
                    src={selectedAlbum.cover} 
                    alt={selectedAlbum.title}
                    className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6 transition-all duration-500 hover:scale-105"
                  />
                  <h2 className="font-serif text-3xl text-white mb-2">{selectedAlbum.title}</h2>
                  <p className="text-white/80 text-lg mb-6">Featured Album</p>
                  
                  {/* Music Player Controls */}
                  <div className="flex justify-center items-center space-x-4 mb-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/20 border-white/40 text-white hover:bg-white/30 rounded-full w-12 h-12 p-0"
                      onClick={() => {
                        setCurrentTrackIndex((prev) => {
                          const playable = selectedAlbum.tracks;
                          if (playable.length === 0) return null;
                          const idx = prev === null ? 0 : (prev - 1 + playable.length) % playable.length;
                          setIsPlaying(true);
                          return idx;
                        });
                      }}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-white/20 border-white/40 text-white hover:bg-white/30 rounded-full w-16 h-16 p-0"
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-white/20 border-white/40 text-white hover:bg-white/30 rounded-full w-12 h-12 p-0"
                      onClick={() => {
                        setCurrentTrackIndex((prev) => {
                          const playable = selectedAlbum.tracks;
                          if (playable.length === 0) return null;
                          const idx = prev === null ? 0 : (prev + 1) % playable.length;
                          setIsPlaying(true);
                          return idx;
                        });
                      }}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                  {currentTrackIndex !== null && (
                    <p className="text-white/80 text-sm mb-4 font-serif">Now playing: {selectedAlbum.tracks[currentTrackIndex]}</p>
                  )}
                </div>

                {/* Track Listing - Right Side */}
                <div className="lg:pl-4 flex flex-col">
                  <h3 className="text-white text-2xl font-bold mb-4 font-serif text-center">
                    Track Listing
                  </h3>
                  <ScrollArea className="h-[580px] w-full rounded-md border border-white/20 p-4 bg-black/20">
                    <div className="space-y-3">
                      {selectedAlbum.tracks.map((track, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-black/30 rounded hover:bg-black/40 transition-colors cursor-pointer"
                          onClick={() => {
                            setCurrentTrackIndex(index); 
                            setIsPlaying(true);
                          }}
                        >
                          <span className="text-white font-serif">{index + 1}. {track}</span>
                          <div className="text-white/60">
                            {currentTrackIndex === index ? "⏸" : "▶"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Album Selection Grid */}
          <div className="mb-12">
            <h3 className="font-serif text-3xl text-white mb-8 text-center">Choose Your Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {albums.map((album, index) => (
                <div
                  key={album.id}
                  className={`cursor-pointer transition-all duration-500 hover:scale-110 animate-fade-in ${
                    selectedAlbum.id === album.id ? 'ring-4 ring-white/60 rounded-lg' : ''
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleAlbumSelect(album)}
                >
                  <img 
                    src={album.cover} 
                    alt={album.title}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                  />
                  <p className="text-white text-sm mt-2 text-center font-serif">{album.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Singles (click to play) */}
          <div className="mb-8">
            <h4 className="font-serif text-2xl text-white mb-4 text-center">Singles</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {selectedAlbum.tracks.slice(0,4).map((track, idx) => (
                <button
                  key={idx}
                  className={`relative group rounded-lg overflow-hidden border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 ${currentTrackIndex===idx? 'ring-2 ring-white/60':''}`}
                  onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                >
                  <img src={selectedAlbum.cover} alt={`${selectedAlbum.title} - ${track}`} className="w-full aspect-square object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute bottom-2 left-2 right-2 text-left">
                    <span className="text-white text-sm font-serif line-clamp-2">{track}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          
        </div>
      </main>
      
      <footer className="bg-card/80 backdrop-blur-md border-t border-border py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-white">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Music;