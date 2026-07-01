import type { NextRequest } from "next/server";
import { notifyCallbackRequest } from "@/lib/notify";
import { getSupabaseServer } from "@/lib/supabaseServer";

type CallbackPayload = {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredTime?: string;
  note?: string;
};

const SWISS_PHONE = /^(\+41|0041|0)[\s\-]?[1-9](?:[\s\-]?\d){8}$/;

export async function POST(req: NextRequest) {
  let payload: CallbackPayload;
  try {
    payload = (await req.json()) as CallbackPayload;
  } catch {
    return Response.json({ error: "Ungültige Anfrage" }, { status: 400 });
  }

  const firstName = (payload.firstName ?? "").trim();
  const lastName = (payload.lastName ?? "").trim();
  const phone = (payload.phone ?? "").trim();
  const preferredTime = (payload.preferredTime ?? "").trim() || null;
  const note = (payload.note ?? "").trim() || null;

  if (!firstName || !lastName || !phone) {
    return Response.json({ error: "Bitte Name und Telefon angeben." }, { status: 400 });
  }
  if (!SWISS_PHONE.test(phone.replace(/\s+/g, ""))) {
    return Response.json({ error: "Bitte gültige Schweizer Telefonnummer." }, { status: 400 });
  }

  // In DB speichern (für Admin-Anzeige)
  try {
    const sb = getSupabaseServer();
    const { error } = await sb.from("callbacks").insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      preferred_time: preferredTime,
      note,
    });
    if (error) {
      console.error("[callback] db insert failed", error.message);
      // Wir blockieren die Anfrage nicht, falls DB-Insert fehlschlägt — Email geht trotzdem raus
    }
  } catch (err) {
    console.error("[callback] db threw", err);
  }

  notifyCallbackRequest({
    firstName,
    lastName,
    phone,
    preferredTime: preferredTime ?? "",
    note: note ?? "",
  }).catch((err) => console.error("[callback] notify failed", err));

  return Response.json({ ok: true });
}
