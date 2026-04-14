"use client";

import { useState, useCallback, useEffect } from 'react';

// --- EMOTION CHIPS ---
const EMOTION_OPTIONS = [
  'Sad', 'Hopeless', 'Worthless', 'Guilty', 'Empty',
  'Numb', 'Lonely', 'Exhausted', 'Ashamed', 'Irritable',
];

// --- COGNITIVE DISTORTIONS (DEPRESSION-SPECIFIC) ---
const DISTORTIONS = [
  {
    id: 'mental-filtering',
    name: 'Mental Filtering',
    definition: 'Focusing only on negatives while filtering out everything else.',
    example: '"I only remember the things that went wrong today."',
    icon: '\u{1F50D}',
  },
  {
    id: 'disqualifying-positives',
    name: 'Disqualifying Positives',
    definition: 'Rejecting positive experiences as if they don\u2019t count.',
    example: '"That compliment doesn\u2019t count, they were just being nice."',
    icon: '\u{1F6AB}',
  },
  {
    id: 'overgeneralization',
    name: 'Overgeneralization',
    definition: 'Seeing one negative event as a never-ending pattern of defeat.',
    example: '"I failed once, so I always fail."',
    icon: '\u{1F504}',
  },
  {
    id: 'fortune-telling',
    name: 'Fortune Telling',
    definition: 'Predicting things will turn out badly without evidence.',
    example: '"Nothing will ever get better."',
    icon: '\u{1F52E}',
  },
  {
    id: 'all-or-nothing',
    name: 'All-or-Nothing',
    definition: 'Seeing things in only two categories\u2014black or white, no middle ground.',
    example: '"If I can\u2019t do it perfectly, I shouldn\u2019t try."',
    icon: '\u{26AB}',
  },
  {
    id: 'labeling',
    name: 'Labeling',
    definition: 'Attaching a fixed, global label to yourself instead of describing what happened.',
    example: '"I\u2019m a failure" instead of "I made a mistake."',
    icon: '\u{1F3F7}\uFE0F',
  },
  {
    id: 'should-statements',
    name: 'Should Statements',
    definition: 'Rigid rules about how you or others ought to behave.',
    example: '"I should be over this by now."',
    icon: '\u{1F4CF}',
  },
  {
    id: 'magnification-minimization',
    name: 'Magnification / Minimization',
    definition: 'Enlarging the negative and shrinking the positive.',
    example: '"That mistake was huge, but the praise was nothing."',
    icon: '\u{1F50E}',
  },
  {
    id: 'emotional-reasoning',
    name: 'Emotional Reasoning',
    definition: 'Treating a feeling as proof of a fact.',
    example: '"I feel worthless, so I must be worthless."',
    icon: '\u{1F4AD}',
  },
  {
    id: 'personalization',
    name: 'Personalization',
    definition: 'Taking responsibility for things that are outside your control.',
    example: '"They\u2019re upset\u2014it must be something I did."',
    icon: '\u{1F3AF}',
  },
];

// --- EVIDENCE AGAINST HELPERS ---
const EVIDENCE_AGAINST_HELPERS = [
  'What evidence from the PAST contradicts this?',
  'What would change if I wasn\u2019t filtering out the positive?',
  'Is this a fact or a feeling being treated as a fact?',
  'What would I say to a friend thinking this?',
];

const STEP_LABELS = [
  'Situation',
  'Automatic Thought',
  'Emotions',
  'Distortions',
  'Evidence For',
  'Evidence Against',
  'Balanced Thought',
];

const TOTAL_STEPS = 7;

// --- MAIN COMPONENT ---
export default function DepressionThoughtRecord({ onComplete, emotion }) {
  const [step, setStep] = useState(1);
  const [fadeKey, setFadeKey] = useState(0);

  // Step 1 - Situation
  const [situation, setSituation] = useState('');

  // Step 2 - Automatic Thought
  const [automaticThought, setAutomaticThought] = useState('');

  // Step 3 - Emotions + Intensity
  const [selectedEmotions, setSelectedEmotions] = useState({});
  // { emotionName: intensity(0-100) }

  // Step 4 - Distortions
  const [selectedDistortions, setSelectedDistortions] = useState([]);

  // Step 5 - Evidence For
  const [evidenceFor, setEvidenceFor] = useState('');

  // Step 6 - Evidence Against
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [showHelpers, setShowHelpers] = useState(false);

  // Step 7 - Balanced Thought + Re-rate
  const [balancedThought, setBalancedThought] = useState('');
  const [reRatedEmotions, setReRatedEmotions] = useState({});

  // Completion
  const [isComplete, setIsComplete] = useState(false);

  // Fade in helpers on step 6
  useEffect(() => {
    if (step === 6) {
      const timer = setTimeout(() => setShowHelpers(true), 800);
      return () => clearTimeout(timer);
    }
    setShowHelpers(false);
  }, [step]);

  // Initialize re-rated emotions when entering step 7
  useEffect(() => {
    if (step === 7) {
      const initial = {};
      Object.keys(selectedEmotions).forEach(emo => {
        initial[emo] = selectedEmotions[emo];
      });
      setReRatedEmotions(initial);
    }
  }, [step]);

  const goToStep = useCallback((nextStep) => {
    setFadeKey(k => k + 1);
    setStep(nextStep);
  }, []);

  const toggleEmotion = useCallback((name) => {
    setSelectedEmotions(prev => {
      const next = { ...prev };
      if (next[name] !== undefined) {
        delete next[name];
      } else {
        next[name] = 50;
      }
      return next;
    });
  }, []);

  const setEmotionIntensity = useCallback((name, val) => {
    setSelectedEmotions(prev => ({ ...prev, [name]: Number(val) }));
  }, []);

  const setReRatedIntensity = useCallback((name, val) => {
    setReRatedEmotions(prev => ({ ...prev, [name]: Number(val) }));
  }, []);

  const toggleDistortion = useCallback((id) => {
    setSelectedDistortions(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  }, []);

  const handleComplete = useCallback(() => {
    const record = {
      situation,
      automaticThought,
      emotions: { ...selectedEmotions },
      emotionsAfter: { ...reRatedEmotions },
      distortions: selectedDistortions.map(id =>
        DISTORTIONS.find(d => d.id === id)?.name
      ).filter(Boolean),
      evidenceFor,
      evidenceAgainst,
      balancedThought,
      date: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem('depression_thought_records') || '[]'
      );
      existing.push(record);
      localStorage.setItem('depression_thought_records', JSON.stringify(existing));
    } catch (_) {
      // localStorage unavailable
    }

    setIsComplete(true);
  }, [
    situation, automaticThought, selectedEmotions, reRatedEmotions,
    selectedDistortions, evidenceFor, evidenceAgainst, balancedThought,
  ]);

  // --- Validation ---
  const canProceed = () => {
    switch (step) {
      case 1: return situation.trim().length > 0;
      case 2: return automaticThought.trim().length > 0;
      case 3: return Object.keys(selectedEmotions).length > 0;
      case 4: return selectedDistortions.length > 0;
      case 5: return evidenceFor.trim().length > 0;
      case 6: return evidenceAgainst.trim().length > 0;
      case 7: return balancedThought.trim().length > 0;
      default: return false;
    }
  };

  // --- Compute emotion shifts ---
  const getEmotionShifts = () => {
    return Object.keys(selectedEmotions).map(emo => ({
      name: emo,
      before: selectedEmotions[emo],
      after: reRatedEmotions[emo] ?? selectedEmotions[emo],
      shift: (selectedEmotions[emo]) - (reRatedEmotions[emo] ?? selectedEmotions[emo]),
    }));
  };

  // --- Distortion names for summary ---
  const getDistortionNames = () =>
    selectedDistortions
      .map(id => DISTORTIONS.find(d => d.id === id)?.name)
      .filter(Boolean);

  // --- PROGRESS BAR ---
  const ProgressBar = () => (
    <div style={styles.progressContainer}>
      <div style={styles.progressTrack}>
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
          <div key={s} style={{
            flex: 1,
            height: '100%',
            borderRadius: 4,
            background: s <= step
              ? 'var(--lavender, #9B8EC4)'
              : 'rgba(155,142,196,0.12)',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>
      <div style={styles.progressLabelRow}>
        <span style={styles.progressStepName}>{STEP_LABELS[step - 1]}</span>
        <span style={styles.progressLabel}>Step {step} of {TOTAL_STEPS}</span>
      </div>
    </div>
  );

  // --- NAV BUTTONS ---
  const NavButtons = ({ onNext, nextLabel, canGoNext, onBack }) => (
    <div style={styles.btnRow}>
      {onBack ? (
        <button onClick={onBack} style={styles.backBtn}>
          {'\u2190'} Back
        </button>
      ) : <div />}
      <button
        onClick={onNext}
        disabled={!canGoNext}
        style={{
          ...styles.primaryBtn,
          opacity: canGoNext ? 1 : 0.4,
          cursor: canGoNext ? 'pointer' : 'not-allowed',
        }}
      >
        {nextLabel || 'Next'} {'\u2192'}
      </button>
    </div>
  );

  // =============================================
  // STEP 1 — SITUATION
  // =============================================
  if (!isComplete && step === 1) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Situation</div>
          <h2 style={styles.heading}>
            What{'\u2019'}s happening right now?
          </h2>
          <p style={styles.subtext}>
            Describe the situation briefly. Just the facts{'\u2014'}what, where, when, who.
          </p>

          <textarea
            value={situation}
            onChange={e => setSituation(e.target.value)}
            placeholder="e.g., I'm lying in bed on a Sunday afternoon. I haven't left the house in two days and I just cancelled plans with a friend."
            rows={5}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--lavender, #9B8EC4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />

          <NavButtons
            onNext={() => goToStep(2)}
            canGoNext={canProceed()}
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 2 — AUTOMATIC THOUGHT
  // =============================================
  if (!isComplete && step === 2) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Automatic Thought</div>
          <h2 style={styles.heading}>
            What went through your mind?
          </h2>
          <p style={styles.subtext}>
            What{'\u2019'}s the thought that came with the sadness? Write it exactly as it appeared
            in your mind{'\u2014'}even if it feels harsh or irrational.
          </p>

          {/* Situation reminder */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Your situation</div>
            <div style={styles.reminderText}>{situation}</div>
          </div>

          <textarea
            value={automaticThought}
            onChange={e => setAutomaticThought(e.target.value)}
            placeholder='e.g., "I&apos;m always going to be like this. Nothing ever changes. I&apos;m broken."'
            rows={5}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--lavender, #9B8EC4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />

          <NavButtons
            onBack={() => goToStep(1)}
            onNext={() => goToStep(3)}
            canGoNext={canProceed()}
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 3 — EMOTION + INTENSITY
  // =============================================
  if (!isComplete && step === 3) {
    const emotionKeys = Object.keys(selectedEmotions);

    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Emotions</div>
          <h2 style={styles.heading}>
            What emotions are you feeling?
          </h2>
          <p style={styles.subtext}>
            Select all that apply, then rate the intensity of each one.
          </p>

          {/* Emotion chips */}
          <div style={styles.chipGrid}>
            {EMOTION_OPTIONS.map(emo => {
              const isSelected = selectedEmotions[emo] !== undefined;
              return (
                <button
                  key={emo}
                  onClick={() => toggleEmotion(emo)}
                  style={{
                    ...styles.emotionChip,
                    background: isSelected
                      ? 'rgba(155,142,196,0.12)'
                      : 'rgba(155,142,196,0.04)',
                    borderColor: isSelected
                      ? '#9B8EC4'
                      : 'rgba(155,142,196,0.15)',
                    color: isSelected
                      ? '#9B8EC4'
                      : 'var(--text-secondary, #666)',
                    fontWeight: isSelected ? 600 : 400,
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {emo}
                  {isSelected && (
                    <span style={styles.chipCheck}>{'\u2713'}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Intensity sliders for selected emotions */}
          {emotionKeys.length > 0 && (
            <div style={styles.intensitySection}>
              <div style={styles.intensitySectionLabel}>
                Rate the intensity of each emotion
              </div>
              {emotionKeys.map(emo => (
                <div key={emo} style={styles.intensityRow}>
                  <div style={styles.intensityEmotionName}>{emo}</div>
                  <div style={styles.sliderRow}>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedEmotions[emo]}
                      onChange={e => setEmotionIntensity(emo, e.target.value)}
                      style={styles.rangeInput}
                    />
                    <span style={styles.sliderValue}>
                      {selectedEmotions[emo]}%
                    </span>
                  </div>
                  <div style={styles.sliderHints}>
                    <span>Not at all</span>
                    <span>Extremely</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <NavButtons
            onBack={() => goToStep(2)}
            onNext={() => goToStep(4)}
            canGoNext={canProceed()}
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 4 — COGNITIVE DISTORTION SPOTTER
  // =============================================
  if (!isComplete && step === 4) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Distortion Spotter</div>
          <h2 style={styles.heading}>
            Spot the thinking traps
          </h2>
          <p style={styles.subtext}>
            Depression often uses predictable thinking patterns to keep you stuck.
            Read through these cards and tap any that match the thought you wrote.
          </p>

          {/* Thought reminder */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Your automatic thought</div>
            <div style={styles.reminderText}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </div>
          </div>

          {/* Scrollable distortion card deck */}
          <div style={styles.distortionDeck}>
            {DISTORTIONS.map((distortion, index) => {
              const isSelected = selectedDistortions.includes(distortion.id);
              return (
                <button
                  key={distortion.id}
                  onClick={() => toggleDistortion(distortion.id)}
                  style={{
                    ...styles.distortionCard,
                    borderColor: isSelected
                      ? '#9B8EC4'
                      : 'rgba(155,142,196,0.12)',
                    background: isSelected
                      ? 'rgba(155,142,196,0.08)'
                      : '#fff',
                    boxShadow: isSelected
                      ? '0 4px 20px rgba(155,142,196,0.2), inset 0 0 0 1.5px #9B8EC4'
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    animation: isSelected
                      ? 'dtrCardSelect 0.3s ease'
                      : 'none',
                  }}
                >
                  {/* Card header */}
                  <div style={styles.distortionCardHeader}>
                    <span style={styles.distortionIcon}>{distortion.icon}</span>
                    <div style={styles.distortionCardHeaderText}>
                      <span style={styles.distortionNumber}>
                        {index + 1} of {DISTORTIONS.length}
                      </span>
                      <span style={{
                        ...styles.distortionName,
                        color: isSelected ? '#9B8EC4' : 'var(--text-primary, #1a1a1a)',
                      }}>
                        {distortion.name}
                      </span>
                    </div>
                    {isSelected && (
                      <div style={styles.distortionCheckBadge}>
                        {'\u2713'}
                      </div>
                    )}
                  </div>

                  {/* Definition */}
                  <div style={styles.distortionDefinition}>
                    {distortion.definition}
                  </div>

                  {/* Example */}
                  <div style={styles.distortionExample}>
                    {distortion.example}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected count */}
          {selectedDistortions.length > 0 && (
            <div style={styles.selectedCount}>
              <span style={styles.selectedCountNumber}>
                {selectedDistortions.length}
              </span>
              {' '}distortion{selectedDistortions.length !== 1 ? 's' : ''} identified
            </div>
          )}

          <NavButtons
            onBack={() => goToStep(3)}
            onNext={() => goToStep(5)}
            canGoNext={canProceed()}
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 5 — EVIDENCE FOR
  // =============================================
  if (!isComplete && step === 5) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Evidence For</div>
          <h2 style={styles.heading}>
            What evidence supports this thought?
          </h2>
          <p style={styles.subtext}>
            This is the hardest part{'\u2014'}honestly listing what supports the thought.
            Stick to facts, not feelings.
          </p>

          {/* Thought reminder */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Your automatic thought</div>
            <div style={styles.reminderText}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </div>
          </div>

          {/* Helper prompt */}
          <div style={styles.helperBox}>
            <div style={styles.helperIcon}>{'\u{1F4A1}'}</div>
            <div style={styles.helperText}>
              What facts (not feelings) support this thought?
            </div>
          </div>

          <textarea
            value={evidenceFor}
            onChange={e => setEvidenceFor(e.target.value)}
            placeholder="e.g., I did cancel plans today. I have been spending a lot of time alone. I've felt this way for a few weeks."
            rows={6}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--lavender, #9B8EC4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />

          <NavButtons
            onBack={() => goToStep(4)}
            onNext={() => goToStep(6)}
            canGoNext={canProceed()}
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 6 — EVIDENCE AGAINST
  // =============================================
  if (!isComplete && step === 6) {
    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Evidence Against</div>
          <h2 style={styles.heading}>
            What evidence contradicts this thought?
          </h2>
          <p style={styles.subtext}>
            Now look for the counter-evidence. This part often takes a little more digging
            {'\u2014'}depression wants you to skip it.
          </p>

          {/* Thought reminder */}
          <div style={styles.thoughtReminder}>
            <div style={styles.reminderLabel}>Your automatic thought</div>
            <div style={styles.reminderText}>
              {'\u201C'}{automaticThought}{'\u201D'}
            </div>
          </div>

          {/* Helper prompts */}
          <div style={{
            ...styles.helpersContainer,
            opacity: showHelpers ? 1 : 0,
            transform: showHelpers ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
          }}>
            <div style={styles.helpersTitle}>
              Try asking yourself:
            </div>
            {EVIDENCE_AGAINST_HELPERS.map((helper, i) => (
              <div key={i} style={{
                ...styles.helperPromptItem,
                animationDelay: showHelpers ? `${i * 150}ms` : '0ms',
                animation: showHelpers ? 'dtrHelperSlide 0.4s ease both' : 'none',
              }}>
                <span style={styles.helperBullet}>{'\u25CB'}</span>
                <span style={styles.helperPromptText}>{helper}</span>
              </div>
            ))}
          </div>

          <textarea
            value={evidenceAgainst}
            onChange={e => setEvidenceAgainst(e.target.value)}
            placeholder="e.g., Last month I went to that dinner and had a good time. My friend texted to check on me yesterday. I've gotten through low periods before."
            rows={7}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--lavender, #9B8EC4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />

          <NavButtons
            onBack={() => goToStep(5)}
            onNext={() => goToStep(7)}
            canGoNext={canProceed()}
            nextLabel="Almost done"
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // STEP 7 — BALANCED THOUGHT + RE-RATE
  // =============================================
  if (!isComplete && step === 7) {
    const emotionKeys = Object.keys(selectedEmotions);

    return (
      <div style={styles.container}>
        <ProgressBar />
        <div key={fadeKey} style={{ ...styles.fadeIn, ...styles.content }}>
          <div style={styles.stepTag}>Balanced Thought</div>
          <h2 style={styles.heading}>
            Write a more balanced version of this thought
          </h2>
          <p style={styles.subtext}>
            You{'\u2019'}ve looked at the evidence from both sides. Now write a thought
            that{'\u2019'}s more complete{'\u2014'}one that holds both the hard parts and the
            counter-evidence.
          </p>

          {/* Side-by-side evidence summary */}
          <div style={styles.evidenceSummaryRow}>
            <div style={styles.evidenceSummaryCard}>
              <div style={styles.evidenceSummaryLabel}>Evidence for</div>
              <div style={styles.evidenceSummaryText}>{evidenceFor}</div>
            </div>
            <div style={styles.evidenceSummaryDivider} />
            <div style={styles.evidenceSummaryCard}>
              <div style={{
                ...styles.evidenceSummaryLabel,
                color: 'var(--lavender, #9B8EC4)',
              }}>
                Evidence against
              </div>
              <div style={styles.evidenceSummaryText}>{evidenceAgainst}</div>
            </div>
          </div>

          {/* Distortions spotted */}
          <div style={styles.distortionsSummary}>
            <div style={styles.distortionsSummaryLabel}>
              Thinking traps spotted:
            </div>
            <div style={styles.distortionTags}>
              {getDistortionNames().map(name => (
                <span key={name} style={styles.distortionTagSmall}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          <textarea
            value={balancedThought}
            onChange={e => setBalancedThought(e.target.value)}
            placeholder='e.g., "I&apos;m having a hard time right now, and that&apos;s real. But I&apos;ve gotten through hard times before, and some things in my life are actually going okay. Feeling low doesn&apos;t mean I am broken."'
            rows={5}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = 'var(--lavender, #9B8EC4)'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
          />

          {/* Re-rate emotions */}
          {emotionKeys.length > 0 && (
            <div style={styles.reRateSection}>
              <div style={styles.reRateSectionHeader}>
                <h3 style={styles.reRateHeading}>
                  Re-rate your emotions now
                </h3>
                <p style={styles.reRateSubtext}>
                  After writing this balanced thought, how intense do the emotions feel?
                </p>
              </div>

              {emotionKeys.map(emo => {
                const before = selectedEmotions[emo];
                const after = reRatedEmotions[emo] ?? before;
                const shift = before - after;
                return (
                  <div key={emo} style={styles.reRateRow}>
                    <div style={styles.reRateEmotionHeader}>
                      <span style={styles.reRateEmotionName}>{emo}</span>
                      <span style={{
                        ...styles.reRateShiftBadge,
                        color: shift > 0
                          ? '#6B98B8'
                          : shift < 0
                            ? '#C47E7E'
                            : 'var(--text-muted, #999)',
                      }}>
                        {shift > 0 ? '\u2193' : shift < 0 ? '\u2191' : '\u2194\uFE0F'}
                        {' '}{Math.abs(shift)}%
                      </span>
                    </div>
                    <div style={styles.reRateSliderRow}>
                      <span style={styles.reRateBeforeLabel}>
                        was {before}%
                      </span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={after}
                        onChange={e => setReRatedIntensity(emo, e.target.value)}
                        style={styles.rangeInput}
                      />
                      <span style={styles.sliderValue}>
                        {after}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <NavButtons
            onBack={() => goToStep(6)}
            onNext={handleComplete}
            canGoNext={canProceed()}
            nextLabel="See my record"
          />
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =============================================
  // COMPLETION — Counter-Evidence Card
  // =============================================
  if (isComplete) {
    const shifts = getEmotionShifts();
    const distortionNames = getDistortionNames();
    const totalShift = shifts.reduce((sum, s) => sum + s.shift, 0);
    const avgShift = shifts.length > 0 ? Math.round(totalShift / shifts.length) : 0;

    return (
      <div style={styles.container}>
        <div key="complete" style={{ ...styles.fadeIn, ...styles.content }}>

          {/* Completion header */}
          <div style={styles.completionHeader}>
            <div style={styles.completionIcon}>
              {'\u2728'}
            </div>
            <h2 style={{ ...styles.heading, textAlign: 'center' }}>
              Your Counter-Evidence Card
            </h2>
            <p style={{
              ...styles.subtext,
              textAlign: 'center',
              maxWidth: 420,
              margin: '0 auto 8px',
            }}>
              You challenged a depressive thought and found a more balanced perspective.
              This card is saved for you.
            </p>
          </div>

          {/* Counter-Evidence Card */}
          <div style={styles.summaryCard}>

            {/* Original Thought */}
            <div style={styles.summarySection}>
              <div style={styles.summarySectionLabel}>Original Thought</div>
              <div style={styles.summaryThought}>
                {'\u201C'}{automaticThought}{'\u201D'}
              </div>
            </div>

            {/* Divider */}
            <div style={styles.summaryDivider} />

            {/* Distortions Spotted */}
            <div style={styles.summarySection}>
              <div style={styles.summarySectionLabel}>Thinking Traps Spotted</div>
              <div style={styles.summaryDistortionTags}>
                {distortionNames.map(name => (
                  <span key={name} style={styles.summaryDistortionTag}>
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div style={styles.summaryDivider} />

            {/* Evidence Summary */}
            <div style={styles.summaryEvidenceRow}>
              <div style={styles.summaryEvidenceCol}>
                <div style={{
                  ...styles.summarySectionLabel,
                  color: 'var(--text-muted, #999)',
                }}>
                  Evidence For
                </div>
                <div style={styles.summaryEvidenceText}>
                  {evidenceFor}
                </div>
              </div>
              <div style={styles.summaryEvidenceArrow}>
                {'\u2194'}
              </div>
              <div style={styles.summaryEvidenceCol}>
                <div style={{
                  ...styles.summarySectionLabel,
                  color: 'var(--lavender, #9B8EC4)',
                }}>
                  Evidence Against
                </div>
                <div style={styles.summaryEvidenceText}>
                  {evidenceAgainst}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div style={styles.summaryDivider} />

            {/* Balanced Thought */}
            <div style={styles.summarySection}>
              <div style={{
                ...styles.summarySectionLabel,
                color: 'var(--lavender, #9B8EC4)',
              }}>
                Balanced Thought
              </div>
              <div style={styles.summaryBalancedThought}>
                {'\u201C'}{balancedThought}{'\u201D'}
              </div>
            </div>

            {/* Divider */}
            <div style={styles.summaryDivider} />

            {/* Emotion Shift */}
            <div style={styles.summarySection}>
              <div style={styles.summarySectionLabel}>Emotion Shift</div>
              <div style={styles.summaryEmotionShifts}>
                {shifts.map(s => (
                  <div key={s.name} style={styles.summaryEmotionRow}>
                    <span style={styles.summaryEmotionName}>{s.name}</span>
                    <div style={styles.summaryShiftBar}>
                      {/* Before marker */}
                      <div style={{
                        ...styles.summaryShiftMarker,
                        ...styles.summaryShiftMarkerBefore,
                        left: `${s.before}%`,
                      }}>
                        <div style={styles.summaryShiftDot} />
                        <span style={styles.summaryShiftLabel}>{s.before}%</span>
                      </div>
                      {/* After marker */}
                      <div style={{
                        ...styles.summaryShiftMarker,
                        ...styles.summaryShiftMarkerAfter,
                        left: `${s.after}%`,
                      }}>
                        <div style={{
                          ...styles.summaryShiftDot,
                          background: '#9B8EC4',
                        }} />
                        <span style={{
                          ...styles.summaryShiftLabel,
                          color: '#9B8EC4',
                        }}>{s.after}%</span>
                      </div>
                      {/* Shift line */}
                      <div style={{
                        position: 'absolute',
                        top: 4,
                        left: `${Math.min(s.before, s.after)}%`,
                        width: `${Math.abs(s.shift)}%`,
                        height: 2,
                        background: s.shift > 0
                          ? 'rgba(107,152,184,0.4)'
                          : 'rgba(196,126,126,0.4)',
                        borderRadius: 1,
                      }} />
                      {/* Track */}
                      <div style={styles.summaryShiftTrack} />
                    </div>
                    <span style={{
                      ...styles.summaryShiftAmount,
                      color: s.shift > 0
                        ? '#6B98B8'
                        : s.shift < 0
                          ? '#C47E7E'
                          : 'var(--text-muted, #999)',
                    }}>
                      {s.shift > 0 ? '\u2193' : s.shift < 0 ? '\u2191' : '\u2194\uFE0F'}
                      {Math.abs(s.shift)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Average shift banner */}
            {avgShift !== 0 && (
              <div style={styles.avgShiftBanner}>
                <span style={styles.avgShiftIcon}>
                  {avgShift > 0 ? '\u2193' : '\u2191'}
                </span>
                <span style={styles.avgShiftText}>
                  Average emotion intensity shifted by{' '}
                  <strong style={{
                    color: 'var(--lavender, #9B8EC4)',
                    fontFamily: "'JetBrains Mono', monospace",
                  }}>
                    {avgShift > 0 ? '-' : '+'}{Math.abs(avgShift)}%
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Situation context */}
          <div style={styles.contextRow}>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>Situation</span>
              <span style={styles.contextValue}>{situation}</span>
            </div>
            <div style={styles.contextItem}>
              <span style={styles.contextLabel}>Date</span>
              <span style={styles.contextValue}>
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Affirmation */}
          <div style={styles.affirmationBox}>
            <div style={styles.affirmationText}>
              You just did something hard. Challenging depressive thoughts takes real effort.
              This record is saved{'\u2014'}you can come back to it whenever the same thought returns.
            </div>
          </div>

          {/* Continue button */}
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={onComplete}
              style={styles.primaryBtn}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  return null;
}

// --- KEYFRAMES ---
const keyframes = `
  @keyframes dtrFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dtrCardSelect {
    0% { transform: scale(1); }
    40% { transform: scale(0.97); }
    100% { transform: scale(1); }
  }
  @keyframes dtrCompletePop {
    0% { opacity: 0; transform: scale(0.5); }
    60% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes dtrHelperSlide {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
  @keyframes dtrShimmer {
    0% { background-position: -200px 0; }
    100% { background-position: 200px 0; }
  }

  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    height: 6px;
    border-radius: 3px;
    background: rgba(155,142,196,0.15);
    outline: none;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--lavender, #9B8EC4);
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(155,142,196,0.35);
    transition: transform 0.15s ease;
  }
  input[type="range"]::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }
  input[type="range"]::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--lavender, #9B8EC4);
    cursor: pointer;
    border: 3px solid #fff;
    box-shadow: 0 2px 8px rgba(155,142,196,0.35);
  }
`;

// --- STYLES ---
const styles = {
  // Layout
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  content: {
    padding: '24px 24px 0',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  fadeIn: {
    animation: 'dtrFadeIn 0.45s cubic-bezier(0.16,1,0.3,1)',
  },

  // Progress bar
  progressContainer: {
    padding: '16px 24px 0',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  progressTrack: {
    display: 'flex',
    gap: 4,
    height: 5,
    marginBottom: 8,
  },
  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStepName: {
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--lavender, #9B8EC4)',
    fontWeight: 600,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.06em',
  },

  // Typography
  stepTag: {
    display: 'inline-block',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--lavender, #9B8EC4)',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 12,
    padding: '4px 10px',
    background: 'rgba(155,142,196,0.08)',
    borderRadius: 6,
  },
  heading: {
    fontFamily: "var(--font-heading, 'Fraunces'), serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.85rem)',
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 15,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.65,
    margin: '0 0 24px',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // Inputs
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(155,142,196,0.2)',
    borderRadius: 14,
    background: 'rgba(155,142,196,0.03)',
    fontSize: 15,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },

  // Thought reminder
  thoughtReminder: {
    padding: '14px 18px',
    background: 'rgba(155,142,196,0.05)',
    borderRadius: 12,
    borderLeft: '3px solid rgba(155,142,196,0.3)',
    marginBottom: 20,
  },
  reminderLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 4,
  },
  reminderText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.6,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    fontStyle: 'italic',
  },

  // Buttons
  btnRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 28,
    gap: 12,
  },
  primaryBtn: {
    padding: '14px 32px',
    borderRadius: 50,
    background: 'var(--lavender, #9B8EC4)',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "var(--font-heading, 'Fraunces'), serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
  },
  backBtn: {
    padding: '14px 20px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted, #999)',
    border: '1.5px solid rgba(155,142,196,0.15)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // --- Step 3: Emotion chips ---
  chipGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  emotionChip: {
    padding: '10px 18px',
    borderRadius: 24,
    border: '1.5px solid rgba(155,142,196,0.15)',
    background: 'rgba(155,142,196,0.04)',
    fontSize: 14,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    outline: 'none',
    whiteSpace: 'nowrap',
  },
  chipCheck: {
    fontSize: 12,
    fontWeight: 700,
    color: '#9B8EC4',
  },

  // Intensity sliders
  intensitySection: {
    marginTop: 4,
    padding: '20px 0 0',
    borderTop: '1px solid rgba(155,142,196,0.1)',
  },
  intensitySectionLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    marginBottom: 16,
  },
  intensityRow: {
    marginBottom: 20,
  },
  intensityEmotionName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#9B8EC4',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    marginBottom: 8,
    display: 'block',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  rangeInput: {
    flex: 1,
    cursor: 'pointer',
  },
  sliderValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--lavender, #9B8EC4)',
    minWidth: 48,
    textAlign: 'right',
  },
  sliderHints: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    marginTop: 4,
  },

  // --- Step 4: Distortion cards ---
  distortionDeck: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginBottom: 20,
    maxHeight: 480,
    overflowY: 'auto',
    paddingRight: 4,
  },
  distortionCard: {
    padding: '18px 20px',
    borderRadius: 16,
    border: '1.5px solid rgba(155,142,196,0.12)',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    textAlign: 'left',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },
  distortionCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  distortionIcon: {
    fontSize: 22,
    flexShrink: 0,
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(155,142,196,0.06)',
    borderRadius: 10,
  },
  distortionCardHeaderText: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minWidth: 0,
  },
  distortionNumber: {
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: 'var(--text-muted, #999)',
    marginBottom: 2,
  },
  distortionName: {
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading, 'Fraunces'), serif",
    lineHeight: 1.3,
  },
  distortionCheckBadge: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#9B8EC4',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
  },
  distortionDefinition: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.55,
    marginBottom: 8,
  },
  distortionExample: {
    fontSize: 13,
    color: 'var(--text-muted, #999)',
    fontStyle: 'italic',
    lineHeight: 1.5,
    padding: '8px 12px',
    background: 'rgba(155,142,196,0.04)',
    borderRadius: 8,
    borderLeft: '2px solid rgba(155,142,196,0.2)',
  },
  selectedCount: {
    fontSize: 14,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    color: 'var(--text-secondary, #666)',
    textAlign: 'center',
    padding: '10px 0',
  },
  selectedCountNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    color: '#9B8EC4',
    fontSize: 16,
  },

  // --- Step 5: Helper box ---
  helperBox: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    background: 'rgba(107,152,184,0.06)',
    borderRadius: 12,
    marginBottom: 16,
    border: '1px solid rgba(107,152,184,0.1)',
  },
  helperIcon: {
    fontSize: 18,
    flexShrink: 0,
    marginTop: 1,
  },
  helperText: {
    fontSize: 14,
    color: 'var(--ocean, #6B98B8)',
    fontWeight: 500,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    lineHeight: 1.5,
  },

  // --- Step 6: Evidence against helpers ---
  helpersContainer: {
    marginBottom: 20,
    padding: '16px 18px',
    background: 'rgba(107,152,184,0.04)',
    borderRadius: 14,
    border: '1px solid rgba(107,152,184,0.08)',
  },
  helpersTitle: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--ocean, #6B98B8)',
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 12,
  },
  helperPromptItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  helperBullet: {
    color: 'var(--lavender, #9B8EC4)',
    fontSize: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  helperPromptText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.55,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // --- Step 7: Evidence summary ---
  evidenceSummaryRow: {
    display: 'flex',
    gap: 0,
    marginBottom: 20,
    borderRadius: 14,
    border: '1px solid rgba(155,142,196,0.12)',
    overflow: 'hidden',
    background: 'rgba(155,142,196,0.02)',
  },
  evidenceSummaryCard: {
    flex: 1,
    padding: '14px 16px',
  },
  evidenceSummaryDivider: {
    width: 1,
    background: 'rgba(155,142,196,0.12)',
    alignSelf: 'stretch',
  },
  evidenceSummaryLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 6,
  },
  evidenceSummaryText: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.55,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // Distortions summary
  distortionsSummary: {
    marginBottom: 20,
    padding: '12px 16px',
    background: 'rgba(155,142,196,0.04)',
    borderRadius: 12,
  },
  distortionsSummaryLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted, #999)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    marginBottom: 8,
  },
  distortionTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  distortionTagSmall: {
    fontSize: 12,
    padding: '4px 10px',
    borderRadius: 16,
    background: 'rgba(155,142,196,0.1)',
    color: '#9B8EC4',
    fontWeight: 600,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    whiteSpace: 'nowrap',
  },

  // Re-rate section
  reRateSection: {
    marginTop: 32,
    padding: '24px 20px',
    background: 'rgba(155,142,196,0.04)',
    borderRadius: 16,
    border: '1px solid rgba(155,142,196,0.1)',
  },
  reRateSectionHeader: {
    marginBottom: 20,
  },
  reRateHeading: {
    fontFamily: "var(--font-heading, 'Fraunces'), serif",
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    margin: '0 0 6px',
  },
  reRateSubtext: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    margin: 0,
    lineHeight: 1.5,
  },
  reRateRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: '1px solid rgba(155,142,196,0.08)',
  },
  reRateEmotionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reRateEmotionName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#9B8EC4',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },
  reRateShiftBadge: {
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  reRateSliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  reRateBeforeLabel: {
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    minWidth: 52,
    flexShrink: 0,
  },

  // --- Completion screen ---
  completionHeader: {
    textAlign: 'center',
    marginBottom: 28,
  },
  completionIcon: {
    fontSize: 48,
    marginBottom: 16,
    animation: 'dtrCompletePop 0.5s cubic-bezier(0.16,1,0.3,1)',
  },

  // Summary card
  summaryCard: {
    background: '#fff',
    borderRadius: 20,
    border: '1px solid rgba(155,142,196,0.15)',
    boxShadow: '0 8px 32px rgba(155,142,196,0.1), 0 2px 8px rgba(0,0,0,0.03)',
    padding: '28px 24px',
    marginBottom: 24,
  },
  summarySection: {
    marginBottom: 4,
  },
  summarySectionLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    marginBottom: 8,
  },
  summaryThought: {
    fontSize: 16,
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.6,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    fontStyle: 'italic',
    padding: '12px 16px',
    background: 'rgba(0,0,0,0.02)',
    borderRadius: 12,
    borderLeft: '3px solid rgba(0,0,0,0.08)',
  },
  summaryDivider: {
    height: 1,
    background: 'rgba(155,142,196,0.1)',
    margin: '16px 0',
  },
  summaryDistortionTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  summaryDistortionTag: {
    fontSize: 13,
    padding: '6px 14px',
    borderRadius: 20,
    background: 'rgba(155,142,196,0.08)',
    color: '#9B8EC4',
    fontWeight: 600,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    whiteSpace: 'nowrap',
  },
  summaryBalancedThought: {
    fontSize: 16,
    color: '#9B8EC4',
    lineHeight: 1.6,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    fontStyle: 'italic',
    fontWeight: 500,
    padding: '12px 16px',
    background: 'rgba(155,142,196,0.05)',
    borderRadius: 12,
    borderLeft: '3px solid rgba(155,142,196,0.3)',
  },

  // Evidence summary in completion
  summaryEvidenceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  summaryEvidenceCol: {
    flex: 1,
  },
  summaryEvidenceArrow: {
    padding: '0 12px',
    color: 'rgba(155,142,196,0.4)',
    fontSize: 20,
    flexShrink: 0,
  },
  summaryEvidenceText: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.55,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // Emotion shift visualization
  summaryEmotionShifts: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  summaryEmotionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  summaryEmotionName: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    minWidth: 72,
    flexShrink: 0,
  },
  summaryShiftBar: {
    flex: 1,
    height: 10,
    position: 'relative',
    minWidth: 100,
  },
  summaryShiftTrack: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 2,
    background: 'rgba(155,142,196,0.12)',
    borderRadius: 1,
  },
  summaryShiftMarker: {
    position: 'absolute',
    top: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transform: 'translateX(-50%)',
  },
  summaryShiftMarkerBefore: {},
  summaryShiftMarkerAfter: {},
  summaryShiftDot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    background: 'rgba(155,142,196,0.3)',
    border: '2px solid #fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  summaryShiftLabel: {
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
    color: 'var(--text-muted, #999)',
    marginTop: 4,
  },
  summaryShiftAmount: {
    fontSize: 13,
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    minWidth: 48,
    textAlign: 'right',
    flexShrink: 0,
  },

  // Average shift banner
  avgShiftBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '14px 20px',
    background: 'rgba(155,142,196,0.06)',
    borderRadius: 12,
    marginTop: 12,
  },
  avgShiftIcon: {
    fontSize: 18,
    color: 'var(--lavender, #9B8EC4)',
  },
  avgShiftText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // Context row
  contextRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 16,
  },
  contextItem: {
    flex: 1,
    padding: '12px 16px',
    background: 'rgba(155,142,196,0.04)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  contextLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: 'var(--text-muted, #999)',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 600,
  },
  contextValue: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.5,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
  },

  // Affirmation box
  affirmationBox: {
    padding: '18px 20px',
    background: 'rgba(155,142,196,0.05)',
    borderRadius: 14,
    borderLeft: '3px solid rgba(155,142,196,0.25)',
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 14,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.7,
    fontFamily: "var(--font-body, 'DM Sans'), sans-serif",
    fontStyle: 'italic',
  },
};
