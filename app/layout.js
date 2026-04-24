import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import BiophilicBackground from './components/BiophilicBackground';
import Navigation from './components/Navigation';
import SOS from './components/SOS';
import SEO from './components/SEO';
import GoogleAnalytics from '../components/GoogleAnalytics';
import PageViewBeacon from '../components/metrics/PageViewBeacon';
import { SoundProvider } from './components/SoundProvider';
import { Suspense } from 'react';

export const metadata = {
  metadataBase: new URL('https://aiforj.com'),
  title: 'AIForj — Emotional First Aid That Actually Works',
  description: '30 public guides plus 100+ guided interventions for anxiety, sadness, anger, overwhelm, and more. Clinician-informed, privacy-first, evidence-framed emotional first aid.',
  keywords: 'emotional first aid, mental health tools, CBT tools, DBT skills, ACT defusion, somatic grounding, anxiety grounding, mood tracking, therapeutic techniques, AIForj',
  alternates: {
    canonical: 'https://aiforj.com',
  },
  icons: {
    icon: '/aiforj-mark.svg',
    shortcut: '/aiforj-mark.svg',
    apple: '/aiforj-mark.png',
  },
  openGraph: {
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: '30 public guides plus 100+ guided interventions for anxiety, sadness, anger, overwhelm, and more. Clinician-informed emotional first aid.',
    url: 'https://aiforj.com',
    siteName: 'AIForj',
    type: 'website',
    images: [{ url: '/aiforj-og.png', width: 1200, height: 630, alt: 'AIForj emotional first aid' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: '30 public guides plus 100+ guided emotional first-aid interventions. Clinician-informed and privacy-first.',
    images: ['/aiforj-og.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        {/* Prevent flash of wrong theme */}
        <SEO />
        <GoogleAnalytics />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var manual = localStorage.getItem('aiforj-theme-manual');
              var saved = localStorage.getItem('aiforj-theme');
              if (manual === 'true' && saved) {
                document.documentElement.setAttribute('data-theme', saved);
              } else {
              var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="grain">
        <ThemeProvider>
          <SoundProvider>
            <BiophilicBackground />
            <div style={{ position: "relative", zIndex: 1 }}>
              <Navigation />
              <Suspense fallback={null}>
                <PageViewBeacon />
              </Suspense>
              <div className="page-enter">
                {children}
              </div>
              <SOS />
            </div>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
