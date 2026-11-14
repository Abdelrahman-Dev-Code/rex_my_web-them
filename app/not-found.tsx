import Link from "next/link";
import "./globals.css";

export default function RootNotFound() {
  return (
    <main className="container-page flex min-h-[70vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="text-sm font-semibold uppercase tracking-widest text-primary">404</span>
      <h1 className="text-3xl font-semibold sm:text-4xl">CodeNest · كود نست</h1>
      <p className="max-w-md text-pretty text-muted">
        This page could not be found. · هذه الصفحة غير موجودة.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/ar"
          className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-fg"
        >
          العربية
        </Link>
        <Link
          href="/en"
          className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-text"
        >
          English
        </Link>
      </div>
    </main>
  );
}