"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Callback = () => void;
const listeners = new WeakMap<Element, Callback>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver | null {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const cb = listeners.get(entry.target);
            if (cb) {
              cb();
              listeners.delete(entry.target);
            }
            sharedObserver?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );
  }
  return sharedObserver;
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
};

export function Reveal({ children, className, delay = 0, y = 20 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = getSharedObserver();
    if (!observer) {
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }

    listeners.set(el, () => setVisible(true));
    observer.observe(el);

    return () => {
      listeners.delete(el);
      observer.unobserve(el);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: visible && delay ? `${delay}s` : undefined,
        transform: visible ? "translate3d(0, 0, 0)" : `translate3d(0, ${y}px, 0)`,
      }}
      className={cn(
        "transition-[transform,opacity] duration-500 ease-out motion-reduce:transform-none motion-reduce:opacity-100 motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
        className,
      )}
    >
      {children}
    </div>
  );
}