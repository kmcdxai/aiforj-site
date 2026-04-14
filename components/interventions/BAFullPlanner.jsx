"use client";

import { useState, useCallback, useEffect } from 'react';

// --- Constants ---
const AMBER = '#D4A843';
const AMBER_LIGHT = 'rgba(212, 168, 67, 0.10)';
const AMBER_BORDER = 'rgba(212, 168, 67, 0.25)';
const AMBER_GLOW = 'rgba(212, 168, 67, 0.30)';
const LAVENDER = '#9B8EC4';
const LAVENDER_LIGHT = 'rgba(155, 142, 196, 0.10)';
const LAVENDER_BORDER = 'rgba(155, 142, 196, 0.25)';
const SAGE = '#8BA888';
const SAGE_LIGHT = 'rgba(139, 168, 136, 0.12)';
const SAGE_BORDER = 'rgba(139, 168, 136, 0.30)';
const PARCHMENT = '#FAF6F0';
const WARM_GRAY = '#6B6B6B';
const MUTED_ROSE = '#C17A6E';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYS_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const TOTAL_STEPS = 4;

const SUGGESTED_ACTIVITIES = [
  { name: 'Exercise', emoji: '\u{1F3C3}' },
  { name: 'Call a friend', emoji: '\u{1F4DE}' },
  { name: 'Cook a meal', emoji: '\u{1F373}' },
  { name: 'Go outside', emoji: '\u{1F333}' },
  { name: 'Creative project', emoji: '\u{1F3A8}' },
  { name: 'Read', emoji: '\u{1F4D6}' },
  { name: 'Learn something new', emoji: '\u{1F9E0}' },
  { name: 'Help someone', emoji: '\u{1F91D}' },
  { name: 'Clean/organize', emoji: '\u{1F9F9}' },
  { name: 'Fun activity', emoji: '\u{1F389}' },
];

const STORAGE_KEY = 'ba_weekly_plans';

// --- Keyframes ---
const keyframes = `
@keyframes baFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes baPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
@keyframes baSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes baDotPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes baCheckmark {
  0% { stroke-dashoffset: 24; }
  100% { stroke-dashoffset: 0; }
}
@keyframes baProgressFill {
  from { width: 0%; }
}
`;

// --- Helper: initialize empty week data ---
function createEmptyWeek() {
  const week = {};
  DAYS.forEach(day => {
    week[day] = [{ activity: '', mastery: 5, pleasure: 5 }];
  });
  return week;
}

// --- Helper: initialize empty plan week ---
function createEmptyPlanWeek() {
  const week = {};
  DAYS.forEach(day => {
    week[day] = { mastery: '', pleasure: '' };
  });
  return week;
}

// --- Helper: get all activities with their ratings ---
function getAllActivities(weekData) {
  const activities = [];
  DAYS.forEach(day => {
    weekData[day].forEach(entry => {
      if (entry.activity.trim()) {
        activities.push({
          day,
          activity: entry.activity.trim(),
          mastery: entry.mastery,
          pleasure: entry.pleasure,
        });
      }
    });
  });
  return activities;
}

// --- Helper: classify activity into quadrant ---
function getQuadrant(mastery, pleasure) {
  const highMastery = mastery >= 5;
  const highPleasure = pleasure >= 5;
  if (highMastery && highPleasure) return 'keep';
  if (highMastery && !highPleasure) return 'necessary';
  if (!highMastery && highPleasure) return 'enjoyment';
  return 'reduce';
}

// --- Sub-component: Progress Bar ---
function ProgressBar({ currentStep }) {
  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;
  return (
    <div style={{
      marginBottom: 28,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          color: WARM_GRAY,
          letterSpacing: '0.02em',
        }}>
          Step {currentStep + 1} of {TOTAL_STEPS}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: AMBER,
          fontWeight: 600,
        }}>
          {Math.round(progress)}%
        </span>
      </div>
      <div style={{
        width: '100%',
        height: 6,
        background: 'rgba(212, 168, 67, 0.12)',
        borderRadius: 3,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${AMBER}, ${LAVENDER})`,
          borderRadius: 3,
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
          animation: 'baProgressFill 0.8s ease-out',
        }} />
      </div>
    </div>
  );
}

// --- Sub-component: Day Tabs ---
function DayTabs({ activeDay, onSelectDay, weekData }) {
  return (
    <div style={{
      display: 'flex',
      gap: 4,
      marginBottom: 24,
      overflowX: 'auto',
      paddingBottom: 4,
    }}>
      {DAYS.map(day => {
        const isActive = day === activeDay;
        const hasActivities = weekData[day].some(e => e.activity.trim());
        return (
          <button
            key={day}
            onClick={() => onSelectDay(day)}
            style={{
              flex: '1 0 auto',
              minWidth: 52,
              padding: '10px 12px',
              border: isActive ? `2px solid ${AMBER}` : '2px solid transparent',
              borderRadius: 10,
              background: isActive
                ? AMBER_LIGHT
                : hasActivities
                  ? 'rgba(139, 168, 136, 0.08)'
                  : 'rgba(0,0,0,0.03)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.25s ease',
              position: 'relative',
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? AMBER : '#444',
            }}>
              {day}
            </span>
            {hasActivities && (
              <div style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                background: SAGE,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// --- Sub-component: Slider ---
function RatingSlider({ label, value, onChange, color, icon }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 13,
          fontWeight: 600,
          color: '#444',
        }}>
          {icon} {label}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 14,
          fontWeight: 700,
          color: color,
          background: `${color}18`,
          padding: '2px 10px',
          borderRadius: 8,
          minWidth: 32,
          textAlign: 'center',
        }}>
          {value}
        </span>
      </div>
      <div style={{ position: 'relative', paddingTop: 2, paddingBottom: 2 }}>
        <input
          type="range"
          min={0}
          max={10}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            appearance: 'none',
            WebkitAppearance: 'none',
            background: `linear-gradient(to right, ${color} 0%, ${color} ${value * 10}%, rgba(0,0,0,0.08) ${value * 10}%, rgba(0,0,0,0.08) 100%)`,
            outline: 'none',
            cursor: 'pointer',
            accentColor: color,
          }}
        />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 2,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: '#999',
        }}>0</span>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: '#999',
        }}>10</span>
      </div>
    </div>
  );
}

// --- Sub-component: Activity Entry Card ---
function ActivityEntry({ entry, index, dayIndex, onUpdate, onRemove, showRemove }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 12,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      animation: 'baFadeIn 0.35s ease-out',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 600,
          color: WARM_GRAY,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Activity {index + 1}
        </span>
        {showRemove && (
          <button
            onClick={onRemove}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 18,
              color: '#ccc',
              padding: '2px 6px',
              borderRadius: 6,
              lineHeight: 1,
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => e.target.style.color = MUTED_ROSE}
            onMouseLeave={(e) => e.target.style.color = '#ccc'}
            aria-label="Remove activity"
          >
            \u00D7
          </button>
        )}
      </div>

      <input
        type="text"
        placeholder="What did you do?"
        value={entry.activity}
        onChange={(e) => onUpdate({ ...entry, activity: e.target.value })}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `1.5px solid ${entry.activity.trim() ? AMBER_BORDER : 'rgba(0,0,0,0.08)'}`,
          borderRadius: 10,
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          color: '#333',
          background: entry.activity.trim() ? 'rgba(212, 168, 67, 0.04)' : '#fafafa',
          outline: 'none',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box',
          marginBottom: 16,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = AMBER;
          e.target.style.boxShadow = `0 0 0 3px ${AMBER_LIGHT}`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = entry.activity.trim() ? AMBER_BORDER : 'rgba(0,0,0,0.08)';
          e.target.style.boxShadow = 'none';
        }}
      />

      <RatingSlider
        label="Mastery"
        icon="\u{1F3AF}"
        value={entry.mastery}
        onChange={(val) => onUpdate({ ...entry, mastery: val })}
        color={AMBER}
      />

      <RatingSlider
        label="Pleasure"
        icon="\u2728"
        value={entry.pleasure}
        onChange={(val) => onUpdate({ ...entry, pleasure: val })}
        color={LAVENDER}
      />
    </div>
  );
}

// --- Sub-component: Quadrant Grid ---
function QuadrantGrid({ activities }) {
  const quadrants = {
    keep: { label: 'Keep doing', sublabel: 'High mastery + high pleasure', color: SAGE, bg: SAGE_LIGHT, border: SAGE_BORDER, items: [] },
    necessary: { label: 'Necessary, add pleasure after', sublabel: 'High mastery + low pleasure', color: AMBER, bg: AMBER_LIGHT, border: AMBER_BORDER, items: [] },
    enjoyment: { label: 'Pure enjoyment \u2014 need more', sublabel: 'Low mastery + high pleasure', color: LAVENDER, bg: LAVENDER_LIGHT, border: LAVENDER_BORDER, items: [] },
    reduce: { label: 'Reduce or eliminate', sublabel: 'Low mastery + low pleasure', color: WARM_GRAY, bg: 'rgba(0,0,0,0.04)', border: 'rgba(0,0,0,0.10)', items: [] },
  };

  activities.forEach(act => {
    const q = getQuadrant(act.mastery, act.pleasure);
    quadrants[q].items.push(act);
  });

  return (
    <div style={{
      position: 'relative',
      marginBottom: 24,
    }}>
      {/* Axis labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          color: LAVENDER,
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          \u2190 Low Pleasure {'  \u00B7  '} High Pleasure \u2192
        </span>
      </div>

      <div style={{ display: 'flex', gap: 0 }}>
        {/* Y-axis label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: AMBER,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            writingMode: 'vertical-lr',
            transform: 'rotate(180deg)',
          }}>
            Low Mastery {'  \u00B7  '} High Mastery
          </span>
        </div>

        {/* Grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: 3,
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {/* Top-left: High mastery, Low pleasure */}
          <QuadrantCell quadrant={quadrants.necessary} position="top-left" />
          {/* Top-right: High mastery, High pleasure */}
          <QuadrantCell quadrant={quadrants.keep} position="top-right" />
          {/* Bottom-left: Low mastery, Low pleasure */}
          <QuadrantCell quadrant={quadrants.reduce} position="bottom-left" />
          {/* Bottom-right: Low mastery, High pleasure */}
          <QuadrantCell quadrant={quadrants.enjoyment} position="bottom-right" />
        </div>
      </div>
    </div>
  );
}

// --- Sub-component: Single Quadrant Cell ---
function QuadrantCell({ quadrant, position }) {
  const borderRadii = {
    'top-left': '14px 2px 2px 2px',
    'top-right': '2px 14px 2px 2px',
    'bottom-left': '2px 2px 2px 14px',
    'bottom-right': '2px 2px 14px 2px',
  };

  return (
    <div style={{
      background: quadrant.bg,
      border: `1.5px solid ${quadrant.border}`,
      borderRadius: borderRadii[position],
      padding: '16px 14px',
      minHeight: 130,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 700,
          color: quadrant.color,
          marginBottom: 2,
          lineHeight: 1.3,
        }}>
          {quadrant.label}
        </div>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: 10,
          color: '#999',
        }}>
          {quadrant.sublabel}
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        flex: 1,
        alignContent: 'flex-start',
      }}>
        {quadrant.items.length === 0 && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 11,
            color: '#bbb',
            fontStyle: 'italic',
          }}>
            No activities here
          </span>
        )}
        {quadrant.items.map((item, i) => (
          <div
            key={`${item.activity}-${i}`}
            style={{
              background: '#fff',
              border: `1px solid ${quadrant.border}`,
              borderRadius: 20,
              padding: '5px 12px',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 500,
              color: '#444',
              boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
              animation: `baDotPop 0.4s ease-out ${i * 0.08}s both`,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              maxWidth: '100%',
            }}
          >
            <div style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              background: quadrant.color,
              flexShrink: 0,
            }} />
            <span style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {item.activity}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: '#999',
              flexShrink: 0,
            }}>
              {item.mastery}/{item.pleasure}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Sub-component: Suggestion Chips ---
function SuggestionChips({ onSelect, selectedValue }) {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8,
      marginBottom: 4,
    }}>
      {SUGGESTED_ACTIVITIES.map(act => {
        const isSelected = selectedValue.toLowerCase() === act.name.toLowerCase();
        return (
          <button
            key={act.name}
            onClick={() => onSelect(act.name)}
            style={{
              background: isSelected ? AMBER_LIGHT : '#fff',
              border: `1.5px solid ${isSelected ? AMBER : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 20,
              padding: '6px 14px',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 500,
              color: isSelected ? AMBER : '#666',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
            }}
          >
            <span>{act.emoji}</span>
            <span>{act.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// --- Sub-component: Plan Day Row ---
function PlanDayRow({ day, dayFull, plan, onUpdate }) {
  const [showMasterySuggestions, setShowMasterySuggestions] = useState(false);
  const [showPleasureSuggestions, setShowPleasureSuggestions] = useState(false);

  return (
    <div style={{
      background: '#fff',
      border: '1px solid rgba(0,0,0,0.06)',
      borderRadius: 14,
      padding: '16px 18px',
      marginBottom: 10,
      boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
      animation: 'baFadeIn 0.3s ease-out',
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: 15,
        fontWeight: 600,
        color: '#333',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: AMBER_LIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          color: AMBER,
        }}>
          {day}
        </span>
        <span>{dayFull}</span>
      </div>

      {/* Mastery activity */}
      <div style={{ marginBottom: 12 }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 600,
          color: AMBER,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>{'\u{1F3AF}'}</span> Mastery Activity
        </label>
        <input
          type="text"
          placeholder="Something that gives you a sense of accomplishment..."
          value={plan.mastery}
          onChange={(e) => onUpdate({ ...plan, mastery: e.target.value })}
          onFocus={() => setShowMasterySuggestions(true)}
          onBlur={() => setTimeout(() => setShowMasterySuggestions(false), 200)}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${plan.mastery.trim() ? AMBER_BORDER : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 10,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#333',
            background: plan.mastery.trim() ? 'rgba(212, 168, 67, 0.04)' : '#fafafa',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
        {showMasterySuggestions && !plan.mastery.trim() && (
          <SuggestionChips
            onSelect={(name) => onUpdate({ ...plan, mastery: name })}
            selectedValue={plan.mastery}
          />
        )}
      </div>

      {/* Pleasure activity */}
      <div>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 12,
          fontWeight: 600,
          color: LAVENDER,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>\u2728</span> Pleasure Activity
        </label>
        <input
          type="text"
          placeholder="Something enjoyable, just for you..."
          value={plan.pleasure}
          onChange={(e) => onUpdate({ ...plan, pleasure: e.target.value })}
          onFocus={() => setShowPleasureSuggestions(true)}
          onBlur={() => setTimeout(() => setShowPleasureSuggestions(false), 200)}
          style={{
            width: '100%',
            padding: '10px 14px',
            border: `1.5px solid ${plan.pleasure.trim() ? LAVENDER_BORDER : 'rgba(0,0,0,0.08)'}`,
            borderRadius: 10,
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: '#333',
            background: plan.pleasure.trim() ? LAVENDER_LIGHT : '#fafafa',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
        {showPleasureSuggestions && !plan.pleasure.trim() && (
          <SuggestionChips
            onSelect={(name) => onUpdate({ ...plan, pleasure: name })}
            selectedValue={plan.pleasure}
          />
        )}
      </div>
    </div>
  );
}

// --- Sub-component: Week Summary Card ---
function WeekSummaryCard({ planWeek }) {
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${AMBER_BORDER}`,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 24,
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${AMBER_LIGHT}, ${LAVENDER_LIGHT})`,
        padding: '16px 20px',
        borderBottom: `1px solid ${AMBER_BORDER}`,
      }}>
        <h3 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 17,
          fontWeight: 700,
          color: '#333',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}>
          {'\u{1F4C5}'} Your Week Plan
        </h3>
      </div>

      {/* Schedule rows */}
      <div style={{ padding: '4px 0' }}>
        {DAYS.map((day, i) => {
          const plan = planWeek[day];
          const hasMastery = plan.mastery.trim();
          const hasPleasure = plan.pleasure.trim();
          const isEmpty = !hasMastery && !hasPleasure;

          return (
            <div
              key={day}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                padding: '12px 20px',
                borderBottom: i < DAYS.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                animation: `baSlideUp 0.3s ease-out ${i * 0.05}s both`,
                gap: 14,
              }}
            >
              {/* Day label */}
              <div style={{
                width: 44,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: isEmpty ? '#bbb' : '#555',
                }}>
                  {day}
                </span>
              </div>

              {/* Divider line */}
              <div style={{
                width: 2,
                background: isEmpty
                  ? 'rgba(0,0,0,0.05)'
                  : `linear-gradient(to bottom, ${AMBER}, ${LAVENDER})`,
                borderRadius: 1,
                flexShrink: 0,
              }} />

              {/* Activities */}
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                padding: '2px 0',
              }}>
                {isEmpty ? (
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#bbb',
                    fontStyle: 'italic',
                  }}>
                    No activities planned
                  </span>
                ) : (
                  <>
                    {hasMastery && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          background: AMBER_LIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          flexShrink: 0,
                        }}>
                          {'\u{1F3AF}'}
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#444',
                        }}>
                          {plan.mastery}
                        </span>
                      </div>
                    )}
                    {hasPleasure && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}>
                        <span style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          background: LAVENDER_LIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          flexShrink: 0,
                        }}>
                          \u2728
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#444',
                        }}>
                          {plan.pleasure}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ========================================
// --- Main Component ---
// ========================================
export default function BAFullPlanner({ onComplete, emotion }) {
  const [step, setStep] = useState(0);
  // 0 = intro
  // 1 = rate current activities
  // 2 = analysis
  // 3 = plan next week
  // 4 = commitment / summary
  const [activeDay, setActiveDay] = useState('Mon');
  const [weekData, setWeekData] = useState(createEmptyWeek);
  const [planWeek, setPlanWeek] = useState(createEmptyPlanWeek);
  const [animateIn, setAnimateIn] = useState(true);
  const [saved, setSaved] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [planActiveDay, setPlanActiveDay] = useState('Mon');

  // Transition helper
  const transitionTo = useCallback((nextStep) => {
    setAnimateIn(false);
    setTimeout(() => {
      setStep(nextStep);
      setAnimateIn(true);
    }, 250);
  }, []);

  // Update a single activity entry for a given day
  const updateActivity = useCallback((day, index, updatedEntry) => {
    setWeekData(prev => {
      const newWeek = { ...prev };
      const dayActivities = [...newWeek[day]];
      dayActivities[index] = updatedEntry;
      newWeek[day] = dayActivities;
      return newWeek;
    });
  }, []);

  // Add a new activity to a day
  const addActivity = useCallback((day) => {
    setWeekData(prev => {
      const newWeek = { ...prev };
      newWeek[day] = [...newWeek[day], { activity: '', mastery: 5, pleasure: 5 }];
      return newWeek;
    });
  }, []);

  // Remove an activity from a day
  const removeActivity = useCallback((day, index) => {
    setWeekData(prev => {
      const newWeek = { ...prev };
      const dayActivities = [...newWeek[day]];
      dayActivities.splice(index, 1);
      newWeek[day] = dayActivities.length > 0 ? dayActivities : [{ activity: '', mastery: 5, pleasure: 5 }];
      return newWeek;
    });
  }, []);

  // Update plan for a day
  const updatePlan = useCallback((day, updatedPlan) => {
    setPlanWeek(prev => ({
      ...prev,
      [day]: updatedPlan,
    }));
  }, []);

  // Save plan to localStorage
  const savePlan = useCallback(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const allActivities = getAllActivities(weekData);
      const newEntry = {
        date: new Date().toISOString(),
        reviewWeek: weekData,
        analysis: allActivities.map(a => ({
          ...a,
          quadrant: getQuadrant(a.mastery, a.pleasure),
        })),
        plan: planWeek,
      };
      existing.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      setSaved(true);
    } catch (_) {
      // localStorage unavailable, still mark saved
      setSaved(true);
    }
  }, [weekData, planWeek]);

  // Count filled activities across entire week
  const totalActivities = getAllActivities(weekData).length;

  // Count filled plan days
  const plannedDays = DAYS.filter(day =>
    planWeek[day].mastery.trim() || planWeek[day].pleasure.trim()
  ).length;

  // Shared container style
  const containerStyle = {
    background: PARCHMENT,
    borderRadius: 20,
    padding: '32px 28px',
    maxWidth: 640,
    margin: '0 auto',
    fontFamily: 'var(--font-body)',
    position: 'relative',
    minHeight: 400,
  };

  const fadeStyle = {
    opacity: animateIn ? 1 : 0,
    transform: animateIn ? 'translateY(0)' : 'translateY(10px)',
    transition: 'all 0.3s ease-out',
  };

  // ========================
  // Step 0: Intro
  // ========================
  if (step === 0) {
    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        <div style={{
          ...fadeStyle,
          textAlign: 'center',
          padding: '32px 12px',
        }}>
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${AMBER_LIGHT}, ${LAVENDER_LIGHT})`,
            border: `2px solid ${AMBER_BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 34,
            margin: '0 auto 24px',
            animation: 'baPulse 3s ease-in-out infinite',
          }}>
            {'\u{1F4CB}'}
          </div>

          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 26,
            fontWeight: 700,
            color: '#2A2A2A',
            marginBottom: 12,
            lineHeight: 1.3,
          }}>
            Behavioral Activation Planner
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: WARM_GRAY,
            lineHeight: 1.6,
            maxWidth: 440,
            margin: '0 auto 12px',
          }}>
            When we feel low, we tend to do less. Doing less makes us feel lower.
            This cycle is reversible.
          </p>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            color: '#888',
            lineHeight: 1.6,
            maxWidth: 440,
            margin: '0 auto 8px',
          }}>
            This tool helps you review your past week, see which activities
            affect your mood, and build a concrete plan for next week.
          </p>

          <div style={{
            background: '#fff',
            border: `1px solid ${AMBER_BORDER}`,
            borderRadius: 14,
            padding: '20px 24px',
            margin: '28px auto 32px',
            maxWidth: 400,
            textAlign: 'left',
          }}>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              color: AMBER,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: 12,
            }}>
              4 Steps
            </div>
            {[
              { num: 1, text: 'Rate your activities from this past week' },
              { num: 2, text: 'See which activities help the most' },
              { num: 3, text: 'Plan your next week with intention' },
              { num: 4, text: 'Commit to your plan' },
            ].map(item => (
              <div key={item.num} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: item.num < 4 ? 10 : 0,
              }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 8,
                  background: AMBER_LIGHT,
                  border: `1px solid ${AMBER_BORDER}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: AMBER,
                  flexShrink: 0,
                }}>
                  {item.num}
                </div>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 14,
                  color: '#555',
                }}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => transitionTo(1)}
            onMouseEnter={() => setHoveredButton('start')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              background: hoveredButton === 'start'
                ? AMBER
                : `linear-gradient(135deg, ${AMBER}, #C49A38)`,
              color: '#fff',
              border: 'none',
              borderRadius: 14,
              padding: '16px 48px',
              fontFamily: 'var(--font-heading)',
              fontSize: 17,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: hoveredButton === 'start'
                ? `0 8px 24px ${AMBER_GLOW}`
                : `0 4px 16px ${AMBER_GLOW}`,
              transform: hoveredButton === 'start' ? 'translateY(-2px)' : 'none',
            }}
          >
            Begin Review
          </button>
        </div>
      </div>
    );
  }

  // ========================
  // Step 1: Rate Current Activities
  // ========================
  if (step === 1) {
    const dayEntries = weekData[activeDay];

    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        <ProgressBar currentStep={0} />

        <div style={fadeStyle}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: '#2A2A2A',
            marginBottom: 6,
            textAlign: 'center',
          }}>
            Rate Your Past Week
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: WARM_GRAY,
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 1.5,
          }}>
            For each day, enter what you did and rate each activity on two dimensions:
            mastery (sense of accomplishment) and pleasure (enjoyment).
          </p>

          <DayTabs
            activeDay={activeDay}
            onSelectDay={setActiveDay}
            weekData={weekData}
          />

          {/* Day header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <h3 style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 18,
              fontWeight: 600,
              color: '#333',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: AMBER_LIGHT,
                border: `1.5px solid ${AMBER_BORDER}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                fontWeight: 700,
                color: AMBER,
              }}>
                {activeDay}
              </span>
              {DAYS_FULL[DAYS.indexOf(activeDay)]}
            </h3>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: '#aaa',
            }}>
              {dayEntries.filter(e => e.activity.trim()).length} activit{dayEntries.filter(e => e.activity.trim()).length === 1 ? 'y' : 'ies'}
            </span>
          </div>

          {/* Activity entries */}
          {dayEntries.map((entry, index) => (
            <ActivityEntry
              key={`${activeDay}-${index}`}
              entry={entry}
              index={index}
              dayIndex={DAYS.indexOf(activeDay)}
              onUpdate={(updated) => updateActivity(activeDay, index, updated)}
              onRemove={() => removeActivity(activeDay, index)}
              showRemove={dayEntries.length > 1}
            />
          ))}

          {/* Add activity button */}
          <button
            onClick={() => addActivity(activeDay)}
            onMouseEnter={() => setHoveredButton('add')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              width: '100%',
              padding: '14px',
              border: `2px dashed ${hoveredButton === 'add' ? AMBER : 'rgba(0,0,0,0.10)'}`,
              borderRadius: 14,
              background: hoveredButton === 'add' ? AMBER_LIGHT : 'transparent',
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              fontWeight: 600,
              color: hoveredButton === 'add' ? AMBER : '#999',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 18 }}>+</span> Add Activity
          </button>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              flex: 1,
              background: AMBER_LIGHT,
              border: `1px solid ${AMBER_BORDER}`,
              borderRadius: 12,
              padding: '14px 16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                fontWeight: 700,
                color: AMBER,
              }}>
                {totalActivities}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: WARM_GRAY,
                marginTop: 2,
              }}>
                Total Activities
              </div>
            </div>
            <div style={{
              flex: 1,
              background: SAGE_LIGHT,
              border: `1px solid ${SAGE_BORDER}`,
              borderRadius: 12,
              padding: '14px 16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 22,
                fontWeight: 700,
                color: SAGE,
              }}>
                {DAYS.filter(d => weekData[d].some(e => e.activity.trim())).length}/7
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: WARM_GRAY,
                marginTop: 2,
              }}>
                Days Logged
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12,
          }}>
            <button
              onClick={() => transitionTo(0)}
              style={{
                background: 'transparent',
                border: `1.5px solid rgba(0,0,0,0.10)`,
                borderRadius: 12,
                padding: '12px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: WARM_GRAY,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              Back
            </button>
            <button
              onClick={() => transitionTo(2)}
              disabled={totalActivities === 0}
              onMouseEnter={() => setHoveredButton('step1next')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                background: totalActivities === 0
                  ? '#ddd'
                  : hoveredButton === 'step1next'
                    ? AMBER
                    : `linear-gradient(135deg, ${AMBER}, #C49A38)`,
                color: totalActivities === 0 ? '#999' : '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 32px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                cursor: totalActivities === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: totalActivities > 0 && hoveredButton === 'step1next'
                  ? `0 6px 20px ${AMBER_GLOW}`
                  : 'none',
              }}
            >
              Analyze \u2192
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // Step 2: Analysis
  // ========================
  if (step === 2) {
    const allActivities = getAllActivities(weekData);

    // Compute averages
    const avgMastery = allActivities.length > 0
      ? (allActivities.reduce((sum, a) => sum + a.mastery, 0) / allActivities.length).toFixed(1)
      : '0.0';
    const avgPleasure = allActivities.length > 0
      ? (allActivities.reduce((sum, a) => sum + a.pleasure, 0) / allActivities.length).toFixed(1)
      : '0.0';

    // Count per quadrant
    const quadrantCounts = { keep: 0, necessary: 0, enjoyment: 0, reduce: 0 };
    allActivities.forEach(a => {
      quadrantCounts[getQuadrant(a.mastery, a.pleasure)]++;
    });

    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        <ProgressBar currentStep={1} />

        <div style={fadeStyle}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: '#2A2A2A',
            marginBottom: 6,
            textAlign: 'center',
          }}>
            Activity Analysis
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: WARM_GRAY,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Your activities mapped by mastery and pleasure. This shows where to
            focus for better mood.
          </p>

          {/* Average stats */}
          <div style={{
            display: 'flex',
            gap: 12,
            marginBottom: 24,
          }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: `1.5px solid ${AMBER_BORDER}`,
              borderRadius: 12,
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                color: AMBER,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                {'\u{1F3AF}'} Avg Mastery
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: AMBER,
              }}>
                {avgMastery}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#aaa',
                marginTop: 2,
              }}>
                out of 10
              </div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              border: `1.5px solid ${LAVENDER_BORDER}`,
              borderRadius: 12,
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                color: LAVENDER,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                \u2728 Avg Pleasure
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: LAVENDER,
              }}>
                {avgPleasure}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#aaa',
                marginTop: 2,
              }}>
                out of 10
              </div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1.5px solid rgba(0,0,0,0.08)',
              borderRadius: 12,
              padding: '16px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: 600,
                color: WARM_GRAY,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}>
                Activities
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: '#444',
              }}>
                {allActivities.length}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#aaa',
                marginTop: 2,
              }}>
                this week
              </div>
            </div>
          </div>

          {/* Quadrant grid */}
          <QuadrantGrid activities={allActivities} />

          {/* Insight cards */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginBottom: 24,
          }}>
            {quadrantCounts.keep > 0 && (
              <div style={{
                background: SAGE_LIGHT,
                border: `1px solid ${SAGE_BORDER}`,
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>\u2705</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: SAGE,
                    marginBottom: 3,
                  }}>
                    Strengths ({quadrantCounts.keep})
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.5,
                  }}>
                    You have activities that give you both accomplishment and joy.
                    Protect and prioritize these in your schedule.
                  </div>
                </div>
              </div>
            )}

            {quadrantCounts.enjoyment > 0 && (
              <div style={{
                background: LAVENDER_LIGHT,
                border: `1px solid ${LAVENDER_BORDER}`,
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{'\u{1F49C}'}</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: LAVENDER,
                    marginBottom: 3,
                  }}>
                    Pure Enjoyment ({quadrantCounts.enjoyment})
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.5,
                  }}>
                    These activities bring you pleasure. When you feel low, these
                    are your go-to mood lifters. Schedule more of them.
                  </div>
                </div>
              </div>
            )}

            {quadrantCounts.necessary > 0 && (
              <div style={{
                background: AMBER_LIGHT,
                border: `1px solid ${AMBER_BORDER}`,
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>{'\u{1F3AF}'}</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: AMBER,
                    marginBottom: 3,
                  }}>
                    Duty Without Joy ({quadrantCounts.necessary})
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.5,
                  }}>
                    You get things done but they drain you. Try pairing each of
                    these with a pleasure activity right after.
                  </div>
                </div>
              </div>
            )}

            {quadrantCounts.reduce > 0 && (
              <div style={{
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 12,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
              }}>
                <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0, marginTop: 1 }}>\u26A0\uFE0F</span>
                <div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: 700,
                    color: WARM_GRAY,
                    marginBottom: 3,
                  }}>
                    Low Value ({quadrantCounts.reduce})
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#666',
                    lineHeight: 1.5,
                  }}>
                    These activities give you neither accomplishment nor pleasure.
                    Consider reducing or replacing them with something more nourishing.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <button
              onClick={() => transitionTo(1)}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(0,0,0,0.10)',
                borderRadius: 12,
                padding: '12px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: WARM_GRAY,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              \u2190 Back
            </button>
            <button
              onClick={() => transitionTo(3)}
              onMouseEnter={() => setHoveredButton('step2next')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                background: hoveredButton === 'step2next'
                  ? AMBER
                  : `linear-gradient(135deg, ${AMBER}, #C49A38)`,
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 32px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: hoveredButton === 'step2next'
                  ? `0 6px 20px ${AMBER_GLOW}`
                  : 'none',
              }}
            >
              Plan Next Week \u2192
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // Step 3: Plan Next Week
  // ========================
  if (step === 3) {
    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        <ProgressBar currentStep={2} />

        <div style={fadeStyle}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: '#2A2A2A',
            marginBottom: 6,
            textAlign: 'center',
          }}>
            Plan Your Next Week
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: WARM_GRAY,
            textAlign: 'center',
            marginBottom: 8,
            lineHeight: 1.5,
          }}>
            For each day, schedule one mastery activity (accomplishment) and
            one pleasure activity (enjoyment). Type your own or pick from suggestions.
          </p>

          {/* Quick stats */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: plannedDays >= 5 ? SAGE : plannedDays >= 3 ? AMBER : '#aaa',
              fontWeight: 600,
              background: plannedDays >= 5 ? SAGE_LIGHT : plannedDays >= 3 ? AMBER_LIGHT : 'rgba(0,0,0,0.04)',
              padding: '4px 14px',
              borderRadius: 20,
            }}>
              {plannedDays}/7 days planned
            </span>
          </div>

          {/* Day tabs for planning */}
          <div style={{
            display: 'flex',
            gap: 4,
            marginBottom: 20,
            overflowX: 'auto',
            paddingBottom: 4,
          }}>
            {DAYS.map(day => {
              const isActive = day === planActiveDay;
              const hasPlans = planWeek[day].mastery.trim() || planWeek[day].pleasure.trim();
              const isComplete = planWeek[day].mastery.trim() && planWeek[day].pleasure.trim();
              return (
                <button
                  key={day}
                  onClick={() => setPlanActiveDay(day)}
                  style={{
                    flex: '1 0 auto',
                    minWidth: 52,
                    padding: '10px 12px',
                    border: isActive ? `2px solid ${AMBER}` : '2px solid transparent',
                    borderRadius: 10,
                    background: isActive
                      ? AMBER_LIGHT
                      : isComplete
                        ? SAGE_LIGHT
                        : hasPlans
                          ? 'rgba(212, 168, 67, 0.06)'
                          : 'rgba(0,0,0,0.03)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? AMBER : '#444',
                  }}>
                    {day}
                  </span>
                  {isComplete && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: SAGE,
                    }} />
                  )}
                  {hasPlans && !isComplete && (
                    <div style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      background: AMBER,
                    }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active day plan form */}
          <PlanDayRow
            key={planActiveDay}
            day={planActiveDay}
            dayFull={DAYS_FULL[DAYS.indexOf(planActiveDay)]}
            plan={planWeek[planActiveDay]}
            onUpdate={(updated) => updatePlan(planActiveDay, updated)}
          />

          {/* Quick fill hint */}
          <div style={{
            background: 'rgba(0,0,0,0.02)',
            borderRadius: 10,
            padding: '12px 16px',
            marginTop: 16,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ fontSize: 16 }}>{'\u{1F4A1}'}</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              color: '#888',
              lineHeight: 1.5,
            }}>
              Tip: Start small. Even one planned activity per day can break the
              cycle of inaction. Focus on activities from your analysis that scored
              well for pleasure.
            </span>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}>
            <button
              onClick={() => transitionTo(2)}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(0,0,0,0.10)',
                borderRadius: 12,
                padding: '12px 24px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 600,
                color: WARM_GRAY,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              \u2190 Back
            </button>
            <button
              onClick={() => {
                savePlan();
                transitionTo(4);
              }}
              disabled={plannedDays === 0}
              onMouseEnter={() => setHoveredButton('step3next')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                background: plannedDays === 0
                  ? '#ddd'
                  : hoveredButton === 'step3next'
                    ? AMBER
                    : `linear-gradient(135deg, ${AMBER}, #C49A38)`,
                color: plannedDays === 0 ? '#999' : '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 32px',
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                fontWeight: 700,
                cursor: plannedDays === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: plannedDays > 0 && hoveredButton === 'step3next'
                  ? `0 6px 20px ${AMBER_GLOW}`
                  : 'none',
              }}
            >
              Save & Review \u2192
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ========================
  // Step 4: Commitment
  // ========================
  if (step === 4) {
    return (
      <div style={containerStyle}>
        <style>{keyframes}</style>
        <ProgressBar currentStep={3} />

        <div style={fadeStyle}>
          {/* Checkmark */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: `linear-gradient(135deg, ${SAGE}, ${SAGE}cc)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 4px 16px rgba(139,168,136,0.3)`,
              animation: 'baPulse 2s ease-in-out infinite',
            }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 0,
                    animation: 'baCheckmark 0.6s ease-out 0.3s both',
                  }}
                />
              </svg>
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 22,
            fontWeight: 700,
            color: '#2A2A2A',
            marginBottom: 6,
            textAlign: 'center',
          }}>
            Your Plan is Saved
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 14,
            color: WARM_GRAY,
            textAlign: 'center',
            marginBottom: 24,
            lineHeight: 1.5,
          }}>
            Here is your week at a glance. Check in each day and rate how it went.
            Remember: doing something, even imperfectly, is always better than doing nothing.
          </p>

          {/* Week summary */}
          <WeekSummaryCard planWeek={planWeek} />

          {/* Commitment note */}
          <div style={{
            background: `linear-gradient(135deg, ${LAVENDER_LIGHT}, ${AMBER_LIGHT})`,
            border: `1.5px solid ${LAVENDER_BORDER}`,
            borderRadius: 14,
            padding: '20px 22px',
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 15,
              fontWeight: 700,
              color: LAVENDER,
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              {'\u{1F4DD}'} Daily Check-In Reminder
            </div>
            <div style={{
              fontFamily: 'var(--font-body)',
              fontSize: 14,
              color: '#555',
              lineHeight: 1.65,
            }}>
              <p style={{ margin: '0 0 8px' }}>
                Check in each day. Rate how it went. Did you do the planned
                activities? How did they make you feel?
              </p>
              <p style={{ margin: '0 0 8px' }}>
                If you miss a day, that is fine. Just pick up where you left off
                the next day. The goal is not perfection, it is pattern change.
              </p>
              <p style={{ margin: 0, fontWeight: 600, color: LAVENDER }}>
                Small actions, repeated, change how you feel.
              </p>
            </div>
          </div>

          {/* Stats summary */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 28,
          }}>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: AMBER,
                marginBottom: 4,
              }}>
                {DAYS.filter(d => planWeek[d].mastery.trim()).length}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#999',
              }}>
                Mastery days
              </div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: LAVENDER,
                marginBottom: 4,
              }}>
                {DAYS.filter(d => planWeek[d].pleasure.trim()).length}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#999',
              }}>
                Pleasure days
              </div>
            </div>
            <div style={{
              flex: 1,
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: 12,
              padding: '14px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: SAGE,
                marginBottom: 4,
              }}>
                {DAYS.filter(d => planWeek[d].mastery.trim() && planWeek[d].pleasure.trim()).length}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                color: '#999',
              }}>
                Both planned
              </div>
            </div>
          </div>

          {/* Saved indicator */}
          {saved && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              marginBottom: 20,
              animation: 'baFadeIn 0.4s ease-out',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke={SAGE}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                color: SAGE,
                fontWeight: 600,
              }}>
                Saved to your device
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            alignItems: 'center',
          }}>
            <button
              onClick={() => onComplete && onComplete()}
              onMouseEnter={() => setHoveredButton('complete')}
              onMouseLeave={() => setHoveredButton(null)}
              style={{
                width: '100%',
                maxWidth: 360,
                background: hoveredButton === 'complete'
                  ? AMBER
                  : `linear-gradient(135deg, ${AMBER}, #C49A38)`,
                color: '#fff',
                border: 'none',
                borderRadius: 14,
                padding: '16px 32px',
                fontFamily: 'var(--font-heading)',
                fontSize: 16,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                boxShadow: hoveredButton === 'complete'
                  ? `0 8px 24px ${AMBER_GLOW}`
                  : `0 4px 16px ${AMBER_GLOW}`,
                transform: hoveredButton === 'complete' ? 'translateY(-2px)' : 'none',
              }}
            >
              Continue
            </button>
            <button
              onClick={() => transitionTo(3)}
              style={{
                background: 'transparent',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 500,
                color: '#aaa',
                cursor: 'pointer',
                padding: '8px 16px',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => e.target.style.color = WARM_GRAY}
              onMouseLeave={(e) => e.target.style.color = '#aaa'}
            >
              \u2190 Edit plan
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback
  return null;
}
