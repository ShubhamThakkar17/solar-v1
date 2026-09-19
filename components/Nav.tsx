"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { COMPANY, NAV_LINKS } from "@/lib/content";
import { EASE } from "@/lib/motion";

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 80));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid
            ? "border-b border-line bg-[#F4F8FB]/85 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-500 sm:px-8 ${
            solid ? "h-14" : "h-20"
          }`}
        >
          <a
            href="#top"
            className="font-display flex items-baseline gap-1.5 text-[13px] tracking-[0.3em] uppercase"
          >
            <span className="text-ink">{COMPANY.nameParts[0]}</span>
            <span className="text-accent">{COMPANY.nameParts[1]}</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative font-display text-[0.82rem] text-muted transition-colors hover:text-ink"
              >
                {l.label}
                <span className="bg-accent absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href="#notify"
              className="bg-accent rounded-full px-4 py-1.5 font-display text-[0.82rem] text-white transition-transform duration-300 hover:scale-[1.04]"
            >
              Get updates
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="block h-px w-5 bg-ink"
            />
            <motion.span
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="block h-px w-5 bg-ink"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="block h-px w-5 bg-ink"
            />
          </button>
        </div>

        {/* Scroll progress rail — takes the live accent. */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="bg-accent h-px origin-left"
        />
      </header>

      {/* Mobile sheet */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-x-0 top-14 z-40 border-b border-line bg-[#F4F8FB]/97 px-4 py-6 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line/60 py-3 font-display text-lg text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#notify"
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-lg text-[var(--accent-ink)]"
                >
                  Get updates →
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
