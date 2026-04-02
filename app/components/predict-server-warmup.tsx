"use client";

import { useEffect } from "react";

/**
 * Pings the Render backend once per full page load so the free-tier instance
 * can start waking before the user opens the prediction form.
 */
export function PredictServerWarmup() {
  useEffect(() => {
    void fetch("/api/ping-predict-server", { method: "GET" }).catch(() => {});
    void fetch("https://student-job-predition-server.onrender.com", { method: "GET" }).catch(() => {});
  }, []);

  return null;
}
