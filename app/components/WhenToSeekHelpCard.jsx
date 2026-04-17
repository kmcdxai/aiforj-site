import Link from "next/link";

export default function WhenToSeekHelpCard() {
  return (
    <section
      style={{
        marginBottom: 28,
        padding: "18px 20px",
        borderRadius: 16,
        background: "rgba(196,149,106,0.07)",
        border: "1px solid rgba(196,149,106,0.16)",
      }}
    >
      <h2
        style={{
          margin: "0 0 10px",
          fontFamily: "'Fraunces', serif",
          fontSize: 22,
          color: "var(--text-primary)",
        }}
      >
        When to seek professional help
      </h2>
      <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)" }}>
        Use a human provider instead of staying with self-guided tools if symptoms feel unsafe, keep returning, or are disrupting sleep, work, school, eating, or relationships in an ongoing way.
      </p>
      <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)" }}>
        If you are worried you might harm yourself, cannot stay safe, or need urgent support, call or text <strong style={{ color: "var(--crisis)" }}>988</strong> now.
      </p>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.75, color: "var(--text-secondary)" }}>
        For non-crisis care, use <Link href="/find-help" style={{ color: "var(--interactive)", textDecoration: "underline" }}>Find a Provider</Link> to look for licensed support.
      </p>
    </section>
  );
}
