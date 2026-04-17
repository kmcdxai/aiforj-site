import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import WhenToSeekHelpCard from "../components/WhenToSeekHelpCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Help Guides for Real-Life Emotional First Aid | AIForj",
  description:
    "Browse private, evidence-informed help guides for panic, sleep, burnout, grief, comparison, imposter syndrome, perfectionism, and more.",
  path: "/help",
  socialTitle: "Help Guides for Real-Life Emotional First Aid",
  socialDescription:
    "Private, evidence-informed help guides for the moments people actually search for help.",
  type: "website",
});

const sections = [
  {
    title: "Sleep and morning anxiety",
    description:
      "For the vulnerable edges of the day when your nervous system feels loudest.",
    guides: [
      {
        href: "/help/cant-sleep",
        title: "Can't Sleep?",
        summary: "Quiet racing thoughts and help your body move toward rest.",
        tag: "Sleep",
      },
      {
        href: "/3am-spiral",
        title: "3AM Spiral",
        summary: "A deeper guided protocol for the middle-of-the-night loop.",
        tag: "Nighttime protocol",
      },
      {
        href: "/help/morning-dread",
        title: "Morning Dread",
        summary: "Handle waking anxiety before it sets the tone for the day.",
        tag: "Morning anxiety",
      },
    ],
  },
  {
    title: "Work, burnout, and pressure",
    description:
      "For the kind of stress that shows up as dread, overload, self-doubt, or impossible standards.",
    guides: [
      {
        href: "/help/anxiety-at-work",
        title: "Anxiety at Work",
        summary: "Short, discreet resets you can use without leaving your desk.",
        tag: "Work stress",
      },
      {
        href: "/help/burnout-recovery",
        title: "Burnout Recovery",
        summary: "Begin rebuilding energy, boundaries, and motivation.",
        tag: "Burnout",
      },
      {
        href: "/help/imposter-syndrome",
        title: "Imposter Syndrome",
        summary: "Challenge the fraud story with a fairer evidence review.",
        tag: "Self-doubt",
      },
      {
        href: "/help/perfectionism",
        title: "Perfectionism",
        summary: "Trade impossible standards for something more workable.",
        tag: "Pressure",
      },
    ],
  },
  {
    title: "Comparison, panic, and relationship strain",
    description:
      "For the spirals that hit after scrolling, conflict, or a sudden surge of fear.",
    guides: [
      {
        href: "/help/comparison-trap",
        title: "Comparison Trap",
        summary: "Break the social media spiral before it turns into shame.",
        tag: "Comparison",
      },
      {
        href: "/help/panic-attack",
        title: "Panic Attack Help",
        summary: "Use your body first to turn down the alarm response.",
        tag: "Acute distress",
      },
      {
        href: "/help/after-argument",
        title: "After an Argument",
        summary: "Calm down first, then decide how you want to respond.",
        tag: "Conflict",
      },
    ],
  },
  {
    title: "Grief, loneliness, and self-worth",
    description:
      "For the quieter pain that still changes how your whole day feels.",
    guides: [
      {
        href: "/help/grief",
        title: "Grief Wave Support",
        summary: "Ride the next wave of grief without rushing yourself through it.",
        tag: "Grief",
      },
      {
        href: "/help/lonely",
        title: "Feeling Lonely",
        summary: "Ease the sting of loneliness and choose a next connection step.",
        tag: "Loneliness",
      },
      {
        href: "/help/self-worth",
        title: "Rebuild Self-Worth",
        summary: "Start loosening shame and rebuild self-respect with small steps.",
        tag: "Self-worth",
      },
      {
        href: "/help/overthinking",
        title: "Overthinking Spiral",
        summary: "Interrupt rumination and get your mind unstuck again.",
        tag: "Rumination",
      },
    ],
  },
];

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "Help Guides for Real-Life Emotional First Aid",
    description: metadata.description,
    url: "https://aiforj.com/help",
    section: "Help library",
    about: "Emotional first-aid help guides",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Help", item: "https://aiforj.com/help" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 1040, margin: "84px auto 40px", padding: "0 20px" }}>
        <article>
          <p
            style={{
              fontSize: 12,
              letterSpacing: 2.2,
              textTransform: "uppercase",
              color: "var(--accent-sage)",
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Help Guides
          </p>

          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "clamp(30px, 5vw, 46px)",
              lineHeight: 1.12,
              margin: "0 0 16px",
              color: "var(--text-primary)",
              maxWidth: 760,
            }}
          >
            Real-life emotional first aid for the moments people actually search for help
          </h1>

          <p
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "var(--text-secondary)",
              maxWidth: 740,
              margin: "0 0 28px",
            }}
          >
            These guides are built for the exact problems that tend to flare up at 3am, before work, after conflict, during comparison spirals, and in the middle of burnout. Each page explains what is happening, points you toward one primary interactive tool, and links the next useful step.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: 28,
            }}
          >
            {[
              { label: "Need a fast match?", href: "/start" },
              { label: "Prefer to browse techniques?", href: "/techniques" },
              { label: "Want guided support?", href: "/companion" },
              { label: "Need a human provider?", href: "/find-help" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: "16px 18px",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.58)",
                  border: "1px solid rgba(45,42,38,0.08)",
                  textDecoration: "none",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {item.label} →
              </Link>
            ))}
          </div>

          <EditorialReviewCard kind="Help library" />
          <WhenToSeekHelpCard />

          <div style={{ display: "grid", gap: 28 }}>
            {sections.map((section) => (
              <section key={section.title}>
                <h2
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontSize: 28,
                    margin: "0 0 10px",
                    color: "var(--text-primary)",
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    margin: "0 0 16px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.75,
                    maxWidth: 700,
                  }}
                >
                  {section.description}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
                    gap: 16,
                  }}
                >
                  {section.guides.map((guide) => (
                    <Link
                      key={guide.href}
                      href={guide.href}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                        padding: "20px 18px",
                        borderRadius: 18,
                        background: "rgba(255,255,255,0.58)",
                        border: "1px solid rgba(45,42,38,0.08)",
                        textDecoration: "none",
                        boxShadow: "var(--shadow-sm)",
                      }}
                    >
                      <span
                        style={{
                          alignSelf: "flex-start",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: 0.9,
                          textTransform: "uppercase",
                          color: "var(--accent-sage)",
                          background: "rgba(125,155,130,0.12)",
                          borderRadius: 999,
                          padding: "5px 10px",
                        }}
                      >
                        {guide.tag}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontFamily: "'Fraunces', serif",
                          fontSize: 22,
                          color: "var(--text-primary)",
                          lineHeight: 1.25,
                        }}
                      >
                        {guide.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          color: "var(--text-secondary)",
                          lineHeight: 1.65,
                          flex: 1,
                        }}
                      >
                        {guide.summary}
                      </p>
                      <span
                        style={{
                          color: "var(--interactive)",
                          fontWeight: 600,
                        }}
                      >
                        Open guide →
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
