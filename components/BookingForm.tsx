"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  HeartPulse,
  Phone,
  Stretcher,
  TaxiCar,
  Wheelchair,
} from "./icons";
import { AddressAutocomplete } from "./AddressAutocomplete";
import { PHONE_DISPLAY, PHONE_TEL } from "@/lib/contact";

type TransportType = "krankenfahrt" | "liegend" | "rollstuhl" | "taxi" | null;

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
};

const TRANSPORT_LABELS: Record<Exclude<TransportType, null>, string> = {
  krankenfahrt: "Krankenfahrt",
  liegend: "Liegendtransport",
  rollstuhl: "Rollstuhltransport",
  taxi: "Taxi",
};

const STEPS = [
  "Transportart",
  "Route",
  "Datum & Zeit",
  "Kontakt",
  "Bestätigung",
] as const;

const TIME_SLOTS = [
  "06:00", "07:00", "08:00", "09:00", "10:00",
  "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00",
];

function isValidSwissPhone(s: string): boolean {
  // Akzeptiert: +41XXXXXXXXX, 0041XXXXXXXXX, 0XXXXXXXXX (Schweizer Nummern)
  const cleaned = s.replace(/[\s().-]/g, "");
  return /^(\+41|0041|0)[1-9]\d{8}$/.test(cleaned);
}

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [booking, setBooking] = useState<Booking>(emptyBooking);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<
    | { status: "ok"; bookingNumber: string }
    | { status: "error"; message: string }
    | null
  >(null);
  const [showErrors, setShowErrors] = useState(false);

  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  const canContinue = useMemo(() => {
    switch (step) {
      case 0:
        return booking.transportType !== null;
      case 1:
        return booking.pickup.trim().length > 3 && booking.destination.trim().length > 3;
      case 2:
        return booking.date !== "" && booking.date >= today && booking.time !== "";
      case 3:
        return (
          booking.firstName.trim().length > 1 &&
          booking.lastName.trim().length > 1 &&
          isValidSwissPhone(booking.phone)
        );
      case 4:
        return true;
      default:
        return true;
    }
  }, [step, booking, today]);

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setBooking((b) => ({ ...b, [key]: value }));
  }

  function goNext() {
    if (!canContinue) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((s) => Math.min(STEPS.length - 1, s + 1));
  }

  function goBack() {
    setShowErrors(false);
    setStep((s) => Math.max(0, s - 1));
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
    setShowErrors(false);
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
            5 Schritte zur Fahrt
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-400 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={STEPS.length}
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
          <RouteStep booking={booking} update={update} showErrors={showErrors} />
        )}
        {step === 2 && (
          <DateTimeStep
            booking={booking}
            update={update}
            minDate={today}
            showErrors={showErrors}
          />
        )}
        {step === 3 && (
          <ContactStep booking={booking} update={update} showErrors={showErrors} />
        )}
        {step === 4 && <Summary booking={booking} />}

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
          onClick={goBack}
          disabled={step === 0 || submitting}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-navy-900 disabled:opacity-40 hover:bg-white transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-lg shadow-lg transition"
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
                Buchung absenden
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
    {
      id: "krankenfahrt",
      label: "Krankenfahrt",
      icon: <HeartPulse className="h-7 w-7" />,
      desc: "Arzt, Klinik, Dialyse, Reha",
    },
    {
      id: "liegend",
      label: "Liegendtransport",
      icon: <Stretcher className="h-7 w-7" />,
      desc: "Transport im Liegen",
    },
    {
      id: "rollstuhl",
      label: "Rollstuhltransport",
      icon: <Wheelchair className="h-7 w-7" />,
      desc: "Barrierefrei mit Hublift",
    },
    {
      id: "taxi",
      label: "Taxi",
      icon: <TaxiCar className="h-7 w-7" />,
      desc: "Stadt, Privatfahrt",
    },
  ] as const;

  return (
    <>
      <StepHeader
        title="Welche Art von Fahrt benötigen Sie?"
        subtitle="Bitte wählen Sie eine Option."
      />
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
              aria-pressed={active}
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl shrink-0 ${
                  active ? "bg-teal-500 text-navy-950" : "bg-navy-900 text-teal-300"
                }`}
              >
                {o.icon}
              </span>
              <span>
                <span className="block text-xl font-bold text-navy-900 mb-1">
                  {o.label}
                </span>
                <span className="block text-navy-800/70">{o.desc}</span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function RouteStep({
  booking,
  update,
  showErrors,
}: {
  booking: Booking;
  update: <K extends keyof Booking>(key: K, value: Booking[K]) => void;
  showErrors: boolean;
}) {
  const pickupErr = showErrors && booking.pickup.trim().length <= 3;
  const destErr = showErrors && booking.destination.trim().length <= 3;
  return (
    <>
      <StepHeader
        title="Wo geht die Fahrt los, wohin?"
        subtitle="Beginnen Sie zu tippen – wir schlagen Adressen vor."
      />
      <div className="space-y-5">
        <AddressAutocomplete
          label="Abholort"
          placeholder="z.B. Bahnhofstrasse 1, 8001 Zürich"
          value={booking.pickup}
          onChange={(v) => update("pickup", v)}
          error={pickupErr ? "Bitte vollständige Adresse angeben." : null}
          autoFocus
        />
        <AddressAutocomplete
          label="Zielort"
          placeholder="z.B. Kantonsspital St.Gallen"
          value={booking.destination}
          onChange={(v) => update("destination", v)}
          error={destErr ? "Bitte Zielort angeben." : null}
        />
      </div>
    </>
  );
}

function DateTimeStep({
  booking,
  update,
  minDate,
  showErrors,
}: {
  booking: Booking;
  update: <K extends keyof Booking>(key: K, value: Booking[K]) => void;
  minDate: string;
  showErrors: boolean;
}) {
  const dateErr =
    showErrors && (booking.date === "" || booking.date < minDate);
  const timeErr = showErrors && booking.time === "";
  return (
    <>
      <StepHeader
        title="Wann möchten Sie fahren?"
        subtitle="Datum und gewünschte Abholzeit."
      />
      <div className="space-y-6 max-w-xl">
        <label className="block">
          <span className="block text-base font-semibold text-navy-900 mb-2">
            Datum
          </span>
          <div className="relative">
            <Calendar className="h-6 w-6 text-navy-900 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              min={minDate}
              value={booking.date}
              onChange={(e) => update("date", e.target.value)}
              className={`w-full text-xl rounded-2xl border-2 pl-12 pr-5 py-4 outline-none transition ${
                dateErr ? "border-red-400 bg-red-50" : "border-navy-50 focus:border-teal-500"
              }`}
            />
          </div>
          {dateErr && (
            <p className="text-sm text-red-700 mt-2">
              Bitte ein Datum ab heute wählen.
            </p>
          )}
        </label>

        <div>
          <span className="block text-base font-semibold text-navy-900 mb-2">
            Gewünschte Abholzeit
          </span>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {TIME_SLOTS.map((t) => {
              const active = booking.time === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => update("time", t)}
                  className={`py-3 rounded-xl text-lg font-bold border-2 transition ${
                    active
                      ? "bg-teal-500 border-teal-500 text-navy-950"
                      : "bg-white border-navy-50 text-navy-900 hover:border-teal-400"
                  }`}
                  aria-pressed={active}
                >
                  {t}
                </button>
              );
            })}
          </div>
          {timeErr && (
            <p className="text-sm text-red-700 mt-2">
              Bitte eine Uhrzeit wählen.
            </p>
          )}
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-navy-900 text-sm">
          <p className="font-semibold mb-1">Hinweis</p>
          <p>
            Wir bestätigen die genaue Abholzeit nach Eingang Ihrer Buchung
            telefonisch. Andere Zeit nötig? Rufen Sie uns an –{" "}
            <a href={`tel:${PHONE_TEL}`} className="text-teal-700 font-semibold underline">
              {PHONE_DISPLAY}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

function ContactStep({
  booking,
  update,
  showErrors,
}: {
  booking: Booking;
  update: <K extends keyof Booking>(key: K, value: Booking[K]) => void;
  showErrors: boolean;
}) {
  const firstErr = showErrors && booking.firstName.trim().length <= 1;
  const lastErr = showErrors && booking.lastName.trim().length <= 1;
  const phoneErr = showErrors && !isValidSwissPhone(booking.phone);
  return (
    <>
      <StepHeader
        title="Ihre Kontaktdaten"
        subtitle="Damit wir Sie zur Bestätigung erreichen können."
      />
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <LabeledField
          label="Vorname"
          value={booking.firstName}
          onChange={(v) => update("firstName", v)}
          autoComplete="given-name"
          error={firstErr ? "Bitte Vorname angeben." : null}
        />
        <LabeledField
          label="Nachname"
          value={booking.lastName}
          onChange={(v) => update("lastName", v)}
          autoComplete="family-name"
          error={lastErr ? "Bitte Nachname angeben." : null}
        />
        <div className="sm:col-span-2">
          <LabeledField
            label="Telefonnummer"
            type="tel"
            placeholder="+41 79 123 45 67"
            value={booking.phone}
            onChange={(v) => update("phone", v)}
            autoComplete="tel"
            error={phoneErr ? "Bitte gültige Schweizer Telefonnummer." : null}
          />
        </div>
        <div className="sm:col-span-2">
          <LabeledField
            label="E-Mail (optional)"
            type="email"
            placeholder="ihre.mail@beispiel.ch"
            value={booking.email}
            onChange={(v) => update("email", v)}
            autoComplete="email"
            hint="Falls Sie eine schriftliche Bestätigung wünschen."
          />
        </div>
      </div>
      <div className="bg-navy-50 border border-navy-100 rounded-xl p-4 text-navy-900 text-sm flex gap-3 items-start">
        <Phone className="h-5 w-5 text-navy-900 shrink-0 mt-0.5" />
        <p>
          <strong>Wir rufen Sie zur Bestätigung an.</strong> Eine E-Mail-Adresse
          ist freiwillig – Sie erhalten dann zusätzlich eine schriftliche
          Bestätigung.
        </p>
      </div>
    </>
  );
}

function LabeledField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  error,
  autoFocus,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string | null;
  autoFocus?: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-base font-semibold text-navy-900 mb-2">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full text-lg rounded-2xl border-2 px-4 py-3 outline-none transition ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-navy-50 focus:border-teal-500"
        }`}
        aria-invalid={Boolean(error)}
      />
      {hint && !error && (
        <p className="text-sm text-navy-800/60 mt-1.5">{hint}</p>
      )}
      {error && (
        <p className="text-sm text-red-700 mt-1.5">{error}</p>
      )}
    </label>
  );
}

function Summary({ booking }: { booking: Booking }) {
  return (
    <>
      <StepHeader
        title="Bitte prüfen Sie Ihre Angaben"
        subtitle="Wenn alles stimmt, senden Sie die Buchung ab."
      />
      <div className="space-y-3 bg-surface-muted rounded-2xl p-5 mb-5">
        <SumRow label="Transport-Art" value={booking.transportType ? TRANSPORT_LABELS[booking.transportType] : "-"} />
        <SumRow label="Abholort" value={booking.pickup} />
        <SumRow label="Zielort" value={booking.destination} />
        <SumRow label="Datum" value={formatDate(booking.date)} />
        <SumRow label="Abholzeit" value={booking.time} />
        <SumRow label="Name" value={`${booking.firstName} ${booking.lastName}`} />
        <SumRow label="Telefon" value={booking.phone} />
        {booking.email && <SumRow label="E-Mail" value={booking.email} />}
      </div>
      <p className="text-sm text-navy-800/70">
        Mit dem Absenden bestätigen Sie, dass die Angaben korrekt sind. Wir
        rufen Sie zur Bestätigung der Abholzeit an.
      </p>
    </>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("de-CH", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
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
        <h3 className="text-3xl sm:text-4xl font-black mb-2">
          Ihre Anfrage ist eingegangen!
        </h3>
        <p className="text-lg">Buchungsnummer:</p>
        <p className="text-2xl sm:text-3xl font-mono font-bold tracking-widest mt-2">
          {bookingNumber}
        </p>
      </div>
      <div className="p-6 sm:p-10">
        <p className="text-lg text-navy-900 mb-2">
          Vielen Dank, <strong>{booking.firstName} {booking.lastName}</strong>!
        </p>
        <p className="text-navy-800/80 mb-6 leading-relaxed">
          Wir melden uns telefonisch unter{" "}
          <strong className="text-navy-900">{booking.phone}</strong> zur
          Bestätigung der Abholzeit. In der Regel innerhalb der nächsten 15
          Minuten – an Werktagen während der Geschäftszeit.
        </p>
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <SumRow
            label="Fahrt"
            value={booking.transportType ? TRANSPORT_LABELS[booking.transportType] : "-"}
          />
          <SumRow label="Termin" value={`${formatDate(booking.date)} · ${booking.time}`} />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold transition"
          >
            Neue Buchung starten
          </button>
          <a
            href={`tel:${PHONE_TEL}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-navy-100 hover:border-teal-500 text-navy-900 font-bold transition"
          >
            <Phone className="h-5 w-5" />
            Direkt anrufen
          </a>
        </div>
      </div>
    </div>
  );
}
