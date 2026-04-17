import { FORJ_MODALITY_COUNT } from '../../lib/forjModalities';
import { buildContentPageMetadata } from '../../lib/pageMetadata';
import ForjVoiceCompanion from '../components/ForjVoiceCompanion';

export const metadata = buildContentPageMetadata({
  title: 'Talk to Forj — Voice AI Therapeutic Companion | AIForj',
  description: `Free voice-based AI therapeutic companion built by AIForj Team and clinically informed by a Licensed Healthcare Provider. ${FORJ_MODALITY_COUNT} evidence-based therapeutic modalities. Premium upgrades are available for deeper support.`,
  path: '/companion',
  socialTitle: 'Talk to Forj',
  socialDescription: 'Private voice-based emotional first aid with clinician-informed guidance, structured tools, and optional premium depth.',
  type: 'website',
});

export default function CompanionPage() {
  return <ForjVoiceCompanion />;
}
