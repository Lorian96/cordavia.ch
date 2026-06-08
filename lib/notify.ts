import type { BookingRow } from "@/lib/supabase";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL } from "@/lib/contact";

const TRANSPORT_LABEL: Record<BookingRow["transport_type"], string> = {
  krankenfahrt: "Krankenfahrt",
  liegend: "Liegendtransport",
  rollstuhl: "Rollstuhltransport",
  taxi: "Taxi",
};

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-CH", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function sendResend(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  text: string;
  reply_to?: string;
}): Promise<{ ok: true } | { ok: false; status: number; body: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, status: 0, body: "no api key" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    return { ok: false, status: res.status, body: await res.text() };
  }
  return { ok: true };
}

export async function notifyAdminOfBooking(row: BookingRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "VitaWay <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.log("[notify] RESEND_API_KEY or ADMIN_NOTIFY_EMAIL not set — skipping email");
    return;
  }

  const notes: string[] = [];
  if (row.note_wheelchair) notes.push("Rollstuhl");
  if (row.note_companion) notes.push("Begleitperson");
  if (row.note_lying) notes.push("Liegend");
  if (row.note_insurance) notes.push("Krankenkassen-Abrechnung");

  const subject = `Neue Buchung ${row.booking_number} — ${TRANSPORT_LABEL[row.transport_type]} am ${fmtDate(row.ride_date)}`;

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#0B2545;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(11,37,69,0.08);">
        <tr><td style="background:#0B2545;color:#fff;padding:20px 28px;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">VitaWay · Admin-Benachrichtigung</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Neue Buchung eingegangen</div>
        </td></tr>
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;">
            Es ist eine neue Buchung über vitaway.ch reingekommen.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:160px;color:#64748b;">Buchungsnummer</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:700;">${esc(row.booking_number)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Transport-Art</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(TRANSPORT_LABEL[row.transport_type])}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Termin</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(fmtDate(row.ride_date))} um <b>${esc(row.ride_time)}</b></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Abholung</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(row.pickup)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Ziel</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(row.destination)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Kunde</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><b>${esc(row.first_name)} ${esc(row.last_name)}</b></td></tr>
            ${row.email && row.email.length > 0 ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">E-Mail</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="mailto:${esc(row.email)}" style="color:#0B2545;">${esc(row.email)}</a></td></tr>` : ""}
            ${row.phone && row.phone.length > 0 ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Telefon</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="tel:${esc(row.phone)}" style="color:#0B2545;">${esc(row.phone)}</a></td></tr>` : ""}
            ${notes.length ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Hinweise</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(notes.join(", "))}</td></tr>` : ""}
            ${row.comment ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Kommentar</td><td style="padding:8px 0;white-space:pre-wrap;">${esc(row.comment)}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://vitaway.ch/admin" style="display:inline-block;background:#14B8A6;color:#0B2545;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;">Im Admin-Dashboard öffnen</a>
          </div>
        </td></tr>
        <tr><td style="background:#f1f5f9;padding:16px 28px;color:#64748b;font-size:12px;text-align:center;">
          VitaWay · Wir kümmern uns. Auf jedem Weg. · <a href="https://vitaway.ch" style="color:#0B2545;">vitaway.ch</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Neue Buchung ${row.booking_number}`,
    "",
    `Transport: ${TRANSPORT_LABEL[row.transport_type]}`,
    `Termin: ${fmtDate(row.ride_date)} um ${row.ride_time}`,
    `Von: ${row.pickup}`,
    `Nach: ${row.destination}`,
    "",
    `Kunde: ${row.first_name} ${row.last_name}`,
    row.email && row.email.length > 0 ? `E-Mail: ${row.email}` : "",
    row.phone && row.phone.length > 0 ? `Telefon: ${row.phone}` : "",
    notes.length ? `Hinweise: ${notes.join(", ")}` : "",
    row.comment ? `Kommentar: ${row.comment}` : "",
    "",
    "Admin: https://vitaway.ch/admin",
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        text,
        ...(row.email && row.email.length > 0 ? { reply_to: row.email } : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[notify] resend send failed", res.status, body);
      return;
    }
    console.log("[notify] email sent to admin", { bookingNumber: row.booking_number });
  } catch (err) {
    console.error("[notify] resend send threw", err);
  }
}

/**
 * Rückruf-Anforderung: einfache Admin-Mail mit Name + Telefon + Wunschzeit.
 */
export async function notifyCallbackRequest(req: {
  firstName: string;
  lastName: string;
  phone: string;
  preferredTime?: string;
  note?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "VitaWay <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.log("[callback] RESEND_API_KEY or ADMIN_NOTIFY_EMAIL not set — skipping");
    return;
  }

  const subject = `📞 Rückruf-Anforderung: ${req.firstName} ${req.lastName} — ${req.phone}`;

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#0B2545;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(11,37,69,0.08);">
        <tr><td style="background:#0B2545;color:#fff;padding:20px 28px;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">VitaWay · Rückruf</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Ein Kunde möchte zurückgerufen werden</div>
        </td></tr>
        <tr><td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:15px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:160px;color:#64748b;">Name</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:700;">${esc(req.firstName)} ${esc(req.lastName)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Telefon</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:700;"><a href="tel:${esc(req.phone)}" style="color:#0B2545;">${esc(req.phone)}</a></td></tr>
            ${req.preferredTime ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Wunschzeit</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(req.preferredTime)}</td></tr>` : ""}
            ${req.note ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Notiz</td><td style="padding:8px 0;white-space:pre-wrap;">${esc(req.note)}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="tel:${esc(req.phone)}" style="display:inline-block;background:#14B8A6;color:#0B2545;font-weight:700;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:16px;">📞 Jetzt zurückrufen</a>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Rückruf-Anforderung von ${req.firstName} ${req.lastName}`,
    `Telefon: ${req.phone}`,
    req.preferredTime ? `Wunschzeit: ${req.preferredTime}` : "",
    req.note ? `Notiz: ${req.note}` : "",
  ].filter(Boolean).join("\n");

  const result = await sendResend({ from, to: [to], subject, html, text });
  if (!result.ok) {
    console.error("[callback] resend failed", result.status, result.body);
  } else {
    console.log("[callback] email sent to admin", { phone: req.phone });
  }
}

/**
 * Bestätigungsmail an den Kunden (wenn er eine Email angegeben hat).
 * Domain `vitaway.ch` bei Resend verifiziert; `RESEND_CUSTOMER_FROM=bestaetigung@vitaway.ch`.
 */
export async function notifyCustomerOfBooking(row: BookingRow) {
  if (!row.email || row.email.length === 0) {
    return; // Kunde hat keine Email angegeben
  }

  const from = process.env.RESEND_CUSTOMER_FROM || "";
  if (!from) {
    console.log(
      "[notify-customer] RESEND_CUSTOMER_FROM not set — domain bei Resend noch nicht verifiziert, skipping",
      { bookingNumber: row.booking_number, customerEmail: row.email }
    );
    return;
  }

  const subject = `Ihre Fahrt am ${fmtDate(row.ride_date)} ist bestätigt — VitaWay`;
  const phoneLine = row.phone && row.phone.length > 0
    ? `<p style="margin:0 0 16px 0;font-size:14px;color:#64748b;line-height:1.6;">Wir haben Ihre Telefonnummer <a href="tel:${esc(row.phone)}" style="color:#0B2545;">${esc(row.phone)}</a> für mögliche Rückfragen notiert.</p>`
    : "";

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f6f4;font-family:Arial,Helvetica,sans-serif;color:#0B2545;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f6f4;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(11,37,69,0.08);">
        <tr><td style="background:#0B2545;color:#fff;padding:24px 28px;">
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">VitaWay</div>
          <div style="font-size:24px;font-weight:700;margin-top:4px;">Ihre Fahrt ist bestätigt</div>
        </td></tr>
        <tr><td style="padding:28px;">
          <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;">
            Guten Tag <b>${esc(row.first_name)} ${esc(row.last_name)}</b>,
          </p>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;">
            wir bestätigen Ihnen hiermit Ihre gebuchte Fahrt. Bitte sehen Sie
            die Details unten und kontaktieren Sie uns, falls etwas geändert
            werden muss.
          </p>
          ${phoneLine}
          <div style="background:#f5f9fc;border-radius:12px;padding:18px 20px;margin:20px 0;">
            <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Buchungsnummer</div>
            <div style="font-size:22px;font-weight:700;font-family:'Courier New',monospace;letter-spacing:2px;">${esc(row.booking_number)}</div>
          </div>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:160px;color:#64748b;">Transport-Art</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">${esc(TRANSPORT_LABEL[row.transport_type])}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Datum</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(fmtDate(row.ride_date))}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Gewünschte Abholzeit</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:600;">${esc(row.ride_time)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;vertical-align:top;">Abholort</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(row.pickup)}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Zielort</td><td style="padding:8px 0;">${esc(row.destination)}</td></tr>
          </table>
          <p style="margin:24px 0 8px 0;font-size:15px;line-height:1.6;">
            <b>Möchten Sie etwas ändern?</b> Rufen Sie uns einfach an –
            <a href="tel:${esc(PHONE_TEL)}" style="color:#0B2545;font-weight:600;">${esc(PHONE_DISPLAY)}</a>
            – wir sind 24 Stunden für Sie da.
          </p>
          <p style="margin:8px 0 0 0;font-size:14px;color:#64748b;line-height:1.6;">
            Herzliche Grüsse<br>
            Ihr VitaWay-Team
          </p>
        </td></tr>
        <tr><td style="background:#f1f5f9;padding:16px 28px;color:#64748b;font-size:12px;text-align:center;line-height:1.6;">
          VitaWay · Wir kümmern uns. Auf jedem Weg.<br>
          <a href="https://vitaway.ch" style="color:#0B2545;">vitaway.ch</a> ·
          <a href="mailto:${esc(EMAIL)}" style="color:#0B2545;">${esc(EMAIL)}</a> ·
          <a href="tel:${esc(PHONE_TEL)}" style="color:#0B2545;">${esc(PHONE_DISPLAY)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    `Guten Tag ${row.first_name} ${row.last_name},`,
    "",
    "wir bestätigen Ihnen hiermit Ihre gebuchte Fahrt.",
    "",
    `Buchungsnummer: ${row.booking_number}`,
    `Transport: ${TRANSPORT_LABEL[row.transport_type]}`,
    `Datum: ${fmtDate(row.ride_date)}`,
    `Abholzeit: ${row.ride_time}`,
    `Abholort: ${row.pickup}`,
    `Zielort: ${row.destination}`,
    row.phone && row.phone.length > 0 ? `Ihre Telefon-Nr.: ${row.phone}` : "",
    "",
    `Bei Fragen oder Änderungen: ${PHONE_DISPLAY} oder ${EMAIL}`,
    "",
    "Herzliche Grüsse,",
    "Ihr VitaWay-Team",
    "vitaway.ch",
  ].filter(Boolean).join("\n");

  const res = await sendResend({
    from,
    to: [row.email],
    subject,
    html,
    text,
    reply_to: EMAIL,
  });

  if (!res.ok) {
    console.error("[notify-customer] send failed", res.status, res.body, {
      bookingNumber: row.booking_number,
    });
    return;
  }
  console.log("[notify-customer] email sent to customer", {
    bookingNumber: row.booking_number,
    to: row.email,
  });
}
