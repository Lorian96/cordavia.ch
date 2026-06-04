import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  if (!payload || typeof payload !== "object") {
    return Response.json({ error: "Ungültige Daten" }, { status: 400 });
  }

  const b = payload as Record<string, unknown>;
  const required = ["transportType", "pickup", "destination", "date", "time", "firstName", "lastName", "phone", "email"] as const;
  for (const key of required) {
    if (!b[key]) {
      return Response.json({ error: `Pflichtfeld fehlt: ${key}` }, { status: 400 });
    }
  }

  const bookingNumber =
    "SU-" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    "-" +
    Math.random().toString(36).toUpperCase().slice(2, 5);

  console.log("[booking received]", { bookingNumber, payload: b });

  return Response.json({ ok: true, bookingNumber });
}
