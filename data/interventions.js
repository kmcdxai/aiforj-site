/**
 * AIForj Intervention Data
 * Maps all 12 emotions to tiered interventions (quick/medium/deep)
 * Each intervention references a component slug for the interactive version
 */

export const INTERVENTIONS = {
  anxious: {
    label: 'Anxious',
    emoji: '⚡',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Double-inhale through the nose, long exhale through the mouth. Resets your autonomic nervous system in real time.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Anchor your senses in the present moment. Name 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Defuse from anxious thoughts by naming them as stories your mind tells, not facts you must obey.', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Progressive attention through each body region, noticing tension without trying to fix it.' },
      { id: 'thought-record', title: 'Thought Record', duration: '5 min', modality: 'CBT', description: 'Capture the anxious thought, examine evidence for and against, and reframe with a balanced perspective.' },
      { id: 'worry-time', title: 'Scheduled Worry', duration: '5 min', modality: 'CBT', description: 'Contain anxiety by giving it a dedicated window. Write worries down, then close the list until tomorrow.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Reconnect with what matters most to you. Anxiety often signals something you care about — follow that thread.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Systematic tension-and-release through major muscle groups to discharge stored anxiety.' },
      { id: 'cognitive-restructuring', title: 'Cognitive Restructuring', duration: '10 min', modality: 'CBT', description: 'Identify cognitive distortions fueling anxiety and build alternative, evidence-based interpretations.' },
    ],
  },
  overwhelmed: {
    label: 'Overwhelmed',
    emoji: '🌊',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'A quick nervous system reset when everything feels like too much.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Come back to the present and stop the spiral of overwhelm.', component: 'SensoryGrounding' },
      { id: 'one-tiny-step', title: 'One Tiny Step', duration: '2 min', modality: 'Behavioral', description: 'Pick the single smallest action you can take right now. Momentum follows motion.' },
    ],
    medium: [
      { id: 'brain-dump', title: 'Brain Dump', duration: '5 min', modality: 'CBT', description: 'Get everything out of your head and onto paper. Seeing it written reduces the felt volume.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Slow down and reconnect with your body when your mind is racing.' },
      { id: 'priority-triage', title: 'Priority Triage', duration: '5 min', modality: 'Behavioral', description: 'Sort your list into must-do-today, can-wait, and not-mine. Permission to drop the rest.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'When everything demands attention, your values reveal what actually matters.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Release the physical tension that overwhelm deposits in your body.' },
      { id: 'boundary-audit', title: 'Boundary Audit', duration: '10 min', modality: 'DBT', description: 'Examine where you are over-functioning. Identify one boundary you can set this week.' },
    ],
  },
  stressed: {
    label: 'Stressed',
    emoji: '⏰',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Activate your parasympathetic nervous system in under two minutes.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Interrupt the stress loop by anchoring to your senses.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Notice the pressure narrative your mind is running and step back from it.', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'thought-record', title: 'Thought Record', duration: '5 min', modality: 'CBT', description: 'Capture the stress thought, test it against evidence, and find a more balanced view.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Notice where stress lives in your body and breathe into those areas.' },
      { id: 'priority-triage', title: 'Priority Triage', duration: '5 min', modality: 'Behavioral', description: 'Clarify what is urgent vs. important. Stress thrives on false urgency.' },
    ],
    deep: [
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Systematically release physical tension from head to toe.' },
      { id: 'cognitive-restructuring', title: 'Cognitive Restructuring', duration: '10 min', modality: 'CBT', description: 'Identify and reframe the cognitive distortions amplifying your stress.' },
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Reconnect with your deeper values to put stress in perspective.' },
    ],
  },
  sad: {
    label: 'Sad',
    emoji: '🌧',
    quick: [
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Gently bring yourself back to the present when sadness pulls you inward.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Notice the sad narrative without merging with it. You are not your sadness.', component: 'NameTheStory' },
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'A gentle breath pattern that soothes without forcing you to feel differently.', component: 'PhysiologicalSigh' },
    ],
    medium: [
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Write yourself the kind words you would offer a friend in pain.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Notice where sadness lives in your body and hold it with care.' },
      { id: 'behavioral-activation', title: 'Behavioral Activation', duration: '5 min', modality: 'Behavioral', description: 'Choose one small, kind action — a walk, a warm drink, a song you love.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Sadness often points to something you care about deeply. Explore that connection.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Release held tension and allow your body to soften.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Structured prompts to process and express your sadness safely.' },
    ],
  },
  angry: {
    label: 'Angry',
    emoji: '🔥',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Cool the nervous system before the heat takes over.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Anchor to your senses and interrupt the anger escalation.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Notice the anger story: "My mind is telling me the story that..."', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'opposite-action', title: 'Opposite Action', duration: '5 min', modality: 'DBT', description: 'When anger says attack, choose the opposite. Speak softly, approach gently.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Locate the anger in your body and breathe into it without acting on it.' },
      { id: 'thought-record', title: 'Thought Record', duration: '5 min', modality: 'CBT', description: 'Examine the thought behind the anger. Is it the full story?' },
    ],
    deep: [
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Discharge anger from your body through systematic tension and release.' },
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'What value is being violated? Anger often protects something important.' },
      { id: 'boundary-audit', title: 'Boundary Audit', duration: '10 min', modality: 'DBT', description: 'Anger signals a boundary was crossed. Identify it and plan a response.' },
    ],
  },
  lonely: {
    label: 'Lonely',
    emoji: '🌑',
    quick: [
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Ground yourself in the present before the isolation spiral deepens.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Notice if loneliness is telling you a story about being fundamentally alone.', component: 'NameTheStory' },
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Soothe your nervous system — isolation activates threat detection.', component: 'PhysiologicalSigh' },
    ],
    medium: [
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Write to yourself as a friend who sees you and cares.' },
      { id: 'behavioral-activation', title: 'Connection Step', duration: '5 min', modality: 'Behavioral', description: 'Identify one person and one micro-action: a text, a call, a plan to meet.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Reconnect with your own body as a first step toward reconnecting with others.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Explore what connection means to you and what small steps honor that value.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Process loneliness through structured writing prompts.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Release the tension that isolation builds in your body.' },
    ],
  },
  numb: {
    label: 'Numb',
    emoji: '🧊',
    quick: [
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Bring your senses back online gently. Numbness is your system on pause.', component: 'SensoryGrounding' },
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'A gentle breath pattern to wake your nervous system without overwhelming it.', component: 'PhysiologicalSigh' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Even numbness has a story. Notice what your mind says about feeling nothing.', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Slowly reconnect with physical sensation, area by area.' },
      { id: 'behavioral-activation', title: 'Sensory Activation', duration: '5 min', modality: 'Behavioral', description: 'Hold ice, splash cold water, smell something strong — gentle sensory wake-ups.' },
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Write to the part of you that shut down. It was protecting you.' },
    ],
    deep: [
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Re-engage your body through deliberate tension and release.' },
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Reconnect with what matters. Numbness often follows caring too much.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Structured prompts to gently explore what lies beneath the numbness.' },
    ],
  },
  grief: {
    label: 'Grief',
    emoji: '🕊️',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'A gentle breath when grief takes your breath away.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Come back to the present moment when grief pulls you under.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Honor the grief by naming it. "I am having the feeling of deep loss."', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Write to yourself with the tenderness grief deserves.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Notice where grief lives in your body and hold it gently.' },
      { id: 'memorial-moment', title: 'Memorial Moment', duration: '5 min', modality: 'Psychoed', description: 'Dedicate a few minutes to what you are grieving. Allow it without fixing it.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Grief reflects love. Explore how to carry that love forward.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Structured prompts for processing loss at your own pace.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Release the physical weight grief deposits in your body.' },
    ],
  },
  unmotivated: {
    label: 'Unmotivated',
    emoji: '🪫',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'A gentle activation to shift your nervous system from freeze to ready.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Wake up your senses and connect with the present moment.', component: 'SensoryGrounding' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Notice if "I can\'t" is a story your mind tells, not a fact about you.', component: 'NameTheStory' },
    ],
    medium: [
      { id: 'behavioral-activation', title: 'Behavioral Activation', duration: '5 min', modality: 'Behavioral', description: 'Pick the tiniest possible action. Motivation follows movement, not the other way around.' },
      { id: 'values-compass-mini', title: 'Quick Values Check', duration: '5 min', modality: 'ACT', description: 'Reconnect with why this matters. Purpose is a stronger engine than willpower.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Check if exhaustion or tension is masquerading as lack of motivation.' },
    ],
    deep: [
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Deep dive into your values to find intrinsic reasons to act.' },
      { id: 'progressive-relaxation', title: 'Progressive Muscle Relaxation', duration: '12 min', modality: 'Somatic', description: 'Sometimes the body needs rest before it can move again.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Explore what is underneath the lack of motivation.' },
    ],
  },
  relationship: {
    label: 'Relationship',
    emoji: '💔',
    quick: [
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Calm your system before engaging with relationship pain.', component: 'PhysiologicalSigh' },
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: 'Separate the narrative from the relationship reality. Stories escalate; facts clarify.', component: 'NameTheStory' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Ground yourself before making decisions from a reactive place.', component: 'SensoryGrounding' },
    ],
    medium: [
      { id: 'thought-record', title: 'Thought Record', duration: '5 min', modality: 'CBT', description: 'Examine the thought driving the relationship pain. Is there another perspective?' },
      { id: 'opposite-action', title: 'Opposite Action', duration: '5 min', modality: 'DBT', description: 'When hurt says withdraw, consider reaching out with honesty instead.' },
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Hold compassion for yourself in the middle of relationship difficulty.' },
    ],
    deep: [
      { id: 'boundary-audit', title: 'Boundary Audit', duration: '10 min', modality: 'DBT', description: 'Identify which boundaries need setting, restoring, or communicating.' },
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'What do you value in relationships? Let that guide your response.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Process the relationship pain through structured reflection.' },
    ],
  },
  'self-worth': {
    label: 'Self-Worth',
    emoji: '🎭',
    quick: [
      { id: 'name-the-story', title: 'Name the Story', duration: '2 min', modality: 'ACT', description: '"I\'m not enough" is a story, not a verdict. Name it and step back.', component: 'NameTheStory' },
      { id: 'physiological-sigh', title: 'Physiological Sigh', duration: '90 sec', modality: 'Somatic', description: 'Calm the shame response in your nervous system.', component: 'PhysiologicalSigh' },
      { id: '54321-grounding', title: '5-4-3-2-1 Grounding', duration: '2 min', modality: 'Somatic', description: 'Come back to the present instead of spiraling into self-judgment.', component: 'SensoryGrounding' },
    ],
    medium: [
      { id: 'thought-record', title: 'Thought Record', duration: '5 min', modality: 'CBT', description: 'Capture the self-critical thought and test it against real evidence.' },
      { id: 'self-compassion-letter', title: 'Self-Compassion Letter', duration: '5 min', modality: 'ACT', description: 'Write to yourself as you would to someone you deeply care about.' },
      { id: 'body-scan', title: 'Body Scan', duration: '5 min', modality: 'Somatic', description: 'Notice where shame lives in your body and breathe into it.' },
    ],
    deep: [
      { id: 'cognitive-restructuring', title: 'Cognitive Restructuring', duration: '10 min', modality: 'CBT', description: 'Dismantle the core beliefs driving low self-worth and build balanced alternatives.' },
      { id: 'values-compass', title: 'Values Compass', duration: '10 min', modality: 'ACT', description: 'Your worth is not performance. Reconnect with what matters beyond achievement.' },
      { id: 'journaling-prompt', title: 'Guided Journaling', duration: '10 min', modality: 'Psychoed', description: 'Explore the origins of your self-worth story and write a new chapter.' },
    ],
  },
  'self-destructive': {
    label: 'Self-Destructive',
    emoji: '🩹',
    crisis: true,
    quick: [
      { id: 'crisis-988', title: 'Call or Text 988', duration: 'Now', modality: 'Crisis', description: 'You deserve immediate help from a real person. Call or text 988 now.' },
    ],
    medium: [],
    deep: [],
  },
};

/**
 * Get interventions for an emotion at a given tier
 */
export function getInterventions(emotionId, tier = 'quick') {
  const emotion = INTERVENTIONS[emotionId];
  if (!emotion) return [];
  return emotion[tier] || [];
}

/**
 * Get a specific intervention by its ID
 */
export function getInterventionById(interventionId) {
  for (const emotion of Object.values(INTERVENTIONS)) {
    for (const tier of ['quick', 'medium', 'deep']) {
      const found = (emotion[tier] || []).find((i) => i.id === interventionId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Check if an intervention has an interactive component
 */
export function hasInteractiveComponent(interventionId) {
  const intervention = getInterventionById(interventionId);
  return intervention?.component != null;
}
