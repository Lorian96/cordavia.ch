"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Close, Phone, WhatsApp } from "./icons";
import { PHONE_DISPLAY, PHONE_TEL, PHONE_WHATSAPP } from "@/lib/contact";

type NavItem = { href: string; label: string };

export function MobileNav({ items }: { items: readonly NavItem[] }) {
  const [open, setOpen] = useState(false);

  // Escape schliesst das Menü; Scrollen im Hintergrund sperren solange offen.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-12 w-12 rounded-full text-navy-900 hover:bg-navy-50 transition"
        aria-label="Menü öffnen"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <Menu className="h-7 w-7" />
      </button>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-50 bg-white flex flex-col motion-safe:animate-[fadeIn_150ms_ease-out]"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-navy-50">
            <span className="flex items-center gap-3 text-navy-900 font-bold text-xl">
              <span
                aria-hidden
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white font-black text-lg"
              >
                V
              </span>
              VitaWay
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-12 w-12 rounded-full text-navy-900 hover:bg-navy-50 transition"
              aria-label="Menü schliessen"
            >
              <Close className="h-7 w-7" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-4 rounded-2xl text-xl font-semibold text-navy-900 hover:bg-navy-50 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="border-t border-navy-50 px-4 py-6 space-y-3">
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center justify-center gap-2 rounded-2xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold px-6 py-4 text-lg shadow-md transition"
            >
              <Phone className="h-6 w-6" />
              {PHONE_DISPLAY}
            </a>
            <a
              href={`https://wa.me/${PHONE_WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-4 text-lg shadow-md transition"
            >
              <WhatsApp className="h-6 w-6" />
              WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
