import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/hooks/useTheme';

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
  themeColor: '#fdfcfa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of wrong theme by applying class before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme:dark)').matches;if(t==='dark'||(t!=='light'&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-surface-primary text-warm-900 min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
