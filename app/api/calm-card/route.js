import { ImageResponse } from 'next/og';
import QRCode from 'qrcode';
import { CARD_FORMATS } from '../../../utils/calmCard';
import { getCalmCardData } from '../../../utils/calmCardData';

export const runtime = 'nodejs';

const COLORS = {
  ink: '#2D2A26',
  muted: '#6C675D',
  accent: '#7D9B82',
  accentSoft: '#E8F1EA',
  warm: '#F3E7D6',
  line: 'rgba(45,42,38,0.10)',
  shell: '#FDFAF6',
};

function getFormatConfig(formatKey) {
  return CARD_FORMATS[formatKey] || CARD_FORMATS.og;
}

function getFileName(kind, slug, format) {
  return `aiforj-${kind}-${slug}-${format}.png`;
}

function sanitizeBrand(value) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 48);
}

function getLayout(format) {
  const isWide = format.width > format.height;
  const isTall = format.height > format.width;

  return {
    isWide,
    isTall,
    padding: isTall ? 72 : 56,
    titleSize: isTall ? 86 : 54,
    bodySize: isTall ? 34 : 24,
    metaSize: isTall ? 24 : 18,
    qrSize: isTall ? 208 : 128,
    footerSize: isTall ? 20 : 16,
  };
}

async function getQrCodeDataUrl(url, size) {
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: size,
    color: {
      dark: COLORS.ink,
      light: '#FFFFFF',
    },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get('kind') || 'technique';
  const slug = searchParams.get('slug');
  const formatKey = searchParams.get('format') || 'og';
  const download = searchParams.get('download') === '1';
  const brand = sanitizeBrand(searchParams.get('brand'));

  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const card = getCalmCardData({ kind, slug });
  if (!card) {
    return new Response('Not found', { status: 404 });
  }

  const format = getFormatConfig(formatKey);
  const layout = getLayout(format);
  const qrCode = await getQrCodeDataUrl(card.targetUrl, layout.qrSize);
  const teaserSteps = card.teaserSteps.slice(0, 2);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: layout.padding,
          background: `linear-gradient(155deg, ${COLORS.shell} 0%, ${COLORS.warm} 48%, ${COLORS.shell} 100%)`,
          color: COLORS.ink,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -140,
              right: -120,
              width: format.height > format.width ? 500 : 380,
              height: format.height > format.width ? 500 : 380,
              borderRadius: '999px',
              background: 'rgba(125,155,130,0.12)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -110,
              left: -100,
              width: format.height > format.width ? 340 : 260,
              height: format.height > format.width ? 340 : 260,
              borderRadius: '999px',
              background: 'rgba(125,155,130,0.08)',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.7)',
              border: `1px solid ${COLORS.line}`,
              fontSize: layout.metaSize,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: COLORS.accent,
              }}
            />
            <span>{card.eyebrow}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ display: 'flex', fontSize: layout.metaSize, color: COLORS.muted }}>
              {format.label} Calm Card
            </div>
            {brand ? (
              <div
                style={{
                  display: 'flex',
                  fontSize: layout.footerSize,
                  color: COLORS.ink,
                  background: 'rgba(255,255,255,0.76)',
                  border: `1px solid ${COLORS.line}`,
                  borderRadius: 999,
                  padding: '10px 14px',
                  maxWidth: layout.isTall ? 340 : 280,
                }}
              >
                Prepared for {brand}
              </div>
            ) : null}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: layout.isWide ? 'row' : 'column',
            gap: layout.isWide ? 42 : 30,
            justifyContent: 'space-between',
            alignItems: layout.isWide ? 'stretch' : 'flex-start',
            position: 'relative',
            flex: 1,
            marginTop: layout.isTall ? 34 : 22,
            marginBottom: layout.isTall ? 34 : 18,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: layout.isWide ? '69%' : '100%' }}>
            <div style={{ display: 'flex', fontSize: layout.metaSize, color: COLORS.accent, marginBottom: 18 }}>
              Emotional first aid that people actually share
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: layout.titleSize,
                lineHeight: 1.04,
                fontWeight: 700,
                letterSpacing: -1.8,
                marginBottom: 18,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: layout.bodySize,
                lineHeight: 1.3,
                color: COLORS.muted,
                marginBottom: 24,
                maxWidth: layout.isWide ? '92%' : '100%',
              }}
            >
              {card.promise}
            </div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {teaserSteps.map((step) => (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '14px 18px',
                    borderRadius: 20,
                    background: 'rgba(255,255,255,0.76)',
                    border: `1px solid ${COLORS.line}`,
                    fontSize: layout.metaSize,
                    maxWidth: layout.isWide ? '46%' : '100%',
                  }}
                >
                  <span style={{ color: COLORS.accent, fontSize: layout.metaSize + 2 }}>+</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: layout.isWide ? 'flex-end' : 'flex-start',
              minWidth: layout.isWide ? 240 : '100%',
              gap: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                padding: '18px 20px',
                borderRadius: 24,
                background: COLORS.accentSoft,
                border: `1px solid ${COLORS.line}`,
                minWidth: layout.isWide ? 240 : '100%',
              }}
            >
              <span style={{ fontSize: layout.metaSize, color: COLORS.accent }}>Guided</span>
              <span style={{ fontSize: layout.bodySize, fontWeight: 700 }}>{card.duration}</span>
              <span style={{ fontSize: layout.metaSize, color: COLORS.muted }}>{card.modality}</span>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: layout.isWide ? 'column' : 'row',
                alignItems: layout.isWide ? 'flex-end' : 'center',
                gap: 18,
                width: layout.isWide ? 'auto' : '100%',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  maxWidth: layout.isWide ? 220 : 520,
                }}
              >
                <span style={{ fontSize: layout.metaSize, color: COLORS.muted }}>Scan to open</span>
                <span style={{ fontSize: layout.footerSize, lineHeight: 1.35 }}>{card.pathLabel}</span>
                <span style={{ fontSize: layout.footerSize, color: COLORS.muted, lineHeight: 1.4 }}>
                  {brand ? `${card.footer} · Shared via ${brand}` : card.footer}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  width: layout.qrSize,
                  height: layout.qrSize,
                  background: '#fff',
                  borderRadius: 24,
                  padding: 12,
                  border: `1px solid ${COLORS.line}`,
                }}
              >
                <img src={qrCode} width={layout.qrSize - 24} height={layout.qrSize - 24} alt="QR code" />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
            borderTop: `1px solid ${COLORS.line}`,
            paddingTop: 18,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: layout.footerSize + 2, fontWeight: 700, color: COLORS.accent }}>AIForj</span>
            <span style={{ fontSize: layout.footerSize, color: COLORS.muted }}>Built for calm, trust, and repeat relief</span>
          </div>
        </div>
      </div>
    ),
    {
      width: format.width,
      height: format.height,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400, stale-while-revalidate=604800',
        ...(download ? { 'Content-Disposition': `attachment; filename="${getFileName(kind, slug, formatKey)}"` } : {}),
      },
    }
  );
}
