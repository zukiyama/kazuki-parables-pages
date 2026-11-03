import React from "react";
import heroWebm from "@/assets/about-hero.webm.asset.json";
import heroVideo from "@/assets/about-hero.mp4.asset.json";
import firstFrame from "@/assets/about-hero-first.webp.asset.json";
import lastFrame from "@/assets/about-hero-last.webp.asset.json";

type Props = { className?: string; label: string; onReady?: () => void };

/** Silent background clip: plays once and rests on its last frame. The smooth slow-down is baked into the file. */
const AboutHeroVideo = ({ className = "", label, onReady }: Props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    const start = () => { video.play().catch(() => {}); };
    if (video.readyState >= 3) start();
    else video.addEventListener("canplay", start, { once: true });
    return () => video.removeEventListener("canplay", start);
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={reduceMotion ? lastFrame.url : firstFrame.url}
      muted
      playsInline
      preload="auto"
      aria-label={label}
      role="img"
      onLoadedData={onReady}
      onError={onReady}
      {...({ "disable-picture-in-picture": "", disablePictureInPicture: true } as object)}
    >
      <source src={heroWebm.url} type="video/webm" />
      <source src={heroVideo.url} type="video/mp4" />
    </video>
  );
};

export default AboutHeroVideo;
