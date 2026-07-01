"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Blendet Inhalte beim Scrollen dezent ein (nur Opazität, keine Bewegung).
 * Bewusst zurückhaltend gehalten – im Healthcare-Kontext keine auffällige Animation.
 * Respektiert die System-Einstellung „Bewegung reduzieren".
 */
export function Reveal({ children, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
