export const EVIDENCE_SOURCE_LIBRARY = {
  structuredRespirationTrial: {
    title: "Brief structured respiration practices enhance mood and reduce physiological arousal",
    url: "https://pubmed.ncbi.nlm.nih.gov/36630953/",
    detail: "PubMed · randomized controlled trial · 2023",
  },
  briefStateAnxietyReview: {
    title:
      "A systematic review of brief respiratory, embodiment, cognitive, and mindfulness interventions to reduce state anxiety",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11203600/",
    detail: "PMC · systematic review · 2024",
  },
  mindfulnessAcuteStressStudy: {
    title: "Mindfulness Exercises Reduce Acute Physiologic Stress Among Female Clinicians",
    url: "https://pubmed.ncbi.nlm.nih.gov/39466161/",
    detail: "PubMed · prospective pilot study · 2024",
  },
  cbtAnxietyMeta: {
    title:
      "Cognitive behavioral therapy for anxiety and related disorders: A meta-analysis of randomized placebo-controlled trials",
    url: "https://pubmed.ncbi.nlm.nih.gov/29451967/",
    detail: "PubMed · meta-analysis · 2018",
  },
  acceptanceMindfulnessMeta: {
    title:
      "A systematic review and meta-analysis of acceptance- and mindfulness-based interventions for DSM-5 anxiety disorders",
    url: "https://pubmed.ncbi.nlm.nih.gov/34650179/",
    detail: "PubMed · systematic review/meta-analysis · 2021",
  },
  behavioralActivationMeta: {
    title: "Individual behavioral activation in the treatment of depression: A meta analysis",
    url: "https://www.tandfonline.com/doi/full/10.1080/10503307.2023.2197630",
    detail: "Psychotherapy Research · meta-analysis · 2023",
  },
  selfCompassionMeta: {
    title:
      "Effects of Self-Compassion Interventions on Reducing Depressive Symptoms, Anxiety, and Stress: A Meta-Analysis",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10239723/",
    detail: "PMC · meta-analysis · 2023",
  },
  worryPostponementSleepTrial: {
    title: "Effects of worry postponement on daily worry and sleep: a randomised controlled trial",
    url: "https://pubmed.ncbi.nlm.nih.gov/41347618/",
    detail: "PubMed · randomized controlled trial · 2025",
  },
  worryPostponementInternetTrial: {
    title:
      "Reducing worry and subjective health complaints: A randomized trial of an internet-delivered worry postponement intervention",
    url: "https://pubmed.ncbi.nlm.nih.gov/26511764/",
    detail: "PubMed · randomized trial · 2016",
  },
  expressiveWritingOverview: {
    title: "Writing About Emotional Experiences as a Therapeutic Process",
    url: "https://journals.sagepub.com/doi/10.1111/j.1467-9280.1997.tb00403.x",
    detail: "Psychological Science · overview/review · 1997",
  },
  sleepDeprivationEmotionStudy: {
    title: "The human emotional brain without sleep — a prefrontal amygdala disconnect",
    url: "https://www.sciencedirect.com/science/article/pii/S0960982207017836",
    detail: "Current Biology · experimental study · 2007",
  },
  sleepDeprivationReview: {
    title: "The consequences of sleep deprivation on cognitive performance",
    url: "https://pubmed.ncbi.nlm.nih.gov/37045455/",
    detail: "PubMed · review · 2023",
  },
  cortisolAwakeningReview: {
    title: "Cortisol awakening response and psychosocial factors: a systematic review and meta-analysis",
    url: "https://pubmed.ncbi.nlm.nih.gov/19022335/",
    detail: "PubMed · systematic review/meta-analysis · 2009",
  },
  burnoutWho: {
    title: "Burn-out an occupational phenomenon",
    url: "https://www.who.int/standards/classifications/frequently-asked-questions/burn-out-an-occupational-phenomenon",
    detail: "World Health Organization · ICD-11 explainer",
  },
  psychosocialRiskWho: {
    title: "Psycho-social risks and mental health",
    url: "https://www.who.int/tools/occupational-hazards-in-health-sector/psycho-social-risks-mental-health",
    detail: "World Health Organization · occupational risk guidance",
  },
  aiRiskStanford: {
    title: "New study warns of risks in AI mental health tools",
    url: "https://news.stanford.edu/stories/2025/06/ai-mental-health-care-tools-dangers-risks",
    detail: "Stanford Report · research summary · 2025",
  },
  privacyRiskFtc: {
    title:
      "FTC to Ban BetterHelp from Revealing Consumers’ Data, Including Sensitive Mental Health Information, to Facebook and Others for Targeted Advertising",
    url: "https://www.ftc.gov/news-events/news/press-releases/2023/03/ftc-ban-betterhelp-revealing-consumers-data-including-sensitive-mental-health-information-facebook",
    detail: "Federal Trade Commission · press release · 2023",
  },
  healthPrivacyFtc: {
    title: "Health Privacy",
    url: "https://www.ftc.gov/tips-advice/business-center/privacy-and-security/health-privacy",
    detail: "Federal Trade Commission · business guidance",
  },
};

const createEvidence = (intro, items, scopeNote) => ({
  intro,
  items,
  scopeNote,
  sourceLibrary: EVIDENCE_SOURCE_LIBRARY,
});

const BREATHING_EVIDENCE = createEvidence(
  "Breathing practices are among the better-supported short, self-guided regulation tools. The strongest evidence is for paced or exhale-emphasized breathing reducing momentary stress and physiological arousal, not for any one branded breathing ratio being uniquely magical.",
  [
    {
      claimId: "breathing-acute-arousal",
      claim:
        "Brief, structured breath pacing can reduce short-term stress and help many people feel calmer in the moment.",
      appliesTo: "box breathing, physiological sighs, longer-exhale breathing, short reset drills",
      strength: "B",
      sources: ["structuredRespirationTrial", "briefStateAnxietyReview"],
    },
    {
      claimId: "breathing-plain-language",
      claim:
        "Mechanistic explanations are still evolving, so we frame these practices as nervous-system regulation tools rather than guaranteed vagus-nerve or cortisol hacks.",
      appliesTo: "all breathing-based techniques on AIForj",
      strength: "C",
      sources: ["structuredRespirationTrial", "briefStateAnxietyReview"],
    },
  ],
  "These citations support the broader breathing method family. They do not prove that a specific inhale/hold/exhale count is best for every person."
);

const GROUNDING_EVIDENCE = createEvidence(
  "Grounding and mindfulness tools are best supported as attention-shifting and body-awareness practices. Evidence is stronger for the family of methods than for any single script.",
  [
    {
      claimId: "grounding-stress",
      claim:
        "Grounding and mindfulness exercises can reduce acute stress and anxiety symptoms for many people.",
      appliesTo: "5-4-3-2-1 grounding, body scans, brief present-moment noticing",
      strength: "B",
      sources: ["mindfulnessAcuteStressStudy", "acceptanceMindfulnessMeta"],
    },
    {
      claimId: "grounding-attention",
      claim:
        "These tools likely help by redirecting attention and increasing body awareness, not by proving one exact brain-region story.",
      appliesTo: "sensory grounding and body-awareness practices",
      strength: "C",
      sources: ["mindfulnessAcuteStressStudy", "briefStateAnxietyReview"],
    },
  ],
  "The evidence is stronger for reducing immediate stress and helping people orient in the present than for precise neuroscience explanations."
);

const BODY_RELAXATION_EVIDENCE = createEvidence(
  "Body-based relaxation exercises are commonly used to reduce muscle tension and sympathetic arousal. Evidence is stronger for the general relaxation method family than for one exact sequence.",
  [
    {
      claimId: "body-relaxation-stress",
      claim:
        "Brief body-relaxation and embodied calming exercises can reduce state anxiety and physical tension for many people.",
      appliesTo: "progressive muscle relaxation, tension-release, body-settling drills",
      strength: "B",
      sources: ["briefStateAnxietyReview", "mindfulnessAcuteStressStudy"],
    },
    {
      claimId: "body-relaxation-practical",
      claim:
        "The most credible framing is practical: you tense, release, notice the contrast, and give the body a clearer path back toward baseline.",
      appliesTo: "muscle-by-muscle relaxation practices",
      strength: "C",
      sources: ["briefStateAnxietyReview"],
    },
  ],
  "These citations support short body-based relaxation methods as a family. They do not mean every relaxation script works the same way for every person."
);

const CBT_EVIDENCE = createEvidence(
  "CBT-style tools are well supported for anxiety and related distress. On AIForj, that usually means slowing the spiral, checking the thought, and moving toward a more workable interpretation.",
  [
    {
      claimId: "cbt-anxiety",
      claim:
        "CBT is a well-supported treatment family for anxiety and related symptoms, including thought-checking and reinterpretation skills.",
      appliesTo: "cognitive restructuring, thinking traps, imposter thoughts, rejection stories",
      strength: "A",
      sources: ["cbtAnxietyMeta"],
    },
    {
      claimId: "cbt-adaptation",
      claim:
        "These AIForj tools are short-form adaptations of CBT skills, so the evidence applies to the underlying method more directly than to any single scripted prompt.",
      appliesTo: "all CBT-style AIForj techniques",
      strength: "B",
      sources: ["cbtAnxietyMeta", "briefStateAnxietyReview"],
    },
  ],
  "AIForj’s brief exercises are not a substitute for therapy. They are short skill translations from better-studied treatment families."
);

const ACCEPTANCE_VALUES_EVIDENCE = createEvidence(
  "Acceptance-, mindfulness-, and values-based skills are commonly used when fighting thoughts or feelings is making things worse. They are better supported as coping frameworks than as precise neuroscience interventions.",
  [
    {
      claimId: "acceptance-anxiety",
      claim:
        "Acceptance- and mindfulness-based interventions can reduce anxiety symptoms and improve day-to-day coping.",
      appliesTo: "thought defusion, radical acceptance, values clarification, grief-related acceptance work",
      strength: "B",
      sources: ["acceptanceMindfulnessMeta"],
    },
    {
      claimId: "values-direction",
      claim:
        "Values-based action can help people reconnect with meaningful next steps even when distress does not disappear immediately.",
      appliesTo: "values clarification, decision paralysis, people-pleasing, grief and meaning work",
      strength: "B",
      sources: ["acceptanceMindfulnessMeta", "behavioralActivationMeta"],
    },
  ],
  "The best evidence here is for the broader ACT and mindfulness family, not for one exact phrase or journaling prompt."
);

const BEHAVIORAL_ACTIVATION_EVIDENCE = createEvidence(
  "Behavioral activation is one of the clearest evidence bases for getting unstuck when avoidance, low mood, or dread are shrinking your world.",
  [
    {
      claimId: "ba-action",
      claim:
        "Behavioral activation can reduce depressive symptoms and help people re-engage with meaningful activity.",
      appliesTo: "motivation slumps, avoidance loops, Sunday dread, burnout-adjacent inertia",
      strength: "A",
      sources: ["behavioralActivationMeta"],
    },
    {
      claimId: "ba-small-steps",
      claim:
        "The mechanism is usually behavioral, not mystical: small, doable actions can rebuild momentum and increase contact with mastery, routine, and reward.",
      appliesTo: "behavioral activation plans and recovery micro-steps",
      strength: "B",
      sources: ["behavioralActivationMeta", "cbtAnxietyMeta"],
    },
  ],
  "This evidence supports the general method of activation and re-engagement. It does not mean every low-energy state is simple to fix with action alone."
);

const SELF_COMPASSION_EVIDENCE = createEvidence(
  "Self-compassion is not the same as letting everything slide. In the literature it is usually studied as a way to reduce shame, self-criticism, and emotional distress while improving steadier coping.",
  [
    {
      claimId: "self-compassion-distress",
      claim:
        "Self-compassion interventions can reduce anxiety, stress, and depressive symptoms for many people.",
      appliesTo: "self-compassion breaks, emotional hangover recovery, post-shame repair",
      strength: "B",
      sources: ["selfCompassionMeta"],
    },
    {
      claimId: "self-compassion-recovery",
      claim:
        "When people are already depleted, a kinder response can reduce secondary shame and help recovery feel more workable.",
      appliesTo: "self-critical spirals, perfectionism, emotionally raw recovery periods",
      strength: "B",
      sources: ["selfCompassionMeta", "acceptanceMindfulnessMeta"],
    },
  ],
  "The evidence supports compassion practices as part of coping and recovery. It does not mean self-kindness alone resolves the underlying stressor."
);

const WORRY_RUMINATION_EVIDENCE = createEvidence(
  "Rumination tools work best when they help you contain repetitive worry instead of feeding it. The evidence base is stronger for the general strategy than for any one app or worksheet format.",
  [
    {
      claimId: "worry-postponement",
      claim:
        "Worry postponement and related repetitive-thinking interventions can reduce daily worry for some people.",
      appliesTo: "scheduled worry time, thought spirals, looping over future scenarios",
      strength: "B",
      sources: ["worryPostponementSleepTrial", "worryPostponementInternetTrial"],
    },
    {
      claimId: "externalizing-thoughts",
      claim:
        "Writing thoughts down can sometimes lower mental load and make repetitive worry feel more containable, though results are mixed and context matters.",
      appliesTo: "brain-dumps, thought externalization, expressive writing prompts",
      strength: "C",
      sources: ["expressiveWritingOverview", "worryPostponementInternetTrial"],
    },
  ],
  "Evidence for journaling is mixed across situations. On AIForj we use it as a lightweight containment tool, not as a promise that writing will always improve sleep or mood."
);

const BURNOUT_EVIDENCE = createEvidence(
  "Burnout is best handled with careful scope. The WHO definition is occupational, and the most credible guidance focuses on reducing chronic work stressors and increasing control, recovery, and support.",
  [
    {
      claimId: "burnout-scope",
      claim:
        "WHO defines burnout as an occupational phenomenon related to chronic workplace stress that has not been successfully managed, not as a medical diagnosis.",
      appliesTo: "burnout framing, work-related exhaustion, cynicism, reduced efficacy",
      strength: "A",
      sources: ["burnoutWho"],
    },
    {
      claimId: "burnout-risk-factors",
      claim:
        "Workload, low control, long hours, insufficient support, and similar psychosocial risks are central drivers of burnout.",
      appliesTo: "recovery planning, boundary-setting, workload and control conversations",
      strength: "A",
      sources: ["psychosocialRiskWho", "burnoutWho"],
    },
  ],
  "Outside work, people can absolutely feel similarly depleted. We just avoid calling every kind of depletion 'burnout' because the formal WHO term is narrower."
);

const NIGHTTIME_EVIDENCE = createEvidence(
  "Late-night spirals feel worse partly because sleep loss can impair cognitive control and intensify emotional reactivity. Exact percentages and exact hormone timing vary, so we keep the framing careful.",
  [
    {
      claimId: "sleep-emotion",
      claim:
        "Insufficient sleep can make emotion regulation and clear thinking harder, which can make nighttime worries feel louder and more convincing.",
      appliesTo: "3am spirals, staying up with racing thoughts, next-day emotional reactivity",
      strength: "B",
      sources: ["sleepDeprivationEmotionStudy", "sleepDeprivationReview"],
    },
    {
      claimId: "car",
      claim:
        "The cortisol awakening response is real, but its size and timing vary by person and situation, so we avoid rigid one-size-fits-all numbers.",
      appliesTo: "morning dread, waking anxiety, early-morning physiological activation",
      strength: "B",
      sources: ["cortisolAwakeningReview"],
    },
    {
      claimId: "rumination-sleep",
      claim:
        "Containing repetitive thinking can help daily worry and may help sleep for some people, though it is not a guarantee.",
      appliesTo: "worry postponement, brain-dumps, overthinking loops",
      strength: "B",
      sources: ["worryPostponementSleepTrial", "worryPostponementInternetTrial"],
    },
  ],
  "This is support for a probable mechanism and a practical protocol. It is not a precise diagnosis of why a specific person woke up at a specific time."
);

const SOCIAL_RECOVERY_EVIDENCE = createEvidence(
  "Some people genuinely feel more depleted by social input than others, but the exact neuroscience story is less settled than internet pop-psychology often suggests. We keep the evidence focused on recovery skills, not personality-brain myths.",
  [
    {
      claimId: "social-recovery",
      claim:
        "Short mindfulness and breathing exercises can help reduce stress after socially demanding or overstimulating experiences.",
      appliesTo: "social exhaustion recovery, decompression, overstimulation",
      strength: "B",
      sources: ["mindfulnessAcuteStressStudy", "structuredRespirationTrial"],
    },
    {
      claimId: "social-claims-scope",
      claim:
        "Claims about introverts, dopamine depletion, or one fixed 'social battery' mechanism are more speculative than settled, so we treat them as metaphors rather than facts.",
      appliesTo: "social exhaustion explanation copy",
      strength: "C",
      sources: ["briefStateAnxietyReview", "acceptanceMindfulnessMeta"],
    },
  ],
  "This evidence supports the recovery skills used on the page more directly than broad claims about introvert neurobiology."
);

export const TECHNIQUE_EVIDENCE = {};

const assignEvidence = (evidence, slugs) => {
  slugs.forEach((slug) => {
    TECHNIQUE_EVIDENCE[slug] = evidence;
  });
};

assignEvidence(BREATHING_EVIDENCE, [
  "box-breathing",
  "physiological-sigh",
  "vagal-toning",
  "tipp-skill",
  "rage-spiral",
  "overwhelmed-at-work",
]);

assignEvidence(GROUNDING_EVIDENCE, [
  "54321-grounding",
  "body-scan",
]);

assignEvidence(BODY_RELAXATION_EVIDENCE, [
  "progressive-muscle-relaxation",
]);

assignEvidence(CBT_EVIDENCE, [
  "cognitive-restructuring",
  "cognitive-distortions",
  "imposter-syndrome",
  "comparison-trap",
  "perfectionism",
  "rejection-sensitivity",
]);

assignEvidence(ACCEPTANCE_VALUES_EVIDENCE, [
  "thought-defusion",
  "radical-acceptance",
  "values-clarification",
  "people-pleasing",
  "decision-paralysis",
  "grief-wave",
]);

assignEvidence(BEHAVIORAL_ACTIVATION_EVIDENCE, [
  "behavioral-activation",
  "sunday-scaries",
]);

assignEvidence(SELF_COMPASSION_EVIDENCE, [
  "self-compassion-break",
  "emotional-hangover",
]);

assignEvidence(WORRY_RUMINATION_EVIDENCE, [
  "worry-time",
  "thought-spiral",
]);

assignEvidence(NIGHTTIME_EVIDENCE, [
  "morning-dread",
]);

assignEvidence(SOCIAL_RECOVERY_EVIDENCE, [
  "social-exhaustion",
]);

export const PAGE_EVIDENCE = {
  "3am-spiral": NIGHTTIME_EVIDENCE,
  "burned-out": BURNOUT_EVIDENCE,
  "burnout-recovery": BURNOUT_EVIDENCE,
  "how-aiforj-stays-safe": createEvidence(
    "AIForj’s safety posture is about product boundaries more than clever prompts: structured tools instead of open-ended therapist claims, local-first privacy, and clear crisis handoff when the need is bigger than a self-guided tool.",
    [
      {
        claimId: "ai-risk",
        claim:
          "Researchers and consumer-protection agencies have documented real risks in mental-health-adjacent AI products, including unsafe responses and poor privacy practices.",
        appliesTo: "why AIForj stays narrow in scope and privacy-first by default",
        strength: "A",
        sources: ["aiRiskStanford", "privacyRiskFtc", "healthPrivacyFtc"],
      },
      {
        claimId: "ai-scope",
        claim:
          "Because of those risks, AIForj is designed for emotional first aid and guided self-help, not diagnosis, medication advice, or crisis care.",
        appliesTo: "scope-of-use, escalation boundaries, privacy posture",
        strength: "A",
        sources: ["aiRiskStanford", "healthPrivacyFtc"],
      },
    ],
    "This page explains AIForj’s design choices. It does not claim that any AI system is risk-free."
  ),
};

export const EVIDENCE_STRENGTH = {
  A: {
    label: "A · stronger support",
    description: "Guidelines, meta-analyses, or well-established evidence for the underlying method.",
  },
  B: {
    label: "B · moderate support",
    description: "Promising and useful evidence, but not definitive for every population or every exact script.",
  },
  C: {
    label: "C · emerging or mixed",
    description: "Helpful supporting evidence or theory, but more limited, indirect, or contested.",
  },
};

export function getTechniqueEvidence(slug) {
  return TECHNIQUE_EVIDENCE[slug] || null;
}

export function getPageEvidence(key) {
  return PAGE_EVIDENCE[key] || null;
}
