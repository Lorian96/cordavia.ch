"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  HeartPulse,
  Stretcher,
  TaxiCar,
  Wheelchair,
} from "./icons";

type TransportType =
  | "krankenfahrt"
  | "liegend"
  | "rollstuhl"
  | "taxi"
  | null;

type Booking = {
  transportType: TransportType;
  pickup: string;
  destination: string;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  notes: {
    wheelchair: boolean;
    companion: boolean;
    lying: boolean;
    insurance: boolean;
  };
  comment: string;
};

const emptyBooking: Booking = {
  transportType: null,
  pickup: "",
  destination: "",
  date: "",
  time: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  notes: {
    wheelchair: false,
    companion: false,
    lying: false,
    insurance: false,
  },
  comment: "",
};

const TRANSPORT_LABELS: Record<Exclude<TransportType, null>, string> = {
  krankenfahrt: "Krankenfahrt",
  liegend: "Liegendtransport",
  rollstuhl: "Rollstuhltransport",
  taxi: "Taxi",
};

const STEPS = [
  "Transportart",
  "Abholung",
  "Ziel",
  "Datum",
  "Uhrzeit",
  "Kontakt",
  "Hinweise",
  "Bestätigung",
] as const;

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00",
  "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00",
];

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking>(emptyBooking);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { status: "ok"; bookingNumber: string }
    | { status: "error"; message: string }
    | null
  >(null);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return booking.transportType !== null;
      case 1: return booking.pickup.trim().length > 3;
      case 2: return booking.destination.trim().length > 3;
      case 3: return booking.date !== "";
      case 4: return booking.time !== "";
      case 5:
        return (
          booking.firstName.trim().length > 1 &&
          booking.lastName.trim().length > 1 &&
          booking.phone.trim().length > 5 &&
          /\S+@\S+\.\S+/.test(booking.email)
        );
      case 6: return true;
      default: return true;
    }
  }, [step, booking]);

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setBooking((b) => ({ ...b, [key]: value }));
  }

  function toggleNote(k: keyof Booking["notes"]) {
    setBooking((b) => ({ ...b, notes: { ...b.notes, [k]: !b.notes[k] } }));
  }

  async function submit() {
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Unbekannter Fehler");
      setResult({ status: "ok", bookingNumber: data.bookingNumber });
    } catch (err) {
      setResult({
        status: "error",
        message: err instanceof Error ? err.message : "Verbindungsfehler",
      });
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    setBooking(emptyBooking);
    setStep(0);
    setResult(null);
  }

  if (result?.status === "ok") {
    return <SuccessScreen bookingNumber={result.bookingNumber} booking={booking} onReset={resetForm} />;
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-navy-50 overflow-hidden">
      {/* Progress */}
      <div className="bg-navy-900 px-6 py-5 text-white">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="font-semibold">
            Schritt {step + 1} von {STEPS.length}: {STEPS[step]}
          </span>
          <span className="text-teal-300 font-semibold hidden sm:inline">
            Buchung in ~60 Sek.
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Step body */}
      <div className="p-6 sm:p-10 min-h-[420px]">
        {step === 0 && (
          <TransportStep
            value={booking.transportType}
            onChange={(v) => update("transportType", v)}
          />
        )}
        {step === 1 && (
          <AddressStep
            label="Wo möchten Sie abgeholt werden?"
            placeholder="Straße, Hausnummer, PLZ, Ort"
            value={booking.pickup}
            onChange={(v) => update("pickup", v)}
          />
        )}
        {step === 2 && (
          <AddressStep
            label="Wohin soll die Fahrt gehen?"
            placeholder="Straße, Hausnummer, PLZ, Ort"
            value={booking.destination}
            onChange={(v) => update("destination", v)}
          />
        )}
        {step === 3 && (
          <DateStep
            min={today}
            value={booking.date}
            onChange={(v) => update("date", v)}
          />
        )}
        {step === 4 && (
          <TimeStep value={booking.time} onChange={(v) => update("time", v)} />
        )}
        {step === 5 && <ContactStep booking={booking} update={update} />}
        {step === 6 && (
          <NotesStep
            notes={booking.notes}
            comment={booking.comment}
            toggle={toggleNote}
            onComment={(v) => update("comment", v)}
          />
        )}
        {step === 7 && <Summary booking={booking} />}

        {result?.status === "error" && (
          <p
            role="alert"
            className="mt-6 rounded-xl bg-red-50 border border-red-200 text-red-800 px-4 py-3"
          >
            {result.message}
          </p>
        )}
      </div>

      {/* Nav */}
      <div className="px-6 sm:px-10 py-5 bg-surface-muted border-t border-navy-50 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-navy-900 disabled:opacity-40 hover:bg-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canContinue}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 hover:bg-navy-800 disabled:bg-navy-900/30 disabled:cursor-not-allowed text-white font-bold text-lg shadow-lg transition"
          >
            Weiter
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-500 hover:bg-teal-400 disabled:opacity-60 text-navy-950 font-bold text-lg shadow-lg transition"
          >
            {submitting ? "Wird gesendet…" : (
              <>
                <Check className="h-5 w-5" />
                Buchung bestätigen
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Step components ---------- */

function StepHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl sm:text-3xl font-black text-navy-900 mb-2">
        {title}
      </h3>
      {subtitle && (
        <p className="text-lg text-navy-800/75 leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

function TransportStep({
  value,
  onChange,
}: {
  value: TransportType;
  onChange: (v: TransportType) => void;
}) {
  const options = [
    { id: "krankenfahrt", label: "Krankenfahrt", icon: <HeartPulse className="h-7 w-7" />, desc: "Arzt, Klinik, Reha" },
    { id: "liegend", label: "Liegendtransport", icon: <Stretcher className="h-7 w-7" />, desc: "Transport im Liegen" },
    { id: "rollstuhl", label: "Rollstuhltransport", icon: <Wheelchair className="h-7 w-7" />, desc: "Barrierefrei" },
    { id: "taxi", label: "Taxi", icon: <TaxiCar className="h-7 w-7" />, desc: "Stadt- & Privatfahrt" },
  ] as const;

  return (
    <>
      <StepHeader title="Welche Art von Fahrt benötigen Sie?" subtitle="Wählen Sie eine Option aus." />
      <div className="grid sm:grid-cols-2 gap-4">
        {options.map((o) => {
          const active = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={`text-left p-5 rounded-2xl border-2 transition flex items-start gap-4 ${
                active
                  ? "border-teal-500 bg-teal-50 ring-4 ring-teal-200"
                  : "border-navy-50 hover:border-navy-200 bg-white"
              }`}
            >
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${active ? "bg-teal-500 text-navy-950" : "bg-navy-900 text-teal-300"}`}>
                {o.icon}
              </span>
              <span>
                <span className="block text-xl font-bold text-navy-900 mb-1">{o.label}</span>
                <span className="block text-navy-800/70">{o.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function AddressStep({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <StepHeader title={label} subtitle="Geben Sie die vollständige Adresse ein." />
      <input
        type="text"
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-xl rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-5 py-4 outline-none transition"
      />
    </>
  );
}

function DateStep({
  min,
  value,
  onChange,
}: {
  min: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <StepHeader title="Wann möchten Sie fahren?" subtitle="Wählen Sie das Datum Ihrer Fahrt." />
      <div className="relative max-w-md">
        <Calendar className="h-6 w-6 text-navy-900 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="date"
          min={min}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full text-xl rounded-2xl border-2 border-navy-50 focus:border-teal-500 pl-12 pr-5 py-4 outline-none transition"
        />
      </div>
    </>
  );
}

function TimeStep({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <>
      <StepHeader title="Um wie viel Uhr?" subtitle="Wählen Sie eine verfügbare Uhrzeit." />
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {TIME_SLOTS.map((t) => {
          const active = value === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => onChange(t)}
              className={`py-3 rounded-xl text-lg font-bold border-2 transition ${
                active
                  ? "bg-teal-500 border-teal-500 text-navy-950"
                  : "bg-white border-navy-50 text-navy-900 hover:border-teal-400"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-navy-800/70">
        Andere Uhrzeit nötig? Rufen Sie uns an – wir finden eine Lösung.
      </p>
    </>
  );
}

function ContactStep({
  booking,
  update,
}: {
  booking: Booking;
  update: <K extends keyof Booking>(key: K, value: Booking[K]) => void;
}) {
  return (
    <>
      <StepHeader title="Ihre Kontaktdaten" subtitle="Damit wir die Buchung bestätigen können." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field
          label="Vorname"
          value={booking.firstName}
          onChange={(v) => update("firstName", v)}
          autoComplete="given-name"
        />
        <Field
          label="Nachname"
          value={booking.lastName}
          onChange={(v) => update("lastName", v)}
          autoComplete="family-name"
        />
        <Field
          label="Telefonnummer"
          type="tel"
          value={booking.phone}
          onChange={(v) => update("phone", v)}
          autoComplete="tel"
        />
        <Field
          label="E-Mail"
          type="email"
          value={booking.email}
          onChange={(v) => update("email", v)}
          autoComplete="email"
        />
      </div>
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="block text-base font-semibold text-navy-900 mb-2">{label}</span>
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none transition"
      />
    </label>
  );
}

function NotesStep({
  notes,
  comment,
  toggle,
  onComment,
}: {
  notes: Booking["notes"];
  comment: string;
  toggle: (k: keyof Booking["notes"]) => void;
  onComment: (v: string) => void;
}) {
  const items: { key: keyof Booking["notes"]; label: string }[] = [
    { key: "wheelchair", label: "Ich nutze einen Rollstuhl" },
    { key: "companion", label: "Begleitperson kommt mit" },
    { key: "lying", label: "Transport im Liegen erforderlich" },
    { key: "insurance", label: "Über Krankenkasse abrechnen" },
  ];

  return (
    <>
      <StepHeader title="Besondere Hinweise" subtitle="Optional – damit wir Ihre Fahrt optimal vorbereiten." />
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        {items.map((it) => {
          const active = notes[it.key];
          return (
            <button
              key={it.key}
              type="button"
              onClick={() => toggle(it.key)}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition ${
                active
                  ? "border-teal-500 bg-teal-50"
                  : "border-navy-50 bg-white hover:border-navy-200"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-md border-2 shrink-0 ${
                  active ? "bg-teal-500 border-teal-500 text-navy-950" : "border-navy-200 bg-white"
                }`}
                aria-hidden
              >
                {active && <Check className="h-5 w-5" />}
              </span>
              <span className="text-lg font-medium text-navy-900">{it.label}</span>
            </button>
          );
        })}
      </div>
      <label className="block">
        <span className="block text-base font-semibold text-navy-900 mb-2">
          Sonstige Bemerkungen
        </span>
        <textarea
          value={comment}
          onChange={(e) => onComment(e.target.value)}
          rows={4}
          className="w-full text-lg rounded-2xl border-2 border-navy-50 focus:border-teal-500 px-4 py-3 outline-none transition resize-none"
          placeholder="z.B. Treppenhaus, 3. Stock ohne Aufzug"
        />
      </label>
    </>
  );
}

function Summary({ booking }: { booking: Booking }) {
  return (
    <>
      <StepHeader title="Fast geschafft!" subtitle="Bitte prüfen Sie Ihre Angaben und bestätigen Sie die Buchung." />
      <div className="space-y-3 bg-surface-muted rounded-2xl p-5">
        <SumRow label="Art" value={booking.transportType ? TRANSPORT_LABELS[booking.transportType] : "-"} />
        <SumRow label="Abholung" value={booking.pickup} />
        <SumRow label="Ziel" value={booking.destination} />
        <SumRow label="Datum" value={booking.date} />
        <SumRow label="Uhrzeit" value={booking.time} />
        <SumRow label="Name" value={`${booking.firstName} ${booking.lastName}`} />
        <SumRow label="Telefon" value={booking.phone} />
        <SumRow label="E-Mail" value={booking.email} />
        {Object.values(booking.notes).some(Boolean) && (
          <SumRow
            label="Hinweise"
            value={[
              booking.notes.wheelchair && "Rollstuhl",
              booking.notes.companion && "Begleitung",
              booking.notes.lying && "Liegend",
              booking.notes.insurance && "Krankenkasse",
            ]
              .filter(Boolean)
              .join(", ")}
          />
        )}
        {booking.comment && <SumRow label="Bemerkungen" value={booking.comment} />}
      </div>
      <p className="text-sm text-navy-800/70 mt-4">
        Mit dem Klick auf „Buchung bestätigen“ erhalten Sie eine Bestätigung per E-Mail und SMS.
      </p>
    </>
  );
}

function SumRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-navy-50 pb-2 last:border-0 last:pb-0">
      <span className="text-navy-800/70 font-medium">{label}</span>
      <span className="text-navy-900 font-semibold text-right">{value || "-"}</span>
    </div>
  );
}

function SuccessScreen({
  bookingNumber,
  booking,
  onReset,
}: {
  bookingNumber: string;
  booking: Booking;
  onReset: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-navy-50 overflow-hidden">
      <div className="bg-gradient-to-br from-teal-500 to-teal-400 px-6 py-12 text-center text-navy-950">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white mb-5">
          <Check className="h-10 w-10 text-teal-500" />
        </div>
        <h3 className="text-3xl sm:text-4xl font-black mb-2">Buchung empfangen!</h3>
        <p className="text-lg">Ihre Buchungsnummer:</p>
        <p className="text-2xl sm:text-3xl font-mono font-bold tracking-widest mt-2">
          {bookingNumber}
        </p>
      </div>
      <div className="p-6 sm:p-10">
        <p className="text-lg text-navy-900 mb-6">
          Vielen Dank, <strong>{booking.firstName} {booking.lastName}</strong>! Wir haben Ihre Anfrage erhalten und melden uns
          umgehend zur Bestätigung. Eine Bestätigung erhalten Sie zusätzlich per E-Mail und SMS.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <SumRow label="Fahrt" value={booking.transportType ? TRANSPORT_LABELS[booking.transportType] : "-"} />
          <SumRow label="Datum" value={`${booking.date} · ${booking.time}`} />
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-lg transition"
        >
          Neue Buchung starten
        </button>
      </div>
    </div>
  );
}
