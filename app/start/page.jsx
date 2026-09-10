import StartClient from './StartClient';

export const metadata = {
  title: 'Get Matched to an Emotional First-Aid Tool | Tredici',
  description: 'Choose what you feel, rate the intensity, and get a clinically-informed emotional first-aid tool in under 30 seconds. Free, private, and published by Tredici.',
  alternates: {
    canonical: 'https://aiforj.com/start',
  },
  openGraph: {
    title: 'Get Support Now | Tredici',
    description: 'Choose what you feel and get matched to a practical emotional first-aid tool. Free, private, no account needed.',
    url: 'https://aiforj.com/start',
    siteName: 'Tredici',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Support Now | Tredici',
    description: 'Choose what you feel and get matched to a practical emotional first-aid tool. Free, private, no account needed.',
  },
};

export default function StartPage() {
  return <StartClient />;
}
