import StartClient from './StartClient';

export const metadata = {
  title: 'Get Matched to an Emotional First-Aid Tool | AIForj',
  description: 'Choose what you feel, rate the intensity, and get a clinically-informed emotional first-aid tool in under 30 seconds. Free, private, and built by Kevin Cooke, PMHNP-BC.',
  alternates: {
    canonical: 'https://aiforj.com/start',
  },
  openGraph: {
    title: 'Get Support Now | AIForj',
    description: 'Choose what you feel and get matched to a practical emotional first-aid tool. Free, private, no account needed.',
    url: 'https://aiforj.com/start',
    siteName: 'AIForj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Get Support Now | AIForj',
    description: 'Choose what you feel and get matched to a practical emotional first-aid tool. Free, private, no account needed.',
  },
};

export default function StartPage() {
  return <StartClient />;
}
