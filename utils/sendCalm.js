const BASE_URL = 'https://aiforj.com';
const SEND_CALM_LOG_KEY = 'aiforj_send_calm_generation_log';
const SEND_CALM_WINDOW_MS = 60 * 60 * 1000;

export const SEND_CALM_LIMIT_PER_HOUR = 8;

function cleanText(value = '', maxLength = 140) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function normalizePhone(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';

  const hasPlus = trimmed.startsWith('+');
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return '';

  return `${hasPlus ? '+' : ''}${digits}`;
}

export function getReplyContactInfo(value = '') {
  const cleaned = cleanText(value, 80);
  if (!cleaned) {
    return { valid: false, type: null, value: '', display: '' };
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailPattern.test(cleaned)) {
    return {
      valid: true,
      type: 'email',
      value: cleaned.toLowerCase(),
      display: cleaned,
    };
  }

  const phone = normalizePhone(cleaned);
  if (phone) {
    return {
      valid: true,
      type: 'sms',
      value: phone,
      display: cleaned,
    };
  }

  return {
    valid: false,
    type: null,
    value: cleaned,
    display: cleaned,
  };
}

export function normalizeGiftPayload(raw = {}) {
  const replyInfo = getReplyContactInfo(raw.reply || raw.replyContact);

  return {
    fromName: cleanText(raw.from || raw.fromName, 50),
    message: cleanText(raw.msg || raw.message, 140),
    replyContact: replyInfo.valid ? replyInfo.value : '',
  };
}

export function parseGiftPayloadFromHash(hash = '') {
  if (!hash) return null;

  try {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const encoded = params.get('payload');
    if (!encoded) return null;
    return normalizeGiftPayload(JSON.parse(decodeURIComponent(encoded)));
  } catch {
    return null;
  }
}

export function parseLegacyGiftPayload(searchParams) {
  if (!searchParams?.get) {
    return normalizeGiftPayload({});
  }

  return normalizeGiftPayload({
    from: searchParams.get('from') || '',
    msg: searchParams.get('msg') || '',
    reply: searchParams.get('reply') || '',
  });
}

export function buildGiftLink({ techniqueSlug, fromName = '', message = '', replyContact = '' }) {
  const payload = normalizeGiftPayload({
    from: fromName,
    msg: message,
    reply: replyContact,
  });

  const giftPayload = {};
  if (payload.fromName) giftPayload.from = payload.fromName;
  if (payload.message) giftPayload.msg = payload.message;
  if (payload.replyContact) giftPayload.reply = payload.replyContact;

  if (!Object.keys(giftPayload).length) {
    return `${BASE_URL}/gift/${techniqueSlug}`;
  }

  const encoded = encodeURIComponent(JSON.stringify(giftPayload));
  return `${BASE_URL}/gift/${techniqueSlug}#payload=${encoded}`;
}

function readRecentSendCalmLog(now = Date.now()) {
  if (typeof window === 'undefined') return [];

  try {
    const parsed = JSON.parse(window.localStorage.getItem(SEND_CALM_LOG_KEY) || '[]');
    const recent = parsed.filter((value) => Number.isFinite(value) && now - value < SEND_CALM_WINDOW_MS);
    window.localStorage.setItem(SEND_CALM_LOG_KEY, JSON.stringify(recent));
    return recent;
  } catch {
    return [];
  }
}

export function getSendCalmRateLimit(now = Date.now()) {
  const recent = readRecentSendCalmLog(now);
  const allowed = recent.length < SEND_CALM_LIMIT_PER_HOUR;
  const oldest = recent[0];

  return {
    allowed,
    used: recent.length,
    remaining: Math.max(0, SEND_CALM_LIMIT_PER_HOUR - recent.length),
    resetInMs: oldest ? Math.max(0, SEND_CALM_WINDOW_MS - (now - oldest)) : 0,
    limit: SEND_CALM_LIMIT_PER_HOUR,
  };
}

export function recordSendCalmLink(now = Date.now()) {
  if (typeof window === 'undefined') return;

  const recent = readRecentSendCalmLog(now);
  recent.push(now);

  try {
    window.localStorage.setItem(SEND_CALM_LOG_KEY, JSON.stringify(recent));
  } catch {
    // Ignore storage failures in private browsing or restricted environments.
  }
}

export function formatSendCalmReset(resetInMs = 0) {
  const minutes = Math.max(1, Math.ceil(resetInMs / (60 * 1000)));
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours}h`;
}

export function buildSendBackHref({ replyContact, senderName = '', giftLink }) {
  const contact = getReplyContactInfo(replyContact);
  if (!contact.valid || !giftLink) return null;

  const intro = senderName
    ? `This helped me, ${senderName}. Sending some calm back your way.`
    : 'This helped me, so I wanted to send some calm back.';

  if (contact.type === 'email') {
    const subject = encodeURIComponent('Sending calm back');
    const body = encodeURIComponent(`${intro}\n\n${giftLink}`);
    return `mailto:${contact.value}?subject=${subject}&body=${body}`;
  }

  const body = encodeURIComponent(`${intro} ${giftLink}`);
  return `sms:${contact.value}?body=${body}`;
}

export function buildForwardShareCopy({ techniqueName = '', giftLink }) {
  const prefix = techniqueName
    ? `This ${techniqueName} tool helped me a little, and I thought of you.`
    : 'This helped me a little, and I thought of you.';

  return `${prefix} ${giftLink}`;
}
