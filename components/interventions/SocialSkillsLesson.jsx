"use client";

import { useMemo, useState } from 'react';
import { ChoiceCard, InterventionShell, PrimaryButton, StepDots, shellStyles } from './shared';

const ACCENT = '#6B98B8';
const TOPICS = {
  start: {
    title: 'Starting conversations',
    lesson: 'Use observation + curiosity. Comment on what is happening around you, then ask one simple question.',
    scripts: ['How do you know the host?', 'What brought you here?', 'That made me laugh. What was your favorite part?'],
    practice: 'Write one opener you could realistically use this week.',
  },
  deepen: {
    title: 'Deepening small talk',
    lesson: 'Use FORD: Family, Occupation, Recreation, Dreams. Move one layer deeper, not five.',
    scripts: ['What do you enjoy doing when work is over?', 'How did you get into that?', 'What are you looking forward to lately?'],
    practice: 'Write one follow-up question that feels natural for you.',
  },
  followup: {
    title: 'Following up after meeting someone',
    lesson: 'Follow up within 24-72 hours with something specific from the interaction.',
    scripts: ['Good meeting you yesterday. I kept thinking about what you said about...', 'Wanted to send that article I mentioned.'],
    practice: 'Draft a follow-up message you could send.',
  },
  askout: {
    title: 'Asking someone to hang out',
    lesson: 'Keep the invitation specific, low-pressure, and easy to answer.',
    scripts: ['Want to grab coffee next week?', 'I am going to the market Saturday if you want to join.', 'No pressure at all if not.'],
    practice: 'Write one invitation that feels believable for your life.',
  },
};

export default function SocialSkillsLesson({ onComplete }) {
  const [topic, setTopic] = useState('');
  const [practice, setPractice] = useState('');
  const current = useMemo(() => (topic ? TOPICS[topic] : null), [topic]);

  return (
    <InterventionShell maxWidth={760}>
      <div style={shellStyles.card}>
        <StepDots currentStep={current ? 2 : 1} totalSteps={2} accent={ACCENT} label="Social Skills Lesson" />
        <h2 style={shellStyles.heading}>What would help most?</h2>
        <div style={{ display: 'grid', gap: 10, marginTop: 24 }}>
          {Object.entries(TOPICS).map(([key, item]) => (
            <ChoiceCard key={key} selected={topic === key} accent={ACCENT} onClick={() => setTopic(key)}>
              {item.title}
            </ChoiceCard>
          ))}
        </div>
        {current ? (
          <>
            <div style={{ ...shellStyles.card, marginTop: 20, background: 'rgba(107, 152, 184, 0.08)' }}>
              <p style={{ ...shellStyles.body, margin: 0 }}>{current.lesson}</p>
              <ul style={{ margin: '12px 0 0 18px', lineHeight: 1.8 }}>
                {current.scripts.map((script) => <li key={script}>{script}</li>)}
              </ul>
            </div>
            <textarea
              value={practice}
              onChange={(event) => setPractice(event.target.value)}
              placeholder={current.practice}
              style={{ ...shellStyles.textarea, marginTop: 18, minHeight: 120 }}
            />
            <p style={{ ...shellStyles.body, marginTop: 14 }}>
              Social skills are skills, not personality traits. They are learnable and improvable.
            </p>
          </>
        ) : null}
        <div style={shellStyles.buttonRow}>
          <PrimaryButton accent={ACCENT} disabled={!current || !practice.trim()} onClick={onComplete}>Finish</PrimaryButton>
        </div>
      </div>
    </InterventionShell>
  );
}
