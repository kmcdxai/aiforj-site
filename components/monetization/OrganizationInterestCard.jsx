"use client";

import { useState } from "react";

const TEAM_SIZE_OPTIONS = [
  "1-25 people",
  "26-100 people",
  "101-500 people",
  "500+ people",
];

const ROLE_OPTIONS = [
  "Founder / executive",
  "HR / people ops",
  "Benefits / wellbeing lead",
  "Clinician / care lead",
  "School / nonprofit leader",
  "Other",
];

export default function OrganizationInterestCard() {
  const [form, setForm] = useState({
    email: "",
    organization: "",
    role: ROLE_OPTIONS[0],
    teamSize: TEAM_SIZE_OPTIONS[0],
  });
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/organization-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_address: form.email,
          organization_name: form.organization,
          role: form.role,
          team_size: form.teamSize,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to join the organization list.");
      }

      setStatus("success");
      setMessage("We’ve got your organization request and can follow up on rollout options.");
      setForm({
        email: "",
        organization: "",
        role: ROLE_OPTIONS[0],
        teamSize: TEAM_SIZE_OPTIONS[0],
      });
    } catch (error) {
      setStatus("error");
      setMessage(error?.message || "Unable to join the organization list.");
    }
  };

  return (
    <section
      style={{
        display: "grid",
        gap: 18,
        padding: "clamp(24px, 4vw, 32px)",
        borderRadius: 24,
        background:
          "linear-gradient(135deg, rgba(125,155,130,0.12), rgba(255,255,255,0.78))",
        border: "1px solid rgba(45,42,38,0.08)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 12,
            letterSpacing: 1.8,
            textTransform: "uppercase",
            color: "var(--accent-sage)",
            fontWeight: 700,
          }}
        >
          For organizations
        </p>
        <h1
          style={{
            margin: "0 0 10px",
            fontFamily: "'Fraunces', serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
          }}
        >
          Roll out emotional first aid without turning your people into a dashboard
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 16,
            lineHeight: 1.8,
            color: "var(--text-secondary)",
            maxWidth: 720,
          }}
        >
          AIForj&apos;s privacy-first wellness toolkit is for organizations that
          want useful support, aggregate-only learning, and zero appetite for
          employer-style monitoring of individual vulnerability.
        </p>
      </div>

      <form
        onSubmit={submit}
        style={{
          display: "grid",
          gap: 14,
          padding: "20px 18px",
          borderRadius: 18,
          background: "rgba(255,255,255,0.72)",
          border: "1px solid rgba(45,42,38,0.08)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Work email
            </span>
            <input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="you@organization.com"
              autoComplete="email"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Organization
            </span>
            <input
              type="text"
              value={form.organization}
              onChange={updateField("organization")}
              placeholder="Acme Health"
              maxLength={120}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            />
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Your role
            </span>
            <select
              value={form.role}
              onChange={updateField("role")}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Team size
            </span>
            <select
              value={form.teamSize}
              onChange={updateField("teamSize")}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid rgba(45,42,38,0.12)",
                background: "#fff",
                color: "var(--text-primary)",
                fontSize: 15,
              }}
            >
              {TEAM_SIZE_OPTIONS.map((teamSize) => (
                <option key={teamSize} value={teamSize}>
                  {teamSize}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
            color: "var(--text-secondary)",
            fontSize: 14,
            lineHeight: 1.75,
          }}
        >
          <div>Aggregate-only usage learning, not individual employee dashboards.</div>
          <div>No session text, audio, or personal emotional content leaves the device by default.</div>
          <div>Designed for employers, schools, nonprofits, and care-adjacent teams that need a trust-compatible rollout.</div>
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Early access list for the first organization toolkit cohort.
          </div>
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary"
            style={{ minWidth: 240, opacity: status === "loading" ? 0.7 : 1 }}
          >
            {status === "loading" ? "Joining..." : "Join organization list →"}
          </button>
        </div>

        {message ? (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: status === "success" ? "var(--accent-teal)" : "var(--warning)",
            }}
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
