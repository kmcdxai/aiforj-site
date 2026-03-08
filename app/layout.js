import './globals.css';

export const metadata = {
  title: 'AIForj — Forj Your Mind | Evidence-Based Mental Wellness Tool',
  description: 'Free, science-based mental wellness tool with CBT, DBT, ACT, and AI-powered micro-interventions. Built by a Board Certified Psychiatric Mental Health Nurse Practitioner.',
  keywords: 'mental health, CBT, DBT, anxiety, depression, wellness, therapy, nurse practitioner, mental wellness tool',
  openGraph: {
    title: 'AIForj — Forj Your Mind',
    description: 'Evidence-based micro-interventions for anxiety, stress, sadness, and more. 3-5 minutes. Free. Private.',
    url: 'https://aiforj.com',
    siteName: 'AIForj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIForj — Forj Your Mind',
    description: 'Evidence-based micro-interventions for anxiety, stress, sadness, and more.',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
