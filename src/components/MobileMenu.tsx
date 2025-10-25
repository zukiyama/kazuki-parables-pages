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
    <div className="relative sm:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-ink-black hover:text-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Simple Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          <nav className="flex flex-col py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`font-body text-base px-4 py-3 transition-colors hover:bg-gray-50 ${
                  location.pathname === item.path
                    ? 'text-accent font-semibold bg-gray-50'
                    : 'text-ink-black'
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
