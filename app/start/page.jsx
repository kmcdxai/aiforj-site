"use client";

import { useMemo, useState } from 'react';
import { Button, Card, EmotionCard, Tag } from '../components/ui';
import { emotionOptions, contextOptions } from './emotionData';

const stepLabels = [
  'Choose your emotion',
  'Measure intensity',
  'Pick what feels true',
  'Get a tailored reset',
];

export default function StartPage() {
  const [step, setStep] = useState(1);
  const [selectedEmotionId, setSelectedEmotionId] = useState(null);
  const [intensity, setIntensity] = useState(6);
  const [context, setContext] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);

  const selectedEmotion = useMemo(
    () => emotionOptions.find((item) => item.id === selectedEmotionId),
    [selectedEmotionId]
  );

  const completed = step > 1 || Boolean(selectedEmotionId);
  const progress = selectedEmotion?.crisis ? 100 : Math.min(100, ((step - 1) / 3) * 100);

  const handleEmotionSelect = (id) => {
    setSelectedEmotionId(id);
    setContext(null);
    setIntensity(6);
    const emotion = emotionOptions.find((item) => item.id === id);
    if (emotion?.crisis) {
      setShowCrisis(true);
      return;
    }
    setShowCrisis(false);
    setStep(2);
  };

  const handleNext = () => {
    if (step === 1 && selectedEmotionId) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && context) {
      setStep(4);
    }
  };

  const handleBack = () => {
    if (showCrisis) {
      setShowCrisis(false);
      setSelectedEmotionId(null);
      setStep(1);
      return;
    }
    if (step === 4) {
      setStep(3);
      return;
    }
    if (step === 3) {
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(1);
      setSelectedEmotionId(null);
      setContext(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", padding: '24px 0' }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <Tag variant="act">Guided Check-In</Tag>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>4 minutes · private · evidence-based</span>
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, margin: 0 }}>Start with the feeling you have right now.</h1>
          <p style={{ fontSize: 16, maxWidth: 640, color: 'var(--text-secondary)', lineHeight: 1.8, margin: 0 }}>
            This flow helps you name your experience, check how intense it feels, and get a practical first step — without pressure or judgement.
          </p>
        </div>

        <Card>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 22 }}>
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.24em', color: 'var(--text-muted)', marginBottom: 6 }}>Step {Math.min(step, 4)} of 4</div>
              <h2 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.55rem)', margin: 0, color: 'var(--text-primary)' }}>{stepLabels[step - 1]}</h2>
            </div>
            <div style={{ flex: '1 1 160px', height: 12, borderRadius: 999, background: 'var(--parchment-deep)', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, var(--sage), var(--accent-sage))', transition: 'width 250ms ease' }} />
            </div>
          </div>

          {showCrisis && selectedEmotion && (
            <div style={{ padding: 24, borderRadius: 24, background: 'var(--surface-elevated)', border: '1px solid rgba(196, 157, 157, 0.2)', boxShadow: 'var(--shadow-sm)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ fontSize: 32 }}>🩹</span>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Immediate help needed</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your safety is the first priority.</div>
                </div>
              </div>
              <p style={{ margin: '0 0 16px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                If you are thinking about harming yourself or feel unsafe, call or text <strong style={{ color: 'var(--crisis)' }}>988</strong> now. Stay with someone you trust, and do not wait.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a href="tel:988" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', borderRadius: 18, background: 'var(--crisis)', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Call 988</a>
                <a href="sms:988" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 20px', borderRadius: 18, background: 'var(--interactive)', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>Text 988</a>
                <button onClick={() => setShowCrisis(false)} style={{ padding: '12px 20px', borderRadius: 18, background: 'transparent', border: '1px solid rgba(45,42,38,0.12)', color: 'var(--text-primary)', cursor: 'pointer' }}>Continue if safe</button>
              </div>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
              {emotionOptions.map((emotion) => (
                <EmotionCard
                  key={emotion.id}
                  emoji={emotion.emoji}
                  label={emotion.label}
                  isSelected={selectedEmotionId === emotion.id}
                  onClick={() => handleEmotionSelect(emotion.id)}
                />
              ))}
            </div>
          )}

          {step === 2 && selectedEmotion && (
            <div style={{ display: 'grid', gap: 22 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>How strong does this feel?</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{selectedEmotion.description}</div>
                </div>
                <div style={{ padding: '8px 14px', background: 'var(--surface)', borderRadius: 16, fontSize: 13, fontWeight: 700, color: 'var(--sage-deep)' }}>{intensity}/10</div>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--sage)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>Calm</span>
                <span>Intense</span>
              </div>
            </div>
          )}

          {step === 3 && selectedEmotion && (
            <div style={{ display: 'grid', gap: 22 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>What feels most true right now?</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Pick the phrase that fits your experience best.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                {contextOptions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setContext(item.id)}
                    style={{
                      padding: '18px 16px',
                      borderRadius: 18,
                      border: item.id === context ? '2px solid var(--sage)' : '1px solid rgba(45,42,38,0.1)',
                      background: item.id === context ? 'var(--sage-light)' : 'var(--surface)',
                      color: item.id === context ? 'var(--sage-deep)' : 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      minHeight: 96,
                      boxShadow: item.id === context ? 'var(--shadow-sm)' : 'none',
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>This helps Forj tailor the first step.</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && selectedEmotion && (
            <div style={{ display: 'grid', gap: 24 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--sage-light)', display: 'grid', placeItems: 'center', fontSize: 28 }}>{selectedEmotion.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Your reset</div>
                  <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>{selectedEmotion.label} · {intensity}/10</h3>
                </div>
              </div>
              <div style={{ padding: 24, borderRadius: 24, background: 'var(--surface)', border: '1px solid rgba(45,42,38,0.08)', boxShadow: 'var(--shadow-sm)' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{selectedEmotion.interventionDetails}</p>
              </div>
              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  <Tag variant={selectedEmotion.variant}>{selectedEmotion.label}</Tag>
                  <Tag variant="cbt">Intensity {intensity}</Tag>
                  {context && <Tag variant="somatic">{contextOptions.find((item) => item.id === context)?.label}</Tag>}
                </div>
                <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.75 }}>Use this as a first step. If you want a more structured reset, try the guided tools library or return to the homepage.</p>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <Button onClick={() => setStep(1)} variant="secondary">Start over</Button>
                <a href={`/intervention/${selectedEmotion.interventionSlug}?emotion=${selectedEmotion.id}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '12px 22px', borderRadius: 18, background: 'var(--interactive)', color: '#fff', textDecoration: 'none', fontWeight: 600 }}>Try this technique \u2192</a>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 28 }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                background: 'transparent',
                border: '1px solid rgba(45,42,38,0.12)',
                color: 'var(--text-secondary)',
                borderRadius: 18,
                padding: '12px 18px',
                cursor: 'pointer',
                minWidth: 120,
              }}
            >
              Back
            </button>
            {step < 4 && !showCrisis && (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 ? !selectedEmotionId : step === 3 ? !context : false}
                style={{
                  background: 'var(--sage-deep)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 18,
                  padding: '12px 22px',
                  cursor: step === 1 ? (selectedEmotionId ? 'pointer' : 'not-allowed') : 'pointer',
                  opacity: step === 1 && !selectedEmotionId ? 0.45 : 1,
                  minWidth: 140,
                }}
              >
                {step === 1 ? 'Continue' : step === 2 ? 'Next' : 'Finish'}
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
