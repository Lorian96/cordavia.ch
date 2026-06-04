import type { NextRequest } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

/**
 * Liefert blockierte Zeitslots pro Datum und voll-belegte Tage.
 *
 * Slot-System:
 *  - Slots in 10-Minuten-Schritten von 06:00 bis 22:00 (97 Slots/Tag)
 *  - Pro Buchung (status: pending oder confirmed) werden 4 Slots blockiert:
 *    der gebuchte Slot + 3 darauf folgende = 40 Min Puffer
 *  - Cancelled & completed Buchungen blockieren NICHT
 *
 * Response:
 *  {
 *    blockedByDate: { "YYYY-MM-DD": ["HH:MM", ...] },
 *    fullDays: ["YYYY-MM-DD", ...],
 *    slotStart: "06:00", slotEnd: "22:00", stepMinutes: 10
 *  }
 */

const SLOT_START_MIN = 6 * 60; // 06:00
const SLOT_END_MIN = 22 * 60;  // 22:00 inclusive
const SLOT_STEP = 10;
const BLOCK_SLOTS = 4; // booking slot + 3 buffer = 40 min total
const BLOCKING_STATUSES = ["pending", "confirmed"];

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

function minToTime(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

function totalSlotCount(): number {
  return Math.floor((SLOT_END_MIN - SLOT_START_MIN) / SLOT_STEP) + 1;
}

function todayInZurich(): string {
  // YYYY-MM-DD in Europe/Zurich
  return new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Zurich" });
}

export async function GET(_request: NextRequest) {
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
        { blockedByDate: {}, fullDays: [], error: "db" },
        { status: 200, headers: { "Cache-Control": "no-store" } }
      );
    }

    const blockedByDate: Record<string, Set<string>> = {};

    for (const row of (data ?? []) as { ride_date: string; ride_time: string }[]) {
      const date = row.ride_date;
      const minutes = timeToMin(row.ride_time);
      const startSlotMin = Math.floor(minutes / SLOT_STEP) * SLOT_STEP;

      if (!blockedByDate[date]) blockedByDate[date] = new Set();

      for (let i = 0; i < BLOCK_SLOTS; i++) {
        const slotMin = startSlotMin + i * SLOT_STEP;
        if (slotMin >= SLOT_START_MIN && slotMin <= SLOT_END_MIN) {
          blockedByDate[date].add(minToTime(slotMin));
        }
      }
    }

    const blockedOut: Record<string, string[]> = {};
    const fullDays: string[] = [];
    const totalSlots = totalSlotCount();

    for (const [date, set] of Object.entries(blockedByDate)) {
      blockedOut[date] = Array.from(set).sort();
      if (set.size >= totalSlots) {
        fullDays.push(date);
      }
    }

    return Response.json(
      {
        blockedByDate: blockedOut,
        fullDays,
        slotStart: minToTime(SLOT_START_MIN),
        slotEnd: minToTime(SLOT_END_MIN),
        stepMinutes: SLOT_STEP,
        bufferMinutes: BLOCK_SLOTS * SLOT_STEP,
      },
      {
        headers: {
          // No-cache: Buchungen kommen jederzeit rein, Verfügbarkeit muss live sein
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (err) {
    console.error("[availability] threw", err);
    return Response.json(
      { blockedByDate: {}, fullDays: [], error: "server" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  }
}
