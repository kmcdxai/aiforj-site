"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { activateSubscriptionPremium } from "../../utils/premiumAccess";

function PrimaryButton({ children, ...props }) {
  return (
    <button
      type="button"
      {...props}
      style={{
        padding: "14px 28px",
        fontSize: 15,
        background: "#2D3732",
        color: "#F5F2ED",
        borderRadius: 50,
        border: "none",
        cursor: props.disabled ? "default" : "pointer",
        opacity: props.disabled ? 0.7 : 1,
        ...(props.style || {}),
      }}
    >
      {children}
    </button>
  );
}

function SecondaryLink({ href, children }) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-block",
        padding: "14px 28px",
        fontSize: 15,
        background: "transparent",
        color: "#2D3732",
        borderRadius: 50,
        textDecoration: "none",
        letterSpacing: 0.4,
        border: "1px solid rgba(45,55,50,0.2)",
      }}
    >
      {children}
    </Link>
  );
}

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const [activated, setActivated] = useState(false);
  const [giftData, setGiftData] = useState(null);
  const [familyData, setFamilyData] = useState(null);
  const [copyState, setCopyState] = useState("");
  const [seatCopyState, setSeatCopyState] = useState({});
  const [sessionError, setSessionError] = useState("");

  const kind = searchParams.get("kind") || "subscription";
  const sessionId = searchParams.get("session_id") || "";
  const isSponsor = kind === "sponsor";
  const isFamily = kind === "family";
  const giftLink = giftData?.redeemUrl || "";

  const sponsorTitle = useMemo(
    () =>
      giftData?.recipientName
        ? `Your gift for ${giftData.recipientName} is ready`
        : "Your Premium gift is ready",
    [giftData?.recipientName]
  );

  const familyTitle = useMemo(
    () =>
      familyData?.householdName
        ? `Your ${familyData.householdName} family plan is ready`
        : "Your family plan is ready",
    [familyData?.householdName]
  );

  useEffect(() => {
    if (isSponsor || isFamily) {
      setActivated(true);
      return;
    }

    activateSubscriptionPremium();
    setActivated(true);

    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 3000);

    return () => clearTimeout(timer);
  }, [isSponsor, isFamily]);

  useEffect(() => {
    if (!isSponsor || !sessionId) return;

    let active = true;
    setSessionError("");

    (async () => {
      try {
        const response = await fetch(
          `/api/sponsor-gift-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Gift details unavailable");
        }
        if (active) setGiftData(data);
      } catch (error) {
        console.warn("Unable to load gift session:", error);
        if (active) {
          setSessionError(
            error?.message ||
              "We could not load your gift details yet. Try refreshing in a moment."
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isSponsor, sessionId]);

  useEffect(() => {
    if (!isFamily || !sessionId) return;

    let active = true;
    setSessionError("");

    (async () => {
      try {
        const response = await fetch(
          `/api/family-plan-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.error || "Family plan details unavailable");
        }
        if (active) setFamilyData(data);
      } catch (error) {
        console.warn("Unable to load family plan session:", error);
        if (active) {
          setSessionError(
            error?.message ||
              "We could not load your family invite links yet. Try refreshing in a moment."
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [isFamily, sessionId]);

  const setTemporaryCopyState = (value, reset) => {
    reset(value);
    setTimeout(() => reset(""), 2200);
  };

  const copyGiftLink = async () => {
    if (!giftLink) return;

    try {
      await navigator.clipboard.writeText(giftLink);
      setTemporaryCopyState("Copied", setCopyState);
    } catch {
      setTemporaryCopyState("Copy failed", setCopyState);
    }
  };

  const copyFamilySeat = async (code, redeemUrl) => {
    if (!redeemUrl) return;

    try {
      await navigator.clipboard.writeText(redeemUrl);
      setSeatCopyState((current) => ({ ...current, [code]: "Copied" }));
      setTimeout(() => {
        setSeatCopyState((current) => ({ ...current, [code]: "" }));
      }, 2200);
    } catch {
      setSeatCopyState((current) => ({ ...current, [code]: "Copy failed" }));
      setTimeout(() => {
        setSeatCopyState((current) => ({ ...current, [code]: "" }));
      }, 2200);
    }
  };

  const copyAllFamilyLinks = async () => {
    const seatLines = (familyData?.seats || [])
      .map((seat) => `Seat ${seat.seatNumber}: ${seat.redeemUrl}`)
      .join("\n");

    if (!seatLines) return;

    try {
      await navigator.clipboard.writeText(seatLines);
      setTemporaryCopyState("Copied all", setCopyState);
    } catch {
      setTemporaryCopyState("Copy failed", setCopyState);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F2ED",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        padding: 24,
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: 640,
          animation: "fadeIn 0.8s ease",
        }}
      >
        <span style={{ fontSize: 64, display: "block", marginBottom: 24 }}>✦</span>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 32,
            fontWeight: 400,
            color: "#2D3732",
            margin: "0 0 12px",
          }}
        >
          {isSponsor
            ? sponsorTitle
            : isFamily
              ? familyTitle
              : "Welcome to Premium"}
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#6B7F6E",
            lineHeight: 1.6,
            margin: "0 0 32px",
          }}
        >
          {isSponsor
            ? "Send the redeem link personally. The first successful redemption activates one month of Premium on the recipient’s device."
            : isFamily
              ? "Share each invite link directly with the people in your household. Every link activates Premium on one device, and each claimed seat stays marked here."
              : "Your AIForj Premium subscription is now active. AI insights, mood tracking, guided journaling - it is all yours."}
        </p>

        {isSponsor ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                padding: "18px 18px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(45,42,38,0.08)",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: "#6B7F6E",
                  fontWeight: 700,
                }}
              >
                Redeem link
              </p>
              <p
                style={{
                  margin: 0,
                  color: "#3B463F",
                  lineHeight: 1.7,
                  wordBreak: "break-word",
                }}
              >
                {giftLink || "Preparing your gift link..."}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <PrimaryButton onClick={copyGiftLink} disabled={!giftLink}>
                {copyState || "Copy gift link"}
              </PrimaryButton>
              <SecondaryLink href="/sponsor">Gift another month →</SecondaryLink>
            </div>
            <p style={{ fontSize: 13, color: "#6B7F6E", opacity: 0.8, margin: 0 }}>
              {giftData?.redeemedAt
                ? "This gift has already been redeemed."
                : "Best when sent directly with a personal note."}
            </p>
            {sessionError ? (
              <p style={{ fontSize: 13, color: "#A25E48", margin: 0 }}>
                {sessionError}
              </p>
            ) : null}
          </div>
        ) : isFamily ? (
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                padding: "18px 18px",
                borderRadius: 20,
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(45,42,38,0.08)",
                textAlign: "left",
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: "#6B7F6E",
                  fontWeight: 700,
                }}
              >
                Household seats
              </p>
              <p style={{ margin: 0, color: "#3B463F", lineHeight: 1.7 }}>
                {familyData?.seats?.length
                  ? `${familyData.seats.length} invite links are ready to share.`
                  : "Preparing your household invite links..."}
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {(familyData?.seats || Array.from({ length: 4 }, (_, index) => ({
                code: `placeholder-${index + 1}`,
                seatNumber: index + 1,
                redeemed: false,
                redeemUrl: "",
              }))).map((seat) => (
                <div
                  key={seat.code}
                  style={{
                    padding: "16px 18px",
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.72)",
                    border: "1px solid rgba(45,42,38,0.08)",
                    textAlign: "left",
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: "0 0 4px",
                          fontSize: 12,
                          letterSpacing: 1.2,
                          textTransform: "uppercase",
                          color: "#6B7F6E",
                          fontWeight: 700,
                        }}
                      >
                        Seat {seat.seatNumber}
                      </p>
                      <p style={{ margin: 0, color: "#3B463F", lineHeight: 1.6 }}>
                        {seat.redeemUrl || "Preparing seat link..."}
                      </p>
                    </div>
                    <span
                      style={{
                        whiteSpace: "nowrap",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: seat.redeemed
                          ? "rgba(196,149,106,0.16)"
                          : "rgba(107,155,158,0.12)",
                        color: seat.redeemed ? "#8A5A3A" : "#2F6C70",
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {seat.redeemed ? "Claimed" : "Available"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <PrimaryButton
                      onClick={() => copyFamilySeat(seat.code, seat.redeemUrl)}
                      disabled={!seat.redeemUrl}
                      style={{ padding: "10px 18px", fontSize: 13 }}
                    >
                      {seatCopyState[seat.code] || "Copy seat link"}
                    </PrimaryButton>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <PrimaryButton
                onClick={copyAllFamilyLinks}
                disabled={!familyData?.seats?.length}
              >
                {copyState || "Copy all invite links"}
              </PrimaryButton>
              <SecondaryLink href="/family">Start another family plan →</SecondaryLink>
            </div>

            <p style={{ fontSize: 13, color: "#6B7F6E", opacity: 0.8, margin: 0 }}>
              Share these directly with the people in your household. Each seat
              works once, on one device.
            </p>
            {sessionError ? (
              <p style={{ fontSize: 13, color: "#A25E48", margin: 0 }}>
                {sessionError}
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: 14,
                color: "#6B7F6E",
                opacity: 0.6,
              }}
            >
              {activated ? "Redirecting you back to AIForj..." : "Activating..."}
            </p>
            <a
              href="/"
              style={{
                display: "inline-block",
                marginTop: 20,
                padding: "14px 40px",
                fontSize: 15,
                background: "#2D3732",
                color: "#F5F2ED",
                borderRadius: 50,
                textDecoration: "none",
                letterSpacing: 1,
              }}
            >
              Start Using Premium →
            </a>
          </>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
