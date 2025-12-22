import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { useWidescreenAspectRatio } from "@/hooks/useWidescreenAspectRatio";
import { AlbumBanner } from "@/components/AlbumBanner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

// Background images for different themes
import spaceshipBackground from "@/assets/spaceship-background.jpg";
import floatingInstrumentsBackground from "@/assets/floating-instruments-background.jpg";
import manOnFilmBackground from "@/assets/man-on-film-background-film-reels.png";
import toDreamtManBackground from "@/assets/to-the-dreamt-man-background-final.png";
import centreOfWorldBackground from "@/assets/centre-of-world-background-new.png";
import ohioCassettePoster from "@/assets/music-video-poster-new.jpeg";
import flowerEpBackground from "@/assets/flower-ep-background-new.png";
import starPeopleRiverBackground from "@/assets/star-people-river-background.png";
import deathOfLoveBackground from "@/assets/death-of-love-background.png";
import sceneOfMyRestorationBackground from "@/assets/scene-of-my-restoration-background.png";
import musicLogo from "@/assets/music-logo.png";

// Album covers
import spaceshipAlbum from "@/assets/spaceship-album.png";
import starPeopleRiverAlbum from "@/assets/star-people-river-album.jpeg";
import manOnFilmAlbum from "@/assets/man-on-film-album-updated.png";
import deathOfLoveAlbum from "@/assets/death-of-love-album.png";
import sceneOfMyRestorationAlbum from "@/assets/scene-of-my-restoration-album-new.jpeg";
import centreOfWorldAlbum from "@/assets/last-city-on-earth-album.jpeg";
import toDreamtManAlbum from "@/assets/to-dreamt-man-album-new.jpeg";
import flowerEpCover from "@/assets/flower-ep-cover-banner.jpeg";
import circlesSingleCover from "@/assets/circles-single-cover.png";

const albums = [
  {
    id: 1,
    title: "Spaceship",
    cover: spaceshipAlbum,
    background: spaceshipBackground,
    theme: "dreamy-clouds",
    tracks: [
      "A Crashed Spaceship",
      "Sensational",
      "Magic Radio",
      "A Silver Bullet",
      "Sister",
      "By Design or Fault",
      "She Can't Break Me",
      "Make Believe Man",
      "There Will Be Time",
      "Justice",
      "Maybe",
      "Walking in Japan",
      "My Favourite Lie",
      "In a Factory",
      "Catch Your Tears (at the Bardo)",
      "Morning Stories",
      "Live for Today",
      "Come On, Come On",
      "The Trial",
      "I Know Someone",
      "Oranges",
      "All I Said Was",
      "Perfect Circles",
      "An Unimportant Man",
      "This Girl",
      "Heavenly Creatures",
      "We're All Afraid",
      "All of Your Letters",
      "Even When I Was on My Own"
    ]
  },
  {
    id: 2,
    title: "Star People River",
    cover: starPeopleRiverAlbum,
    background: starPeopleRiverBackground,
    theme: "surreal-street",
    tracks: [
      "Say, Hey You",
      "Gather Up Your Broken Parts",
      "Do You Ever Feel Lonely?",
      "A Functioning Cog",
      "She's Got a Secret",
      "Jack's Apartment",
      "I Build Statues",
      "Don't Abandon Them",
      "A Love Song",
      "Like They Do on TV",
      "Pilgrims I Didn't Recognise",
      "Deep Blue Sea",
      "If You Can Be My Friend",
      "Only Broken Things",
      "Nobody Too"
    ]
  },
  {
    id: 3,
    title: "Man on Film",
    cover: manOnFilmAlbum,
    background: manOnFilmBackground,
    theme: "cinematic-noir",
    tracks: [
      "Tuna Muchacha",
      "Twofold the Path",
      "Someone's Somewhere",
      "Ohio",
      "A Piece of String",
      "Last Night",
      "Golden Voices",
      "Heaven Is a Place",
      "Snow Falling",
      "Something I Always Believed In",
      "The Quiet Places",
      "Holding On",
      "Yes It Is",
      "Fifteen",
      "If You Want to Be Somebody"
    ]
  },
  {
    id: 4,
    title: "The Death of Love",
    cover: deathOfLoveAlbum,
    background: deathOfLoveBackground,
    theme: "urban-melancholy",
    tracks: [
      "In the Morning",
      "I Thought I Could Hold On",
      "I Don't Wanna Be Your Lover",
      "Kingdom Come",
      "Superficial",
      "I Don't Want to Be the One",
      "Give Me a Sign",
      "Guilty",
      "G, A Minor, C",
      "Would It Make Any Difference?",
      "Sick",
      "In the Beginning"
    ]
  },
  {
    id: 5,
    title: "Scene of My Restoration",
    cover: sceneOfMyRestorationAlbum,
    background: sceneOfMyRestorationBackground,
    theme: "autumn-restoration",
    tracks: [
      "Josephine",
      "A Better Man",
      "Intuition",
      "Voice Inside of Me",
      "Someone I'm Not",
      "Is Enlightenment In Fashion Today?",
      "A Brief Interlude",
      "Human Flight",
      "Life on the Inside",
      "Leading Man",
      "Finest Hour",
      "Ten Mississippi Street",
      "I Know That You Know"
    ]
  },
  {
    id: 6,
    title: "The Last City on Earth",
    cover: centreOfWorldAlbum,
    background: centreOfWorldBackground,
    theme: "magical-garden",
    tracks: [
      "Standing in the Middle of Love",
      "Fire Born in the Sun",
      "Limb from Limb",
      "Jesus Was a Dancer",
      "Somewhere I Don't Know",
      "King and Queen",
      "Still High Water",
      "Ode to Nero",
      "I Was Born in the Rain",
      "I Don't Need Your Name",
      "Two Lovers",
      "I Don't Regret a Thing",
      "Lives Unspoken",
      "The Museum"
    ]
  },
  {
    id: 7,
    title: "To the Dreamt Man",
    cover: toDreamtManAlbum,
    background: toDreamtManBackground,
    theme: "golden-desert",
    tracks: [
      "Do You Remember?",
      "The Face of the Sun",
      "Graffiti",
      "Above the Houses",
      "Neither Do I",
      "Won't You Come Lately",
      "All the Combinations",
      "Live on Echoes",
      "Do You Ever in Those Moments?",
      "Dust",
      "Phases of the Moon",
      "Dancing on Disaster",
      "Anything You Need",
      "Waited So Long",
      "In My Heart",
      "Only Just Beginning"
    ]
  },
  {
    id: 8,
    title: "Flower",
    cover: flowerEpCover,
    background: flowerEpBackground,
    theme: "coming-soon",
    tracks: ["Circles", "--", "--", "--", "", ""],
    singleCovers: { "Circles": circlesSingleCover }
  }
];

const Music = () => {
  useScrollToTop();
  const location = useLocation();
  const isWidescreen = useWidescreenAspectRatio();
  const [scrollY, setScrollY] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[7]); // Default to Coming Soon EP
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const trackListingRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Two-layer crossfade system
  const [layerA, setLayerA] = useState({ image: albums[7].background, opacity: 1 }); // Default to Coming Soon EP background
  const [layerB, setLayerB] = useState({ image: albums[7].background, opacity: 0 });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<NodeJS.Timeout | null>(null);
  
  // Zoom dialog for album covers
  const [isZoomDialogOpen, setIsZoomDialogOpen] = useState(false);
  
  // Track when logo has loaded to show music text in correct position
  const [logoLoaded, setLogoLoaded] = useState(false);
  
  // Widescreen banner behavior (matching Writing page)
  const [bannerVisible, setBannerVisible] = useState(true);
  const cursorWasOutsideBannerRef = useRef(true);
  const bannerClickedRef = useRef(false);
  
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

  // Preload and decode all album backgrounds for smooth transitions
  useEffect(() => {
    const preloadImages = async () => {
      const promises = albums.map(album => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = album.background;
          img.onload = async () => {
            try {
              await img.decode();
              resolve();
            } catch (error) {
              console.error('Error decoding image:', error);
              resolve(); // Resolve anyway to not block
            }
          };
          img.onerror = () => resolve(); // Resolve even on error
        });
      });
      await Promise.all(promises);
    };
    preloadImages();
  }, []);

  // Reset scroll position when album changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = 0;
      }
    }
  }, [selectedAlbum.id]);

  // Widescreen only: Auto-show banner at top of page, hide on scroll down
  useEffect(() => {
    if (!isWidescreen) return;

    let lastScrollY = window.scrollY;

    const handleScrollForBanner = () => {
      const scrollTop = window.scrollY;
      
      // If at or near the top (within 50px), show banner
      if (scrollTop <= 50) {
        setBannerVisible(true);
      } else if (scrollTop > lastScrollY && scrollTop > 50) {
        // Scrolling down and past initial area - hide banner
        setBannerVisible(false);
      }
      
      lastScrollY = scrollTop;
    };

    window.addEventListener('scroll', handleScrollForBanner, { passive: true });
    // Check initial position
    handleScrollForBanner();
    
    return () => window.removeEventListener('scroll', handleScrollForBanner);
  }, [isWidescreen]);

  // Widescreen only: Show banner when mouse ENTERS banner area from outside, hide when it leaves
  useEffect(() => {
    if (!isWidescreen) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Get the header/nav height
      const nav = document.querySelector('nav.fixed, [data-header]') as HTMLElement;
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 64;
      
      // Banner area is from nav bottom to approximately 100px below it (banner height)
      const bannerAreaTop = navBottom;
      const bannerAreaBottom = navBottom + 100;
      
      const isInBannerArea = e.clientY >= bannerAreaTop && e.clientY <= bannerAreaBottom;
      
      if (isInBannerArea) {
        // Only show banner if cursor ENTERED from outside AND banner wasn't just clicked
        if (cursorWasOutsideBannerRef.current && !bannerClickedRef.current && !bannerVisible) {
          setBannerVisible(true);
        }
        cursorWasOutsideBannerRef.current = false;
        bannerClickedRef.current = false;
      } else {
        // Cursor is outside banner area
        if (!cursorWasOutsideBannerRef.current) {
          // Cursor just LEFT the banner area
          // Only hide if cursor moved DOWN (below banner), not UP (into header)
          // And not if at/near top of page
          if (window.scrollY > 50 && e.clientY > bannerAreaBottom) {
            setBannerVisible(false);
          }
        }
        cursorWasOutsideBannerRef.current = true;
        bannerClickedRef.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isWidescreen, bannerVisible]);

  // Handle click to toggle banner on widescreen devices
  const handlePageClick = (e: React.MouseEvent) => {
    if (!isWidescreen) return;
    
    // At or near the top of the page, don't allow hiding the banner
    if (window.scrollY <= 50) return;
    
    // Don't toggle if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('nav') ||
      target.closest('[role="button"]') ||
      target.closest('.fixed.top-16')
    ) {
      return;
    }
    
    setBannerVisible(prev => !prev);
  };

  // Callback for when an album in banner is clicked (to prevent flickering)
  const handleBannerAlbumClick = () => {
    bannerClickedRef.current = true;
    cursorWasOutsideBannerRef.current = false;
    setBannerVisible(false);
  };

  const handleAlbumSelect = async (albumId: number) => {
    const album = albums.find(a => a.id === albumId);
    if (!album) return;
    
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
        requestAnimationFrame(() => {
          setLayerA(prev => ({ ...prev, opacity: 0 }));
          setLayerB(prev => ({ ...prev, opacity: 1 }));
        });
      });
    } else {
      // Layer B is visible, prepare layer A with new image and fade it in
      setLayerA({ image: album.background, opacity: 0 });
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLayerB(prev => ({ ...prev, opacity: 0 }));
          setLayerA(prev => ({ ...prev, opacity: 1 }));
        });
      });
    }
    
    // Update album immediately as fade begins or if same album
    if (album.id !== selectedAlbum.id) {
      setSelectedAlbum(album);
    }
    
    // Scroll to show album - widescreen devices center the album cover + title
    setTimeout(() => {
      if (trackListingRef.current) {
        const navigationHeight = 64; // Navigation bar height (h-16)
        
        if (isWidescreen) {
          // For widescreen: center the album cover + title vertically in the viewport
          // Viewport = area from bottom of header to bottom of screen
          const viewportHeight = window.innerHeight - navigationHeight;
          
          // Find album cover and title elements within trackListingRef
          const container = trackListingRef.current;
          const albumCover = container.querySelector('img[alt]') as HTMLElement;
          const albumTitle = container.querySelector('h2') as HTMLElement;
          
          if (albumCover && albumTitle) {
            // Calculate the combined height from top of album cover to bottom of album title
            const coverTop = albumCover.getBoundingClientRect().top + window.scrollY;
            const titleBottom = albumTitle.getBoundingClientRect().bottom + window.scrollY;
            const contentHeight = titleBottom - coverTop;
            
            // Calculate scroll position to center content in viewport
            const centerOffset = (viewportHeight - contentHeight) / 2;
            const scrollTarget = coverTop - navigationHeight - centerOffset;
            
            window.scrollTo({
              top: Math.max(0, scrollTarget),
              behavior: 'smooth'
            });
          }
        } else {
          // For non-widescreen (iPad, etc.): use original offset-based scroll
          const bannerHeight = 176; // Banner height (from top-16 to pt-60: 240-64=176)
          const gap = 4; // Smaller gap between banner and container (~5mm on iPad 13")
          const totalOffset = navigationHeight + bannerHeight + gap;
          const offset = trackListingRef.current.offsetTop - totalOffset;
          window.scrollTo({
            top: offset,
            behavior: 'smooth'
          });
        }
      }
    }, 100); // Small delay to ensure DOM update
    
    // Clear transition state after animation completes
    transitionRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 800); // Match CSS transition duration
  };

  // Wrap album select to also handle banner hiding on widescreen
  const handleAlbumSelectWithBanner = (albumId: number) => {
    if (isWidescreen) {
      handleBannerAlbumClick();
    }
    handleAlbumSelect(albumId);
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden" onClick={handlePageClick}>
      <Navigation />
      
      {/* Album Banner - Fixed at top */}  
      <div 
        className={`fixed top-16 left-0 right-0 z-20 transition-all duration-300 ${
          isWidescreen && !bannerVisible ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <AlbumBanner 
          selectedAlbumId={selectedAlbum.id}
          onAlbumClick={handleAlbumSelectWithBanner}
        />
      </div>
      
      {/* Two-Layer Crossfade Background System */}
      <div className="fixed top-0 left-0" style={{ height: '100vh', width: '100vw' }}>
        {/* Layer A */}
        <div 
          className="absolute inset-0 bg-cover transition-opacity duration-700 ease-in-out"
          style={{ 
            backgroundImage: `url(${layerA.image})`,
            opacity: layerA.opacity,
            backgroundPosition: 'center top 40px'
          }}
        />
        {/* Layer B */}
        <div 
          className="absolute inset-0 bg-cover transition-opacity duration-700 ease-in-out"
          style={{ 
            backgroundImage: `url(${layerB.image})`,
            opacity: layerB.opacity,
            backgroundPosition: 'center top 40px'
          }}
        />
        {/* Static overlay for readability - not animated */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
      </div>
      
        <main className="container mx-auto px-6 pt-40 pb-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header - Logo with handwritten Music title overlapping */}
          <div className="text-center mb-0 pt-0 relative">
            <img 
              src={musicLogo} 
              alt="Music" 
              className="max-w-2xl w-full mx-auto animate-fade-in"
              onLoad={() => setLogoLoaded(true)}
            />
            {/* Handwritten music title - positioned to overlap end of logo - only show after logo loads */}
            {logoLoaded && (
              <>
                {/* Widescreen desktop version (16:9/16:10 and wider) */}
                <h1 
                  className="absolute chalk-write hidden xl:block"
                  style={{ 
                    fontFamily: "'DK Crayon Crumble', cursive",
                    color: 'white',
                    fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                    transform: 'rotate(-8deg)',
                    right: 'calc(50% - 21rem)',
                    top: '45%',
                    zIndex: 10,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  music
                </h1>
                {/* iPad desktop version (lg to xl) - slightly lower */}
                <h1 
                  className="absolute chalk-write hidden lg:block xl:hidden"
                  style={{ 
                    fontFamily: "'DK Crayon Crumble', cursive",
                    color: 'white',
                    fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
                    transform: 'rotate(-8deg)',
                    right: 'calc(50% - 21rem)',
                    top: '50%',
                    zIndex: 10,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  music
                </h1>
                {/* Single mobile/tablet version - CSS handles responsive positioning */}
                <h1 
                  className="absolute chalk-write lg:hidden music-title-mobile"
                  style={{ 
                    fontFamily: "'DK Crayon Crumble', cursive",
                    color: 'white',
                    transform: 'rotate(-8deg)',
                    zIndex: 10,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                  }}
                >
                  music
                </h1>
              </>
            )}
          </div>
          
          {/* Video Player - Cassette Deck Style - more space on mobile */}
          <div className="mb-12 -mt-16 max-sm:-mt-6" ref={videoRef}>
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 border border-white/20 max-sm:p-2">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden group">
                <video 
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
                  {selectedAlbum.cover ? (
                    <img 
                      src={selectedAlbum.cover} 
                      alt={selectedAlbum.title}
                      className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6 transition-all duration-500 hover:scale-105 cursor-pointer"
                      onClick={() => setIsZoomDialogOpen(true)}
                    />
                  ) : (
                    <div className="w-full max-w-md mx-auto rounded-lg shadow-2xl mb-6 bg-black/40 border border-white/20 flex items-center justify-center aspect-square">
                      <span className="text-white/60 text-2xl font-semibold">Coming Soon</span>
                    </div>
                  )}
                  <h2 className="font-palatino text-3xl text-white mb-2">{selectedAlbum.title}</h2>
                  <p className="text-white/80 text-lg mb-6">{selectedAlbum.id === 8 ? "Coming Soon" : "Featured Album"}</p>
                  
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
                  <h3 className="text-white text-2xl font-bold mb-4 font-palatino text-center">
                    Track Listing
                  </h3>
                  <ScrollArea ref={scrollAreaRef} className="h-[580px] w-full rounded-md border border-white/20 p-4 bg-black/20 max-sm:h-[300px]">
                    {selectedAlbum.tracks.length > 0 ? (
                      <div className="space-y-3">
                        {selectedAlbum.tracks.map((track, index) => {
                          const showActHeader = selectedAlbum.id === 4 && (index === 0 || index === 4 || index === 8);
                          const actNumber = index === 0 ? "I" : index === 4 ? "II" : "III";
                          
                          const showPartHeader = selectedAlbum.id === 1 && (index === 0 || index === 15);
                          const partNumber = index === 0 ? "I" : "II";
                          
                          const isLastTrackOfAlbum7 = selectedAlbum.id === 7 && index === selectedAlbum.tracks.length - 1;
                          const trackNumber = isLastTrackOfAlbum7 ? "-" : `${index + 1}`;
                          
                          return (
                            <div key={index}>
                              {showActHeader && (
                                <div className="text-white/90 font-bold text-xl mb-3 mt-6 first:mt-0 font-palatino text-center">
                                  Act {actNumber}
                                </div>
                              )}
                              {showPartHeader && (
                                <div className="text-white/90 font-bold text-xl mb-4 mt-10 first:mt-0 font-palatino text-center">
                                  Part {partNumber}
                                </div>
                              )}
                              <div
                                className="flex items-center justify-between p-3 bg-black/30 rounded hover:bg-black/40 transition-colors cursor-pointer"
                                onClick={() => {
                                  setCurrentTrackIndex(index); 
                                  setIsPlaying(true);
                                }}
                              >
                                <span className="text-white font-palatino">{trackNumber}. {track}</span>
                                <div className="text-white/60">
                                  {currentTrackIndex === index ? "⏸" : "▶"}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-white/60 text-lg font-serif">No tracks available yet</span>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
          
          {/* Singles (click to play) */}
          <div className="mb-8">
            <h4 className="font-serif text-2xl text-white mb-4 text-center max-sm:text-xl">Singles</h4>
            {selectedAlbum.tracks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-sm:gap-2">
                {selectedAlbum.tracks.slice(0,4).map((track, idx) => (
                <button
                  key={idx}
                  className={`relative group rounded-lg overflow-hidden border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40 ${currentTrackIndex===idx? 'ring-2 ring-white/60':''}`}
                  onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                >
                  {(selectedAlbum as any).singleCovers?.[track] ? (
                    <>
                      <img src={(selectedAlbum as any).singleCovers[track]} alt={`${selectedAlbum.title} - ${track}`} className="w-full aspect-square object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 right-2 text-left">
                        <span className="text-white text-sm font-palatino line-clamp-2">{track}</span>
                      </div>
                    </>
                  ) : (
                    <div className="w-full aspect-square bg-black/60 flex items-center justify-center">
                      <span className="text-white/40 text-2xl font-palatino">--</span>
                    </div>
                  )}
                </button>
                ))}
              </div>
            ) : (
              <div className="text-center text-white/60 font-serif">No singles available yet</div>
            )}
          </div>
          
        </div>
      </main>
      
      <footer className="bg-black/80 backdrop-blur-sm border-t border-white/20 py-12 mt-8 max-sm:mt-6 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <h3 className="font-heading text-2xl mb-4 text-white">Contact</h3>
          <p className="font-serif text-white">
            kazuki@kazukiyamakawa.com
          </p>
          <p className="font-serif text-white text-xs mt-3">
            All music copyright of Harper/Yamakawa
          </p>
        </div>
      </footer>
      
      {/* Album Cover Zoom Dialog */}
      <Dialog open={isZoomDialogOpen} onOpenChange={setIsZoomDialogOpen}>
        <DialogContent 
          className={`p-0 bg-transparent border-none focus:outline-none ${
            isWidescreen 
              ? 'max-w-[90vh] w-auto' 
              : 'max-w-4xl w-full'
          }`} 
          hideCloseButton
        >
          <img 
            src={selectedAlbum.cover} 
            alt={selectedAlbum.title}
            className={`rounded-lg outline-none ring-0 ${
              isWidescreen 
                ? 'h-[calc(100vh-4rem)] w-auto object-contain' 
                : 'w-full h-auto'
            }`}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Music;