"use client";

import { useMemo, useState } from "react";
import {
  PRICES,
  calculatePrice,
  formatChf,
  SURCHARGE_PERCENT,
  type PriceCategory,
} from "@/lib/pricing";

export function PriceCalculator() {
  const [category, setCategory] = useState<PriceCategory>("krankenfahrt");
  const [km, setKm] = useState<number>(10);
  const [waitingMin, setWaitingMin] = useState<number>(0);
  const [nightOrHoliday, setNightOrHoliday] = useState<boolean>(false);

  const result = useMemo(
    () => calculatePrice({ category, km, waitingMinutes: waitingMin, nightOrHoliday }),
    [category, km, waitingMin, nightOrHoliday]
  );

  return (
    <div className="bg-white rounded-2xl border-2 border-navy-50 shadow-lg overflow-hidden">
      <div className="bg-navy-900 text-white px-6 py-4">
        <h3 className="text-xl font-bold">Fahrtkosten-Schätzer</h3>
        <p className="text-sm text-navy-50/70 mt-1">
          Unverbindliche Schätzung — exakter Preis nach Rückbestätigung
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Transport-Art */}
        <div>
          <label className="block text-sm font-semibold text-navy-900 mb-2">
            Transport-Art
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRICES.map((p) => {
              const active = category === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCategory(p.id)}
                  className={`px-3 py-2.5 rounded-lg border-2 text-sm font-semibold transition text-center ${
                    active
                      ? "bg-teal-500 border-teal-500 text-navy-950"
                      : "bg-white border-navy-100 text-navy-900 hover:border-teal-400"
                  }`}
                  aria-pressed={active}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Distanz */}
        <div>
          <label htmlFor="calc-km" className="block text-sm font-semibold text-navy-900 mb-2">
            Distanz in km:{" "}
            <span className="text-teal-600 font-bold text-base">{km} km</span>
          </label>
          <input
            id="calc-km"
            type="range"
            min={1}
            max={100}
            step={1}
            value={km}
            onChange={(e) => setKm(parseInt(e.target.value, 10))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-navy-800/60 mt-1">
            <span>1 km</span>
            <span>50 km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Wartezeit */}
        <div>
          <label htmlFor="calc-wait" className="block text-sm font-semibold text-navy-900 mb-2">
            Wartezeit (optional):{" "}
            <span className="text-teal-600 font-bold text-base">{waitingMin} Min</span>
          </label>
          <input
            id="calc-wait"
            type="range"
            min={0}
            max={120}
            step={5}
            value={waitingMin}
            onChange={(e) => setWaitingMin(parseInt(e.target.value, 10))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-xs text-navy-800/60 mt-1">
            <span>0 Min</span>
            <span>60 Min</span>
            <span>120 Min</span>
          </div>
        </div>

        {/* Nacht/Sonntag */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={nightOrHoliday}
            onChange={(e) => setNightOrHoliday(e.target.checked)}
            className="h-5 w-5 accent-teal-500 mt-0.5"
          />
          <span className="text-sm text-navy-900">
            Nacht (22-06 Uhr) oder Sonn-/Feiertag
            <span className="block text-xs text-navy-800/60">
              +{SURCHARGE_PERCENT}% Zuschlag
            </span>
          </span>
        </label>

        {/* Ergebnis */}
        <div className="rounded-xl bg-surface-muted p-5 border border-navy-50">
          <div className="space-y-1.5 text-sm">
            <Row label="Grundtaxe" value={formatChf(result.baseFee)} />
            <Row label={`${km} km × Kilometerpreis`} value={formatChf(result.kmCost)} />
            {result.waitingCost > 0 && (
              <Row label={`Wartezeit ${waitingMin} Min`} value={formatChf(result.waitingCost)} />
            )}
            {result.surchargeAmount > 0 && (
              <Row
                label={`Zuschlag Nacht/Sonntag (+${SURCHARGE_PERCENT}%)`}
                value={formatChf(result.surchargeAmount)}
              />
            )}
            <div className="border-t border-navy-200/50 my-2" />
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-navy-900">
                Geschätzter Preis
              </span>
              <span className="text-2xl font-black text-teal-600">
                {formatChf(result.total)}
              </span>
            </div>
            {result.appliedMinimum && (
              <p className="text-xs text-navy-800/65 italic">
                Mindestumsatz pro Fahrt angewendet.
              </p>
            )}
          </div>
        </div>

        <p className="text-xs text-navy-800/60">
          Dies ist eine unverbindliche Schätzung. Der endgültige Preis kann je nach
          Route, Verkehrslage und besonderen Anforderungen variieren. Wir
          bestätigen Ihnen den finalen Preis vor der Fahrt.
        </p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-navy-800/80">{label}</span>
      <span className="text-navy-900 font-mono">{value}</span>
    </div>
  );
}
