"use client";

import { useState } from 'react';

const TABS = [
  {
    id: 'couch',
    label: 'Couch Level',
    emoji: '\u{1F6CB}\uFE0F',
    energyLabel: 'Low energy',
    description: 'Things you can do without leaving the couch',
    activities: [
      { name: 'Watch a comfort show', emoji: '\u{1F4FA}' },
      { name: 'Look at old photos', emoji: '\u{1F4F7}' },
      { name: 'Listen to a playlist', emoji: '\u{1F3B5}' },
      { name: 'Take a warm shower', emoji: '\u{1F6BF}' },
      { name: 'Pet an animal', emoji: '\u{1F43E}' },
      { name: 'Wrap yourself in a blanket', emoji: '\u{1F9E3}' },
      { name: 'Light a candle', emoji: '\u{1F56F}\uFE0F' },
      { name: 'Re-read a favorite book passage', emoji: '\u{1F4D6}' },
      { name: 'Do a puzzle on your phone', emoji: '\u{1F9E9}' },
      { name: 'Look at nature photos', emoji: '\u{1F33F}' },
    ],
  },
  {
    id: 'walk',
    label: 'Walk Level',
    emoji: '\u{1F6B6}',
    energyLabel: 'Moderate energy',
    description: 'A little movement, a little shift',
    activities: [
      { name: 'Go outside for 10 minutes', emoji: '\u{1F305}' },
      { name: 'Cook something simple', emoji: '\u{1F373}' },
      { name: 'Stretch for 5 minutes', emoji: '\u{1F9D8}' },
      { name: 'Tidy one room', emoji: '\u{1F9F9}' },
      { name: 'Draw or doodle', emoji: '\u270F\uFE0F' },
      { name: 'Call a friend', emoji: '\u{1F4DE}' },
      { name: 'Go to a coffee shop', emoji: '\u2615' },
      { name: 'Water plants', emoji: '\u{1FAB4}' },
      { name: 'Take photos of things you find pretty', emoji: '\u{1F338}' },
      { name: 'Visit a bookstore', emoji: '\u{1F4DA}' },
    ],
  },
  {
    id: 'social',
    label: 'Social Level',
    emoji: '\u{1F3C3}',
    energyLabel: 'Higher energy',
    description: 'Bigger moves when you can manage them',
    activities: [
      { name: 'See a friend', emoji: '\u{1F91D}' },
      { name: 'Attend a class/meetup', emoji: '\u{1F3EB}' },
      { name: 'Exercise for 20 minutes', emoji: '\u{1F4AA}' },
      { name: 'Volunteer for an hour', emoji: '\u{1F49B}' },
      { name: 'Explore a new neighborhood', emoji: '\u{1F5FA}\uFE0F' },
      { name: 'Go to a museum', emoji: '\u{1F3DB}\uFE0F' },
      { name: 'Host a small gathering', emoji: '\u{1F389}' },
      { name: 'Take a different route somewhere', emoji: '\u{1F6E4}\uFE0F' },
      { name: 'Try a new restaurant', emoji: '\u{1F37D}\uFE0F' },
      { name: 'Play a sport', emoji: '\u26BD' },
    ],
  },
];

export default function PleasantActivityMenu({ onComplete, emotion }) {
  const [step, setStep] = useState(0);
  // 0 = intro
  // 1 = activity selection (tabs + cards)
  // 2 = scheduling (day + time)
  // 3 = commitment card + completion

  const [activeTab, setActiveTab] = useState('couch');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [saved, setSaved] = useState(false);

  const toggleActivity = (activity) => {
    setSelectedActivities((prev) => {
      const exists = prev.find(
        (a) => a.name === activity.name
      );
      if (exists) {
        return prev.filter((a) => a.name !== activity.name);
      }
      return [...prev, activity];
    });
  };

  const isSelected = (activity) => {
    return selectedActivities.some((a) => a.name === activity.name);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(
        localStorage.getItem('pleasant_activity_plans') || '[]'
      );
      const newPlan = {
        activities: selectedActivities.map((a) => ({
          name: a.name,
          emoji: a.emoji,
        })),
        day: selectedDay,
        time: selectedTime,
        date: new Date().toISOString(),
        emotion: emotion || 'sad',
      };
      existing.push(newPlan);
      localStorage.setItem(
        'pleasant_activity_plans',
        JSON.stringify(existing)
      );
      setSaved(true);
    } catch (e) {
      setSaved(true);
    }
  };

  const commitmentText = selectedActivities.length === 1
    ? `I plan to ${selectedActivities[0].name.toLowerCase()} on ${selectedDay} ${selectedTime}.`
    : `I plan to ${selectedActivities.map((a) => a.name.toLowerCase()).join(', ')} on ${selectedDay} ${selectedTime}.`;

  // ─────────────────────────────────────────────
  // STEP 0: INTRO
  // ─────────────────────────────────────────────
  if (step === 0) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div
          style={{
            ...styles.fadeIn,
            textAlign: 'center',
            padding: '48px 24px',
            maxWidth: 540,
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: 52, marginBottom: 24, lineHeight: 1 }}>
            {'\u{1F33B}'}
          </div>

          <h2 style={styles.heading}>Pleasant Activity Menu</h2>

          <div
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 50,
              background: 'rgba(212,168,67,0.1)',
              border: '1px solid rgba(212,168,67,0.2)',
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#D4A843',
                fontWeight: 600,
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
              }}
            >
              Behavioral Activation
            </span>
          </div>

          <p
            style={{
              ...styles.subtext,
              fontSize: 17,
              maxWidth: 420,
              margin: '0 auto 32px',
            }}
          >
            Depression narrows your world. This tool expands it back.
          </p>

          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.7,
              margin: '0 auto 36px',
              maxWidth: 400,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}
          >
            You'll browse activities sorted by how much energy they take,
            choose what feels possible, and set a gentle plan.
          </p>

          <button
            onClick={() => setStep(1)}
            style={styles.primaryBtn}
          >
            Browse activities {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // STEP 1: ACTIVITY SELECTION WITH TABS
  // ─────────────────────────────────────────────
  if (step === 1) {
    const currentTab = TABS.find((t) => t.id === activeTab);

    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div
          style={{
            padding: '32px 24px',
            maxWidth: 680,
            margin: '0 auto',
          }}
        >
          <ProgressBar currentStep={1} totalSteps={3} />

          <h2
            style={{
              ...styles.heading,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            What could you do?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              margin: '0 0 28px',
              lineHeight: 1.6,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}
          >
            Pick anything that feels even slightly possible. No pressure.
          </p>

          {/* Tab bar */}
          <div style={styles.tabBar}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    ...styles.tabButton,
                    background: isActive
                      ? 'rgba(155,142,196,0.12)'
                      : 'transparent',
                    borderColor: isActive
                      ? '#9B8EC4'
                      : 'var(--border)',
                    color: isActive
                      ? '#9B8EC4'
                      : 'var(--text-secondary)',
                    boxShadow: isActive
                      ? '0 4px 16px rgba(155,142,196,0.15)'
                      : 'none',
                    transform: isActive ? 'translateY(-1px)' : 'none',
                  }}
                >
                  <span style={{ fontSize: 18 }}>{tab.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Energy level indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 20,
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 3,
              }}
            >
              {[1, 2, 3].map((level) => {
                const tabIndex = TABS.findIndex(
                  (t) => t.id === activeTab
                );
                const filled = level <= tabIndex + 1;
                return (
                  <div
                    key={level}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: filled
                        ? '#9B8EC4'
                        : 'rgba(155,142,196,0.2)',
                      transition: 'background 0.3s ease',
                    }}
                  />
                );
              })}
            </div>
            <span
              style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 500,
              }}
            >
              {currentTab.energyLabel}
            </span>
          </div>

          {/* Tab description */}
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              textAlign: 'center',
              margin: '0 0 24px',
              fontStyle: 'italic',
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}
          >
            {currentTab.description}
          </p>

          {/* Activity card grid */}
          <div
            key={activeTab}
            style={styles.cardGrid}
          >
            {currentTab.activities.map((activity, idx) => {
              const selected = isSelected(activity);
              return (
                <button
                  key={activity.name}
                  onClick={() => toggleActivity(activity)}
                  style={{
                    ...styles.activityCard,
                    background: selected
                      ? 'rgba(155,142,196,0.1)'
                      : 'var(--surface-elevated, #FFFFFF)',
                    borderColor: selected
                      ? '#9B8EC4'
                      : 'var(--border, rgba(0,0,0,0.08))',
                    boxShadow: selected
                      ? '0 6px 24px rgba(155,142,196,0.18)'
                      : 'var(--shadow-sm, 0 2px 8px rgba(0,0,0,0.04))',
                    transform: selected
                      ? 'scale(1.02)'
                      : 'scale(1)',
                    animation: `cardSlideIn 0.35s ease ${idx * 0.04}s both`,
                  }}
                >
                  {/* Checkbox indicator */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      width: 22,
                      height: 22,
                      borderRadius: 7,
                      border: `2px solid ${
                        selected
                          ? '#9B8EC4'
                          : 'rgba(155,142,196,0.25)'
                      }`,
                      background: selected
                        ? '#9B8EC4'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {selected && (
                      <span
                        style={{
                          color: '#fff',
                          fontSize: 12,
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {'\u2713'}
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: 32,
                      lineHeight: 1,
                      marginBottom: 10,
                    }}
                  >
                    {activity.emoji}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: selected
                        ? '#9B8EC4'
                        : 'var(--text-primary)',
                      lineHeight: 1.4,
                      fontFamily:
                        "var(--font-body), 'DM Sans', sans-serif",
                    }}
                  >
                    {activity.name}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected count + continue */}
          <div
            style={{
              ...styles.bottomBar,
              opacity: selectedActivities.length > 0 ? 1 : 0,
              transform:
                selectedActivities.length > 0
                  ? 'translateY(0)'
                  : 'translateY(20px)',
              pointerEvents:
                selectedActivities.length > 0 ? 'auto' : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: 680,
                margin: '0 auto',
                padding: '0 24px',
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#9B8EC4',
                    fontFamily:
                      "var(--font-body), 'DM Sans', sans-serif",
                  }}
                >
                  {selectedActivities.length} selected
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: 4,
                    marginTop: 4,
                    flexWrap: 'wrap',
                  }}
                >
                  {selectedActivities.slice(0, 5).map((a) => (
                    <span key={a.name} style={{ fontSize: 16 }}>
                      {a.emoji}
                    </span>
                  ))}
                  {selectedActivities.length > 5 && (
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text-muted)',
                        alignSelf: 'center',
                      }}
                    >
                      +{selectedActivities.length - 5}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                style={{
                  ...styles.primaryBtn,
                  padding: '12px 28px',
                  fontSize: 15,
                }}
              >
                Schedule {'\u2192'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // STEP 2: SCHEDULING (Day + Time)
  // ─────────────────────────────────────────────
  if (step === 2) {
    return (
      <div style={styles.container}>
        <style>{animationStyles}</style>
        <div
          style={{
            ...styles.fadeIn,
            padding: '40px 24px',
            maxWidth: 540,
            margin: '0 auto',
          }}
        >
          <ProgressBar currentStep={2} totalSteps={3} />

          <h2
            style={{
              ...styles.heading,
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            When will you do this?
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              textAlign: 'center',
              margin: '0 0 32px',
              lineHeight: 1.6,
              fontFamily: "var(--font-body), 'DM Sans', sans-serif",
            }}
          >
            A gentle plan is more powerful than a vague wish.
          </p>

          {/* Selected activities summary */}
          <div
            style={{
              padding: '18px 22px',
              borderRadius: 18,
              background: 'rgba(155,142,196,0.06)',
              border: '1px solid rgba(155,142,196,0.12)',
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--text-muted)',
                fontFamily: "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Your chosen activities
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              {selectedActivities.map((activity) => (
                <div
                  key={activity.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '6px 14px',
                    borderRadius: 50,
                    background: 'rgba(155,142,196,0.1)',
                    border: '1px solid rgba(155,142,196,0.18)',
                    fontSize: 13,
                    color: '#9B8EC4',
                    fontWeight: 500,
                    fontFamily:
                      "var(--font-body), 'DM Sans', sans-serif",
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {activity.emoji}
                  </span>
                  {activity.name}
                </div>
              ))}
            </div>
          </div>

          {/* Day selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={styles.fieldLabel}>Day</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Today', 'Tomorrow'].map((day) => {
                const active = selectedDay === day;
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    style={{
                      ...styles.toggleBtn,
                      flex: 1,
                      background: active
                        ? 'rgba(155,142,196,0.12)'
                        : 'var(--surface-elevated, #FFFFFF)',
                      borderColor: active
                        ? '#9B8EC4'
                        : 'var(--border, rgba(0,0,0,0.08))',
                      color: active
                        ? '#9B8EC4'
                        : 'var(--text-secondary)',
                      boxShadow: active
                        ? '0 4px 12px rgba(155,142,196,0.15)'
                        : 'none',
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time selector */}
          <div style={{ marginBottom: 36 }}>
            <label style={styles.fieldLabel}>Time of day</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { label: 'Morning', emoji: '\u{1F305}' },
                { label: 'Afternoon', emoji: '\u2600\uFE0F' },
                { label: 'Evening', emoji: '\u{1F319}' },
              ].map((time) => {
                const active = selectedTime === time.label;
                return (
                  <button
                    key={time.label}
                    onClick={() => setSelectedTime(time.label)}
                    style={{
                      ...styles.toggleBtn,
                      flex: 1,
                      flexDirection: 'column',
                      gap: 6,
                      padding: '16px 12px',
                      background: active
                        ? 'rgba(155,142,196,0.12)'
                        : 'var(--surface-elevated, #FFFFFF)',
                      borderColor: active
                        ? '#9B8EC4'
                        : 'var(--border, rgba(0,0,0,0.08))',
                      color: active
                        ? '#9B8EC4'
                        : 'var(--text-secondary)',
                      boxShadow: active
                        ? '0 4px 12px rgba(155,142,196,0.15)'
                        : 'none',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>
                      {time.emoji}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    >
                      {time.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview commitment sentence */}
          {selectedDay && selectedTime && (
            <div
              style={{
                padding: '18px 22px',
                borderRadius: 16,
                background: 'rgba(212,168,67,0.06)',
                border: '1px solid rgba(212,168,67,0.15)',
                marginBottom: 32,
                animation: 'fadeIn 0.4s ease',
              }}
            >
              <p
                style={{
                  fontSize: 15,
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  margin: 0,
                  textAlign: 'center',
                  fontFamily:
                    "var(--font-heading), 'Fraunces', serif",
                  fontWeight: 500,
                  fontStyle: 'italic',
                }}
              >
                {commitmentText}
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                handleSave();
                setStep(3);
              }}
              disabled={!selectedDay || !selectedTime}
              style={{
                ...styles.primaryBtn,
                opacity:
                  selectedDay && selectedTime ? 1 : 0.4,
                cursor:
                  selectedDay && selectedTime
                    ? 'pointer'
                    : 'not-allowed',
              }}
            >
              Set my plan {'\u2192'}
            </button>

            <button
              onClick={() => setStep(1)}
              style={styles.backBtn}
            >
              {'\u2190'} Back to activities
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // STEP 3: COMMITMENT CARD + COMPLETION
  // ─────────────────────────────────────────────
  return (
    <div style={styles.container}>
      <style>{animationStyles}</style>
      <div
        style={{
          padding: '40px 24px',
          maxWidth: 540,
          margin: '0 auto',
        }}
      >
        <ProgressBar currentStep={3} totalSteps={3} />

        {/* Commitment card */}
        <div
          style={{
            padding: '40px 28px',
            borderRadius: 28,
            background: 'var(--surface-elevated, #FFFFFF)',
            position: 'relative',
            marginBottom: 28,
            animation:
              'perspectiveReveal 0.7s cubic-bezier(0.16,1,0.3,1)',
            boxShadow: '0 12px 48px rgba(155,142,196,0.12)',
            overflow: 'hidden',
          }}
        >
          {/* Gradient border overlay */}
          <div
            style={{
              position: 'absolute',
              inset: -2,
              borderRadius: 30,
              padding: 2,
              background:
                'linear-gradient(135deg, #9B8EC4 0%, #D4A843 50%, #9B8EC4 100%)',
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              pointerEvents: 'none',
            }}
          />

          <div style={{ textAlign: 'center', position: 'relative' }}>
            {/* Decorative emoji cluster */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
                marginBottom: 20,
                fontSize: 32,
                lineHeight: 1,
              }}
            >
              {selectedActivities.slice(0, 4).map((a, i) => (
                <span
                  key={a.name}
                  style={{
                    animation: `pillPop 0.4s ease ${i * 0.1}s both`,
                  }}
                >
                  {a.emoji}
                </span>
              ))}
            </div>

            <div
              style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: '#9B8EC4',
                marginBottom: 20,
                fontFamily:
                  "var(--font-body), 'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              My Plan
            </div>

            <p
              style={{
                fontFamily:
                  "var(--font-heading), 'Fraunces', serif",
                fontSize: 'clamp(1.1rem, 3.5vw, 1.35rem)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 1.55,
                margin: '0 0 28px',
              }}
            >
              {commitmentText}
            </p>

            {/* Activity pills */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8,
                justifyContent: 'center',
                marginBottom: 24,
              }}
            >
              {selectedActivities.map((activity, i) => (
                <div
                  key={activity.name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 16px',
                    borderRadius: 50,
                    background: 'rgba(155,142,196,0.08)',
                    border: '1px solid rgba(155,142,196,0.15)',
                    fontSize: 13,
                    color: '#9B8EC4',
                    fontWeight: 500,
                    fontFamily:
                      "var(--font-body), 'DM Sans', sans-serif",
                    animation: `pillPop 0.35s ease ${
                      0.2 + i * 0.08
                    }s both`,
                  }}
                >
                  <span style={{ fontSize: 14 }}>
                    {activity.emoji}
                  </span>
                  {activity.name}
                </div>
              ))}
            </div>

            {/* Day + Time row */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'rgba(212,168,67,0.06)',
                  border: '1px solid rgba(212,168,67,0.12)',
                }}
              >
                <div style={styles.metaLabel}>When</div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#D4A843',
                    margin: 0,
                    fontFamily:
                      "var(--font-body), 'DM Sans', sans-serif",
                  }}
                >
                  {selectedDay}
                </p>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderRadius: 14,
                  background: 'rgba(155,142,196,0.06)',
                  border: '1px solid rgba(155,142,196,0.12)',
                }}
              >
                <div style={styles.metaLabel}>Time</div>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    color: '#9B8EC4',
                    margin: 0,
                    fontFamily:
                      "var(--font-body), 'DM Sans', sans-serif",
                  }}
                >
                  {selectedTime}
                </p>
              </div>
            </div>

            {/* Saved confirmation */}
            {saved && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 14px',
                  borderRadius: 50,
                  background: 'rgba(122,158,126,0.1)',
                  border: '1px solid rgba(122,158,126,0.2)',
                  fontSize: 12,
                  color: 'var(--sage, #7A9E7E)',
                  fontWeight: 600,
                  fontFamily:
                    "var(--font-body), 'DM Sans', sans-serif",
                  animation: 'pillPop 0.3s ease',
                }}
              >
                {'\u2713'} Saved to your plans
              </div>
            )}
          </div>
        </div>

        {/* Closing wisdom */}
        <div
          style={{
            padding: '22px 26px',
            borderRadius: 20,
            background: 'rgba(155,142,196,0.06)',
            border: '1px solid rgba(155,142,196,0.12)',
            marginBottom: 32,
            animation: 'fadeIn 0.6s ease 0.3s both',
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
              fontFamily:
                "var(--font-body), 'DM Sans', sans-serif",
            }}
          >
            You chose something. That's the hardest step when you're low.
          </p>
          <p
            style={{
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '12px 0 0',
              fontFamily:
                "var(--font-body), 'DM Sans', sans-serif",
              fontStyle: 'italic',
            }}
          >
            The research (Martell, 2010) shows that action creates
            motivation — not the other way around.
          </p>
        </div>

        {/* Continue button */}
        <div
          style={{
            textAlign: 'center',
            animation: 'fadeIn 0.6s ease 0.5s both',
          }}
        >
          <button
            onClick={onComplete}
            style={{
              ...styles.primaryBtn,
              width: '100%',
              maxWidth: 320,
            }}
          >
            Continue {'\u2192'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Progress Bar Sub-Component
// ─────────────────────────────────────────────
function ProgressBar({ currentStep, totalSteps }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: '#9B8EC4',
            fontWeight: 600,
            fontFamily: "var(--font-body), 'DM Sans', sans-serif",
          }}
        >
          Step {currentStep} of {totalSteps}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background:
                i < currentStep
                  ? '#9B8EC4'
                  : 'rgba(155,142,196,0.15)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Keyframe Animations
// ─────────────────────────────────────────────
const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes cardSlideIn {
    from { opacity: 0; transform: translateY(16px) scale(0.96); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes perspectiveReveal {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes pillPop {
    from { opacity: 0; transform: scale(0.7); }
    to { opacity: 1; transform: scale(1); }
  }
  @keyframes tabSlideIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

// ─────────────────────────────────────────────
// Static Styles
// ─────────────────────────────────────────────
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'fadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    fontSize: 'clamp(1.4rem, 4vw, 1.9rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 16px',
  },
  subtext: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 28px',
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: '#9B8EC4',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "var(--font-heading), 'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
  },
  backBtn: {
    display: 'block',
    margin: '16px auto 0',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 14,
    cursor: 'pointer',
    padding: '8px 16px',
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  tabBar: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    borderRadius: 50,
    border: '2px solid var(--border, rgba(0,0,0,0.08))',
    background: 'transparent',
    cursor: 'pointer',
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    transition: 'all 0.25s ease',
    whiteSpace: 'nowrap',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
    marginBottom: 32,
  },
  activityCard: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 14px 20px',
    borderRadius: 20,
    border: '2px solid var(--border, rgba(0,0,0,0.08))',
    background: 'var(--surface-elevated, #FFFFFF)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.25s ease',
    minHeight: 100,
  },
  toggleBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 20px',
    borderRadius: 14,
    border: '2px solid var(--border, rgba(0,0,0,0.08))',
    fontSize: 15,
    fontWeight: 600,
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  fieldLabel: {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: 12,
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
  },
  metaLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'var(--text-muted)',
    fontFamily: "var(--font-body), 'DM Sans', sans-serif",
    fontWeight: 600,
    marginBottom: 6,
  },
  bottomBar: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 0',
    background: 'rgba(250,246,240,0.92)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderTop: '1px solid rgba(155,142,196,0.12)',
    transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
  },
};
