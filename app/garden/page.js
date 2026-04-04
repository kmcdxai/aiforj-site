import { Suspense } from 'react';
import GardenClient from './GardenClient';

export const metadata = {
  title: 'Your Progress Garden | AIForj',
  description: 'Watch your mental wellness garden grow as you engage with evidence-based tools. Private, local-only — your data never leaves your device.',
};

export default function GardenPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <GardenClient />
    </Suspense>
  );
}
