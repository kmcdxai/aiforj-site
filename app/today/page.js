import DailyCalmDrop from "../../components/today/DailyCalmDrop";
import DailyCheckIn from "../../components/today/DailyCheckIn";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Today's Reset | AIForj",
  description: "A fast, private daily emotional first-aid ritual with one best-fit reset, one backup, and local-only progress.",
  path: "/today",
  socialTitle: "Today's Reset from AIForj",
  socialDescription: "One useful emotional first-aid reset for the kind of day you are having.",
  type: "website",
});

export default function TodayPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "92px 20px 88px", background: "linear-gradient(180deg, var(--parchment), var(--surface))" }}>
      <style>{`
        .today-shell { max-width: 1120px; margin: 0 auto; display: grid; gap: 24px; }
        .today-card { background: rgba(255,255,255,0.76); border: 1px solid var(--border); border-radius: 24px; padding: clamp(20px, 4vw, 32px); box-shadow: var(--shadow-sm); }
        .today-drop { background: linear-gradient(135deg, rgba(122,158,126,0.14), rgba(107,152,184,0.1), rgba(255,255,255,0.78)); }
        .today-option-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(178px, 1fr)); gap: 10px; }
        .today-time-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; }
        .today-plan-grid { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(280px, 0.88fr); gap: 18px; }
        .today-primary { background: linear-gradient(135deg, var(--surface-elevated), var(--sage-light)); border-color: rgba(122,158,126,0.22); }
        .today-challenge-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; }
        @media (max-width: 820px) {
          .today-plan-grid { grid-template-columns: 1fr; }
        }
      `}</style>
      <div className="today-shell">
        <DailyCalmDrop />
        <DailyCheckIn />
        <section className="today-card" style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.7 }}>
            AIForj is a wellness companion, not a substitute for professional care. If you may hurt yourself or someone else, call or text 988 in the U.S., text HOME to 741741, contact emergency services, or reach out to a trusted person now.
          </p>
        </section>
      </div>
    </main>
  );
}
