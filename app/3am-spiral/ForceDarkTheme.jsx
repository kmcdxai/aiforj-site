"use client";

import { useEffect } from "react";

export default function ForceDarkTheme() {
  useEffect(() => {
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "dark");
    return () => {
      if (prev) document.documentElement.setAttribute("data-theme", prev);
    };
  }, []);
  return null;
}
