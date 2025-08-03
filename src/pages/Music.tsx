import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Background images for different themes
import kabukiTheatreBackground from "@/assets/kabuki-theatre-background.jpg";
import englishMansionBackground from "@/assets/english-mansion-background.jpg";
import seasideIslandBackground from "@/assets/seaside-island-background.jpg";
import mountFujiInvertedBackground from "@/assets/mount-fuji-inverted.jpg";
import scifiSetBackground from "@/assets/scifi-set-background.jpg";

// Foreground overlay elements
import theatreCurtainsOverlay from "@/assets/theatre-curtains-overlay.png";
import britishStreetObjects from "@/assets/british-street-objects.png";
import japaneseElements from "@/assets/japanese-elements.png";
import englishGardenElements from "@/assets/english-garden-elements.png";
import scifiElements from "@/assets/scifi-elements.png";

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
    background: englishMansionBackground,
    theme: "stately-home",
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
    background: kabukiTheatreBackground,
    theme: "kabuki-theatre",
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
    background: seasideIslandBackground,
    theme: "seaside-scene",
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
    background: mountFujiInvertedBackground,
    theme: "mount-fuji",
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
    background: scifiSetBackground,
    theme: "scifi-set",
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
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAlbumSelect = (album: typeof albums[0]) => {
    if (album.id === selectedAlbum.id) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedAlbum(album);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navigation />
      
      {/* Dynamic Background Based on Selected Album */}
      <div className="fixed inset-0">
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
          style={{ 
            backgroundImage: `url(${selectedAlbum.background})`
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Sliding Theme Elements from Edges */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {selectedAlbum.theme === 'kabuki-theatre' && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Curtains slide in from sides */}
            <div 
              className={`absolute top-24 left-0 w-32 h-40 bg-contain bg-no-repeat opacity-50 transform transition-transform duration-1000 ${isTransitioning ? '-translate-x-full' : 'translate-x-0'}`}
              style={{ 
                backgroundImage: `url(${theatreCurtainsOverlay})`,
                backgroundPosition: 'top left'
              }}
            />
            <div 
              className={`absolute top-24 right-0 w-32 h-40 bg-contain bg-no-repeat opacity-50 transform transition-transform duration-1000 scale-x-[-1] ${isTransitioning ? 'translate-x-full' : 'translate-x-0'}`}
              style={{ 
                backgroundImage: `url(${theatreCurtainsOverlay})`,
                backgroundPosition: 'top right'
              }}
            />
          </div>
        )}
        
        {selectedAlbum.theme === 'stately-home' && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Garden foliage slides in from sides */}
            <div className={`absolute top-32 left-0 text-6xl opacity-40 transform transition-transform duration-1000 ${isTransitioning ? '-translate-x-full' : 'translate-x-4'}`}>
              🌿
            </div>
            <div className={`absolute top-56 left-0 text-4xl opacity-30 transform transition-transform duration-1200 ${isTransitioning ? '-translate-x-full' : 'translate-x-2'}`}>
              🦋
            </div>
            <div className={`absolute top-40 right-0 text-5xl opacity-35 transform transition-transform duration-1100 ${isTransitioning ? 'translate-x-full' : '-translate-x-4'}`}>
              🌺
            </div>
            <div className={`absolute bottom-32 right-0 text-4xl opacity-30 transform transition-transform duration-1300 ${isTransitioning ? 'translate-x-full' : '-translate-x-2'}`}>
              🍃
            </div>
          </div>
        )}
        
        {selectedAlbum.theme === 'seaside-scene' && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* British street objects slide in from sides */}
            <div className={`absolute bottom-32 left-0 text-4xl opacity-40 transform transition-transform duration-1000 ${isTransitioning ? '-translate-x-full' : 'translate-x-6'}`}>
              📮
            </div>
            <div className={`absolute top-36 left-0 text-3xl opacity-35 transform transition-transform duration-1200 ${isTransitioning ? '-translate-x-full' : 'translate-x-4'}`}>
              ☂️
            </div>
            <div className={`absolute top-48 right-0 text-3xl opacity-30 transform transition-transform duration-1100 ${isTransitioning ? 'translate-x-full' : '-translate-x-8'}`}>
              🚌
            </div>
            <div className={`absolute bottom-40 right-0 text-2xl opacity-35 transform transition-transform duration-1300 ${isTransitioning ? 'translate-x-full' : '-translate-x-6'}`}>
              🐕
            </div>
          </div>
        )}
        
        {selectedAlbum.theme === 'mount-fuji' && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Japanese elements slide in from sides */}
            <div className={`absolute top-32 left-0 text-5xl opacity-40 transform transition-transform duration-1000 ${isTransitioning ? '-translate-x-full' : 'translate-x-8'}`}>
              🏮
            </div>
            <div className={`absolute bottom-40 left-0 text-4xl opacity-35 transform transition-transform duration-1200 ${isTransitioning ? '-translate-x-full' : 'translate-x-4'}`}>
              ⛩️
            </div>
            <div className={`absolute top-40 right-0 text-4xl opacity-30 transform transition-transform duration-1100 ${isTransitioning ? 'translate-x-full' : '-translate-x-8'}`}>
              🌸
            </div>
            <div className={`absolute bottom-32 right-0 text-3xl opacity-35 transform transition-transform duration-1300 ${isTransitioning ? 'translate-x-full' : '-translate-x-6'}`}>
              🗾
            </div>
          </div>
        )}
        
        {selectedAlbum.theme === 'scifi-set' && (
          <div className={`absolute inset-0 transition-all duration-1000 ease-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
            {/* Sci-fi elements slide in from sides */}
            <div className={`absolute top-36 left-0 text-4xl opacity-40 transform transition-transform duration-1000 ${isTransitioning ? '-translate-x-full' : 'translate-x-6'}`}>
              🛸
            </div>
            <div className={`absolute bottom-36 left-0 text-3xl opacity-35 transform transition-transform duration-1200 ${isTransitioning ? '-translate-x-full' : 'translate-x-4'}`}>
              🚀
            </div>
            <div className={`absolute top-32 right-0 text-3xl opacity-30 transform transition-transform duration-1100 ${isTransitioning ? 'translate-x-full' : '-translate-x-8'}`}>
              ⭐
            </div>
            <div className={`absolute bottom-40 right-0 text-2xl opacity-35 transform transition-transform duration-1300 ${isTransitioning ? 'translate-x-full' : '-translate-x-6'}`}>
              🌌
            </div>
          </div>
        )}
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