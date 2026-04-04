"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { getMoodCheckins, getSessions, getBlueprints, getStreak } from '../lib/db';

function lastNDays(items, n = 7) {
  const cutoff = Date.now() - n * 24 * 60 * 60 * 1000;
  return items.filter((i) => i.timestamp >= cutoff).sort((a,b) => b.timestamp - a.timestamp);
}

function decideMetaphor({ moods, sessions }) {
  const moodVals = moods.map(m => m.moodScore);
  const avg = moodVals.length ? (moodVals.reduce((a,b)=>a+b,0)/moodVals.length) : null;
  const moodCount = moodVals.length;
  const sessionCount = sessions.length;

  if (!moodCount && !sessionCount) return { text: "Fresh dawn — your forecast is unwritten", key: 'fresh', icon: 'dawn' };
  if (avg !== null && avg >= 4 && sessionCount >= 3) return { text: "Clear skies with gentle warmth", key: 'clear', icon: 'sun' };
  if (avg !== null && avg >= 3 && avg < 4 && sessionCount >=1) return { text: "Partly cloudy with breaks of sun", key: 'partly', icon: 'partly' };
  if (avg !== null && avg < 3 && sessionCount < 3) return { text: "Overcast with a chance of breakthrough", key: 'overcast', icon: 'overcast' };
  if (avg !== null && avg < 3 && sessionCount >= 3) return { text: "Storm passing — you showed up through it", key: 'storm', icon: 'storm' };
  // trend detection (improving)
  if (moodVals.length >= 3) {
    const recent = moodVals.slice(0,3);
    if (recent[0] > recent[recent.length-1]) return { text: "Morning fog lifting", key: 'lifting', icon: 'fog' };
  }
  return { text: "Partly cloudy with breaks of sun", key: 'partly', icon: 'partly' };
}

function archetypeLine(archetype) {
  if (!archetype) return "Remember: small steps add up.";
  const map = {
    Sentinels: "Remember: not every alarm needs a response.",
    Empaths: "Your boundaries are acts of love, not selfishness.",
    Adventurers: "Curiosity helps you find new routes forward.",
    Scholars: "You learn by observing — be gentle with mistakes.",
  };
  return map[archetype] || "You're doing more than you think."
}

function SvgIcon({ name, size = 96 }) {
  // simple SVGs for metaphor icons
  if (name === 'sun') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="10" fill="url(#g)"/><defs><radialGradient id="g"><stop offset="0%" stopColor="#FFF3E8"/><stop offset="100%" stopColor="#F6B87E"/></radialGradient></defs></svg>
  );
  if (name === 'partly') return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="26" cy="28" rx="12" ry="8" fill="#FFF3E8"/><circle cx="16" cy="16" r="7" fill="#F6B87E"/></svg>
  );
  if (name === 'overcast') return (
    <svg width={size} height={size} viewBox="0 0 48 48"><ellipse cx="24" cy="28" rx="14" ry="9" fill="#BFC4C9"/></svg>
  );
  if (name === 'storm') return (
    <svg width={size} height={size} viewBox="0 0 48 48"><ellipse cx="24" cy="26" rx="14" ry="9" fill="#6E7A86"/><path d="M20 30 L26 30 L22 36 L28 36 L22 44" stroke="#FFD484" strokeWidth="2" fill="none"/></svg>
  );
  if (name === 'dawn') return (
    <svg width={size} height={size} viewBox="0 0 48 48"><rect width="48" height="24" y="18" fill="#FFDDBA"/></svg>
  );
  return null;
}

export default function WeatherClient() {
  const [loaded, setLoaded] = useState(false);
  const [moodCheckins, setMoodCheckins] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [blueprints, setBlueprints] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0 });
  const [format, setFormat] = useState('square');
  const cardRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const [mc, ss, bp, st] = await Promise.all([getMoodCheckins(), getSessions(), getBlueprints(), getStreak()]);
        setMoodCheckins(lastNDays(mc, 7));
        setSessions(lastNDays(ss, 7));
        setBlueprints(bp.sort((a,b)=>b.timestamp-a.timestamp));
        setStreak(st || { currentStreak: 0 });
      } catch (e) {
        console.warn('Weather load error', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const latestMood = moodCheckins[0]?.moodScore ?? null;
  const temperature = latestMood ? ({1:32,2:48,3:64,4:76,5:88})[latestMood] : '--';
  const metaphor = useMemo(() => decideMetaphor({ moods: moodCheckins, sessions }), [moodCheckins, sessions]);
  const archetype = blueprints[0]?.archetype ?? null;
  const forecastLine = archetypeLine(archetype);

  async function shareCard() {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const scale = format === 'wide' ? 1.5 : format === 'story' ? 2 : 1;
    const canvas = await html2canvas(el, { backgroundColor: null, scale: scale });
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `forj-weather-${Date.now()}.png`;
    a.click();
  }

  async function promptMoodCheckin(score) {
    await import('../lib/db').then(async (m) => {
      await m.saveMoodCheckin({ moodScore: score });
      const mc = await m.getMoodCheckins();
      setMoodCheckins(lastNDays(mc,7));
    });
  }

  if (!loaded) return <div>Loading your Emotional Weather…</div>;

  if (moodCheckins.length === 0 && sessions.length === 0 && blueprints.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <h2 className="font-display">Your forecast starts with your first check-in.</h2>
        <p style={{ marginTop: 8 }}>Quick mood check-in — how are you feeling right now?</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 12 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} className="btn-secondary" onClick={() => promptMoodCheckin(n)}>{n}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginBottom: 18 }}>
        <h1 className="text-hero">Your Emotional Weather</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: 13 }}>Format</label>
          <select value={format} onChange={(e)=>setFormat(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
            <option value="story">Story (9:16)</option>
            <option value="square">Square (1:1)</option>
            <option value="wide">Wide (16:9)</option>
          </select>
          <button className="btn-primary" onClick={shareCard}>Share Your Weather</button>
        </div>
      </div>

      <div ref={cardRef} style={{ width: format==='wide'? '100%': format==='square'? 640: 360, margin: '0 auto', background: 'linear-gradient(180deg, var(--accent-warm-light), transparent)', padding: 28, borderRadius: 16, color: 'var(--text-primary)', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ flex: '0 0 auto' }}><SvgIcon name={metaphor.icon} size={96} /></div>
          <div>
            <div style={{ fontFamily: 'Fraunces', fontSize: 22, fontWeight:700 }}>{metaphor.text}</div>
            <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>Today's emotional temperature: <strong>{temperature}°</strong></div>
            <div style={{ marginTop: 6, color: 'var(--text-secondary)' }}>🌱 {streak.currentStreak || 0}-day growth streak</div>
          </div>
        </div>

        <div style={{ marginTop: 18, padding: 12, background: 'rgba(255,255,255,0.04)', borderRadius: 12 }}>
          <div style={{ fontWeight: 600 }}>{forecastLine}</div>
          <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>Powered by Forj — Your Private Mental Health Co-Pilot</div>
          <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted)' }}>aiforj.com/blueprint</div>
        </div>
      </div>
    </div>
  );
}
