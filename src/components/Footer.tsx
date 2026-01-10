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
    <div className="relative">
      <footer className={`${isDark ? 'bg-black/80 backdrop-blur-sm border-t border-white/20' : 'bg-card border-t border-border'} relative z-10 ${className}`}>
        {/* beforeFooter content positioned relative to footer */}
        {beforeFooter}
        <div className="py-12 max-sm:py-8">
          <div className="container mx-auto px-6">
            {/* Main footer content - Subscribe center, Contact right */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Left spacer for balance */}
              <div className="hidden md:block md:flex-1" />
              
              {/* Center - Subscribe */}
              <div className="text-center md:flex-1">
                <h3 className={`font-heading text-2xl mb-3 ${isDark ? 'text-white' : 'text-ink-black'}`}>
                  Stay in Touch
                </h3>
                <p className={`font-body text-sm mb-6 ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
                  Subscribe for updates on new releases and projects
                </p>
                <a
                  href="https://kazukiyamakawa.substack.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm tracking-wide transition-all duration-300 ${
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
                  Subscribe to Newsletter
                </a>
              </div>
              
              {/* Right - Contact */}
              <div className="text-center md:text-right md:flex-1 mt-8 md:mt-0 md:pr-4">
                <h3 className={`font-heading text-2xl mb-4 ${isDark ? 'text-white' : 'text-ink-black'}`}>
                  Contact
                </h3>
                <p className={`${isDark ? 'font-serif text-white' : 'font-body text-muted-foreground'}`}>
                  kazuki@kazukiyamakawa.com
                </p>
                {extraContent}
              </div>
            </div>
            
            {/* Nav links below */}
            {showNavLinks && (
              <div className="flex justify-center space-x-8 mt-10">
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
    </div>
  );
};

export default Footer;
