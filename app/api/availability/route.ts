import type { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

/**
 * Liefert pro Datum die Liste der bestehenden Buchungszeiten (pending+confirmed)
 * + welche Tage komplett ausgebucht sind.
 *
 * Logik:
 *  - Buffer: 45 Min zwischen Buchungen (bidirektional)
 *  - Ein neuer Termin T ist gültig wenn: |T - tA| >= 45 für alle bestehenden tA
 *  - Service-Fenster: 06:00 bis 22:00
 *  - Tag voll = keine einzige Minute in [06:00, 22:00] ist gültig
 *  - Cancelled & completed Buchungen blockieren NICHT
 */

const BUFFER_MINUTES = 45;
const SERVICE_START = "06:00";
const SERVICE_END = "22:00";
const BLOCKING_STATUSES = ["pending", "confirmed"];

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

function isFreeMinute(t: number, existing: number[], buffer: number): boolean {
  for (const tA of existing) {
    if (Math.abs(t - tA) < buffer) return false;
  }
  return true;
}

function hasAnyFreeMinute(
  existing: number[],
  buffer: number,
  start: number,
  end: number
): boolean {
  for (let t = start; t <= end; t++) {
    if (isFreeMinute(t, existing, buffer)) return true;
  }
  return false;
}

function todayInZurich(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Zurich" });
}

export async function GET(_request: NextRequest) {
  const baseResponse = {
    bookingTimesByDate: {} as Record<string, string[]>,
    fullDays: [] as string[],
    bufferMinutes: BUFFER_MINUTES,
    serviceWindow: { start: SERVICE_START, end: SERVICE_END },
  };

  try {
    const sb = getSupabaseServer();
    const today = todayInZurich();

    const { data, error } = await sb
      .from("bookings")
      .select("ride_date, ride_time, status")
      .in("status", BLOCKING_STATUSES)
      .gte("ride_date", today);

    if (error) {
      console.error("[availability] supabase error", error);
      return Response.json(
        { ...baseResponse, error: "db" },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    const bookingTimesByDate: Record<string, string[]> = {};
    for (const row of (data ?? []) as { ride_date: string; ride_time: string }[]) {
      const time = row.ride_time.slice(0, 5); // "HH:MM:SS" → "HH:MM"
      const date = row.ride_date;
      if (!bookingTimesByDate[date]) bookingTimesByDate[date] = [];
      bookingTimesByDate[date].push(time);
    }

    const serviceStartMin = timeToMin(SERVICE_START);
    const serviceEndMin = timeToMin(SERVICE_END);
    const fullDays: string[] = [];

    for (const [date, times] of Object.entries(bookingTimesByDate)) {
      const mins = times.map(timeToMin);
      if (!hasAnyFreeMinute(mins, BUFFER_MINUTES, serviceStartMin, serviceEndMin)) {
        fullDays.push(date);
      }
      times.sort();
    }

    return Response.json(
      { ...baseResponse, bookingTimesByDate, fullDays },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (err) {
    console.error("[availability] threw", err);
    return Response.json(
      { ...baseResponse, error: "server" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
