import type { NextRequest } from "next/server";

/**
 * Adress-Suche.
 * Primär: Photon (Komoot, OSM-basiert, für Autocomplete optimiert).
 * Fallback: Nominatim, falls Photon nichts findet.
 *
 * Beide gratis, ohne API-Key. Wir cachen serverseitig 1h.
 */

const USER_AGENT = "VitaWay/1.0 (+https://vitaway.ch; info@vitaway.ch)";

// Switzerland bbox: W,S,E,N
const CH_BBOX = "5.96,45.82,10.49,47.81";

type PlaceResult = {
  primary: string;
  secondary: string;
  full: string;
  lat?: number;
  lon?: number;
};

type PhotonFeature = {
  type: "Feature";
  geometry: { coordinates: [number, number] };
  properties: {
    osm_id?: number;
    osm_value?: string;
    countrycode?: string;
    country?: string;
    state?: string;
    city?: string;
    locality?: string;
    district?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
    name?: string;
    type?: string;
  };
};

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    house_number?: string;
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
  };
};

function normalizePhoton(f: PhotonFeature): PlaceResult {
  const p = f.properties;
  const street = [p.street, p.housenumber].filter(Boolean).join(" ");
  const city = p.city || p.locality || p.district || "";
  const cityPart = [p.postcode, city].filter(Boolean).join(" ");

  let primary: string;
  let secondary: string;
  let full: string;

  if (street) {
    primary = street;
    secondary = [cityPart, p.state].filter(Boolean).join(", ") || "Schweiz";
    full = [street, cityPart].filter(Boolean).join(", ");
  } else if (p.name) {
    primary = p.name;
    secondary = [cityPart, p.state].filter(Boolean).join(", ") || "Schweiz";
    full = [p.name, cityPart].filter(Boolean).join(", ");
  } else if (cityPart) {
    primary = cityPart;
    secondary = p.state ? `${p.state}, Schweiz` : "Schweiz";
    full = cityPart;
  } else {
    primary = "Unbekannt";
    secondary = "";
    full = "";
  }

  const [lon, lat] = f.geometry.coordinates;
  return { primary, secondary, full, lat, lon };
}

function normalizeNominatim(r: NominatimResult): PlaceResult {
  const a = r.address || {};
  const street = [a.road, a.house_number].filter(Boolean).join(" ");
  const city = a.city || a.town || a.village || a.municipality || "";
  const cityPart = [a.postcode, city].filter(Boolean).join(" ");

  const primary = street || cityPart || r.display_name.split(",")[0];
  const secondary = street && cityPart
    ? [cityPart, a.state].filter(Boolean).join(", ")
    : (a.state ?? "Schweiz");
  const full = [street, cityPart].filter(Boolean).join(", ") || r.display_name;

  return {
    primary,
    secondary,
    full,
    lat: parseFloat(r.lat),
    lon: parseFloat(r.lon),
  };
}

async function searchPhoton(q: string): Promise<PlaceResult[]> {
  const url =
    `https://photon.komoot.io/api?q=${encodeURIComponent(q)}` +
    `&limit=8&lang=de&bbox=${CH_BBOX}`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { features?: PhotonFeature[] };
  return (data.features ?? [])
    .filter((f) => f.properties.countrycode === "CH" || f.properties.country === "Switzerland")
    .map(normalizePhoton)
    .filter((r) => r.full); // empty rejects
}

async function searchNominatim(q: string): Promise<PlaceResult[]> {
  const url =
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}` +
    `&format=json&countrycodes=ch&limit=6&addressdetails=1&accept-language=de`;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as NominatimResult[];
  return data.map(normalizeNominatim);
}

function dedupe(results: PlaceResult[]): PlaceResult[] {
  const seen = new Set<string>();
  const out: PlaceResult[] = [];
  for (const r of results) {
    const key = r.full.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(r);
  }
  return out;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (q.length < 3) {
    return Response.json({ results: [] });
  }

  try {
    // Primär Photon
    let results = await searchPhoton(q);

    // Wenn dünn, Nominatim dazu
    if (results.length < 3) {
      const fallback = await searchNominatim(q);
      results = dedupe([...results, ...fallback]);
    }

    return Response.json(
      { results: results.slice(0, 8) },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=3600" } }
    );
  } catch (err) {
    console.error("[places] error", err);
    return Response.json({ results: [], error: "search_unavailable" }, { status: 200 });
  }
}
