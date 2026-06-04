import type { NextRequest } from "next/server";
import { supabase, supabaseConfigured, type BookingRow } from "@/lib/supabase";
import { notifyAdminOfBooking } from "@/lib/notify";

type IncomingBooking = {
  transportType?: "krankenfahrt" | "liegend" | "rollstuhl" | "taxi";
  pickup?: string;
  destination?: string;
  date?: string;
  time?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  notes?: {
    wheelchair?: boolean;
    companion?: boolean;
    lying?: boolean;
    insurance?: boolean;
  };
  comment?: string;
};

export async function POST(request: NextRequest) {
  let payload: IncomingBooking;
  try {
    payload = (await request.json()) as IncomingBooking;
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const required: (keyof IncomingBooking)[] = [
    "transportType",
    "pickup",
    "destination",
    "date",
    "time",
    "firstName",
    "lastName",
    "phone",
    "email",
  ];
  for (const key of required) {
    if (!payload[key]) {
      return Response.json({ error: `Pflichtfeld fehlt: ${key}` }, { status: 400 });
    }
  }

  const bookingNumber =
    "CD-" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    "-" +
    Math.random().toString(36).toUpperCase().slice(2, 5);

  const row: BookingRow = {
    booking_number: bookingNumber,
    transport_type: payload.transportType!,
    pickup: payload.pickup!.trim(),
    destination: payload.destination!.trim(),
    ride_date: payload.date!,
    ride_time: payload.time!,
    first_name: payload.firstName!.trim(),
    last_name: payload.lastName!.trim(),
    phone: payload.phone!.trim(),
    email: payload.email!.trim().toLowerCase(),
    note_wheelchair: Boolean(payload.notes?.wheelchair),
    note_companion: Boolean(payload.notes?.companion),
    note_lying: Boolean(payload.notes?.lying),
    note_insurance: Boolean(payload.notes?.insurance),
    comment: payload.comment?.trim() || null,
  };

  if (supabaseConfigured && supabase) {
    const { error } = await supabase.from("bookings").insert(row);
    if (error) {
      console.error("[booking] supabase insert failed", error);
      return Response.json(
        { error: "Buchung konnte nicht gespeichert werden. Bitte rufen Sie uns an." },
        { status: 500 }
      );
    }
    console.log("[booking] saved to supabase", { bookingNumber });
  } else {
    console.log("[booking] supabase not configured — booking received but NOT persisted", { bookingNumber, row });
  }

  // Fire-and-forget admin email (errors logged, never block the response)
  notifyAdminOfBooking(row).catch((err) => console.error("[booking] notify threw", err));

  return Response.json({ ok: true, bookingNumber });
}
