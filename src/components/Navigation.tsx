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

  const isAboutPage = location.pathname === "/about";

  return (
    <nav data-header="true" className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b ${
      isAboutPage 
        ? "bg-background/90 border-border" 
        : "bg-[hsl(39,35%,93%)]/95 border-[hsl(30,20%,75%)]"
    }`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className={`font-body text-2xl font-semibold inline-flex items-center gap-3 ${
            isAboutPage ? "text-ink-black" : "text-[hsl(25,30%,25%)]"
          }`}>
            <span className="tracking-wide max-sm:text-lg">Kazuki Yamakawa</span>
            <svg width="28" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className={`max-sm:w-6 max-sm:h-5 ${isAboutPage ? "text-ink-black/80" : "text-[hsl(25,30%,25%)]/80"}`}>
              <path d="M3 19 L12 5 L21 19 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <circle cx="16" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M5 14 C9 12, 15 16, 20 18" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.8" />
              <path d="M4 16 C8 14, 14 18, 19 20" stroke="currentColor" strokeWidth="1.2" fill="none" opacity="0.5" />
            </svg>
          </Link>
          
          <div className="flex space-x-8 max-sm:hidden">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.scrollTo(0, 0)}
                className={`font-body text-sm tracking-wide transition-colors ${
                  isAboutPage
                    ? location.pathname === item.path
                      ? "text-[hsl(30,20%,35%)] font-semibold"
                      : "text-foreground hover:text-[hsl(30,20%,35%)]"
                    : location.pathname === item.path
                      ? "text-[hsl(25,45%,40%)] font-semibold"
                      : "text-[hsl(25,30%,25%)] hover:text-[hsl(25,45%,40%)]"
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