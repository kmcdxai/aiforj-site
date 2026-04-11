"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getSessions,
  getMoodCheckins,
  saveMoodCheckin,
  getBlueprints,
  getStreak,
  exportAllData,
  deleteAllData,
} from "../lib/db";
import WeeklyInsightsClient from "./WeeklyInsightsClient";

// ═══════════════════════════════════════════════════════════════
// EMOTION → PLANT MAPPING
// ═══════════════════════════════════════════════════════════════
const EMOTION_PLANTS = {
  anxious:        { name: "Lavender",      color: "#9B8EC4", stem: "#6B8C6B" },
  overwhelmed:    { name: "Peace Lily",    color: "#E8E4F0", stem: "#5A7A5A" },
  sad:            { name: "Rain Lily",     color: "#7AAFC4", stem: "#5B8C5A" },
  angry:          { name: "Red Sage",      color: "#C47A7A", stem: "#6B7F4A" },
  numb:           { name: "Snow Drop",     color: "#E4E8EC", stem: "#7A8A6A" },
  unmotivated:    { name: "Sunflower",     color: "#E8C44A", stem: "#5B8C3A" },
  lonely:         { name: "Forget-Me-Not", color: "#7AA4D4", stem: "#5A7A5A" },
  stressed:       { name: "Chamomile",     color: "#F5E6A0", stem: "#6B8C5A" },
  "burned-out":   { name: "Aloe Vera",    color: "#8BC48B", stem: "#5A7A4A" },
  grief:          { name: "White Rose",    color: "#F0ECE8", stem: "#8A8A6A" },
  "social-anxiety":{ name: "Violet",      color: "#9A7AC4", stem: "#5A7A5A" },
  imposter:       { name: "Iris",          color: "#8A7AB4", stem: "#5A7A5A" },
  "relationship": { name: "Jasmine",      color: "#F5F0E0", stem: "#5B8C5A" },
  "3am-spiral":   { name: "Moonflower",   color: "#C4C8E4", stem: "#6A7A8A" },
  fine:           { name: "Daisy",         color: "#F5F0E0", stem: "#5B8C5A" },
};

// ═══════════════════════════════════════════════════════════════
// SVG GARDEN SCENE
// ═══════════════════════════════════════════════════════════════
function GardenSVG({ sessionCount, emotions, streak, isPremium }) {
  const stage = !isPremium
    ? sessionCount === 0 ? 0 : 1
    : sessionCount === 0 ? 0
    : sessionCount <= 5 ? 1
    : sessionCount <= 15 ? 2
    : sessionCount <= 30 ? 3
    : 4;

  const uniqueEmotions = [...new Set(emotions)];
  const plantCount = Math.min(uniqueEmotions.length, 7);
  const displayStreak = Math.min(streak, 5);

  return (
    <svg viewBox="0 0 400 250" style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--garden-sky-top, #D4E4D8)" />
          <stop offset="100%" stopColor="var(--garden-sky-bottom, #E8EFE6)" />
        </linearGradient>
        <linearGradient id="soilG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5335" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="400" height="180" fill="url(#skyG)" />

      {/* Sun */}
      <circle cx="340" cy="45" r="22" fill="#F5E6A0" opacity="0.7">
        <animate attributeName="opacity" values="0.5;0.8;0.5" dur="6s" repeatCount="indefinite" />
      </circle>
      {stage >= 3 && [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <line key={i}
          x1={340 + Math.cos(a * Math.PI / 180) * 26}
          y1={45 + Math.sin(a * Math.PI / 180) * 26}
          x2={340 + Math.cos(a * Math.PI / 180) * 34}
          y2={45 + Math.sin(a * Math.PI / 180) * 34}
          stroke="#F5E6A0" strokeWidth="1.5" opacity="0.4" />
      ))}

      {/* Clouds */}
      {stage >= 2 && (
        <g opacity="0.3">
          <ellipse cx="80" cy="40" rx="30" ry="12" fill="white">
            <animate attributeName="cx" values="80;100;80" dur="20s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="200" cy="30" rx="25" ry="10" fill="white">
            <animate attributeName="cx" values="200;180;200" dur="25s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      {/* Ground */}
      <ellipse cx="200" cy="195" rx="190" ry="25" fill="url(#soilG)" />
      <rect x="10" y="195" width="380" height="60" fill="#6B5335" rx="4" />

      {/* EMPTY: seed */}
      {stage === 0 && (
        <g>
          <ellipse cx="200" cy="188" rx="6" ry="4" fill="#A0855A">
            <animate attributeName="ry" values="4;4.5;4" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="200" cy="188" rx="3" ry="2" fill="#8A7040" />
        </g>
      )}

      {/* SPROUTS (stage 1) */}
      {stage >= 1 && sessionCount > 0 && Array.from({ length: Math.min(sessionCount, 5) }).map((_, i) => {
        const x = 120 + i * 45;
        const h = 15 + (i * 3);
        return (
          <g key={`sp-${i}`}>
            <line x1={x} y1={190} x2={x} y2={190 - h} stroke="var(--garden-growth, #8BAE8B)" strokeWidth="2" strokeLinecap="round">
              <animate attributeName="y2" values={`${190-h+2};${190-h-2};${190-h+2}`} dur={`${3+i*0.5}s`} repeatCount="indefinite" />
            </line>
            <ellipse cx={x-4} cy={190-h+3} rx="4" ry="2" fill="var(--garden-growth, #8BAE8B)" transform={`rotate(-30 ${x-4} ${190-h+3})`}>
              <animate attributeName="rx" values="4;4.5;4" dur={`${3+i*0.3}s`} repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={x+4} cy={190-h+6} rx="4" ry="2" fill="var(--garden-growth, #8BAE8B)" transform={`rotate(30 ${x+4} ${190-h+6})`}>
              <animate attributeName="rx" values="4;4.5;4" dur={`${3.5+i*0.3}s`} repeatCount="indefinite" />
            </ellipse>
          </g>
        );
      })}

      {/* PLANTS (stage 2+) */}
      {stage >= 2 && uniqueEmotions.slice(0, plantCount).map((emotion, i) => {
        const plant = EMOTION_PLANTS[emotion] || EMOTION_PLANTS.fine;
        const spacing = 340 / (plantCount + 1);
        const x = 30 + spacing * (i + 1);
        const baseH = stage >= 3 ? 60 : 40;
        const h = baseH + (i % 3) * 10;
        const hasBlooms = stage >= 3;
        const isLush = stage >= 4;

        return (
          <g key={`pl-${emotion}-${i}`}>
            {/* Stem */}
            <path d={`M${x},190 Q${x+(i%2?3:-3)},${190-h/2} ${x},${190-h}`}
              stroke={plant.stem} strokeWidth={isLush ? 3 : 2} fill="none" strokeLinecap="round">
              <animate attributeName="d"
                values={`M${x},190 Q${x+3},${190-h/2} ${x},${190-h};M${x},190 Q${x-3},${190-h/2} ${x},${190-h};M${x},190 Q${x+3},${190-h/2} ${x},${190-h}`}
                dur={`${4+i*0.7}s`} repeatCount="indefinite" />
            </path>
            {/* Leaves */}
            {[0.3, 0.5, 0.7].map((pos, li) => {
              const ly = 190 - h * pos;
              const side = li % 2 === 0 ? -1 : 1;
              const ls = isLush ? 12 : 8;
              return (
                <ellipse key={li} cx={x + side*(ls-2)} cy={ly} rx={ls} ry={ls/3}
                  fill={plant.stem} opacity="0.8"
                  transform={`rotate(${side*30} ${x+side*(ls-2)} ${ly})`}>
                  <animate attributeName="rx" values={`${ls};${ls+1};${ls}`} dur={`${3+li}s`} repeatCount="indefinite" />
                </ellipse>
              );
            })}
            {/* Blooms */}
            {hasBlooms && (
              <g>
                {[0, 72, 144, 216, 288].map((angle, pi) => {
                  const px = x + Math.cos(angle * Math.PI / 180) * (isLush ? 8 : 6);
                  const py = (190 - h - 4) + Math.sin(angle * Math.PI / 180) * (isLush ? 8 : 6);
                  return (
                    <ellipse key={pi} cx={px} cy={py} rx={isLush ? 5 : 4} ry={isLush ? 7 : 5}
                      fill={plant.color} opacity="0.85"
                      transform={`rotate(${angle} ${px} ${py})`}>
                      <animate attributeName="opacity" values="0.75;0.95;0.75" dur={`${3+pi*0.5}s`} repeatCount="indefinite" />
                    </ellipse>
                  );
                })}
                <circle cx={x} cy={190-h-4} r={isLush ? 4 : 3} fill="#F5E6A0" opacity="0.9" />
              </g>
            )}
            {/* Extra blooms (lush) */}
            {isLush && [0.4, 0.6].map((pos, bi) => {
              const bx = x + (bi%2 ? 8 : -8);
              const by = 190 - h * pos;
              return (
                <g key={`eb-${bi}`}>
                  {[0, 90, 180, 270].map((a, ai) => (
                    <ellipse key={ai}
                      cx={bx + Math.cos(a*Math.PI/180)*4} cy={by + Math.sin(a*Math.PI/180)*4}
                      rx="3" ry="4" fill={plant.color} opacity="0.7"
                      transform={`rotate(${a} ${bx+Math.cos(a*Math.PI/180)*4} ${by+Math.sin(a*Math.PI/180)*4})`} />
                  ))}
                  <circle cx={bx} cy={by} r="2" fill="#F5E6A0" opacity="0.8" />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* Grass */}
      {stage >= 2 && Array.from({ length: 12 }).map((_, i) => {
        const gx = 25 + i * 32;
        return (
          <line key={`gr-${i}`} x1={gx} y1={192} x2={gx+(i%2?3:-3)} y2={186}
            stroke="var(--garden-growth, #8BAE8B)" strokeWidth="1.5" opacity="0.4" strokeLinecap="round">
            <animate attributeName="x2" values={`${gx+3};${gx-3};${gx+3}`} dur={`${5+i*0.3}s`} repeatCount="indefinite" />
          </line>
        );
      })}

      {/* Butterflies (streak) */}
      {displayStreak > 0 && Array.from({ length: displayStreak }).map((_, i) => {
        const bx = 60 + i * 70;
        const by = 60 + (i % 3) * 30;
        const colors = ["#D4A98E", "#A0C4D4", "#C4A0D8", "#D4C4A0", "#A0D4A8"];
        return (
          <g key={`bf-${i}`}>
            <ellipse cx={bx-4} cy={by} rx="5" ry="3" fill={colors[i%5]} opacity="0.7" transform={`rotate(-20 ${bx-4} ${by})`}>
              <animate attributeName="ry" values="3;1;3" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={bx+4} cy={by} rx="5" ry="3" fill={colors[i%5]} opacity="0.7" transform={`rotate(20 ${bx+4} ${by})`}>
              <animate attributeName="ry" values="3;1;3" dur="0.8s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={bx} cy={by} rx="1" ry="3" fill="#5A4A3A" />
            <animateTransform attributeName="transform" type="translate"
              values={`0,0;${10-i*3},${-5+i*2};0,0`} dur={`${4+i}s`} repeatCount="indefinite" />
          </g>
        );
      })}

      {/* Premium lock overlay */}
      {!isPremium && sessionCount > 5 && (
        <g>
          <rect x="0" y="0" width="400" height="180" fill="var(--bg-primary, #FDFAF6)" opacity="0.5" />
          <text x="200" y="90" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="13" fill="var(--accent-sage, #7D9B82)" fontWeight="500">
            🌿 Your garden wants to grow
          </text>
          <text x="200" y="110" textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontSize="11" fill="var(--accent-sage, #7D9B82)" opacity="0.7">
            Unlock Premium to see it bloom
          </text>
        </g>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MOOD SPARKLINE (SVG)
// ═══════════════════════════════════════════════════════════════
function MoodSparkline({ moods }) {
  const last30 = moods.slice(-30);
  if (last30.length < 2) return null;
  const w = 300, h = 60, pad = 8;
  const pts = last30.map((m, i) => {
    const x = pad + (i / (last30.length - 1)) * (w - pad * 2);
    const y = h - pad - ((m.moodScore - 1) / 4) * (h - pad * 2);
    return { x, y };
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", maxWidth: 300, display: "block" }}>
      <rect x="0" y="0" width={w} height={h} rx="8" fill="var(--surface, #FAF7F2)" />
      <polyline points={pts.map(p => `${p.x},${p.y}`).join(" ")}
        fill="none" stroke="var(--garden-growth, #8BAE8B)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="var(--garden-growth, #8BAE8B)" opacity="0.6" />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function GardenClient() {
  const [sessions, setSessions] = useState([]);
  const [moods, setMoods] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [streakData, setStreakData] = useState({ currentStreak: 0, longestStreak: 0 });
  const [isPremium, setIsPremium] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodNote, setMoodNote] = useState("");
  const [moodLogged, setMoodLogged] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [gardenPulse, setGardenPulse] = useState(false);

  // Load all data from IndexedDB
  useEffect(() => {
    async function load() {
      try {
        const [s, m, b, st] = await Promise.all([
          getSessions(), getMoodCheckins(), getBlueprints(), getStreak()
        ]);
        setSessions(s);
        setMoods(m);
        setBlueprints(b);
        setStreakData(st);
        const prem = localStorage.getItem("aiforj_premium") === "true"
          || localStorage.getItem("forj_tier") === "premium"
          || localStorage.getItem("forj_tier") === "trial";
        setIsPremium(prem);
      } catch (e) {
        console.warn("Garden: IndexedDB load error", e);
      }
      setLoaded(true);
    }
    load();
  }, []);

  // Computed
  const emotionCounts = {};
  sessions.forEach(s => { emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1; });
  const allEmotions = sessions.map(s => s.emotion);
  const topEmotion = Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0];

  const techniqueCounts = {};
  sessions.forEach(s => {
    if (s.techniqueUsed) {
      techniqueCounts[s.techniqueUsed] = (techniqueCounts[s.techniqueUsed] || 0) + 1;
    }
  });
  const topTechnique = Object.entries(techniqueCounts).sort((a, b) => b[1] - a[1])[0];

  const MOOD_OPTIONS = [
    { value: 1, emoji: "😔", label: "Struggling" },
    { value: 2, emoji: "😕", label: "Low" },
    { value: 3, emoji: "😐", label: "Okay" },
    { value: 4, emoji: "🙂", label: "Good" },
    { value: 5, emoji: "😊", label: "Great" },
  ];

  const logMood = useCallback(async () => {
    if (selectedMood === null) return;
    const opt = MOOD_OPTIONS.find(m => m.value === selectedMood);
    await saveMoodCheckin({ moodScore: selectedMood, note: moodNote || opt.label });
    const updated = await getMoodCheckins();
    setMoods(updated);
    setMoodLogged(true);
    setGardenPulse(true);
    setTimeout(() => setGardenPulse(false), 2000);
  }, [selectedMood, moodNote]);

  const handleExportJSON = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `forj-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const earliest = sessions.length > 0
      ? new Date(sessions[sessions.length - 1].timestamp).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
      : "N/A";
    const latest = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    const emotionsUsed = Object.entries(emotionCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([e, c]) => `${EMOTION_PLANTS[e]?.name || e} (${c} sessions)`)
      .join(", ");

    const pw = window.open("", "_blank");
    if (!pw) return;
    pw.document.write(`<!DOCTYPE html><html><head><title>My Forj Progress Report</title>
      <style>
        body{font-family:Georgia,serif;color:#2D2A26;max-width:700px;margin:0 auto;padding:40px;line-height:1.8}
        h1{font-size:28px;font-weight:400;margin:0 0 8px}
        h2{font-size:18px;font-weight:600;margin:32px 0 12px;color:#7D9B82;border-bottom:1px solid #E8F0E9;padding-bottom:8px}
        .stat{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #F5EFE7}
        .stat-label{color:#6B6560}.stat-value{font-weight:600}
        .footer{margin-top:48px;padding-top:24px;border-top:1px solid #E8F0E9;font-size:12px;color:#9B9590;text-align:center}
        @media print{body{padding:20px}}
      </style></head><body>
      <h1>My Forj Progress Report</h1>
      <div style="font-size:13px;color:#6B6560;margin-bottom:32px">${earliest} — ${latest}</div>
      <h2>Summary</h2>
      <div class="stat"><span class="stat-label">Total Sessions</span><span class="stat-value">${sessions.length}</span></div>
      <div class="stat"><span class="stat-label">Current Streak</span><span class="stat-value">${streakData.currentStreak} day${streakData.currentStreak !== 1 ? "s" : ""}</span></div>
      <div class="stat"><span class="stat-label">Longest Streak</span><span class="stat-value">${streakData.longestStreak} day${streakData.longestStreak !== 1 ? "s" : ""}</span></div>
      <div class="stat"><span class="stat-label">Emotions Explored</span><span class="stat-value">${Object.keys(emotionCounts).length}</span></div>
      <div class="stat"><span class="stat-label">Mood Check-ins</span><span class="stat-value">${moods.length}</span></div>
      ${topTechnique ? `<div class="stat"><span class="stat-label">Most Used Technique</span><span class="stat-value">${topTechnique[0]}</span></div>` : ""}
      ${blueprints.length > 0 ? `<div class="stat"><span class="stat-label">Blueprint Archetype</span><span class="stat-value">${blueprints[0].archetype}</span></div>` : ""}
      <h2>Emotions Explored</h2><p>${emotionsUsed || "No sessions yet."}</p>
      ${moods.length >= 2 ? `<h2>Mood Trend</h2><p>Last ${Math.min(moods.length, 30)} check-ins: ${moods[moods.length-1]?.moodScore}/5 → ${moods[0]?.moodScore}/5</p>` : ""}
      <div class="footer"><p>Generated locally — this data never left your device.</p><p><strong>aiforj.com</strong> — Built by AIForj Team and clinically informed by a Licensed Healthcare Provider</p></div>
    </body></html>`);
    pw.document.close();
    pw.print();
  };

  const handleDeleteAll = async () => {
    await deleteAllData();
    setSessions([]); setMoods([]); setBlueprints([]);
    setStreakData({ currentStreak: 0, longestStreak: 0 });
    setShowDeleteModal(false); setMoodLogged(false);
    setSelectedMood(null); setMoodNote("");
  };

  if (!loaded) return <div style={{ minHeight: "100vh" }} />;

  const streak = streakData.currentStreak;

  return (
    <div className="garden-page" style={{ maxWidth: "var(--max-text, 680px)", margin: "0 auto", padding: "0 20px 80px" }}>
      <style>{`
        .garden-page input:focus, .garden-page textarea:focus { outline: none; border-color: var(--accent-sage) !important; }
        @keyframes gardenGrow { 0%{transform:scale(1)} 50%{transform:scale(1.02)} 100%{transform:scale(1)} }
        .garden-card { background: var(--surface, #FAF7F2); border-radius: var(--radius-lg, 24px); padding: 24px; border: 1px solid var(--border, rgba(0,0,0,0.06)); }
        .garden-card-sm { background: var(--surface, #FAF7F2); border-radius: var(--radius-md, 12px); padding: 20px; border: 1px solid var(--border, rgba(0,0,0,0.06)); }
        .garden-label { font-size: 11px; color: var(--text-muted, #9B9590); text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 8px; }
        .garden-btn { font-family: 'DM Sans', sans-serif; border: none; cursor: pointer; border-radius: 50px; transition: all 0.3s; }
      `}</style>

      {/* ═══ YOUR GARDEN ═══ */}
      <section style={{ marginBottom: 40, paddingTop: 24 }}>
        <h1 style={{ fontFamily: "Fraunces, serif", fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 8px", textAlign: "center" }}>
          Your Garden
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", textAlign: "center", marginBottom: 24 }}>
          {sessions.length === 0 ? "Your garden is ready." :
           sessions.length <= 5 ? "Your garden is sprouting." :
           sessions.length <= 15 ? "Your garden is growing." :
           sessions.length <= 30 ? "Your garden is blooming." :
           "Your garden is flourishing."}
        </p>

        <div style={{
          background: "var(--garden-sky-bottom, #E8EFE6)", borderRadius: "var(--radius-lg, 24px)",
          overflow: "hidden", border: "1px solid var(--border, rgba(0,0,0,0.06))",
          animation: gardenPulse ? "gardenGrow 1s ease" : "none",
        }}>
          <GardenSVG sessionCount={sessions.length} emotions={allEmotions} streak={streak} isPremium={isPremium} />
        </div>

        {sessions.length === 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 16 }}>
              Complete your first session to plant your first seed.
            </p>
            <a href="/" className="garden-btn" style={{
              display: "inline-block", padding: "12px 28px", fontSize: 14,
              background: "var(--interactive, #7D9B82)", color: "white", textDecoration: "none", fontWeight: 500,
            }}>
              Start a session →
            </a>
          </div>
        )}
      </section>

      {/* ═══ DAILY CHECK-IN ═══ */}
      <section className="garden-card" style={{ marginBottom: 24 }}>
        {moodLogged ? (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <span style={{ fontSize: 28, display: "block", marginBottom: 8 }}>🌱</span>
            <p style={{ fontSize: 15, color: "var(--text-primary)", margin: "0 0 4px", fontWeight: 500 }}>
              Mood logged. Your garden grew a little today.
            </p>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Come back tomorrow to keep your streak going.</p>
          </div>
        ) : (
          <>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 18, fontWeight: 400, margin: "0 0 16px", color: "var(--text-primary)", textAlign: "center" }}>
              How are you feeling right now?
            </h3>
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {MOOD_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => setSelectedMood(opt.value)} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: "10px 14px", borderRadius: "var(--radius-md, 12px)", border: "none", cursor: "pointer",
                  background: selectedMood === opt.value ? "var(--accent-sage-light, #E8F0E9)" : "transparent",
                  outline: selectedMood === opt.value ? "2px solid var(--accent-sage, #7D9B82)" : "2px solid transparent",
                  transition: "all 0.2s",
                }}>
                  <span style={{ fontSize: 26 }}>{opt.emoji}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: 0.5 }}>{opt.label}</span>
                </button>
              ))}
            </div>
            <input type="text" value={moodNote} onChange={e => setMoodNote(e.target.value)}
              placeholder="Optional: a quick note about today..."
              style={{
                width: "100%", padding: "10px 16px", fontSize: 13, border: "1px solid var(--border, rgba(0,0,0,0.08))",
                borderRadius: "var(--radius-md, 12px)", background: "var(--bg-primary, #FDFAF6)",
                color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif", marginBottom: 12, boxSizing: "border-box",
              }} />
            <button onClick={logMood} disabled={selectedMood === null} className="garden-btn" style={{
              width: "100%", padding: 12, fontSize: 14, fontWeight: 500,
              background: selectedMood !== null ? "var(--interactive, #7D9B82)" : "var(--border, rgba(0,0,0,0.06))",
              color: selectedMood !== null ? "white" : "var(--text-muted, #9B9590)",
              cursor: selectedMood !== null ? "pointer" : "not-allowed",
            }}>
              Log
            </button>
          </>
        )}
      </section>

      {/* ═══ STATS ═══ */}
      <section>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 16px" }}>
          Your Stats
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div className="garden-card-sm">
            <span className="garden-label">Current Streak</span>
            <span style={{ fontSize: 28, fontWeight: 300, color: "var(--text-primary)" }}>🌱 {streak}</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 4 }}>day{streak !== 1 ? "s" : ""} in a row</span>
            {streak > 0 && (
              <div style={{ marginTop: 10, height: 4, background: "var(--border, rgba(0,0,0,0.06))", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 2, background: "linear-gradient(90deg, var(--garden-growth, #8BAE8B), var(--garden-bloom, #D4A98E))", width: `${Math.min(streak/30*100, 100)}%`, transition: "width 0.5s" }} />
              </div>
            )}
          </div>
          <div className="garden-card-sm">
            <span className="garden-label">Total Sessions</span>
            <span style={{ fontSize: 28, fontWeight: 300, color: "var(--text-primary)" }}>{sessions.length}</span>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", marginLeft: 4 }}>completed</span>
          </div>
        </div>

        {/* Emotions Explored */}
        <div className="garden-card-sm" style={{ marginBottom: 12 }}>
          <span className="garden-label">Emotions Explored</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {Object.entries(EMOTION_PLANTS).map(([id, plant]) => {
              const count = emotionCounts[id] || 0;
              return (
                <div key={id} style={{
                  display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 20,
                  background: count > 0 ? "var(--accent-sage-light, #E8F0E9)" : "var(--border, rgba(0,0,0,0.03))",
                  opacity: count > 0 ? 1 : 0.4,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: count > 0 ? plant.color : "#ccc", border: `1px solid ${count > 0 ? plant.stem : "#ddd"}` }} />
                  <span style={{ fontSize: 11, color: "var(--text-primary)" }}>{plant.name}</span>
                  {count > 0 && <span style={{ fontSize: 10, color: "var(--text-muted)", opacity: 0.6 }}>×{count}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Used Technique */}
        {topTechnique && (
          <div className="garden-card-sm" style={{ marginBottom: 12 }}>
            <span className="garden-label">Most Used Technique</span>
            <span style={{ fontSize: 15, color: "var(--text-primary)" }}>{topTechnique[0]}</span>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 6 }}>used {topTechnique[1]} time{topTechnique[1] > 1 ? "s" : ""}</span>
          </div>
        )}

        {/* Blueprint History (premium) */}
        {isPremium && blueprints.length > 0 && (
          <div className="garden-card-sm" style={{ marginBottom: 12 }}>
            <span className="garden-label">Blueprint History</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {blueprints.map((b, i) => (
                <div key={b.id} style={{
                  padding: "8px 14px", borderRadius: "var(--radius-md, 12px)",
                  background: i === 0 ? "var(--accent-sage-light, #E8F0E9)" : "var(--border, rgba(0,0,0,0.03))",
                  border: i === 0 ? "1px solid var(--accent-sage, #7D9B82)" : "1px solid transparent",
                }}>
                  <span style={{ fontSize: 13, fontWeight: i === 0 ? 500 : 400, color: "var(--text-primary)" }}>{b.archetype}</span>
                  <span style={{ fontSize: 10, color: "var(--text-muted)", display: "block", marginTop: 2 }}>
                    {new Date(b.timestamp).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mood Trend (premium) */}
        {isPremium && moods.length >= 2 && (
          <div className="garden-card-sm" style={{ marginBottom: 12 }}>
            <span className="garden-label">Mood Trend (Last 30 Days)</span>
            <MoodSparkline moods={moods.slice().reverse()} />
          </div>
        )}

        {/* Weekly Insights */}
        <WeeklyInsightsClient isPremium={isPremium} />

        {/* Premium upsell */}
        {!isPremium && (sessions.length > 5 || moods.length >= 2) && (
          <div className="garden-card" style={{ textAlign: "center", borderStyle: "dashed", cursor: "pointer", marginBottom: 12 }} onClick={() => window.location.href = "/"}>
            <span style={{ fontSize: 24, display: "block", marginBottom: 8 }}>🌿</span>
            <p style={{ fontSize: 14, color: "var(--text-primary)", margin: "0 0 4px", fontWeight: 500 }}>Unlock your full garden</p>
            <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 12px" }}>Full bloom, mood trends, Blueprint history, export PDF</p>
            <span className="garden-btn" style={{ display: "inline-block", padding: "8px 20px", fontSize: 12, background: "var(--interactive, #7D9B82)", color: "white", fontWeight: 500 }}>
              ✦ Unlock Premium
            </span>
          </div>
        )}
      </section>

      {/* ═══ EXPORT & SHARE ═══ */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 16px" }}>
          Export &amp; Share
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <button onClick={() => isPremium ? handleExportPDF() : (window.location.href = "/")} className="garden-card-sm" style={{
            cursor: "pointer", textAlign: "center", fontFamily: "'DM Sans', sans-serif", position: "relative",
          }}>
            <span style={{ fontSize: 22, display: "block", marginBottom: 6 }}>📄</span>
            <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, display: "block" }}>Export Progress</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>PDF for your therapist</span>
            {!isPremium && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 10 }}>🔒</span>}
          </button>
          <button onClick={() => {
            const text = `I'm growing my mental wellness garden with Forj! 🌱 ${streak > 0 ? `${streak}-day streak! ` : ""}${sessions.length} sessions completed. — aiforj.com`;
            if (navigator.share) navigator.share({ title: "My Forj Garden", text, url: "https://aiforj.com" }).catch(() => {});
            else navigator.clipboard?.writeText(text).then(() => alert("Copied to clipboard!")).catch(() => {});
          }} className="garden-card-sm" style={{ cursor: "pointer", textAlign: "center", fontFamily: "'DM Sans', sans-serif" }}>
            <span style={{ fontSize: 22, display: "block", marginBottom: 6 }}>🌿</span>
            <span style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500, display: "block" }}>Share Garden</span>
            <span style={{ fontSize: 10, color: "var(--text-muted)" }}>Share your milestone</span>
          </button>
        </div>
        <button onClick={handleExportJSON} style={{
          width: "100%", padding: 14, borderRadius: "var(--radius-md, 12px)",
          border: "1px solid var(--border, rgba(0,0,0,0.08))", background: "transparent",
          cursor: "pointer", fontSize: 13, color: "var(--text-secondary)", fontFamily: "'DM Sans', sans-serif",
        }}>
          📦 Export My Data (JSON)
        </button>
      </section>

      {/* ═══ DELETE ═══ */}
      <section style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border, rgba(0,0,0,0.06))" }}>
        <button onClick={() => setShowDeleteModal(true)} style={{
          width: "100%", padding: 12, borderRadius: "var(--radius-md, 12px)",
          border: "1px solid rgba(200,80,80,0.2)", background: "rgba(200,80,80,0.04)",
          cursor: "pointer", fontSize: 13, color: "#A05050", fontFamily: "'DM Sans', sans-serif",
        }}>
          Delete All My Data
        </button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
          All data is stored locally on your device. Nothing is on any server.
        </p>
      </section>

      {/* ═══ DELETE MODAL ═══ */}
      {showDeleteModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24,
        }} onClick={() => setShowDeleteModal(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--bg-primary, #FDFAF6)", borderRadius: "var(--radius-lg, 24px)",
            padding: 32, maxWidth: 400, width: "100%", boxShadow: "0 24px 80px rgba(0,0,0,0.15)",
          }}>
            <h3 style={{ fontFamily: "Fraunces, serif", fontSize: 20, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 12px" }}>Delete all data?</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 24px" }}>
              This will permanently erase your garden, sessions, mood check-ins, and all local data. <strong>This cannot be undone.</strong>
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{
                flex: 1, padding: 12, borderRadius: "var(--radius-md, 12px)",
                border: "1px solid var(--border)", background: "transparent", cursor: "pointer",
                fontSize: 14, color: "var(--text-primary)", fontFamily: "'DM Sans', sans-serif",
              }}>Cancel</button>
              <button onClick={handleDeleteAll} style={{
                flex: 1, padding: 12, borderRadius: "var(--radius-md, 12px)", border: "none",
                background: "#C05050", cursor: "pointer", fontSize: 14, color: "white", fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
              }}>Delete Everything</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "24px 0 0", marginTop: 40 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.7 }}>
          AIForj — Built by AIForj Team and clinically informed by a Licensed Healthcare Provider<br />
          Your data never leaves your device. Privacy is not a feature — it&apos;s the foundation.
        </p>
      </footer>
    </div>
  );
}
