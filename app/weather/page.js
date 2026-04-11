import WeatherClient from './WeatherClient';

export const metadata = {
  title: 'Your Emotional Weather Report — Free Daily Mental Health Check-In',
  description: 'Get a beautiful daily snapshot of your emotional state. Track patterns, share your weather, and discover which techniques help most. Free, private, built by AIForj Team, Licensed Healthcare Provider.',
};

export default function Page() {
  return (
    <main className="container" style={{ paddingTop: 80 }}>
      <WeatherClient />
    </main>
  );
}
