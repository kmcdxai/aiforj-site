import ForjVoiceCompanion from '../components/ForjVoiceCompanion';

export const metadata = {
  title: 'Talk to Forj — Voice AI Therapeutic Companion | AIForj',
  description: 'Free voice-based AI therapeutic companion built by AIForj Team and clinically informed by a Licensed Healthcare Provider. 15+ evidence-based modalities. Premium upgrades are available for deeper support.',
  alternates: {
    canonical: 'https://aiforj.com/companion',
  },
};

export default function CompanionPage() {
  return <ForjVoiceCompanion />;
}
