import Navigation from "@/components/Navigation";
import godOfLiesCover from "@/assets/god-of-lies-cover.jpg";
import soulTiedCover from "@/assets/soul-tied-cover.jpg";
import theBurdenCover from "@/assets/the-burden-cover.jpg";

const Comics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 pt-24 pb-12">
        {/* Background pattern of manga character sheets */}
        <div className="fixed inset-0 opacity-5 pointer-events-none">
          <div className="w-full h-full bg-repeat" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='300' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23666' stroke-width='0.8'%3E%3C!-- Character head studies --%3E%3Ccircle cx='60' cy='60' r='25' /%3E%3Cline x1='45' y1='55' x2='50' y2='55' /%3E%3Cline x1='70' y1='55' x2='75' y2='55' /%3E%3Cpath d='M50 70 Q60 75 70 70' /%3E%3C!-- Body proportions --%3E%3Cline x1='150' y1='40' x2='150' y2='120' stroke-dasharray='3,2'/%3E%3Cline x1='130' y1='60' x2='170' y2='60' /%3E%3Cline x1='130' y1='80' x2='170' y2='80' /%3E%3C!-- Character poses --%3E%3Cpath d='M220 50 L230 40 L240 50 L235 70 L225 70 Z' /%3E%3Cline x1='230' y1='70' x2='225' y2='90' /%3E%3Cline x1='230' y1='70' x2='235' y2='90' /%3E%3C!-- Facial expressions --%3E%3Ccircle cx='60' cy='150' r='20' /%3E%3Cpath d='M50 145 Q60 140 70 145' /%3E%3Cline x1='55' y1='150' x2='55' y2='152' /%3E%3Cline x1='65' y1='150' x2='65' y2='152' /%3E%3C!-- Action lines --%3E%3Cline x1='180' y1='150' x2='190' y2='140' /%3E%3Cline x1='185' y1='155' x2='195' y2='145' /%3E%3Cline x1='190' y1='160' x2='200' y2='150' /%3E%3C!-- Text guidelines --%3E%3Cline x1='50' y1='200' x2='120' y2='200' stroke-dasharray='2,1'/%3E%3Cline x1='50' y1='210' x2='110' y2='210' stroke-dasharray='2,1'/%3E%3Cline x1='50' y1='220' x2='100' y2='220' stroke-dasharray='2,1'/%3E%3C!-- Panel borders --%3E%3Crect x='180' y='180' width='80' height='60' stroke-dasharray='4,2'/%3E%3Cline x1='180' y1='200' x2='260' y2='200' /%3E%3C!-- Character turnaround --%3E%3Ccircle cx='60' cy='300' r='15' /%3E%3Ccircle cx='90' cy='300' r='15' /%3E%3Ccircle cx='120' cy='300' r='15' /%3E%3Ctext x='50' y='330' font-size='8' fill='%23666'%3Efront%3C/text%3E%3Ctext x='80' y='330' font-size='8' fill='%23666'%3Eside%3C/text%3E%3Ctext x='110' y='330' font-size='8' fill='%23666'%3Eback%3C/text%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '300px 400px'
          }} />
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl font-bold text-ink-black mb-4">
              Comics & Manga
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Korean-style web comics and Japanese manga stories
            </p>
          </div>
          
          {/* God of Lies */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="relative group">
                <img 
                  src={godOfLiesCover} 
                  alt="God of Lies manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
            <div className="order-2">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                God of Lies
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] A gripping tale of deception and supernatural forces, following a cunning con man whose lies manifest into reality through his mysterious demonic companion. Set against the backdrop of modern urban life, this psychological thriller explores the price of dishonesty and the thin line between truth and fiction.
              </p>
            </div>
          </div>
          
          {/* Soul Tied */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                Soul Tied
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] Two men, bound by fate yet worlds apart in their choices. One embraces chaos with casual indifference, while the other fights desperately to maintain control. Their intertwined destinies force them to confront what it means to be truly connected to another soul.
              </p>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <img 
                  src={soulTiedCover} 
                  alt="Soul Tied manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
          </div>
          
          {/* The Burden */}
          <div className="mb-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="relative group">
                <img 
                  src={theBurdenCover} 
                  alt="The Burden manga cover"
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
              </div>
            </div>
            <div className="order-2">
              <h2 className="font-heading text-3xl font-bold text-ink-black mb-4">
                The Burden
              </h2>
              <p className="font-body text-muted-foreground leading-relaxed">
                [Placeholder text] A touching story about a young man who must care for his aging mother, exploring themes of family duty, sacrifice, and the weight of responsibility. As memories float between past and present, both son and mother navigate the delicate balance between independence and care.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-card border-t border-border py-12 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-muted-foreground">
            Email: contact@kazukiyamakawa.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Comics;