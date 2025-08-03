import Navigation from "@/components/Navigation";
import woodenTableBackground from "@/assets/wooden-table-1970s.jpg";
import magicalGardenAlbum from "@/assets/magical-garden-album.jpg";

const Music = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      
      {/* Wooden table background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${woodenTableBackground})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <main className="container mx-auto px-6 pt-24 pb-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-heading text-5xl font-bold text-white mb-8 text-center">
            Music
          </h1>
          
          {/* Coming Soon Album Promotion */}
          <div className="mb-12 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <img 
                src={magicalGardenAlbum} 
                alt="New Album Coming Soon"
                className="w-64 h-64 mx-auto rounded-lg shadow-lg mb-6"
              />
              <h2 className="font-heading text-2xl text-white mb-2">New Album</h2>
              <p className="text-white/80 text-lg mb-4">Coming Soon</p>
            </div>
          </div>
          
          {/* Video Player */}
          <div className="mb-8">
            <div className="bg-black/60 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                <div className="text-white/60 text-center">
                  <div className="text-6xl mb-4">▶</div>
                  <p className="text-lg">Video Player</p>
                  <p className="text-sm">Music videos coming soon</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* New Release */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'serif' }}>
                ♪ New Release ♪
              </h3>
              <p className="text-white/80">Track title coming soon...</p>
            </div>
          </div>
          
          {/* Track Selector */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <h3 className="text-white text-xl font-bold mb-4">Track Selector</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((track) => (
                  <div key={track} className="flex items-center justify-between p-3 bg-black/30 rounded hover:bg-black/40 transition-colors cursor-pointer">
                    <span className="text-white">Track {track} - Coming Soon</span>
                    <div className="text-white/60">▶</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card/80 backdrop-blur-md border-t border-border py-12 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-white">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Music;