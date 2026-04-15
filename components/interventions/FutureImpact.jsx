"use client";

import { useState } from 'react';
import CrisisBanner from './CrisisBanner';
import { InterventionShell, PrimaryButton, StepDots, appendToStorage, shellStyles } from './shared';

const ACCENT = '#C47A8A';

export default function FutureImpact({ onComplete }) {
  const [pathA, setPathA] = useState({ sixMonths: '', oneYear: '', fiveYears: '' });
  const [pathB, setPathB] = useState({ sixMonths: '', oneYear: '', fiveYears: '' });

  const updatePath = (setter, key, value) => {
    setter((current) => ({ ...current, [key]: value }));
  };

  const complete =
    pathA.sixMonths.trim() &&
    pathA.oneYear.trim() &&
    pathA.fiveYears.trim() &&
    pathB.sixMonths.trim() &&
    pathB.oneYear.trim() &&
    pathB.fiveYears.trim();

  return (
    <InterventionShell maxWidth={980}>
      <div style={shellStyles.card}>
        <CrisisBanner />
        <StepDots currentStep={complete ? 2 : 1} totalSteps={2} accent={ACCENT} label="Future Self Impact Visualization" />
        <h2 style={shellStyles.heading}>See both futures clearly.</h2>
        <p style={{ ...shellStyles.body, marginTop: 12 }}>
          This is not about shaming yourself. It is about seeing what is at stake and remembering that direction is still a choice.
        </p>

        <div style={{ display: 'grid', gap: 18, marginTop: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
          <div style={{ ...shellStyles.card, padding: '20px 18px', background: 'rgba(196, 122, 138, 0.08)' }}>
            <strong style={{ display: 'block', marginBottom: 12 }}>Path A — If the destructive pattern continues</strong>
            <textarea
              value={pathA.sixMonths}
              onChange={(event) => updatePath(setPathA, 'sixMonths', event.target.value)}
              placeholder="In 6 months..."
              style={{ ...shellStyles.textarea, minHeight: 110 }}
            />
            <textarea
              value={pathA.oneYear}
              onChange={(event) => updatePath(setPathA, 'oneYear', event.target.value)}
              placeholder="In 1 year..."
              style={{ ...shellStyles.textarea, minHeight: 110, marginTop: 12 }}
            />
            <textarea
              value={pathA.fiveYears}
              onChange={(event) => updatePath(setPathA, 'fiveYears', event.target.value)}
              placeholder="In 5 years..."
              style={{ ...shellStyles.textarea, minHeight: 110, marginTop: 12 }}
            />
          </div>

          <div style={{ ...shellStyles.card, padding: '20px 18px', background: 'rgba(122, 158, 126, 0.1)' }}>
            <strong style={{ display: 'block', marginBottom: 12 }}>Path B — If you choose differently starting today</strong>
            <textarea
              value={pathB.sixMonths}
              onChange={(event) => updatePath(setPathB, 'sixMonths', event.target.value)}
              placeholder="In 6 months..."
              style={{ ...shellStyles.textarea, minHeight: 110 }}
            />
            <textarea
              value={pathB.oneYear}
              onChange={(event) => updatePath(setPathB, 'oneYear', event.target.value)}
              placeholder="In 1 year..."
              style={{ ...shellStyles.textarea, minHeight: 110, marginTop: 12 }}
            />
            <textarea
              value={pathB.fiveYears}
              onChange={(event) => updatePath(setPathB, 'fiveYears', event.target.value)}
              placeholder="In 5 years..."
              style={{ ...shellStyles.textarea, minHeight: 110, marginTop: 12 }}
            />
          </div>
        </div>

        {complete ? (
          <div style={{ ...shellStyles.card, marginTop: 18, background: 'rgba(196, 122, 138, 0.08)' }}>
            <p style={{ ...shellStyles.body, margin: 0 }}>
              Which future are you building right now? You get to choose the next vote, even if you cannot choose the whole outcome all at once.
            </p>
          </div>
        ) : null}

        <div style={shellStyles.buttonRow}>
          <PrimaryButton
            accent={ACCENT}
            disabled={!complete}
            onClick={() => {
              appendToStorage('aiforj_future_impact', {
                pathA,
                pathB,
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
