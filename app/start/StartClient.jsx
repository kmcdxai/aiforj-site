"use client";

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Card, EmotionCard, Tag } from '../components/ui';
import { emotionOptions, intensityLabels, timePreferences } from './emotionData';
import { getAllInterventions, getInterventions } from '../../data/interventions';
import { getMeasuredSessions, getSessions, rankInterventions } from '../../utils/sessionHistory';

const stepLabels = [
  "What's going on?",
  'How intense does it feel?',
  'How much time do you have?',
  'Your matched tools',
];

function tagVariant(modality = '') {
  const key = modality.toLowerCase();
  if (key.includes('cbt')) return 'cbt';
  if (key.includes('dbt')) return 'dbt';
  if (key.includes('act')) return 'act';
  if (key.includes('somatic') || key.includes('polyvagal')) return 'somatic';
  if (key.includes('behavioral')) return 'behavioral';
  return 'psychoed';
}

export default function StartClient() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedEmotionId, setSelectedEmotionId] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [timePref, setTimePref] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);

  const selectedEmotion = useMemo(
    () => emotionOptions.find((item) => item.id === selectedEmotionId),
    [selectedEmotionId]
  );

  const measuredSessions = useMemo(() => getMeasuredSessions(sessionHistory), [sessionHistory]);
  const progress = Math.min(100, ((step - 1) / 3) * 100);
  const recommendations = useMemo(() => {
    if (!selectedEmotion || !timePref) return [];
    const candidates = getInterventions(selectedEmotion.id, timePref)
      .filter((intervention) => !intervention.placeholder)
      .map((intervention) => ({
        ...intervention,
        emotionLabel: selectedEmotion.label,
        emotionEmoji: selectedEmotion.emoji,
      }));

    return rankInterventions(candidates, {
      sessions: measuredSessions,
      emotionId: selectedEmotion.id,
      timePreference: timePref,
      limit: candidates.length,
    });
  }, [measuredSessions, selectedEmotion, timePref]);

  const fallbackRecommendations = useMemo(() => {
    if (!selectedEmotion || !timePref || recommendations.length > 0) return [];

    const candidates = getAllInterventions()
      .filter((intervention) => intervention.emotionId === selectedEmotion.id)
      .map((intervention) => ({
        ...intervention,
        emotionLabel: selectedEmotion.label,
        emotionEmoji: selectedEmotion.emoji,
      }));

    return rankInterventions(candidates, {
      sessions: measuredSessions,
      emotionId: selectedEmotion.id,
      timePreference: timePref,
      limit: 3,
    });
  }, [measuredSessions, recommendations.length, selectedEmotion, timePref]);

  const displayedRecommendations = recommendations.length > 0 ? recommendations : fallbackRecommendations;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, showCrisis]);

  useEffect(() => {
    const syncSessions = () => setSessionHistory(getSessions());
    syncSessions();
    window.addEventListener('storage', syncSessions);
    window.addEventListener('focus', syncSessions);
    return () => {
      window.removeEventListener('storage', syncSessions);
      window.removeEventListener('focus', syncSessions);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emotionId = params.get('emotion');
    if (!emotionId || selectedEmotionId) return;
    const emotion = emotionOptions.find((item) => item.id === emotionId);
    if (!emotion) return;
    setSelectedEmotionId(emotionId);
    if (emotion.crisis) {
      setShowCrisis(true);
    } else {
      setStep(2);
    }
  }, [selectedEmotionId]);

  useEffect(() => {
    if (step !== 4 || !selectedEmotionId || !timePref) return;

    if (displayedRecommendations.length > 0) {
      displayedRecommendations.slice(0, 3).forEach((intervention) => {
        router.prefetch(
          `/intervention/${intervention.id}?emotion=${selectedEmotionId}&intensity=${intensity}&time=${timePref}`
        );
      });
      return;
    }

    router.prefetch('/techniques');
    router.prefetch('/companion');
  }, [displayedRecommendations, intensity, router, selectedEmotionId, step, timePref]);

  const handleEmotionSelect = (id) => {
    const emotion = emotionOptions.find((item) => item.id === id);
    setSelectedEmotionId(id);
    setIntensity(5);
    setTimePref(null);
    if (emotion?.crisis) {
      setShowCrisis(true);
      return;
    }
    setShowCrisis(false);
    setStep(2);
  };

  const continueFromCrisis = () => {
    setShowCrisis(false);
    setStep(2);
  };

  const handleBack = () => {
    if (showCrisis) {
      setShowCrisis(false);
      setSelectedEmotionId(null);
      setStep(1);
      return;
    }
    if (step === 2) {
      setStep(1);
      setSelectedEmotionId(null);
      setTimePref(null);
      return;
    }
    if (step === 3) {
      setStep(2);
      return;
    }
    if (step === 4) {
      setStep(3);
    }
  };

  const selectedTime = timePreferences.find((item) => item.id === timePref);

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: "'DM Sans', sans-serif", padding: '24px 0 72px' }}>
      <div className="container-wide" style={{ maxWidth: 960 }}>
        <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
            <Tag variant="act">Guided Check-In</Tag>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Private · no account · matched in under 30 seconds</span>
          </div>
          <p style={{ margin: 0, maxWidth: 760, fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 40px)", lineHeight: 1.2, color: 'var(--text-primary)' }}>
            Start with what is happening right now.
          </p>
          <p style={{ fontSize: 16, maxWidth: 640, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
            Pick what fits, choose how strong it feels, and get a tool that matches your moment.
          </p>
        </div>

        <Card hoverable={false} style={{ padding: 'clamp(22px, 4vw, 34px)' }}>
          <div style={{ display: 'grid', gap: 16, marginBottom: 28 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--text-muted)', marginBottom: 6 }}>
                  Step {Math.min(step, 4)} of 4
                </div>
                <h2 style={{ margin: 0 }}>{stepLabels[step - 1]}</h2>
              </div>
              {selectedEmotion && step > 1 && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 999, background: selectedEmotion.accentLight, color: selectedEmotion.accentDeep, fontWeight: 700, fontSize: 13 }}>
                  <span>{selectedEmotion.emoji}</span>
                  {selectedEmotion.label}
                </div>
              )}
            </div>
            <div className="progress" aria-label={`Progress ${progress}%`}>
              <div className="progress-fill" style={{ width: `${progress}%`, background: selectedEmotion?.accent || 'var(--sage)' }} />
            </div>
          </div>

          {showCrisis && selectedEmotion && (
            <section className="scale-in" style={{ padding: 24, borderRadius: 24, background: 'var(--surface-elevated)', border: `1.5px solid ${selectedEmotion.accent}`, boxShadow: 'var(--shadow-md)', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: 34 }}>{selectedEmotion.emoji}</span>
                <div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 3vw, 1.6rem)', margin: 0 }}>Before we continue</h2>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>If this is a crisis, real-time human support matters.</p>
                </div>
              </div>
              <p style={{ margin: '0 0 12px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                If you're in crisis or thinking about harming yourself, please reach out:
              </p>
              <ul style={{ margin: '0 0 20px 18px', color: 'var(--text-primary)', lineHeight: 1.8 }}>
                <li><strong>988 Suicide & Crisis Lifeline</strong> (call or text 988)</li>
                <li><strong>Crisis Text Line</strong> (text HOME to 741741)</li>
              </ul>
              <p style={{ margin: '0 0 20px', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                These are free, confidential, and available 24/7.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button onClick={continueFromCrisis} className="btn-primary" style={{ background: selectedEmotion.accentDeep }}>
                  Continue to tools →
                </button>
                <a href="https://988lifeline.org" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ color: selectedEmotion.accentDeep, borderColor: selectedEmotion.accent }}>
                  Get crisis support →
                </a>
              </div>
            </section>
          )}

          {step === 1 && !showCrisis && (
            <section className="fade-in">
              <h1 style={{ margin: '0 0 8px' }}>What's going on?</h1>
              <p style={{ margin: '0 0 24px', color: 'var(--text-secondary)' }}>
                No judgment. Just pick what fits closest right now.
              </p>
              <div className="emotion-grid">
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
            </section>
          )}

          {step === 2 && selectedEmotion && !showCrisis && (
            <section className="fade-in" style={{ display: 'grid', gap: 24 }}>
              <div>
                <h2 style={{ margin: '0 0 8px' }}>How intense does it feel?</h2>
                <p className="text-body-sm" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  This helps us match you to the right tool.
                </p>
              </div>
              <div style={{ display: 'grid', gap: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{selectedEmotion.description}</span>
                  <span style={{ padding: '8px 14px', borderRadius: 999, background: selectedEmotion.accentLight, color: selectedEmotion.accentDeep, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>
                    {intensity}/10
                  </span>
                </div>
                <input
                  aria-label="Intensity from 1 to 10"
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(event) => setIntensity(Number(event.target.value))}
                  className="slider"
                  style={{ accentColor: selectedEmotion.accent, '--sage-deep': selectedEmotion.accentDeep, '--sage': selectedEmotion.accent }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
                  {intensityLabels.map((item) => (
                    <div key={item.value} style={{ textAlign: item.value === 1 ? 'left' : item.value === 10 ? 'right' : 'center' }}>
                      <strong style={{ color: 'var(--text-secondary)' }}>{item.value}</strong> {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setStep(3)} className="btn-primary" style={{ background: selectedEmotion.accentDeep }}>
                  Next →
                </button>
              </div>
            </section>
          )}

          {step === 3 && selectedEmotion && (
            <section className="fade-in" style={{ display: 'grid', gap: 24 }}>
              <div>
                <h2 style={{ margin: '0 0 8px' }}>How much time do you have?</h2>
                <p className="text-body-sm" style={{ margin: 0, color: 'var(--text-secondary)' }}>
                  Pick what is realistic. A tiny reset still counts.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
                {timePreferences.map((item) => {
                  const isSelected = item.id === timePref;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTimePref(item.id)}
                      style={{
                        padding: '24px 18px',
                        borderRadius: 'var(--radius-lg)',
                        border: isSelected ? `2px solid ${selectedEmotion.accent}` : '1px solid var(--border)',
                        background: isSelected ? selectedEmotion.accentLight : 'var(--surface)',
                        color: 'var(--text-primary)',
                        textAlign: 'left',
                        cursor: 'pointer',
                        minHeight: 150,
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ fontSize: 28, marginBottom: 14 }}>{item.emoji}</div>
                      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, fontWeight: 600, marginBottom: 4 }}>{item.label} <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: selectedEmotion.accentDeep }}>({item.duration})</span></div>
                      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.description}</p>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => timePref && setStep(4)} disabled={!timePref} className="btn-primary" style={{ background: selectedEmotion.accentDeep }}>
                  See my tools →
                </button>
              </div>
            </section>
          )}

          {step === 4 && selectedEmotion && selectedTime && (
            <section className="fade-in" style={{ display: 'grid', gap: 22 }}>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 24, background: selectedEmotion.accentLight, display: 'grid', placeItems: 'center', fontSize: 30 }}>{selectedEmotion.emoji}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Recommended for right now</div>
                  <h2 style={{ margin: 0 }}>{selectedEmotion.label} · {intensity}/10 · {selectedTime.label}</h2>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gap: 8,
                padding: '16px 18px',
                borderRadius: 18,
                border: '1px solid var(--border)',
                background: 'color-mix(in srgb, var(--surface) 94%, white)',
              }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Tag variant={selectedEmotion.variant || 'act'}>For You, right now</Tag>
                  {measuredSessions.length > 0 ? (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                      Reordered privately using {measuredSessions.length} completed mood-shift session{measuredSessions.length !== 1 ? 's' : ''} on this device.
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>
                      AIForj will start personalizing after you complete a few tools on this device.
                    </span>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  We rank tools by fit for this feeling and whether similar tools actually helped you before. No session text or history leaves your device.
                </p>
              </div>

              {displayedRecommendations.length > 0 ? (
                <div style={{ display: 'grid', gap: 14 }}>
                  {displayedRecommendations.map((intervention, index) => (
                    <article
                      key={intervention.id}
                      style={{
                        display: 'grid',
                        gap: 14,
                        padding: '22px',
                        borderRadius: 22,
                        background: index === 0 ? selectedEmotion.accentLight : 'var(--surface)',
                        border: index === 0 ? `2px solid ${selectedEmotion.accent}` : '1px solid var(--border)',
                        boxShadow: index === 0 ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                          {index === 0 && <Tag variant="free">Recommended for you</Tag>}
                          {intervention.recommendationKind === 'history' && <Tag variant={selectedEmotion.variant || 'act'}>Because it helped before</Tag>}
                          {recommendations.length === 0 && <Tag variant={selectedEmotion.variant || 'act'}>Best available fit</Tag>}
                          <Tag variant={intervention.tier === 'premium' ? 'premium' : 'free'}>{intervention.tier}</Tag>
                        </div>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>{intervention.timeMinutes} min</span>
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 8px' }}>{intervention.name || intervention.title}</h3>
                        <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{intervention.description}</p>
                        <p style={{ margin: '10px 0 0', fontSize: 13, color: selectedEmotion.accentDeep, fontWeight: 700, lineHeight: 1.6 }}>
                          {intervention.recommendationReason}
                          {intervention.recommendationStats?.averageShift > 0 ? ` · Avg shift ${intervention.recommendationStats.averageShift > 0 ? '+' : ''}${intervention.recommendationStats.averageShift}` : ''}
                        </p>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                        {(intervention.modalities || [intervention.modality]).filter(Boolean).map((modality) => (
                          <Tag key={modality} variant={tagVariant(modality)}>{modality}</Tag>
                        ))}
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{intervention.interactionLabel}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{intervention.evidenceBase}</span>
                        <a
                          href={`/intervention/${intervention.id}?emotion=${selectedEmotion.id}&intensity=${intensity}&time=${timePref}`}
                          className="btn-primary"
                          style={{ background: selectedEmotion.accentDeep, textDecoration: 'none', padding: '10px 18px' }}
                        >
                          Start →
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <a href="/techniques" style={{ color: selectedEmotion.accentDeep, fontWeight: 700 }}>
                  Show all {selectedEmotion.shortLabel.toLowerCase()} tools →
                </a>
                {timePref !== 'quick' && (
                  <a href="/companion" className="btn-secondary" style={{ textDecoration: 'none', color: 'var(--amber-deep)', borderColor: 'var(--amber)' }}>
                    Continue with Talk to Forj Premium →
                  </a>
                )}
              </div>

              <div style={{
                display: 'grid',
                gap: 10,
                padding: '18px',
                borderRadius: 20,
                border: '1px solid var(--border)',
                background: 'color-mix(in srgb, var(--surface) 92%, white)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--text-muted)', marginBottom: 6 }}>
                      Mood Garden
                    </div>
                    <h3 style={{ margin: 0, fontSize: 18 }}>Track what actually helps you</h3>
                  </div>
                  <a href="/garden" className="btn-secondary" style={{ textDecoration: 'none', color: 'var(--ocean-deep)', borderColor: 'var(--ocean)' }}>
                    Open Garden →
                  </a>
                </div>
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  Completed tools and mood shifts can grow into a private progress landscape on this device, so the techniques that help stop disappearing into memory.
                </p>
              </div>
            </section>
          )}

          {step > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginTop: 30, borderTop: '1px solid var(--border)', paddingTop: 22 }}>
              <button type="button" onClick={handleBack} className="btn-ghost">
                ← Back
              </button>
              <Button onClick={() => { setStep(1); setSelectedEmotionId(null); setTimePref(null); setShowCrisis(false); }} variant="secondary">
                Start over
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
