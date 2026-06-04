import type { BookingRow } from "@/lib/supabase";

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

export async function notifyAdminOfBooking(row: BookingRow) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL || "Cordavia <onboarding@resend.dev>";

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
          <div style="font-size:13px;letter-spacing:2px;text-transform:uppercase;opacity:0.7;">Cordavia · Admin-Benachrichtigung</div>
          <div style="font-size:22px;font-weight:700;margin-top:4px;">Neue Buchung eingegangen</div>
        </td></tr>
        <tr><td style="padding:24px 28px;">
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.5;">
            Es ist eine neue Buchung über cordavia.ch reingekommen.
          </p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;width:160px;color:#64748b;">Buchungsnummer</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:700;">${esc(row.booking_number)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Transport-Art</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(TRANSPORT_LABEL[row.transport_type])}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Termin</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(fmtDate(row.ride_date))} um <b>${esc(row.ride_time)}</b></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Abholung</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(row.pickup)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Ziel</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(row.destination)}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Kunde</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><b>${esc(row.first_name)} ${esc(row.last_name)}</b></td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Telefon</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="tel:${esc(row.phone)}" style="color:#0B2545;">${esc(row.phone)}</a></td></tr>
            ${row.email && row.email.length > 0 ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">E-Mail</td><td style="padding:8px 0;border-bottom:1px solid #eee;"><a href="mailto:${esc(row.email)}" style="color:#0B2545;">${esc(row.email)}</a></td></tr>` : ""}
            ${notes.length ? `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#64748b;">Hinweise</td><td style="padding:8px 0;border-bottom:1px solid #eee;">${esc(notes.join(", "))}</td></tr>` : ""}
            ${row.comment ? `<tr><td style="padding:8px 0;color:#64748b;vertical-align:top;">Kommentar</td><td style="padding:8px 0;white-space:pre-wrap;">${esc(row.comment)}</td></tr>` : ""}
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="https://cordavia.ch/admin" style="display:inline-block;background:#14B8A6;color:#0B2545;font-weight:700;padding:12px 24px;border-radius:999px;text-decoration:none;">Im Admin-Dashboard öffnen</a>
          </div>
        </td></tr>
        <tr><td style="background:#f1f5f9;padding:16px 28px;color:#64748b;font-size:12px;text-align:center;">
          Cordavia · Wir kümmern uns. Auf jedem Weg. · <a href="https://cordavia.ch" style="color:#0B2545;">cordavia.ch</a>
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
    `Telefon: ${row.phone}`,
    row.email && row.email.length > 0 ? `E-Mail: ${row.email}` : "",
    notes.length ? `Hinweise: ${notes.join(", ")}` : "",
    row.comment ? `Kommentar: ${row.comment}` : "",
    "",
    "Admin: https://cordavia.ch/admin",
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
