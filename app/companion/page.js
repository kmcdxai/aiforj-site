import ForjVoiceCompanion from '../components/ForjVoiceCompanion';

export const metadata = {
  title: 'Talk to Forj — Voice AI Therapeutic Companion | AIForj',
  description: 'Free voice-based AI therapeutic companion built by a Board Certified PMHNP. 15+ evidence-based modalities. 100% private — nothing ever leaves your device.',
  alternates: {
    canonical: 'https://aiforj.com/companion',
  },
};

export default function CompanionPage() {
  return <ForjVoiceCompanion />;
}
