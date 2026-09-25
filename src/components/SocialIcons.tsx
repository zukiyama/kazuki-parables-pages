import { siSpotify, siApplemusic, siYoutube, siTiktok, siInstagram, siBandcamp, siFacebook } from "simple-icons";

export type SocialId =
  | "spotify"
  | "applemusic"
  | "featurefm"
  | "bandcamp"
  | "youtube"
  | "tiktok"
  | "instagram"
  | "facebook";

interface SocialDef {
  id: SocialId;
  label: string;
  href: string; // placeholder "#" until real profile URLs are supplied
  path?: string; // simple-icons path data
  custom?: "featurefm";
}

const SOCIALS: Record<SocialId, SocialDef> = {
  spotify: { id: "spotify", label: "Spotify", href: "#", path: siSpotify.path },
  applemusic: { id: "applemusic", label: "Apple Music", href: "#", path: siApplemusic.path },
  featurefm: { id: "featurefm", label: "Feature.fm", href: "#", custom: "featurefm" },
  bandcamp: { id: "bandcamp", label: "Bandcamp", href: "#", path: siBandcamp.path },
  youtube: { id: "youtube", label: "YouTube", href: "#", path: siYoutube.path },
  tiktok: { id: "tiktok", label: "TikTok", href: "#", path: siTiktok.path },
  instagram: { id: "instagram", label: "Instagram", href: "#", path: siInstagram.path },
  facebook: { id: "facebook", label: "Facebook", href: "#", path: siFacebook.path },
};

const FeatureFmIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M8.8 4.2v15.6l2.6-1.6V5.8L8.8 4.2zm4.4 2.6v10.4l2.6-1.6V8.4l-2.6-1.6zM4.4 7v10l2.6-1.6V8.6L4.4 7zm13.2 2.2v5.6l2.6-1.6v-2.4l-2.6-1.6z" />
  </svg>
);

interface SocialIconsProps {
  ids: SocialId[];
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
}

export const SocialIcons = ({ ids, className = "", linkClassName = "", iconClassName = "w-4 h-4" }: SocialIconsProps) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {ids.map((id) => {
      const social = SOCIALS[id];
      return (
        <a
          key={id}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          title={social.label}
          className={`inline-flex items-center justify-center transition-opacity hover:opacity-60 ${linkClassName}`}
        >
          {social.custom === "featurefm" ? (
            <FeatureFmIcon className={iconClassName} />
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor" className={iconClassName} aria-hidden="true">
              <path d={social.path} />
            </svg>
          )}
        </a>
      );
    })}
  </div>
);

export default SocialIcons;
