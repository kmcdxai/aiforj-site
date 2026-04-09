/**
 * Intervention Component Registry
 * Maps component keys to lazy-loadable React components
 */
import dynamic from "next/dynamic";

const REGISTRY = {
  PhysiologicalSigh: dynamic(() => import("./PhysiologicalSigh"), { ssr: false }),
  SensoryGrounding: dynamic(() => import("./SensoryGrounding"), { ssr: false }),
  NameTheStory: dynamic(() => import("./NameTheStory"), { ssr: false }),
};

/**
 * Get an interactive intervention component by key
 * Returns null if no interactive component exists for that key
 */
export function getInterventionComponent(componentKey) {
  return REGISTRY[componentKey] || null;
}

export default REGISTRY;
