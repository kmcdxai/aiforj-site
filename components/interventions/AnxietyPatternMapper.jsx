"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// --- Constants ---
const CATEGORIES = [
  { key: 'trigger', label: 'Trigger', color: '#6B98B8' },
  { key: 'thoughts', label: 'Thoughts', color: '#9B8EC4' },
  { key: 'sensations', label: 'Sensations', color: '#6B98B8' },
  { key: 'emotions', label: 'Emotions', color: '#9B8EC4' },
  { key: 'behaviors', label: 'Behaviors', color: '#6B98B8' },
  { key: 'consequences', label: 'Consequences', color: '#9B8EC4' },
];

const SENSATION_OPTIONS = [
  'Racing heart', 'Tight chest', 'Churning stomach', 'Tense shoulders',
  'Sweaty palms', 'Shallow breathing', 'Dizziness', 'Headache',
];

const EMOTION_OPTIONS = [
  'Fear', 'Dread', 'Panic', 'Worry', 'Frustration', 'Shame', 'Helplessness',
];

const BEHAVIOR_OPTIONS = [
  'Avoid', 'Seek reassurance', 'Check repeatedly', 'Overthink',
  'Withdraw', 'Snap at others', 'Freeze', 'Procrastinate',
];

const BREAK_RECOMMENDATIONS = {
  trigger: 'Change your environment or reduce exposure to this trigger. Even small changes to context can disrupt the pattern before it starts.',
  thoughts: 'Cognitive restructuring tools target this link. Question the thought, look for evidence, or try a thought record to loosen its grip.',
  sensations: 'Body-based tools like grounding, breathing exercises, and progressive muscle relaxation can interrupt the physical response.',
  emotions: 'Emotion regulation skills work here. Naming the emotion, self-compassion, and distress tolerance techniques can shift this part of the cycle.',
  behaviors: 'Behavioral experiments and opposite action can break this link. What would happen if you did the opposite of your usual response?',
  consequences: 'Planning tools and pre-commitments can change outcomes. Deciding in advance how you will respond shifts the consequences.',
};

// --- Oval layout for desktop cycle diagram ---
const OVAL_CX = 280;
const OVAL_CY = 195;
const OVAL_RX = 200;
const OVAL_RY = 145;

function getOvalNodePositions() {
  // 6 nodes around an oval, starting at top, going clockwise
  const angles = [
    -Math.PI / 2,           // top (Trigger)
    -Math.PI / 6,           // upper-right (Thoughts)
    Math.PI / 6,            // lower-right (Sensations)
    Math.PI / 2,            // bottom (Emotions)
    Math.PI * 5 / 6,        // lower-left (Behaviors)
    Math.PI * 7 / 6,        // upper-left (Consequences)
  ];
  return angles.map((angle, i) => ({
    x: OVAL_CX + OVAL_RX * Math.cos(angle),
    y: OVAL_CY + OVAL_RY * Math.sin(angle),
    key: CATEGORIES[i].key,
    label: CATEGORIES[i].label,
    color: CATEGORIES[i].color,
    angle,
  }));
}

// Generate a curved SVG path between two oval nodes (following the oval arc)
function getCurvedPath(from, to, idx) {
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  // Pull control point toward oval center for a slight curve
  const pull = 0.18;
  const cx = mx + (OVAL_CX - mx) * pull;
  const cy = my + (OVAL_CY - my) * pull;
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
}

// --- Cycle Diagram SVG (Desktop) ---
function CycleDiagramDesktop({ data, step, breakPoint, onSelectBreak, animationPhase }) {
  const nodes = getOvalNodePositions();
  const nodeW = 112;
  const nodeH = 66;

  const getTruncatedItems = (key) => {
    if (key === 'trigger') return data.trigger ? [data.trigger.length > 28 ? data.trigger.slice(0, 25) + '...' : data.trigger] : [];
    if (key === 'thoughts') return (data.thoughts || []).slice(0, 2).map(t => t.length > 22 ? t.slice(0, 19) + '...' : t);
    if (key === 'sensations') return (data.sensations || []).slice(0, 2).map(s => s.length > 22 ? s.slice(0, 19) + '...' : s);
    if (key === 'emotions') return (data.emotions || []).slice(0, 2).map(e => e.name ? (e.name.length > 18 ? e.name.slice(0, 15) + '...' : e.name) : '');
    if (key === 'behaviors') return (data.behaviors || []).slice(0, 2).map(b => b.length > 22 ? b.slice(0, 19) + '...' : b);
    if (key === 'consequences') {
      const short = data.consequencesShort || '';
      return short ? [short.length > 26 ? short.slice(0, 23) + '...' : short] : [];
    }
    return [];
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24,
      animation: 'apmFadeIn 0.6s ease',
    }}>
      <svg
        viewBox="0 0 560 390"
        width="100%"
        style={{ maxWidth: 540, overflow: 'visible' }}
        aria-label="Anxiety cycle diagram showing trigger, thoughts, sensations, emotions, behaviors, and consequences"
      >
        <defs>
          <marker
            id="apm-arrowhead"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 4 L 0 8 Z" fill="#6B98B8" opacity="0.6" />
          </marker>
          <marker
            id="apm-arrowhead-lav"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 4 L 0 8 Z" fill="#9B8EC4" opacity="0.6" />
          </marker>
          <marker
            id="apm-arrowhead-break"
            markerWidth="10"
            markerHeight="8"
            refX="9"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M 0 0 L 10 4 L 0 8 Z" fill="#E8634A" opacity="0.8" />
          </marker>
          <filter id="apm-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.08)" />
          </filter>
          <filter id="apm-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor="#6B98B8" floodOpacity="0.2" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting arrows */}
        {nodes.map((node, i) => {
          const next = nodes[(i + 1) % 6];
          const pathD = getCurvedPath(node, next, i);
          const isBreakArrow = breakPoint && (node.key === breakPoint || next.key === breakPoint);
          const arrowColor = isBreakArrow ? '#E8634A' : (i % 2 === 0 ? 'rgba(107,152,184,0.35)' : 'rgba(155,142,196,0.35)');
          const markerId = isBreakArrow ? 'apm-arrowhead-break' : (i % 2 === 0 ? 'apm-arrowhead' : 'apm-arrowhead-lav');
          return (
            <path
              key={`arrow-${i}`}
              d={pathD}
              fill="none"
              stroke={arrowColor}
              strokeWidth={isBreakArrow ? 2.5 : 2}
              strokeDasharray={isBreakArrow ? '6 4' : 'none'}
              markerEnd={`url(#${markerId})`}
              style={{
                opacity: animationPhase >= 2 ? 1 : 0,
                strokeDashoffset: animationPhase >= 2 ? 0 : 300,
                transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.12}s`,
              }}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const items = getTruncatedItems(node.key);
          const isBreak = breakPoint === node.key;
          const isSelectable = step === 9;
          const nx = node.x - nodeW / 2;
          const ny = node.y - nodeH / 2;

          return (
            <g
              key={node.key}
              style={{
                opacity: animationPhase >= 1 ? 1 : 0,
                transform: animationPhase >= 1 ? 'translateY(0)' : 'translateY(8px)',
                transition: `all 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
                cursor: isSelectable ? 'pointer' : 'default',
              }}
              onClick={isSelectable ? () => onSelectBreak(node.key) : undefined}
            >
              {/* Glow ring for break point */}
              {isBreak && (
                <rect
                  x={nx - 4}
                  y={ny - 4}
                  width={nodeW + 8}
                  height={nodeH + 8}
                  rx={16}
                  fill="none"
                  stroke="#E8634A"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  style={{ animation: 'apmPulseBreak 2s ease-in-out infinite' }}
                />
              )}
              {/* Node background */}
              <rect
                x={nx}
                y={ny}
                width={nodeW}
                height={nodeH}
                rx={12}
                fill={isBreak ? 'rgba(232,99,74,0.08)' : 'var(--surface-elevated)'}
                stroke={isBreak ? '#E8634A' : node.color}
                strokeWidth={isBreak ? 2 : 1.5}
                filter="url(#apm-shadow)"
                style={{ transition: 'all 0.3s ease' }}
              />
              {/* Category label */}
              <text
                x={node.x}
                y={ny + 18}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fontFamily="'JetBrains Mono', monospace"
                fill={isBreak ? '#E8634A' : node.color}
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                {node.label}
              </text>
              {/* Items */}
              {items.map((item, j) => (
                <text
                  key={j}
                  x={node.x}
                  y={ny + 32 + j * 14}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontFamily="'DM Sans', sans-serif"
                  fill="var(--text-secondary)"
                >
                  {item}
                </text>
              ))}
              {/* Selectable hover hint */}
              {isSelectable && !isBreak && (
                <rect
                  x={nx}
                  y={ny}
                  width={nodeW}
                  height={nodeH}
                  rx={12}
                  fill="transparent"
                  stroke="transparent"
                  strokeWidth={2}
                  style={{ transition: 'stroke 0.2s ease' }}
                  onMouseEnter={e => { e.target.style.stroke = 'rgba(232,99,74,0.4)'; }}
                  onMouseLeave={e => { e.target.style.stroke = 'transparent'; }}
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Cycle Diagram (Mobile vertical list) ---
function CycleDiagramMobile({ data, step, breakPoint, onSelectBreak, animationPhase }) {
  const getTruncatedItems = (key) => {
    if (key === 'trigger') return data.trigger ? [data.trigger.length > 40 ? data.trigger.slice(0, 37) + '...' : data.trigger] : [];
    if (key === 'thoughts') return (data.thoughts || []).slice(0, 2).map(t => t.length > 35 ? t.slice(0, 32) + '...' : t);
    if (key === 'sensations') return (data.sensations || []).slice(0, 2).map(s => s.length > 35 ? s.slice(0, 32) + '...' : s);
    if (key === 'emotions') return (data.emotions || []).slice(0, 2).map(e => e.name ? (e.name.length > 30 ? e.name.slice(0, 27) + '...' : e.name) : '');
    if (key === 'behaviors') return (data.behaviors || []).slice(0, 2).map(b => b.length > 35 ? b.slice(0, 32) + '...' : b);
    if (key === 'consequences') {
      const short = data.consequencesShort || '';
      return short ? [short.length > 38 ? short.slice(0, 35) + '...' : short] : [];
    }
    return [];
  };

  const isSelectable = step === 9;

  return (
    <div style={{ marginBottom: 24 }}>
      {CATEGORIES.map((cat, i) => {
        const items = getTruncatedItems(cat.key);
        const isBreak = breakPoint === cat.key;
        return (
          <div key={cat.key}>
            <div
              onClick={isSelectable ? () => onSelectBreak(cat.key) : undefined}
              style={{
                padding: '14px 16px',
                borderRadius: 12,
                border: isBreak ? '2px dashed #E8634A' : `1.5px solid ${cat.color}33`,
                background: isBreak ? 'rgba(232,99,74,0.06)' : 'var(--surface-elevated)',
                cursor: isSelectable ? 'pointer' : 'default',
                opacity: animationPhase >= 1 ? 1 : 0,
                transform: animationPhase >= 1 ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
                animation: isBreak ? 'apmPulseBreak 2s ease-in-out infinite' : 'none',
              }}
            >
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "'JetBrains Mono', monospace",
                color: isBreak ? '#E8634A' : cat.color,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 4,
              }}>
                {cat.label}
              </div>
              {items.map((item, j) => (
                <div key={j} style={{
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  fontFamily: "'DM Sans', sans-serif",
                  lineHeight: 1.4,
                }}>
                  {item}
                </div>
              ))}
            </div>
            {/* Downward arrow */}
            {i < 5 && (
              <div style={{
                textAlign: 'center',
                padding: '6px 0',
                opacity: animationPhase >= 2 ? 0.5 : 0,
                transition: `opacity 0.5s ease ${0.5 + i * 0.1}s`,
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <path d="M10 4 L10 14 M6 11 L10 15 L14 11" stroke={CATEGORIES[i].color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
            {/* Loop-back arrow after last node */}
            {i === 5 && (
              <div style={{
                textAlign: 'center',
                padding: '8px 0 4px',
                opacity: animationPhase >= 2 ? 0.5 : 0,
                transition: `opacity 0.5s ease ${0.5 + 5 * 0.1}s`,
              }}>
                <svg width="80" height="28" viewBox="0 0 80 28">
                  <path d="M40 2 C60 2, 70 14, 60 22 L44 22 M48 18 L44 22 L48 26" stroke="#9B8EC4" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="18" y="17" fontSize="8" fontFamily="'JetBrains Mono', monospace" fill="var(--text-muted)" opacity="0.6">loop</text>
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Responsive wrapper picks desktop vs mobile ---
function CycleDiagram(props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile ? <CycleDiagramMobile {...props} /> : <CycleDiagramDesktop {...props} />;
}

// --- Progress indicator ---
function StepProgress({ currentStep, totalSteps }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 6,
      marginBottom: 28,
    }}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          style={{
            width: i + 1 === currentStep ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: i + 1 <= currentStep ? '#6B98B8' : 'rgba(107,152,184,0.15)',
            transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      ))}
    </div>
  );
}

// --- Chip component (selectable) ---
function Chip({ label, selected, onToggle, accentColor }) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: '8px 16px',
        borderRadius: 20,
        border: `1.5px solid ${selected ? accentColor : 'rgba(107,152,184,0.15)'}`,
        background: selected ? `${accentColor}12` : 'var(--surface-elevated)',
        color: selected ? accentColor : 'var(--text-secondary)',
        fontSize: 14,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: selected ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: selected ? `0 2px 8px ${accentColor}20` : '0 1px 4px rgba(0,0,0,0.03)',
      }}
    >
      {label}
      {selected && <span style={{ marginLeft: 6, fontSize: 12 }}>{'\u2713'}</span>}
    </button>
  );
}

// --- Pill for added thoughts ---
function Pill({ label, onRemove }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 14px',
      borderRadius: 20,
      background: 'rgba(155,142,196,0.1)',
      border: '1px solid rgba(155,142,196,0.2)',
      fontSize: 14,
      color: 'var(--text-primary)',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: 14,
          padding: '0 2px',
          lineHeight: 1,
        }}
        aria-label={`Remove ${label}`}
      >
        {'\u00D7'}
      </button>
    </div>
  );
}

// --- Mini intensity slider ---
function IntensitySlider({ value, onChange, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
    }}>
      <span style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        minWidth: 12,
      }}>
        1
      </span>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={e => onChange(parseInt(e.target.value))}
        style={{
          flex: 1,
          height: 4,
          appearance: 'none',
          WebkitAppearance: 'none',
          background: `linear-gradient(to right, ${color} 0%, ${color} ${(value - 1) / 9 * 100}%, rgba(107,152,184,0.15) ${(value - 1) / 9 * 100}%, rgba(107,152,184,0.15) 100%)`,
          borderRadius: 2,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
      <span style={{
        fontSize: 11,
        color: 'var(--text-muted)',
        fontFamily: "'JetBrains Mono', monospace",
        minWidth: 16,
      }}>
        10
      </span>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        color: color,
        fontFamily: "'JetBrains Mono', monospace",
        minWidth: 20,
        textAlign: 'right',
      }}>
        {value}
      </span>
    </div>
  );
}

// --- Main Component ---
export default function AnxietyPatternMapper({ onComplete }) {
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]);

  // Data collection state
  const [trigger, setTrigger] = useState('');
  const [thoughts, setThoughts] = useState([]);
  const [thoughtInput, setThoughtInput] = useState('');
  const [sensations, setSensations] = useState([]);
  const [customSensation, setCustomSensation] = useState('');
  const [emotions, setEmotions] = useState([]); // [{ name, intensity }]
  const [customEmotion, setCustomEmotion] = useState('');
  const [behaviors, setBehaviors] = useState([]);
  const [customBehavior, setCustomBehavior] = useState('');
  const [consequencesShort, setConsequencesShort] = useState('');
  const [consequencesLong, setConsequencesLong] = useState('');
  const [breakPoint, setBreakPoint] = useState(null);

  // Animation phase for cycle diagram
  const [animationPhase, setAnimationPhase] = useState(0);
  const thoughtInputRef = useRef(null);

  // Trigger diagram animation when entering step 8
  useEffect(() => {
    if (step === 8 || step === 9 || step === 10) {
      setAnimationPhase(0);
      const t1 = setTimeout(() => setAnimationPhase(1), 100);
      const t2 = setTimeout(() => setAnimationPhase(2), 800);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [step]);

  const navigate = useCallback((nextStep) => {
    setHistory(prev => [...prev, step]);
    setStep(nextStep);
  }, [step]);

  const goBack = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setStep(prev);
  }, [history]);

  const canGoBack = history.length > 0 && step < 10;

  const addThought = useCallback(() => {
    const t = thoughtInput.trim();
    if (t && !thoughts.includes(t)) {
      setThoughts(prev => [...prev, t]);
      setThoughtInput('');
      if (thoughtInputRef.current) thoughtInputRef.current.focus();
    }
  }, [thoughtInput, thoughts]);

  const toggleSensation = useCallback((s) => {
    setSensations(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  }, []);

  const addCustomSensation = useCallback(() => {
    const s = customSensation.trim();
    if (s && !sensations.includes(s)) {
      setSensations(prev => [...prev, s]);
      setCustomSensation('');
    }
  }, [customSensation, sensations]);

  const toggleEmotion = useCallback((name) => {
    setEmotions(prev => {
      const exists = prev.find(e => e.name === name);
      if (exists) return prev.filter(e => e.name !== name);
      return [...prev, { name, intensity: 5 }];
    });
  }, []);

  const setEmotionIntensity = useCallback((name, intensity) => {
    setEmotions(prev => prev.map(e => e.name === name ? { ...e, intensity } : e));
  }, []);

  const addCustomEmotion = useCallback(() => {
    const e = customEmotion.trim();
    if (e && !emotions.find(em => em.name === e)) {
      setEmotions(prev => [...prev, { name: e, intensity: 5 }]);
      setCustomEmotion('');
    }
  }, [customEmotion, emotions]);

  const toggleBehavior = useCallback((b) => {
    setBehaviors(prev =>
      prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]
    );
  }, []);

  const addCustomBehavior = useCallback(() => {
    const b = customBehavior.trim();
    if (b && !behaviors.includes(b)) {
      setBehaviors(prev => [...prev, b]);
      setCustomBehavior('');
    }
  }, [customBehavior, behaviors]);

  const handleComplete = useCallback(() => {
    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('aiforj_pattern_maps') || '[]');
      existing.push({
        trigger,
        thoughts,
        sensations,
        emotions,
        behaviors,
        consequences: { short: consequencesShort, long: consequencesLong },
        breakPoint,
        date: new Date().toISOString(),
      });
      localStorage.setItem('aiforj_pattern_maps', JSON.stringify(existing));
    } catch (e) {
      // Silently fail on storage errors
    }
    onComplete();
  }, [trigger, thoughts, sensations, emotions, behaviors, consequencesShort, consequencesLong, breakPoint, onComplete]);

  // Collected data object for diagram
  const data = {
    trigger,
    thoughts,
    sensations,
    emotions,
    behaviors,
    consequencesShort,
    consequencesLong,
  };

  // --- Back button ---
  const BackButton = () => canGoBack ? (
    <button
      onClick={goBack}
      style={styles.backBtn}
      aria-label="Go back to previous step"
    >
      {'\u2190'} Back
    </button>
  ) : null;

  // =====================================================
  // STEP 1: Intro
  // =====================================================
  if (step === 1) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={1} totalSteps={10} />

          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            {/* Cycle preview icon */}
            <div style={{
              width: 72,
              height: 72,
              margin: '0 auto 24px',
              borderRadius: '50%',
              background: 'rgba(107,152,184,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="18" cy="18" r="14" stroke="#6B98B8" strokeWidth="2" strokeDasharray="4 3" opacity="0.4" />
                <circle cx="18" cy="4" r="3" fill="#6B98B8" />
                <circle cx="30" cy="12" r="3" fill="#9B8EC4" />
                <circle cx="30" cy="24" r="3" fill="#6B98B8" />
                <circle cx="18" cy="32" r="3" fill="#9B8EC4" />
                <circle cx="6" cy="24" r="3" fill="#6B98B8" />
                <circle cx="6" cy="12" r="3" fill="#9B8EC4" />
              </svg>
            </div>

            <h2 style={styles.heading}>
              Anxiety Pattern Mapper
            </h2>
            <p style={styles.subtext}>
              Let's map your anxiety pattern so you can see the cycle {'\u2014'} and find the best place to break it.
            </p>
            <p style={{
              fontSize: 13,
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              margin: '0 0 4px',
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              ~15 minutes {'\u00B7'} CBT + Psychoeducation
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate(2)}
              style={styles.primaryBtn}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(107,152,184,0.35)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(107,152,184,0.3)'; }}
            >
              Begin mapping {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 2: Trigger
  // =====================================================
  if (step === 2) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={2} totalSteps={10} />
          <BackButton />
          <div style={styles.stepLabel}>Trigger</div>
          <h2 style={styles.heading}>
            What sets off your anxiety?
          </h2>
          <p style={styles.subtext}>
            Describe the situation, event, or thought that kicks things off. Be as specific as you can.
          </p>
          <textarea
            value={trigger}
            onChange={e => setTrigger(e.target.value)}
            placeholder="e.g., Getting a vague text from my boss, waking up in the middle of the night, thinking about the presentation next week..."
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = '#6B98B8'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(3)}
              disabled={!trigger.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: trigger.trim() ? 1 : 0.4,
                cursor: trigger.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 3: Thoughts
  // =====================================================
  if (step === 3) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={3} totalSteps={10} />
          <BackButton />
          <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Thoughts</div>
          <h2 style={styles.heading}>
            What thoughts fire up?
          </h2>
          <p style={styles.subtext}>
            What does your mind tell you? Add each thought one at a time.
          </p>

          {/* Thought input + add */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
          }}>
            <input
              ref={thoughtInputRef}
              type="text"
              value={thoughtInput}
              onChange={e => setThoughtInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addThought(); }}
              placeholder="e.g., I'm going to fail..."
              style={{
                ...styles.textInput,
                flex: 1,
                borderBottom: '2px solid rgba(155,142,196,0.3)',
              }}
              onFocus={e => { e.target.style.borderBottomColor = '#9B8EC4'; }}
              onBlur={e => { e.target.style.borderBottomColor = 'rgba(155,142,196,0.3)'; }}
            />
            <button
              onClick={addThought}
              disabled={!thoughtInput.trim()}
              style={{
                padding: '10px 20px',
                borderRadius: 12,
                border: '1.5px solid #9B8EC4',
                background: thoughtInput.trim() ? '#9B8EC4' : 'transparent',
                color: thoughtInput.trim() ? '#fff' : '#9B8EC4',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: thoughtInput.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>

          {/* Thought pills */}
          {thoughts.length > 0 && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 16,
            }}>
              {thoughts.map((t, i) => (
                <Pill
                  key={i}
                  label={t}
                  onRemove={() => setThoughts(prev => prev.filter((_, idx) => idx !== i))}
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(4)}
              disabled={thoughts.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: thoughts.length > 0 ? 1 : 0.4,
                cursor: thoughts.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 4: Sensations
  // =====================================================
  if (step === 4) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={4} totalSteps={10} />
          <BackButton />
          <div style={styles.stepLabel}>Sensations</div>
          <h2 style={styles.heading}>
            What happens in your body?
          </h2>
          <p style={styles.subtext}>
            Select all the physical sensations you notice when anxiety hits.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}>
            {SENSATION_OPTIONS.map(s => (
              <Chip
                key={s}
                label={s}
                selected={sensations.includes(s)}
                onToggle={() => toggleSensation(s)}
                accentColor="#6B98B8"
              />
            ))}
          </div>

          {/* Custom sensation input */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
          }}>
            <input
              type="text"
              value={customSensation}
              onChange={e => setCustomSensation(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomSensation(); }}
              placeholder="Add your own..."
              style={{
                ...styles.textInput,
                flex: 1,
              }}
              onFocus={e => { e.target.style.borderBottomColor = '#6B98B8'; }}
              onBlur={e => { e.target.style.borderBottomColor = 'rgba(107,152,184,0.3)'; }}
            />
            <button
              onClick={addCustomSensation}
              disabled={!customSensation.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: '1.5px solid #6B98B8',
                background: customSensation.trim() ? '#6B98B8' : 'transparent',
                color: customSensation.trim() ? '#fff' : '#6B98B8',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: customSensation.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(5)}
              disabled={sensations.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: sensations.length > 0 ? 1 : 0.4,
                cursor: sensations.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 5: Emotions
  // =====================================================
  if (step === 5) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={5} totalSteps={10} />
          <BackButton />
          <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Emotions</div>
          <h2 style={styles.heading}>
            What emotions show up?
          </h2>
          <p style={styles.subtext}>
            Select each emotion, then rate its intensity from 1 (mild) to 10 (overwhelming).
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}>
            {EMOTION_OPTIONS.map(e => (
              <Chip
                key={e}
                label={e}
                selected={!!emotions.find(em => em.name === e)}
                onToggle={() => toggleEmotion(e)}
                accentColor="#9B8EC4"
              />
            ))}
          </div>

          {/* Custom emotion input */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 20,
          }}>
            <input
              type="text"
              value={customEmotion}
              onChange={e => setCustomEmotion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomEmotion(); }}
              placeholder="Add your own..."
              style={{
                ...styles.textInput,
                flex: 1,
                borderBottom: '2px solid rgba(155,142,196,0.3)',
              }}
              onFocus={e => { e.target.style.borderBottomColor = '#9B8EC4'; }}
              onBlur={e => { e.target.style.borderBottomColor = 'rgba(155,142,196,0.3)'; }}
            />
            <button
              onClick={addCustomEmotion}
              disabled={!customEmotion.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: '1.5px solid #9B8EC4',
                background: customEmotion.trim() ? '#9B8EC4' : 'transparent',
                color: customEmotion.trim() ? '#fff' : '#9B8EC4',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: customEmotion.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>

          {/* Intensity sliders for selected emotions */}
          {emotions.length > 0 && (
            <div style={{
              padding: '16px 20px',
              background: 'rgba(155,142,196,0.04)',
              borderRadius: 16,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 16,
            }}>
              <div style={{
                fontSize: 11,
                fontWeight: 600,
                color: 'var(--text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: 12,
              }}>
                Intensity
              </div>
              {emotions.map((em, i) => (
                <div key={em.name} style={{ marginBottom: i < emotions.length - 1 ? 12 : 0 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    fontFamily: "'DM Sans', sans-serif",
                    marginBottom: 2,
                  }}>
                    {em.name}
                  </div>
                  <IntensitySlider
                    value={em.intensity}
                    onChange={(val) => setEmotionIntensity(em.name, val)}
                    color="#9B8EC4"
                  />
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(6)}
              disabled={emotions.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: emotions.length > 0 ? 1 : 0.4,
                cursor: emotions.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 6: Behaviors
  // =====================================================
  if (step === 6) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={6} totalSteps={10} />
          <BackButton />
          <div style={styles.stepLabel}>Behaviors</div>
          <h2 style={styles.heading}>
            What do you do when the anxiety hits?
          </h2>
          <p style={styles.subtext}>
            These are the actions or reactions {'\u2014'} even the ones you wish you didn't do.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16,
          }}>
            {BEHAVIOR_OPTIONS.map(b => (
              <Chip
                key={b}
                label={b}
                selected={behaviors.includes(b)}
                onToggle={() => toggleBehavior(b)}
                accentColor="#6B98B8"
              />
            ))}
          </div>

          {/* Custom behavior input */}
          <div style={{
            display: 'flex',
            gap: 10,
            marginBottom: 16,
          }}>
            <input
              type="text"
              value={customBehavior}
              onChange={e => setCustomBehavior(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addCustomBehavior(); }}
              placeholder="Add your own..."
              style={{
                ...styles.textInput,
                flex: 1,
              }}
              onFocus={e => { e.target.style.borderBottomColor = '#6B98B8'; }}
              onBlur={e => { e.target.style.borderBottomColor = 'rgba(107,152,184,0.3)'; }}
            />
            <button
              onClick={addCustomBehavior}
              disabled={!customBehavior.trim()}
              style={{
                padding: '8px 16px',
                borderRadius: 12,
                border: '1.5px solid #6B98B8',
                background: customBehavior.trim() ? '#6B98B8' : 'transparent',
                color: customBehavior.trim() ? '#fff' : '#6B98B8',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                cursor: customBehavior.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
            >
              Add
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(7)}
              disabled={behaviors.length === 0}
              style={{
                ...styles.primaryBtn,
                opacity: behaviors.length > 0 ? 1 : 0.4,
                cursor: behaviors.length > 0 ? 'pointer' : 'not-allowed',
              }}
            >
              Next {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 7: Consequences
  // =====================================================
  if (step === 7) {
    const hasContent = consequencesShort.trim() || consequencesLong.trim();
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={7} totalSteps={10} />
          <BackButton />
          <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Consequences</div>
          <h2 style={styles.heading}>
            What are the consequences?
          </h2>
          <p style={styles.subtext}>
            How does this cycle affect your life? Think about both the immediate relief and the longer-term cost.
          </p>

          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#6B98B8',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Short-term:
            </label>
            <textarea
              value={consequencesShort}
              onChange={e => setConsequencesShort(e.target.value)}
              placeholder="e.g., I feel temporary relief from avoiding, but the worry stays..."
              rows={3}
              style={styles.textarea}
              onFocus={e => { e.target.style.borderColor = '#6B98B8'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 600,
              color: '#9B8EC4',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Long-term:
            </label>
            <textarea
              value={consequencesLong}
              onChange={e => setConsequencesLong(e.target.value)}
              placeholder="e.g., My world gets smaller, I miss opportunities, relationships suffer..."
              rows={3}
              style={{
                ...styles.textarea,
                borderColor: 'rgba(155,142,196,0.2)',
              }}
              onFocus={e => { e.target.style.borderColor = '#9B8EC4'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
            />
          </div>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate(8)}
              disabled={!hasContent}
              style={{
                ...styles.primaryBtn,
                opacity: hasContent ? 1 : 0.4,
                cursor: hasContent ? 'pointer' : 'not-allowed',
              }}
            >
              See the cycle {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 8: Cycle Diagram
  // =====================================================
  if (step === 8) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={8} totalSteps={10} />

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#6B98B8',
              fontWeight: 600,
              marginBottom: 12,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Your anxiety cycle
            </div>
            <h2 style={{ ...styles.heading, textAlign: 'center' }}>
              This is your pattern
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 8px',
            }}>
              Each part feeds the next, creating a self-reinforcing loop.
            </p>
          </div>

          <CycleDiagram
            data={data}
            step={8}
            breakPoint={null}
            onSelectBreak={() => {}}
            animationPhase={animationPhase}
          />

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => navigate(9)}
              style={styles.primaryBtn}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(107,152,184,0.35)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(107,152,184,0.3)'; }}
            >
              Find the break point {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 9: Break Point Selection
  // =====================================================
  if (step === 9) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={9} totalSteps={10} />
          <BackButton />

          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h2 style={{ ...styles.heading, textAlign: 'center' }}>
              Where's the weakest link?
            </h2>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 8px',
            }}>
              Tap the part of the cycle you think you could interrupt. Which piece could you change?
            </p>
          </div>

          <CycleDiagram
            data={data}
            step={9}
            breakPoint={breakPoint}
            onSelectBreak={setBreakPoint}
            animationPhase={animationPhase}
          />

          {/* Show recommendation when a break point is selected */}
          {breakPoint && (
            <div style={{
              padding: '20px 24px',
              background: 'rgba(232,99,74,0.04)',
              borderRadius: 16,
              border: '1px solid rgba(232,99,74,0.15)',
              marginTop: 16,
              marginBottom: 16,
              animation: 'apmSlideUp 0.5s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#E8634A',
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Breaking at: {CATEGORIES.find(c => c.key === breakPoint)?.label}
              </div>
              <p style={{
                fontSize: 15,
                color: 'var(--text-primary)',
                lineHeight: 1.7,
                margin: 0,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                {BREAK_RECOMMENDATIONS[breakPoint]}
              </p>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => navigate(10)}
              disabled={!breakPoint}
              style={{
                ...styles.primaryBtn,
                opacity: breakPoint ? 1 : 0.4,
                cursor: breakPoint ? 'pointer' : 'not-allowed',
              }}
            >
              Complete {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // =====================================================
  // STEP 10: Completion
  // =====================================================
  if (step === 10) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
          <StepProgress currentStep={10} totalSteps={10} />

          {/* Completion header */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{
              width: 56,
              height: 56,
              margin: '0 auto 16px',
              borderRadius: '50%',
              background: 'rgba(122,158,126,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'apmSlideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <span style={{ fontSize: 24, color: '#7A9E7E' }}>{'\u2713'}</span>
            </div>
            <h2 style={{ ...styles.heading, textAlign: 'center' }}>
              Pattern mapped
            </h2>
          </div>

          {/* Final cycle diagram with break point */}
          <CycleDiagram
            data={data}
            step={10}
            breakPoint={breakPoint}
            onSelectBreak={() => {}}
            animationPhase={animationPhase}
          />

          {/* Break point reminder */}
          {breakPoint && (
            <div style={{
              padding: '20px 24px',
              background: 'rgba(232,99,74,0.04)',
              borderRadius: 16,
              border: '1px solid rgba(232,99,74,0.12)',
              marginBottom: 20,
              animation: 'apmFadeIn 0.5s ease 0.3s both',
            }}>
              <div style={{
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#E8634A',
                fontWeight: 600,
                marginBottom: 8,
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                Your break point: {CATEGORIES.find(c => c.key === breakPoint)?.label}
              </div>
              <p style={{
                fontSize: 14,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {BREAK_RECOMMENDATIONS[breakPoint]}
              </p>
            </div>
          )}

          {/* Summary card */}
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(107,152,184,0.05) 0%, rgba(155,142,196,0.05) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(107,152,184,0.1)',
            marginBottom: 24,
            animation: 'apmSlideUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s both',
          }}>
            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#6B98B8',
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Summary
            </div>
            <div style={styles.planRow}>
              <span style={styles.planLabel}>Trigger</span>
              <span style={styles.planValue}>{trigger.length > 50 ? trigger.slice(0, 47) + '...' : trigger}</span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>Thoughts</span>
              <span style={styles.planValue}>{thoughts.length} recorded</span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>Sensations</span>
              <span style={styles.planValue}>{sensations.length} identified</span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>Emotions</span>
              <span style={styles.planValue}>
                {emotions.map(e => `${e.name} (${e.intensity})`).join(', ').slice(0, 40)}
                {emotions.map(e => `${e.name} (${e.intensity})`).join(', ').length > 40 ? '...' : ''}
              </span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>Behaviors</span>
              <span style={styles.planValue}>{behaviors.length} patterns</span>
            </div>
          </div>

          {/* Closing message */}
          <div style={{
            textAlign: 'center',
            marginBottom: 28,
            animation: 'apmFadeIn 0.5s ease 0.4s both',
          }}>
            <p style={{
              fontSize: 17,
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: '0 0 12px',
            }}>
              You externalized your anxiety pattern.
            </p>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              Seeing the cycle is the first step to breaking it. The pattern loses some of its power when you can name each part and see how they connect.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={handleComplete}
              style={styles.primaryBtn}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(107,152,184,0.35)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(107,152,184,0.3)'; }}
            >
              Finish {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  return null;
}

// --- Keyframe animations ---
const keyframes = `
  @keyframes apmFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes apmSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes apmPulseBreak {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.25; }
  }
  @keyframes apmPulseNode {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }

  /* Range input thumb styling */
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #9B8EC4;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(155,142,196,0.3);
    margin-top: -6px;
  }
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #9B8EC4;
    cursor: pointer;
    border: 2px solid #fff;
    box-shadow: 0 1px 4px rgba(155,142,196,0.3);
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
  }
  input[type="range"]::-moz-range-track {
    height: 4px;
    border-radius: 2px;
  }
`;

// --- Styles ---
const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px 0 100px',
  },
  fadeIn: {
    animation: 'apmFadeIn 0.5s ease',
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
    fontWeight: 500,
    color: 'var(--text-primary)',
    lineHeight: 1.3,
    margin: '0 0 12px',
  },
  subtext: {
    fontSize: 16,
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    margin: '0 0 24px',
  },
  stepLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    color: '#6B98B8',
    fontWeight: 600,
    marginBottom: 12,
    fontFamily: "'JetBrains Mono', monospace",
  },
  primaryBtn: {
    padding: '16px 36px',
    borderRadius: 50,
    background: '#6B98B8',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "'Fraunces', serif",
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
    boxShadow: '0 4px 16px rgba(107,152,184,0.3)',
  },
  backBtn: {
    padding: '8px 16px',
    borderRadius: 20,
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    fontSize: 14,
    fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginBottom: 20,
  },
  textarea: {
    width: '100%',
    padding: '16px 20px',
    border: '1.5px solid rgba(107,152,184,0.2)',
    borderRadius: 16,
    background: 'rgba(107,152,184,0.04)',
    fontSize: 16,
    color: 'var(--text-primary)',
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.6,
    resize: 'none',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  textInput: {
    width: '100%',
    padding: '14px 4px',
    border: 'none',
    borderBottom: '2px solid rgba(107,152,184,0.3)',
    background: 'transparent',
    fontSize: 16,
    fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text-primary)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  },
  selectableCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: 16,
    border: '1.5px solid rgba(107,152,184,0.12)',
    background: 'var(--surface-elevated)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'left',
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
  },
  planRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    padding: '4px 0',
  },
  planLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--text-muted)',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
    flexShrink: 0,
    paddingTop: 2,
  },
  planValue: {
    fontSize: 15,
    color: 'var(--text-primary)',
    fontWeight: 500,
    textAlign: 'right',
    lineHeight: 1.5,
  },
  planDivider: {
    height: 1,
    background: 'rgba(107,152,184,0.1)',
    margin: '12px 0',
  },
};
