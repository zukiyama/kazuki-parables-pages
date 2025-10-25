import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/writing", label: "Writing" },
    { path: "/music", label: "Music" },
    { path: "/comics", label: "Comics & Scripts" },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" onClick={() => handleNavClick("/")} className="font-body text-xl md:text-2xl font-semibold text-ink-black inline-flex items-center gap-2 md:gap-3">
              <span className="tracking-wide">Kazuki Yamakawa</span>
              <svg width="24" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="text-ink-black/80 hidden sm:block">
                <path d="M3 19 L12 5 L21 19 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
                <path d="M5 14 C9 12, 15 16, 20 18" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.8" />
                <path d="M4 16 C8 14, 14 18, 19 20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
              </svg>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => handleNavClick(item.path)}
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink-black hover:text-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-64 bg-background z-50 md:hidden shadow-2xl border-l border-border">
            <div className="flex flex-col h-full">
              <div className="flex justify-end p-4 border-b border-border">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-ink-black hover:text-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>
              <nav className="flex flex-col p-6 space-y-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`font-body text-lg tracking-wide transition-colors hover:text-accent py-2 ${
                      location.pathname === item.path
                        ? "text-accent font-semibold"
                        : "text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navigation;