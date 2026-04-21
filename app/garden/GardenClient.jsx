"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getSessions,
  getMoodCheckins,
  saveMoodCheckin,
  getBlueprints,
  getStreak,
  exportAllData,
  deleteAllData,
  syncLegacyLocalSessions,
} from "../lib/db";
import WeeklyInsightsClient from "./WeeklyInsightsClient";
import { buildGardenSnapshot, EMOTION_PLANTS } from "./gardenData";
import { getPremiumAccessStatus } from "../../utils/premiumAccess";

const MOOD_OPTIONS = [
  { value: 1, emoji: "😔", label: "Struggling" },
  { value: 2, emoji: "😕", label: "Low" },
  { value: 3, emoji: "😐", label: "Okay" },
  { value: 4, emoji: "🙂", label: "Good" },
  { value: 5, emoji: "😊", label: "Great" },
];

function parseStoredJSON(value) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function getPremiumStatus() {
  if (typeof window === "undefined") return false;
  return getPremiumAccessStatus().active;
}

function getShiftTone(shift) {
  if (shift >= 3) return { label: "Strong shift", color: "var(--success)" };
  if (shift > 0) return { label: "Helpful shift", color: "var(--sage-deep)" };
  if (shift === 0) return { label: "Steady", color: "var(--text-secondary)" };
  return { label: "Mixed", color: "var(--warning)" };
}

function GardenSVG({ sessionCount, emotions, streak, isPremium }) {
  const baseStage = sessionCount === 0 ? 0 : sessionCount <= 3 ? 1 : sessionCount <= 12 ? 2 : sessionCount <= 28 ? 3 : 4;
  const stage = isPremium ? Math.min(4, baseStage + (sessionCount > 10 ? 1 : 0)) : baseStage;
  const uniqueEmotions = [...new Set(emotions)].slice(0, 7);
  const plantCount = Math.min(uniqueEmotions.length || Math.min(sessionCount, 3), 7);
  const displayStreak = Math.min(streak, 5);

  return (
    <svg viewBox="0 0 520 320" style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="gardenSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(228, 238, 230, 0.96)" />
          <stop offset="100%" stopColor="rgba(248, 244, 237, 0.98)" />
        </linearGradient>
        <linearGradient id="gardenSoil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B5335" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="520" height="240" rx="28" fill="url(#gardenSky)" />
      <ellipse cx="438" cy="62" rx="26" ry="26" fill="#F5E6A0" opacity="0.72">
        <animate attributeName="opacity" values="0.55;0.85;0.55" dur="6s" repeatCount="indefinite" />
      </ellipse>

      {stage >= 2 && (
        <g opacity="0.35">
          <ellipse cx="112" cy="72" rx="42" ry="15" fill="white">
            <animate attributeName="cx" values="112;138;112" dur="26s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="252" cy="46" rx="34" ry="12" fill="white">
            <animate attributeName="cx" values="252;230;252" dur="22s" repeatCount="indefinite" />
          </ellipse>
        </g>
      )}

      <ellipse cx="260" cy="246" rx="220" ry="30" fill="url(#gardenSoil)" />
      <rect x="28" y="246" width="464" height="80" rx="18" fill="#6B5335" />

      {stage === 0 && (
        <g>
          <ellipse cx="260" cy="235" rx="8" ry="5" fill="#A0855A">
            <animate attributeName="ry" values="5;6;5" dur="3.2s" repeatCount="indefinite" />
          </ellipse>
          <path d="M248 214 C252 208, 258 206, 260 199 C264 206, 270 210, 272 218" fill="none" stroke="#8BAE8B" strokeWidth="2" opacity="0.2" />
        </g>
      )}

      {stage >= 1 && Array.from({ length: Math.min(sessionCount || 1, 5) }).map((_, index) => {
        const x = 140 + index * 52;
        const h = 18 + index * 5;
        return (
          <g key={`sprout-${index}`}>
            <line x1={x} y1={238} x2={x} y2={238 - h} stroke="#8BAE8B" strokeWidth="2.4" strokeLinecap="round">
              <animate attributeName="y2" values={`${238 - h + 2};${238 - h - 2};${238 - h + 2}`} dur={`${3 + index * 0.4}s`} repeatCount="indefinite" />
            </line>
            <ellipse cx={x - 5} cy={238 - h + 4} rx="5" ry="3" fill="#8BAE8B" transform={`rotate(-28 ${x - 5} ${238 - h + 4})`} />
            <ellipse cx={x + 5} cy={238 - h + 7} rx="5" ry="3" fill="#8BAE8B" transform={`rotate(28 ${x + 5} ${238 - h + 7})`} />
          </g>
        );
      })}

      {stage >= 2 && uniqueEmotions.slice(0, plantCount).map((emotion, index) => {
        const plant = EMOTION_PLANTS[emotion] || EMOTION_PLANTS.fine;
        const spacing = 400 / (plantCount + 1);
        const x = 60 + spacing * (index + 1);
        const height = stage >= 4 ? 108 + (index % 3) * 12 : 78 + (index % 3) * 10;
        const lush = stage >= 4;

        return (
          <g key={`plant-${emotion}-${index}`}>
            <path
              d={`M${x},238 C${x + (index % 2 ? 8 : -8)},${238 - height / 2} ${x - (index % 2 ? 10 : -10)},${238 - height * 0.72} ${x},${238 - height}`}
              fill="none"
              stroke={plant.stem}
              strokeWidth={lush ? 3.2 : 2.4}
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                values={`M${x},238 C${x + 8},${238 - height / 2} ${x - 10},${238 - height * 0.72} ${x},${238 - height};M${x},238 C${x - 8},${238 - height / 2} ${x + 10},${238 - height * 0.72} ${x},${238 - height};M${x},238 C${x + 8},${238 - height / 2} ${x - 10},${238 - height * 0.72} ${x},${238 - height}`}
                dur={`${4 + index * 0.45}s`}
                repeatCount="indefinite"
              />
            </path>

            {[0.28, 0.52, 0.74].map((position, leafIndex) => {
              const y = 238 - height * position;
              const side = leafIndex % 2 === 0 ? -1 : 1;
              const rx = lush ? 13 : 10;
              return (
                <ellipse
                  key={leafIndex}
                  cx={x + side * (rx - 1)}
                  cy={y}
                  rx={rx}
                  ry={rx / 3.2}
                  fill={plant.stem}
                  opacity="0.84"
                  transform={`rotate(${side * 30} ${x + side * (rx - 1)} ${y})`}
                />
              );
            })}

            {stage >= 3 && (
              <g>
                {[0, 72, 144, 216, 288].map((angle, petalIndex) => {
                  const px = x + Math.cos((angle * Math.PI) / 180) * (lush ? 10 : 7);
                  const py = (238 - height - 4) + Math.sin((angle * Math.PI) / 180) * (lush ? 10 : 7);
                  return (
                    <ellipse
                      key={petalIndex}
                      cx={px}
                      cy={py}
                      rx={lush ? 6 : 5}
                      ry={lush ? 10 : 7}
                      fill={plant.color}
                      opacity="0.9"
                      transform={`rotate(${angle} ${px} ${py})`}
                    >
                      <animate attributeName="opacity" values="0.72;0.96;0.72" dur={`${3 + petalIndex * 0.4}s`} repeatCount="indefinite" />
                    </ellipse>
                  );
                })}
                <circle cx={x} cy={238 - height - 4} r={lush ? 4 : 3} fill="#F5E6A0" />
              </g>
            )}
          </g>
        );
      })}

      {displayStreak > 0 && Array.from({ length: displayStreak }).map((_, index) => {
        const x = 84 + index * 74;
        const y = 88 + (index % 3) * 24;
        const colors = ["#D4A98E", "#A0C4D4", "#C4A0D8", "#D4C4A0", "#A0D4A8"];
        return (
          <g key={`butterfly-${index}`}>
            <ellipse cx={x - 5} cy={y} rx="6" ry="4" fill={colors[index % colors.length]} opacity="0.78" transform={`rotate(-18 ${x - 5} ${y})`}>
              <animate attributeName="ry" values="4;1.2;4" dur="0.85s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={x + 5} cy={y} rx="6" ry="4" fill={colors[index % colors.length]} opacity="0.78" transform={`rotate(18 ${x + 5} ${y})`}>
              <animate attributeName="ry" values="4;1.2;4" dur="0.85s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx={x} cy={y} rx="1.1" ry="4" fill="#5A4A3A" />
            <animateTransform attributeName="transform" type="translate" values={`0,0;${9 - index * 2},${-4 + index};0,0`} dur={`${4 + index * 0.6}s`} repeatCount="indefinite" />
          </g>
        );
      })}
    </svg>
  );
}

function GardenStat({ label, value, detail, tone = "var(--sage-deep)" }) {
  return (
    <div className="garden-card-sm" style={{ display: "grid", gap: 8 }}>
      <span className="garden-label">{label}</span>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 34px)", color: tone, lineHeight: 1 }}>{value}</div>
      {detail && <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{detail}</p>}
    </div>
  );
}

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
  const [syncInfo, setSyncInfo] = useState({ imported: 0, total: 0 });

  const loadGarden = useCallback(async () => {
    try {
      const sync = await syncLegacyLocalSessions();
      setSyncInfo(sync);
      const [nextSessions, nextMoods, nextBlueprints, nextStreak] = await Promise.all([
        getSessions(),
        getMoodCheckins(),
        getBlueprints(),
        getStreak(),
      ]);
      setSessions(nextSessions);
      setMoods(nextMoods);
      setBlueprints(nextBlueprints);
      setStreakData(nextStreak);
      setIsPremium(getPremiumStatus());
    } catch (error) {
      console.warn("Garden: load error", error);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadGarden();
  }, [loadGarden]);

  const snapshot = useMemo(
    () => buildGardenSnapshot({ sessions, moods, blueprints, streakData }),
    [sessions, moods, blueprints, streakData]
  );

  const allEmotions = snapshot.biome.map((entry) => entry.id);
  const latestShiftTone = snapshot.latestSession && typeof snapshot.latestSession.shift === "number"
    ? getShiftTone(snapshot.latestSession.shift)
    : getShiftTone(0);

  const logMood = useCallback(async () => {
    if (selectedMood === null) return;
    const option = MOOD_OPTIONS.find((mood) => mood.value === selectedMood);
    await saveMoodCheckin({ moodScore: selectedMood, note: moodNote || option?.label || null });
    const updatedMoods = await getMoodCheckins();
    setMoods(updatedMoods);
    setMoodLogged(true);
    setGardenPulse(true);
    setTimeout(() => setGardenPulse(false), 1800);
  }, [selectedMood, moodNote]);

  const handleExportJSON = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `aiforj-garden-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    const opened = window.open("", "_blank");
    if (!opened) return;

    const emotionsUsed = snapshot.biome.length
      ? snapshot.biome.slice(0, 6).map((entry) => `${entry.plantName} (${entry.sessions})`).join(", ")
      : "No planted emotions yet.";

    opened.document.write(`<!DOCTYPE html><html><head><title>My AIForj Mood Garden</title>
      <style>
        body { font-family: Georgia, serif; color: #2C2520; max-width: 760px; margin: 0 auto; padding: 40px; line-height: 1.8; }
        h1 { font-size: 30px; font-weight: 500; margin: 0 0 8px; }
        h2 { font-size: 18px; font-weight: 600; margin: 32px 0 12px; color: #4A7A50; border-bottom: 1px solid #E8F0E8; padding-bottom: 8px; }
        .stat { display: flex; justify-content: space-between; gap: 12px; padding: 8px 0; border-bottom: 1px solid #F3EDE4; }
        .label { color: #5C534A; }
        .value { font-weight: 600; }
        .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #E8F0E8; font-size: 12px; color: #8A8078; text-align: center; }
      </style></head><body>
      <h1>My AIForj Mood Garden</h1>
      <div style="font-size:13px;color:#5C534A;margin-bottom:24px;">Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
      <h2>Landscape</h2>
      <div class="stat"><span class="label">Season</span><span class="value">${snapshot.season.label}</span></div>
      <div class="stat"><span class="label">Total sessions</span><span class="value">${snapshot.totalSessions}</span></div>
      <div class="stat"><span class="label">Current streak</span><span class="value">${snapshot.streak} day${snapshot.streak === 1 ? "" : "s"}</span></div>
      <div class="stat"><span class="label">Longest streak</span><span class="value">${snapshot.longestStreak} day${snapshot.longestStreak === 1 ? "" : "s"}</span></div>
      <div class="stat"><span class="label">Average mood shift</span><span class="value">${snapshot.averageShift > 0 ? "+" : ""}${snapshot.averageShift}</span></div>
      <div class="stat"><span class="label">Emotions explored</span><span class="value">${snapshot.emotionsExplored}</span></div>
      <div class="stat"><span class="label">Mood check-ins</span><span class="value">${snapshot.totalMoodCheckins}</span></div>
      ${snapshot.topTechnique ? `<div class="stat"><span class="label">Most used technique</span><span class="value">${snapshot.topTechnique.name}</span></div>` : ""}
      ${snapshot.latestBlueprint ? `<div class="stat"><span class="label">Latest blueprint</span><span class="value">${snapshot.latestBlueprint.archetype}</span></div>` : ""}
      <h2>Emotional biome</h2>
      <p>${emotionsUsed}</p>
      <div class="footer">
        <p>Built and clinically informed by Kevin · Psychiatric NP candidate</p>
        <p>This report was generated locally. Your data never left your device.</p>
      </div>
    </body></html>`);
    opened.document.close();
    opened.print();
  };

  const handleShare = async () => {
    const text = `My AIForj Mood Garden: ${snapshot.totalSessions} sessions, ${snapshot.streak}-day streak, ${snapshot.averageShift > 0 ? "+" : ""}${snapshot.averageShift} average mood shift. aiforj.com/garden`;
    if (navigator.share) {
      navigator.share({ title: "My AIForj Mood Garden", text, url: "https://aiforj.com/garden" }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(text).catch(() => {});
  };

  const handleDeleteAll = async () => {
    await deleteAllData();
    localStorage.removeItem("aiforj_sessions");
    setSessions([]);
    setMoods([]);
    setBlueprints([]);
    setStreakData({ currentStreak: 0, longestStreak: 0 });
    setSelectedMood(null);
    setMoodNote("");
    setMoodLogged(false);
    setShowDeleteModal(false);
  };

  if (!loaded) {
    return <div style={{ minHeight: "100vh" }} />;
  }

  return (
    <div className="garden-page" style={{ maxWidth: 1140, margin: "0 auto", padding: "0 20px 96px" }}>
      <style>{`
        .garden-page input:focus, .garden-page textarea:focus { outline: none; border-color: var(--sage) !important; box-shadow: 0 0 0 3px rgba(122, 158, 126, 0.12); }
        .garden-card { background: color-mix(in srgb, var(--surface-elevated) 92%, white); border-radius: var(--radius-xl); padding: 24px; border: 1px solid var(--border); box-shadow: var(--shadow-md); }
        .garden-card-sm { background: color-mix(in srgb, var(--surface) 94%, white); border-radius: var(--radius-md); padding: 20px; border: 1px solid var(--border); box-shadow: var(--shadow-sm); }
        .garden-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.14em; display: block; margin-bottom: 8px; font-weight: 700; }
        .garden-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: none; cursor: pointer; text-decoration: none; transition: all 220ms var(--ease-out); }
        .garden-soft-gradient { background: linear-gradient(145deg, rgba(122, 158, 126, 0.16), rgba(107, 152, 184, 0.08) 45%, rgba(255, 255, 255, 0.9)); }
        @keyframes gardenPulse { 0% { transform: scale(1); } 50% { transform: scale(1.015); } 100% { transform: scale(1); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .garden-rise { animation: riseIn 420ms var(--ease-out); }
        @media (max-width: 920px) {
          .garden-hero-grid, .garden-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .garden-metric-grid, .garden-action-grid, .garden-stat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <section style={{ paddingTop: 26, marginBottom: 28 }}>
        <div className="garden-hero-grid garden-rise" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)", gap: 20, alignItems: "start" }}>
          <div className="garden-card garden-soft-gradient" style={{ overflow: "hidden", animation: gardenPulse ? "gardenPulse 1.2s ease" : "none" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 14 }}>
              <span className="tag tag-act">Private progress landscape</span>
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Local-only · session-powered · grows with you</span>
            </div>
            <h1 style={{ margin: "0 0 14px", fontSize: "clamp(34px, 6vw, 58px)" }}>Mood Garden</h1>
            <p style={{ margin: "0 0 22px", maxWidth: 720, color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.8 }}>
              Every technique, mood check-in, and quiet comeback adds to a private landscape that lives on this device. Not a feed. Not a streak trap. A calmer way to see your own momentum.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
              <a href="/start" className="btn-primary" style={{ textDecoration: "none" }}>Plant something new →</a>
              <a href="#garden-biome" className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)" }}>See your biome ↓</a>
              <button onClick={handleShare} className="btn-ghost">Share garden</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 20 }} className="garden-stat-grid">
              <div className="garden-card-sm" style={{ padding: 14 }}>
                <span className="garden-label">Season</span>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>{snapshot.season.label}</div>
              </div>
              <div className="garden-card-sm" style={{ padding: 14 }}>
                <span className="garden-label">Streak</span>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>{snapshot.streak} day{snapshot.streak === 1 ? "" : "s"}</div>
              </div>
              <div className="garden-card-sm" style={{ padding: 14 }}>
                <span className="garden-label">Average shift</span>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>{snapshot.averageShift > 0 ? "+" : ""}{snapshot.averageShift}</div>
              </div>
              <div className="garden-card-sm" style={{ padding: 14 }}>
                <span className="garden-label">Active days</span>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22 }}>{snapshot.activeDays30} / 30</div>
              </div>
            </div>

            <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", border: "1px solid rgba(122, 158, 126, 0.14)", background: "rgba(255,255,255,0.62)" }}>
              <GardenSVG sessionCount={snapshot.totalSessions} emotions={allEmotions} streak={snapshot.streak} isPremium={isPremium} />
              <div style={{ position: "absolute", left: 16, top: 16, padding: "10px 12px", borderRadius: 16, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(10px)", boxShadow: "var(--shadow-sm)" }}>
                <div className="garden-label" style={{ marginBottom: 4 }}>Landscape note</div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>{snapshot.season.description}</div>
              </div>
              <div style={{ position: "absolute", right: 16, bottom: 16, padding: "10px 12px", borderRadius: 16, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(10px)", boxShadow: "var(--shadow-sm)", textAlign: "right" }}>
                <div className="garden-label" style={{ marginBottom: 4 }}>Last planted</div>
                <div style={{ fontSize: 13, color: "var(--text-primary)", lineHeight: 1.6 }}>
                  {snapshot.latestSession
                    ? `${snapshot.latestSession.techniqueName} · ${snapshot.latestSessionLabel}`
                    : "Your first session will plant the first seed."}
                </div>
              </div>
            </div>

            {syncInfo.imported > 0 && (
              <p style={{ margin: "14px 0 0", fontSize: 12, color: "var(--text-muted)" }}>
                Synced {syncInfo.imported} earlier session{syncInfo.imported === 1 ? "" : "s"} into your Garden.
              </p>
            )}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div className="garden-card">
              <span className="garden-label">Today in your garden</span>
              {snapshot.latestSession ? (
                <>
                  <h2 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 30px)" }}>
                    {snapshot.latestSession.techniqueName}
                  </h2>
                  <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                    Your latest planted moment was {snapshot.latestSessionLabel}, with a {latestShiftTone.label.toLowerCase()} of {snapshot.latestSession.shift > 0 ? "+" : ""}{snapshot.latestSession.shift ?? 0}.
                  </p>
                  <div style={{ display: "grid", gap: 10 }}>
                    <div className="garden-card-sm" style={{ padding: 14 }}>
                      <span className="garden-label">Most visited bloom</span>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 999, background: snapshot.topEmotion?.color || "var(--sage)", border: `1px solid ${snapshot.topEmotion?.stem || "var(--sage-deep)"}` }} />
                        <div>
                          <div style={{ fontWeight: 700 }}>{snapshot.topEmotion?.name || "No bloom yet"}</div>
                          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{snapshot.topEmotion ? `${snapshot.topEmotion.bloom} · ${snapshot.topEmotion.count} sessions` : "Try a first session to start."}</div>
                        </div>
                      </div>
                    </div>
                    <div className="garden-card-sm" style={{ padding: 14 }}>
                      <span className="garden-label">Most used tool</span>
                      <div style={{ fontWeight: 700 }}>{snapshot.topTechnique?.name || "Not enough data yet"}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{snapshot.topTechnique ? `Used ${snapshot.topTechnique.count} time${snapshot.topTechnique.count === 1 ? "" : "s"}` : "Your repeat-help patterns will show up here."}</div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h2 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 30px)" }}>A blank plot, on purpose.</h2>
                  <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
                    The Garden only grows from moments you actually complete. The first tool you finish becomes the first visible seed.
                  </p>
                  <a href="/start" className="btn-primary" style={{ textDecoration: "none", width: "fit-content" }}>Start your first session →</a>
                </>
              )}
            </div>

            <div className="garden-card">
              <span className="garden-label">Milestones</span>
              <div style={{ display: "grid", gap: 10 }}>
                {snapshot.unlockedMilestones.slice(-3).map((milestone) => (
                  <div key={milestone.id} className="garden-card-sm" style={{ padding: 14, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>{milestone.label}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>Unlocked at {milestone.threshold} {milestone.unit}</div>
                    </div>
                    <span className="tag tag-free">Unlocked</span>
                  </div>
                ))}
                {snapshot.nextMilestone && (
                  <div className="garden-card-sm" style={{ padding: 14, borderStyle: "dashed" }}>
                    <div style={{ fontWeight: 700, marginBottom: 4 }}>Next: {snapshot.nextMilestone.label}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>
                      {Math.max(snapshot.nextMilestone.threshold - snapshot.totalSessions, 0)} more session{snapshot.nextMilestone.threshold - snapshot.totalSessions === 1 ? "" : "s"} to reach it.
                    </div>
                    <div className="progress" aria-label="Milestone progress">
                      <div className="progress-fill" style={{ width: `${Math.min((snapshot.totalSessions / snapshot.nextMilestone.threshold) * 100, 100)}%` }} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="garden-card">
              <span className="garden-label">Daily check-in</span>
              {moodLogged ? (
                <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🌱</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Mood logged.</div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>
                    Your Garden registered today’s state. Come back tomorrow to keep the rhythm going.
                  </p>
                </div>
              ) : (
                <>
                  <p style={{ margin: "0 0 12px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    Quick mood check-ins help the Garden track more than outcomes. They show what the week actually felt like.
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {MOOD_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSelectedMood(option.value)}
                        style={{
                          flex: "1 1 72px",
                          minWidth: 72,
                          padding: "10px 8px",
                          borderRadius: 16,
                          border: selectedMood === option.value ? "1.5px solid var(--sage)" : "1px solid var(--border)",
                          background: selectedMood === option.value ? "var(--sage-light)" : "var(--surface)",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ fontSize: 24 }}>{option.emoji}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>{option.label}</div>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={moodNote}
                    onChange={(event) => setMoodNote(event.target.value)}
                    placeholder="Optional: what did today feel like?"
                    style={{ width: "100%", marginBottom: 12, padding: "12px 14px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)" }}
                  />
                  <button onClick={logMood} disabled={selectedMood === null} className="btn-primary" style={{ width: "100%", opacity: selectedMood === null ? 0.55 : 1 }}>
                    Log today →
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div className="garden-metric-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
          <GardenStat label="Sessions planted" value={snapshot.totalSessions} detail={`${snapshot.weeklySessions} in the last 7 days`} />
          <GardenStat label="Emotions explored" value={snapshot.emotionsExplored} detail={snapshot.topEmotion ? `${snapshot.topEmotion.bloom} leads the season` : "Your first session unlocks this view"} tone="var(--ocean-deep)" />
          <GardenStat label="Mood check-ins" value={snapshot.totalMoodCheckins} detail={snapshot.moodAverage ? `${snapshot.moodAverage}/5 average mood check-in` : "Daily notes make the landscape richer"} tone="var(--amber-deep)" />
          <GardenStat label="Improving sessions" value={`${snapshot.improvingShare}%`} detail="Sessions with a positive mood shift" tone="var(--rose-deep)" />
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div className="garden-bottom-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, 0.92fr)", gap: 20 }}>
          <div className="garden-card" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(232,240,232,0.55))" }}>
            <span className="garden-label">Season story</span>
            <h2 style={{ margin: "0 0 10px" }}>{snapshot.seasonStory.title}</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 720 }}>
              {snapshot.seasonStory.body}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <span className="tag tag-act">{snapshot.season.label}</span>
              {snapshot.topEmotion && <span className="tag tag-cbt">{snapshot.topEmotion.bloom}</span>}
              {snapshot.topTechnique && <span className="tag tag-somatic">{snapshot.topTechnique.name}</span>}
              <span className="tag tag-free">{snapshot.averageShift > 0 ? `${snapshot.averageShift > 0 ? "+" : ""}${snapshot.averageShift} avg shift` : "Pattern forming"}</span>
            </div>
          </div>

          <div className="garden-card">
            <span className="garden-label">Recent path</span>
            {snapshot.recentTrail.length ? (
              <div style={{ display: "grid", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${snapshot.recentTrail.length}, minmax(0, 1fr))`, gap: 10, alignItems: "end" }}>
                  {snapshot.recentTrail.map((step, index) => (
                    <div key={step.id} style={{ display: "grid", gap: 8, justifyItems: "center" }}>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", minHeight: 30 }}>
                        {step.label}
                      </div>
                      <div style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        background: step.color,
                        border: `2px solid ${step.stem}`,
                        boxShadow: "0 0 0 8px rgba(255,255,255,0.55)",
                      }} />
                      {index < snapshot.recentTrail.length - 1 && (
                        <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, rgba(122,158,126,0.28), rgba(107,152,184,0.16))", marginTop: -9 }} />
                      )}
                      <div style={{ textAlign: "center" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.5 }}>{step.emotionLabel}</div>
                        <div style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.5 }}>{step.techniqueName}</div>
                        <div style={{ fontSize: 11, color: typeof step.shift === "number" && step.shift > 0 ? "var(--sage-deep)" : "var(--text-muted)" }}>
                          {typeof step.shift === "number" ? `${step.shift > 0 ? "+" : ""}${step.shift} shift` : "No shift logged"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                  A small trail of the last few sessions, so progress reads like a path instead of a pile of numbers.
                </p>
              </div>
            ) : (
              <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
                Finish a few sessions and the Garden will draw a visible trail of how you have been finding your way back.
              </p>
            )}
          </div>
        </div>
      </section>

      <section id="garden-biome" style={{ marginBottom: 28 }}>
        <div className="garden-bottom-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)", gap: 20 }}>
          <div className="garden-card">
            <span className="garden-label">Emotional biome</span>
            <h2 style={{ margin: "0 0 10px" }}>What keeps returning, and what keeps helping</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
              Each bloom tracks a feeling you have worked with. Repetition shows where life keeps pressing. Average shift shows where relief is actually showing up.
            </p>

            {snapshot.biome.length ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                {snapshot.biome.map((entry) => (
                  <article key={entry.id} className="garden-card-sm" style={{ display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 14, height: 14, borderRadius: 999, background: entry.color, border: `1px solid ${entry.stem}` }} />
                          <span className="garden-label" style={{ marginBottom: 0 }}>{entry.plantName}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: 20 }}>{entry.label}</h3>
                      </div>
                      <span className="tag tag-cbt">{entry.sessions} session{entry.sessions === 1 ? "" : "s"}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>{entry.note}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13 }}>
                      <span style={{ color: "var(--text-secondary)" }}>Avg shift <strong style={{ color: entry.averageShift >= 0 ? "var(--sage-deep)" : "var(--warning)" }}>{entry.averageShift > 0 ? "+" : ""}{entry.averageShift}</strong></span>
                      <span style={{ color: "var(--text-muted)" }}>Last seen {entry.lastSeen}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="garden-card-sm" style={{ textAlign: "center" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🌱</div>
                <p style={{ margin: "0 0 12px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                  This section lights up after your first completed intervention.
                </p>
                <a href="/start" className="btn-primary" style={{ textDecoration: "none" }}>Start now →</a>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gap: 16 }}>
            <div className="garden-card">
              <span className="garden-label">Growth notes</span>
              <div style={{ display: "grid", gap: 12 }}>
                <div className="garden-card-sm" style={{ padding: 14 }}>
                  <div className="garden-label" style={{ marginBottom: 4 }}>Momentum</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{snapshot.weeklySessions} session{snapshot.weeklySessions === 1 ? "" : "s"} this week</div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {snapshot.weeklySessions > 0
                      ? "Recent activity gives the Garden enough signal to spot patterns quickly."
                      : "A couple of sessions this week will make the first pattern visible."}
                  </p>
                </div>

                <div className="garden-card-sm" style={{ padding: 14 }}>
                  <div className="garden-label" style={{ marginBottom: 4 }}>Blueprint</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{snapshot.latestBlueprint?.archetype || "No blueprint saved yet"}</div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {snapshot.latestBlueprint
                      ? "Your latest blueprint is stored here as part of the same local progress story."
                      : "When you complete the blueprint, it will join the rest of your Garden history."}
                  </p>
                </div>

                <div className="garden-card-sm" style={{ padding: 14 }}>
                  <div className="garden-label" style={{ marginBottom: 4 }}>Privacy</div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>All local. No server profile.</div>
                  <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    Your sessions, notes, and mood check-ins stay on this device unless you explicitly export them.
                  </p>
                </div>
              </div>
            </div>

            <WeeklyInsightsClient isPremium={isPremium} />
          </div>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <div className="garden-action-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14 }}>
          <button onClick={() => isPremium ? handleExportPDF() : (window.location.href = "/companion")} className="garden-card-sm" style={{ cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <span className="garden-label">Export</span>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Print a progress summary</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              {isPremium ? "Create a clean PDF snapshot for yourself or a therapist." : "Premium unlocks printable summaries from your private Garden."}
            </p>
          </button>

          <button onClick={handleExportJSON} className="garden-card-sm" style={{ cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <span className="garden-label">Archive</span>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Export your raw data</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Download sessions, mood check-ins, streaks, and insights as JSON.
            </p>
          </button>

          <button onClick={handleShare} className="garden-card-sm" style={{ cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans', sans-serif" }}>
            <span className="garden-label">Share</span>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Share your milestone</div>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65 }}>
              Share the existence of your progress without exposing private details.
            </p>
          </button>
        </div>
      </section>

      {!isPremium && (
        <section style={{ marginBottom: 28 }}>
          <div className="garden-card" style={{ background: "linear-gradient(135deg, var(--amber-light), color-mix(in srgb, var(--surface-elevated) 86%, white))", borderColor: "rgba(212, 168, 67, 0.18)" }}>
            <span className="garden-label">Garden upgrades</span>
            <h2 style={{ margin: "0 0 10px" }}>Make the Garden deeper, not louder</h2>
            <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 760 }}>
              Premium keeps the free core intact and adds richer reflection surfaces: full bloom visuals, weekly insights, printable summaries, and deeper guided sessions through Talk to Forj.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="/companion" className="btn-primary" style={{ textDecoration: "none", background: "var(--amber-deep)" }}>Explore Premium →</a>
              <a href="/start" className="btn-secondary" style={{ textDecoration: "none", color: "var(--amber-deep)", borderColor: "var(--amber)" }}>Keep using free tools →</a>
            </div>
          </div>
        </section>
      )}

      <section style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <button
          onClick={() => setShowDeleteModal(true)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(196, 91, 91, 0.2)",
            background: "rgba(196, 91, 91, 0.05)",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--error)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Delete all Garden data
        </button>
        <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 8, lineHeight: 1.6 }}>
          All Garden data is stored locally on your device. Deleting it cannot be undone.
        </p>
      </section>

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.42)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            style={{
              background: "var(--surface-elevated)",
              borderRadius: "var(--radius-xl)",
              padding: 32,
              maxWidth: 420,
              width: "100%",
              boxShadow: "var(--shadow-lg)",
            }}
          >
            <h3 style={{ margin: "0 0 12px" }}>Delete everything?</h3>
            <p style={{ margin: "0 0 20px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              This will erase your Garden, sessions, mood check-ins, blueprint history, and weekly insights from this device.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={handleDeleteAll} className="btn-primary" style={{ flex: 1, background: "var(--error)" }}>Delete all</button>
            </div>
          </div>
        </div>
      )}

      <footer style={{ textAlign: "center", padding: "28px 0 0", marginTop: 20 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.7 }}>
          AIForj — Built and clinically informed by Kevin, a licensed clinician and psychiatric nurse practitioner candidate
          <br />
          Your data never leaves your device. Privacy is not a feature. It is the foundation.
        </p>
      </footer>
    </div>
  );
}
