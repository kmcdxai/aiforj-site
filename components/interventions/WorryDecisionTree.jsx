"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

// Flow steps (used for tree node mapping)
const NODES = {
  START: 'start',
  BRANCH: 'branch',
  YES_ACTION: 'yes-action',
  YES_WHEN: 'yes-when',
  YES_FIRST_STEP: 'yes-first-step',
  YES_COMPLETE: 'yes-complete',
  NO_VALIDATE: 'no-validate',
  NO_FEELING: 'no-feeling',
  NO_EXERCISE: 'no-exercise',
  NO_COMPLETE: 'no-complete',
};

// Tree layout for SVG visualization
const TREE_CONFIG = [
  { id: NODES.START, cx: 150, cy: 30, label: 'Worry' },
  { id: NODES.BRANCH, cx: 150, cy: 80, label: 'Can act?' },
  { id: NODES.YES_ACTION, cx: 62, cy: 135, label: 'Action' },
  { id: NODES.YES_WHEN, cx: 62, cy: 185, label: 'When' },
  { id: NODES.YES_FIRST_STEP, cx: 62, cy: 235, label: '1st step' },
  { id: NODES.YES_COMPLETE, cx: 62, cy: 285, label: 'Plan' },
  { id: NODES.NO_VALIDATE, cx: 238, cy: 135, label: 'Accept' },
  { id: NODES.NO_FEELING, cx: 238, cy: 185, label: 'Feeling' },
  { id: NODES.NO_EXERCISE, cx: 238, cy: 235, label: 'Exercise' },
  { id: NODES.NO_COMPLETE, cx: 238, cy: 285, label: 'Reflect' },
];

const TREE_EDGES = [
  [NODES.START, NODES.BRANCH],
  [NODES.BRANCH, NODES.YES_ACTION],
  [NODES.BRANCH, NODES.NO_VALIDATE],
  [NODES.YES_ACTION, NODES.YES_WHEN],
  [NODES.YES_WHEN, NODES.YES_FIRST_STEP],
  [NODES.YES_FIRST_STEP, NODES.YES_COMPLETE],
  [NODES.NO_VALIDATE, NODES.NO_FEELING],
  [NODES.NO_FEELING, NODES.NO_EXERCISE],
  [NODES.NO_EXERCISE, NODES.NO_COMPLETE],
];

// Path of visited nodes for each branch
const YES_PATH = [NODES.START, NODES.BRANCH, NODES.YES_ACTION, NODES.YES_WHEN, NODES.YES_FIRST_STEP, NODES.YES_COMPLETE];
const NO_PATH = [NODES.START, NODES.BRANCH, NODES.NO_VALIDATE, NODES.NO_FEELING, NODES.NO_EXERCISE, NODES.NO_COMPLETE];

function getVisitedNodes(step, branch) {
  const path = branch === 'yes' ? YES_PATH : branch === 'no' ? NO_PATH : [NODES.START, NODES.BRANCH];
  const stepToNode = {
    start: NODES.START,
    branch: NODES.BRANCH,
    'yes-action': NODES.YES_ACTION,
    'yes-when': NODES.YES_WHEN,
    'yes-first-step': NODES.YES_FIRST_STEP,
    'yes-complete': NODES.YES_COMPLETE,
    'no-validate': NODES.NO_VALIDATE,
    'no-feeling': NODES.NO_FEELING,
    'no-exercise': NODES.NO_EXERCISE,
    'no-complete': NODES.NO_COMPLETE,
  };
  const currentNode = stepToNode[step];
  const currentIndex = path.indexOf(currentNode);
  if (currentIndex === -1) return [NODES.START];
  return path.slice(0, currentIndex + 1);
}

// --- Decision Tree SVG ---
function TreeVisualization({ step, branch }) {
  const visited = getVisitedNodes(step, branch);
  const currentNode = visited[visited.length - 1];

  const nodeColor = (id) => {
    if (!visited.includes(id)) return 'rgba(107,152,184,0.12)';
    // YES branch = ocean, NO branch = lavender
    const isNoBranch = [NODES.NO_VALIDATE, NODES.NO_FEELING, NODES.NO_EXERCISE, NODES.NO_COMPLETE].includes(id);
    if (isNoBranch) return '#9B8EC4';
    return '#6B98B8';
  };

  const nodeStroke = (id) => {
    if (id === currentNode) return '#fff';
    if (visited.includes(id)) return 'rgba(255,255,255,0.3)';
    return 'transparent';
  };

  const edgeColor = (from, to) => {
    if (visited.includes(from) && visited.includes(to)) {
      const isNoBranch = [NODES.NO_VALIDATE, NODES.NO_FEELING, NODES.NO_EXERCISE, NODES.NO_COMPLETE].includes(to);
      return isNoBranch ? 'rgba(155,142,196,0.6)' : 'rgba(107,152,184,0.6)';
    }
    return 'rgba(107,152,184,0.1)';
  };

  const nodeMap = {};
  TREE_CONFIG.forEach(n => { nodeMap[n.id] = n; });

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 24,
      animation: 'wdtFadeIn 0.5s ease',
    }}>
      <svg
        viewBox="0 0 300 310"
        width="260"
        height="270"
        style={{ overflow: 'visible' }}
        aria-label="Progress tree showing your journey through this exercise"
      >
        {/* Edges */}
        {TREE_EDGES.map(([fromId, toId]) => {
          const from = nodeMap[fromId];
          const to = nodeMap[toId];
          return (
            <line
              key={`${fromId}-${toId}`}
              x1={from.cx} y1={from.cy}
              x2={to.cx} y2={to.cy}
              stroke={edgeColor(fromId, toId)}
              strokeWidth={2}
              style={{ transition: 'stroke 0.5s ease' }}
            />
          );
        })}
        {/* Nodes */}
        {TREE_CONFIG.map((node) => {
          const isVisited = visited.includes(node.id);
          const isCurrent = node.id === currentNode;
          return (
            <g key={node.id}>
              {/* Pulse ring for current node */}
              {isCurrent && (
                <circle
                  cx={node.cx} cy={node.cy} r={18}
                  fill="none"
                  stroke={nodeColor(node.id)}
                  strokeWidth={2}
                  opacity={0.4}
                  style={{ animation: 'wdtPulse 2s ease-in-out infinite' }}
                />
              )}
              <circle
                cx={node.cx} cy={node.cy}
                r={isCurrent ? 14 : 11}
                fill={nodeColor(node.id)}
                stroke={nodeStroke(node.id)}
                strokeWidth={isCurrent ? 2.5 : 1.5}
                style={{ transition: 'all 0.5s ease' }}
              />
              {/* Label */}
              <text
                x={node.cx}
                y={node.cy + (isCurrent ? 28 : 24)}
                textAnchor="middle"
                fontSize={9}
                fontFamily="'JetBrains Mono', monospace"
                fill={isVisited ? 'var(--text-secondary)' : 'var(--text-muted)'}
                opacity={isVisited ? 0.9 : 0.4}
                style={{ transition: 'all 0.5s ease' }}
              >
                {node.label}
              </text>
              {/* Checkmark for completed nodes */}
              {isVisited && !isCurrent && (
                <text
                  x={node.cx} y={node.cy + 4}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#fff"
                  fontWeight="bold"
                >
                  {'\u2713'}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// --- Countdown Timer for guided pauses ---
function GuidedPause({ duration, message, subMessage, onFinish }) {
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(duration / 1000));
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [duration]);

  const progress = 1 - (secondsLeft / Math.ceil(duration / 1000));

  return (
    <div style={{
      textAlign: 'center',
      padding: '32px 24px',
      animation: 'wdtFadeIn 0.5s ease',
    }}>
      <p style={{
        fontSize: 18,
        fontFamily: "'Fraunces', serif",
        fontWeight: 500,
        color: 'var(--text-primary)',
        lineHeight: 1.6,
        margin: '0 0 8px',
      }}>
        {message}
      </p>
      {subMessage && (
        <p style={{
          fontSize: 15,
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          margin: '0 0 28px',
        }}>
          {subMessage}
        </p>
      )}

      {/* Breathing circle */}
      <div style={{
        width: 100,
        height: 100,
        margin: '0 auto 24px',
        position: 'relative',
      }}>
        <svg viewBox="0 0 100 100" width="100" height="100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(155,142,196,0.12)" strokeWidth="4" />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="#9B8EC4"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress)}`}
            style={{
              transition: 'stroke-dashoffset 1s linear',
              transform: 'rotate(-90deg)',
              transformOrigin: '50% 50%',
            }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 22,
          fontWeight: 600,
          color: finished ? '#9B8EC4' : 'var(--text-primary)',
        }}>
          {finished ? '\u2713' : secondsLeft}
        </div>
      </div>

      {/* Breathing animation cue */}
      {!finished && (
        <div style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: 'rgba(155,142,196,0.15)',
          margin: '0 auto 20px',
          animation: 'wdtBreathe 6s ease-in-out infinite',
        }} />
      )}

      {finished && (
        <div style={{ animation: 'wdtFadeIn 0.4s ease' }}>
          <button onClick={onFinish} style={styles.primaryBtn}>
            Continue {'\u2192'}
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function WorryDecisionTree({ onComplete }) {
  const [step, setStep] = useState('start');
  const [branch, setBranch] = useState(null); // 'yes' | 'no'
  const [history, setHistory] = useState([]);

  // User inputs
  const [worry, setWorry] = useState('');
  const [action, setAction] = useState('');
  const [when, setWhen] = useState('');
  const [firstStep, setFirstStep] = useState('');
  const [feeling, setFeeling] = useState(null);
  const [friendAdvice, setFriendAdvice] = useState('');

  const navigate = useCallback((nextStep, nextBranch) => {
    setHistory(prev => [...prev, { step, branch }]);
    setStep(nextStep);
    if (nextBranch !== undefined) setBranch(nextBranch);
  }, [step, branch]);

  const goBack = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setStep(prev.step);
    setBranch(prev.branch);
  }, [history]);

  const canGoBack = history.length > 0 && step !== 'yes-complete' && step !== 'no-complete';

  // Extract a short summary of the worry for completion statements
  const worrySummary = worry.length > 60 ? worry.slice(0, 57) + '...' : worry;

  // --- RENDER ---

  // Back button component
  const BackButton = () => canGoBack ? (
    <button
      onClick={goBack}
      style={styles.backBtn}
      aria-label="Go back to previous step"
    >
      {'\u2190'} Back
    </button>
  ) : null;

  // --- START ---
  if (step === 'start') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={styles.heading}>
              What's worrying you right now?
            </h2>
            <p style={styles.subtext}>
              Write it down exactly as it sounds in your head. No one else will see this.
            </p>
          </div>
          <textarea
            value={worry}
            onChange={e => setWorry(e.target.value)}
            placeholder="e.g., I'm afraid I'm going to lose my job, I can't stop thinking about what they said, What if I made the wrong decision..."
            rows={4}
            style={styles.textarea}
            onFocus={e => { e.target.style.borderColor = '#6B98B8'; }}
            onBlur={e => { e.target.style.borderColor = 'rgba(107,152,184,0.2)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button
              onClick={() => navigate('branch')}
              disabled={!worry.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: worry.trim() ? 1 : 0.4,
                cursor: worry.trim() ? 'pointer' : 'not-allowed',
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

  // --- BRANCH QUESTION ---
  if (step === 'branch') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          {/* Display their worry */}
          <div style={styles.quoteCard}>
            <p style={styles.quoteText}>
              &ldquo;{worrySummary}&rdquo;
            </p>
          </div>
          <h2 style={{ ...styles.heading, textAlign: 'center' }}>
            Can you do something about this right now?
          </h2>
          <p style={{ ...styles.subtext, textAlign: 'center' }}>
            Not &ldquo;could someone&rdquo; {'\u2014'} can <strong style={{ color: 'var(--text-primary)' }}>you</strong>, right now or very soon, take a concrete action?
          </p>
          <div style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            marginTop: 28,
          }}>
            <button
              onClick={() => navigate('yes-action', 'yes')}
              style={styles.branchBtnYes}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(107,152,184,0.3)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(107,152,184,0.2)'; }}
            >
              Yes, I can
            </button>
            <button
              onClick={() => navigate('no-validate', 'no')}
              style={styles.branchBtnNo}
              onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 24px rgba(155,142,196,0.3)'; }}
              onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(155,142,196,0.2)'; }}
            >
              No, I can't
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- YES BRANCH: Action ---
  if (step === 'yes-action') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          <div style={styles.stepLabel}>Action path</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What's ONE specific action you could take?
          </h2>
          <p style={{ ...styles.subtext, fontSize: 14, color: 'var(--text-muted)' }}>
            Keep it concrete and realistic. Not &ldquo;fix everything&rdquo; {'\u2014'} something you can actually do.
          </p>
          <input
            type="text"
            value={action}
            onChange={e => setAction(e.target.value)}
            placeholder="e.g., Send that email, Have the conversation, Make the appointment..."
            style={styles.textInput}
            onFocus={e => { e.target.style.borderBottomColor = '#6B98B8'; }}
            onBlur={e => { e.target.style.borderBottomColor = 'rgba(107,152,184,0.3)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => navigate('yes-when')}
              disabled={!action.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: action.trim() ? 1 : 0.4,
                cursor: action.trim() ? 'pointer' : 'not-allowed',
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

  // --- YES BRANCH: When ---
  if (step === 'yes-when') {
    const whenOptions = [
      { value: 'today', label: 'Today', icon: '\u26A1' },
      { value: 'tomorrow', label: 'Tomorrow', icon: '\u2600\uFE0F' },
      { value: 'this-week', label: 'This week', icon: '\uD83D\uDCC5' },
    ];
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          <div style={styles.stepLabel}>Action path</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            When will you do it?
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            margin: '0 0 24px',
            lineHeight: 1.6,
          }}>
            Committing to a time makes it real.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {whenOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => { setWhen(opt.value); }}
                style={{
                  ...styles.selectableCard,
                  borderColor: when === opt.value ? '#6B98B8' : 'rgba(107,152,184,0.12)',
                  background: when === opt.value ? 'rgba(107,152,184,0.08)' : 'var(--surface-elevated)',
                }}
                onMouseEnter={e => {
                  if (when !== opt.value) e.target.style.borderColor = 'rgba(107,152,184,0.3)';
                }}
                onMouseLeave={e => {
                  if (when !== opt.value) e.target.style.borderColor = 'rgba(107,152,184,0.12)';
                }}
              >
                <span style={{ fontSize: 20, marginRight: 12 }}>{opt.icon}</span>
                <span style={{
                  fontSize: 16,
                  fontWeight: when === opt.value ? 600 : 400,
                  color: when === opt.value ? '#6B98B8' : 'var(--text-primary)',
                }}>
                  {opt.label}
                </span>
                {when === opt.value && (
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 16,
                    color: '#6B98B8',
                    fontWeight: 700,
                  }}>{'\u2713'}</span>
                )}
              </button>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => navigate('yes-first-step')}
              disabled={!when}
              style={{
                ...styles.primaryBtn,
                opacity: when ? 1 : 0.4,
                cursor: when ? 'pointer' : 'not-allowed',
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

  // --- YES BRANCH: First step ---
  if (step === 'yes-first-step') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          <div style={styles.stepLabel}>Action path</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            What's the very first step?
          </h2>
          <p style={{
            fontSize: 14,
            color: 'var(--text-muted)',
            margin: '0 0 20px',
            lineHeight: 1.6,
          }}>
            The smallest, easiest thing that starts the momentum. Something you could do in under 2 minutes.
          </p>
          <input
            type="text"
            value={firstStep}
            onChange={e => setFirstStep(e.target.value)}
            placeholder="e.g., Open my laptop, Pick up the phone, Write the first sentence..."
            style={styles.textInput}
            onFocus={e => { e.target.style.borderBottomColor = '#6B98B8'; }}
            onBlur={e => { e.target.style.borderBottomColor = 'rgba(107,152,184,0.3)'; }}
          />
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => navigate('yes-complete')}
              disabled={!firstStep.trim()}
              style={{
                ...styles.primaryBtn,
                opacity: firstStep.trim() ? 1 : 0.4,
                cursor: firstStep.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              See my plan {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- YES BRANCH: Completion ---
  if (step === 'yes-complete') {
    const whenLabel = when === 'today' ? 'Today' : when === 'tomorrow' ? 'Tomorrow' : 'This week';
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />

          {/* Plan card */}
          <div style={{
            padding: '28px 24px',
            background: 'linear-gradient(135deg, rgba(107,152,184,0.06) 0%, rgba(122,158,126,0.06) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(107,152,184,0.15)',
            marginBottom: 28,
            animation: 'wdtSlideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
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
              Your action plan
            </div>

            <div style={styles.planRow}>
              <span style={styles.planLabel}>Action</span>
              <span style={styles.planValue}>{action}</span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>When</span>
              <span style={styles.planValue}>{whenLabel}</span>
            </div>
            <div style={styles.planDivider} />
            <div style={styles.planRow}>
              <span style={styles.planLabel}>First step</span>
              <span style={styles.planValue}>{firstStep}</span>
            </div>
          </div>

          {/* Closing message */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontSize: 17,
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: '0 0 12px',
            }}>
              You have a plan.
            </p>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              The worry served its purpose {'\u2014'} it pointed you toward action. You can let it go now. When the worry returns, remind yourself: <em style={{ color: '#6B98B8' }}>&ldquo;I have a plan for that.&rdquo;</em>
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={onComplete} style={styles.primaryBtn}>
              Finish {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- NO BRANCH: Validation ---
  if (step === 'no-validate') {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Acceptance path</div>

          <div style={{
            textAlign: 'center',
            padding: '20px 0 8px',
          }}>
            <h2 style={{ ...styles.heading, textAlign: 'center' }}>
              This is something you can't control right now.
            </h2>
            <p style={{
              fontSize: 16,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: '0 0 32px',
            }}>
              That's hard. And it makes sense that your mind keeps going back to it {'\u2014'} it's trying to protect you.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate('no-feeling')}
              style={{ ...styles.primaryBtn, background: '#9B8EC4', boxShadow: '0 4px 16px rgba(155,142,196,0.3)' }}
            >
              Continue {'\u2192'}
            </button>
          </div>
        </div>
        <style>{keyframes}</style>
      </div>
    );
  }

  // --- NO BRANCH: Feeling selection ---
  if (step === 'no-feeling') {
    const feelings = [
      {
        id: 'rumination',
        label: 'I keep going over it anyway',
        description: 'The same thoughts loop again and again',
      },
      {
        id: 'holding',
        label: "I know I can't control it but I can't let go",
        description: 'You understand logically, but your body holds on',
      },
      {
        id: 'fear',
        label: "I'm scared of what might happen",
        description: 'The uncertainty feels unbearable',
      },
    ];

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />
          <BackButton />
          <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Acceptance path</div>
          <h2 style={{ ...styles.heading, textAlign: 'left' }}>
            Which of these feels most true right now?
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {feelings.map(f => (
              <button
                key={f.id}
                onClick={() => setFeeling(f.id)}
                style={{
                  ...styles.selectableCard,
                  borderColor: feeling === f.id ? '#9B8EC4' : 'rgba(155,142,196,0.12)',
                  background: feeling === f.id ? 'rgba(155,142,196,0.08)' : 'var(--surface-elevated)',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 4,
                }}
                onMouseEnter={e => {
                  if (feeling !== f.id) e.target.style.borderColor = 'rgba(155,142,196,0.3)';
                }}
                onMouseLeave={e => {
                  if (feeling !== f.id) e.target.style.borderColor = 'rgba(155,142,196,0.12)';
                }}
              >
                <span style={{
                  fontSize: 16,
                  fontWeight: feeling === f.id ? 600 : 400,
                  color: feeling === f.id ? '#9B8EC4' : 'var(--text-primary)',
                  lineHeight: 1.5,
                  pointerEvents: 'none',
                }}>
                  {f.label}
                </span>
                <span style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.5,
                  pointerEvents: 'none',
                }}>
                  {f.description}
                </span>
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <button
              onClick={() => navigate('no-exercise')}
              disabled={!feeling}
              style={{
                ...styles.primaryBtn,
                background: '#9B8EC4',
                boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
                opacity: feeling ? 1 : 0.4,
                cursor: feeling ? 'pointer' : 'not-allowed',
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

  // --- NO BRANCH: Exercise (varies by feeling) ---
  if (step === 'no-exercise') {
    // Option 1: Rumination -> Leaves on a stream
    if (feeling === 'rumination') {
      return (
        <div style={styles.container}>
          <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
            <TreeVisualization step={step} branch={branch} />
            <BackButton />
            <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Leaves on a stream</div>

            <div style={{
              padding: '24px',
              background: 'rgba(155,142,196,0.05)',
              borderRadius: 20,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: 16,
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: '0 0 16px',
                fontFamily: "'Fraunces', serif",
              }}>
                Imagine you're sitting beside a gentle stream.
              </p>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: '0 0 12px',
              }}>
                Leaves float slowly on the water's surface. Each time a thought appears {'\u2014'} any thought {'\u2014'} place it on a leaf and watch it drift downstream.
              </p>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                Don't push the leaves faster. Don't hold them back. Just watch them float by, one by one.
              </p>
            </div>

            <GuidedPause
              duration={30000}
              message="Close your eyes and try this now."
              subMessage="Let each thought arrive, place it on a leaf, and watch it go."
              onFinish={() => navigate('no-complete')}
            />
          </div>
          <style>{keyframes}</style>
        </div>
      );
    }

    // Option 2: Holding -> Expansion exercise
    if (feeling === 'holding') {
      return (
        <div style={styles.container}>
          <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
            <TreeVisualization step={step} branch={branch} />
            <BackButton />
            <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Expansion exercise</div>

            <div style={{
              padding: '24px',
              background: 'rgba(155,142,196,0.05)',
              borderRadius: 20,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: 16,
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: '0 0 16px',
                fontFamily: "'Fraunces', serif",
              }}>
                Notice where you feel this worry in your body.
              </p>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: '0 0 12px',
              }}>
                Breathe into that area. Instead of fighting the discomfort, gently make room for it. Imagine the space around the sensation expanding {'\u2014'} like opening a clenched fist.
              </p>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: 0,
              }}>
                You don't have to like the feeling. Just allow it to be there without struggling against it.
              </p>
            </div>

            <GuidedPause
              duration={30000}
              message="Breathe into the discomfort now."
              subMessage="Expand around the feeling. Make room for it."
              onFinish={() => navigate('no-complete')}
            />
          </div>
          <style>{keyframes}</style>
        </div>
      );
    }

    // Option 3: Fear -> Probability reality check + friend advice
    if (feeling === 'fear') {
      return (
        <div style={styles.container}>
          <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
            <TreeVisualization step={step} branch={branch} />
            <BackButton />
            <div style={{ ...styles.stepLabel, color: '#9B8EC4' }}>Reality check</div>

            <div style={{
              padding: '24px',
              background: 'rgba(155,142,196,0.05)',
              borderRadius: 20,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 24,
            }}>
              <p style={{
                fontSize: 16,
                color: 'var(--text-primary)',
                lineHeight: 1.8,
                margin: '0 0 16px',
                fontFamily: "'Fraunces', serif",
              }}>
                Your mind is predicting the worst. Let's gently question that.
              </p>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                margin: '0 0 8px',
              }}>
                Think of the last 10 times you worried this intensely about something. How many of those worst-case scenarios actually happened?
              </p>
              <p style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
              }}>
                Our minds are designed to overestimate threats. It's a survival feature, not a prediction.
              </p>
            </div>

            <h3 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: 17,
              fontWeight: 500,
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}>
              What would you tell a close friend who had this worry?
            </h3>
            <p style={{
              fontSize: 14,
              color: 'var(--text-muted)',
              margin: '0 0 16px',
              lineHeight: 1.6,
            }}>
              We're often wiser and kinder with others than with ourselves.
            </p>
            <textarea
              value={friendAdvice}
              onChange={e => setFriendAdvice(e.target.value)}
              placeholder="What compassionate, honest words would you offer them?"
              rows={4}
              style={{
                ...styles.textarea,
                borderColor: 'rgba(155,142,196,0.2)',
              }}
              onFocus={e => { e.target.style.borderColor = '#9B8EC4'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(155,142,196,0.2)'; }}
            />
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={() => navigate('no-complete')}
                disabled={!friendAdvice.trim()}
                style={{
                  ...styles.primaryBtn,
                  background: '#9B8EC4',
                  boxShadow: '0 4px 16px rgba(155,142,196,0.3)',
                  opacity: friendAdvice.trim() ? 1 : 0.4,
                  cursor: friendAdvice.trim() ? 'pointer' : 'not-allowed',
                }}
              >
                Continue {'\u2192'}
              </button>
            </div>
          </div>
          <style>{keyframes}</style>
        </div>
      );
    }
  }

  // --- NO BRANCH: Completion ---
  if (step === 'no-complete') {
    // Generate a gentle acceptance statement
    const exerciseReflection = feeling === 'rumination'
      ? 'letting thoughts pass without holding them'
      : feeling === 'holding'
        ? 'making room for what I feel instead of fighting it'
        : 'being as compassionate with myself as I would be with a friend';

    return (
      <div style={styles.container}>
        <div style={{ ...styles.fadeIn, maxWidth: 520, margin: '0 auto', padding: '40px 24px' }}>
          <TreeVisualization step={step} branch={branch} />

          {/* Acceptance statement card */}
          <div style={{
            padding: '28px 24px',
            background: 'linear-gradient(135deg, rgba(155,142,196,0.06) 0%, rgba(107,152,184,0.04) 100%)',
            borderRadius: 20,
            border: '1px solid rgba(155,142,196,0.15)',
            marginBottom: 28,
            animation: 'wdtSlideUp 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}>
            <div style={{
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: '#9B8EC4',
              fontWeight: 600,
              marginBottom: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              Your acceptance statement
            </div>
            <p style={{
              fontSize: 17,
              fontFamily: "'Fraunces', serif",
              fontWeight: 500,
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              I accept that <em style={{ color: '#9B8EC4' }}>{worrySummary.charAt(0).toLowerCase() + worrySummary.slice(1).replace(/\.+$/, '')}</em> is uncertain right now. I choose to focus my energy on <em style={{ color: '#6B98B8' }}>{exerciseReflection}</em>.
            </p>
          </div>

          {/* Friend advice callback for fear path */}
          {feeling === 'fear' && friendAdvice.trim() && (
            <div style={{
              padding: '20px 24px',
              background: 'var(--surface-elevated)',
              borderRadius: 16,
              border: '1px solid rgba(155,142,196,0.1)',
              marginBottom: 24,
              animation: 'wdtFadeIn 0.5s ease 0.3s both',
            }}>
              <div style={{
                fontSize: 12,
                color: 'var(--text-muted)',
                marginBottom: 8,
                fontWeight: 500,
              }}>
                What you would tell a friend:
              </div>
              <p style={{
                fontSize: 15,
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                margin: 0,
                fontStyle: 'italic',
              }}>
                &ldquo;{friendAdvice}&rdquo;
              </p>
              <p style={{
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                margin: '12px 0 0',
              }}>
                You deserve that same compassion.
              </p>
            </div>
          )}

          {/* Closing message */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <p style={{
              fontSize: 15,
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              margin: 0,
            }}>
              Not every worry needs a solution. Some just need to be acknowledged {'\u2014'} and gently set down.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={onComplete}
              style={{ ...styles.primaryBtn, background: '#9B8EC4', boxShadow: '0 4px 16px rgba(155,142,196,0.3)' }}
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
  @keyframes wdtFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes wdtSlideUp {
    from { opacity: 0; transform: translateY(20px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes wdtPulse {
    0%, 100% { r: 18; opacity: 0.3; }
    50% { r: 22; opacity: 0.1; }
  }
  @keyframes wdtBreathe {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.6); opacity: 0.12; }
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
    animation: 'wdtFadeIn 0.5s ease',
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
  quoteCard: {
    padding: '16px 20px',
    background: 'rgba(107,152,184,0.06)',
    borderRadius: 12,
    marginBottom: 24,
    borderLeft: '3px solid rgba(107,152,184,0.3)',
  },
  quoteText: {
    fontSize: 15,
    color: 'var(--text-muted)',
    margin: 0,
    fontStyle: 'italic',
    lineHeight: 1.6,
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
