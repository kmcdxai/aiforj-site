import Link from "next/link";
import BiophilicBackground from "../../components/BiophilicBackground";
import EditorialReviewCard from "../../components/EditorialReviewCard";
import SiteFooter from "../../components/SiteFooter";
import SOS from "../../components/SOS";
import AdminGrowthDashboard from "../../../components/metrics/AdminGrowthDashboard";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
} from "../../../lib/contentSchemas";
import { buildContentPageMetadata } from "../../../lib/pageMetadata";
import { getOrganizationReportingSnapshot } from "../../../lib/organizationReporting";

export const metadata = buildContentPageMetadata({
  title: "Aggregate-Only Reporting for Organizations | AIForj",
  description:
    "See the live aggregate-only reporting model AIForj offers organizations, without individual mental-health dashboards.",
  path: "/organizations/reporting",
  socialTitle: "AIForj Aggregate-Only Reporting",
  socialDescription:
    "See what leaders can learn from aggregate-only emotional first-aid usage without individual surveillance.",
  type: "article",
});

export const dynamic = "force-dynamic";

function SummaryCard({ label, value, note }) {
  return (
    <article
      style={{
        padding: "20px 18px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        style={{
          margin: "0 0 8px",
          fontSize: 12,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          color: "var(--accent-sage)",
          fontWeight: 700,
        }}
      >
        {label}
      </p>
      <div
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(28px, 4vw, 40px)",
          lineHeight: 1,
          color: "var(--text-primary)",
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.7 }}>
        {note}
      </p>
    </article>
  );
}

function HorizontalBars({ title, items, accent = "var(--accent-sage)" }) {
  return (
    <section
      style={{
        padding: "22px 20px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.68)",
        border: "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <h2
        style={{
          margin: "0 0 16px",
          fontFamily: "'Fraunces', serif",
          fontSize: 24,
          color: "var(--text-primary)",
        }}
      >
        {title}
      </h2>
      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: "grid", gap: 6 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 14,
                color: "var(--text-secondary)",
              }}
            >
              <span>{item.label}</span>
              <strong style={{ color: "var(--text-primary)" }}>{item.value}%</strong>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 999,
                background: "rgba(45,42,38,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${item.value}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: accent,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TrendChart({ data, isLiveSnapshot }) {
  const maxValue = Math.max(...data.map((item) => item.starts), 1);

  return (
    <section
      style={{
        padding: "22px 20px",
        borderRadius: 20,
        background: "rgba(255,255,255,0.68)",
        border: "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <h2
        style={{
          margin: "0 0 8px",
          fontFamily: "'Fraunces', serif",
          fontSize: 24,
          color: "var(--text-primary)",
        }}
      >
        {isLiveSnapshot ? "Live aggregate trend view" : "Aggregate trend view"}
      </h2>
      <p style={{ margin: "0 0 18px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
        This shows the level of insight leaders get: starts, completions, and
        improvement buckets at a team level. No names. No raw session content.
      </p>

      <div style={{ display: "grid", gap: 16 }}>
        {data.map((item) => (
          <div key={item.week} style={{ display: "grid", gap: 8 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>{item.week}</strong>
              <span style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Positive shift rate: {item.positiveShiftRate}%
              </span>
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  Tool starts
                </span>
                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(45,42,38,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.starts / maxValue) * 100}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "var(--accent-sage)",
                    }}
                  />
                </div>
                <strong style={{ color: "var(--text-primary)" }}>{item.starts}</strong>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr auto",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: 14, color: "var(--text-secondary)" }}>
                  Completions
                </span>
                <div
                  style={{
                    height: 12,
                    borderRadius: 999,
                    background: "rgba(45,42,38,0.08)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(item.completions / maxValue) * 100}%`,
                      height: "100%",
                      borderRadius: 999,
                      background: "var(--accent-teal)",
                    }}
                  />
                </div>
                <strong style={{ color: "var(--text-primary)" }}>{item.completions}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function Page() {
  const snapshot = await getOrganizationReportingSnapshot();
  const hasReportingData = snapshot.hasData !== false;
  const isBlobSnapshot = snapshot.source === "live_blob";
  const isConfiguredSnapshot =
    snapshot.source === "live_blob" || snapshot.source === "live_configured";
  const isLiveSnapshot =
    snapshot.source === "live_blob" ||
    snapshot.source === "live_configured" ||
    snapshot.source === "live_local" ||
    snapshot.source === "live_memory";
  const articleSchema = buildArticleSchema({
    title: "AIForj aggregate-only reporting for organizations",
    description: metadata.description,
    url: "https://aiforj.com/organizations/reporting",
    section: "Organization reporting",
    about: "AIForj aggregate-only organization reporting",
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", item: "https://aiforj.com" },
    { name: "Organizations", item: "https://aiforj.com/organizations" },
    {
      name: "Aggregate reporting",
      item: "https://aiforj.com/organizations/reporting",
    },
  ]);

  return (
    <>
      <BiophilicBackground />
      <SOS />

      <main style={{ maxWidth: 1040, margin: "84px auto 40px", padding: "0 20px" }}>
        <article style={{ display: "grid", gap: 24 }}>
          <section
            style={{
              display: "grid",
              gap: 18,
              padding: "clamp(24px, 4vw, 32px)",
              borderRadius: 24,
              background:
                "linear-gradient(135deg, rgba(125,155,130,0.14), rgba(255,255,255,0.78))",
              border: "1px solid rgba(45,42,38,0.08)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: "var(--accent-sage)",
                fontWeight: 700,
              }}
            >
              Aggregate-only reporting
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: "'Fraunces', serif",
                fontSize: "clamp(30px, 5vw, 46px)",
                lineHeight: 1.1,
                color: "var(--text-primary)",
              }}
            >
              What leaders can learn without seeing anyone’s private emotional data
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              This page shows the organization view AIForj is built to support:
              anonymous counts, completion patterns, shift buckets, and rollout surfaces. It is
              intentionally designed to answer “is this helping?” without answering
              “who is struggling?”.
            </p>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.85 }}>
              {hasReportingData
                ? isBlobSnapshot
                  ? "This page is currently reading live aggregate metrics from a durable Vercel Blob reporting store."
                  : isConfiguredSnapshot
                  ? "This page is currently reading live aggregate metrics from a configured reporting source."
                  : "This page is currently reading recent aggregate metrics from the active app runtime."
                : isBlobSnapshot
                  ? "Aggregate reporting is live and ready. Charts will populate automatically as opted-in anonymous metrics accumulate in the durable reporting store."
                  : isConfiguredSnapshot
                    ? "Aggregate reporting is connected and ready. Charts will populate automatically as opted-in anonymous metrics accumulate."
                    : "Aggregate reporting is ready. It will populate once opted-in anonymous metrics begin flowing from real usage."}
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link
                href="/organizations"
                className="btn-primary"
                style={{ textDecoration: "none" }}
              >
                Back to organization toolkit →
              </Link>
              <Link
                href="/what-we-collect"
                className="btn-secondary"
                style={{ textDecoration: "none", color: "var(--sage-deep)" }}
              >
                Read the privacy model →
              </Link>
            </div>
          </section>

          <EditorialReviewCard kind="Aggregate-only reporting" />

          <AdminGrowthDashboard snapshot={snapshot} />

          {hasReportingData ? (
            <>
              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <SummaryCard
                  label="Monthly active users"
                  value={String(snapshot.monthlyActiveUsers)}
                  note="Counted through rotating anonymous client ids, not named user accounts."
                />
                <SummaryCard
                  label="Completion rate"
                  value={`${snapshot.completionRate}%`}
                  note="Share of started tools that reached completion across all anonymous sessions."
                />
                <SummaryCard
                  label="Positive shift rate"
                  value={`${snapshot.positiveShiftRate}%`}
                  note="Share of measured sessions with a positive bucketed pre/post improvement."
                />
                <SummaryCard
                  label="Aggregate events"
                  value={String(snapshot.eventCount || 0)}
                  note="Count of anonymous start and completion events stored for aggregate reporting."
                />
              </section>

              <TrendChart data={snapshot.weeklyTrend} isLiveSnapshot={isLiveSnapshot} />

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: 16,
                }}
              >
                <HorizontalBars
                  title="Top anonymous need categories"
                  items={snapshot.topNeeds}
                  accent="var(--accent-sage)"
                />
                <HorizontalBars
                  title="Most-used tool families"
                  items={snapshot.topTools}
                  accent="var(--accent-teal)"
                />
                <HorizontalBars
                  title="How people arrived"
                  items={snapshot.rolloutSurfaces}
                  accent="var(--amber-deep)"
                />
              </section>
            </>
          ) : (
            <>
              <section
                style={{
                  padding: "22px 20px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.68)",
                  border: "1px solid rgba(45,42,38,0.08)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 12px",
                    fontFamily: "'Fraunces', serif",
                    fontSize: 24,
                    color: "var(--text-primary)",
                  }}
                >
                  Reporting is live and waiting for the first real aggregate events
                </h2>
                <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  The reporting backend is active now. As soon as people use AIForj with
                  anonymous metrics enabled, this page will begin filling with real,
                  low-resolution aggregate trends.
                </p>
                <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  Until then, AIForj shows an honest empty state instead of synthetic sample
                  numbers. That keeps the reporting surface useful without pretending activity
                  exists where it doesn&apos;t.
                </p>
              </section>

              <section
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <SummaryCard
                  label="Reporting status"
                  value={isBlobSnapshot ? "Live" : "Ready"}
                  note={
                    isBlobSnapshot
                      ? "Aggregate events are stored in AIForj’s durable Vercel Blob reporting store."
                      : "Aggregate reporting is connected and ready to populate when events arrive."
                  }
                />
                <SummaryCard
                  label="Collection model"
                  value="Anonymous"
                  note="Only whitelisted counters and buckets are eligible for reporting. No journals, messages, or transcripts are included."
                />
                <SummaryCard
                  label="Employee visibility"
                  value="Aggregate only"
                  note="Leaders never see names, direct identifiers, raw mood histories, or ranked lists of specific people."
                />
                <SummaryCard
                  label="Current events"
                  value="0"
                  note="The first opted-in aggregate events will appear here automatically once real usage begins."
                />
              </section>
            </>
          )}

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            <section
              style={{
                padding: "22px 20px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.68)",
                border: "1px solid rgba(45,42,38,0.08)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  fontFamily: "'Fraunces', serif",
                  fontSize: 24,
                  color: "var(--text-primary)",
                }}
              >
                What leaders can see
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                <li>tool starts and completions in aggregate</li>
                <li>bucketed mood-shift outcomes at team level</li>
                <li>which categories are being used most</li>
                <li>high-level adoption trends over time</li>
                <li>how people found the toolkit in aggregate</li>
              </ul>
            </section>

            <section
              style={{
                padding: "22px 20px",
                borderRadius: 20,
                background: "rgba(196,149,106,0.08)",
                border: "1px solid rgba(196,149,106,0.16)",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px",
                  fontFamily: "'Fraunces', serif",
                  fontSize: 24,
                  color: "var(--text-primary)",
                }}
              >
                What leaders cannot see
              </h2>
              <ul style={{ margin: 0, paddingLeft: 20, color: "var(--text-secondary)", lineHeight: 1.85 }}>
                <li>names, emails, or employee identities inside usage data</li>
                <li>free-text entries from techniques or interventions</li>
                <li>voice data, transcripts, or conversation content</li>
                <li>an individual person’s raw mood history</li>
                <li>a ranked list of “high-risk” employees</li>
              </ul>
            </section>
          </section>

          <section
            style={{
              padding: "22px 20px",
              borderRadius: 20,
              background: "rgba(107,155,158,0.08)",
              border: "1px solid rgba(107,155,158,0.16)",
            }}
          >
            <h2
              style={{
                margin: "0 0 12px",
                fontFamily: "'Fraunces', serif",
                fontSize: 24,
                color: "var(--text-primary)",
              }}
            >
              Where these numbers come from
            </h2>
            <p style={{ margin: "0 0 10px", color: "var(--text-secondary)", lineHeight: 1.8 }}>
              The reporting model is derived from the same narrow event design used
              in AIForj’s privacy page: tool started, tool completed, duration bucket,
              shift bucket, and a rotating anonymous client id. It is meant to stay
              useful while remaining intentionally low-resolution.
            </p>
            <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
              For the plain-English public version of that boundary, read{" "}
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
