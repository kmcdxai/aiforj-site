"use client";

import dynamic from 'next/dynamic';

const SensoryGrounding = dynamic(() => import('./SensoryGrounding'), { ssr: false });
const PhysiologicalSigh = dynamic(() => import('./PhysiologicalSigh'), { ssr: false });
const NameTheStory = dynamic(() => import('./NameTheStory'), { ssr: false });

// Maps technique slugs to custom interactive intervention components.
// If a slug is listed here, InterventionClient renders the custom component
// instead of the generic TechniqueClient step-based renderer.
export const interventionComponents = {
  '54321-grounding': SensoryGrounding,
  'physiological-sigh': PhysiologicalSigh,
  'thought-defusion': NameTheStory,
  // Aliases for direct linking
  'grounding-54321': SensoryGrounding,
  'name-the-story': NameTheStory,
};
