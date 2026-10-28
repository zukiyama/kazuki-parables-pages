import React from "react";
import heroWebm from "@/assets/about-hero.webm.asset.json";
import heroVideo from "@/assets/about-hero.mp4.asset.json";
import firstFrame from "@/assets/about-hero-first.jpg.asset.json";
import lastFrame from "@/assets/about-hero-last.jpg.asset.json";
import { playbackRateForRemaining, STOP_REMAINING_SECONDS } from "@/lib/ease-out-playback";

type Props = { className?: string; label: string; onReady?: () => void };

/**
 * Silent background clip: plays once at normal speed, then decelerates smoothly
 * over its final two seconds and rests on the last frame.
 */
const AboutHeroVideo = ({ className = "", label, onReady }: Props) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return;
    let frame = 0;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const duration = video.duration;
      if (Number.isFinite(duration) && duration > 0) {
        const remaining = duration - video.currentTime;
        if (video.ended || remaining <= STOP_REMAINING_SECONDS) {
          video.pause();
          video.playbackRate = 1;
          return;
        }
        const rate = playbackRateForRemaining(remaining);
        if (Math.abs(video.playbackRate - rate) > 0.005) video.playbackRate = rate;
      }
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      video.playbackRate = 1;
      video.play().catch(() => {
        /* autoplay blocked: the first frame stays on screen */
      });
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tick);
    };

    if (video.readyState >= 3) start();
    else video.addEventListener("canplay", start, { once: true });

    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      video.removeEventListener("canplay", start);
    };
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
