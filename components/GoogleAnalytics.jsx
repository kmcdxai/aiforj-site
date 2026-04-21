import Script from "next/script";

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-2VSX5RJH0J";

export default function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
            var debugMode = new URLSearchParams(window.location.search).get('debug_mode') === '1';
            window.gtag('js', new Date());
            window.gtag('config', '${measurementId}', debugMode ? { debug_mode: true } : {});
          `,
        }}
      />
    </>
  );
}
