"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  ANGER_ACCENT,
  ChoiceCard,
  InterventionShell,
  PrimaryButton,
  SecondaryButton,
  StepDots,
  formatSeconds,
  shellStyles,
} from './shared';

const SKILLS = [
  {
    id: 'temperature',
    emoji: '🧊',
    title: 'Temperature',
    blurb: 'Splash cold water on your face or hold ice cubes to activate the dive reflex.',
    duration: 60,
  },
  {
    id: 'exercise',
    emoji: '🏃',
    title: 'Intense Exercise',
    blurb: 'Burn off the adrenaline with jumping jacks, push-ups, or running in place.',
    duration: 60,
  },
  {
    id: 'breathing',
    emoji: '🫁',
    title: 'Paced Breathing',
    blurb: 'Inhale 4 seconds, exhale 8 seconds. Longer exhales tell your body the threat has passed.',
    duration: 48,
  },
  {
    id: 'relaxation',
    emoji: '💪',
    title: 'Progressive Relaxation',
    blurb: 'Tense every muscle group, then release and feel the contrast.',
    duration: 40,
  },
];

function getLiveCue(skillId, remaining) {
  if (skillId === 'breathing') {
    const elapsed = 48 - remaining;
    const cycleSecond = elapsed % 12;
    if (cycleSecond < 4) return 'Inhale through your nose';
    return 'Long, slow exhale';
  }

  if (skillId === 'relaxation') {
    const elapsed = 40 - remaining;
    const phase = elapsed % 20;
    return phase < 10 ? 'Tense every muscle for 10 seconds' : 'Release and soften';
  }

  if (skillId === 'exercise') {
    const remainingCount = Math.max(1, 30 - Math.floor((60 - remaining) / 2));
    return `Count it out: ${remainingCount} reps left`;
  }

  return 'Stay with the cold sensation and let your body downshift';
}

export default function TIPPSkills({ onComplete }) {
  const [selectedSkillId, setSelectedSkillId] = useState(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const selectedSkill = useMemo(
    () => SKILLS.find((skill) => skill.id === selectedSkillId) || null,
    [selectedSkillId]
  );

  useEffect(() => {
    if (!selectedSkill || !running || completed) return undefined;

    const interval = window.setInterval(() => {
      setRemaining((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          setRunning(false);
          setCompleted(true);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [selectedSkill, running, completed]);

  const beginSkill = (skillId) => {
    const skill = SKILLS.find((item) => item.id === skillId);
    if (!skill) return;
    setSelectedSkillId(skill.id);
    setRemaining(skill.duration);
    setCompleted(false);
    setRunning(false);
  };

  if (!selectedSkill) {
    return (
      <InterventionShell maxWidth={620}>
        <div style={{ ...shellStyles.card, ...shellStyles.heroCard }}>
          <StepDots currentStep={1} totalSteps={2} accent={ANGER_ACCENT} label="DBT + Somatic Reset" />
          <div style={shellStyles.eyebrow}>TIPP Skills Menu</div>
          <h2 style={shellStyles.heading}>Change your body chemistry in under 2 minutes.</h2>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>
            Pick the version that fits your body right now. You do not need to solve the anger first. We are lowering the temperature so you can think again.
          </p>
          <div style={{ display: 'grid', gap: 14, marginTop: 24 }}>
            {SKILLS.map((skill) => (
              <ChoiceCard key={skill.id} onClick={() => beginSkill(skill.id)}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <div style={{ fontSize: 28, lineHeight: 1 }}>{skill.emoji}</div>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <strong style={{ fontSize: 16 }}>{skill.title}</strong>
                    <p style={{ ...shellStyles.body, fontSize: 14 }}>{skill.blurb}</p>
                  </div>
                </div>
              </ChoiceCard>
            ))}
          </div>
        </div>
      </InterventionShell>
    );
  }

  if (completed) {
    return (
      <InterventionShell center>
        <div style={{ ...shellStyles.card, textAlign: 'center', maxWidth: 520, margin: '0 auto' }}>
          <StepDots currentStep={2} totalSteps={2} accent={ANGER_ACCENT} label="Completed" />
          <div style={{ fontSize: 48, marginBottom: 18 }}>{selectedSkill.emoji}</div>
          <h2 style={shellStyles.heading}>Your body just shifted.</h2>
          <p style={{ ...shellStyles.body, marginTop: 14 }}>
            The anger may still be there, but the urge to act on it should be lower. That is enough space to make a better choice.
          </p>
          <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
            <PrimaryButton onClick={onComplete}>Finish reset</PrimaryButton>
            <SecondaryButton onClick={() => beginSkill(selectedSkill.id)}>Run it again</SecondaryButton>
          </div>
        </div>
      </InterventionShell>
    );
  }

  return (
    <InterventionShell center>
      <div style={{ ...shellStyles.card, maxWidth: 520, margin: '0 auto' }}>
        <StepDots currentStep={2} totalSteps={2} accent={ANGER_ACCENT} label={selectedSkill.title} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 46, marginBottom: 16 }}>{selectedSkill.emoji}</div>
          <h2 style={shellStyles.heading}>{selectedSkill.title}</h2>
          <p style={{ ...shellStyles.body, marginTop: 12 }}>{selectedSkill.blurb}</p>
        </div>

        <div
          style={{
            marginTop: 24,
            padding: '28px 20px',
            borderRadius: 28,
            border: '1px solid rgba(196, 91, 91, 0.18)',
            background: 'linear-gradient(180deg, rgba(196,91,91,0.08) 0%, rgba(255,255,255,0.95) 100%)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 170,
              height: 170,
              margin: '0 auto 18px',
              borderRadius: '50%',
              border: '10px solid rgba(196, 91, 91, 0.12)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: 'inset 0 0 0 10px rgba(255,255,255,0.7)',
            }}
          >
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 700, color: ANGER_ACCENT }}>
                {formatSeconds(remaining)}
              </div>
              <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                remaining
              </div>
            </div>
          </div>
          <p style={{ ...shellStyles.body, margin: 0 }}>{getLiveCue(selectedSkill.id, remaining)}</p>
        </div>

        <div style={{ ...shellStyles.buttonRow, justifyContent: 'center' }}>
          <PrimaryButton onClick={() => setRunning((current) => !current)}>
            {running ? 'Pause' : 'Start timer'}
          </PrimaryButton>
          <SecondaryButton onClick={() => beginSkill(selectedSkill.id)}>Restart</SecondaryButton>
          <SecondaryButton onClick={() => setSelectedSkillId(null)}>Pick another skill</SecondaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
