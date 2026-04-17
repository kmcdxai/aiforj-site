import { buildContentPageMetadata } from "../../lib/pageMetadata";
import WeatherClient from './WeatherClient';

export const metadata = buildContentPageMetadata({
  title: 'Your Emotional Weather Report — Free Daily Mental Health Check-In',
  description:
    'Get a beautiful daily snapshot of your emotional state. Track patterns, share your weather, and discover which techniques help most. Free and private.',
  path: '/weather',
  socialTitle: 'Your Emotional Weather Report',
  socialDescription:
    'A daily emotional check-in with private tracking, shareable weather, and matched technique suggestions.',
  type: 'website',
});

export default function Page() {
  return (
    <main className="container" style={{ paddingTop: 80 }}>
      <WeatherClient />
    </main>
  );
}
