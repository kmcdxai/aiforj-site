import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import BiophilicBackground from './components/BiophilicBackground';
import Navigation from './components/Navigation';
import SOS from './components/SOS';
import SEO from './components/SEO';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { SoundProvider } from './components/SoundProvider';

export const metadata = {
  metadataBase: new URL('https://aiforj.com'),
  title: 'AIForj — Emotional First Aid That Actually Works',
  description: '100+ clinically-matched tools for anxiety, sadness, anger, overwhelm, and more. Built and clinically informed by a licensed clinician and psychiatric nurse practitioner candidate. Free, private, evidence-based emotional first aid.',
  keywords: 'emotional first aid, mental health tools, CBT tools, DBT skills, ACT defusion, somatic grounding, anxiety grounding, mood tracking, therapeutic techniques, AIForj',
  alternates: {
    canonical: 'https://aiforj.com',
  },
  openGraph: {
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: '100+ clinically-matched tools for anxiety, sadness, anger, overwhelm, and more. Built and clinically informed by a licensed clinician and psychiatric nurse practitioner candidate.',
    url: 'https://aiforj.com',
    siteName: 'AIForj',
    type: 'website',
    images: [{ url: '/aif.jpeg', width: 1200, height: 630, alt: 'AIForj' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: '100+ clinically-matched emotional first-aid tools. Built and clinically informed by a licensed clinician and psychiatric nurse practitioner candidate.',
    images: ['/aif.jpeg'],
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
