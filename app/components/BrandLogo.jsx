export function BrandMark({ size = 32, style = {}, title = "AIForj" }) {
  return (
    <span
      aria-label={title}
      role="img"
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        borderRadius: Math.max(8, Math.round(size * 0.26)),
        background: "#F8FBFF",
        border: "1px solid rgba(42, 101, 185, 0.12)",
        boxShadow: "0 8px 20px rgba(28,79,155,0.14)",
        overflow: "hidden",
        lineHeight: 0,
        ...style,
      }}
    >
      <img
        src="/aiforj-mark.png"
        alt=""
        aria-hidden="true"
        width={size}
        height={size}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </span>
  );
}

export default function BrandLogo({
  size = 32,
  wordmark = true,
  wordmarkSize = 18,
  gap = 8,
  style = {},
  markStyle = {},
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap,
        minWidth: 0,
        color: "var(--text-primary)",
        ...style,
      }}
    >
      <BrandMark size={size} style={markStyle} />
      {wordmark && (
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: wordmarkSize,
            fontWeight: 800,
            letterSpacing: 0,
            lineHeight: 1,
            color: "var(--brand-wordmark-ink)",
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #3D66F5 0%, #26D9E8 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            AI
          </span>
          <span>Forj</span>
        </span>
      )}
    </span>
  );
}
