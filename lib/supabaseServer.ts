import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  // Lazy: don't throw at import time so build doesn't crash without env.
}

export function getSupabaseServer() {
  if (!url || !serviceKey) {
    throw new Error("Supabase server env vars not configured");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type Booking = {
  id: string;
  booking_number: string;
  transport_type: "krankenfahrt" | "liegend" | "rollstuhl" | "taxi";
  pickup: string;
  destination: string;
  ride_date: string;
  ride_time: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  note_wheelchair: boolean;
  note_companion: boolean;
  note_lying: boolean;
  note_insurance: boolean;
  comment: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
};
