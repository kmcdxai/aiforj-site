"use client";

import { useState } from "react";
import ShareSheet from "./ShareSheet";

export default function ShareAfterSession({
  toolSlug,
  toolName,
  shift,
  cardType = "technique",
}) {
  const [open, setOpen] = useState(Boolean(shift == null || shift >= 0));

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="btn-secondary">
        Share a non-private calm card
      </button>
    );
  }

  return (
    <ShareSheet
      title={shift > 0 ? "This helped a little. Share the reset?" : "Share this reset without sharing your private details"}
      payload={{
        type: cardType,
        toolSlug,
        message: toolName ? `This ${toolName} reset helped me slow down.` : "This helped me slow down.",
        ref: "shared_card",
      }}
    />
  );
}
