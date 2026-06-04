import { getSupabaseServer, type Booking } from "@/lib/supabaseServer";
import { StatusButtons } from "./StatusButton";

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
  let fetchError: string | null = null;

  try {
    const sb = getSupabaseServer();
    const { data, error } = await sb
      .from("bookings")
      .select("*")
      .order("ride_date", { ascending: true })
      .order("ride_time", { ascending: true })
      .limit(500);
    if (error) {
      fetchError = error.message;
    } else {
      bookings = (data ?? []) as Booking[];
    }
  } catch (err) {
    fetchError = err instanceof Error ? err.message : "Verbindungsfehler";
  }

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

      <div className="grid sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Offen" value={counts.pending} color="bg-amber-50 text-amber-900 border-amber-200" />
        <StatCard label="Bestätigt" value={counts.confirmed} color="bg-teal-50 text-teal-900 border-teal-200" />
        <StatCard label="Erledigt" value={counts.completed} color="bg-emerald-50 text-emerald-900 border-emerald-200" />
        <StatCard label="Storniert" value={counts.cancelled} color="bg-rose-50 text-rose-900 border-rose-200" />
      </div>

      <Section title={`Bevorstehende Fahrten (${upcoming.length})`} bookings={upcoming} empty="Keine bevorstehenden Fahrten." />
      <Section title={`Vergangene Fahrten (${past.length})`} bookings={past} empty="Keine vergangenen Fahrten." collapsed />
    </>
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
    <article className="bg-white rounded-2xl border border-navy-50 shadow-sm overflow-hidden">
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
            <Row label="Tel" value={<a href={`tel:${b.phone}`} className="text-teal-600 hover:underline">{b.phone}</a>} />
            <Row
              label="E-Mail"
              value={
                b.email && b.email.length > 0
                  ? <a href={`mailto:${b.email}`} className="text-teal-600 hover:underline">{b.email}</a>
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
          <StatusButtons id={b.id} current={b.status} bookingNumber={b.booking_number} />
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
