import { getDailyCalmDrop } from "../../lib/dailyPlan";

export default function DailyCalmDrop() {
  return (
    <section className="today-card today-drop">
      <p className="text-label" style={{ color: "var(--sage-deep)", margin: "0 0 10px" }}>Daily Calm Drop</p>
      <h2 style={{ margin: "0 0 12px" }}>One small reset for today</h2>
      <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8, fontSize: 17 }}>
        {getDailyCalmDrop(new Date())}
      </p>
    </section>
  );
}
