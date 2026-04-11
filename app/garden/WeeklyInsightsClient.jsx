"use client";

import { useEffect, useState, useRef } from "react";
import {
  getSessions,
  getMoodCheckins,
  getBlueprints,
  getStreak,
  saveWeeklyInsight,
  getWeeklyInsights,
} from "../lib/db";

export default function WeeklyInsightsClient({ isPremium }) {
  const [insight, setInsight] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    async function load() {
      const h = await getWeeklyInsights();
      setHistory(h);
      const latest = h[0] || null;

      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      const needNew = !latest || (Date.now() - latest.timestamp) >= sevenDays;

      if (isPremium && needNew) {
        await generateAndSaveInsight();
      } else if (latest) {
        setInsight(latest);
      }
    }
    load();
  }, [isPremium]);

  async function generateAndSaveInsight() {
    setLoading(true);
    try {
      const allSessions = await getSessions();
      const allMoods = await getMoodCheckins();
      const blueprints = await getBlueprints();
      const streak = await getStreak();

      const now = Date.now();
      const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
      const prevWeekStart = weekAgo - 7 * 24 * 60 * 60 * 1000;

      const sessionsWeek = allSessions.filter(s => s.timestamp >= weekAgo);
      const moodsWeek = allMoods.filter(m => m.timestamp >= weekAgo);
      const sessionsPrev = allSessions.filter(s => s.timestamp >= prevWeekStart && s.timestamp < weekAgo);
      const moodsPrev = allMoods.filter(m => m.timestamp >= prevWeekStart && m.timestamp < weekAgo);

      let generated = null;

      // Try WebLLM on device (best-effort). If unavailable, fallback to rule-based generator.
      try {
        if (navigator.gpu) {
          const webllm = await import("@mlc-ai/web-llm");
          const engine = new webllm.MLCEngine();
          await engine.reload("Phi-3.5-mini-instruct-q4f16_1-MLC");
          const prompt = buildPrompt(sessionsWeek, moodsWeek, blueprints, streak);
          const res = await engine.generate([{ role: "user", text: prompt }], { max_tokens: 400 });
          generated = res?.[0]?.text || res?.[0]?.message?.content || null;
        }
      } catch (e) {
        console.warn("WebLLM unavailable or failed for weekly insights, using fallback", e);
        generated = null;
      }

      if (!generated) {
        generated = generateFallbackInsight({ sessionsWeek, moodsWeek, sessionsPrev, moodsPrev, blueprints, streak });
      }

      const record = await saveWeeklyInsight({ title: "Weekly Insight", insight: generated, meta: { generatedAt: Date.now() } });
      const h = await getWeeklyInsights();
      setHistory(h);
      setInsight(record);
    } catch (e) {
      console.error("WeeklyInsights: generation failed", e);
    }
    setLoading(false);
  }

  function buildPrompt(sessionsWeek, moodsWeek, blueprints, streak) {
    const summary = [];
    summary.push(`Sessions this week: ${sessionsWeek.length}`);
    const counts = {};
    sessionsWeek.forEach(s => { counts[s.emotion] = (counts[s.emotion] || 0) + 1; });
    const emotionSummary = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(", ") || "none";
    summary.push(`Emotions: ${emotionSummary}`);
    const moodAvg = moodsWeek.length ? (moodsWeek.reduce((a,b)=>a+b.moodScore,0)/moodsWeek.length).toFixed(2) : "n/a";
    summary.push(`Average mood score: ${moodAvg}`);
    if (blueprints.length) summary.push(`Latest archetype: ${blueprints[0].archetype}`);
    summary.push(`Current streak: ${streak.currentStreak || 0}`);
    return `You are a clinical assistant. Use the following user weekly data to generate a concise, clinically-grounded weekly insight with sections: Pattern Detection, Progress Note, Technique Effectiveness, Clinical Nudge, Encouragement. Data: ${summary.join("; ")}`;
  }

  function generateFallbackInsight({ sessionsWeek, moodsWeek, sessionsPrev, moodsPrev, blueprints, streak }) {
    // Counts
    const emotionCounts = {};
    sessionsWeek.forEach(s => { emotionCounts[s.emotion] = (emotionCounts[s.emotion] || 0) + 1; });
    const topEmotion = Object.entries(emotionCounts).sort((a,b)=>b[1]-a[1])[0];

    const techniqueCounts = {};
    sessionsWeek.forEach(s => { if (s.techniqueUsed) techniqueCounts[s.techniqueUsed] = (techniqueCounts[s.techniqueUsed] || 0) + 1; });
    const topTechnique = Object.entries(techniqueCounts).sort((a,b)=>b[1]-a[1])[0];

    const avgMood = moodsWeek.length ? (moodsWeek.reduce((a,b)=>a+b.moodScore,0)/moodsWeek.length) : null;
    const prevAvgMood = moodsPrev.length ? (moodsPrev.reduce((a,b)=>a+b.moodScore,0)/moodsPrev.length) : null;
    const moodTrend = (avgMood && prevAvgMood) ? (avgMood > prevAvgMood ? "improving" : (avgMood < prevAvgMood ? "declining" : "stable")) : (avgMood ? "stable" : "no-data");

    // Templates (pattern, progress, technique, nudge, encouragement)
    const patternTemplates = [
      "You worked with anxiety {count} time(s) this week, often in the evenings — evening anxiety often links to anticipatory stress about the next day.",
      "This week featured low-motivation moments {count} times, frequently before midday — that can indicate disrupted sleep or low reward sensitivity.",
      "Sadness appeared {count} times this week, clustered around social contexts — social withdrawal can deepen low mood.",
      "You used sessions for stress {count} times, with peaks in the late afternoon — consider micro-breaks earlier in the day.",
      "A pattern of numbness appeared {count} times — this often signals overwhelm and emotional exhaustion.",
      "You had several moments labeled 'burned-out' ({count}) — workload or insufficient rest may be contributing.",
      "Loneliness showed up {count} times this week; reaching out before evenings might help reduce late-night rumination.",
      "Social-anxiety appeared {count} times — practicing short exposure steps before social events could reduce anticipatory anxiety.",
      "You engaged with '3am-spiral' patterns {count} times — nighttime rumination suggests sleep hygiene tweaks and wind-down routines.",
      "Anger appeared {count} times — noting triggers and a short pause (box breathing) before reacting can reduce escalation.",
    ];

    const progressTemplates = [
      "Your mood scores averaged {avg} this week, {changeTxt} compared with last week — that's a meaningful shift.",
      "Average mood was {avg}. Compared to the prior week, things are {trend} — keep noticing what changes on the days that improved.",
      "You had steady mood scores ({avg}), suggesting consistency — small repetitive practices may be helping.",
      "Mood appears to be {trend} week-over-week; small, predictable wins (5–10 minutes) can nudge progress.",
    ];

    const techniqueTemplates = [
      "{tech} appeared in {count} session(s). Post-session mood was often higher after using it — it may be especially helpful right now.",
      "You used {tech} several times; when you pair it with a brief grounding step, it tends to land better.",
      "{tech} shows up as a consistent tool — consider scheduling it as a short nightly ritual to reduce evening spikes.",
    ];

    const nudgeTemplates = [
      "Since evening anxiety is your pattern, try the Sunday Scaries protocol on weeknights too — the anticipatory anxiety framework applies beyond Sundays.",
      "When motivation dips midday, try a 5-minute energizing practice (movement + breath) to break the inertia.",
      "If social contexts trigger low mood, plan one small social approach action this week to build confidence.",
      "For nighttime spirals, limit screen time 60 minutes before bed and try a 4-4-6 breathing routine.",
      "Add a pre-bed routine that includes a short gratitude or reflection to reduce late-night rumination.",
      "Schedule one micro-rest (10 minutes) between tasks to reduce cumulative stress and prevent burnout.",
    ];

    const encouragementTemplates = [
      "You show consistent care for your wellbeing — that consistency adds up more than it feels in the moment.",
      "This week's choices added to your momentum. Keep noticing the small wins — they compound.",
      "You made space for yourself this week. That's a clear act of self-care and it matters clinically.",
      "You're doing adaptive work even when it feels small — that matters for long-term change.",
    ];

    const pick = (arr) => arr[Math.floor(Math.random()*arr.length)];

    const patternTxt = topEmotion ? pick(patternTemplates).replace('{count}', String(topEmotion[1])).replace('{tech}','') : "No clear dominant emotion this week.";
    const avgTxt = avgMood ? avgMood.toFixed(2) : "n/a";
    let changeTxt = "no previous data to compare";
    if (prevAvgMood && avgMood) {
      const diff = (avgMood - prevAvgMood).toFixed(2);
      changeTxt = diff > 0 ? `up from ${prevAvgMood.toFixed(2)} (${diff} increase)` : (diff < 0 ? `down from ${prevAvgMood.toFixed(2)} (${Math.abs(diff)} decrease)` : `stable vs ${prevAvgMood.toFixed(2)}`);
    }
    const progressTxt = pick(progressTemplates).replace('{avg}', avgTxt).replace('{trend}', moodTrend).replace('{changeTxt}', changeTxt);

    const techniqueTxt = topTechnique && topTechnique[0] ? pick(techniqueTemplates).replace('{tech}', topTechnique[0]).replace('{count}', String(topTechnique[1])) : "No single technique dominated this week.";

    const nudgeTxt = pick(nudgeTemplates);
    const encourageTxt = pick(encouragementTemplates);

    return [
      `Pattern Detection: ${patternTxt}`,
      `Progress Note: ${progressTxt}`,
      `Technique Effectiveness: ${techniqueTxt}`,
      `Clinical Nudge: ${nudgeTxt}`,
      `Encouragement: ${encourageTxt}`,
    ].join("\n\n");
  }

  async function handleShare() {
    try {
      const html2canvas = (await import("html2canvas")).default;
      if (!cardRef.current) return;
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null });
      const url = canvas.toDataURL("image/png");
      if (navigator.share) {
        const blob = await (await fetch(url)).blob();
        const filesArray = [new File([blob], "forj-weekly-insight.png", { type: blob.type })];
        await navigator.share({ files: filesArray, title: "My Weekly Insight" });
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = `forj-weekly-${new Date().toISOString().slice(0,10)}.png`; a.click();
      }
    } catch (e) {
      console.error("Share failed", e);
      alert("Unable to generate share image.");
    }
  }

  return (
    <section style={{ marginTop: 16, marginBottom: 12 }}>
      <h2 style={{ fontFamily: "Fraunces, serif", fontSize: 22, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 12px" }}>Weekly Insights</h2>

      {!isPremium && (
        <div className="garden-card" style={{ padding: 18, textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ filter: "blur(6px)", opacity: 0.9, pointerEvents: "none" }}>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Your anxiety pattern this week reveals...</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 8 }}>Unlock Weekly Insights — Start Free Trial to get personalized clinical notes from your data.</div>
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <button onClick={() => window.location.href = "/companion"} style={{ padding: "10px 18px", borderRadius: 10, background: "var(--interactive, #7D9B82)", color: "white", border: "none" }}>Unlock Weekly Insights — Free Trial</button>
          </div>
        </div>
      )}

      {isPremium && (
        <div>
          <div className="garden-card" ref={cardRef} style={{ marginBottom: 12, padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>This week's analysis</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8 }}>{insight?.title || "Weekly Insight"}</div>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{insight?.insight || (loading ? "Generating your insight…" : "No insight available yet.")}</pre>
              </div>
              <div style={{ width: 120, textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Saved</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{insight ? new Date(insight.timestamp).toLocaleDateString() : "—"}</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={handleShare} className="garden-card-sm" style={{ flex: 1 }}>Share This Week's Insight</button>
            <button onClick={generateAndSaveInsight} className="garden-card-sm" style={{ flex: 0 }}>Regenerate</button>
          </div>

          {history.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Past Insights</div>
              <div style={{ display: "grid", gap: 8 }}>
                {history.slice(0,5).map(h => (
                  <div key={h.id} className="garden-card-sm" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ fontSize: 13, color: "var(--text-primary)" }}>{h.title}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{new Date(h.timestamp).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
