import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface FooterProps {
  variant?: "light" | "dark";
  showNavLinks?: boolean;
  extraContent?: ReactNode;
  className?: string;
  beforeFooter?: ReactNode;
}

export const Footer = ({ 
  variant = "light", 
  showNavLinks = true, 
  extraContent,
  className = "",
  beforeFooter
}: FooterProps) => {
  const isDark = variant === "dark";
  
  return (
    <>
      {beforeFooter}
      <footer className={`${isDark ? 'bg-black/80 backdrop-blur-sm border-t border-white/20' : 'bg-card border-t border-border'} relative z-10 ${className}`}>
        <div className="py-12 max-sm:py-8">
          <div className="container mx-auto px-6">
            {/* Main footer content - two columns on desktop, stacked on mobile */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 md:gap-12">
              {/* Left side - Contact */}
              <div className="text-center md:text-left">
                <h3 className={`font-heading text-2xl mb-4 ${isDark ? 'text-white' : 'text-ink-black'}`}>
                  Contact
                </h3>
                <p className={`${isDark ? 'font-serif text-white' : 'font-body text-muted-foreground'}`}>
                  kazuki@kazukiyamakawa.com
                </p>
                {extraContent}
              </div>
              
              {/* Right side - Newsletter */}
              <div className="text-center md:text-right">
                <h3 className={`font-heading text-2xl mb-3 ${isDark ? 'text-white' : 'text-ink-black'}`}>
                  Stay in Touch
                </h3>
                <p className={`font-body text-sm mb-4 ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
                  Subscribe for updates on new releases
                </p>
                <a
                  href="https://kazukiyamakawa.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-body text-sm tracking-wide transition-all duration-300 ${
                    isDark 
                      ? 'bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50' 
                      : 'bg-ink-black text-white hover:bg-ink-black/90'
                  }`}
                >
                  <svg 
                    className="w-4 h-4" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Subscribe
                </a>
              </div>
            </div>
            
            {/* Navigation links */}
            {showNavLinks && (
              <div className="flex justify-center space-x-8 mt-10 pt-8 border-t border-border/30">
                <Link to="/about" onClick={() => window.scrollTo(0, 0)} className={`font-body ${isDark ? 'text-white hover:text-white/80' : 'text-ink-black hover:text-ink-black/80'} transition-colors`}>
                  About
                </Link>
                <Link to="/writing" onClick={() => window.scrollTo(0, 0)} className={`font-body ${isDark ? 'text-white hover:text-white/80' : 'text-ink-black hover:text-ink-black/80'} transition-colors`}>
                  Writing
                </Link>
                <Link to="/music" onClick={() => window.scrollTo(0, 0)} className={`font-body ${isDark ? 'text-white hover:text-white/80' : 'text-ink-black hover:text-ink-black/80'} transition-colors`}>
                  Music
                </Link>
                <Link to="/comics" onClick={() => window.scrollTo(0, 0)} className={`font-body ${isDark ? 'text-white hover:text-white/80' : 'text-ink-black hover:text-ink-black/80'} transition-colors`}>
                  Comics & Scripts
                </Link>
              </div>
            )}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
