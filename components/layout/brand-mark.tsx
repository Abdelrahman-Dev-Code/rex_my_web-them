import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: "size-8 rounded-lg text-xs",
  md: "size-9 rounded-xl text-[13px]",
  lg: "size-12 rounded-2xl text-base",
} as const;

export function BrandMark({ size = "md", className }: BrandMarkProps) {
  return (
    <span
      aria-hidden
      dir="ltr"
      className={cn(
        "relative inline-grid shrink-0 place-items-center overflow-hidden bg-gradient-to-br from-primary via-border to-accent p-px shadow-sm transition-all duration-300",
        sizeMap[size],
        className,
      )}
    >
      <span className="relative flex size-full items-center justify-center rounded-[inherit] bg-[#090910] font-bold tracking-[-0.06em] text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(124,92,255,0.34),transparent_60%),radial-gradient(circle_at_88%_88%,rgba(79,227,193,0.28),transparent_60%)]"
        />
        <span className="relative flex items-baseline leading-none">
          <span>N</span>
          <span className="text-accent">S</span>
        </span>
      </span>
    </span>
  );
}
