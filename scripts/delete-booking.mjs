import { readFileSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      const k = l.slice(0, idx).trim();
      let v = l.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      return [k, v];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
const bookingNumber = process.argv[2];

if (!url || !key) {
  console.error("Missing env: url=", !!url, " key=", !!key);
  process.exit(1);
}
if (!bookingNumber) {
  console.error("Usage: node delete-booking.mjs <booking_number>");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/bookings?booking_number=eq.${encodeURIComponent(bookingNumber)}`, {
  method: "DELETE",
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: "return=representation",
  },
});

const body = await res.text();
console.log("HTTP", res.status, body);
