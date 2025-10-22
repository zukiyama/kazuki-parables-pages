import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { AlbumBanner } from "@/components/AlbumBanner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Background images for different themes
import spaceshipBackground from "@/assets/spaceship-background.jpg";
import floatingInstrumentsBackground from "@/assets/floating-instruments-background.jpg";
import manOnFilmBackground from "@/assets/man-on-film-background.jpg";
import toDreamtManBackground from "@/assets/to-the-dreamt-man-background.jpg";
import centreOfWorldBackground from "@/assets/centre-of-world-background.jpg";
import ohioCassettePoster from "@/assets/circles-single-poster.jpeg";

// Album covers
import spaceshipAlbum from "@/assets/spaceship-album.png";
import starPeopleRiverAlbum from "@/assets/star-people-river-album.jpeg";
import manOnFilmAlbum from "@/assets/man-on-film-album-new.jpeg";
import deathOfLoveAlbum from "@/assets/death-of-love-album.png";
import sceneOfMyRestorationAlbum from "@/assets/scene-of-my-restoration-album.png";
import centreOfWorldAlbum from "@/assets/centre-of-world-album-new.jpeg";
import toDreamtManAlbum from "@/assets/to-dreamt-man-album-new.jpeg";

const albums = [
  {
    id: 1,
    title: "Spaceship",
    cover: spaceshipAlbum,
    background: spaceshipBackground,
    theme: "dreamy-clouds",
    tracks: [
      "Piano in the Sky",
      "Childhood Dreams",
      "Cloud Walker",
      "Innocent Wonder",
      "Keys to Heaven",
      "Floating Away",
      "Young Astronaut",
      "Celestial Melody",
      "Dreamscape",
      "Musical Journey",
      "Spaceship Lullaby",
      "Beyond the Clouds",
      "Starlight Sonata",
      "Infinite Possibilities"
    ]
  },
  {
    id: 2,
    title: "Star People River",
    cover: starPeopleRiverAlbum,
    background: floatingInstrumentsBackground,
    theme: "surreal-street",
    tracks: [
      "Objects in Flight",
      "Street Symphony",
      "Gravity Defied",
      "Musical Parade",
      "Floating Piano",
      "Airborne Orchestra",
      "Levitating Melodies",
      "City Dreams",
      "Suspended Sound",
      "Musical Traffic",
      "Sky Dance",
      "Weightless Wonder",
      "Street Magic",
      "Flying Notes"
    ]
  },
  {
    id: 3,
    title: "Man on Film",
    cover: manOnFilmAlbum,
    background: manOnFilmBackground,
    theme: "cinematic-noir",
    tracks: [
      "Silent Frames",
      "Shadow Play",
      "Walking the Dog",
      "Minimalist Score",
      "Black and White",
      "Final Cut",
      "Cinematic Journey",
      "Noir Narrative",
      "Film Grain",
      "Director's Vision",
      "Spotlight Solo",
      "Fade to Black",
      "End Credits",
      "Man and Shadow"
    ]
  },
  {
    id: 4,
    title: "The Death of Love",
    cover: deathOfLoveAlbum,
    background: manOnFilmBackground,
    theme: "urban-melancholy",
    tracks: [
      "City Lights Fade",
      "Lost Letters",
      "Empty Streets",
      "Rain on Pavement",
      "Forgotten Words",
      "Last Embrace",
      "Streetlamp Solitude",
      "Fading Memories",
      "The Final Goodbye",
      "Urban Requiem",
      "Silent Tears",
      "Midnight Reflections",
      "Love's Echo",
      "The Death of Love"
    ]
  },
  {
    id: 5,
    title: "Scene of My Restoration",
    cover: sceneOfMyRestorationAlbum,
    background: toDreamtManBackground,
    theme: "autumn-restoration",
    tracks: [
      "Window to the Soul",
      "Bare Branches",
      "Autumn's Embrace",
      "Morning Light",
      "Restoration Begins",
      "Golden Hour",
      "Healing Melodies",
      "Quiet Reflection",
      "Renewed Hope",
      "Building Windows",
      "Through the Trees",
      "Solitary Figure",
      "New Beginnings",
      "Scene of My Restoration"
    ]
  },
  {
    id: 6,
    title: "The Centre of the World",
    cover: centreOfWorldAlbum,
    background: centreOfWorldBackground,
    theme: "magical-garden",
    tracks: [
      "Through the Garden Gate",
      "Wildflower Symphony",
      "Secret Garden",
      "Blooming Melodies",
      "Wooden Gate",
      "Nature's Song",
      "Garden Path",
      "Flower Power",
      "Enchanted Portal",
      "Garden Dreams",
      "Peaceful Valley",
      "Nature's Embrace",
      "Garden of Eden",
      "Centre of Everything"
    ]
  },
  {
    id: 7,
    title: "To the Dreamt Man",
    cover: toDreamtManAlbum,
    background: toDreamtManBackground,
    theme: "golden-desert",
    tracks: [
      "Desert Journey",
      "Golden Horizon",
      "Walking with Cats",
      "Dust and Dreams",
      "Lonely Traveler",
      "Sand Dunes",
      "Mirage Music",
      "Sunset Serenade",
      "Wanderer's Song",
      "Heat Waves",
      "Distant Thunder",
      "Oasis Dreams",
      "Desert Wind",
      "Journey's End"
    ]
  }
];

const Music = () => {
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const trackListingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  
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

  // Handle Ohio banner navigation - scroll to video player
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('ohio') === 'true' && videoRef.current) {
      const navigationHeight = 64; // Navigation bar height
      const bannerHeight = 176; // Banner height
      const gap = 16; // Gap above video
      const totalOffset = navigationHeight + bannerHeight + gap;
      const offset = videoRef.current.offsetTop - totalOffset;
      
      setTimeout(() => {
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [location.search]);

  // Optimized image preloading - only preload first 2 albums
  useEffect(() => {
    albums.slice(0, 2).forEach(album => {
      const img = new Image();
      img.src = album.background;
    });
  }, []);

  const handleAlbumSelect = (album: typeof albums[0]) => {
    
    // Clear any existing transition
    if (transitionRef.current) {
      clearTimeout(transitionRef.current);
    }
    
    setIsTransitioning(true);
    
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
    
    // Update album immediately as fade begins or if same album
    if (album.id !== selectedAlbum.id) {
      setSelectedAlbum(album);
    }
    
    // Scroll to show entire container with gap from banner
    setTimeout(() => {
      if (trackListingRef.current) {
        const navigationHeight = 64; // Navigation bar height (h-16)
        const bannerHeight = 176; // Banner height (from top-16 to pt-60: 240-64=176)
        const gap = 4; // Smaller gap between banner and container (~5mm on iPad 13")
        const totalOffset = navigationHeight + bannerHeight + gap;
        const offset = trackListingRef.current.offsetTop - totalOffset;
        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    }, 100); // Small delay to ensure DOM update
    
    // Clear transition state after animation completes
    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 800); // Match CSS transition duration
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      <Navigation />
      
      {/* Album Banner - Fixed at top */}  
      <div className="fixed top-16 left-0 right-0 z-20">
        <AlbumBanner 
          selectedAlbumId={selectedAlbum.id}
          onAlbumClick={(albumId) => {
            const album = albums.find(a => a.id === albumId);
            if (album) handleAlbumSelect(album);
          }}
        />
      </div>
      
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
      
      <main className="container mx-auto px-6 pt-72 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-serif text-6xl font-bold text-white mb-4 tracking-wide animate-fade-in">
              Music
            </h1>
            <p className="text-white/80 text-xl font-serif">
              A collection of surreal soundscapes and magical melodies
            </p>
          </div>
          
          {/* Video Player - Cassette Deck Style */}
          <div className="mb-16" ref={videoRef}>
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                <video 
                  key={`${ohioCassettePoster}-${Date.now()}`}
                  className="w-full h-full object-cover"
                  poster={ohioCassettePoster}
                  controls={false}
                  id="ohio-video"
                >
                  <source src="" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                
                {/* Simple Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/5 transition-all duration-300">
                  <button 
                    className="w-20 h-20 rounded-full bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 flex items-center justify-center shadow-2xl"
                    onClick={() => {
                      const video = document.getElementById('ohio-video') as HTMLVideoElement;
                      if (video) {
                        if (video.paused) {
                          video.play();
                        } else {
                          video.pause();
                        }
                      }
                    }}
                  >
                    <Play className="w-10 h-10 text-slate-900 ml-1" fill="currentColor" />
                  </button>
                </div>
                
                {/* Cassette Deck Info */}
                <div className="absolute top-4 left-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded px-3 py-1">
                    <span className="text-white/90 text-sm font-mono uppercase tracking-wider">Circles - Single</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Featured Album */}
          <div className="mb-16" ref={trackListingRef}>
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
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-serif text-white">
            Email: contact@kazukiyamakawa.com
          </p>
          <p className="font-serif text-white text-xs mt-3">
            All music copyright of Harper/Yamakawa
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Music;