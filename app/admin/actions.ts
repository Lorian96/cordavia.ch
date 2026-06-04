"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer, type Booking } from "@/lib/supabaseServer";

export async function setStatus(id: string, status: Booking["status"]) {
  const sb = getSupabaseServer();
  const { error } = await sb
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
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
