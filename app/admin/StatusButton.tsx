"use client";

import { useTransition } from "react";
import { setStatus, deleteBooking } from "./actions";
import type { Booking } from "@/lib/supabaseServer";

const LABELS: Record<Booking["status"], string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  completed: "Erledigt",
  cancelled: "Storniert",
};

const CLASSES: Record<Booking["status"], string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-300",
  confirmed: "bg-teal-100 text-teal-900 border-teal-300",
  completed: "bg-emerald-100 text-emerald-900 border-emerald-300",
  cancelled: "bg-rose-100 text-rose-900 border-rose-300",
};

export function StatusButtons({
  id,
  current,
  bookingNumber,
  customerEmail,
}: {
  id: string;
  current: Booking["status"];
  bookingNumber: string;
  customerEmail: string | null;
}) {
  const [pending, start] = useTransition();
  const states: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

  function handleClick(s: Booking["status"]) {
    const willTriggerCustomerMail =
      s === "confirmed" && current !== "confirmed" && Boolean(customerEmail);
    if (willTriggerCustomerMail) {
      if (!confirm(
        `Buchung ${bookingNumber} bestätigen?\n\nDer Kunde erhält automatisch eine Bestätigungsmail an ${customerEmail}.`
      )) {
        return;
      }
    }
    start(async () => { await setStatus(id, s); });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {states.map((s) => {
        const active = s === current;
        const showMailHint =
          s === "confirmed" && !active && Boolean(customerEmail);
        return (
          <button
            key={s}
            type="button"
            disabled={pending || active}
            onClick={() => handleClick(s)}
            title={showMailHint ? `Sendet Bestätigungsmail an ${customerEmail}` : undefined}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition disabled:opacity-60 ${active ? CLASSES[s] : "bg-white text-navy-900 border-navy-200 hover:bg-navy-50"}`}
          >
            {LABELS[s]}
            {showMailHint && <span className="ml-1">✉</span>}
          </button>
        );
      })}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm(`Buchung ${bookingNumber} endgültig löschen?`)) {
            start(async () => { await deleteBooking(id); });
          }
        }}
        className="text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-300 bg-white text-rose-700 hover:bg-rose-50 transition disabled:opacity-60 ml-auto"
        title="Buchung löschen"
      >
        Löschen
      </button>
    </div>
  );
}
