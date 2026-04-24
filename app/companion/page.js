import { FORJ_MODALITY_COUNT } from '../../lib/forjModalities';
import { buildContentPageMetadata } from '../../lib/pageMetadata';
import ForjVoiceCompanion from '../components/ForjVoiceCompanion';

export const metadata = buildContentPageMetadata({
  title: 'Talk to Forj — Voice AI Therapeutic Companion | AIForj',
  description: `Free voice/text wellness companion for self-guided emotional first aid. Clinician-informed, local-first where supported, and not therapy, diagnosis, medication advice, or crisis care. ${FORJ_MODALITY_COUNT} evidence-framed modalities.`,
  path: '/companion',
  socialTitle: 'Talk to Forj',
  socialDescription: 'Private voice-based emotional first aid with clinician-informed guidance, structured tools, and optional premium depth.',
  type: 'website',
});

export default function CompanionPage() {
  return <ForjVoiceCompanion />;
}
