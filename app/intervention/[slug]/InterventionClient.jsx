"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import InterventionWrapper from '../../../components/measurement/InterventionWrapper';
import TechniqueClient from '../../techniques/[slug]/TechniqueClient';
import { interventionComponents } from '../../../components/interventions/registry';

function PlaceholderIntervention({ technique, onComplete }) {
  return (
    <section style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '48px 24px 120px' }}>
      <div style={{ maxWidth: 560, textAlign: 'center', background: 'var(--surface-elevated)', border: '1px solid var(--border)', borderRadius: 24, padding: '36px 28px', boxShadow: 'var(--shadow-md)' }}>
        <span style={{ fontSize: 42, display: 'block', marginBottom: 18 }}>{technique.tier === 'premium' ? '✦' : '🌿'}</span>
        <h1 style={{ margin: '0 0 12px' }}>{technique.name || technique.title}</h1>
        <p style={{ margin: '0 auto 18px', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
          {technique.description || 'This intervention is coming soon. For now, take a moment to breathe and check in with yourself.'}
        </p>
        {technique.tier === 'premium' && (
          <p style={{ margin: '0 auto 22px', color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>
            This guided version is still on the way. If you want more support right now, Talk to Forj Premium is available for deeper personalized help.
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={onComplete} className="btn-primary">
            I took the pause →
          </button>
          {technique.tier === 'premium' && (
            <a href="/companion" className="btn-secondary" style={{ textDecoration: 'none' }}>
              Open Talk to Forj →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

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
          : technique.placeholder
            ? <PlaceholderIntervention technique={technique} onComplete={onComplete} />
          : <TechniqueClient technique={technique} related={[]} />
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
