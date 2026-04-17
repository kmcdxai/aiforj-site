"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InterventionWrapper from '../../../components/measurement/InterventionWrapper';
import TechniqueClient from '../../techniques/[slug]/TechniqueClient';
import { interventionComponents } from '../../../components/interventions/registry';

function InterventionInner({ technique }) {
  const searchParams = useSearchParams();
  const emotion = searchParams.get('emotion') || 'general';
  const intensity = Number(searchParams.get('intensity') || '');
  const timePreference = searchParams.get('time') || null;

  // Check if a custom interactive component exists for this technique
  const slug = technique.slug || technique.id;
  const CustomComponent = interventionComponents[slug] || interventionComponents[technique.canonicalTechniqueSlug];

  return (
    <InterventionWrapper
      emotion={emotion}
      intervention={{
        title: technique.title || technique.name,
        slug,
        modality: technique.modality,
        time: technique.time,
        tier: technique.tier,
        intensity: Number.isFinite(intensity) ? intensity : null,
        timePreference,
      }}
    >
      {({ onComplete }) =>
        CustomComponent
          ? <CustomComponent onComplete={onComplete} emotion={emotion} />
          : <TechniqueClient technique={technique} related={[]} disableAnonymousMetrics metricsSource="intervention-route" />
      }
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
