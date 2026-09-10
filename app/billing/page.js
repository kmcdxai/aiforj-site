import Link from 'next/link';
import SiteFooter from '../components/SiteFooter';

export const metadata = {
  title: 'Manage Your Subscription & Billing | Tredici',
  description: 'Manage your Tredici subscription, cancel renewal, update payment details, and find invoices through Stripe.',
  alternates: { canonical: 'https://aiforj.com/billing' },
  robots: { index: false, follow: true },
};

export default function BillingPage() {
  return <><main style={{maxWidth:760,margin:'80px auto',padding:'0 24px',fontSize:16,lineHeight:1.8,color:'var(--text-primary)'}}>
    <Link href="/">Tredici wellness tools</Link>
    <h1 style={{fontFamily:"'Fraunces', serif",fontSize:'clamp(32px, 6vw, 48px)',lineHeight:1.2}}>Your subscription. Your choice.</h1>
    <p>Use Stripe’s secure customer portal to cancel renewal, update your payment method, or download invoices. Sign in with the email you used at checkout. Stripe emails you a secure login link.</p>
    <a className="btn-primary" href="https://billing.stripe.com/p/login/5kQ14p4za3gQa9j0sl8EM00" rel="noreferrer">Manage subscription in Stripe</a>
    <section style={{marginTop:40}}><h2>Premium trial and renewal</h2><p>Premium starts with a seven-day free trial, followed by $9.99 USD per month plus any applicable taxes. The subscription renews automatically until canceled. Review your exact trial end and next billing date in Stripe.</p><p>Cancel before the trial ends to avoid the first subscription charge. After a paid period begins, cancellation stops the next renewal and normally leaves access available until the period ends. Stripe shows the effective cancellation date before you confirm. Deleting browser data or uninstalling a shortcut does not cancel billing.</p></section>
    <section><h2>The wellness app has retired</h2><p>New subscriptions and other purchases are closed. This page remains available for help with any previous purchase. The current <a href="https://tredicihealth.com/wellness-tools">conversation brief tool at Tredici</a> is free.</p></section><section><h2>Previous plans</h2><p>The same portal manages subscriptions purchased through Tredici, including existing family, clinician, or organization plans. The plan, price, and renewal dates shown in your checkout and Stripe account apply. One-time gifts do not automatically renew.</p></section>
    <section><h2>Need purchase help?</h2><p>Email <a href="mailto:hello@tredicihealth.com">hello@tredicihealth.com</a> with your receipt reference and checkout email. Do not send card numbers, passwords, private activation links, or health information.</p><p>If a Tredici subscription or gift is not right for you, contact us within 14 days of a charge for a refund. This does not limit mandatory consumer rights. Tredici’s Payhip downloads use their <a href="https://tredicihealth.com/purchase-support">separate purchase support page</a>.</p></section>
    <section><h2>Access on another device</h2><p>Use the private activation link saved after your original checkout. If you no longer have it, contact purchase support. Keep it private: it provides access to your purchased features. Do not buy a second subscription just to restore access.</p><p>Tredici provides self-guided wellness tools. Purchases do not include clinical care or establish a clinician-patient relationship. <Link href="/what-we-collect">Read the privacy explanation.</Link></p></section>
  </main><SiteFooter/></>;
}
