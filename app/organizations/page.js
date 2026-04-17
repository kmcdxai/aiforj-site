import Link from "next/link";
import BiophilicBackground from "../components/BiophilicBackground";
import EditorialReviewCard from "../components/EditorialReviewCard";
import SiteFooter from "../components/SiteFooter";
import SOS from "../components/SOS";
import OrganizationInterestCard from "../../components/monetization/OrganizationInterestCard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../lib/pageMetadata";

export const metadata = buildContentPageMetadata({
  title: "Privacy-First Wellness Toolkit for Organizations | AIForj",
  description:
    "A privacy-first emotional first-aid toolkit for organizations with aggregate-only learning and no individual dashboards by default.",
  path: "/organizations",
  socialTitle: "AIForj for Organizations",
  socialDescription:
    "Roll out emotional first aid with aggregate-only learning, not employee surveillance.",
  type: "article",
});

export default function Page() {
  const articleSchema = buildArticleSchema({
    title: "AIForj privacy-first wellness toolkit for organizations",
    description: metadata.description,
    url: "https://aiforj.com/organizations",
    section: "Organization toolkit",
    about: "AIForj privacy-first wellness toolkit",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Organizations", item: "https://aiforj.com/organizations" },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 960, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 28 }}>
          <OrganizationInterestCard />

          <EditorialReviewCard kind="Organization toolkit" />

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              {
                title: "What teams get",
                body: "Fast emotional first-aid tools, help guides, and companion surfaces that people can use immediately without waiting for benefits enrollment or an account migration.",
              },
              {
                title: "What leaders see",
                body: "Aggregate-only learning and rollout insight. The goal is to understand adoption and usefulness patterns, not inspect an individual person’s emotional life.",
              },
              {
                title: "What stays off limits",
                body: "No default individual dashboards, no sale of employee mental-health data, and no ad-tech layer attached to moments of vulnerability.",
              },
            ].map((item) => (
              <section
                key={item.title}
                style={{
                  padding: "20px 18px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.58)",
                  border: "1px solid rgba(45,42,38,0.08)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 22,
                    color: "var(--text-primary)",
                  }}
                >
                  {item.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    lineHeight: 1.75,
                    color: "var(--text-secondary)",
                  }}
                >
                  {item.body}
                </p>
              </section>
            ))}
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.58)",
              border: "1px solid rgba(45,42,38,0.08)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                color: "var(--text-primary)",
              }}
            >
              See the aggregate-only reporting model
            </h2>
            <p style={{ margin: "0 0 14px", lineHeight: 1.8, color: "var(--text-secondary)" }}>
              If you need something more concrete than a principles page, we built
              a preview of the exact style of org reporting AIForj is designed to
              support: trends, completion patterns, and shift buckets in aggregate,
              without individual mental-health dashboards.
            </p>
            <Link
              href="/organizations/preview"
              className="btn-primary"
              style={{ textDecoration: "none" }}
            >
              Open aggregate-only preview →
            </Link>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 18,
              background: "rgba(107,155,158,0.08)",
              border: "1px solid rgba(107,155,158,0.16)",
            }}
          >
            <h2
              style={{
                margin: "0 0 10px",
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                color: "var(--text-primary)",
              }}
            >
              Designed for trust-sensitive rollouts
            </h2>
            <p
              style={{
                margin: "0 0 10px",
                lineHeight: 1.8,
                color: "var(--text-secondary)",
              }}
            >
              This is for organizations that want to offer something useful
              without recreating the category mistakes people already distrust.
              The toolkit is designed around privacy-first defaults, opt-in
              aggregate learning, and scope boundaries that remain narrow on purpose.
            </p>
            <p style={{ margin: 0, lineHeight: 1.8, color: "var(--text-secondary)" }}>
              If you need a private-practice version instead, see the{" "}
              <Link
                href="/clinician-pack"
                style={{ color: "var(--interactive)", textDecoration: "underline" }}
              >
                clinician pack
              </Link>
              . For the public privacy promise behind both, read{" "}
              <Link
                href="/what-we-collect"
                style={{ color: "var(--interactive)", textDecoration: "underline" }}
              >
                What AIForj collects
              </Link>
              .
            </p>
          </section>

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
