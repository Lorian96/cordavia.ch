import type { NextRequest } from "next/server";

/**
 * Address search proxy.
 * Backend: OpenStreetMap Nominatim (gratis, kein API-Key, max ~1 req/s laut Usage Policy).
 *
 * Warum Proxy:
 *  - Nominatim verlangt einen sauberen User-Agent (nicht der Browser-Default)
 *  - Wir können hier cachen, Rate-Limit anpassen, und später den Provider wechseln
 *  - Vermeidet CORS- / Tracking-Probleme im Browser
 */

const USER_AGENT = "Cordavia/1.0 (+https://cordavia.ch; info@cordavia.ch)";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 3) {
    return Response.json({ results: [] });
  }

  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}` +
    `&format=json&countrycodes=ch&limit=6&addressdetails=1&accept-language=de`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json",
        "Accept-Language": "de",
      },
      // Eigenes Cache-Verhalten: 1h pro Query
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error("[places] nominatim error", res.status);
      return Response.json({ results: [], error: "search_unavailable" }, { status: 200 });
    }

    const data = await res.json();
    return Response.json(
      { results: Array.isArray(data) ? data : [] },
      {
        headers: {
          // Browser-Cache für identische Queries — spart Server-Roundtrips
          "Cache-Control": "public, max-age=300, s-maxage=3600",
        },
      }
    );
  } catch (err) {
    console.error("[places] fetch threw", err);
    return Response.json({ results: [], error: "search_unavailable" }, { status: 200 });
  }
}
