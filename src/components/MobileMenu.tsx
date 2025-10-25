import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sm:hidden p-2 text-ink-black hover:text-accent transition-colors z-50 relative"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed top-16 right-0 bottom-0 w-64 bg-background border-l border-border z-50 sm:hidden overflow-y-auto">
            <nav className="flex flex-col p-6 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`font-body text-lg tracking-wide transition-colors hover:text-accent py-2 ${
                    location.pathname === item.path
                      ? 'text-accent font-semibold border-l-4 border-accent pl-4'
                      : 'text-foreground pl-4'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default MobileMenu;
