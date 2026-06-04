"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Address autocomplete via OpenStreetMap Nominatim.
 * - Frei, kein API-Key
 * - Limit: 1 Request pro Sekunde (laut Usage Policy)
 * - countrycodes=ch beschränkt auf Schweiz
 *
 * Bei stark steigendem Traffic später durch Google Places oder
 * Swiss-Post API ersetzen.
 */

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
    suburb?: string;
    state?: string;
  };
};

function formatResult(r: NominatimResult): { primary: string; secondary: string; full: string } {
  const a = r.address || {};
  const street = [a.road, a.house_number].filter(Boolean).join(" ");
  const city = a.city || a.town || a.village || a.municipality || a.suburb || "";
  const cityWithPostcode = a.postcode && city
    ? `${a.postcode} ${city}`
    : city || a.postcode || "";

  const primary = street || cityWithPostcode || r.display_name.split(",")[0];
  const secondary = street && cityWithPostcode
    ? cityWithPostcode + (a.state ? `, ${a.state}` : "")
    : (a.state ?? "Schweiz");

  const full = [street, cityWithPostcode].filter(Boolean).join(", ") || r.display_name;

  return { primary, secondary, full };
}

export function AddressAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  autoFocus,
  error,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
  error?: string | null;
}) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function handleInput(v: string) {
    setQuery(v);
    onChange(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();
    if (v.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    setOpen(true);
    debounceRef.current = setTimeout(async () => {
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const url =
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(v)}` +
          `&format=json&countrycodes=ch&limit=6&addressdetails=1&accept-language=de`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("API error");
        const data = (await res.json()) as NominatimResult[];
        setResults(data);
        setOpen(true);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  function select(r: NominatimResult) {
    const { full } = formatResult(r);
    setQuery(full);
    onChange(full);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <label className="block">
        <span className="block text-base font-semibold text-navy-900 mb-2">{label}</span>
        <input
          type="text"
          value={query}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={(e) => handleInput(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className={`w-full text-lg rounded-2xl border-2 px-4 py-3 outline-none transition ${
            error
              ? "border-red-400 bg-red-50 focus:border-red-500"
              : "border-navy-50 focus:border-teal-500"
          }`}
          aria-invalid={Boolean(error)}
          aria-autocomplete="list"
          aria-expanded={open}
          autoComplete="off"
        />
      </label>
      {error && <p className="text-sm text-red-700 mt-1.5">{error}</p>}
      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full bg-white border border-navy-100 rounded-2xl shadow-xl max-h-80 overflow-y-auto"
        >
          {loading && (
            <li className="px-4 py-3 text-navy-800/60 text-sm flex items-center gap-2">
              <span className="inline-block h-3 w-3 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              Suche Adressen…
            </li>
          )}
          {!loading && results.length === 0 && query.trim().length >= 3 && (
            <li className="px-4 py-3 text-navy-800/60 text-sm">
              Keine Treffer in der Schweiz. Tippen Sie z.B. „Bahnhofstrasse 1, 8001 Zürich".
            </li>
          )}
          {!loading &&
            results.map((r, i) => {
              const { primary, secondary } = formatResult(r);
              return (
                <li key={`${r.lat}-${r.lon}-${i}`} role="option">
                  <button
                    type="button"
                    onClick={() => select(r)}
                    className="w-full text-left px-4 py-3 hover:bg-teal-50 text-navy-900 border-b border-navy-50 last:border-0 transition"
                  >
                    <div className="font-semibold">{primary}</div>
                    <div className="text-sm text-navy-800/65">{secondary}</div>
                  </button>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
