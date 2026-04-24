import { Suspense } from 'react';
import GardenClient from './GardenClient';

export const metadata = {
  title: 'Your Progress Garden | AIForj',
  description: 'Watch your Mood Garden grow from local-first sessions and check-ins. Free-text stays local unless a feature clearly says otherwise.',
  alternates: {
    canonical: 'https://aiforj.com/garden',
  },
  openGraph: {
    title: 'Mood Garden | AIForj',
    description: 'A private, local-only progress landscape that grows from your AIForj sessions, mood check-ins, and streaks.',
    url: 'https://aiforj.com/garden',
    siteName: 'AIForj',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mood Garden | AIForj',
    description: 'See your private progress landscape grow from sessions, mood check-ins, and emotional patterns.',
  },
};

export default function GardenPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <GardenClient />
    </Suspense>
  );
}
