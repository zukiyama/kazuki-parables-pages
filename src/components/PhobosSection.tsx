import { ArrowUpRight } from "lucide-react";
import episode from "@/assets/another-day-on-phobos-episode-1.mp4";
import poster from "@/assets/another-day-on-phobos-poster.webp";
import title from "@/assets/another-day-on-phobos-title-upload.webp";

const PhobosSection = () => (
  <section aria-labelledby="phobos-title" className="phobos-section px-5 pb-14 pt-8 text-center sm:pb-20 sm:pt-12">
    <h2 id="phobos-title" className="mx-auto w-full max-w-[23rem] sm:max-w-[28rem]">
      <img src={title} alt="Another Day on PHOBOS" width={1920} height={640} className="block h-auto w-full" />
    </h2>
    <p className="mx-auto my-8 max-w-xl font-heading text-base sm:my-10 sm:text-lg">
      Join the doctor on the strangest assignment in the galaxy
    </p>
    <div className="phobos-player mx-auto w-full max-w-[25rem] overflow-hidden rounded-[2rem] bg-ink-black p-2 sm:p-2.5">
    <video
      className="block aspect-[9/16] w-full rounded-[1.5rem] bg-ink-black"
      controls
      playsInline
      preload="metadata"
      poster={poster}
      aria-label="Another Day on PHOBOS — episode 1"
    >
      <source src={episode} type="video/mp4" />
      <a href={episode}>Watch Another Day on PHOBOS — episode 1</a>
    </video>
    </div>
    <p className="mt-7 font-heading text-lg sm:text-xl">Latest episodes now on TikTok and Instagram</p>
    <div className="mt-3 flex flex-col items-center gap-3">
    <a
      href="https://www.tiktok.com/@anotherdayonphobos"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center justify-center gap-1 text-base text-foreground underline decoration-current underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <span className="min-w-0 break-words">TikTok: <wbr />@anotherdayonphobos</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
    <a
      href="https://www.instagram.com/anotherdayonphobos/"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center justify-center gap-1 text-base text-foreground underline decoration-current underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <span className="min-w-0 break-words">Instagram: <wbr />@anotherdayonphobos</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
    </div>
  </section>
);

export default PhobosSection;