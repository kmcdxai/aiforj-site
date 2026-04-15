"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#D4A843';
const VOICES = ['Mine', 'Parent', 'Partner', 'Boss', 'Society', 'Social Media', 'Custom'];
const CATEGORIES = ['Want To', 'Negotiate', 'Release'];

export default function ShouldAudit({ onComplete }) {
  const [entry, setEntry] = useState('');
  const [items, setItems] = useState([]);

  const updateItem = (index, patch) => {
    setItems((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  };

  const grouped = useMemo(() => ({
    wants: items.filter((item) => item.category === 'Want To'),
    negotiate: items.filter((item) => item.category === 'Negotiate'),
    release: items.filter((item) => item.category === 'Release'),
  }), [items]);

  return (
    <InterventionShell maxWidth={900}>
      <div style={shellStyles.card}>
        <StepDots currentStep={items.length ? 2 : 1} totalSteps={2} accent={ACCENT} label="Should Audit" />
        <h2 style={shellStyles.heading}>List every &quot;should&quot; in your life right now.</h2>
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <input value={entry} onChange={(event) => setEntry(event.target.value)} placeholder="I should..." style={{ ...shellStyles.textInput, flex: 1 }} />
          <PrimaryButton
            accent={ACCENT}
            onClick={() => {
              if (!entry.trim()) return;
              setItems((current) => [...current, { should: entry.trim(), voice: '', aligned: '', consequence: '', category: '' }]);
              setEntry('');
            }}
          >
            Add
          </PrimaryButton>
        </div>
        <div style={{ display: 'grid', gap: 16, marginTop: 22 }}>
          {items.map((item, index) => (
            <div key={`${item.should}-${index}`} style={{ ...shellStyles.card, padding: '18px 18px', background: 'var(--surface)' }}>
              <strong>{item.should}</strong>
              <div style={{ display: 'grid', gap: 8, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                {VOICES.map((voice) => (
                  <ChoiceCard key={voice} selected={item.voice === voice} accent={ACCENT} onClick={() => updateItem(index, { voice })} style={{ padding: '12px 12px' }}>
                    {voice}
                  </ChoiceCard>
                ))}
              </div>
              <div style={{ display: 'grid', gap: 10, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                {['Yes', 'No', 'Unsure'].map((value) => (
                  <ChoiceCard key={value} selected={item.aligned === value} accent={ACCENT} onClick={() => updateItem(index, { aligned: value })}>
                    Aligned: {value}
                  </ChoiceCard>
                ))}
              </div>
              <textarea
                value={item.consequence}
                onChange={(event) => updateItem(index, { consequence: event.target.value })}
                placeholder="What happens if you do not do this?"
                style={{ ...shellStyles.textarea, marginTop: 12, minHeight: 100 }}
              />
              <div style={{ display: 'grid', gap: 10, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                {CATEGORIES.map((category) => (
                  <ChoiceCard key={category} selected={item.category === category} accent={ACCENT} onClick={() => updateItem(index, { category })}>
                    {category}
                  </ChoiceCard>
                ))}
              </div>
            </div>
          ))}
        </div>
        {items.length ? (
          <div style={{ display: 'grid', gap: 16, marginTop: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            <div style={{ ...shellStyles.card, background: 'rgba(122, 158, 126, 0.08)' }}>
              <strong>Want To</strong>
              <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
                {grouped.wants.map((item) => <li key={item.should}>{item.should}</li>)}
              </ul>
            </div>
            <div style={{ ...shellStyles.card, background: 'rgba(212, 168, 67, 0.08)' }}>
              <strong>Negotiate</strong>
              <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
                {grouped.negotiate.map((item) => <li key={item.should}>{item.should}</li>)}
              </ul>
            </div>
            <div style={{ ...shellStyles.card, background: 'rgba(196, 91, 91, 0.08)' }}>
              <strong>Release</strong>
              <ul style={{ margin: '10px 0 0 18px', lineHeight: 1.8 }}>
                {grouped.release.map((item) => <li key={item.should}>{item.should}</li>)}
              </ul>
            </div>
          </div>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => setItems([])}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!items.length || items.some((item) => !item.voice || !item.aligned || !item.consequence.trim() || !item.category)}
            onClick={() => {
              appendToStorage('aiforj_should_audit', {
                items,
                createdAt: new Date().toISOString(),
              });
              onComplete();
            }}
          >
            Finish
          </PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
