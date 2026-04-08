"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InterventionWrapper from '../../../components/measurement/InterventionWrapper';
import TechniqueClient from '../../techniques/[slug]/TechniqueClient';

function InterventionInner({ technique }) {
  const searchParams = useSearchParams();
  const emotion = searchParams.get('emotion') || 'general';

  return (
    <InterventionWrapper
      emotion={emotion}
      intervention={{
        title: technique.title,
        slug: technique.slug,
        modality: technique.modality,
        time: technique.time,
      }}
    >
      <TechniqueClient technique={technique} related={[]} />
    </InterventionWrapper>
  );
}

export default function InterventionClient({ technique }) {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>
        </div>
      }>
        <InterventionInner technique={technique} />
      </Suspense>
    </div>
  );
}
