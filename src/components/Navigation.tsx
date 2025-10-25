import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/writing", label: "Writing" },
    { path: "/music", label: "Music" },
    { path: "/comics", label: "Comics & Scripts" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-body text-2xl max-md:text-xl font-semibold text-ink-black inline-flex items-center gap-3">
            <span className="tracking-wide">Kazuki Yamakawa</span>
            <svg width="28" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-ink-black/80 max-md:hidden">
              <path d="M3 19 L12 5 L21 19 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M5 14 C9 12, 15 16, 20 18" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.8" />
              <path d="M4 16 C8 14, 14 18, 19 20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
            </svg>
          </Link>
          
          {/* Desktop Menu */}
          <div className="flex space-x-8 max-md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.scrollTo(0, 0)}
                className={`font-body text-sm tracking-wide transition-colors hover:text-accent ${
                  location.pathname === item.path
                    ? "text-accent font-semibold"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="hidden max-md:block text-foreground hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 hidden max-md:block"
            onClick={closeMenu}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-background border-l border-border z-50 hidden max-md:block shadow-xl">
            <div className="flex justify-end p-6">
              <button
                onClick={closeMenu}
                className="text-foreground hover:text-accent transition-colors"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col space-y-2 px-6">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => {
                    window.scrollTo(0, 0);
                    closeMenu();
                  }}
                  className={`font-body text-base tracking-wide transition-colors hover:text-accent py-3 px-4 rounded-lg ${
                    location.pathname === item.path
                      ? "text-accent font-semibold bg-accent/10"
                      : "text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;