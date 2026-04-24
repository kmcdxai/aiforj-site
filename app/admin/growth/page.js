import Link from "next/link";
import AdminGrowthDashboard from "../../../components/metrics/AdminGrowthDashboard";
import { getOrganizationReportingSnapshot } from "../../../lib/organizationReporting";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "AIForj Growth Dashboard",
  description: "Aggregate-only AIForj growth, retention, sharing, and monetization counters.",
  alternates: { canonical: "https://aiforj.com/admin/growth" },
};

export default async function GrowthDashboardPage() {
  const snapshot = await getOrganizationReportingSnapshot();

  return (
    <main style={{ maxWidth: 1080, margin: "84px auto 48px", padding: "0 20px", display: "grid", gap: 18 }}>
      <section
        style={{
          padding: "clamp(22px, 4vw, 30px)",
          borderRadius: 24,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(45,42,38,0.08)",
        }}
      >
        <p className="text-label" style={{ margin: "0 0 8px", color: "var(--sage-deep)" }}>
          Founder view
        </p>
        <h1 style={{ margin: "0 0 10px" }}>AIForj aggregate growth dashboard</h1>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          A first-party, low-resolution view of page views, tool funnels, share loops, checkout starts, and conversions. For the public org-safe version, see{" "}
          <Link href="/organizations/reporting" style={{ color: "var(--interactive)" }}>
            aggregate-only reporting
          </Link>
          .
        </p>
      </section>
      <AdminGrowthDashboard snapshot={snapshot} />
    </main>
  );
}
