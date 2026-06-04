import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(url && anonKey);

export const supabase = supabaseConfigured
  ? createClient(url!, anonKey!, { auth: { persistSession: false } })
  : null;

export type BookingRow = {
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
};
