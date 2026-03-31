"use client";

import { useState } from "react";
import { exportAllData, deleteAllData } from "../lib/db";

export default function DataManagement() {
  const [showPanel, setShowPanel] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState(null); // "exported" | "deleted"

  const handleExport = async () => {
    try {
      const data = await exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aiforj-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("exported");
      setTimeout(() => setStatus(null), 3000);
    } catch {
      // Silently handle — IndexedDB may not be available
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAllData();
      setConfirmDelete(false);
      setStatus("deleted");
      setTimeout(() => setStatus(null), 3000);
    } catch {
      // Silently handle
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        style={{
          background: "none",
          border: "1px solid rgba(45,42,38,0.08)",
          padding: "8px 20px",
          borderRadius: 20,
          fontSize: 12,
          color: "var(--text-secondary)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--interactive)";
          e.currentTarget.style.borderColor = "var(--interactive)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "var(--text-secondary)";
          e.currentTarget.style.borderColor = "rgba(45,42,38,0.08)";
        }}
      >
        Your Data
      </button>
    );
  }

  return (
    <div
      style={{
        background: "var(--surface-elevated)",
        border: "1px solid rgba(45,42,38,0.08)",
        borderRadius: 18,
        padding: "24px 20px",
        maxWidth: 360,
        margin: "0 auto",
        textAlign: "center",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <p
        style={{
          fontSize: 15,
          fontFamily: "'Fraunces', serif",
          fontWeight: 500,
          color: "var(--text-primary)",
          margin: "0 0 6px",
        }}
      >
        Your data lives only on this device
      </p>
      <p
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          margin: "0 0 20px",
          lineHeight: 1.5,
        }}
      >
        Nothing is ever sent to any server.
      </p>

      {status === "exported" && (
        <p style={{ fontSize: 13, color: "var(--interactive)", margin: "0 0 16px" }}>
          Data exported successfully.
        </p>
      )}
      {status === "deleted" && (
        <p style={{ fontSize: 13, color: "var(--crisis)", margin: "0 0 16px" }}>
          All data deleted.
        </p>
      )}

      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={handleExport}
          style={{
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 500,
            fontFamily: "'DM Sans', sans-serif",
            background: "var(--accent-sage-light)",
            color: "var(--interactive)",
            border: "1px solid var(--interactive)",
            borderRadius: 12,
            cursor: "pointer",
            transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          Export My Data
        </button>

        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{
              padding: "10px 22px",
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif",
              background: "transparent",
              color: "var(--text-muted)",
              border: "1px solid rgba(45,42,38,0.1)",
              borderRadius: 12,
              cursor: "pointer",
              transition: "all 300ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            Delete Everything
          </button>
        ) : (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleDelete}
              style={{
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                background: "var(--crisis)",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Confirm Delete
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              style={{
                padding: "10px 18px",
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid rgba(45,42,38,0.1)",
                borderRadius: 12,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => { setShowPanel(false); setConfirmDelete(false); }}
        style={{
          marginTop: 16,
          background: "none",
          border: "none",
          fontSize: 12,
          color: "var(--text-muted)",
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Close
      </button>
    </div>
  );
}
