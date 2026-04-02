import { NextResponse } from "next/server";

/** Root URL of your Render app — wakes the service from sleep (cold start). */
const DEFAULT_PING_URL = "https://student-job-predition-server.onrender.com/";

export async function GET() {
  const url =
    process.env.PREDICT_SERVER_PING_URL?.trim() || DEFAULT_PING_URL;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    console.log("Pinging predict server", url);
    await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeout);
  } catch {
    // Best-effort wake; Render may still be starting.
  }

  return new NextResponse(null, { status: 204 });
}
