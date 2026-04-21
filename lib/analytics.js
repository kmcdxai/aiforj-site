export const ANALYTICS_EVENTS = [
  "page_view",
  "start_emotion_selected",
  "start_intervention_began",
  "start_intervention_completed",
  "mood_shift_receipt_generated",
  "mood_shift_receipt_shared",
  "companion_opened",
  "companion_message_sent",
  "cbt_workbook_click",
  "premium_click",
  "sponsor_click",
  "email_signup_submitted",
  "help_page_view",
  "technique_page_view",
  "about_founder_view",
  "sos_button_opened",
];

const EVENT_SET = new Set(ANALYTICS_EVENTS);

function cleanProps(props = {}) {
  return Object.fromEntries(
    Object.entries(props)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 120) : value])
  );
}

export function track(event, props = {}) {
  if (!EVENT_SET.has(event) || typeof window === "undefined") return;

  const payload = cleanProps(props);

  if (typeof window.plausible === "function") {
    window.plausible(event, { props: payload });
  }
}
