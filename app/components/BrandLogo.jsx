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
        borderRadius: Math.max(8, Math.round(size * 0.24)),
        boxShadow: "0 8px 18px rgba(36,69,63,0.14)",
        overflow: "hidden",
        lineHeight: 0,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: "block" }}>
        <defs>
          <linearGradient id="brandBg" x1="70" y1="54" x2="438" y2="456" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF4DF" />
            <stop offset="0.46" stopColor="#E3EFD7" />
            <stop offset="1" stopColor="#BFE7F3" />
          </linearGradient>
          <linearGradient id="brandFlame" x1="190" y1="112" x2="330" y2="410" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2C46B" />
            <stop offset="0.52" stopColor="#DF9463" />
            <stop offset="1" stopColor="#6EAA86" />
          </linearGradient>
          <linearGradient id="brandOrbit" x1="105" y1="122" x2="406" y2="358" gradientUnits="userSpaceOnUse">
            <stop stopColor="#80B98F" />
            <stop offset="0.52" stopColor="#70B7C7" />
            <stop offset="1" stopColor="#B9A7F0" />
          </linearGradient>
        </defs>
        <rect x="22" y="22" width="468" height="468" rx="124" fill="url(#brandBg)" />
        <rect x="45" y="45" width="422" height="422" rx="106" stroke="#FFFFFF" strokeOpacity="0.74" strokeWidth="16" />
        <path d="M106 342C158 220 260 132 401 114" stroke="url(#brandOrbit)" strokeWidth="28" strokeLinecap="round" />
        <circle cx="394" cy="117" r="24" fill="#24453F" />
        <circle cx="394" cy="117" r="10" fill="#BDEFE8" />
        <path d="M256 82C203 145 174 201 174 262C174 343 235 403 256 420C277 403 338 343 338 262C338 201 309 145 256 82Z" fill="url(#brandFlame)" stroke="#24453F" strokeWidth="18" strokeLinejoin="round" />
        <path d="M256 163C227 202 215 234 215 268C215 318 244 350 256 362C268 350 297 318 297 268C297 234 285 202 256 163Z" fill="#FFF9EC" fillOpacity="0.94" />
        <path d="M186 247H326" stroke="#24453F" strokeWidth="24" strokeLinecap="round" />
        <path d="M186 334C225 318 247 290 256 248C265 290 287 318 326 334" stroke="#24453F" strokeWidth="22" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M158 370C225 360 292 318 358 228" stroke="url(#brandOrbit)" strokeWidth="16" strokeLinecap="round" strokeOpacity="0.68" />
      </svg>
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
            fontFamily: "'Fraunces', serif",
            fontSize: wordmarkSize,
            fontWeight: 700,
            letterSpacing: 0,
            lineHeight: 1,
            color: "var(--text-primary)",
          }}
        >
          AIForj
        </span>
      )}
    </span>
  );
}
