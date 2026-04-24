function DashboardCard({ label, value, note }) {
  return (
    <article
      style={{
        padding: "18px 16px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.72)",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p className="text-label" style={{ margin: "0 0 8px", color: "var(--sage-deep)" }}>
        {label}
      </p>
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 38px)", lineHeight: 1 }}>
        {value}
      </div>
      {note ? <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", lineHeight: 1.6, fontSize: 13 }}>{note}</p> : null}
    </article>
  );
}

function MiniList({ title, items, empty = "No data yet" }) {
  return (
    <section
      style={{
        padding: "20px 18px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.62)",
        border: "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <h3 style={{ margin: "0 0 12px", fontSize: 20 }}>{title}</h3>
      {items?.length ? (
        <div style={{ display: "grid", gap: 10 }}>
          {items.map((item) => (
            <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)" }}>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.7 }}>{empty}</p>
      )}
    </section>
  );
}

export default function AdminGrowthDashboard({ snapshot }) {
  const growth = snapshot?.growth || {};
  const hasData = snapshot?.hasData !== false && (snapshot?.eventCount || growth.totalPageViews);
  const completionRate = growth.toolStarts
    ? `${Math.round((growth.toolCompletions / growth.toolStarts) * 100)}%`
    : "0%";

  return (
    <section
      style={{
        display: "grid",
        gap: 18,
        padding: "clamp(22px, 4vw, 30px)",
        borderRadius: 24,
        background: "linear-gradient(135deg, rgba(125,155,130,0.10), rgba(255,255,255,0.78))",
        border: "1px solid rgba(45,42,38,0.08)",
      }}
    >
      <div>
        <p className="text-label" style={{ margin: "0 0 8px", color: "var(--sage-deep)" }}>
          Growth dashboard
        </p>
        <h2 style={{ margin: "0 0 10px" }}>Privacy-first funnel visibility</h2>
        <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.8 }}>
          These cards use first-party aggregate events only. No raw messages, journal text, provider queries, full URLs, IP addresses, or ad-tech identifiers are included.
        </p>
      </div>

      {!hasData ? (
        <section
          style={{
            padding: "18px",
            borderRadius: 18,
            background: "rgba(255,255,255,0.72)",
            border: "1px dashed rgba(45,42,38,0.16)",
          }}
        >
          <h3 style={{ margin: "0 0 8px" }}>No aggregate growth data yet</h3>
          <p style={{ margin: 0, color: "var(--text-secondary)", lineHeight: 1.75 }}>
            Publish the release, keep privacy metrics enabled, and ask early testers to opt into anonymous sensitive-tool metrics. Page views can start populating without cookies; tool funnels populate only after opt-in.
          </p>
        </section>
      ) : null}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14 }}>
        <DashboardCard label="Page views" value={String(growth.totalPageViews || 0)} note="Aggregate marketing page views" />
        <DashboardCard label="Tool starts" value={String(growth.toolStarts || 0)} note="Opt-in sensitive events" />
        <DashboardCard label="Tool completions" value={String(growth.toolCompletions || 0)} note={`Completion rate ${completionRate}`} />
        <DashboardCard label="Share cards" value={String(growth.shareCardGenerations || 0)} note={`${growth.shareLinkOpens || 0} share link opens`} />
        <DashboardCard label="Checkout starts" value={String(growth.checkoutStarts || 0)} note={`${growth.checkoutSuccesses || 0} conversions logged`} />
        <DashboardCard label="Newsletter signups" value={String(growth.newsletterSignups || 0)} note="Email stored separately from emotional content" />
        <DashboardCard label="Provider searches" value={String(growth.providerSearchStarts || 0)} note="No location/query details stored" />
        <DashboardCard label="Positive shifts" value={`${snapshot?.positiveShiftRate || 0}%`} note="Bucketed, opt-in completions" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <MiniList title="Top entry pages" items={growth.topEntryPages} />
        <MiniList title="Mood-shift buckets" items={growth.moodShiftBuckets} />
        <MiniList title="Acquisition sources" items={growth.acquisitionSources} />
      </div>
    </section>
  );
}
