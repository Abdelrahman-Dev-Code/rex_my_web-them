"use client";

import { useEffect, useRef } from "react";

type CounterProps = {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
};

export function Counter({ value, suffix = "", className, duration = 1.2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let rafId = 0;
    const animate = () => {
      const start = performance.now();
      const totalMs = duration * 1000;

      const step = (now: number) => {
        const elapsed = Math.min(1, (now - start) / totalMs);
        const eased = 1 - Math.pow(1 - elapsed, 3);
        el.textContent = `${Math.round(eased * value)}${suffix}`;
        if (elapsed < 1) {
          rafId = window.requestAnimationFrame(step);
        }
      };

      rafId = window.requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) {
      animate();
      return () => {
        if (rafId) window.cancelAnimationFrame(rafId);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          observer.disconnect();
          animate();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={className} dir="ltr">
      {value}
      {suffix}
    </span>
  );
}