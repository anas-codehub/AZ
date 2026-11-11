// components/providers/scroll-reveal.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export function ScrollReveal({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // একবার দেখা গেলে আর অ্যানিমেট হবে না
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
