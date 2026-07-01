"use client";

import { useMemo, useState } from "react";

const WEEKDAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function ymd(y: number, m0: number, d: number): string {
  return `${y}-${pad(m0 + 1)}-${pad(d)}`;
}

function parseYmd(s: string): { y: number; m0: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  return { y: parseInt(m[1], 10), m0: parseInt(m[2], 10) - 1, d: parseInt(m[3], 10) };
}

function todayLocal(): { y: number; m0: number; d: number; ymd: string } {
  const now = new Date();
  return {
    y: now.getFullYear(),
    m0: now.getMonth(),
    d: now.getDate(),
    ymd: ymd(now.getFullYear(), now.getMonth(), now.getDate()),
  };
}

export function DatePicker({
  value,
  onSelect,
  minDate,
  disabledDates,
  maxMonthsAhead = 6,
}: {
  value: string | null;
  onSelect: (date: string) => void;
  minDate?: string; // YYYY-MM-DD; default today
  disabledDates?: Set<string>;
  maxMonthsAhead?: number;
}) {
  const today = useMemo(() => todayLocal(), []);
  const minStr = minDate ?? today.ymd;

  // Initial view: month of selected value, oder current month
  const initialView = useMemo(() => {
    const fromValue = value ? parseYmd(value) : null;
    if (fromValue) return { y: fromValue.y, m0: fromValue.m0 };
    return { y: today.y, m0: today.m0 };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState(initialView);

  function prevMonth() {
    setView((v) => {
      const m0 = v.m0 - 1;
      return m0 < 0 ? { y: v.y - 1, m0: 11 } : { y: v.y, m0 };
    });
  }
  function nextMonth() {
    setView((v) => {
      const m0 = v.m0 + 1;
      return m0 > 11 ? { y: v.y + 1, m0: 0 } : { y: v.y, m0 };
    });
  }

  // Bounds für Navigation
  const minParsed = parseYmd(minStr);
  const isAtMinMonth =
    minParsed !== null && view.y === minParsed.y && view.m0 === minParsed.m0;

  const maxView = (() => {
    const y = today.y;
    const m0 = today.m0 + maxMonthsAhead;
    return { y: y + Math.floor(m0 / 12), m0: m0 % 12 };
  })();
  const isAtMaxMonth = view.y === maxView.y && view.m0 === maxView.m0;
  const isPastMaxMonth =
    view.y > maxView.y || (view.y === maxView.y && view.m0 > maxView.m0);

  // Grid berechnen
  const firstOfMonth = new Date(view.y, view.m0, 1);
  const daysInMonth = new Date(view.y, view.m0 + 1, 0).getDate();
  // JS Sunday=0; wir wollen Mo=0
  const startWeekday = (firstOfMonth.getDay() + 6) % 7;

  const cells: ({ y: number; m0: number; d: number } | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push({ y: view.y, m0: view.m0, d });
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="rounded-2xl border-2 border-navy-50 bg-white p-4 select-none">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          disabled={Boolean(isAtMinMonth)}
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-navy-900 hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Vorheriger Monat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <span className="font-bold text-navy-900 text-lg" aria-live="polite">
          {MONTHS[view.m0]} {view.y}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          disabled={isAtMaxMonth || isPastMaxMonth}
          className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-navy-900 hover:bg-navy-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Nächster Monat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1 text-xs text-navy-800/75 text-center font-semibold uppercase">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => {
          if (!cell) return <span key={i} />;
          const dateStr = ymd(cell.y, cell.m0, cell.d);
          const isPast = dateStr < minStr;
          const isFull = disabledDates?.has(dateStr) ?? false;
          const disabled = isPast || isFull;
          const isSelected = value === dateStr;
          const isToday = dateStr === today.ymd;

          let cls =
            "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition min-h-[40px]";
          if (isSelected) {
            cls += " bg-teal-500 text-navy-950 font-bold ring-2 ring-teal-300";
          } else if (disabled) {
            cls += " text-navy-800/30 cursor-not-allowed bg-navy-50/50 line-through";
          } else if (isToday) {
            cls += " text-navy-900 hover:bg-teal-50 cursor-pointer ring-1 ring-teal-400";
          } else {
            cls += " text-navy-900 hover:bg-teal-50 cursor-pointer";
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(dateStr)}
              className={cls}
              aria-label={`${cell.d}. ${MONTHS[cell.m0]} ${cell.y}${isFull ? " — ausgebucht" : ""}`}
              aria-disabled={disabled}
              aria-pressed={isSelected}
              title={isFull ? "Dieser Tag ist ausgebucht" : undefined}
            >
              {cell.d}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-navy-800/75">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-teal-500" />
          gewählt
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded ring-1 ring-teal-400" />
          heute
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded bg-navy-50/80 line-through" />
          ausgebucht
        </span>
      </div>
    </div>
  );
}
