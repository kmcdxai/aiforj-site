import Link from 'next/link';
import SiteFooter from '../../components/SiteFooter';

export const metadata = {
  title: 'About AIForj',
  description: 'Self-guided wellness tools from Forj by Tredici. Learn what the tools offer and where their limits are.',
  alternates: {canonical:'https://aiforj.com/about/founder'},
  openGraph: {title:'About AIForj',description:'Self-guided wellness resources from Forj by Tredici.',url:'https://aiforj.com/about/founder',type:'website'},
};

export default function AboutForj() {
  return <><main style={{maxWidth:840,margin:'88px auto',padding:'0 24px',fontSize:17,lineHeight:1.85,color:'var(--text-primary)'}}>
    <Link href="/">Forj by Tredici</Link>
    <h1 style={{fontSize:'clamp(36px,6vw,60px)',lineHeight:1.2}}>A little space. A next step.</h1>
    <p>AIForj offers self-guided tools for pausing, reflecting, and choosing a practical next step. Start with a free guide or check-in, and use what fits your day.</p>
    <h2>Resources with clear limits.</h2><p>The tools are educational wellness resources. They do not provide diagnosis, therapy, medication advice, or emergency care. They are separate from Tredici’s future clinical practice.</p>
    <p>Guides reference their sources and describe limitations. No exercise is a guaranteed solution. You can stop at any time and seek support from a qualified professional when needed.</p>
    <h2>Your information, your choices.</h2><p>Some features keep information on your device; others depend on your browser or an external service. Read the <Link href="/what-we-collect">privacy explanation</Link> before choosing a feature.</p>
    <h2>Explore at your own pace.</h2><p><Link href="/start">Start a free check-in</Link>, browse the <Link href="/help">help guides</Link>, or read the <Link href="/editorial-policy">editorial policy</Link>.</p>
    <h2>Product support</h2><p>For billing or download questions, email <a href="mailto:hello@tredicihealth.com">hello@tredicihealth.com</a>. Please do not send health information. <Link href="/billing">Manage a subscription.</Link></p>
    <p>For urgent help in the U.S., call or text 988. Call 911 for an immediate emergency. This website is not a monitored crisis service.</p>
  </main><SiteFooter/></>;
}
