"use client";

import { track } from "../lib/analytics";
import { workbookLink } from "../lib/links";

export default function WorkbookCrossSell({ slug }) {
  const source = `help_${slug}`;
  const href = workbookLink(source);

  return (
    <aside
      style={{
        margin: "28px 0",
        padding: "24px 22px",
        borderRadius: 22,
        background: "rgba(255,255,255,0.68)",
        border: "1px solid rgba(196,149,106,0.26)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p style={{ margin: "0 0 8px", fontSize: 12, letterSpacing: 1.7, textTransform: "uppercase", color: "var(--amber-deep)", fontWeight: 800 }}>
        From the AIForj CBT Workbook
      </p>
      <h2 style={{ margin: "0 0 10px", fontFamily: "'Fraunces', serif", fontSize: 24, lineHeight: 1.2 }}>
        84 pages · 30 days of structured CBT exercises
      </h2>
      <p style={{ margin: "0 0 16px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
        Written by Kevin, psychiatric NP candidate.
      </p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("cbt_workbook_click", { source })}
        className="btn-secondary"
        style={{ display: "inline-flex", textDecoration: "none", color: "var(--sage-deep)" }}
      >
        Get the workbook — $27 →
      </a>
    </aside>
  );
}
