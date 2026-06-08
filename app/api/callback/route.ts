import type { NextRequest } from "next/server";
import { notifyCallbackRequest } from "@/lib/notify";

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

  if (!firstName || !lastName || !phone) {
    return Response.json({ error: "Bitte Name und Telefon angeben." }, { status: 400 });
  }
  if (!SWISS_PHONE.test(phone.replace(/\s+/g, ""))) {
    return Response.json({ error: "Bitte gültige Schweizer Telefonnummer." }, { status: 400 });
  }

  notifyCallbackRequest({
    firstName,
    lastName,
    phone,
    preferredTime: (payload.preferredTime ?? "").trim(),
    note: (payload.note ?? "").trim(),
  }).catch((err) => console.error("[callback] notify failed", err));

  return Response.json({ ok: true });
}
