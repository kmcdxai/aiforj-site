"use client";

import { useMemo, useState } from 'react';
import { Button, Card, EmotionCard, Tag } from '../components/ui';
import { emotionOptions, contextOptions, timePreferences } from './emotionData';
import { getInterventions } from '../../data/interventions';

const stepLabels = [
  'Choose your emotion',
  'Measure intensity',
  'How much time do you have?',
  'Your tailored techniques',
];

export default function StartPage() {
  const [step, setStep] = useState(1);
  const [selectedEmotionId, setSelectedEmotionId] = useState(null);
  const [intensity, setIntensity] = useState(6);
  const [timePref, setTimePref] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);

  const selectedEmotion = useMemo(
    () => emotionOptions.find((item) => item.id === selectedEmotionId),
    [selectedEmotionId]
  );

  const completed = step > 1 || Boolean(selectedEmotionId);
  const progress = selectedEmotion?.crisis ? 100 : Math.min(100, ((step - 1) / 3) * 100);

  const handleEmotionSelect = (id) => {
    setSelectedEmotionId(id);
    setTimePref(null);
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
    } else if (step === 3 && timePref) {
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
      setTimePref(null);
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
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>How much time do you have?</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>We'll match you to techniques that fit.</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
                {timePreferences.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTimePref(item.id)}
                    style={{
                      padding: '22px 18px',
                      borderRadius: 18,
                      border: item.id === timePref ? '2px solid var(--sage)' : '1px solid rgba(45,42,38,0.1)',
                      background: item.id === timePref ? 'var(--sage-light)' : 'var(--surface)',
                      color: item.id === timePref ? 'var(--sage-deep)' : 'var(--text-primary)',
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: 110,
                      boxShadow: item.id === timePref ? 'var(--shadow-sm)' : 'none',
                      transition: 'all 200ms ease',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: item.id === timePref ? 'var(--sage-deep)' : 'var(--text-muted)', marginBottom: 4 }}>{item.duration}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.description}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && selectedEmotion && (() => {
            const tier = timePref || 'quick';
            const recommendations = getInterventions(selectedEmotion.id, tier);
            return (
              <div style={{ display: 'grid', gap: 24 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ width: 72, height: 72, borderRadius: 24, background: 'var(--sage-light)', display: 'grid', placeItems: 'center', fontSize: 28 }}>{selectedEmotion.emoji}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Your techniques</div>
                    <h3 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>{selectedEmotion.label} · {intensity}/10</h3>
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 4 }}>
                  <Tag variant={selectedEmotion.variant}>{selectedEmotion.label}</Tag>
                  <Tag variant="cbt">Intensity {intensity}</Tag>
                  <Tag variant="somatic">{timePreferences.find(t => t.id === tier)?.label || 'Quick'}</Tag>
                </div>

                {/* Intervention recommendation cards */}
                <div style={{ display: 'grid', gap: 14 }}>
                  {recommendations.map((intervention, idx) => (
                    <a
                      key={intervention.id}
                      href={`/intervention/${intervention.id}?emotion=${selectedEmotion.id}`}
                      style={{
                        display: 'flex',
                        gap: 16,
                        padding: '20px 22px',
                        borderRadius: 20,
                        background: idx === 0 ? 'var(--sage-light)' : 'var(--surface)',
                        border: idx === 0 ? '2px solid var(--sage)' : '1px solid rgba(45,42,38,0.1)',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'all 200ms',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {idx === 0 && (
                        <div style={{
                          position: 'absolute',
                          top: 10,
                          right: 14,
                          fontSize: 10,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.1em',
                          color: 'var(--sage-deep)',
                          background: 'rgba(122,158,126,0.15)',
                          padding: '3px 8px',
                          borderRadius: 6,
                        }}>
                          Best match
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <h4 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>{intervention.title}</h4>
                        </div>
                        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 8px' }}>{intervention.description}</p>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(122,158,126,0.1)', color: 'var(--sage-deep)' }}>{intervention.duration}</span>
                          <span style={{ fontSize: 12, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: 'rgba(155,142,196,0.1)', color: '#9B8EC4' }}>{intervention.modality}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', fontSize: 18, color: 'var(--text-muted)', flexShrink: 0 }}>{'\u2192'}</div>
                    </a>
                  ))}
                </div>

                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.75 }}>Pick the technique that feels right. Each one was selected for your specific emotion and time preference.</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <Button onClick={() => setStep(1)} variant="secondary">Start over</Button>
                </div>
              </div>
            );
          })()}

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
                disabled={step === 1 ? !selectedEmotionId : step === 3 ? !timePref : false}
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
