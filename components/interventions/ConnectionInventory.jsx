"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, SecondaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#6B98B8';

function parseNames(value) {
  return value.split(',').map((item) => item.trim()).filter(Boolean);
}

export default function ConnectionInventory({ onComplete }) {
  const [inner, setInner] = useState('');
  const [middle, setMiddle] = useState('');
  const [outer, setOuter] = useState('');
  const [reconnect, setReconnect] = useState([]);
  const [alsoLonely, setAlsoLonely] = useState([]);

  const buckets = useMemo(() => ({
    inner: parseNames(inner),
    middle: parseNames(middle),
    outer: parseNames(outer),
  }), [inner, middle, outer]);

  const allNames = useMemo(() => [...buckets.inner, ...buckets.middle, ...buckets.outer], [buckets]);
  const total = allNames.length;

  const toggle = (setter, values, name) => setter(values.includes(name) ? values.filter((item) => item !== name) : [...values, name]);

  return (
    <InterventionShell maxWidth={860}>
      <div style={shellStyles.card}>
        <StepDots currentStep={total ? 2 : 1} totalSteps={2} accent={ACCENT} label="Connection Inventory" />
        <h2 style={shellStyles.heading}>Map the people in your world.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>Enter names separated by commas.</p>
        <div style={{ display: 'grid', gap: 14, marginTop: 22 }}>
          <input value={inner} onChange={(event) => setInner(event.target.value)} placeholder="Inner ring: 1-3 people who really know you" style={shellStyles.textInput} />
          <input value={middle} onChange={(event) => setMiddle(event.target.value)} placeholder="Middle ring: friends and regular contacts" style={shellStyles.textInput} />
          <input value={outer} onChange={(event) => setOuter(event.target.value)} placeholder="Outer ring: acquaintances and community" style={shellStyles.textInput} />
        </div>
        {total ? (
          <>
            <div style={{ marginTop: 22, display: 'grid', placeItems: 'center' }}>
              <div style={{ width: 320, height: 320, borderRadius: '50%', background: 'rgba(107, 152, 184, 0.08)', display: 'grid', placeItems: 'center' }}>
                <div style={{ width: 220, height: 220, borderRadius: '50%', background: 'rgba(107, 152, 184, 0.10)', display: 'grid', placeItems: 'center' }}>
                  <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'rgba(107, 152, 184, 0.18)', display: 'grid', placeItems: 'center', textAlign: 'center', padding: 12 }}>
                    <strong>{buckets.inner.length}</strong>
                    <span style={{ fontSize: 12 }}>close</span>
                  </div>
                </div>
              </div>
            </div>
            <p style={{ ...shellStyles.body, marginTop: 14, textAlign: 'center' }}>
              You have <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> people in your world. Loneliness told you it was zero.
            </p>
            <h3 style={{ ...shellStyles.subheading, marginTop: 24 }}>Who haven&apos;t you reached out to in a while?</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {allNames.map((name) => (
                <ChoiceCard key={`reconnect-${name}`} selected={reconnect.includes(name)} accent={ACCENT} onClick={() => toggle(setReconnect, reconnect, name)}>
                  {name}
                </ChoiceCard>
              ))}
            </div>
            <h3 style={{ ...shellStyles.subheading, marginTop: 24 }}>Who might also be lonely?</h3>
            <div style={{ display: 'grid', gap: 10, marginTop: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
              {allNames.map((name) => (
                <ChoiceCard key={`also-${name}`} selected={alsoLonely.includes(name)} accent={ACCENT} onClick={() => toggle(setAlsoLonely, alsoLonely, name)}>
                  {name}
                </ChoiceCard>
              ))}
            </div>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
              <strong style={{ display: 'block', marginBottom: 10 }}>Outreach plan</strong>
              <ul style={{ margin: '0 0 0 18px', lineHeight: 1.8 }}>
                {reconnect.slice(0, 3).map((name) => <li key={name}>Send {name} a real message this week.</li>)}
                {alsoLonely.slice(0, 2).map((name) => <li key={name}>Check on {name} with a low-pressure note.</li>)}
              </ul>
            </div>
          </>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <SecondaryButton onClick={() => { setInner(''); setMiddle(''); setOuter(''); setReconnect([]); setAlsoLonely([]); }}>Reset</SecondaryButton>
          <PrimaryButton
            accent={ACCENT}
            disabled={!total}
            onClick={() => {
              appendToStorage('aiforj_connection_inventory', {
                buckets,
                reconnect,
                alsoLonely,
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
