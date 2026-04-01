import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'MPV Capital Intelligence',
    template: '%s | MPV Capital Intelligence',
  },
  description:
    'Capital Markets Intelligence Platform for institutional investor sourcing, relationship management, and deal flow analysis.',
  keywords: [
    'capital markets',
    'investment banking',
    'deal flow',
    'investor relations',
    'private equity',
    'venture capital',
    'CRM',
  ],
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-surface-primary text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
