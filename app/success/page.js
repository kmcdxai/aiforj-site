import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

function SuccessFallback() {
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
          maxWidth: 480,
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
          Preparing your AIForj Premium confirmation
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#6B7F6E",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          One moment while we load your checkout details.
        </p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SuccessFallback />}>
      <SuccessClient />
    </Suspense>
  );
}
