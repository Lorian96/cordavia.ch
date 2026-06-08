"use client";

import { useState, useEffect } from "react";
import { Phone } from "./icons";

const SWISS_PHONE = /^(\+41|0041|0)[\s\-]?[1-9](?:[\s\-]?\d){8}$/;

export function CallbackButton() {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function resetAndClose() {
    setOpen(false);
    setTimeout(() => {
      setDone(false);
      setError(null);
      setFirstName("");
      setLastName("");
      setPhone("");
      setPreferredTime("");
      setNote("");
    }, 300);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError("Bitte Name und Telefon angeben.");
      return;
    }
    if (!SWISS_PHONE.test(phone.replace(/\s+/g, ""))) {
      setError("Bitte gültige Schweizer Telefonnummer.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, preferredTime, note }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Etwas ist schiefgelaufen.");
      }
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-base font-semibold text-teal-300 hover:text-teal-200 underline underline-offset-4 transition"
      >
        <Phone className="h-5 w-5" />
        Lieber Rückruf? Wir melden uns bei Ihnen →
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="callback-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetAndClose();
          }}
        >
          <div className="bg-white text-navy-900 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {done ? (
              <div className="text-center py-6">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-teal-500 text-navy-950 mb-4">
                  <Phone className="h-8 w-8" />
                </div>
                <h3 id="callback-title" className="text-2xl font-black mb-3">
                  Danke!
                </h3>
                <p className="text-lg text-navy-800/85 mb-6 leading-relaxed">
                  Wir melden uns so bald wie möglich
                  {preferredTime ? <> — wenn möglich um <strong>{preferredTime}</strong></> : null}.
                </p>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="inline-flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-7 py-3 text-lg"
                >
                  Schliessen
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-5">
                  <h3 id="callback-title" className="text-2xl font-black">
                    Wir rufen Sie zurück
                  </h3>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="text-navy-800/60 hover:text-navy-900 text-2xl leading-none p-1"
                    aria-label="Schliessen"
                  >
                    ×
                  </button>
                </div>
                <p className="text-base text-navy-800/80 mb-5 leading-relaxed">
                  Geben Sie uns Ihren Namen und Telefon — wir melden uns innerhalb kurzer Zeit.
                </p>

                <form onSubmit={submit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <label className="block">
                      <span className="block text-base font-semibold mb-1.5">Vorname</span>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none"
                        autoFocus
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="block text-base font-semibold mb-1.5">Nachname</span>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none"
                        required
                      />
                    </label>
                  </div>
                  <label className="block">
                    <span className="block text-base font-semibold mb-1.5">Telefon</span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+41 76 123 45 67"
                      className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none"
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="block text-base font-semibold mb-1.5">
                      Wann sollen wir anrufen? <span className="text-navy-800/60 font-normal">(optional)</span>
                    </span>
                    <input
                      type="text"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      placeholder="z.B. heute Nachmittag, morgen 10 Uhr"
                      className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="block text-base font-semibold mb-1.5">
                      Worum geht's? <span className="text-navy-800/60 font-normal">(optional)</span>
                    </span>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="z.B. Fahrt zum Arzt am Dienstag"
                      rows={2}
                      className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none resize-none"
                    />
                  </label>

                  {error && (
                    <p className="text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-base">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-navy-950 font-bold px-6 py-4 text-lg shadow-lg transition"
                  >
                    {submitting ? "Wird gesendet…" : "Rückruf anfordern"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
