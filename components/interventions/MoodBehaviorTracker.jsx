"use client";

import { useState, useEffect, useCallback } from 'react';

const POSITIVE_ACTIVITIES = [
  { id: 'exercised', label: 'Exercised', emoji: '\u{1F3C3}' },
  { id: 'went-outside', label: 'Went outside', emoji: '\u{1F333}' },
  { id: 'saw-someone', label: 'Saw someone I care about', emoji: '\u{1F496}' },
  { id: 'made-something', label: 'Made something', emoji: '\u{1F3A8}' },
  { id: 'meaningful-work', label: 'Worked on something meaningful', emoji: '\u{1F4CB}' },
  { id: 'helped-someone', label: 'Helped someone', emoji: '\u{1F91D}' },
  { id: 'learned-something', label: 'Learned something', emoji: '\u{1F4D6}' },
  { id: 'had-fun', label: 'Had fun', emoji: '\u{1F389}' },
  { id: 'self-care', label: 'Took care of my body', emoji: '\u{1F6C1}' },
];

const NEGATIVE_ACTIVITIES = [
  { id: 'stayed-in', label: 'Stayed in / alone', emoji: '\u{1F6CB}' },
  { id: 'scrolled-social', label: 'Scrolled social media 1hr+', emoji: '\u{1F4F1}' },
  { id: 'skipped-meals', label: 'Skipped meals', emoji: '\u{1F372}' },
  { id: 'bad-sleep', label: 'Slept too much / too little', emoji: '\u{1F634}' },
];

const ALL_ACTIVITIES = [...POSITIVE_ACTIVITIES, ...NEGATIVE_ACTIVITIES];

const STORAGE_KEY = 'mood_behavior_log';

function getTodayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {
    // localStorage unavailable
  }
  return [];
}

function saveLog(log) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch (_) {
    // localStorage unavailable
  }
}

function computeCorrelations(log) {
  if (log.length < 3) return null;

  const activityStats = {};

  ALL_ACTIVITIES.forEach(act => {
    const daysWithActivity = log.filter(entry =>
      entry.activities && entry.activities.includes(act.id)
    );
    const daysWithoutActivity = log.filter(entry =>
      !entry.activities || !entry.activities.includes(act.id)
    );

    if (daysWithActivity.length === 0) return;

    const avgMoodWith = daysWithActivity.reduce((sum, e) => sum + e.mood, 0) / daysWithActivity.length;
    const avgMoodWithout = daysWithoutActivity.length > 0
      ? daysWithoutActivity.reduce((sum, e) => sum + e.mood, 0) / daysWithoutActivity.length
      : null;

    activityStats[act.id] = {
      id: act.id,
      label: act.label,
      emoji: act.emoji,
      daysCount: daysWithActivity.length,
      avgMood: Math.round(avgMoodWith * 10) / 10,
      avgMoodWithout: avgMoodWithout !== null ? Math.round(avgMoodWithout * 10) / 10 : null,
      difference: avgMoodWithout !== null ? Math.round((avgMoodWith - avgMoodWithout) * 10) / 10 : null,
      isPositiveCategory: POSITIVE_ACTIVITIES.some(p => p.id === act.id),
    };
  });

  const stats = Object.values(activityStats);
  if (stats.length === 0) return null;

  const withDifference = stats.filter(s => s.difference !== null);

  let highest = null;
  let lowest = null;

  if (withDifference.length > 0) {
    highest = withDifference.reduce((best, s) => s.difference > best.difference ? s : best, withDifference[0]);
    lowest = withDifference.reduce((worst, s) => s.difference < worst.difference ? s : worst, withDifference[0]);
  }

  const overallAvgMood = Math.round((log.reduce((sum, e) => sum + e.mood, 0) / log.length) * 10) / 10;

  return {
    stats: stats.sort((a, b) => b.avgMood - a.avgMood),
    highest,
    lowest,
    totalEntries: log.length,
    overallAvgMood,
  };
}


export default function MoodBehaviorTracker({ onComplete, emotion }) {
  const [step, setStep] = useState(0);
  // 0 = intro
  // 1 = mood rating
  // 2 = activity selection
  // 3 = optional note
  // 4 = saved + insights / completion

  const [mood, setMood] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [note, setNote] = useState('');
  const [log, setLog] = useState([]);
  const [correlations, setCorrelations] = useState(null);
  const [alreadyLoggedToday, setAlreadyLoggedToday] = useState(false);
  const [animateIn, setAnimateIn] = useState(true);
  const [barAnimated, setBarAnimated] = useState(false);

  useEffect(() => {
    const existing = loadLog();
    setLog(existing);

    const today = getTodayString();
    const todayEntry = existing.find(e => e.date === today);
    if (todayEntry) {
      setAlreadyLoggedToday(true);
      setMood(todayEntry.mood);
      setSelectedActivities(todayEntry.activities || []);
      setNote(todayEntry.note || '');
    }

    if (existing.length >= 3) {
      setCorrelations(computeCorrelations(existing));
    }
  }, []);

  const transitionTo = useCallback((nextStep) => {
    setAnimateIn(false);
    setTimeout(() => {
      setStep(nextStep);
      setAnimateIn(true);
    }, 200);
  }, []);

  const handleMoodSelect = useCallback((value) => {
    setMood(value);
  }, []);

  const handleActivityToggle = useCallback((actId) => {
    setSelectedActivities(prev =>
      prev.includes(actId)
        ? prev.filter(id => id !== actId)
        : [...prev, actId]
    );
  }, []);

  const handleSave = useCallback(() => {
    const today = getTodayString();
    const entry = {
      date: today,
      mood,
      activities: selectedActivities,
      note: note.trim() || '',
    };

    const existing = loadLog();
    const existingIndex = existing.findIndex(e => e.date === today);

    if (existingIndex >= 0) {
      existing[existingIndex] = entry;
    } else {
      existing.push(entry);
    }

    saveLog(existing);
    setLog(existing);

    if (existing.length >= 3) {
      setCorrelations(computeCorrelations(existing));
    }

    transitionTo(4);
    setTimeout(() => setBarAnimated(true), 400);
  }, [mood, selectedActivities, note, transitionTo]);

  const getMoodColor = useCallback((value) => {
    if (value <= 3) return '#C17A6E';
    if (value <= 5) return '#D4A843';
    if (value <= 7) return '#8BA888';
    return '#6B98B8';
  }, []);

  const getMoodLabel = useCallback((value) => {
    if (value <= 2) return 'Really low';
    if (value <= 4) return 'Below average';
    if (value <= 6) return 'Middle ground';
    if (value <= 8) return 'Pretty good';
    return 'Great';
  }, []);

  // --- INTRO ---
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <div style={{
          ...styles.fadeIn,
          textAlign: 'center',
          padding: '48px 24px',
          maxWidth: 540,
          margin: '0 auto',
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <div style={styles.iconRow}>
            <span style={styles.introIcon}>{'\u{1F4CA}'}</span>
            <span style={styles.introIconSmall}>{'\u{1F517}'}</span>
          </div>

          <div style={styles.modalityTags}>
            <span style={{ ...styles.modalityTag, background: 'rgba(107,152,184,0.1)', color: '#6B98B8' }}>
              CBT
            </span>
            <span style={{ ...styles.modalityTag, background: 'rgba(212,168,67,0.1)', color: '#D4A843' }}>
              Behavioral
            </span>
          </div>

          <h2 style={styles.heading}>
            Mood{'\u2013'}Behavior Connection Tracker
          </h2>
          <p style={styles.subtext}>
            Let{'\u2019'}s find the connection between what you <strong style={{ color: '#D4A843' }}>DO</strong> and how you <strong style={{ color: '#6B98B8' }}>FEEL</strong>.
          </p>
          <p style={{
            ...styles.subtext,
            fontSize: 14,
            color: 'var(--text-muted, #999)',
            marginBottom: 32,
          }}>
            A 30-second daily check-in that reveals the hidden patterns between your activities and your mood.
          </p>

          {alreadyLoggedToday && (
            <div style={styles.alreadyLoggedBanner}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600 }}>
                {'\u2713'} Already logged today
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted, #999)' }}>
                You can update your entry or skip to insights.
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <button onClick={() => transitionTo(1)} style={styles.primaryBtn}>
              {alreadyLoggedToday ? 'Update today\u2019s check-in' : 'Start check-in'} {'\u2192'}
            </button>
            {log.length >= 3 && (
              <button
                onClick={() => { transitionTo(4); setTimeout(() => setBarAnimated(true), 400); }}
                style={styles.secondaryBtn}
              >
                Skip to insights {'\u2192'}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 1: MOOD RATING ---
  if (step === 1) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <ProgressBar current={1} total={3} />
        <div style={{
          ...styles.content,
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <div style={styles.stepTag}>Mood</div>
          <h2 style={styles.heading}>
            How are you feeling right now?
          </h2>
          <p style={styles.subtext}>
            Rate your overall mood today on a scale of 1 to 10. Don{'\u2019'}t overthink it {'\u2014'} go with your gut.
          </p>

          {/* Mood circles */}
          <div style={styles.moodGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(value => {
              const isSelected = mood === value;
              const color = getMoodColor(value);
              return (
                <button
                  key={value}
                  onClick={() => handleMoodSelect(value)}
                  style={{
                    ...styles.moodCircle,
                    background: isSelected ? color : 'transparent',
                    borderColor: isSelected ? color : 'rgba(107,152,184,0.2)',
                    color: isSelected ? '#fff' : 'var(--text-secondary, #666)',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected
                      ? `0 4px 16px ${color}44`
                      : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={styles.moodNumber}>{value}</span>
                </button>
              );
            })}
          </div>

          {/* Mood scale labels */}
          <div style={styles.moodScale}>
            <span style={styles.moodScaleLabel}>Low</span>
            <span style={styles.moodScaleLabel}>High</span>
          </div>

          {/* Selected mood feedback */}
          {mood !== null && (
            <div style={{
              ...styles.moodFeedback,
              animation: 'mbtFadeIn 0.3s ease',
            }}>
              <span style={{
                ...styles.moodFeedbackValue,
                color: getMoodColor(mood),
              }}>
                {mood}/10
              </span>
              <span style={styles.moodFeedbackLabel}>
                {getMoodLabel(mood)}
              </span>
            </div>
          )}

          <div style={styles.btnRow}>
            <button onClick={() => transitionTo(0)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => transitionTo(2)}
              disabled={mood === null}
              style={{
                ...styles.primaryBtn,
                opacity: mood !== null ? 1 : 0.4,
                cursor: mood !== null ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 2: ACTIVITY CHECKBOXES ---
  if (step === 2) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <ProgressBar current={2} total={3} />
        <div style={{
          ...styles.content,
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <div style={styles.stepTag}>Activities</div>
          <h2 style={styles.heading}>
            What did you do today?
          </h2>
          <p style={styles.subtext}>
            Select everything that applies. This helps us find which activities affect your mood.
          </p>

          {/* Positive activities */}
          <div style={styles.activitySectionLabel}>
            <span style={{ color: '#8BA888' }}>{'\u25CF'}</span> Engagement activities
          </div>
          <div style={styles.activityGrid}>
            {POSITIVE_ACTIVITIES.map(act => {
              const isChecked = selectedActivities.includes(act.id);
              return (
                <button
                  key={act.id}
                  onClick={() => handleActivityToggle(act.id)}
                  style={{
                    ...styles.activityChip,
                    background: isChecked ? 'rgba(139,168,136,0.12)' : 'var(--surface-elevated, #fff)',
                    borderColor: isChecked ? 'rgba(139,168,136,0.4)' : 'var(--border, rgba(107,152,184,0.12))',
                  }}
                >
                  <span style={styles.activityCheckbox}>
                    {isChecked ? (
                      <span style={styles.checkboxChecked}>{'\u2713'}</span>
                    ) : (
                      <span style={styles.checkboxEmpty} />
                    )}
                  </span>
                  <span style={styles.activityEmoji}>{act.emoji}</span>
                  <span style={{
                    ...styles.activityLabel,
                    color: isChecked ? 'var(--text-primary, #1a1a1a)' : 'var(--text-secondary, #666)',
                    fontWeight: isChecked ? 600 : 400,
                  }}>
                    {act.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Negative activities */}
          <div style={{ ...styles.activitySectionLabel, marginTop: 24 }}>
            <span style={{ color: '#C17A6E' }}>{'\u25CF'}</span> Withdrawal activities
          </div>
          <div style={styles.activityGrid}>
            {NEGATIVE_ACTIVITIES.map(act => {
              const isChecked = selectedActivities.includes(act.id);
              return (
                <button
                  key={act.id}
                  onClick={() => handleActivityToggle(act.id)}
                  style={{
                    ...styles.activityChip,
                    background: isChecked ? 'rgba(193,122,110,0.1)' : 'var(--surface-elevated, #fff)',
                    borderColor: isChecked ? 'rgba(193,122,110,0.35)' : 'var(--border, rgba(107,152,184,0.12))',
                  }}
                >
                  <span style={styles.activityCheckbox}>
                    {isChecked ? (
                      <span style={{ ...styles.checkboxChecked, background: '#C17A6E' }}>{'\u2713'}</span>
                    ) : (
                      <span style={styles.checkboxEmpty} />
                    )}
                  </span>
                  <span style={styles.activityEmoji}>{act.emoji}</span>
                  <span style={{
                    ...styles.activityLabel,
                    color: isChecked ? 'var(--text-primary, #1a1a1a)' : 'var(--text-secondary, #666)',
                    fontWeight: isChecked ? 600 : 400,
                  }}>
                    {act.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected count */}
          <div style={styles.selectedCount}>
            <span style={styles.selectedCountNumber}>{selectedActivities.length}</span>
            <span style={styles.selectedCountLabel}>
              {selectedActivities.length === 1 ? 'activity' : 'activities'} selected
            </span>
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => transitionTo(1)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => transitionTo(3)}
              disabled={selectedActivities.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: selectedActivities.length > 0 ? 1 : 0.4,
                cursor: selectedActivities.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 3: OPTIONAL NOTE ---
  if (step === 3) {
    return (
      <div style={styles.container}>
        <style>{keyframes}</style>
        <ProgressBar current={3} total={3} />
        <div style={{
          ...styles.content,
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}>
          <div style={styles.stepTag}>Note</div>
          <h2 style={styles.heading}>
            Anything else about today?
          </h2>
          <p style={styles.subtext}>
            This is optional. Even a word or two can help you spot patterns later.
          </p>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Anything else about today?"
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = '#6B98B8'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />

          {/* Summary preview */}
          <div style={styles.summaryPreview}>
            <div style={styles.summaryLabel}>Today{'\u2019'}s entry preview</div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryKey}>Mood</span>
              <span style={{
                ...styles.summaryValue,
                color: getMoodColor(mood),
              }}>
                {mood}/10
              </span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryKey}>Activities</span>
              <span style={styles.summaryValue}>
                {selectedActivities.length}
              </span>
            </div>
            <div style={styles.summaryActivities}>
              {selectedActivities.map(actId => {
                const act = ALL_ACTIVITIES.find(a => a.id === actId);
                return act ? (
                  <span key={actId} style={styles.summaryPill}>
                    {act.emoji} {act.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          <div style={styles.btnRow}>
            <button onClick={() => transitionTo(2)} style={styles.backBtn}>
              {'\u2190'} Back
            </button>
            <button onClick={handleSave} style={styles.primaryBtn}>
              Save check-in {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STEP 4: INSIGHTS + COMPLETION ---
  const hasInsights = correlations !== null && correlations.stats.length > 0;
  const maxAvgMood = hasInsights ? Math.max(...correlations.stats.map(s => s.avgMood)) : 10;

  return (
    <div style={styles.container}>
      <style>{keyframes}</style>
      <div style={{
        ...styles.content,
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
      }}>
        {/* Saved confirmation */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 44,
            marginBottom: 12,
            animation: 'mbtPop 0.5s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {'\u2713'}
          </div>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>
            Check-in saved
          </h2>
          <div style={styles.savedMoodBadge}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 20,
              fontWeight: 700,
              color: getMoodColor(mood),
            }}>
              {mood}/10
            </span>
            <span style={{
              fontSize: 13,
              color: 'var(--text-muted, #999)',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {getMoodLabel(mood)}
            </span>
          </div>
        </div>

        {/* Insights section */}
        {hasInsights ? (
          <div style={styles.insightsSection}>
            {/* Overall stats bar */}
            <div style={styles.statsBar}>
              <div style={styles.statItem}>
                <span style={styles.statValue}>{correlations.totalEntries}</span>
                <span style={styles.statLabel}>entries</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>{correlations.overallAvgMood}</span>
                <span style={styles.statLabel}>avg mood</span>
              </div>
              <div style={styles.statDivider} />
              <div style={styles.statItem}>
                <span style={styles.statValue}>{correlations.stats.length}</span>
                <span style={styles.statLabel}>tracked</span>
              </div>
            </div>

            {/* Key insight cards */}
            {correlations.highest && correlations.highest.difference > 0 && (
              <div style={styles.insightCardPositive}>
                <div style={styles.insightIcon}>{'\u2191'}</div>
                <div style={styles.insightContent}>
                  <div style={styles.insightLabel}>Mood booster</div>
                  <p style={styles.insightText}>
                    Your mood is{' '}
                    <strong style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#6B98B8',
                      fontSize: 16,
                    }}>
                      {correlations.highest.difference > 0 ? '+' : ''}{correlations.highest.difference}
                    </strong>
                    {' '}points higher on days you{' '}
                    <strong>{correlations.highest.label.toLowerCase()}</strong>
                  </p>
                </div>
              </div>
            )}

            {correlations.lowest && correlations.lowest.difference < 0 && (
              <div style={styles.insightCardNegative}>
                <div style={{ ...styles.insightIcon, color: '#C17A6E', background: 'rgba(193,122,110,0.1)' }}>
                  {'\u2193'}
                </div>
                <div style={styles.insightContent}>
                  <div style={{ ...styles.insightLabel, color: '#C17A6E' }}>Mood pattern</div>
                  <p style={styles.insightText}>
                    Your mood is{' '}
                    <strong style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: '#C17A6E',
                      fontSize: 16,
                    }}>
                      {correlations.lowest.difference}
                    </strong>
                    {' '}points lower on days you{' '}
                    <strong>{correlations.lowest.label.toLowerCase()}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Bar chart */}
            <div style={styles.chartSection}>
              <h3 style={styles.chartTitle}>
                Activity {'\u2194'} Mood Correlation
              </h3>
              <div style={styles.chartSubtitle}>
                Average mood on days you did each activity
              </div>

              <div style={styles.chartContainer}>
                {correlations.stats.map((stat, index) => {
                  const barWidth = maxAvgMood > 0 ? (stat.avgMood / 10) * 100 : 0;
                  const isPositive = stat.isPositiveCategory;
                  const barColor = isPositive ? '#6B98B8' : '#D4A843';

                  return (
                    <div key={stat.id} style={styles.chartRow}>
                      <div style={styles.chartLabel}>
                        <span style={styles.chartEmoji}>{stat.emoji}</span>
                        <span style={styles.chartActivityName}>{stat.label}</span>
                      </div>
                      <div style={styles.chartBarTrack}>
                        <div style={{
                          ...styles.chartBar,
                          width: barAnimated ? `${barWidth}%` : '0%',
                          background: barColor,
                          transitionDelay: `${index * 80}ms`,
                        }} />
                      </div>
                      <div style={styles.chartValue}>
                        {stat.avgMood}
                      </div>
                      <div style={styles.chartDays}>
                        {stat.daysCount}d
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Chart legend */}
              <div style={styles.chartLegend}>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: '#6B98B8' }} />
                  <span style={styles.legendText}>Engagement</span>
                </div>
                <div style={styles.legendItem}>
                  <span style={{ ...styles.legendDot, background: '#D4A843' }} />
                  <span style={styles.legendText}>Withdrawal</span>
                </div>
              </div>
            </div>

            {/* Difference table */}
            {correlations.stats.some(s => s.difference !== null) && (
              <div style={styles.diffSection}>
                <h3 style={styles.chartTitle}>
                  Mood Difference: With vs Without
                </h3>
                <div style={styles.chartSubtitle}>
                  How much each activity shifts your mood
                </div>
                <div style={styles.diffContainer}>
                  {correlations.stats
                    .filter(s => s.difference !== null)
                    .sort((a, b) => b.difference - a.difference)
                    .map(stat => {
                      const isUp = stat.difference > 0;
                      const isDown = stat.difference < 0;
                      const absDiff = Math.abs(stat.difference);
                      const maxDiff = Math.max(
                        ...correlations.stats
                          .filter(s => s.difference !== null)
                          .map(s => Math.abs(s.difference))
                      );
                      const barPct = maxDiff > 0 ? (absDiff / maxDiff) * 100 : 0;

                      return (
                        <div key={stat.id} style={styles.diffRow}>
                          <div style={styles.diffLabel}>
                            <span style={styles.chartEmoji}>{stat.emoji}</span>
                            <span style={styles.diffName}>{stat.label}</span>
                          </div>
                          <div style={styles.diffBarArea}>
                            {isDown && (
                              <div style={styles.diffBarNegWrap}>
                                <div style={{
                                  ...styles.diffBarNeg,
                                  width: barAnimated ? `${barPct}%` : '0%',
                                }} />
                              </div>
                            )}
                            <div style={styles.diffZeroLine} />
                            {isUp && (
                              <div style={styles.diffBarPosWrap}>
                                <div style={{
                                  ...styles.diffBarPos,
                                  width: barAnimated ? `${barPct}%` : '0%',
                                }} />
                              </div>
                            )}
                          </div>
                          <div style={{
                            ...styles.diffValue,
                            color: isUp ? '#6B98B8' : isDown ? '#C17A6E' : 'var(--text-muted, #999)',
                          }}>
                            {isUp ? '+' : ''}{stat.difference}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Not enough data
          <div style={styles.notEnoughData}>
            <div style={styles.notEnoughIcon}>{'\u{1F331}'}</div>
            <h3 style={styles.notEnoughTitle}>Patterns take time</h3>
            <p style={styles.notEnoughText}>
              Come back tomorrow to start seeing patterns. Insight takes a few data points.
            </p>
            <div style={styles.entryCount}>
              <span style={styles.entryCountNumber}>{log.length}</span>
              <span style={styles.entryCountLabel}>of 3 entries needed</span>
            </div>
            <div style={styles.entryProgress}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{
                  ...styles.entryDot,
                  background: i <= log.length ? '#D4A843' : 'rgba(212,168,67,0.2)',
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Completion message */}
        <div style={styles.completionCard}>
          <p style={styles.completionText}>
            Check in daily {'\u2014'} even 30 seconds is enough. After a week, the patterns become clear.
          </p>
          <div style={styles.completionMeta}>
            <span style={styles.completionMetaItem}>
              {'\u{23F1}'} ~30 sec/day
            </span>
            <span style={styles.completionMetaItem}>
              {'\u{1F4C8}'} 7 days for clear patterns
            </span>
          </div>
        </div>

        {/* Continue button */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button onClick={onComplete} style={styles.primaryBtn}>
            Continue {'\u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}


// --- PROGRESS BAR ---
function ProgressBar({ current, total }) {
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressTrack}>
        {Array.from({ length: total }, (_, i) => i + 1).map(s => (
          <div key={s} style={{
            flex: 1,
            height: '100%',
            borderRadius: 4,
            background: s <= current
              ? 'linear-gradient(135deg, #6B98B8, #D4A843)'
              : 'rgba(107,152,184,0.12)',
            transition: 'background 0.4s ease',
          }} />
        ))}
      </div>
      <div style={styles.progressLabel}>Step {current} of {total}</div>
    </div>
  );
}


// --- KEYFRAMES ---
const keyframes = `
  @keyframes mbtFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes mbtPop {
    0% { opacity: 0; transform: scale(0.4); }
    60% { transform: scale(1.15); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes mbtPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }
  @keyframes mbtSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;


// --- STYLES ---
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  content: {
    padding: '24px 24px 0',
    maxWidth: 580,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  fadeIn: {
    animation: 'mbtFadeIn 0.45s cubic-bezier(0.16,1,0.3,1)',
  },

  // Intro
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  introIcon: {
    fontSize: 44,
  },
  introIconSmall: {
    fontSize: 28,
    opacity: 0.6,
  },
  modalityTags: {
    display: 'flex',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalityTag: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '4px 12px',
    borderRadius: 20,
  },
  alreadyLoggedBanner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    padding: '12px 20px',
    background: 'rgba(139,168,136,0.08)',
    border: '1px solid rgba(139,168,136,0.2)',
    borderRadius: 12,
    marginBottom: 24,
  },

  // Progress
  progressContainer: {
    padding: '16px 24px 0',
    maxWidth: 580,
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
  },
  progressTrack: {
    display: 'flex',
    gap: 6,
    height: 5,
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.06em',
    textAlign: 'right',
  },

  // Typography
  stepTag: {
    display: 'inline-block',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#D4A843',
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    marginBottom: 12,
    padding: '4px 10px',
    background: 'rgba(212,168,67,0.08)',
    borderRadius: 6,
  },
  heading: {
    fontFamily: "'Fraunces', serif",
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
    fontFamily: "'DM Sans', sans-serif",
  },

  // Mood circles
  moodGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  moodCircle: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
    outline: 'none',
    padding: 0,
    fontFamily: "'JetBrains Mono', monospace",
  },
  moodNumber: {
    fontSize: 16,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
  },
  moodScale: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 4px',
    marginBottom: 20,
  },
  moodScaleLabel: {
    fontSize: 11,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.05em',
  },
  moodFeedback: {
    textAlign: 'center',
    padding: '16px 20px',
    background: 'rgba(107,152,184,0.04)',
    borderRadius: 14,
    marginBottom: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  moodFeedbackValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
  },
  moodFeedbackLabel: {
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-secondary, #666)',
  },

  // Activity checkboxes
  activitySectionLabel: {
    fontSize: 12,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-secondary, #666)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  activityGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  activityChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '12px 16px',
    borderRadius: 12,
    border: '1.5px solid',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  activityCheckbox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    flexShrink: 0,
  },
  checkboxChecked: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 20,
    height: 20,
    borderRadius: 5,
    background: '#8BA888',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
  },
  checkboxEmpty: {
    display: 'block',
    width: 20,
    height: 20,
    borderRadius: 5,
    border: '2px solid rgba(107,152,184,0.2)',
    boxSizing: 'border-box',
  },
  activityEmoji: {
    fontSize: 18,
    flexShrink: 0,
  },
  activityLabel: {
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.3,
    transition: 'color 0.15s ease',
  },
  selectedCount: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginTop: 20,
    padding: '10px 0',
  },
  selectedCountNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 18,
    fontWeight: 700,
    color: '#D4A843',
  },
  selectedCountLabel: {
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-muted, #999)',
  },

  // Textarea
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 14,
    background: 'rgba(107,152,184,0.03)',
    fontSize: 15,
    color: 'var(--text-primary, #1a1a1a)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },

  // Summary preview
  summaryPreview: {
    marginTop: 24,
    padding: '18px 20px',
    background: 'rgba(212,168,67,0.04)',
    border: '1px solid rgba(212,168,67,0.15)',
    borderRadius: 14,
  },
  summaryLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.14em',
    color: '#D4A843',
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 700,
    marginBottom: 12,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
    borderBottom: '1px solid rgba(212,168,67,0.08)',
  },
  summaryKey: {
    fontSize: 13,
    color: 'var(--text-secondary, #666)',
    fontFamily: "'DM Sans', sans-serif",
  },
  summaryValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 15,
    fontWeight: 700,
  },
  summaryActivities: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  summaryPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 10px',
    borderRadius: 20,
    background: 'rgba(212,168,67,0.08)',
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-secondary, #666)',
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
    background: 'linear-gradient(135deg, #6B98B8, #D4A843)',
    color: '#fff',
    border: 'none',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(107,152,184,0.25)',
  },
  secondaryBtn: {
    padding: '12px 24px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-secondary, #666)',
    border: '1.5px solid rgba(107,152,184,0.2)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  backBtn: {
    padding: '14px 20px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-muted, #999)',
    border: '1.5px solid rgba(107,152,184,0.15)',
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },

  // Saved confirmation
  savedMoodBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },

  // Insights section
  insightsSection: {
    marginBottom: 8,
  },

  // Stats bar
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    padding: '16px 20px',
    background: 'var(--surface-elevated, #fff)',
    borderRadius: 14,
    border: '1px solid var(--border, rgba(107,152,184,0.12))',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    marginBottom: 20,
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
    flex: 1,
  },
  statValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 22,
    fontWeight: 700,
    color: '#D4A843',
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
  statDivider: {
    width: 1,
    height: 32,
    background: 'rgba(107,152,184,0.12)',
  },

  // Insight cards
  insightCardPositive: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '20px',
    background: 'rgba(107,152,184,0.06)',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 16,
    marginBottom: 12,
    animation: 'mbtSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.2s both',
  },
  insightCardNegative: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '20px',
    background: 'rgba(193,122,110,0.05)',
    border: '1.5px solid rgba(193,122,110,0.18)',
    borderRadius: 16,
    marginBottom: 20,
    animation: 'mbtSlideUp 0.5s cubic-bezier(0.16,1,0.3,1) 0.35s both',
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'rgba(107,152,184,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 700,
    color: '#6B98B8',
    flexShrink: 0,
    fontFamily: "'JetBrains Mono', monospace",
  },
  insightContent: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: "'JetBrains Mono', monospace",
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#6B98B8',
    marginBottom: 6,
  },
  insightText: {
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.55,
    margin: 0,
  },

  // Bar chart
  chartSection: {
    marginBottom: 24,
  },
  chartTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    margin: '0 0 4px',
  },
  chartSubtitle: {
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-muted, #999)',
    marginBottom: 20,
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  chartRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 36px 28px',
    alignItems: 'center',
    gap: 8,
  },
  chartLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  chartEmoji: {
    fontSize: 14,
    flexShrink: 0,
  },
  chartActivityName: {
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-secondary, #666)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  chartBarTrack: {
    height: 20,
    borderRadius: 4,
    background: 'rgba(107,152,184,0.06)',
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
    minWidth: 2,
  },
  chartValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-primary, #1a1a1a)',
    textAlign: 'right',
  },
  chartDays: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    color: 'var(--text-muted, #999)',
    textAlign: 'right',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    marginTop: 14,
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
  },
  legendText: {
    fontSize: 11,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.04em',
  },

  // Difference chart
  diffSection: {
    marginBottom: 24,
  },
  diffContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  diffRow: {
    display: 'grid',
    gridTemplateColumns: '120px 1fr 44px',
    alignItems: 'center',
    gap: 8,
  },
  diffLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  diffName: {
    fontSize: 12,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-secondary, #666)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  diffBarArea: {
    display: 'flex',
    alignItems: 'center',
    height: 18,
    position: 'relative',
  },
  diffZeroLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 1,
    background: 'rgba(107,152,184,0.2)',
  },
  diffBarPosWrap: {
    position: 'absolute',
    left: '50%',
    top: 2,
    bottom: 2,
    right: 0,
    overflow: 'hidden',
  },
  diffBarPos: {
    height: '100%',
    borderRadius: '0 3px 3px 0',
    background: 'rgba(107,152,184,0.5)',
    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
  },
  diffBarNegWrap: {
    position: 'absolute',
    right: '50%',
    top: 2,
    bottom: 2,
    left: 0,
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  diffBarNeg: {
    height: '100%',
    borderRadius: '3px 0 0 3px',
    background: 'rgba(193,122,110,0.45)',
    transition: 'width 0.7s cubic-bezier(0.16,1,0.3,1)',
  },
  diffValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
    fontWeight: 700,
    textAlign: 'right',
  },

  // Not enough data
  notEnoughData: {
    textAlign: 'center',
    padding: '32px 20px',
    background: 'rgba(212,168,67,0.04)',
    border: '1px solid rgba(212,168,67,0.12)',
    borderRadius: 16,
    marginBottom: 20,
  },
  notEnoughIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  notEnoughTitle: {
    fontFamily: "'Fraunces', serif",
    fontSize: 18,
    fontWeight: 500,
    color: 'var(--text-primary, #1a1a1a)',
    margin: '0 0 8px',
  },
  notEnoughText: {
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.6,
    margin: '0 0 20px',
  },
  entryCount: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
  },
  entryCountNumber: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 28,
    fontWeight: 700,
    color: '#D4A843',
  },
  entryCountLabel: {
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-muted, #999)',
  },
  entryProgress: {
    display: 'flex',
    justifyContent: 'center',
    gap: 8,
  },
  entryDot: {
    width: 12,
    height: 12,
    borderRadius: '50%',
    transition: 'background 0.3s ease',
  },

  // Completion card
  completionCard: {
    padding: '20px 24px',
    background: 'linear-gradient(135deg, rgba(107,152,184,0.06), rgba(212,168,67,0.06))',
    border: '1px solid rgba(107,152,184,0.12)',
    borderRadius: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-primary, #1a1a1a)',
    lineHeight: 1.6,
    margin: '0 0 12px',
    fontWeight: 500,
  },
  completionMeta: {
    display: 'flex',
    justifyContent: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },
  completionMetaItem: {
    fontSize: 12,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'var(--text-muted, #999)',
    letterSpacing: '0.04em',
  },
};
