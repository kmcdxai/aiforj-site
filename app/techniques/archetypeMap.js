// Map technique slugs to recommended archetype pages
export const TECHNIQUE_TO_ARCHETYPE = {
  'box-breathing': 'sentinel',
  'physiological-sigh': 'phoenix',
  '54321-grounding': 'sentinel',
  'thought-defusion': 'architect',
  'cognitive-restructuring': 'architect',
  'progressive-muscle-relaxation': 'phoenix',
  'body-scan': 'ghost',
  'tipp-skill': 'storm',
  'behavioral-activation': 'phoenix',
  'cognitive-distortions': 'architect',
  'self-compassion-break': 'empath',
  'radical-acceptance': 'empath',
  'vagal-toning': 'sentinel',
  'worry-time': 'architect',
  'values-clarification': 'phoenix',
  // fallback mapping for other techniques will default to 'sentinel'
};

export function getArchetypeForTechnique(slug) {
  return TECHNIQUE_TO_ARCHETYPE[slug] || 'sentinel';
}
