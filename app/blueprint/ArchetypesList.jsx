"use client";

import React from 'react';

const ARCHETYPES = [
  { slug: 'sentinel', name: 'Sentinel' },
  { slug: 'empath', name: 'Empath' },
  { slug: 'architect', name: 'Architect' },
  { slug: 'phoenix', name: 'Phoenix' },
  { slug: 'storm', name: 'Storm' },
  { slug: 'ghost', name: 'Ghost' },
];

export default function ArchetypesList() {
  return (
    <section className="container" style={{ marginTop: 32, marginBottom: 48 }}>
      <h2 className="text-hero">Archetypes — Learn more about your Blueprint result</h2>
      <p className="text-secondary" style={{ marginTop: 8 }}>Explore clinical guides for each emotional archetype.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginTop: 18 }}>
        {ARCHETYPES.map(a => (
          <a key={a.slug} href={`/archetypes/${a.slug}`} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ fontFamily: 'Fraunces', fontWeight: 700 }}>{a.name}</div>
            <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Clinical guide · Techniques · Growth plan</div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>Learn more →</div>
          </a>
        ))}
      </div>
    </section>
  );
}
