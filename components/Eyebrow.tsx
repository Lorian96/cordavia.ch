import type { ReactNode } from "react";

/**
 * Wegpunkt-Marker als Abschnitts-Eyebrow – die Signatur der Seite.
 * Punkt + Linie greifen das „Way"/Routen-Motiv der Marke auf.
 * `tone` passt die Farben für helle bzw. dunkle Hintergründe an.
 */
export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  const dotRing = tone === "dark" ? "ring-teal-300/20" : "ring-teal-500/15";
  const dot = tone === "dark" ? "bg-teal-300" : "bg-teal-500";
  const line = tone === "dark" ? "bg-teal-300/40" : "bg-teal-600/40";
  const text = tone === "dark" ? "text-teal-300" : "text-teal-700";

  return (
    <span
      className={`inline-flex items-center gap-3 font-semibold text-sm uppercase tracking-[0.16em] ${text}`}
    >
      <span className="inline-flex items-center gap-2" aria-hidden>
        <span className={`h-2.5 w-2.5 rounded-full ring-4 ${dot} ${dotRing}`} />
        <span className={`h-px w-7 ${line}`} />
      </span>
      {children}
    </span>
  );
}
