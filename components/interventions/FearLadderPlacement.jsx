"use client";

import { useMemo, useState } from 'react';
import { InterventionShell, PrimaryButton, StepDots, rangeStyle, shellStyles } from './shared';

const ACCENT = '#C4856C';

export default function FearLadderPlacement({ onComplete }) {
  const [rating, setRating] = useState(5);
  const recommendation = useMemo(() => {
    if (rating <= 3) return 'Manageable. Thinking tools will help. Start with Fear Fact-Check.';
    if (rating <= 6) return 'Moderate. Go body-first, then thinking. Try Orienting Response and then Fear Fact-Check.';
    if (rating <= 8) return 'High. Use pure grounding first. Try 5-4-3-2-1 Grounding.';
    return 'Extremely high. Focus only on safety and grounding. Try Safety Anchor, and call 911 if you are in danger.';
  }, [rating]);

  return (
    <InterventionShell center maxWidth={720}>
      <div style={{ ...shellStyles.card, textAlign: 'center' }}>
        <StepDots currentStep={2} totalSteps={2} accent={ACCENT} label="Fear Ladder Placement" />
        <h2 style={shellStyles.heading}>How scared do you feel right now?</h2>
        <div style={{ marginTop: 24 }}>
          <input type="range" min="0" max="10" value={rating} onChange={(event) => setRating(Number(event.target.value))} style={rangeStyle(ACCENT)} />
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 52, color: ACCENT, marginTop: 10 }}>{rating}/10</div>
        </div>
        <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(196, 133, 108, 0.08)' }}>
          <p style={{ ...shellStyles.body, margin: 0 }}>{recommendation}</p>
        </div>
        <p style={{ ...shellStyles.body, marginTop: 16 }}>You cannot think your way out of a 9/10. Knowing your level helps you pick the right tool.</p>
        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton accent={ACCENT} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
