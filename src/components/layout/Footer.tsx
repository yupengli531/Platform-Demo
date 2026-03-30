'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-800/60 bg-surface-primary">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row lg:px-6">
        <p className="text-xs text-navy-500">
          &copy; {currentYear} MPV Capital Intelligence. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <a
            href="/terms"
            className="text-xs text-navy-500 transition-colors hover:text-navy-300"
          >
            Terms
          </a>
          <a
            href="/privacy"
            className="text-xs text-navy-500 transition-colors hover:text-navy-300"
          >
            Privacy
          </a>
          <a
            href="/support"
            className="text-xs text-navy-500 transition-colors hover:text-navy-300"
          >
            Support
          </a>
          <a
            href="/docs"
            className="text-xs text-navy-500 transition-colors hover:text-navy-300"
          >
            API Docs
          </a>
        </nav>
      </div>
    </footer>
  );
}
