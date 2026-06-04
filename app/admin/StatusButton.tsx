"use client";

import { useTransition } from "react";
import { setStatus } from "./actions";
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

export function StatusButtons({ id, current }: { id: string; current: Booking["status"] }) {
  const [pending, start] = useTransition();
  const states: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

  return (
    <div className="flex flex-wrap gap-2">
      {states.map((s) => {
        const active = s === current;
        return (
          <button
            key={s}
            type="button"
            disabled={pending || active}
            onClick={() => start(async () => { await setStatus(id, s); })}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition disabled:opacity-60 ${active ? CLASSES[s] : "bg-white text-navy-900 border-navy-200 hover:bg-navy-50"}`}
          >
            {LABELS[s]}
          </button>
        );
      })}
    </div>
  );
}
