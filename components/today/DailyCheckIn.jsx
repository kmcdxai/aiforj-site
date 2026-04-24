"use client";

import { useMemo, useState } from "react";
import { saveSession } from "../../app/lib/db";
import { CHALLENGES } from "../../lib/challenges";
import { DAILY_FEELINGS, DAILY_NEEDS, DAILY_TIME_OPTIONS, buildDailyPlan } from "../../lib/dailyPlan";
import { loadDailyProgress, recordDailyCompletion } from "../../lib/localProgress";
import { trackSafeMetric } from "../../lib/metrics";
import ChallengeCard from "./ChallengeCard";
import ShareSheet from "../share/ShareSheet";

function OptionButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 14px",
        borderRadius: 16,
        border: active ? "1.5px solid var(--sage)" : "1px solid var(--border)",
        background: active ? "var(--sage-light)" : "var(--surface-elevated)",
        color: "var(--text-primary)",
        cursor: "pointer",
        fontWeight: active ? 700 : 600,
        textAlign: "left",
      }}
    >
      {children}
    </button>
  );
}

function EmailAfterCompletion() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");

  const submit = async (event) => {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("invalid");
      return;
    }
    setState("saving");
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email_address: email, source: "daily_reset" }),
    }).catch(() => null);

    if (response?.ok) {
      trackSafeMetric({ event: "newsletter_signup", routeGroup: "today", acquisitionSource: "internal" });
      setState("saved");
    } else {
      setState("error");
    }
  };

  if (state === "saved") {
    return (
      <div className="today-card" style={{ textAlign: "center" }}>
        <h3 style={{ margin: "0 0 8px" }}>Tomorrow is queued.</h3>
        <p style={{ margin: 0, color: "var(--text-secondary)" }}>Email is stored separately from your emotional choices.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="today-card" style={{ display: "grid", gap: 12 }}>
      <div>
        <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 8px" }}>Optional</p>
        <h3 style={{ margin: "0 0 8px" }}>Get tomorrow's 60-second reset</h3>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          No account required. Email is not connected to your check-in answers.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setState("idle");
          }}
          placeholder="you@example.com"
          aria-label="Email address"
          style={{ flex: "1 1 230px", padding: "14px 16px", borderRadius: 14, border: "1px solid var(--border)", background: "var(--surface)" }}
        />
        <button type="submit" className="btn-primary" disabled={state === "saving"}>
          {state === "saving" ? "Saving..." : "Send it"}
        </button>
      </div>
      {["invalid", "error"].includes(state) && (
        <p style={{ margin: 0, color: "var(--error)", fontSize: 13 }}>
          {state === "invalid" ? "Enter a valid email address." : "Email signup is unavailable right now."}
        </p>
      )}
    </form>
  );
}

export default function DailyCheckIn() {
  const [feeling, setFeeling] = useState("anxious");
  const [time, setTime] = useState("2m");
  const [need, setNeed] = useState("calm_down");
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(() => loadDailyProgress());
  const [reminderState, setReminderState] = useState("idle");
  const plan = useMemo(() => buildDailyPlan({ feeling, time, need }), [feeling, time, need]);
  const comebackText = progress.comebackCount > 0 && progress.currentStreak === 1
    ? "You came back. That counts."
    : `${progress.currentStreak || 0} day comeback streak`;

  const startTracking = () => {
    trackSafeMetric({ event: "daily_checkin_started", emotionCategory: feeling, acquisitionSource: "internal" });
  };

  const completeReset = async () => {
    const nextProgress = recordDailyCompletion({
      feeling,
      need,
      toolSlug: plan.primary.slug,
    });
    setProgress(nextProgress);
    setCompleted(true);

    await saveSession({
      emotion: feeling,
      pathway: time,
      duration: plan.seconds,
      completedSteps: 1,
      techniqueUsed: plan.primary.title,
      intervention: plan.primary.slug,
      interventionName: plan.primary.title,
      source: "today",
    }).catch(() => {});

    trackSafeMetric({
      event: "daily_checkin_completed",
      toolSlug: plan.primary.slug,
      emotionCategory: feeling,
      durationBucket: plan.durationBucket,
      acquisitionSource: "internal",
    });
  };

  const requestReminder = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setReminderState("unsupported");
      return;
    }
    const permission = await Notification.requestPermission();
    setReminderState(permission === "granted" ? "enabled" : "declined");
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <section className="today-card" style={{ display: "grid", gap: 22 }}>
        <div>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>Today's Reset</p>
          <h1 style={{ margin: "0 0 12px", fontSize: "clamp(38px, 7vw, 68px)" }}>What kind of day is this?</h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 18 }}>
            Choose what fits well enough. AIForj will give you one reset and one backup, then let you leave.
          </p>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <p className="text-label" style={{ color: "var(--text-muted)", margin: 0 }}>Feeling</p>
          <div className="today-option-grid">
            {DAILY_FEELINGS.map((option) => (
              <OptionButton key={option.id} active={feeling === option.id} onClick={() => { setFeeling(option.id); startTracking(); }}>
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <p className="text-label" style={{ color: "var(--text-muted)", margin: 0 }}>Time</p>
          <div className="today-time-grid">
            {DAILY_TIME_OPTIONS.map((option) => (
              <OptionButton key={option.id} active={time === option.id} onClick={() => setTime(option.id)}>
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          <p className="text-label" style={{ color: "var(--text-muted)", margin: 0 }}>Need</p>
          <div className="today-option-grid">
            {DAILY_NEEDS.map((option) => (
              <OptionButton key={option.id} active={need === option.id} onClick={() => setNeed(option.id)}>
                {option.label}
              </OptionButton>
            ))}
          </div>
        </div>
      </section>

      <section className="today-plan-grid">
        <article className="today-card today-primary">
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>Best fit</p>
          <h2 style={{ margin: "0 0 12px" }}>{plan.primary.title}</h2>
          <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.75 }}>{plan.primary.body}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <a href={plan.primary.href} className="btn-primary" style={{ textDecoration: "none" }}>Open full guide</a>
            <button type="button" onClick={completeReset} className="btn-secondary" style={{ color: "var(--sage-deep)" }}>
              I did the reset
            </button>
          </div>
        </article>
        <article className="today-card">
          <p className="text-label" style={{ color: "var(--text-muted)", margin: "0 0 10px" }}>Backup</p>
          <h2 style={{ margin: "0 0 12px" }}>{plan.backup.title}</h2>
          <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.75 }}>{plan.backup.body}</p>
          <a href={plan.backup.href} className="btn-secondary" style={{ textDecoration: "none", color: "var(--sage-deep)", width: "fit-content" }}>Keep nearby</a>
        </article>
      </section>

      {completed && (
        <section style={{ display: "grid", gap: 18 }}>
          <div className="today-card" style={{ background: "linear-gradient(135deg, var(--sage-light), var(--surface-elevated))" }}>
            <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 8px" }}>Bloom planted</p>
            <h2 style={{ margin: "0 0 10px" }}>{comebackText}</h2>
            <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.75 }}>
              This completion was saved locally and added to your Mood Garden. Missing a day is not failure; returning is the practice.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              <a href="/garden" className="btn-primary" style={{ textDecoration: "none" }}>Open Garden</a>
              <button type="button" onClick={requestReminder} className="btn-secondary" style={{ color: "var(--sage-deep)" }}>Remind me gently</button>
            </div>
            {reminderState !== "idle" && (
              <p style={{ margin: "12px 0 0", fontSize: 13, color: "var(--text-muted)" }}>
                {reminderState === "enabled" ? "Browser reminders are allowed. AIForj will only use calm language." : reminderState === "unsupported" ? "This browser does not support local notification permission." : "No problem. You can still come back anytime."}
              </p>
            )}
          </div>
          <ShareSheet compact title="Share the reset, not the details" payload={{ type: "garden", ref: "shared_card" }} />
          <EmailAfterCompletion />
        </section>
      )}

      <section style={{ display: "grid", gap: 16 }}>
        <div>
          <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 8px" }}>7-day resets</p>
          <h2 style={{ margin: 0 }}>Bounded challenges, no punishment for missing days</h2>
        </div>
        <div className="today-challenge-grid">
          {CHALLENGES.map((challenge) => <ChallengeCard key={challenge.slug} challenge={challenge} />)}
        </div>
      </section>
    </div>
  );
}
