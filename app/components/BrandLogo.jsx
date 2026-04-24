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
        borderRadius: Math.max(8, Math.round(size * 0.28)),
        boxShadow: "0 10px 24px rgba(36,69,63,0.16)",
        overflow: "hidden",
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="brandBg" x1="80" y1="64" x2="432" y2="448" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF1D8" />
            <stop offset="0.48" stopColor="#DDECD7" />
            <stop offset="1" stopColor="#C8E9F0" />
          </linearGradient>
          <linearGradient id="brandFlame" x1="196" y1="134" x2="318" y2="360" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2C46B" />
            <stop offset="0.55" stopColor="#DB8F62" />
            <stop offset="1" stopColor="#6FAE8C" />
          </linearGradient>
          <linearGradient id="brandOrbit" x1="126" y1="128" x2="390" y2="396" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7BAF8D" />
            <stop offset="0.52" stopColor="#70B7C7" />
            <stop offset="1" stopColor="#B9A7F0" />
          </linearGradient>
        </defs>
        <rect x="38" y="38" width="436" height="436" rx="118" fill="url(#brandBg)" />
        <rect x="56" y="56" width="400" height="400" rx="101" stroke="#FFFFFF" strokeOpacity="0.72" strokeWidth="14" />
        <path d="M136 292C170 205 235 144 346 116" stroke="url(#brandOrbit)" strokeWidth="22" strokeLinecap="round" />
        <path d="M376 190C354 279 294 342 182 376" stroke="url(#brandOrbit)" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.78" />
        <circle cx="359" cy="174" r="20" fill="#24453F" />
        <circle cx="359" cy="174" r="9" fill="#BDEFE8" />
        <path d="M255 106C214 161 196 199 196 246C196 314 245 360 255 369C265 360 316 314 316 246C316 199 296 159 255 106Z" fill="url(#brandFlame)" stroke="#24453F" strokeWidth="16" strokeLinejoin="round" />
        <path d="M255 178C236 207 228 229 228 254C228 294 251 320 255 324C259 320 284 294 284 254C284 229 275 207 255 178Z" fill="#FFF7E8" fillOpacity="0.92" />
        <path d="M177 300C218 293 244 272 255 238C268 270 294 292 336 300" stroke="#24453F" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M187 202H325" stroke="#24453F" strokeWidth="18" strokeLinecap="round" />
        <path d="M206 342H306" stroke="#24453F" strokeWidth="18" strokeLinecap="round" strokeOpacity="0.84" />
        <circle cx="145" cy="297" r="12" fill="#F2C46B" />
        <circle cx="378" cy="192" r="8" fill="#F2C46B" />
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
