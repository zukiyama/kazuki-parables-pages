import { Link, useLocation } from "react-router-dom";
import MobileMenu from "./MobileMenu";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/writing", label: "Writing" },
    { path: "/music", label: "Music" },
    { path: "/comics", label: "Comics & Scripts" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-stone-200/50" style={{ backgroundColor: 'rgba(250, 248, 245, 0.95)' }}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl text-stone-800 inline-flex items-center gap-3" style={{ fontFamily: 'Zen Kaku Gothic New, sans-serif', fontWeight: 300, letterSpacing: '0.08em' }}>
            <span className="max-sm:text-lg">Kazuki Yamakawa</span>
          </Link>
          
          <div className="flex space-x-8 max-sm:hidden">
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
          
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;