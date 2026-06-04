import type { NextRequest } from "next/server";
import { supabase, supabaseConfigured, type BookingRow } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { notifyAdminOfBooking } from "@/lib/notify";

const BUFFER_MINUTES = 45;
const SERVICE_START_MIN = 6 * 60;
const SERVICE_END_MIN = 22 * 60;

function timeToMin(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10));
  return h * 60 + (m || 0);
}

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
    "email",
  ];
  for (const key of required) {
    if (!payload[key]) {
      return Response.json({ error: `Pflichtfeld fehlt: ${key}` }, { status: 400 });
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email!.trim())) {
    return Response.json({ error: "Bitte gültige E-Mail-Adresse angeben." }, { status: 400 });
  }

  // Zeit-Validierung: Service-Fenster + Puffer gegen bestehende Buchungen
  if (!/^\d{2}:\d{2}$/.test(payload.time!)) {
    return Response.json({ error: "Ungültiges Zeit-Format." }, { status: 400 });
  }
  const requestedMin = timeToMin(payload.time!);
  if (requestedMin < SERVICE_START_MIN || requestedMin > SERVICE_END_MIN) {
    return Response.json(
      { error: "Wir fahren von 06:00 bis 22:00. Für andere Zeiten bitte anrufen." },
      { status: 400 }
    );
  }

  try {
    const adminSb = getSupabaseServer();
    const { data: existing, error: fetchErr } = await adminSb
      .from("bookings")
      .select("ride_time, booking_number")
      .eq("ride_date", payload.date!)
      .in("status", ["pending", "confirmed"]);
    if (!fetchErr && existing) {
      for (const r of existing as { ride_time: string; booking_number: string }[]) {
        const otherMin = timeToMin(r.ride_time);
        if (Math.abs(requestedMin - otherMin) < BUFFER_MINUTES) {
          return Response.json(
            {
              error: `Die gewählte Zeit ist zu nah an einer bestehenden Buchung. Mindestens ${BUFFER_MINUTES} Min Abstand nötig.`,
            },
            { status: 409 }
          );
        }
      }
    }
  } catch (err) {
    // Falls die Validierung serverseitig nicht klappt, akzeptieren wir die Buchung
    // (Admin sieht es im Dashboard). Loggen und weiter.
    console.error("[booking] availability check failed", err);
  }

  const bookingNumber =
    "CD-" +
    Date.now().toString(36).toUpperCase().slice(-6) +
    "-" +
    Math.random().toString(36).toUpperCase().slice(2, 5);

  const trimmedEmail = payload.email?.trim().toLowerCase();
  const row: BookingRow = {
    booking_number: bookingNumber,
    transport_type: payload.transportType!,
    pickup: payload.pickup!.trim(),
    destination: payload.destination!.trim(),
    ride_date: payload.date!,
    ride_time: payload.time!,
    first_name: payload.firstName!.trim(),
    last_name: payload.lastName!.trim(),
    phone: payload.phone?.trim() || "",
    email: trimmedEmail || "",
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

  // Admin-Mail sofort raus. Kunden-Bestätigung erst bei manueller Bestätigung im Admin-Dashboard.
  notifyAdminOfBooking(row).catch((err) => console.error("[booking] admin notify threw", err));

  return Response.json({ ok: true, bookingNumber });
}
