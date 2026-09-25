import { ReactNode } from "react";

type FooterVariant = "light" | "dark" | "header";

interface FooterProps {
  variant?: FooterVariant;
  extraContent?: ReactNode;
  className?: string;
  beforeFooter?: ReactNode;
}

// The "header" variant mirrors the palette used by the site header
// (Navigation.tsx): cream paper background, warm grey rule, ink-brown
// text with a rust accent on hover.
const palettes = {
  light: {
    footer: "bg-card border-t border-border",
    heading: "text-ink-black",
    body: "text-muted-foreground",
    email: "font-body text-muted-foreground",
    button: "bg-ink-black text-white hover:bg-ink-black/90",
  },
  dark: {
    footer: "bg-black/80 backdrop-blur-sm border-t border-white/20",
    heading: "text-white",
    body: "text-white/70",
    email: "font-serif text-white",
    button:
      "bg-white/10 text-white border border-white/30 hover:bg-white/20 hover:border-white/50",
  },
  header: {
    footer: "bg-[hsl(39,35%,93%)] border-t border-[hsl(30,20%,75%)]",
    heading: "text-[hsl(25,30%,25%)]",
    body: "text-[hsl(25,30%,25%)]/70",
    email: "font-body text-[hsl(25,30%,25%)]",
    button:
      "text-[hsl(25,30%,25%)] border border-[hsl(30,20%,75%)] hover:text-[hsl(25,45%,40%)] hover:border-[hsl(25,45%,40%)] hover:bg-white/50",
  },
} as const;

export const Footer = ({
  variant = "light",
  extraContent,
  className = "",
  beforeFooter,
}: FooterProps) => {
  const palette = palettes[variant];

  return (
    <div className="relative">
      <footer className={`${palette.footer} relative z-10 ${className}`}>
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
                <h3 className={`font-heading text-2xl mb-3 ${palette.heading}`}>
                  Stay in Touch
                </h3>
                <p className={`font-body text-sm mb-6 ${palette.body}`}>
                  Subscribe for updates on new releases and projects
                </p>
                <a
                  href="https://kazukiyamakawa.substack.com/subscribe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-body text-sm tracking-wide transition-all duration-300 ${palette.button}`}
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
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Subscribe to Newsletter
                </a>
              </div>

              {/* Right - Contact */}
              <div className="text-center md:text-right md:flex-1 mt-8 md:mt-0 md:pr-4">
                <h3 className={`font-heading text-2xl mb-4 ${palette.heading}`}>
                  Contact
                </h3>
                <p className={palette.email}>kazuki@kazukiyamakawa.com</p>
                {extraContent}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
