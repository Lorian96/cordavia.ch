import type { NextRequest } from "next/server";

/**
 * Reverse-Geocoding: Koordinaten → Adresse.
 * Verwendet OpenStreetMap Nominatim (gratis, kein API-Key).
 */

const USER_AGENT = "VitaWay/1.0 (+https://vitaway.ch; info@vitaway.ch)";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lon = parseFloat(searchParams.get("lon") ?? "");

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json(
      { result: null, error: "invalid_coords" },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}` +
      `&format=json&addressdetails=1&accept-language=de&zoom=18`;
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    });
    if (!res.ok) {
      return Response.json(
        { result: null, error: "nominatim_error" },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }
    const data = (await res.json()) as {
      display_name?: string;
      lat?: string;
      lon?: string;
      address?: {
        road?: string;
        house_number?: string;
        postcode?: string;
        city?: string;
        town?: string;
        village?: string;
        municipality?: string;
        suburb?: string;
        state?: string;
        country_code?: string;
      };
    };

    const a = data.address ?? {};
    const street = [a.road, a.house_number].filter(Boolean).join(" ");
    const city = a.city || a.town || a.village || a.municipality || a.suburb || "";
    const cityPart = [a.postcode, city].filter(Boolean).join(" ");
    const primary =
      street || cityPart || (data.display_name ?? "").split(",")[0] || "";
    const secondary =
      street && cityPart
        ? [cityPart, a.state].filter(Boolean).join(", ")
        : a.state ?? "Schweiz";
    const full = [street, cityPart].filter(Boolean).join(", ") || data.display_name || "";

    return Response.json(
      {
        result: {
          primary,
          secondary,
          full,
          lat: parseFloat(data.lat ?? String(lat)),
          lon: parseFloat(data.lon ?? String(lon)),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[places/reverse] threw", err);
    return Response.json(
      { result: null, error: "server" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
