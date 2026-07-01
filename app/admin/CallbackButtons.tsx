"use client";

import { useTransition } from "react";
import { markCallbackDone, reopenCallback, deleteCallback } from "./actions";

export function CallbackButtons({
  id,
  status,
  customerName,
}: {
  id: string;
  status: "pending" | "done";
  customerName: string;
}) {
  const [pending, startTransition] = useTransition();

  function onDone() {
    startTransition(async () => {
      await markCallbackDone(id);
    });
  }
  function onReopen() {
    startTransition(async () => {
      await reopenCallback(id);
    });
  }
  function onDelete() {
    if (!confirm(`Rückruf-Anfrage von ${customerName} wirklich löschen?`)) return;
    startTransition(async () => {
      await deleteCallback(id);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {status === "pending" ? (
        <button
          type="button"
          onClick={onDone}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-semibold text-sm shadow"
        >
          ✓ Erledigt
        </button>
      ) : (
        <button
          type="button"
          onClick={onReopen}
          disabled={pending}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-semibold text-sm shadow"
        >
          ↺ Wieder öffnen
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        disabled={pending}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold text-sm border border-rose-200"
      >
        Löschen
      </button>
    </div>
  );
}
