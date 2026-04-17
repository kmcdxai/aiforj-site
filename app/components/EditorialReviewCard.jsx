import Link from "next/link";
import {
  EDITORIAL_POLICY_URL,
  LAST_REVIEWED_DATE,
} from "../../lib/contentSchemas";

const formatDate = (isoDate) =>
  new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function EditorialReviewCard({
  kind = "Guide",
  authorLabel = "AIForj Team",
  reviewLabel = "Licensed Healthcare Provider",
  reviewedDate = LAST_REVIEWED_DATE,
  background = "rgba(255,255,255,0.45)",
  border = "1px solid rgba(45,42,38,0.08)",
  textColor = "var(--text-primary)",
  mutedColor = "var(--text-secondary)",
}) {
  return (
    <section
      style={{
        marginBottom: 28,
        padding: "18px 20px",
        borderRadius: 16,
        background,
        border,
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 12,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          color: mutedColor,
          fontWeight: 700,
        }}
      >
        {kind} integrity
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
          gap: 14,
          marginBottom: 12,
        }}
      >
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
            Author
          </p>
          <p style={{ margin: 0, fontSize: 14, color: textColor, lineHeight: 1.6 }}>
            {authorLabel}
          </p>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
            Clinical review
          </p>
          <p style={{ margin: 0, fontSize: 14, color: textColor, lineHeight: 1.6 }}>
            {reviewLabel}
          </p>
        </div>
        <div>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: mutedColor, textTransform: "uppercase", letterSpacing: 1 }}>
            Last reviewed
          </p>
          <p style={{ margin: 0, fontSize: 14, color: textColor, lineHeight: 1.6 }}>
            {formatDate(reviewedDate)}
          </p>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: mutedColor, lineHeight: 1.7 }}>
        Built for emotional first aid, not diagnosis or crisis care. Read the{" "}
        <Link
          href={EDITORIAL_POLICY_URL}
          style={{ color: "var(--interactive)", textDecoration: "underline" }}
        >
          editorial policy
        </Link>{" "}
        to see how AIForj writes, reviews, and updates content.
      </p>
    </section>
  );
}
