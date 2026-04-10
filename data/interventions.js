/**
 * AIForj Phase 1 intervention data.
 * The anxious/quick tier is fully interactive; the remaining emotion tiers
 * carry transparent placeholder data for the later full intervention buildout.
 */

const placeholder = (id, name, description, modalities, interactionType, interactionLabel, timeMinutes, tier = 'premium') => ({
  id,
  name,
  title: name,
  description,
  modalities,
  modality: modalities.join(' / '),
  interactionType,
  interactionLabel,
  timeMinutes,
  duration: `${timeMinutes} min`,
  tier,
  evidenceBase: 'Placeholder until Phase 2 intervention buildout',
  placeholder: true,
});

export const INTERVENTIONS = {
  anxious: {
    label: 'Anxious',
    emoji: '⚡',
    quick: [
      {
        id: 'grounding-54321',
        name: '5-4-3-2-1 Sensory Grounding',
        title: '5-4-3-2-1 Sensory Grounding',
        description: 'Use your five senses to anchor yourself in the present moment. Tap through what you see, hear, touch, smell, and taste.',
        modalities: ['Somatic', 'Polyvagal'],
        modality: 'Somatic / Polyvagal',
        interactionType: 'body',
        interactionLabel: 'Body Exercise',
        timeMinutes: 2,
        duration: '2 min',
        tier: 'free',
        evidenceBase: 'Polyvagal Theory (Porges, 2011)',
        component: 'SensoryGrounding',
        canonicalTechniqueSlug: '54321-grounding',
      },
      {
        id: 'physiological-sigh',
        name: 'Physiological Sigh',
        title: 'Physiological Sigh',
        description: 'The fastest evidence-backed way to reduce anxiety. Double inhale through nose, long exhale through mouth.',
        modalities: ['Somatic'],
        modality: 'Somatic',
        interactionType: 'body',
        interactionLabel: 'Body Exercise',
        timeMinutes: 1,
        duration: '1 min',
        tier: 'free',
        evidenceBase: 'Stanford/Huberman Lab, 2023',
        component: 'PhysiologicalSigh',
        canonicalTechniqueSlug: 'physiological-sigh',
      },
      {
        id: 'name-the-story',
        name: 'Name the Story',
        title: 'Name the Story',
        description: 'Give your anxious thought pattern a movie title. Creating distance from thoughts reduces their power over you.',
        modalities: ['ACT'],
        modality: 'ACT',
        interactionType: 'thinking',
        interactionLabel: 'Thinking Exercise',
        timeMinutes: 2,
        duration: '2 min',
        tier: 'free',
        evidenceBase: 'ACT Defusion (Hayes, 2004)',
        component: 'NameTheStory',
        canonicalTechniqueSlug: 'thought-defusion',
      },
    ],
    medium: [
      {
        id: 'worry-decision-tree',
        name: 'Worry Decision Tree',
        title: 'Worry Decision Tree',
        description: 'An interactive flowchart that helps you decide: can I act on this worry, or do I need to accept it?',
        modalities: ['CBT', 'ACT'],
        modality: 'CBT / ACT',
        interactionType: 'decision',
        interactionLabel: 'Decision Tool',
        timeMinutes: 7,
        duration: '7 min',
        tier: 'premium',
        evidenceBase: 'CBT Problem-Solving + ACT Acceptance',
        placeholder: true,
      },
      {
        id: 'thought-record-lite',
        name: 'Thought Record Lite',
        title: 'Thought Record Lite',
        description: 'Capture the anxious thought, spot the cognitive distortion, and build a balanced reframe. The gold standard of CBT.',
        modalities: ['CBT'],
        modality: 'CBT',
        interactionType: 'thinking',
        interactionLabel: 'Thinking Exercise',
        timeMinutes: 8,
        duration: '8 min',
        tier: 'premium',
        evidenceBase: 'CBT Thought Records (Beck, 1979)',
        placeholder: true,
      },
      {
        id: 'anxiety-body-map',
        name: 'Anxiety Body Map',
        title: 'Anxiety Body Map',
        description: 'Tap where you feel anxiety in your body. Get targeted somatic release exercises for each area.',
        modalities: ['Somatic', 'Polyvagal'],
        modality: 'Somatic / Polyvagal',
        interactionType: 'body',
        interactionLabel: 'Body Exercise',
        timeMinutes: 6,
        duration: '6 min',
        tier: 'premium',
        evidenceBase: 'Somatic Experiencing (Levine, 1997)',
        placeholder: true,
      },
    ],
    deep: [
      {
        id: 'full-cognitive-restructuring',
        name: 'Full Cognitive Restructuring',
        title: 'Full Cognitive Restructuring',
        description: 'The complete 7-column thought record with evidence weighing, distortion spotting, and reframe generation.',
        modalities: ['CBT'],
        modality: 'CBT',
        interactionType: 'thinking',
        interactionLabel: 'Thinking Exercise',
        timeMinutes: 18,
        duration: '18 min',
        tier: 'premium',
        evidenceBase: 'CBT (Beck, 1979)',
        placeholder: true,
      },
      {
        id: 'worry-postponement',
        name: 'Worry Postponement Protocol',
        title: 'Worry Postponement Protocol',
        description: "Schedule your worries for a specific time. Train your brain that worry has a place — and it's not right now.",
        modalities: ['CBT', 'Behavioral'],
        modality: 'CBT / Behavioral',
        interactionType: 'planning',
        interactionLabel: 'Planning Tool',
        timeMinutes: 15,
        duration: '15 min',
        tier: 'premium',
        evidenceBase: 'Borkovec (1983)',
        placeholder: true,
      },
      {
        id: 'values-based-action',
        name: 'Values-Based Action Plan',
        title: 'Values-Based Action Plan',
        description: "If anxiety weren't driving, what would you do? Identify the value being blocked and take one committed action.",
        modalities: ['ACT'],
        modality: 'ACT',
        interactionType: 'decision',
        interactionLabel: 'Decision Tool',
        timeMinutes: 15,
        duration: '15 min',
        tier: 'premium',
        evidenceBase: 'ACT (Hayes, 2004)',
        placeholder: true,
      },
    ],
  },
  'sad-low': {
    label: 'Sad / Low',
    emoji: '🌧',
    quick: [
      placeholder('self-compassion-pause', 'Self-Compassion Pause', 'A brief phrase practice for meeting sadness with kindness instead of pressure.', ['ACT'], 'thinking', 'Thinking Exercise', 2, 'free'),
      placeholder('tiny-pleasure-step', 'Tiny Pleasure Step', 'Choose one small sensory comfort that does not require you to feel better first.', ['Behavioral'], 'planning', 'Planning Tool', 2, 'free'),
      placeholder('sadness-body-soften', 'Sadness Body Soften', 'Notice where heaviness lives and soften around it with one gentle breath cycle.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('behavioral-activation-map', 'Behavioral Activation Map', 'Pick one low-friction action that can create a little contact with life again.', ['CBT', 'Behavioral'], 'planning', 'Planning Tool', 8),
      placeholder('kind-letter-lite', 'Kind Letter Lite', 'Write a short note to yourself in the tone you would use for a hurting friend.', ['ACT'], 'writing', 'Writing Exercise', 7),
      placeholder('mood-evidence-check', 'Mood Evidence Check', 'Separate what sadness says from what the whole evidence picture says.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
    ],
    deep: [
      placeholder('meaning-after-low-mood', 'Meaning After Low Mood', 'Explore what the sadness may be asking you to care for or reconnect with.', ['ACT'], 'writing', 'Writing Exercise', 18),
      placeholder('activity-ladder', 'Activity Ladder', 'Build a graded action plan for low-energy days without shaming yourself.', ['Behavioral'], 'planning', 'Planning Tool', 15),
      placeholder('balanced-thought-record', 'Balanced Thought Record', 'Work through a fuller CBT reframe for the thoughts that keep sadness looping.', ['CBT'], 'thinking', 'Thinking Exercise', 20),
    ],
  },
  angry: {
    label: 'Angry',
    emoji: '🔥',
    quick: [
      placeholder('heat-check', 'Heat Check', 'Name what anger is protecting before you choose what to do next.', ['DBT'], 'thinking', 'Thinking Exercise', 2, 'free'),
      placeholder('six-count-space', 'Six-Count Space', 'Use a short body pause to stop anger from choosing your response for you.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('boundary-sentence', 'Boundary Sentence', 'Draft one clean sentence that protects the boundary without escalating the fight.', ['CBT', 'DBT'], 'writing', 'Writing Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('opposite-action-anger', 'Opposite Action for Anger', 'Practice a DBT response when anger is valid but acting hot will cost you.', ['DBT'], 'decision', 'Decision Tool', 7),
      placeholder('anger-story-check', 'Anger Story Check', 'Find the assumption underneath the anger and test it before reacting.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
      placeholder('repair-or-space', 'Repair or Space', 'Decide whether this moment needs connection, a boundary, or a clean timeout.', ['DBT'], 'decision', 'Decision Tool', 6),
    ],
    deep: [
      placeholder('anger-boundary-audit', 'Anger Boundary Audit', 'Trace the crossed boundary and plan a grounded next conversation.', ['DBT', 'CBT'], 'planning', 'Planning Tool', 18),
      placeholder('values-under-anger', 'Values Under Anger', 'Identify the value anger is defending and choose an action that honors it.', ['ACT'], 'decision', 'Decision Tool', 15),
      placeholder('post-conflict-repair-plan', 'Post-Conflict Repair Plan', 'Build a repair script that owns your part without abandoning your needs.', ['CBT', 'DBT'], 'writing', 'Writing Exercise', 20),
    ],
  },
  overwhelmed: {
    label: 'Overwhelmed',
    emoji: '🌊',
    quick: [
      placeholder('one-tiny-step', 'One Tiny Step', 'Reduce the whole pile into one next action your nervous system can tolerate.', ['Behavioral'], 'planning', 'Planning Tool', 2, 'free'),
      placeholder('control-circle', 'Control Circle', 'Sort what is yours, what is not yours, and what can wait.', ['CBT'], 'decision', 'Decision Tool', 2, 'free'),
      placeholder('overwhelm-exhale', 'Overwhelm Exhale', 'Use a short exhale-led breath pattern to lower the immediate flood response.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('brain-dump-triage', 'Brain Dump Triage', 'Get the clutter out of your head and sort it into a humane order.', ['CBT', 'Behavioral'], 'writing', 'Writing Exercise', 8),
      placeholder('priority-sieve', 'Priority Sieve', 'Separate urgent, important, optional, and not-mine tasks.', ['Behavioral'], 'decision', 'Decision Tool', 7),
      placeholder('capacity-check', 'Capacity Check', 'Check your real capacity before you promise more than your body can carry.', ['ACT'], 'planning', 'Planning Tool', 6),
    ],
    deep: [
      placeholder('overwhelm-operating-plan', 'Overwhelm Operating Plan', 'Create a realistic plan for the next 24 hours with rest and boundaries included.', ['CBT', 'Behavioral'], 'planning', 'Planning Tool', 20),
      placeholder('boundary-reset', 'Boundary Reset', 'Identify the yeses that created overload and choose one boundary to repair.', ['DBT'], 'decision', 'Decision Tool', 18),
      placeholder('values-triage-session', 'Values Triage Session', 'Use values to decide what matters now and what can be released.', ['ACT'], 'decision', 'Decision Tool', 18),
    ],
  },
  'shame-guilt': {
    label: 'Shame / Guilt',
    emoji: '🎭',
    quick: [
      placeholder('name-shame', 'Name Shame', 'Spot the difference between “I did something” and “I am bad.”', ['CBT'], 'thinking', 'Thinking Exercise', 2, 'free'),
      placeholder('repair-or-release', 'Repair or Release', 'Decide whether this moment calls for repair, self-forgiveness, or both.', ['ACT'], 'decision', 'Decision Tool', 2, 'free'),
      placeholder('hand-on-heart-reset', 'Hand-on-Heart Reset', 'Use a brief self-compassion cue to soften the body’s shame response.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('guilt-action-map', 'Guilt Action Map', 'Turn useful guilt into one repair action and release the rest.', ['CBT', 'ACT'], 'planning', 'Planning Tool', 8),
      placeholder('self-judgment-reframe', 'Self-Judgment Reframe', 'Challenge the harsh conclusion and build a more accurate one.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
      placeholder('compassionate-accountability', 'Compassionate Accountability', 'Own what is yours without letting shame turn it into a life sentence.', ['ACT'], 'writing', 'Writing Exercise', 7),
    ],
    deep: [
      placeholder('shame-story-record', 'Shame Story Record', 'Map the origin, evidence, and alternative view for a shame-based belief.', ['CBT'], 'thinking', 'Thinking Exercise', 20),
      placeholder('repair-plan-session', 'Repair Plan Session', 'Create a specific, values-aligned repair plan if repair is actually needed.', ['ACT', 'DBT'], 'planning', 'Planning Tool', 18),
      placeholder('self-forgiveness-letter', 'Self-Forgiveness Letter', 'Write a structured letter that includes accountability, context, and care.', ['ACT'], 'writing', 'Writing Exercise', 20),
    ],
  },
  'grief-loss': {
    label: 'Grief / Loss',
    emoji: '🕊️',
    quick: [
      placeholder('grief-wave-anchor', 'Grief Wave Anchor', 'Let the wave move through without trying to make it disappear.', ['ACT'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('one-memory', 'One Memory', 'Hold one memory with tenderness for a moment, then return to now.', ['Psychoed'], 'writing', 'Writing Exercise', 2, 'free'),
      placeholder('grief-breath', 'Grief Breath', 'Use a soft breath pattern for the moments when loss takes your breath away.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('continuing-bond-note', 'Continuing Bond Note', 'Write a few lines that honor what remains connected.', ['ACT'], 'writing', 'Writing Exercise', 8),
      placeholder('what-i-miss', 'What I Miss', 'Name the specific ache so it feels less like an unnamed ocean.', ['Psychoed'], 'writing', 'Writing Exercise', 7),
      placeholder('grief-body-map', 'Grief Body Map', 'Notice where grief is sitting in the body and offer gentle support.', ['Somatic'], 'body', 'Body Exercise', 6),
    ],
    deep: [
      placeholder('carry-love-forward', 'Carry Love Forward', 'Explore how to carry what mattered without forcing closure.', ['ACT'], 'writing', 'Writing Exercise', 20),
      placeholder('ritual-design', 'Small Ritual Design', 'Create a simple ritual that gives grief a place to go.', ['Psychoed'], 'planning', 'Planning Tool', 18),
      placeholder('grief-meaning-session', 'Grief Meaning Session', 'Reflect on loss, love, and the next humane step in living with both.', ['ACT'], 'writing', 'Writing Exercise', 20),
    ],
  },
  'numb-disconnected': {
    label: 'Numb / Disconnected',
    emoji: '🧊',
    quick: [
      placeholder('texture-anchor', 'Texture Anchor', 'Use one real texture to gently bring sensation back online.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('temperature-check-in', 'Temperature Check-In', 'Notice warmth, coolness, and contact points without forcing emotion.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('one-true-sentence', 'One True Sentence', 'Write one sentence about what is happening right now, even if it is “I feel blank.”', ['ACT'], 'writing', 'Writing Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('gentle-body-scan', 'Gentle Body Scan', 'Reconnect with the body in low-pressure passes from head to toe.', ['Somatic'], 'body', 'Body Exercise', 8),
      placeholder('window-of-tolerance-check', 'Window of Tolerance Check', 'Understand numbness as shutdown and choose a gentle re-entry step.', ['Psychoed'], 'thinking', 'Thinking Exercise', 7),
      placeholder('sensory-menu', 'Sensory Menu', 'Build a small list of sensory cues that help you feel present without flooding.', ['Somatic'], 'planning', 'Planning Tool', 6),
    ],
    deep: [
      placeholder('shutdown-recovery-plan', 'Shutdown Recovery Plan', 'Create a staged plan for moving from freeze toward safe engagement.', ['Somatic', 'Polyvagal'], 'planning', 'Planning Tool', 18),
      placeholder('parts-of-numbness', 'Parts of Numbness', 'Write to the part of you that disconnected and ask what it protected.', ['ACT'], 'writing', 'Writing Exercise', 20),
      placeholder('values-reconnection', 'Values Reconnection', 'Use a values inventory to find one small sign of aliveness again.', ['ACT'], 'decision', 'Decision Tool', 18),
    ],
  },
  lonely: {
    label: 'Lonely',
    emoji: '🌑',
    quick: [
      placeholder('seen-by-self', 'Seen by Self', 'Name what you wish someone understood, then offer one honest response to yourself.', ['ACT'], 'writing', 'Writing Exercise', 2, 'free'),
      placeholder('connection-micro-step', 'Connection Micro-Step', 'Choose a tiny, low-risk bid for connection.', ['Behavioral'], 'planning', 'Planning Tool', 2, 'free'),
      placeholder('lonely-grounding', 'Lonely Grounding', 'Anchor in the room before the loneliness story expands.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('text-someone-script', 'Text Someone Script', 'Draft a simple message that asks for connection without overexplaining.', ['Behavioral'], 'writing', 'Writing Exercise', 7),
      placeholder('loneliness-story-check', 'Loneliness Story Check', 'Separate being alone right now from the story that you will always be alone.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
      placeholder('safe-people-map', 'Safe People Map', 'List who feels safe, who feels neutral, and who costs too much right now.', ['ACT'], 'planning', 'Planning Tool', 8),
    ],
    deep: [
      placeholder('connection-plan', 'Connection Plan', 'Build a values-aligned plan for regular connection that starts small.', ['ACT', 'Behavioral'], 'planning', 'Planning Tool', 20),
      placeholder('belonging-letter', 'Belonging Letter', 'Write a compassionate letter to the part of you that feels outside the circle.', ['ACT'], 'writing', 'Writing Exercise', 18),
      placeholder('social-energy-audit', 'Social Energy Audit', 'Identify which forms of connection nourish you and which drain you.', ['CBT'], 'decision', 'Decision Tool', 15),
    ],
  },
  'stressed-burned-out': {
    label: 'Stressed / Burned Out',
    emoji: '⏰',
    quick: [
      placeholder('pressure-release-breath', 'Pressure Release Breath', 'Use one minute of exhale-led breathing to downshift pressure.', ['Somatic'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('must-should-could', 'Must / Should / Could', 'Separate what truly must happen from the pile of shoulds.', ['CBT'], 'decision', 'Decision Tool', 2, 'free'),
      placeholder('rest-permission-slip', 'Rest Permission Slip', 'Write one sentence that gives your body permission to be human.', ['ACT'], 'writing', 'Writing Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('burnout-capacity-map', 'Burnout Capacity Map', 'Check the gap between demand and capacity, then choose one adjustment.', ['Behavioral'], 'planning', 'Planning Tool', 8),
      placeholder('stress-thought-record', 'Stress Thought Record', 'Test the high-pressure thought that says everything is urgent.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
      placeholder('energy-leak-audit', 'Energy Leak Audit', 'Find one energy leak you can plug this week.', ['Behavioral'], 'decision', 'Decision Tool', 7),
    ],
    deep: [
      placeholder('burnout-recovery-plan', 'Burnout Recovery Plan', 'Create a 7-day recovery plan that includes load reduction and restoration.', ['Behavioral', 'ACT'], 'planning', 'Planning Tool', 20),
      placeholder('values-boundary-session', 'Values Boundary Session', 'Choose one boundary that protects the work and life you actually value.', ['ACT'], 'decision', 'Decision Tool', 18),
      placeholder('stress-cycle-completion', 'Stress Cycle Completion', 'Pair psychoeducation with a body-based plan to complete the stress response.', ['Somatic', 'Psychoed'], 'body', 'Body Exercise', 18),
    ],
  },
  'scared-fearful': {
    label: 'Scared / Fearful',
    emoji: '🫣',
    quick: [
      placeholder('safety-or-alarm', 'Safety or Alarm?', 'Ask whether there is immediate danger or your alarm system is firing.', ['CBT'], 'decision', 'Decision Tool', 2, 'free'),
      placeholder('orienting-reset', 'Orienting Reset', 'Look around slowly and let your body register cues of safety.', ['Somatic', 'Polyvagal'], 'body', 'Body Exercise', 2, 'free'),
      placeholder('fear-fact-check', 'Fear Fact Check', 'Name the fear, then name one fact you can verify right now.', ['CBT'], 'thinking', 'Thinking Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('threat-likelihood-check', 'Threat Likelihood Check', 'Estimate the most likely outcome instead of the worst possible outcome.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
      placeholder('safety-plan-lite', 'Safety Plan Lite', 'If a real risk exists, choose the safest next step and one support person.', ['DBT'], 'planning', 'Planning Tool', 7),
      placeholder('body-safety-cues', 'Body Safety Cues', 'Use posture, breath, and orienting to signal safety to the nervous system.', ['Somatic'], 'body', 'Body Exercise', 6),
    ],
    deep: [
      placeholder('fear-ladder', 'Fear Ladder', 'Build a graded plan for facing avoidant fear without flooding yourself.', ['CBT', 'Behavioral'], 'planning', 'Planning Tool', 20),
      placeholder('values-through-fear', 'Values Through Fear', 'Identify what fear is blocking and choose one committed action.', ['ACT'], 'decision', 'Decision Tool', 18),
      placeholder('full-fear-record', 'Full Fear Record', 'Use evidence, likelihood, coping capacity, and values to reframe fear.', ['CBT'], 'thinking', 'Thinking Exercise', 20),
    ],
  },
  'stuck-lost': {
    label: 'Stuck / Lost',
    emoji: '🧭',
    quick: [
      placeholder('next-honest-step', 'Next Honest Step', 'Find the next step that is true, small, and available now.', ['ACT'], 'planning', 'Planning Tool', 2, 'free'),
      placeholder('two-door-choice', 'Two-Door Choice', 'Reduce a foggy decision to two possible doors and one experiment.', ['Behavioral'], 'decision', 'Decision Tool', 2, 'free'),
      placeholder('stuck-story-name', 'Stuck Story Name', 'Name the story that says nothing can move.', ['ACT'], 'thinking', 'Thinking Exercise', 2, 'free'),
    ],
    medium: [
      placeholder('decision-paralysis-reset', 'Decision Paralysis Reset', 'Clarify the decision, the fear, and the smallest reversible next move.', ['CBT', 'Behavioral'], 'decision', 'Decision Tool', 8),
      placeholder('values-compass-mini', 'Values Compass Mini', 'Use values to orient when certainty is unavailable.', ['ACT'], 'decision', 'Decision Tool', 7),
      placeholder('blocker-map', 'Blocker Map', 'Separate practical blockers, emotional blockers, and imagined blockers.', ['CBT'], 'thinking', 'Thinking Exercise', 8),
    ],
    deep: [
      placeholder('values-based-route-map', 'Values-Based Route Map', 'Build a plan from values, constraints, and one testable next action.', ['ACT'], 'planning', 'Planning Tool', 20),
      placeholder('lost-to-learning-plan', 'Lost-to-Learning Plan', 'Turn feeling lost into a low-risk learning experiment.', ['Behavioral'], 'planning', 'Planning Tool', 18),
      placeholder('full-blocker-reframe', 'Full Blocker Reframe', 'Use CBT to examine the stuck belief and generate alternative paths.', ['CBT'], 'thinking', 'Thinking Exercise', 20),
    ],
  },
  'self-destructive': {
    label: 'Self-Destructive',
    emoji: '🩹',
    crisis: true,
    quick: [
      placeholder('crisis-support-now', 'Crisis Support Now', 'Call or text 988, or text HOME to 741741, if you may hurt yourself or cannot stay safe.', ['Crisis Support'], 'social', 'Get Support', 1, 'free'),
      placeholder('safe-person-now', 'Safe Person Now', 'Choose one person you can be near or contact while the urge is high.', ['DBT'], 'social', 'Social Support', 2, 'free'),
      placeholder('means-distance-step', 'Means Distance Step', 'Create immediate distance from anything you could use to hurt yourself.', ['Behavioral'], 'planning', 'Planning Tool', 2, 'free'),
    ],
    medium: [
      placeholder('urge-surfing-crisis', 'Urge Surfing for Self-Harm Urges', 'Ride the urge minute by minute while you add support and reduce access to harm.', ['DBT'], 'body', 'Body Exercise', 8),
      placeholder('distress-tolerance-plan', 'Distress Tolerance Plan', 'Use short DBT steps to get through the next 10 minutes safely.', ['DBT'], 'planning', 'Planning Tool', 8),
      placeholder('reason-to-stay-list', 'Reason-to-Stay List', 'Name immediate anchors that help you stay through this moment.', ['ACT'], 'writing', 'Writing Exercise', 7),
    ],
    deep: [
      placeholder('safety-plan-session', 'Safety Plan Session', 'Draft a fuller safety plan with warning signs, supports, and emergency options.', ['DBT', 'Behavioral'], 'planning', 'Planning Tool', 20),
      placeholder('values-anchor-session', 'Values Anchor Session', 'Reconnect to one reason to stay and one action that protects it tonight.', ['ACT'], 'writing', 'Writing Exercise', 18),
      placeholder('post-crisis-next-steps', 'Post-Crisis Next Steps', 'Plan follow-up care, support contact, and practical safety after the peak passes.', ['Psychoed', 'Behavioral'], 'planning', 'Planning Tool', 20),
    ],
  },
};

export const INTERVENTION_ALIASES = {
  '54321-grounding': 'grounding-54321',
  'thought-defusion': 'name-the-story',
};

export function getInterventions(emotionId, tier = 'quick') {
  const emotion = INTERVENTIONS[emotionId];
  if (!emotion) return [];
  return emotion[tier] || [];
}

export function getAllInterventions() {
  return Object.entries(INTERVENTIONS).flatMap(([emotionId, emotion]) =>
    ['quick', 'medium', 'deep'].flatMap((tier) =>
      (emotion[tier] || []).map((intervention) => ({
        ...intervention,
        emotionId,
        emotionLabel: emotion.label,
        emotionEmoji: emotion.emoji,
        tier,
      }))
    )
  );
}

export function getInterventionById(interventionId) {
  const canonicalId = INTERVENTION_ALIASES[interventionId] || interventionId;
  return getAllInterventions().find((intervention) => intervention.id === canonicalId) || null;
}

export function hasInteractiveComponent(interventionId) {
  const intervention = getInterventionById(interventionId);
  return Boolean(intervention?.component);
}
