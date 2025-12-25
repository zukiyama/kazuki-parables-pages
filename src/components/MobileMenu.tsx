import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/writing', label: 'Writing' },
    { path: '/music', label: 'Music' },
    { path: '/comics', label: 'Comics & Scripts' },
  ];

  const handleLinkClick = () => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const isAboutPage = location.pathname === '/about';

  return (
    <div className="relative sm:hidden" ref={menuRef}>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 transition-colors ${
          isAboutPage 
            ? "text-ink-black hover:text-accent" 
            : "text-[hsl(25,30%,25%)] hover:text-[hsl(25,45%,40%)]"
        }`}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Simple Dropdown Menu */}
      {isOpen && (
        <div className={`fixed right-0 top-[73px] w-56 backdrop-blur-sm border-t shadow-lg z-50 ${
          isAboutPage 
            ? "bg-background/90 border-border" 
            : "bg-[hsl(39,35%,93%)]/95 border-[hsl(30,20%,75%)]"
        }`}>
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`font-body text-base px-4 py-3 transition-colors ${
                  isAboutPage
                    ? location.pathname === item.path
                      ? 'text-accent font-semibold bg-gray-50'
                      : 'text-ink-black hover:bg-gray-50'
                    : location.pathname === item.path
                      ? 'text-[hsl(25,45%,40%)] font-semibold bg-[hsl(39,30%,88%)]'
                      : 'text-[hsl(25,30%,25%)] hover:bg-[hsl(39,30%,88%)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
