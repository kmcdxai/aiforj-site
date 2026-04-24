"use client";

import { useState, useCallback, useMemo } from "react";
import { trackSafeMetric } from "../../lib/metrics";

// ═══════════════════════════════════════════════════════════════
// /find-help — Smart Provider Finder
// Searches the NPI Registry (CMS.gov) for registry-listed providers.
// AIForj does not endorse, verify, or store provider searches by default.
// Flow: need → details → results (real provider data)
// ═══════════════════════════════════════════════════════════════

const C = {
  bg: "#F3F6FA",
  text: "#1A2030",
  accent: "#2B7A9C",
  purple: "#6B5CA5",
  muted: "#6B7B8D",
  card: "rgba(255,255,255,0.82)",
  line: "#DDE3ED",
  urgent: "#C85A3A",
  sage: "#3D8B5E",
  warm: "#B8935A",
  glow: "43,122,156",
};

const NEEDS = [
  { id: "medication", label: "Medication management", desc: "Psychiatric prescriber or psychiatrist who can prescribe and manage medications", icon: "💊" },
  { id: "therapy", label: "Therapy / talk therapy", desc: "Psychologist, therapist, or licensed counselor for ongoing sessions", icon: "💬" },
  { id: "both", label: "Both medication and therapy", desc: "Psychiatric prescribers can do both — we'll also show psychiatrists, psychologists, and therapists", icon: "🩺" },
  { id: "substance", label: "Substance use / addiction", desc: "Addiction specialists and dual-diagnosis providers", icon: "⚠️" },
  { id: "any", label: "I'm not sure what I need", desc: "We'll search across all mental health provider types", icon: "🤔" },
];

const INSURERS = [
  { id: "aetna", label: "Aetna" },
  { id: "anthem", label: "Anthem" },
  { id: "bcbs", label: "Blue Cross Blue Shield" },
  { id: "cigna", label: "Cigna / Evernorth" },
  { id: "humana", label: "Humana" },
  { id: "kaiser", label: "Kaiser Permanente" },
  { id: "magellan", label: "Magellan Health" },
  { id: "medicaid", label: "Medicaid" },
  { id: "medicare", label: "Medicare" },
  { id: "molina", label: "Molina Healthcare" },
  { id: "optum", label: "UnitedHealthcare / Optum" },
  { id: "tricare", label: "Tricare" },
  { id: "oscar", label: "Oscar Health" },
  { id: "other", label: "Other insurance" },
  { id: "none", label: "No insurance / cash pay" },
  { id: "unknown", label: "I don't know my insurance" },
];

const TYPE_STYLES = {
  "Psychiatric Prescriber": { color: "#2B7A9C", badge: "Prescribe + Therapy", icon: "🩺" },
  "Psychiatrist": { color: "#6B5CA5", badge: "Prescriber", icon: "⚕️" },
  "Psychologist": { color: "#3D8B5E", badge: "Therapy + Testing", icon: "🧠" },
  "Licensed Clinical Social Worker": { color: "#B8935A", badge: "Therapist (LCSW)", icon: "💬" },
  "Mental Health Counselor": { color: "#C85A3A", badge: "Counselor", icon: "💬" },
  "Counselor": { color: "#C85A3A", badge: "Counselor", icon: "💬" },
  "Addiction Medicine": { color: "#6B5CA5", badge: "Addiction Specialist", icon: "⚕️" },
  "Substance Use Specialist": { color: "#C85A3A", badge: "Substance Use", icon: "⚠️" },
};

export default function FindHelpPage() {
  const [step, setStep] = useState("need");
  const [fadeKey, setFadeKey] = useState(0);
  const [need, setNeed] = useState("");
  const [insurance, setInsurance] = useState("");
  const [zip, setZip] = useState("");
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchWarning, setSearchWarning] = useState("");
  const [totalFound, setTotalFound] = useState(0);
  const [showCount, setShowCount] = useState(10);
  const [copied, setCopied] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [expandedNpi, setExpandedNpi] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [savedProviders, setSavedProviders] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("aiforj_provider_shortlist") || "[]");
    } catch {
      return [];
    }
  });

  const go = (next) => { setFadeKey(k => k + 1); setStep(next); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const searchProviders = useCallback(async () => {
    if (zip.length < 5) return;
    setLoading(true);
    setError("");
    setSearchWarning("");
    setProviders([]);
    setShowCount(10);
    setFilterType("all");
    setExpandedNpi(null);
    go("results");
    trackSafeMetric({ event: "provider_search_started", acquisitionSource: "internal" });
    try {
      const res = await fetch(`/api/find-providers?zip=${zip}&type=${need}`);
      const data = await res.json();
      if (!res.ok && data.error) {
        setError(data.error);
      } else {
        setProviders(data.providers || []);
        setTotalFound(data.total || 0);
        setSearchWarning(data.searchWarning || "");
      }
    } catch {
      setSearchWarning("We couldn't reach the national provider registry right now, but you can still use the directories and affordable-care links below.");
    }
    setLoading(false);
  }, [zip, need]);

  const insLabel = INSURERS.find(i => i.id === insurance)?.label || "your insurance";
  const isUninsured = insurance === "none";

  // Provider type counts for filter tabs
  const typeCounts = useMemo(() => {
    const counts = {};
    providers.forEach(p => {
      counts[p.providerType] = (counts[p.providerType] || 0) + 1;
    });
    return counts;
  }, [providers]);

  // Filtered providers
  const filtered = useMemo(() => {
    if (filterType === "all") return providers;
    return providers.filter(p => p.providerType === filterType);
  }, [providers, filterType]);

  const visible = filtered.slice(0, showCount);

  const callScript = `Hi, I'm looking for a mental health provider${!isUninsured && insurance !== "unknown" ? ` who accepts ${insLabel}` : " with sliding scale or self-pay options"}. I'm looking for help with ${NEEDS.find(n => n.id === need)?.label?.toLowerCase() || "mental health concerns"}. Are you accepting new patients?`;

  const saveProviderLocally = (provider) => {
    const next = [
      provider,
      ...savedProviders.filter((item) => item.npi !== provider.npi),
    ].slice(0, 12);
    setSavedProviders(next);
    try {
      localStorage.setItem("aiforj_provider_shortlist", JSON.stringify(next));
    } catch {}
  };

  const handleShare = (type) => {
    const text = "Find a mental health provider search bridge — free tool → aiforj.com/find-help";
    const url = "https://aiforj.com/find-help";
    if (type === "sms") window.open(`sms:?&body=${encodeURIComponent(text)}`, "_self");
    else if (type === "native" && navigator.share) navigator.share({ title: "Find a Mental Health Provider", text, url }).catch(() => {});
    else navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "var(--text-primary)", background: "var(--bg-primary)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,300;1,6..72,400&family=Instrument+Sans:wght@400;500;600&display=swap');
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { outline: none !important; }
        ::selection { background: rgba(${C.glow},0.2); }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse at 30% 20%, rgba(${C.glow},0.04) 0%, transparent 55%)` }} />

      {/* Page subtitle */}
      <div style={{ textAlign: "center", padding: "8px 24px" }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: 2, textTransform: "uppercase", fontWeight: 500 }}>Find a Provider</span>
      </div>

      <main style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 100px", position: "relative", zIndex: 5 }}>

        {/* ─── STEP 1: WHAT DO YOU NEED? ─── */}
        {step === "need" && (
          <div key={fadeKey} style={{ animation: "fadeUp 1s ease", paddingTop: "8vh" }}>
            <h1 style={{ fontFamily: "'Newsreader', serif", fontSize: "clamp(28px, 5.5vw, 42px)", fontWeight: 300, lineHeight: 1.2, margin: "0 0 12px" }}>
              What would help<br />you most right now?
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: C.muted, marginBottom: 28 }}>
              We search the National Provider Registry and return registry-listed providers near you — with name, address, phone number, and specialty when available. Confirm availability, insurance, and licensing directly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {NEEDS.map(n => (
                <button key={n.id} onClick={() => { setNeed(n.id); go("details"); }} style={{
                  padding: "20px 20px", background: C.card,
                  border: `1.5px solid ${C.line}`,
                  borderRadius: 14, cursor: "pointer", textAlign: "left",
                  transition: "all 0.15s", display: "flex", alignItems: "center", gap: 16,
                }}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{n.icon}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.text, display: "block" }}>{n.label}</span>
                    <span style={{ fontSize: 12, color: C.muted, marginTop: 2, display: "block" }}>{n.desc}</span>
                  </div>
                  <span style={{ fontSize: 18, color: C.accent, opacity: 0.4, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>

            <div style={{ padding: 18, background: `rgba(200,90,58,0.04)`, borderRadius: 14, border: `1px solid rgba(200,90,58,0.1)` }}>
              <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: C.urgent }}>In crisis right now?</strong> Call or text <strong>988</strong> (Suicide & Crisis Lifeline) · Text HOME to <strong>741741</strong> (Crisis Text Line)
              </p>
            </div>

            <p style={{ fontSize: 11, color: C.muted, opacity: 0.35, marginTop: 28, lineHeight: 1.7 }}>
              Provider searches are not stored server-side by default. If anonymous metrics are enabled, AIForj only records a provider_search_started count, not your ZIP, city, provider details, or search type.
            </p>
          </div>
        )}

        {/* ─── STEP 2: INSURANCE + ZIP ─── */}
        {step === "details" && (
          <div key={fadeKey} style={{ animation: "fadeUp 0.8s ease", paddingTop: "6vh" }}>
            <button onClick={() => go("need")} style={{ background: "none", border: "none", fontSize: 13, color: C.accent, cursor: "pointer", marginBottom: 20, padding: 0 }}>← Back</button>

            <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 28, fontWeight: 300, margin: "0 0 10px" }}>Almost there.</h2>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: C.muted, marginBottom: 24 }}>
              Select your insurance and enter your zip code. We'll search the national registry and return providers near you.
            </p>

            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 10, letterSpacing: 0.5 }}>Your insurance</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {INSURERS.map(ins => {
                  const sel = insurance === ins.id;
                  const isSpecial = ins.id === "none" || ins.id === "unknown";
                  return (
                    <button key={ins.id} onClick={() => setInsurance(ins.id)} style={{
                      padding: "12px 14px", background: sel ? `rgba(${C.glow},0.08)` : C.card,
                      border: `1.5px solid ${sel ? C.accent : C.line}`,
                      borderRadius: 10, cursor: "pointer", textAlign: "left",
                      transition: "all 0.15s",
                      ...(isSpecial ? { gridColumn: "span 2" } : {}),
                      ...(isSpecial && !sel ? { borderStyle: "dashed" } : {}),
                    }}>
                      <span style={{ fontSize: 13, fontWeight: sel ? 600 : 400, color: sel ? C.accent : isSpecial ? C.muted : C.text }}>{ins.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {insurance && (
              <>
                {isUninsured && (
                  <div style={{ padding: 16, background: `rgba(61,139,94,0.05)`, borderRadius: 12, border: `1px solid rgba(61,139,94,0.12)`, marginBottom: 20 }}>
                    <p style={{ fontSize: 12, color: C.text, lineHeight: 1.7, margin: 0 }}>
                      <strong style={{ color: C.sage }}>You still have options.</strong> We'll find providers near you. Ask about sliding scale fees, self-pay rates, or superbills for reimbursement. We'll also show affordable alternatives.
                    </p>
                  </div>
                )}

                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: C.text, display: "block", marginBottom: 10, letterSpacing: 0.5 }}>Your zip code</label>
                  <input
                    type="text" inputMode="numeric" pattern="[0-9]*" maxLength={5}
                    value={zip} onChange={e => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                    placeholder="e.g. 90210"
                    style={{
                      width: "100%", maxWidth: 180, padding: "14px 18px", fontSize: 20,
                      fontFamily: "'Instrument Sans', sans-serif",
                      background: C.card, border: `1.5px solid ${C.line}`, borderRadius: 12, color: C.text,
                      letterSpacing: 6, textAlign: "center",
                    }}
                  />
                </div>

                {zip.length === 5 && (
                  <button onClick={searchProviders} disabled={loading} style={{
                    padding: "18px 52px", fontSize: 16,
                    background: loading ? C.muted : C.accent, color: "#fff", border: "none", borderRadius: 40,
                    cursor: loading ? "wait" : "pointer", fontWeight: 600, width: "100%", maxWidth: 360,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    opacity: loading ? 0.7 : 1, transition: "all 0.2s",
                  }}>
                    {loading && <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.6s linear infinite", flexShrink: 0 }} />}
                    {loading ? "Searching..." : "Find providers →"}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* ─── STEP 3: RESULTS ─── */}
        {step === "results" && (
          <div key={fadeKey} style={{ animation: "fadeUp 0.8s ease", paddingTop: "5vh" }}>
            <button onClick={() => { go("details"); }} style={{ background: "none", border: "none", fontSize: 13, color: C.accent, cursor: "pointer", marginBottom: 16, padding: 0 }}>← Change search</button>

            {/* Loading */}
            {loading && (
              <div style={{ textAlign: "center", paddingTop: "10vh" }}>
                <div style={{ width: 36, height: 36, border: `3px solid ${C.line}`, borderTopColor: C.accent, borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 20px" }} />
                <p style={{ fontSize: 15, color: C.muted }}>Searching the National Provider Registry...</p>
                <p style={{ fontSize: 12, color: C.muted, opacity: 0.5, marginTop: 8 }}>Real, verified provider data from CMS.gov</p>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div style={{ padding: 20, background: `rgba(200,90,58,0.05)`, borderRadius: 14, border: `1px solid rgba(200,90,58,0.12)`, marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: C.urgent, margin: "0 0 12px" }}>{error}</p>
                <button onClick={searchProviders} style={{ padding: "10px 24px", fontSize: 13, background: C.accent, color: "#fff", border: "none", borderRadius: 20, cursor: "pointer", fontWeight: 600 }}>Try again</button>
              </div>
            )}

            {searchWarning && !loading && !error && (
              <div style={{ padding: 20, background: `rgba(184,147,90,0.08)`, borderRadius: 14, border: `1px solid rgba(184,147,90,0.18)`, marginBottom: 20 }}>
                <p style={{ fontSize: 14, color: C.warm, margin: 0, lineHeight: 1.75 }}>{searchWarning}</p>
              </div>
            )}

            {/* Results */}
            {!loading && providers.length > 0 && (
              <>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 300, margin: "0 0 6px" }}>
                  {totalFound} provider{totalFound !== 1 ? "s" : ""} found near {zip}
                </h2>
                <p style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.5 }}>
                  {NEEDS.find(n => n.id === need)?.label} · {isUninsured ? "Cash pay / self-pay" : insLabel}
                </p>

                {savedProviders.length > 0 && (
                  <div style={{ padding: 16, background: "rgba(61,139,94,0.05)", borderRadius: 14, border: "1px solid rgba(61,139,94,0.14)", marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: C.sage, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px", fontWeight: 600 }}>Saved locally</p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {savedProviders.slice(0, 4).map((provider) => (
                        <div key={provider.npi} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", fontSize: 13, color: C.text }}>
                          <span>{provider.name} · {provider.address?.city}, {provider.address?.state}</span>
                          {provider.phone && <a href={`tel:${provider.phone.replace(/\D/g, "")}`} style={{ color: C.sage, fontWeight: 700, textDecoration: "none" }}>Call</a>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cash pay guidance */}
                {isUninsured && (
                  <div style={{ padding: 18, background: `rgba(61,139,94,0.06)`, borderRadius: 14, border: `1px solid rgba(61,139,94,0.15)`, marginBottom: 16 }}>
                    <p style={{ fontSize: 13, color: C.text, lineHeight: 1.8, margin: 0 }}>
                      <strong style={{ color: C.sage }}>Cash pay tip:</strong> When you call, ask: <em>"What is your self-pay rate? Do you offer a sliding scale based on income? Can you provide a superbill?"</em> Rates and reimbursement vary, so confirm costs directly before booking.
                    </p>
                  </div>
                )}

                {/* Filter tabs */}
                {Object.keys(typeCounts).length > 1 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                    <button onClick={() => setFilterType("all")} style={{
                      padding: "6px 14px", fontSize: 11, fontWeight: filterType === "all" ? 600 : 400,
                      background: filterType === "all" ? C.accent : "transparent",
                      color: filterType === "all" ? "#fff" : C.muted,
                      border: `1px solid ${filterType === "all" ? C.accent : C.line}`,
                      borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                    }}>All ({providers.length})</button>
                    {Object.entries(typeCounts).map(([type, count]) => {
                      const style = TYPE_STYLES[type] || {};
                      const active = filterType === type;
                      return (
                        <button key={type} onClick={() => setFilterType(type)} style={{
                          padding: "6px 14px", fontSize: 11, fontWeight: active ? 600 : 400,
                          background: active ? (style.color || C.accent) : "transparent",
                          color: active ? "#fff" : C.muted,
                          border: `1px solid ${active ? (style.color || C.accent) : C.line}`,
                          borderRadius: 20, cursor: "pointer", transition: "all 0.15s",
                        }}>{style.badge || type} ({count})</button>
                      );
                    })}
                  </div>
                )}

                {/* Provider cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {visible.map((p, i) => {
                    const ts = TYPE_STYLES[p.providerType] || { color: C.accent, badge: p.providerType, icon: "🩺" };
                    const expanded = expandedNpi === p.npi;
                    return (
                      <div key={p.npi || i} onClick={() => setExpandedNpi(expanded ? null : p.npi)} style={{
                        padding: "16px 18px", background: expanded ? "rgba(255,255,255,0.95)" : C.card,
                        border: `1.5px solid ${expanded ? ts.color : C.line}`,
                        borderRadius: 14, cursor: "pointer", transition: "all 0.15s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                              <span style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{p.name}</span>
                              {p.credential && <span style={{ fontSize: 11, color: C.muted, opacity: 0.7 }}>{p.credential}</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: 10, padding: "2px 8px", background: `${ts.color}12`, color: ts.color, borderRadius: 6, fontWeight: 600, letterSpacing: 0.3 }}>{ts.badge}</span>
                              <span style={{ fontSize: 11, color: C.muted }}>{p.address.city}, {p.address.state} {p.address.zip}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: 8 }}>
                            {p.phone && !expanded && (
                              <a href={`tel:${p.phone.replace(/\D/g, "")}`} onClick={e => e.stopPropagation()} style={{
                                padding: "6px 14px", fontSize: 11, background: C.accent, color: "#fff",
                                borderRadius: 16, textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap",
                              }}>Call</a>
                            )}
                            <span style={{ fontSize: 14, color: C.muted, opacity: 0.3, transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                          </div>
                        </div>

                        {expanded && (
                          <div style={{ marginTop: 14, animation: "fadeUp 0.25s ease" }}>
                            <div style={{ padding: 14, background: `rgba(${C.glow},0.03)`, borderRadius: 10, marginBottom: 12 }}>
                              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                <div>
                                  <p style={{ fontSize: 10, color: C.muted, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Specialty</p>
                                  <p style={{ fontSize: 13, color: C.text, margin: 0, fontWeight: 500 }}>{p.specialty}</p>
                                </div>
                                {p.gender && (
                                  <div>
                                    <p style={{ fontSize: 10, color: C.muted, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Gender</p>
                                    <p style={{ fontSize: 13, color: C.text, margin: 0 }}>{p.gender}</p>
                                  </div>
                                )}
                              </div>

                              <div style={{ marginTop: 12 }}>
                                <p style={{ fontSize: 10, color: C.muted, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Practice Address</p>
                                <p style={{ fontSize: 13, color: C.text, margin: 0, lineHeight: 1.5 }}>
                                  {p.address.line1}{p.address.line2 ? `, ${p.address.line2}` : ""}<br />
                                  {p.address.city}, {p.address.state} {p.address.zip}
                                </p>
                              </div>

                              {p.phone && (
                                <div style={{ marginTop: 12 }}>
                                  <p style={{ fontSize: 10, color: C.muted, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Phone</p>
                                  <a href={`tel:${p.phone.replace(/\D/g, "")}`} onClick={e => e.stopPropagation()} style={{ fontSize: 17, color: C.accent, fontWeight: 600, textDecoration: "none" }}>{p.phone}</a>
                                </div>
                              )}
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {p.phone && (
                                <a href={`tel:${p.phone.replace(/\D/g, "")}`} onClick={e => e.stopPropagation()} style={{
                                  padding: "10px 22px", fontSize: 13, background: C.accent, color: "#fff",
                                  border: "none", borderRadius: 24, textDecoration: "none", fontWeight: 600,
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                }}>📞 Call now</a>
                              )}
                              <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${p.name} ${p.credential} ${p.address.city} ${p.address.state}`)}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                                padding: "10px 22px", fontSize: 13, background: "transparent", color: C.accent,
                                border: `1px solid rgba(${C.glow},0.2)`, borderRadius: 24, textDecoration: "none", fontWeight: 500,
                              }}>📍 Directions</a>
                              <a href={`https://www.psychologytoday.com/us/therapists?search=${encodeURIComponent(p.name + " " + p.address.city)}`} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{
                                padding: "10px 22px", fontSize: 13, background: "transparent", color: C.muted,
                                border: `1px solid ${C.line}`, borderRadius: 24, textDecoration: "none", fontWeight: 500,
                              }}>View profile</a>
                              <button type="button" onClick={(e) => { e.stopPropagation(); saveProviderLocally(p); }} style={{
                                padding: "10px 22px", fontSize: 13, background: "transparent", color: C.sage,
                                border: `1px solid rgba(61,139,94,0.22)`, borderRadius: 24, fontWeight: 500, cursor: "pointer",
                              }}>{savedProviders.some((item) => item.npi === p.npi) ? "Saved locally" : "Save locally"}</button>
                            </div>

                            <p style={{ fontSize: 11, color: C.muted, opacity: 0.5, marginTop: 10, lineHeight: 1.5 }}>
                              {isUninsured
                                ? "Call to ask about self-pay rates, sliding scale, or superbill options."
                                : `Call to verify they accept ${insLabel} and are taking new patients.`}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Load more */}
                {showCount < filtered.length && (
                  <div style={{ textAlign: "center", marginBottom: 24 }}>
                    <button onClick={() => setShowCount(c => c + 15)} style={{
                      padding: "10px 28px", fontSize: 13, background: "transparent", color: C.accent,
                      border: `1px solid rgba(${C.glow},0.2)`, borderRadius: 20, cursor: "pointer", fontWeight: 500,
                    }}>Show more ({filtered.length - showCount} remaining)</button>
                  </div>
                )}

                {/* What to say */}
                <div style={{ padding: 22, background: `rgba(${C.glow},0.05)`, borderRadius: 14, border: `1px solid rgba(${C.glow},0.12)`, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>What to say when you call</p>
                  <p style={{ fontSize: 14, color: C.text, lineHeight: 1.8, margin: "0 0 12px", fontStyle: "italic" }}>"{callScript}"</p>
                  <button onClick={() => { navigator.clipboard.writeText(callScript).then(() => { setCopiedScript(true); setTimeout(() => setCopiedScript(false), 2000); }); }} style={{
                    padding: "8px 18px", fontSize: 12, background: "transparent",
                    border: `1px solid rgba(${C.glow},0.2)`, borderRadius: 20,
                    color: C.accent, cursor: "pointer", fontWeight: 500,
                  }}>{copiedScript ? "Copied!" : "📋 Copy script"}</button>
                </div>

                {/* Quick tips */}
                <div style={{ padding: 22, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Questions to ask on the call</p>
                  <ol style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: C.text, lineHeight: 2.2 }}>
                    <li>Are you accepting new patients?</li>
                    <li>{isUninsured ? "What are your self-pay rates? Sliding scale?" : `Do you accept ${insLabel}? What's my copay?`}</li>
                    <li>How soon is your first available appointment?</li>
                    <li>Do you offer telehealth / video sessions?</li>
                    <li>What does a first session look like?</li>
                    {isUninsured && <li>Can you provide a superbill for out-of-network reimbursement?</li>}
                  </ol>
                </div>

                <div style={{ padding: 22, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Good to know</p>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.8 }}>
                    <p style={{ margin: "0 0 8px" }}><strong>Your first session is an intake,</strong> not a test. They'll ask about your history and goals. Just be honest about where you are.</p>
                    <p style={{ margin: "0 0 8px" }}><strong>You're evaluating them too.</strong> A good fit matters. Notice whether you feel respected, understood, and able to ask questions.</p>
                    <p style={{ margin: 0 }}><strong>It's okay to switch.</strong> If it doesn't feel right after 2-3 sessions, that's not failure — it's good practice.</p>
                  </div>
                </div>
              </>
            )}

            {/* No results */}
            {!loading && !error && providers.length === 0 && (
              <div style={{ paddingTop: "4vh" }}>
                <h2 style={{ fontFamily: "'Newsreader', serif", fontSize: 26, fontWeight: 300, margin: "0 0 12px" }}>No providers found in this area</h2>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 20 }}>
                  The registry didn't return results for your zip code. Try these directories — they have additional provider data:
                </p>
              </div>
            )}

            {/* Directories + resources (always show after results load) */}
            {!loading && (
              <>
                {/* Affordable care — prominent for cash pay users */}
                {(isUninsured || insurance === "unknown") && (
                  <div style={{ padding: 22, background: `rgba(61,139,94,0.05)`, borderRadius: 14, border: `1px solid rgba(61,139,94,0.15)`, marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: C.sage, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>Affordable care — real options, not just links</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      <a href="https://openpathcollective.org/" target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: "none", padding: "14px 16px", background: "rgba(255,255,255,0.7)",
                        border: `1px solid rgba(61,139,94,0.2)`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>🤝</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.sage, display: "block" }}>Open Path Collective</span>
                          <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5, display: "block" }}>Lower-cost therapy directory. Confirm current fees and membership details directly.</span>
                        </div>
                        <span style={{ fontSize: 14, color: C.sage, flexShrink: 0 }}>→</span>
                      </a>
                      <a href={`https://findahealthcenter.hrsa.gov/?zip=${zip}&radius=30`} target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: "none", padding: "14px 16px", background: "rgba(255,255,255,0.7)",
                        border: `1px solid rgba(61,139,94,0.2)`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>🏥</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.sage, display: "block" }}>Community Health Centers near {zip}</span>
                          <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5, display: "block" }}>Federally funded clinics that may offer sliding scale fees and behavioral health services.</span>
                        </div>
                        <span style={{ fontSize: 14, color: C.sage, flexShrink: 0 }}>→</span>
                      </a>
                      <a href={`https://www.google.com/search?q=university+psychology+training+clinic+near+${zip}`} target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: "none", padding: "14px 16px", background: "rgba(255,255,255,0.7)",
                        border: `1px solid rgba(61,139,94,0.2)`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>🎓</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.sage, display: "block" }}>University Training Clinics</span>
                          <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5, display: "block" }}>Some universities offer lower-cost clinics supervised by licensed professionals. Confirm availability and fees directly.</span>
                        </div>
                        <span style={{ fontSize: 14, color: C.sage, flexShrink: 0 }}>→</span>
                      </a>
                      <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.5)", borderRadius: 10, border: `1px solid rgba(61,139,94,0.1)` }}>
                        <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
                          <strong style={{ color: C.sage }}>Superbill reimbursement:</strong> Ask any provider whether they can provide a superbill, then confirm with your insurance whether out-of-network reimbursement is available.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional directories */}
                <div style={{ padding: 22, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>{providers.length > 0 ? "Additional directories" : "Try these directories"}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      ...(isUninsured ? [] : [
                        { name: "Zocdoc", url: `https://www.zocdoc.com/search?address=${zip}&dr_specialty=psychiatry&insurance_carrier=${insLabel}`, desc: "Book online with real-time availability + insurance filter", icon: "📅" },
                      ]),
                      { name: "SAMHSA Treatment Locator", url: "https://findtreatment.gov/", desc: "Government database of treatment facilities", icon: "🏛" },
                      { name: "NAMI HelpLine", url: "https://www.nami.org/help", desc: "Free guidance & referrals — call 1-800-950-6264", icon: "📞" },
                    ].map((link, i) => (
                      <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{
                        textDecoration: "none", padding: "12px 14px", background: `rgba(${C.glow},0.02)`,
                        border: `1px solid ${C.line}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 12,
                      }}>
                        <span style={{ fontSize: 16, flexShrink: 0 }}>{link.icon}</span>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block" }}>{link.name}</span>
                          <span style={{ fontSize: 11, color: C.muted }}>{link.desc}</span>
                        </div>
                        <span style={{ fontSize: 14, color: C.accent, opacity: 0.3, flexShrink: 0 }}>→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Insurance tips */}
                {!isUninsured && insurance !== "unknown" && (
                  <div style={{ padding: 22, background: C.card, borderRadius: 14, border: `1px solid ${C.line}`, marginBottom: 16 }}>
                    <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Insurance tips</p>
                    <ul style={{ margin: 0, padding: "0 0 0 18px", fontSize: 13, color: C.text, lineHeight: 2 }}>
                      <li>Call the number on your card → ask for in-network mental health providers</li>
                      <li>Mental health copay is often different from medical copay</li>
                      <li>Many plans reimburse 50-80% for out-of-network providers</li>
                      <li>Some plans require a PCP referral — check first</li>
                    </ul>
                  </div>
                )}

                {/* Crisis */}
                <div style={{ padding: 16, background: `rgba(200,90,58,0.04)`, borderRadius: 14, border: `1px solid rgba(200,90,58,0.1)`, marginBottom: 16 }}>
                  <p style={{ fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: C.urgent }}>Need help now?</strong> Call/text <strong>988</strong> · Text HOME to <strong>741741</strong>
                  </p>
                </div>

                {/* Share + CTA */}
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <button onClick={() => handleShare("sms")} style={{ padding: "10px 20px", fontSize: 12, background: "transparent", border: `1px solid rgba(${C.glow},0.2)`, borderRadius: 24, color: C.accent, cursor: "pointer", fontWeight: 500 }}>💬 Text this to someone</button>
                  <button onClick={() => handleShare(navigator.share ? "native" : "copy")} style={{ padding: "10px 20px", fontSize: 12, background: "transparent", border: `1px solid ${C.line}`, borderRadius: 24, color: C.muted, cursor: "pointer" }}>{copied ? "Copied!" : "↗ Share"}</button>
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <a href="/" style={{ display: "inline-block", padding: "14px 36px", fontSize: 14, background: "transparent", color: C.accent, border: `1px solid rgba(${C.glow},0.3)`, borderRadius: 40, textDecoration: "none", fontWeight: 600 }}>Talk to Forj — Free</a>
                </div>
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => { setProviders([]); setShowCount(10); setFilterType("all"); setExpandedNpi(null); go("need"); }} style={{
                    background: "none", border: "none", fontSize: 12, color: C.muted, cursor: "pointer", opacity: 0.5, textDecoration: "underline",
                  }}>Start a new search</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <div style={{ padding: "20px 24px", textAlign: "center", borderTop: "1px solid rgba(45,42,38,0.06)" }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.7, margin: 0, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          Provider data may be incomplete and comes from the National Plan & Provider Enumeration System (NPPES/CMS.gov). AIForj does not endorse or verify providers. Confirm licensing, insurance acceptance, availability, costs, and scope directly before booking.
        </p>
      </div>

      <footer style={{ padding: "48px 24px 32px", textAlign: "center", background: "var(--bg-secondary)", borderTop: "1px solid rgba(45,42,38,0.06)" }}>
        <div style={{ marginBottom: 28, padding: "18px 24px", background: "var(--surface-elevated)", borderRadius: 16, display: "inline-block", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontSize: 14, color: "var(--text-primary)", margin: "0 0 4px", fontWeight: 500 }}>In crisis? You're not alone.</p>
          <p style={{ fontSize: 13, color: "var(--text-secondary)", margin: 0 }}>Call or text <strong style={{ color: "var(--crisis)" }}>988</strong> · Text HOME to <strong style={{ color: "var(--crisis)" }}>741741</strong></p>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 24px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Forj is a wellness companion — not a therapist or substitute for professional care.
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 8px", lineHeight: 1.8 }}>Clinician-informed by Kevin, a psychiatric nurse practitioner candidate</p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.5, margin: 0 }}>© 2026 AIForj. All rights reserved.</p>
      </footer>
    </div>
  );
}
