import { buildContentPageMetadata } from '../../lib/pageMetadata';
import Tredici from '../components/Tredici';

export const metadata = buildContentPageMetadata({
  title: 'Guided Emotional First-Aid Tools | Tredici',
  description:
    'Browse Tredici guided tools, matched interventions, and emotional first-aid exercises for anxiety, overwhelm, grief, burnout, and more.',
  path: '/tools',
  socialTitle: 'Guided Emotional First-Aid Tools',
  socialDescription:
    'Clinician-informed tools and matched interventions for anxiety, overwhelm, grief, burnout, and more.',
  type: 'website',
});

export default function ToolsPage() {
  return <Tredici />;
}
