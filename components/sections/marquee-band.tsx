import { cn } from "@/lib/utils";

type MarqueeBandProps = {
  text: string;
  className?: string;
  reverse?: boolean;
  speed?: number;
};

export function MarqueeBand({ text, className, reverse = false, speed = 38 }: MarqueeBandProps) {
  const items = Array.from({ length: 6 });

  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y border-border bg-bg-elevated py-6",
        className,
      )}
    >
      <div
        className={cn(
          "animate-marquee flex w-max items-center gap-8 hover:[animation-play-state:paused]",
          reverse && "[animation-direction:reverse]",
        )}
        style={{ animationDuration: `${speed}s` }}
      >
        {items.map((_, index) => (
          <span
            key={index}
            aria-hidden={index > 0}
            className="flex items-center gap-8 text-2xl font-semibold tracking-tight text-transparent sm:text-4xl"
            style={{
              WebkitTextStroke: "1px color-mix(in srgb, var(--text) 26%, transparent)",
            }}
          >
            {text}
            <span aria-hidden className="size-2 rounded-full bg-primary/70" />
          </span>
        ))}
      </div>
    </div>
  );
}