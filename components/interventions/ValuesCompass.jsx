"use client";

import { useState } from 'react';

// --- Life domains ---
const DOMAINS = [
  { id: 'relationships', name: 'Relationships / Love', emoji: '\u2764\uFE0F', short: 'Relationships' },
  { id: 'work', name: 'Work / Career', emoji: '\u{1F4BC}', short: 'Work' },
  { id: 'health', name: 'Health / Body', emoji: '\u{1F3C3}', short: 'Health' },
  { id: 'play', name: 'Play / Fun', emoji: '\u{1F3AE}', short: 'Play' },
  { id: 'spirituality', name: 'Spirituality / Meaning', emoji: '\u2728', short: 'Meaning' },
  { id: 'community', name: 'Community / Contribution', emoji: '\u{1F91D}', short: 'Community' },
  { id: 'growth', name: 'Personal Growth / Learning', emoji: '\u{1F4DA}', short: 'Growth' },
  { id: 'creativity', name: 'Creativity / Self-Expression', emoji: '\u{1F3A8}', short: 'Creativity' },
];

// --- Colors ---
const SAGE = '#7A9E7E';
const SAGE_LIGHT = 'rgba(122, 158, 126, 0.10)';
const SAGE_BORDER = 'rgba(122, 158, 126, 0.25)';
const SAGE_FILL = 'rgba(122, 158, 126, 0.15)';
const LAVENDER = '#9B8EC4';
const LAVENDER_LIGHT = 'rgba(155, 142, 196, 0.10)';
const LAVENDER_BORDER = 'rgba(155, 142, 196, 0.25)';
const LAVENDER_FILL = 'rgba(155, 142, 196, 0.20)';
const PARCHMENT = '#FAF6F0';

// --- Radar chart math helpers ---
function getAngle(i, total) {
  return (2 * Math.PI * i / total) - Math.PI / 2;
}

function getPoint(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function buildPolygonPoints(cx, cy, maxRadius, ratings, total) {
  return ratings.map((r, i) => {
    const angle = getAngle(i, total);
    const radius = maxRadius * r / 10;
    const pt = getPoint(cx, cy, radius, angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');
}

function buildOctagonPoints(cx, cy, radius, total) {
  return Array.from({ length: total }, (_, i) => {
    const angle = getAngle(i, total);
    const pt = getPoint(cx, cy, radius, angle);
    return `${pt.x},${pt.y}`;
  }).join(' ');
}

// --- Step indicator ---
function StepIndicator({ current, total }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 8,
      marginBottom: 28,
    }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 28 : 8,
            height: 8,
            borderRadius: 4,
            background: i <= current ? SAGE : 'rgba(122, 158, 126, 0.15)',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      ))}
    </div>
  );
}

// --- Slider component ---
function ValueSlider({ value, onChange, label, accentColor, trackBg }) {
  const pct = ((value - 1) / 9) * 100;
  const sliderId = `slider-${label.replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 10,
      }}>
        <span style={{
          fontSize: 14,
          color: 'var(--text-secondary)',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.4,
          flex: 1,
          paddingRight: 12,
        }}>
          {label}
        </span>
        <span style={{
          fontSize: 20,
          fontWeight: 700,
          color: accentColor,
          fontFamily: "'JetBrains Mono', monospace",
          minWidth: 28,
          textAlign: 'right',
        }}>
          {value}
        </span>
      </div>
      <div style={{ position: 'relative', height: 36, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 6,
          borderRadius: 3,
          background: trackBg,
        }} />
        <div style={{
          position: 'absolute',
          left: 0,
          width: `${pct}%`,
          height: 6,
          borderRadius: 3,
          background: accentColor,
          transition: 'width 0.15s ease',
        }} />
        <input
          id={sliderId}
          type="range"
          min={1}
          max={10}
          value={value}
          onChange={e => onChange(parseInt(e.target.value))}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            width: '100%',
            height: 36,
            margin: 0,
            opacity: 0,
            cursor: 'pointer',
            zIndex: 2,
          }}
        />
        <div style={{
          position: 'absolute',
          left: `${pct}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: '#fff',
          border: `3px solid ${accentColor}`,
          boxShadow: `0 2px 8px ${accentColor}44`,
          pointerEvents: 'none',
          transition: 'left 0.15s ease',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 4,
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        opacity: 0.6,
      }}>
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}

// --- Gap bar indicator ---
function GapIndicator({ importance, alignment }) {
  const gap = importance - alignment;
  const absGap = Math.abs(gap);
  let gapLabel = '';
  let gapColor = '';

  if (absGap <= 1) {
    gapLabel = 'Aligned';
    gapColor = SAGE;
  } else if (absGap <= 3) {
    gapLabel = 'Small gap';
    gapColor = '#D4A843';
  } else if (absGap <= 5) {
    gapLabel = 'Notable gap';
    gapColor = '#D48A43';
  } else {
    gapLabel = 'Significant gap';
    gapColor = '#C4626A';
  }

  return (
    <div style={{
      padding: '14px 18px',
      borderRadius: 12,
      background: `${gapColor}0D`,
      border: `1px solid ${gapColor}30`,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      marginTop: 8,
    }}>
      <div style={{
        flex: 1,
        position: 'relative',
        height: 8,
        borderRadius: 4,
        background: 'rgba(0,0,0,0.04)',
        overflow: 'hidden',
      }}>
        {/* Importance marker */}
        <div style={{
          position: 'absolute',
          left: `${(importance / 10) * 100}%`,
          top: -2,
          width: 4,
          height: 12,
          borderRadius: 2,
          background: SAGE,
          transform: 'translateX(-50%)',
          zIndex: 2,
        }} />
        {/* Alignment marker */}
        <div style={{
          position: 'absolute',
          left: `${(alignment / 10) * 100}%`,
          top: -2,
          width: 4,
          height: 12,
          borderRadius: 2,
          background: LAVENDER,
          transform: 'translateX(-50%)',
          zIndex: 2,
        }} />
        {/* Gap fill */}
        {gap > 0 && (
          <div style={{
            position: 'absolute',
            left: `${(alignment / 10) * 100}%`,
            width: `${(gap / 10) * 100}%`,
            top: 0,
            height: '100%',
            borderRadius: 4,
            background: `${gapColor}40`,
          }} />
        )}
      </div>
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        color: gapColor,
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: 'nowrap',
        minWidth: 90,
        textAlign: 'right',
      }}>
        {gap > 0 ? `Gap: ${gap}` : gapLabel}
      </div>
    </div>
  );
}

// --- Radar chart SVG ---
function RadarChart({ importanceRatings, alignmentRatings, domains }) {
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const maxRadius = size / 2 - 60;
  const total = domains.length;
  const refLevels = [0.25, 0.5, 0.75, 1.0];

  const importancePoints = buildPolygonPoints(cx, cy, maxRadius, importanceRatings, total);
  const alignmentPoints = buildPolygonPoints(cx, cy, maxRadius, alignmentRatings, total);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      padding: '8px 0',
    }}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="auto"
        style={{
          maxWidth: 380,
          filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.06))',
        }}
      >
        {/* Background circle */}
        <circle
          cx={cx}
          cy={cy}
          r={maxRadius + 6}
          fill={PARCHMENT}
          stroke="rgba(0,0,0,0.04)"
          strokeWidth={1}
        />

        {/* Reference octagons */}
        {refLevels.map((level, idx) => (
          <polygon
            key={`ref-${idx}`}
            points={buildOctagonPoints(cx, cy, maxRadius * level, total)}
            fill="none"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth={1}
            strokeDasharray={level === 0.5 ? '4,3' : 'none'}
          />
        ))}

        {/* Axis lines */}
        {domains.map((_, i) => {
          const angle = getAngle(i, total);
          const endPt = getPoint(cx, cy, maxRadius, angle);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={endPt.x}
              y2={endPt.y}
              stroke="rgba(0,0,0,0.07)"
              strokeWidth={1}
            />
          );
        })}

        {/* Importance polygon (outer, dashed) */}
        <polygon
          points={importancePoints}
          fill={SAGE_FILL}
          stroke={SAGE}
          strokeWidth={2.5}
          strokeDasharray="8,4"
          strokeLinejoin="round"
        />

        {/* Alignment polygon (inner, filled) */}
        <polygon
          points={alignmentPoints}
          fill={LAVENDER_FILL}
          stroke={LAVENDER}
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Importance points */}
        {importanceRatings.map((r, i) => {
          const angle = getAngle(i, total);
          const radius = maxRadius * r / 10;
          const pt = getPoint(cx, cy, radius, angle);
          return (
            <circle
              key={`imp-dot-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#fff"
              stroke={SAGE}
              strokeWidth={2}
            />
          );
        })}

        {/* Alignment points */}
        {alignmentRatings.map((r, i) => {
          const angle = getAngle(i, total);
          const radius = maxRadius * r / 10;
          const pt = getPoint(cx, cy, radius, angle);
          return (
            <circle
              key={`align-dot-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={4}
              fill="#fff"
              stroke={LAVENDER}
              strokeWidth={2}
            />
          );
        })}

        {/* Axis labels */}
        {domains.map((domain, i) => {
          const angle = getAngle(i, total);
          const labelRadius = maxRadius + 28;
          const pt = getPoint(cx, cy, labelRadius, angle);

          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';

          let dy = 0;
          if (Math.sin(angle) > 0.3) dy = 4;
          else if (Math.sin(angle) < -0.3) dy = -2;

          return (
            <g key={`label-${i}`}>
              <text
                x={pt.x}
                y={pt.y}
                dy={dy}
                textAnchor={textAnchor}
                style={{
                  fontSize: 11,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  fill: '#5A5A5A',
                }}
              >
                {domain.emoji} {domain.short}
              </text>
            </g>
          );
        })}

        {/* Center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(0,0,0,0.12)" />

        {/* Scale labels on top axis */}
        {refLevels.map((level, idx) => {
          const val = Math.round(level * 10);
          const yPos = cy - maxRadius * level;
          return (
            <text
              key={`scale-${idx}`}
              x={cx + 6}
              y={yPos - 3}
              style={{
                fontSize: 9,
                fontFamily: "'JetBrains Mono', monospace",
                fill: 'rgba(0,0,0,0.25)',
              }}
            >
              {val}
            </text>
          );
        })}
      </svg>
    </div>
  );
}


// ==================================================================
// Main component
// ==================================================================
export default function ValuesCompass({ onComplete, emotion }) {
  // Steps: 0=intro, 1-8=domain rating cards, 9=radar+analysis, 10=action, 11=completion
  const [step, setStep] = useState(0);

  // Ratings per domain { importance, alignment }
  const [ratings, setRatings] = useState(
    DOMAINS.map(() => ({ importance: 5, alignment: 5 }))
  );

  // Action commitment text
  const [commitment, setCommitment] = useState('');

  // Track which domain is currently active (0-7 for steps 1-8)
  const currentDomainIndex = step - 1;

  // Update a specific domain's importance
  function setImportance(domainIdx, val) {
    setRatings(prev => {
      const next = [...prev];
      next[domainIdx] = { ...next[domainIdx], importance: val };
      return next;
    });
  }

  // Update a specific domain's alignment
  function setAlignment(domainIdx, val) {
    setRatings(prev => {
      const next = [...prev];
      next[domainIdx] = { ...next[domainIdx], alignment: val };
      return next;
    });
  }

  // Compute the biggest gap
  function findBiggestGap() {
    let maxGap = -1;
    let maxIdx = 0;
    ratings.forEach((r, i) => {
      const gap = r.importance - r.alignment;
      if (gap > maxGap) {
        maxGap = gap;
        maxIdx = i;
      }
    });
    return { index: maxIdx, gap: maxGap, domain: DOMAINS[maxIdx], rating: ratings[maxIdx] };
  }

  // Save to localStorage
  function saveResults() {
    const data = {
      timestamp: new Date().toISOString(),
      emotion: emotion || 'sad',
      domains: DOMAINS.map((d, i) => ({
        id: d.id,
        name: d.name,
        importance: ratings[i].importance,
        alignment: ratings[i].alignment,
        gap: ratings[i].importance - ratings[i].alignment,
      })),
      biggestGap: findBiggestGap(),
      commitment,
    };
    try {
      localStorage.setItem('values_compass_results', JSON.stringify(data));
    } catch (e) {
      // localStorage may be unavailable
    }
  }


  // ========================
  // STEP 0: INTRO
  // ========================
  if (step === 0) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, textAlign: 'center', padding: '48px 24px', maxWidth: 560, margin: '0 auto' }}>
          {/* ACT badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 20,
            background: SAGE_LIGHT,
            border: `1px solid ${SAGE_BORDER}`,
            fontSize: 12,
            fontWeight: 600,
            color: SAGE,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 28,
          }}>
            ACT {'\u00B7'} Values Compass
          </div>

          {/* Compass icon */}
          <div style={{
            fontSize: 56,
            marginBottom: 28,
            lineHeight: 1,
          }}>
            {'\u{1F9ED}'}
          </div>

          <h2 style={{
            ...styles.heading,
            textAlign: 'center',
            marginBottom: 20,
          }}>
            Sometimes sadness is a signal that you{'\u2019'}ve drifted from what matters most.
          </h2>

          <p style={{
            ...styles.subtext,
            maxWidth: 440,
            margin: '0 auto 12px',
          }}>
            This exercise maps eight life domains against how you{'\u2019'}re actually living right now {'\u2014'} and reveals where the gap lives.
          </p>

          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 auto 36px',
            maxWidth: 400,
          }}>
            It takes about 5 minutes. At the end, you{'\u2019'}ll see a compass showing exactly where to point your energy.
          </p>

          <button onClick={() => setStep(1)} style={styles.primaryBtn}>
            Begin the compass {'\u2192'}
          </button>
        </div>
        <style>{`
          @keyframes valuesCompassFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }


  // ========================
  // STEPS 1-8: DOMAIN RATING CARDS
  // ========================
  if (step >= 1 && step <= 8) {
    const domain = DOMAINS[currentDomainIndex];
    const rating = ratings[currentDomainIndex];
    const gap = rating.importance - rating.alignment;

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '32px 24px', maxWidth: 520, margin: '0 auto' }}>
          {/* Progress */}
          <StepIndicator current={currentDomainIndex} total={8} />

          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: SAGE,
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Domain {step} of 8
          </div>

          {/* Domain card */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '32px 28px',
            border: `1.5px solid ${SAGE_BORDER}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            marginBottom: 28,
          }}>
            {/* Domain header */}
            <div style={{
              textAlign: 'center',
              marginBottom: 28,
            }}>
              <div style={{
                fontSize: 44,
                marginBottom: 12,
                lineHeight: 1,
              }}>
                {domain.emoji}
              </div>
              <h3 style={{
                fontFamily: "'Fraunces', serif",
                fontSize: 'clamp(1.2rem, 3.5vw, 1.6rem)',
                fontWeight: 600,
                color: 'var(--text-primary)',
                margin: '0 0 4px',
                lineHeight: 1.3,
              }}>
                {domain.name}
              </h3>
            </div>

            {/* Divider */}
            <div style={{
              width: 40,
              height: 1,
              background: SAGE_BORDER,
              margin: '0 auto 28px',
            }} />

            {/* Importance slider */}
            <ValueSlider
              value={rating.importance}
              onChange={(val) => setImportance(currentDomainIndex, val)}
              label="How important is this to you?"
              accentColor={SAGE}
              trackBg={SAGE_LIGHT}
            />

            {/* Alignment slider */}
            <ValueSlider
              value={rating.alignment}
              onChange={(val) => setAlignment(currentDomainIndex, val)}
              label="How aligned is your life with this value RIGHT NOW?"
              accentColor={LAVENDER}
              trackBg={LAVENDER_LIGHT}
            />

            {/* Gap indicator */}
            <GapIndicator importance={rating.importance} alignment={rating.alignment} />
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: step > 1 ? 'space-between' : 'center',
            alignItems: 'center',
            gap: 12,
          }}>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                style={styles.secondaryBtn}
              >
                {'\u2190'} Back
              </button>
            )}
            <button
              onClick={() => setStep(step + 1)}
              style={styles.primaryBtn}
            >
              {step < 8 ? `Next domain \u2192` : `See your compass \u2192`}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes valuesCompassFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }


  // ========================
  // STEP 9: RADAR CHART + GAP ANALYSIS
  // ========================
  if (step === 9) {
    const importanceRatings = ratings.map(r => r.importance);
    const alignmentRatings = ratings.map(r => r.alignment);
    const biggest = findBiggestGap();

    // Sort domains by gap descending
    const gapList = DOMAINS.map((d, i) => ({
      domain: d,
      importance: ratings[i].importance,
      alignment: ratings[i].alignment,
      gap: ratings[i].importance - ratings[i].alignment,
    })).sort((a, b) => b.gap - a.gap);

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '32px 24px', maxWidth: 560, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: SAGE,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}>
              Your Values Compass
            </div>
            <h2 style={{
              ...styles.heading,
              textAlign: 'center',
              marginBottom: 8,
            }}>
              Here{'\u2019'}s what the map looks like
            </h2>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              The gap between the two shapes is where sadness often lives.
            </p>
          </div>

          {/* Radar chart */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '24px 16px 20px',
            border: `1.5px solid rgba(0,0,0,0.06)`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            marginBottom: 20,
          }}>
            <RadarChart
              importanceRatings={importanceRatings}
              alignmentRatings={alignmentRatings}
              domains={DOMAINS}
            />

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 16,
              paddingTop: 16,
              borderTop: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: SAGE,
                  borderTop: `2px dashed ${SAGE}`,
                }} />
                <span style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Importance
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20,
                  height: 10,
                  borderRadius: 3,
                  background: LAVENDER_FILL,
                  border: `1.5px solid ${LAVENDER}`,
                }} />
                <span style={{
                  fontSize: 12,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Alignment
                </span>
              </div>
            </div>
          </div>

          {/* Biggest gap callout */}
          {biggest.gap > 0 && (
            <div style={{
              background: 'rgba(196, 98, 106, 0.06)',
              border: '1px solid rgba(196, 98, 106, 0.15)',
              borderRadius: 16,
              padding: '20px 24px',
              marginBottom: 20,
            }}>
              <div style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#C4626A',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 10,
              }}>
                {'\u{1F3AF}'} Biggest value gap
              </div>
              <p style={{
                fontSize: 15,
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Your biggest value gap is in{' '}
                <strong style={{ color: '#C4626A' }}>{biggest.domain.name}</strong>
                : it{'\u2019'}s a{' '}
                <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{biggest.rating.importance}</strong>
                {' '}in importance but a{' '}
                <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>{biggest.rating.alignment}</strong>
                {' '}in alignment.
              </p>
            </div>
          )}

          {/* All domains ranked by gap */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            border: '1px solid rgba(0,0,0,0.06)',
            marginBottom: 28,
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 16,
            }}>
              All domains by gap
            </div>
            {gapList.map((item, idx) => (
              <div
                key={item.domain.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: idx < gapList.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                }}
              >
                <span style={{ fontSize: 18, width: 32 }}>{item.domain.emoji}</span>
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  color: 'var(--text-primary)',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 500,
                }}>
                  {item.domain.short}
                </span>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span style={{
                    fontSize: 12,
                    color: SAGE,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    minWidth: 16,
                    textAlign: 'right',
                  }}>
                    {item.importance}
                  </span>
                  <div style={{
                    width: 60,
                    height: 6,
                    borderRadius: 3,
                    background: 'rgba(0,0,0,0.04)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      height: '100%',
                      width: `${(item.alignment / 10) * 100}%`,
                      borderRadius: 3,
                      background: item.gap > 3 ? '#C4626A' : item.gap > 1 ? '#D4A843' : SAGE,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <span style={{
                    fontSize: 12,
                    color: LAVENDER,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 600,
                    minWidth: 16,
                    textAlign: 'right',
                  }}>
                    {item.alignment}
                  </span>
                  <span style={{
                    fontSize: 11,
                    color: item.gap > 3 ? '#C4626A' : item.gap > 1 ? '#D4A843' : SAGE,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontWeight: 700,
                    minWidth: 28,
                    textAlign: 'right',
                  }}>
                    {item.gap > 0 ? `\u2212${item.gap}` : item.gap === 0 ? '=' : `+${Math.abs(item.gap)}`}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Continue */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button onClick={() => setStep(8)} style={styles.secondaryBtn}>
              {'\u2190'} Back
            </button>
            <button onClick={() => setStep(10)} style={styles.primaryBtn}>
              Close the gap {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes valuesCompassFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }


  // ========================
  // STEP 10: ACTION STEP
  // ========================
  if (step === 10) {
    const biggest = findBiggestGap();

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 520, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: SAGE,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 12,
            }}>
              One small step
            </div>
            <h2 style={{
              ...styles.heading,
              textAlign: 'center',
              marginBottom: 12,
            }}>
              What{'\u2019'}s one small step you could take this week to close that gap?
            </h2>
            {biggest.gap > 0 && (
              <p style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: '0 auto',
                maxWidth: 400,
              }}>
                Think about{' '}
                <strong style={{ color: LAVENDER }}>{biggest.domain.name}</strong>
                {' '}{'\u2014'} even the smallest action counts.
              </p>
            )}
          </div>

          {/* Domain context card */}
          <div style={{
            background: SAGE_LIGHT,
            border: `1px solid ${SAGE_BORDER}`,
            borderRadius: 16,
            padding: '18px 22px',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <span style={{ fontSize: 36 }}>{biggest.domain.emoji}</span>
            <div>
              <div style={{
                fontSize: 15,
                fontWeight: 600,
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: 2,
              }}>
                {biggest.domain.name}
              </div>
              <div style={{
                fontSize: 13,
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Importance: {biggest.rating.importance} {'\u00B7'} Alignment: {biggest.rating.alignment} {'\u00B7'} Gap: {biggest.gap}
              </div>
            </div>
          </div>

          {/* Commitment input */}
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '24px',
            border: `1.5px solid ${LAVENDER_BORDER}`,
            marginBottom: 28,
          }}>
            <label style={{
              display: 'block',
              fontSize: 14,
              color: 'var(--text-secondary)',
              fontFamily: "'DM Sans', sans-serif",
              marginBottom: 12,
              lineHeight: 1.5,
            }}>
              My commitment for this week:
            </label>
            <textarea
              value={commitment}
              onChange={e => setCommitment(e.target.value)}
              placeholder={'e.g., "Call my mom on Wednesday evening" or "Go for a 10-minute walk after lunch"'}
              rows={4}
              style={{
                width: '100%',
                padding: '16px 18px',
                border: `1.5px solid ${LAVENDER_BORDER}`,
                borderRadius: 12,
                background: LAVENDER_LIGHT,
                fontSize: 15,
                color: 'var(--text-primary)',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: 1.6,
                resize: 'none',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={e => { e.target.style.borderColor = LAVENDER; }}
              onBlur={e => { e.target.style.borderColor = LAVENDER_BORDER; }}
            />
          </div>

          {/* Suggestions */}
          <div style={{
            background: 'rgba(0,0,0,0.02)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 28,
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--text-muted)',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}>
              Need ideas? Think small:
            </div>
            <ul style={{
              margin: 0,
              paddingLeft: 18,
              fontSize: 14,
              color: 'var(--text-secondary)',
              lineHeight: 2,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              <li>A 5-minute phone call to someone you miss</li>
              <li>Writing one sentence in a journal</li>
              <li>A 10-minute walk with no phone</li>
              <li>Signing up for something you{'\u2019'}ve been avoiding</li>
              <li>Saying no to one thing that drains you</li>
            </ul>
          </div>

          {/* Navigation */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <button onClick={() => setStep(9)} style={styles.secondaryBtn}>
              {'\u2190'} Back
            </button>
            <button
              onClick={() => {
                saveResults();
                setStep(11);
              }}
              disabled={!commitment.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: commitment.trim() ? 1 : 0.4,
                cursor: commitment.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Complete {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes valuesCompassFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }


  // ========================
  // STEP 11: COMPLETION
  // ========================
  if (step === 11) {
    const importanceRatings = ratings.map(r => r.importance);
    const alignmentRatings = ratings.map(r => r.alignment);
    const biggest = findBiggestGap();

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, padding: '40px 24px', maxWidth: 560, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              fontSize: 48,
              marginBottom: 16,
              lineHeight: 1,
            }}>
              {'\u{1F9ED}'}
            </div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 20,
              background: SAGE_LIGHT,
              border: `1px solid ${SAGE_BORDER}`,
              fontSize: 11,
              fontWeight: 600,
              color: SAGE,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 20,
            }}>
              Values compass {'\u00B7'} Complete
            </div>
            <h2 style={{
              ...styles.heading,
              textAlign: 'center',
              marginBottom: 12,
            }}>
              You just mapped what matters
            </h2>
          </div>

          {/* Mini radar chart */}
          <div style={{
            background: '#fff',
            borderRadius: 20,
            padding: '20px 12px 16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            marginBottom: 24,
          }}>
            <RadarChart
              importanceRatings={importanceRatings}
              alignmentRatings={alignmentRatings}
              domains={DOMAINS}
            />

            {/* Legend */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 24,
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: SAGE,
                  borderTop: `2px dashed ${SAGE}`,
                }} />
                <span style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Importance
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 20,
                  height: 10,
                  borderRadius: 3,
                  background: LAVENDER_FILL,
                  border: `1.5px solid ${LAVENDER}`,
                }} />
                <span style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  Alignment
                </span>
              </div>
            </div>
          </div>

          {/* Commitment card */}
          <div style={{
            background: SAGE_LIGHT,
            border: `1px solid ${SAGE_BORDER}`,
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 24,
          }}>
            <div style={{
              fontSize: 12,
              fontWeight: 600,
              color: SAGE,
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}>
              {'\u{1F331}'} Your commitment
            </div>
            <p style={{
              fontSize: 15,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              margin: 0,
              fontStyle: 'italic',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              {'\u201C'}{commitment}{'\u201D'}
            </p>
            {biggest.gap > 0 && (
              <div style={{
                marginTop: 12,
                fontSize: 13,
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Closing the gap in {biggest.domain.short} {'\u00B7'} {biggest.domain.emoji}
              </div>
            )}
          </div>

          {/* Closing message */}
          <div style={{
            textAlign: 'center',
            marginBottom: 32,
          }}>
            <p style={{
              fontSize: 16,
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              fontWeight: 500,
              margin: '0 0 12px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              Sadness often lives in the gap between what matters and what you{'\u2019'}re doing.
            </p>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 8px',
              fontFamily: "'DM Sans', sans-serif",
            }}>
              You just identified the gap {'\u2014'} and you have a step.
            </p>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: 0,
              fontFamily: "'DM Sans', sans-serif",
            }}>
              That{'\u2019'}s not nothing. That{'\u2019'}s direction.
            </p>
          </div>

          {/* Continue button */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={onComplete} style={styles.primaryBtn}>
              Continue {'\u2192'}
            </button>
          </div>
        </div>
        <style>{`
          @keyframes valuesCompassFadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // Fallback
  return null;
}


// ==================================================================
// Styles
// ==================================================================
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'valuesCompassFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
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
    fontFamily: "'DM Sans', sans-serif",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: SAGE,
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: `0 4px 16px rgba(122, 158, 126, 0.3)`,
  },
  secondaryBtn: {
    padding: '14px 28px',
    borderRadius: 50,
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1.5px solid rgba(0,0,0,0.08)',
    fontSize: 15,
    fontWeight: 500,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};
