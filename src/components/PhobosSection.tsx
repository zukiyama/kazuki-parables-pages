import { ArrowUpRight } from "lucide-react";
import episode from "@/assets/another-day-on-phobos-episode-1.mp4";
import poster from "@/assets/another-day-on-phobos-poster.webp";

const PhobosSection = () => (
  <section aria-labelledby="phobos-title" className="phobos-section px-5 pb-14 pt-8 text-center sm:pb-20 sm:pt-12">
    <h2 id="phobos-title" className="phobos-title mb-8 sm:mb-10">
      <span className="phobos-title__intro block">ANOTHER DAY ON</span>
      <span className="phobos-title__place mt-1 block">PHOBOS</span>
    </h2>
    <video
      className="mx-auto block aspect-[9/16] w-full max-w-[25rem] rounded-[4px] bg-ink-black"
      controls
      playsInline
      preload="metadata"
      poster={poster}
      aria-label="Another Day on PHOBOS — episode 1"
    >
      <source src={episode} type="video/mp4" />
      <a href={episode}>Watch Another Day on PHOBOS — episode 1</a>
    </video>
    <p className="mt-7 font-heading text-lg sm:text-xl">New episodes now on TikTok.</p>
    <a
      href="https://www.tiktok.com/@andthenanothedayonphobos"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex max-w-full items-center justify-center gap-1 text-base text-foreground underline decoration-current underline-offset-4 transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <span className="min-w-0 break-words">tiktok.com/<wbr />@andthenanothedayonphobos</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
    </a>
    <p className="mt-2 text-sm text-muted-foreground">Placeholder link — account coming soon.</p>
  </section>
);

export default PhobosSection;