import { EVIDENCE_STRENGTH } from "../../data/evidence";

export default function EvidenceDrawer({
  evidence,
  summary = "Why this can help + sources",
  accentColor = "var(--accent-sage)",
  borderColor = "rgba(125,155,130,0.15)",
  background = "rgba(255,255,255,0.04)",
  panelBackground = "rgba(255,255,255,0.02)",
  textColor = "var(--text-primary)",
  mutedColor = "var(--text-secondary)",
}) {
  if (!evidence?.items?.length || !evidence?.sourceLibrary) return null;

  return (
    <section style={{ marginBottom: 36 }}>
      <details
        style={{
          background,
          border: `1px solid ${borderColor}`,
          borderRadius: 18,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            padding: "18px 20px",
            cursor: "pointer",
            listStyle: "none",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <p
              style={{
                margin: "0 0 4px",
                fontSize: 15,
                color: textColor,
                fontWeight: 600,
              }}
            >
              {summary}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: mutedColor,
                lineHeight: 1.5,
              }}
            >
              Plain-language framing, evidence strength, and primary or authoritative sources.
            </p>
          </div>
          <span
            style={{
              fontSize: 11,
              color: accentColor,
              fontWeight: 700,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Sources
          </span>
        </summary>

        <div style={{ padding: "0 20px 20px" }}>
          {evidence.intro && (
            <p
              style={{
                margin: "0 0 18px",
                fontSize: 14,
                color: mutedColor,
                lineHeight: 1.75,
              }}
            >
              {evidence.intro}
            </p>
          )}

          <div style={{ display: "grid", gap: 14 }}>
            {evidence.items.map((item) => {
              const strength = EVIDENCE_STRENGTH[item.strength] || EVIDENCE_STRENGTH.C;
              return (
                <div
                  key={item.claimId}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: panelBackground,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 14,
                      color: textColor,
                      lineHeight: 1.65,
                      fontWeight: 500,
                    }}
                  >
                    {item.claim}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px 10px",
                        borderRadius: 999,
                        background: "rgba(107,127,110,0.1)",
                        color: accentColor,
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {strength.label}
                    </span>
                    {item.appliesTo && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "5px 10px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.04)",
                          color: mutedColor,
                          fontSize: 11,
                        }}
                      >
                        Applies to: {item.appliesTo}
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: "0 0 10px",
                      fontSize: 12,
                      color: mutedColor,
                      lineHeight: 1.6,
                    }}
                  >
                    {strength.description}
                  </p>

                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {item.sources.map((sourceId) => {
                      const source = evidence.sourceLibrary[sourceId];
                      if (!source) return null;

                      return (
                        <li key={sourceId} style={{ marginBottom: 10 }}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              color: accentColor,
                              fontSize: 13,
                              lineHeight: 1.6,
                              textDecoration: "underline",
                              textUnderlineOffset: 2,
                            }}
                          >
                            {source.title}
                          </a>
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: 12,
                              color: mutedColor,
                              lineHeight: 1.5,
                            }}
                          >
                            {source.detail}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {evidence.scopeNote && (
            <p
              style={{
                margin: "16px 0 0",
                fontSize: 12,
                color: mutedColor,
                lineHeight: 1.7,
              }}
            >
              Scope note: {evidence.scopeNote}
            </p>
          )}
        </div>
      </details>
    </section>
  );
}
