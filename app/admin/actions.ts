"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer, type Booking } from "@/lib/supabaseServer";
import { notifyCustomerOfBooking } from "@/lib/notify";
import type { BookingRow } from "@/lib/supabase";

function toRow(b: Booking): BookingRow {
  return {
    booking_number: b.booking_number,
    transport_type: b.transport_type,
    pickup: b.pickup,
    destination: b.destination,
    ride_date: b.ride_date,
    ride_time: b.ride_time,
    first_name: b.first_name,
    last_name: b.last_name,
    phone: b.phone,
    email: b.email,
    note_wheelchair: b.note_wheelchair,
    note_companion: b.note_companion,
    note_lying: b.note_lying,
    note_insurance: b.note_insurance,
    comment: b.comment,
  };
}

export async function setStatus(id: string, status: Booking["status"]) {
  const sb = getSupabaseServer();

  // Vorher den aktuellen Stand holen — wir brauchen alten Status + alle Felder für die Mail
  const { data: existing, error: fetchErr } = await sb
    .from("bookings")
    .select("*")
    .eq("id", id)
    .single();
  if (fetchErr || !existing) {
    return { ok: false, error: fetchErr?.message ?? "Buchung nicht gefunden" };
  }
  const previous = existing as Booking;

  const { error } = await sb
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }

  // Kunden-Bestätigungsmail nur beim Übergang von „nicht-confirmed" → „confirmed"
  if (status === "confirmed" && previous.status !== "confirmed") {
    notifyCustomerOfBooking(toRow(previous)).catch((err) =>
      console.error("[admin.setStatus] customer notify threw", err)
    );
  }

  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteBooking(id: string) {
  const sb = getSupabaseServer();
  const { error } = await sb.from("bookings").delete().eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/admin");
  return { ok: true };
}

export async function markCallbackDone(id: string) {
  const sb = getSupabaseServer();
  const { error } = await sb
    .from("callbacks")
    .update({ status: "done", done_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function reopenCallback(id: string) {
  const sb = getSupabaseServer();
  const { error } = await sb
    .from("callbacks")
    .update({ status: "pending", done_at: null })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteCallback(id: string) {
  const sb = getSupabaseServer();
  const { error } = await sb.from("callbacks").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin");
  return { ok: true };
}
