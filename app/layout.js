import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import BiophilicBackground from './components/BiophilicBackground';

export const metadata = {
  title: 'AIForj — Talk to Forj | Voice AI Therapeutic Companion',
  description: 'The world\'s first voice-based, clinician-built, completely private AI therapeutic companion. 15+ evidence-based modalities including CBT, DBT, ACT, and more. Built by a Board Certified PMHNP. 100% browser-based — nothing leaves your device.',
  keywords: 'voice AI therapy, mental health, CBT, DBT, ACT, therapeutic companion, anxiety, depression, wellness, AI counselor, private therapy, nurse practitioner',
  alternates: {
    canonical: 'https://aiforj.com',
  },
  openGraph: {
    title: 'AIForj — Talk to Forj',
    description: 'Voice-based AI therapeutic companion with 15+ evidence-based modalities. Clinician-built. 100% private. Nothing leaves your device.',
    url: 'https://aiforj.com',
    siteName: 'AIForj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForj — Talk to Forj',
    description: 'Voice-based AI therapeutic companion with 15+ evidence-based modalities. Clinician-built. 100% private.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=DM+Sans:wght@300;400;500;600&family=Sora:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2VSX5RJH0J"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2VSX5RJH0J');
        `}} />
        {/* Prevent flash of wrong theme */}
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
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
