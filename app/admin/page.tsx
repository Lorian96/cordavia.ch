import { getSupabaseServer, type Booking, type Callback } from "@/lib/supabaseServer";
import { StatusButtons } from "./StatusButton";
import { BookingPlanner } from "./BookingPlanner";
import { CallbackButtons } from "./CallbackButtons";

export const dynamic = "force-dynamic";

const TRANSPORT_LABELS: Record<Booking["transport_type"], string> = {
  krankenfahrt: "Krankenfahrt",
  liegend: "Liegend",
  rollstuhl: "Rollstuhl",
  taxi: "Taxi",
};

const STATUS_LABELS: Record<Booking["status"], string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  completed: "Erledigt",
  cancelled: "Storniert",
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("de-CH", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

function formatCreated(d: string) {
  return new Date(d).toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminPage() {
  let bookings: Booking[] = [];
  let callbacks: Callback[] = [];
  let fetchError: string | null = null;

  try {
    const sb = getSupabaseServer();
    const [bookingsRes, callbacksRes] = await Promise.all([
      sb
        .from("bookings")
        .select("*")
        .order("ride_date", { ascending: true })
        .order("ride_time", { ascending: true })
        .limit(500),
      sb
        .from("callbacks")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200),
    ]);
    if (bookingsRes.error) {
      fetchError = bookingsRes.error.message;
    } else {
      bookings = (bookingsRes.data ?? []) as Booking[];
    }
    // callbacks-Tabelle existiert eventuell noch nicht — wir ignorieren den Fehler still
    if (!callbacksRes.error) {
      callbacks = (callbacksRes.data ?? []) as Callback[];
    }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Verbindungsfehler";
  }

  const openCallbacks = callbacks.filter((c) => c.status === "pending");
  const doneCallbacks = callbacks.filter((c) => c.status === "done");

  const today = new Date().toISOString().split("T")[0];
  const upcoming = bookings.filter((b) => b.ride_date >= today);
  const past = bookings.filter((b) => b.ride_date < today);
  const counts = {
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-navy-900">Buchungen</h1>
        <div className="text-sm text-navy-800/70">
          {bookings.length} insgesamt · {upcoming.length} bevorstehend
        </div>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 px-5 py-4">
          <p className="font-semibold mb-1">Datenbankfehler</p>
          <p className="text-sm">{fetchError}</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard label="Offen" value={counts.pending} color="bg-rose-50 text-rose-900 border-rose-200" />
        <StatCard label="Bestätigt" value={counts.confirmed} color="bg-sky-50 text-sky-900 border-sky-200" />
        <StatCard label="Erledigt" value={counts.completed} color="bg-emerald-50 text-emerald-900 border-emerald-200" />
        <StatCard label="Storniert" value={counts.cancelled} color="bg-slate-50 text-slate-900 border-slate-200" />
        <StatCard label="📞 Rückrufe offen" value={openCallbacks.length} color="bg-orange-50 text-orange-900 border-orange-300" />
      </div>

      <CallbackSection open={openCallbacks} done={doneCallbacks} />

      <BookingPlanner bookings={bookings} />

      <Section title={`Bevorstehende Fahrten (${upcoming.length})`} bookings={upcoming} empty="Keine bevorstehenden Fahrten." />
      <Section title={`Vergangene Fahrten (${past.length})`} bookings={past} empty="Keine vergangenen Fahrten." collapsed />
    </>
  );
}

function CallbackSection({ open, done }: { open: Callback[]; done: Callback[] }) {
  if (open.length === 0 && done.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-navy-900 mb-4 flex items-center gap-2">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white text-base">
          📞
        </span>
        Rückruf-Anfragen
        {open.length > 0 && (
          <span className="ml-2 inline-flex items-center justify-center min-w-[1.75rem] h-7 px-2 rounded-full bg-orange-500 text-white text-sm font-bold">
            {open.length}
          </span>
        )}
      </h2>

      {open.length === 0 ? (
        <p className="text-navy-800/70 italic mb-4">Keine offenen Rückrufe.</p>
      ) : (
        <div className="space-y-3 mb-6">
          {open.map((c) => (
            <CallbackRow key={c.id} c={c} />
          ))}
        </div>
      )}

      {done.length > 0 && (
        <details>
          <summary className="cursor-pointer text-navy-800 hover:text-teal-500 mb-3 select-none text-sm">
            Erledigte Rückrufe ({done.length}) anzeigen
          </summary>
          <div className="space-y-3">
            {done.map((c) => (
              <CallbackRow key={c.id} c={c} muted />
            ))}
          </div>
        </details>
      )}
    </section>
  );
}

function CallbackRow({ c, muted }: { c: Callback; muted?: boolean }) {
  const ageMin = Math.floor((Date.now() - new Date(c.created_at).getTime()) / 60000);
  const ageLabel =
    ageMin < 60
      ? `vor ${Math.max(ageMin, 0)} Min`
      : ageMin < 1440
      ? `vor ${Math.floor(ageMin / 60)} h`
      : `vor ${Math.floor(ageMin / 1440)} Tagen`;

  const isUrgent = c.status === "pending" && ageMin >= 60;
  const baseColor = muted
    ? "bg-slate-50 border-slate-200"
    : isUrgent
    ? "bg-orange-100 border-orange-400 ring-2 ring-orange-300"
    : "bg-orange-50 border-orange-300";

  return (
    <article className={`rounded-2xl border-2 shadow-sm overflow-hidden ${baseColor}`}>
      <div className="grid lg:grid-cols-[1fr_auto] gap-4 p-5">
        <div>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className={`text-lg font-bold ${muted ? "text-slate-700" : "text-orange-950"}`}>
              {c.first_name} {c.last_name}
            </span>
            <a
              href={`tel:${c.phone}`}
              className={`text-base font-semibold ${
                muted ? "text-slate-600 hover:underline" : "text-orange-900 hover:underline"
              }`}
            >
              📞 {c.phone}
            </a>
            {!muted && (
              <span className={`text-xs ${isUrgent ? "text-orange-900 font-bold" : "text-orange-800/70"}`}>
                {ageLabel}{isUrgent ? " · dringend" : ""}
              </span>
            )}
            {muted && c.done_at && (
              <span className="text-xs text-slate-500">
                erledigt {new Date(c.done_at).toLocaleString("de-CH", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
            {c.preferred_time && (
              <Row label="Wunschzeit" value={<span className={muted ? "" : "font-semibold"}>{c.preferred_time}</span>} />
            )}
            {c.note && <Row label="Notiz" value={c.note} full />}
          </div>
        </div>
        <div className="lg:border-l lg:pl-5 lg:border-orange-200 flex flex-col gap-2 justify-start">
          <CallbackButtons id={c.id} status={c.status} customerName={`${c.first_name} ${c.last_name}`} />
        </div>
      </div>
    </article>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className={`rounded-2xl border px-5 py-4 ${color}`}>
      <div className="text-3xl font-black">{value}</div>
      <div className="text-sm font-semibold uppercase tracking-wide">{label}</div>
    </div>
  );
}

function Section({ title, bookings, empty, collapsed }: { title: string; bookings: Booking[]; empty: string; collapsed?: boolean }) {
  if (bookings.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="text-xl font-bold text-navy-900 mb-3">{title}</h2>
        <p className="text-navy-800/70 italic">{empty}</p>
      </section>
    );
  }
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-navy-900 mb-4">{title}</h2>
      <details open={!collapsed}>
        <summary className="cursor-pointer text-navy-800 hover:text-teal-500 mb-3 select-none">
          {collapsed ? "Ausklappen" : "Einklappen"}
        </summary>
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      </details>
    </section>
  );
}

function BookingRow({ booking: b }: { booking: Booking }) {
  const notes: string[] = [];
  if (b.note_wheelchair) notes.push("Rollstuhl");
  if (b.note_companion) notes.push("Begleitung");
  if (b.note_lying) notes.push("Liegend");
  if (b.note_insurance) notes.push("Krankenkasse");

  return (
    <article
      id={`booking-${b.id}`}
      className="bg-white rounded-2xl border border-navy-50 shadow-sm overflow-hidden scroll-mt-24 transition-shadow"
    >
      <div className="grid lg:grid-cols-[1fr_auto] gap-4 p-5">
        <div>
          <div className="flex flex-wrap items-baseline gap-3 mb-2">
            <span className="text-lg font-bold text-navy-900">
              {formatDate(b.ride_date)} · {formatTime(b.ride_time)}
            </span>
            <span className="text-xs font-mono text-navy-800/60">{b.booking_number}</span>
            <span className="px-2 py-0.5 rounded-full bg-navy-50 text-navy-900 text-xs font-semibold">
              {TRANSPORT_LABELS[b.transport_type]}
            </span>
            <span className="text-xs text-navy-800/50">
              eingegangen {formatCreated(b.created_at)}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <Row label="Kunde" value={`${b.first_name} ${b.last_name}`} />
            <Row
              label="E-Mail"
              value={
                b.email && b.email.length > 0
                  ? <a href={`mailto:${b.email}`} className="text-teal-600 hover:underline">{b.email}</a>
                  : <span className="text-navy-800/40">—</span>
              }
            />
            <Row
              label="Tel"
              value={
                b.phone && b.phone.length > 0
                  ? <a href={`tel:${b.phone}`} className="text-teal-600 hover:underline">{b.phone}</a>
                  : <span className="text-navy-800/40">—</span>
              }
            />
            <Row label="Status" value={STATUS_LABELS[b.status]} />
            <Row label="Abholung" value={b.pickup} full />
            <Row label="Ziel" value={b.destination} full />
            {notes.length > 0 && <Row label="Hinweise" value={notes.join(" · ")} full />}
            {b.comment && <Row label="Bemerkung" value={b.comment} full />}
          </div>
        </div>
        <div className="lg:border-l lg:pl-5 lg:border-navy-50 flex flex-col gap-2 justify-start">
          <p className="text-xs font-semibold text-navy-800/60 uppercase tracking-wide">Status setzen</p>
          <StatusButtons
            id={b.id}
            current={b.status}
            bookingNumber={b.booking_number}
            customerEmail={b.email && b.email.length > 0 ? b.email : null}
          />
        </div>
      </div>
    </article>
  );
}

function Row({ label, value, full }: { label: string; value: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <span className="text-navy-800/60 mr-2">{label}:</span>
      <span className="text-navy-900 font-medium">{value}</span>
    </div>
  );
}
