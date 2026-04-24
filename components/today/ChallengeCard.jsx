"use client";

import { useMemo, useState } from "react";
import { getChallengeDay } from "../../lib/challenges";
import { loadDailyProgress, recordChallengeDay } from "../../lib/localProgress";
import { trackSafeMetric } from "../../lib/metrics";
import ShareSheet from "../share/ShareSheet";

export default function ChallengeCard({ challenge }) {
  const [progress, setProgress] = useState(() => loadDailyProgress());
  const [completedDay, setCompletedDay] = useState(null);
  const completedCount = progress.challenges?.[challenge.slug]?.completedDates?.length || 0;
  const day = useMemo(() => getChallengeDay(challenge.slug, completedCount), [challenge.slug, completedCount]);

  const completeDay = () => {
    const result = recordChallengeDay(challenge.slug);
    setProgress(result.progress);
    setCompletedDay(result.dayNumber);
    trackSafeMetric({
      event: "challenge_day_completed",
      toolSlug: challenge.slug,
      durationBucket: "under_30s",
      acquisitionSource: "internal",
    });
  };

  return (
    <article className="today-card" style={{ display: "grid", gap: 14, borderColor: `${challenge.color}3D` }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <p className="text-label" style={{ color: challenge.color, margin: "0 0 8px" }}>Day {day.dayNumber} of 7</p>
          <h3 style={{ margin: 0 }}>{challenge.title}</h3>
        </div>
        <span className="tag tag-free">Day 1 free</span>
      </div>
      <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>{day.prompt}</p>
      <div className="progress" aria-label={`${challenge.title} progress`}>
        <div className="progress-fill" style={{ width: `${Math.min((completedCount / 7) * 100, 100)}%`, background: challenge.color }} />
      </div>
      <button type="button" onClick={completeDay} disabled={completedCount >= 7} className="btn-secondary" style={{ color: challenge.color, borderColor: `${challenge.color}66` }}>
        {completedCount >= 7 ? "Challenge complete" : "Mark today complete"}
      </button>
      {completedDay && [1, 3, 7].includes(completedDay) && (
        <ShareSheet
          compact
          title="Share the milestone?"
          payload={{ type: "challenge", milestone: `Day_${completedDay}`, ref: "shared_card" }}
        />
      )}
      <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
        Deeper versions, full history, exports, and custom routines are Premium. The basic reset stays usable here.
      </p>
    </article>
  );
}
