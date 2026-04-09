import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import BiophilicBackground from './components/BiophilicBackground';
import Navigation from './components/Navigation';
import SOS from './components/SOS';
import SEO from './components/SEO';

export const metadata = {
  title: 'AIForj — Emotional First Aid That Actually Works',
  description: 'Free evidence-based therapeutic tools designed by Kevin Cooke, PMHNP-BC. 12 emotional states, 100+ interventions across CBT, DBT, ACT, and somatic therapy. Mood measurement, guided techniques, and voice AI companion. 100% private — nothing ever leaves your device.',
  keywords: 'emotional first aid, mental health tools, CBT, DBT, ACT, somatic therapy, therapeutic companion, anxiety, depression, wellness, PMHNP, private therapy, mood tracking, grounding techniques',
  alternates: {
    canonical: 'https://aiforj.com',
  },
  openGraph: {
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: 'Free evidence-based therapeutic tools designed by a Board Certified PMHNP. 12 emotional states, 100+ interventions. 100% private.',
    url: 'https://aiforj.com',
    siteName: 'AIForj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForj — Emotional First Aid That Actually Works',
    description: 'Free evidence-based therapeutic tools designed by a Board Certified PMHNP. 12 emotional states, 100+ interventions. 100% private.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2VSX5RJH0J"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2VSX5RJH0J');
        `}} />
        {/* Prevent flash of wrong theme */}
        <SEO />
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var manual = localStorage.getItem('aiforj-theme-manual');
              var saved = localStorage.getItem('aiforj-theme');
              if (manual === 'true' && saved) {
                document.documentElement.setAttribute('data-theme', saved);
              } else {
                var h = new Date().getHours();
                document.documentElement.setAttribute('data-theme', (h >= 22 || h < 6) ? 'dark' : 'light');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="grain">
        <ThemeProvider>
          <BiophilicBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            <Navigation />
            <div className="page-enter">
              {children}
            </div>
            <SOS />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
