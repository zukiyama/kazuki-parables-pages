import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/writing", label: "Writing" },
    { path: "/music", label: "Music" },
    { path: "/comics", label: "Comics" },
  ];

  const handleNavClick = () => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-body text-xl sm:text-2xl font-semibold text-ink-black inline-flex items-center gap-2 sm:gap-3">
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

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button 
                className="p-2 text-foreground hover:text-accent transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background/95 backdrop-blur-md">
              <nav className="flex flex-col space-y-6 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={handleNavClick}
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;