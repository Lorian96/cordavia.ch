"use client";

import { useMemo, useState } from "react";
import type { Booking } from "@/lib/supabaseServer";

const HOUR_START = 6;   // 06:00
const HOUR_END = 22;    // 22:00 inclusive
const HOUR_HEIGHT = 56; // px
const BLOCK_DURATION_MIN = 40; // 40-min Puffer pro Buchung
const MIN_BLOCK_HEIGHT = 38;

const STATUS_STYLES: Record<
  Booking["status"],
  { bg: string; border: string; label: string }
> = {
  pending: { bg: "bg-rose-500", border: "border-rose-600", label: "Offen" },
  confirmed: { bg: "bg-sky-500", border: "border-sky-600", label: "Bestätigt" },
  completed: { bg: "bg-emerald-500", border: "border-emerald-600", label: "Erledigt" },
  cancelled: { bg: "bg-slate-400", border: "border-slate-500", label: "Storniert" },
};

const TRANSPORT_ABBR: Record<Booking["transport_type"], string> = {
  krankenfahrt: "KF",
  liegend: "LT",
  rollstuhl: "RT",
  taxi: "TX",
};

const WEEKDAY_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function ymd(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();         // 0=So, 1=Mo, ...
  const diff = (day === 0 ? -6 : 1) - day; // Mo-first
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

function focusBookingInList(id: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(`booking-${id}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("ring-2", "ring-teal-500", "ring-offset-2");
  window.setTimeout(() => {
    el.classList.remove("ring-2", "ring-teal-500", "ring-offset-2");
  }, 1800);
}

export function BookingPlanner({ bookings }: { bookings: Booking[] }) {
  const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()));

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const todayYmd = useMemo(() => ymd(new Date()), []);

  const bookingsByDate = useMemo(() => {
    const map: Record<string, Booking[]> = {};
    for (const b of bookings) {
      if (!map[b.ride_date]) map[b.ride_date] = [];
      map[b.ride_date].push(b);
    }
    return map;
  }, [bookings]);

  const weekBookingsCount = useMemo(
    () =>
      weekDays.reduce(
        (sum, d) => sum + (bookingsByDate[ymd(d)]?.length ?? 0),
        0
      ),
    [weekDays, bookingsByDate]
  );

  const totalHeight = (HOUR_END - HOUR_START + 1) * HOUR_HEIGHT;

  return (
    <section className="bg-white rounded-2xl border border-navy-50 shadow-sm overflow-hidden mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-navy-50">
        <div>
          <h2 className="text-xl font-bold text-navy-900">Planer</h2>
          <p className="text-sm text-navy-800/65">
            Woche vom{" "}
            {weekStart.toLocaleDateString("de-CH", { day: "2-digit", month: "long" })} bis{" "}
            {addDays(weekStart, 6).toLocaleDateString("de-CH", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            {" · "}
            {weekBookingsCount === 0
              ? "keine Buchungen"
              : `${weekBookingsCount} Buchung${weekBookingsCount === 1 ? "" : "en"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekStart((s) => addDays(s, -7))}
            className="px-3 py-2 rounded-lg border border-navy-200 hover:bg-navy-50 transition text-sm font-medium"
            aria-label="Vorherige Woche"
          >
            ‹ Vorherige
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(getWeekStart(new Date()))}
            className="px-4 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 transition text-sm font-semibold"
          >
            Heute
          </button>
          <button
            type="button"
            onClick={() => setWeekStart((s) => addDays(s, 7))}
            className="px-3 py-2 rounded-lg border border-navy-200 hover:bg-navy-50 transition text-sm font-medium"
            aria-label="Nächste Woche"
          >
            Nächste ›
          </button>
        </div>
      </div>

      {/* Legende */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 bg-navy-50/40 border-b border-navy-50 text-xs text-navy-800/80">
        {Object.entries(STATUS_STYLES).map(([key, s]) => (
          <span key={key} className="inline-flex items-center gap-2">
            <span className={`inline-block h-3 w-3 rounded ${s.bg}`} />
            {s.label}
          </span>
        ))}
        <span className="ml-auto text-navy-800/60">
          Klick auf eine Buchung → Details in der Liste unten
        </span>
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          {/* Header row */}
          <div
            className="grid border-b border-navy-50 bg-white"
            style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}
          >
            <div /> {/* time gutter */}
            {weekDays.map((d, i) => {
              const isToday = ymd(d) === todayYmd;
              return (
                <div
                  key={i}
                  className={`p-2 text-center border-l border-navy-50 ${
                    isToday ? "bg-teal-50" : ""
                  }`}
                >
                  <div className="text-xs font-semibold text-navy-800/70 uppercase">
                    {WEEKDAY_LABELS[i]}
                  </div>
                  <div
                    className={`text-base font-bold ${
                      isToday ? "text-teal-600" : "text-navy-900"
                    }`}
                  >
                    {pad(d.getDate())}.{pad(d.getMonth() + 1)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grid body */}
          <div
            className="grid relative"
            style={{
              gridTemplateColumns: "64px repeat(7, 1fr)",
              height: `${totalHeight}px`,
            }}
          >
            {/* Time axis */}
            <div className="border-r border-navy-50">
              {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => {
                const h = HOUR_START + i;
                return (
                  <div
                    key={h}
                    className="text-xs text-navy-800/60 font-mono text-right pr-2 border-b border-navy-50/70"
                    style={{ height: `${HOUR_HEIGHT}px`, lineHeight: "16px" }}
                  >
                    {pad(h)}:00
                  </div>
                );
              })}
            </div>

            {/* Day columns */}
            {weekDays.map((d, di) => {
              const dateStr = ymd(d);
              const dayBookings = bookingsByDate[dateStr] ?? [];
              const isToday = dateStr === todayYmd;
              return (
                <div
                  key={di}
                  className={`relative border-l border-navy-50 ${
                    isToday ? "bg-teal-50/40" : ""
                  }`}
                  style={{ height: `${totalHeight}px` }}
                >
                  {/* Hour gridlines */}
                  {Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, hi) => (
                    <div
                      key={hi}
                      className="border-b border-navy-50/60"
                      style={{ height: `${HOUR_HEIGHT}px` }}
                    />
                  ))}

                  {/* Booking blocks */}
                  {dayBookings.map((b) => {
                    const minutes = timeToMin(b.ride_time);
                    const offsetMin = minutes - HOUR_START * 60;
                    if (offsetMin < 0 || offsetMin > (HOUR_END - HOUR_START + 1) * 60) {
                      return null;
                    }
                    const top = (offsetMin / 60) * HOUR_HEIGHT;
                    const height = Math.max(
                      MIN_BLOCK_HEIGHT,
                      (BLOCK_DURATION_MIN / 60) * HOUR_HEIGHT
                    );
                    const s = STATUS_STYLES[b.status];
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => focusBookingInList(b.id)}
                        className={`absolute left-1 right-1 ${s.bg} border-l-4 ${s.border} rounded-md px-2 py-1 text-white shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:scale-[1.02] transition text-left`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        title={`${b.booking_number} · ${b.first_name} ${b.last_name} · ${b.ride_time.slice(0, 5)} · ${s.label}`}
                      >
                        <div className="text-[11px] font-bold leading-tight">
                          {b.ride_time.slice(0, 5)} · {TRANSPORT_ABBR[b.transport_type]}
                        </div>
                        <div className="text-[11px] leading-tight truncate">
                          {b.first_name} {b.last_name}
                        </div>
                        <div className="text-[10px] leading-tight truncate opacity-85 font-mono">
                          {b.booking_number}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
