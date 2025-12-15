import { memo } from "react";
import { cn } from "@/lib/utils";

type CirclesBokehBackgroundProps = {
  className?: string;
};

const CirclesBokehBackground = memo(({ className }: CirclesBokehBackgroundProps) => {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-0 z-0 overflow-hidden pointer-events-none transform-gpu",
        className
      )}
    >
      {/* Extra large partial circles extending off edges */}
      <div className="absolute -right-28 -bottom-32 w-72 h-72 rounded-full bg-rose-400/35 bokeh-blur animate-drift-1"></div>
      <div className="absolute -left-24 -top-22 w-60 h-60 rounded-full bg-amber-400/30 bokeh-blur animate-drift-2"></div>
      <div className="absolute -left-18 bottom-[12%] w-48 h-48 rounded-full bg-orange-300/28 bokeh-blur animate-drift-3"></div>
      <div className="absolute -right-16 top-[8%] w-44 h-44 rounded-full bg-rose-300/30 bokeh-blur animate-drift-4"></div>
      <div className="absolute -bottom-20 left-[28%] w-56 h-56 rounded-full bg-[rgba(248,131,121,0.25)] bokeh-blur animate-drift-5"></div>
      <div className="absolute -top-24 right-[22%] w-52 h-52 rounded-full bg-amber-300/28 bokeh-blur animate-drift-6"></div>
      <div className="absolute -left-32 top-[40%] w-52 h-52 rounded-full bg-amber-300/22 bokeh-blur animate-drift-7"></div>
      <div className="absolute -right-36 bottom-[20%] w-68 h-68 rounded-full bg-[rgba(255,204,170,0.25)] bokeh-blur animate-drift-8"></div>

      {/* Large circles */}
      <div className="absolute left-[2%] top-[18%] w-36 h-36 rounded-full bg-rose-300/38 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[12%] bottom-[6%] w-34 h-34 rounded-full bg-amber-400/35 bokeh-blur animate-drift-1"></div>
      <div className="absolute left-[50%] top-[3%] w-32 h-32 rounded-full bg-orange-300/38 bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[30%] bottom-[20%] w-30 h-30 rounded-full bg-rose-400/40 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[72%] bottom-[3%] w-34 h-34 rounded-full bg-pink-300/32 bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[58%] top-[0%] w-32 h-32 rounded-full bg-amber-300/36 bokeh-blur animate-drift-6"></div>
      <div className="absolute left-[18%] bottom-[0%] w-30 h-30 rounded-full bg-rose-200/35 bokeh-blur animate-drift-7"></div>
      <div className="absolute right-[0%] top-[38%] w-28 h-28 rounded-full bg-orange-400/32 bokeh-blur animate-drift-8"></div>
      <div className="absolute left-[85%] top-[5%] w-32 h-32 rounded-full bg-[rgba(248,131,121,0.30)] bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[75%] bottom-[8%] w-30 h-30 rounded-full bg-amber-200/38 bokeh-blur animate-drift-2"></div>

      {/* Medium-large circles */}
      <div className="absolute left-[6%] top-[48%] w-26 h-26 rounded-full bg-rose-400/40 bokeh-blur animate-drift-2"></div>
      <div className="absolute right-[22%] top-[15%] w-24 h-24 rounded-full bg-amber-400/42 bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[33%] top-[38%] w-22 h-22 rounded-full bg-pink-400/38 bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[4%] bottom-[38%] w-24 h-24 rounded-full bg-orange-400/40 bokeh-blur animate-drift-7"></div>
      <div className="absolute left-[62%] bottom-[10%] w-22 h-22 rounded-full bg-rose-300/40 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[48%] top-[8%] w-20 h-20 rounded-full bg-amber-500/35 bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[8%] top-[72%] w-21 h-21 rounded-full bg-pink-200/42 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[38%] bottom-[46%] w-20 h-20 rounded-full bg-rose-200/40 bokeh-blur animate-drift-1"></div>
      <div className="absolute left-[42%] bottom-[5%] w-24 h-24 rounded-full bg-[rgba(255,180,150,0.35)] bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[65%] top-[25%] w-22 h-22 rounded-full bg-amber-300/40 bokeh-blur animate-drift-6"></div>

      {/* Medium circles */}
      <div className="absolute left-[20%] bottom-[36%] w-20 h-20 rounded-full bg-rose-400/42 bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[26%] top-[26%] w-18 h-18 rounded-full bg-amber-400/45 bokeh-blur animate-drift-1"></div>
      <div className="absolute left-[43%] top-[52%] w-17 h-17 rounded-full bg-pink-400/40 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[10%] bottom-[52%] w-19 h-19 rounded-full bg-orange-400/42 bokeh-blur animate-drift-7"></div>
      <div className="absolute left-[56%] bottom-[23%] w-18 h-18 rounded-full bg-rose-300/42 bokeh-blur animate-drift-2"></div>
      <div className="absolute right-[53%] top-[33%] w-16 h-16 rounded-full bg-amber-500/40 bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[80%] top-[22%] w-17 h-17 rounded-full bg-pink-300/45 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[70%] bottom-[28%] w-16 h-16 rounded-full bg-rose-200/42 bokeh-blur animate-drift-6"></div>
      <div className="absolute left-[38%] top-[10%] w-18 h-18 rounded-full bg-orange-300/38 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[80%] top-[52%] w-17 h-17 rounded-full bg-amber-200/42 bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[68%] top-[60%] w-16 h-16 rounded-full bg-rose-400/38 bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[15%] bottom-[18%] w-18 h-18 rounded-full bg-pink-400/40 bokeh-blur animate-drift-7"></div>

      {/* Small-medium circles */}
      <div className="absolute left-[46%] bottom-[40%] w-16 h-16 rounded-full bg-rose-300/45 bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[16%] top-[42%] w-15 h-15 rounded-full bg-amber-500/42 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[70%] top-[35%] w-14 h-14 rounded-full bg-pink-300/45 bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[60%] bottom-[16%] w-16 h-16 rounded-full bg-orange-400/42 bokeh-blur animate-drift-8"></div>
      <div className="absolute left-[26%] top-[20%] w-15 h-15 rounded-full bg-rose-200/45 bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[6%] bottom-[26%] w-14 h-14 rounded-full bg-amber-400/42 bokeh-blur animate-drift-3"></div>
      <div className="absolute left-[86%] bottom-[46%] w-13 h-13 rounded-full bg-rose-400/45 bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[76%] top-[30%] w-14 h-14 rounded-full bg-orange-300/42 bokeh-blur animate-drift-7"></div>
      <div className="absolute left-[12%] bottom-[12%] w-15 h-15 rounded-full bg-[rgba(255,160,130,0.40)] bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[42%] top-[58%] w-14 h-14 rounded-full bg-amber-300/45 bokeh-blur animate-drift-2"></div>

      {/* Small circles */}
      <div className="absolute left-[13%] bottom-[56%] w-13 h-13 rounded-full bg-rose-400/48 bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[33%] top-[60%] w-12 h-12 rounded-full bg-amber-400/45 bokeh-blur animate-drift-1"></div>
      <div className="absolute left-[60%] top-[66%] w-11 h-11 rounded-full bg-pink-500/42 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[43%] bottom-[10%] w-13 h-13 rounded-full bg-orange-300/48 bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[36%] bottom-[63%] w-12 h-12 rounded-full bg-rose-300/45 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[20%] top-[70%] w-11 h-11 rounded-full bg-amber-400/48 bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[3%] top-[62%] w-12 h-12 rounded-full bg-rose-200/45 bokeh-blur animate-drift-7"></div>
      <div className="absolute right-[50%] top-[76%] w-10 h-10 rounded-full bg-orange-400/48 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[90%] top-[12%] w-13 h-13 rounded-full bg-pink-300/43 bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[86%] bottom-[13%] w-12 h-12 rounded-full bg-amber-300/45 bokeh-blur animate-drift-1"></div>
      <div className="absolute left-[52%] bottom-[55%] w-11 h-11 rounded-full bg-rose-400/42 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[28%] bottom-[62%] w-12 h-12 rounded-full bg-orange-200/48 bokeh-blur animate-drift-5"></div>

      {/* Tiny accent circles */}
      <div className="absolute left-[16%] bottom-[20%] w-10 h-10 rounded-full bg-rose-400/50 bokeh-blur animate-drift-2"></div>
      <div className="absolute right-[23%] top-[50%] w-9 h-9 rounded-full bg-amber-400/48 bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[53%] top-[56%] w-8 h-8 rounded-full bg-pink-500/45 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[40%] bottom-[3%] w-10 h-10 rounded-full bg-orange-300/50 bokeh-blur animate-drift-7"></div>
      <div className="absolute left-[30%] bottom-[70%] w-9 h-9 rounded-full bg-rose-300/48 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[30%] top-[66%] w-8 h-8 rounded-full bg-amber-400/50 bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[10%] top-[80%] w-10 h-10 rounded-full bg-rose-200/48 bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[63%] top-[80%] w-7 h-7 rounded-full bg-orange-400/50 bokeh-blur animate-drift-6"></div>
      <div className="absolute left-[76%] bottom-[60%] w-9 h-9 rounded-full bg-pink-500/45 bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[90%] top-[40%] w-8 h-8 rounded-full bg-amber-500/48 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[23%] top-[86%] w-10 h-10 rounded-full bg-rose-400/48 bokeh-blur animate-drift-7"></div>
      <div className="absolute right-[13%] bottom-[70%] w-9 h-9 rounded-full bg-orange-300/50 bokeh-blur animate-drift-8"></div>
      <div className="absolute left-[64%] bottom-[72%] w-8 h-8 rounded-full bg-amber-200/52 bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[55%] bottom-[75%] w-9 h-9 rounded-full bg-rose-300/48 bokeh-blur animate-drift-3"></div>

      {/* Extra tiny sparkle circles */}
      <div className="absolute left-[48%] top-[16%] w-7 h-7 rounded-full bg-rose-500/48 bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[28%] bottom-[43%] w-6 h-6 rounded-full bg-amber-300/52 bokeh-blur animate-drift-6"></div>
      <div className="absolute left-[23%] top-[70%] w-7 h-7 rounded-full bg-pink-400/50 bokeh-blur animate-drift-1"></div>
      <div className="absolute right-[66%] bottom-[66%] w-6 h-6 rounded-full bg-orange-400/55 bokeh-blur animate-drift-8"></div>
      <div className="absolute left-[73%] bottom-[43%] w-7 h-7 rounded-full bg-rose-300/50 bokeh-blur animate-drift-5"></div>
      <div className="absolute right-[8%] top-[66%] w-6 h-6 rounded-full bg-amber-500/48 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[30%] bottom-[6%] w-8 h-8 rounded-full bg-rose-200/50 bokeh-blur animate-drift-7"></div>
      <div className="absolute right-[83%] top-[6%] w-7 h-7 rounded-full bg-orange-300/55 bokeh-blur animate-drift-3"></div>
      <div className="absolute left-[58%] top-[45%] w-6 h-6 rounded-full bg-pink-400/52 bokeh-blur animate-drift-4"></div>
      <div className="absolute right-[45%] top-[38%] w-7 h-7 rounded-full bg-amber-400/50 bokeh-blur animate-drift-6"></div>
      <div className="absolute left-[82%] top-[75%] w-6 h-6 rounded-full bg-rose-400/52 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[72%] bottom-[42%] w-5 h-5 rounded-full bg-orange-400/55 bokeh-blur animate-drift-1"></div>

      {/* Micro circles for depth */}
      <div className="absolute left-[15%] top-[45%] w-5 h-5 rounded-full bg-rose-500/50 bokeh-blur animate-drift-3"></div>
      <div className="absolute right-[18%] bottom-[35%] w-4 h-4 rounded-full bg-amber-400/55 bokeh-blur animate-drift-5"></div>
      <div className="absolute left-[45%] bottom-[32%] w-5 h-5 rounded-full bg-pink-400/52 bokeh-blur animate-drift-7"></div>
      <div className="absolute right-[35%] top-[82%] w-4 h-4 rounded-full bg-orange-300/58 bokeh-blur animate-drift-2"></div>
      <div className="absolute left-[78%] top-[48%] w-5 h-5 rounded-full bg-rose-300/52 bokeh-blur animate-drift-6"></div>
      <div className="absolute right-[58%] bottom-[52%] w-4 h-4 rounded-full bg-amber-500/55 bokeh-blur animate-drift-4"></div>
      <div className="absolute left-[35%] top-[78%] w-5 h-5 rounded-full bg-rose-400/50 bokeh-blur animate-drift-8"></div>
      <div className="absolute right-[82%] top-[68%] w-4 h-4 rounded-full bg-orange-400/58 bokeh-blur animate-drift-1"></div>
    </div>
  );
});

CirclesBokehBackground.displayName = "CirclesBokehBackground";

export default CirclesBokehBackground;
