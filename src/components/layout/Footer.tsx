'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-sand-200 bg-base">
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-4 sm:flex-row lg:px-6">
        <p className="text-xs text-warm-400">
          &copy; {currentYear} MPV Capital Intelligence. All rights reserved.
        </p>
        <nav className="flex items-center gap-4">
          <a href="/terms" className="text-xs text-warm-400 transition-colors hover:text-warm-700">Terms</a>
          <a href="/privacy" className="text-xs text-warm-400 transition-colors hover:text-warm-700">Privacy</a>
          <a href="/support" className="text-xs text-warm-400 transition-colors hover:text-warm-700">Support</a>
          <a href="/docs" className="text-xs text-warm-400 transition-colors hover:text-warm-700">API Docs</a>
        </nav>
      </div>
    </footer>
  );
}
