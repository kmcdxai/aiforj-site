"use client";

import { useRouter } from 'next/navigation';
import InterventionWrapper from '../../../components/measurement/InterventionWrapper';
import TechniqueClient from '../../techniques/[slug]/TechniqueClient';

export default function InterventionClient({ technique }) {
  const router = useRouter();

  const handleSendCalm = () => {
    // Navigate to send page with the technique context
    router.push(`/send?technique=${technique.slug}`);
  };

  return (
    <InterventionWrapper
      emotion="anxiety" // This could be passed from the start flow
      interventionName={technique.title}
      onSendCalm={handleSendCalm}
    >
      <TechniqueClient technique={technique} related={[]} />
    </InterventionWrapper>
  );
}
