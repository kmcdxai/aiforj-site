const CRISIS_PATTERNS = [
  /\b(kill myself|suicide|suicidal|end my life|end it all)\b/i,
  /\b(want to die|planning to die|better off dead|no reason to live)\b/i,
  /\b(self[-\s]?harm|cutting myself|hurt myself|harm myself)\b/i,
  /\b(i can'?t stay safe|not safe with myself|i might do something)\b/i,
  /\b(hurt someone|kill someone|harm others|hurt other people)\b/i,
  /\b(overdose|took too many|severely intoxicated|can'?t stop using)\b/i,
  /\b(being abused right now|abuse emergency|not safe at home right now)\b/i,
  /\b(hearing voices telling me|seeing things and i'?m scared|psychosis emergency)\b/i,
  /\b(chest pain|can'?t breathe|medical emergency|call an ambulance)\b/i,
];

const CRISIS_ADJACENT_PATTERNS = [
  /\b(can'?t take it anymore|tired of living|what'?s the point of anything)\b/i,
  /\b(i give up on life|i don'?t see a way out|wish i wouldn'?t wake up)\b/i,
  /\b(i'?m done with everything|i want to disappear forever)\b/i,
];

const MEDICATION_PATTERNS = [
  /\b(start|stop|change|increase|decrease|raise|lower|switch)\b.{0,40}\b(med|meds|medication|antidepressant|ssri|snri|stimulant|benzodiazepine|benzo|antipsychotic|mood stabilizer)\b/i,
  /\b(what dose|dosage|side effect|withdrawal|prescription|prescribe|taper)\b/i,
  /\b(should i take|should i stop|can i mix|is it safe to take)\b.{0,60}\b(med|meds|medication|prozac|zoloft|lexapro|wellbutrin|adderall|xanax|klonopin|lithium|seroquel|lamictal)\b/i,
  /\b(do i have|am i bipolar|am i depressed|do i have adhd|diagnose me|diagnosis)\b/i,
];

export const CRISIS_HANDOFF_TEXT =
  "I hear you, and what you are feeling matters. This is beyond what AIForj can safely help with in chat, and you deserve real human support right now. If you are in the U.S., call or text 988. You can also text HOME to 741741, contact emergency services if there is immediate danger, or reach out to a trusted person who can stay with you. I am going to pause normal chat and keep this focused on getting you supported.";

export const MEDICATION_BOUNDARY_TEXT =
  "AIForj cannot advise on starting, stopping, changing, or dosing medication, and it cannot diagnose you. A prescriber, pharmacist, or urgent care service is the right place for medication decisions, especially if symptoms feel severe or unsafe. I can help you prepare a short list of what to tell a prescriber.";

export function classifySafetyInput(input = "") {
  const text = String(input || "").replace(/\s+/g, " ").trim();
  if (!text) {
    return { level: "none", reason: null, crisis: false, medication: false };
  }

  if (CRISIS_PATTERNS.some((pattern) => pattern.test(text))) {
    return { level: "crisis", reason: "immediate_safety", crisis: true, medication: false };
  }

  if (MEDICATION_PATTERNS.some((pattern) => pattern.test(text))) {
    return { level: "medication", reason: "medication_or_diagnosis_boundary", crisis: false, medication: true };
  }

  if (CRISIS_ADJACENT_PATTERNS.some((pattern) => pattern.test(text))) {
    return { level: "crisis_check", reason: "safety_check_needed", crisis: false, medication: false };
  }

  return { level: "none", reason: null, crisis: false, medication: false };
}

export function buildPrescriberWorksheetPrompt(userText = "") {
  const clean = String(userText || "").replace(/\s+/g, " ").trim().slice(0, 180);
  return [
    "For a prescriber conversation, write down:",
    "1. What you are taking now, including dose and timing.",
    "2. What changed, when it started, and how intense it feels.",
    "3. Side effects, missed doses, substances, supplements, or new medications.",
    "4. Safety concerns, including thoughts of self-harm or not feeling safe.",
    clean ? `5. Your exact question: ${clean}` : "5. The exact question you want answered.",
  ].join("\n");
}
