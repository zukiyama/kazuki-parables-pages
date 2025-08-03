import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Background and parallax images
import claymationCountryside from "@/assets/claymation-countryside.jpg";
import parallaxClouds from "@/assets/parallax-clouds.jpg";
import parallaxObjects from "@/assets/parallax-objects.jpg";
import parallaxCloudsLayer1 from "@/assets/parallax-clouds-layer1.png";
import parallaxCloudsLayer2 from "@/assets/parallax-clouds-layer2.png";

// Album covers
import magicalGardenAlbum from "@/assets/magical-garden-album-updated.jpg";
import meltingGuitarAlbum from "@/assets/melting-guitar-1.jpg";
import musicSurrealAlbum from "@/assets/music-surreal-objects-1.jpg";
import paperCutoutAlbum from "@/assets/paper-cutout-album.jpg";
import floatingToysAlbum from "@/assets/floating-toys-album.jpg";
import geometricSurrealAlbum from "@/assets/geometric-surreal-album.jpg";

const albums = [
  {
    id: 1,
    title: "Magical Secret Garden",
    cover: magicalGardenAlbum,
    tracks: [
      "Through the Garden Gate",
      "Fairy Light Serenade",
      "Whispers in the Willows",
      "Secret Pathways",
      "Coming Soon..."
    ]
  },
  {
    id: 2,
    title: "Melting Dreams",
    cover: meltingGuitarAlbum,
    tracks: [
      "Liquid Strings",
      "Wax and Memory",
      "Bending Time",
      "Molten Harmonies",
      "Coming Soon..."
    ]
  },
  {
    id: 3,
    title: "Surreal Symphony",
    cover: musicSurrealAlbum,
    tracks: [
      "Objects in Flight",
      "Floating Melodies",
      "Sky Orchestra",
      "Weightless Wonder",
      "Coming Soon..."
    ]
  },
  {
    id: 4,
    title: "Paper Cutout Dreams",
    cover: paperCutoutAlbum,
    tracks: [
      "Torn Sheet Music",
      "Collage of Sound",
      "Paper Moon Rising",
      "Cutout Conversations",
      "Coming Soon..."
    ]
  },
  {
    id: 5,
    title: "Floating Memories",
    cover: floatingToysAlbum,
    tracks: [
      "Teddy Bear Waltz",
      "Wooden Block Percussion",
      "Spinning Top Melody",
      "Childhood Echoes",
      "Coming Soon..."
    ]
  }
];

const Music = () => {
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Background Layers */}
      <div className="fixed inset-0">
        {/* Main countryside background */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${claymationCountryside})`,
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        
        {/* Parallax objects layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ 
            backgroundImage: `url(${parallaxObjects})`,
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        
        {/* Clouds layer */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: `url(${parallaxClouds})`,
            transform: `translateY(${scrollY * 0.7}px)`
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Floating Cloud Layers - Above content */}
      <div className="fixed inset-0 pointer-events-none z-20">
        {/* Top Cloud Layer with hot air balloon */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ 
            backgroundImage: `url(${parallaxCloudsLayer1})`,
            transform: `translateY(${scrollY * 0.2}px)`
          }}
        />
        
        {/* Bottom Cloud Layer - smaller clouds */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: `url(${parallaxCloudsLayer2})`,
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
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
          <div className="mb-16 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20 animate-scale-in">
              <img 
                src={selectedAlbum.cover} 
                alt={selectedAlbum.title}
                className="w-80 h-80 mx-auto rounded-lg shadow-2xl mb-6 transition-all duration-500 hover:scale-105"
              />
              <h2 className="font-serif text-3xl text-white mb-2">{selectedAlbum.title}</h2>
              <p className="text-white/80 text-lg mb-6">Featured Album</p>
              
              {/* Music Player Controls */}
              <div className="flex justify-center items-center space-x-4 mb-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/20 border-white/40 text-white hover:bg-white/30 rounded-full w-12 h-12 p-0"
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
                >
                  <SkipForward className="w-5 h-5" />
                </Button>
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
                  onClick={() => setSelectedAlbum(album)}
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
          
          {/* Current Album Track Listing */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-white text-2xl font-bold mb-4 font-serif">
                Current Album: {selectedAlbum.title}
              </h3>
              <div className="space-y-3">
                {selectedAlbum.tracks.map((track, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-black/30 rounded hover:bg-black/40 transition-colors cursor-pointer"
                  >
                    <span className="text-white font-serif">{index + 1}. {track}</span>
                    <div className="text-white/60">
                      {track.includes("Coming Soon") ? "⏳" : "▶"}
                    </div>
                  </div>
                ))}
              </div>
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