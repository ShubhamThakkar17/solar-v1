"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NOTIFY, CONTACT } from "@/lib/content";
import { EASE } from "@/lib/motion";
import Reveal from "./Reveal";

export default function Notify() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Deliberately client-only. There is no backend yet, so nothing is
    // transmitted or stored — the page says as much rather than implying
    // a signup that silently goes nowhere.
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    setState(ok ? "done" : "error");
  };

  return (
    <section
      id="notify"
      data-tone="amber"
      className="relative scroll-mt-20 overflow-hidden border-t border-line"
    >
      {/* Soft accent wash rather than a photo scrim — on a light page a
          darkened plate behind the form just muddies the type. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50rem 30rem at 85% 15%, rgb(232 137 11 / 0.10), transparent 60%), radial-gradient(44rem 28rem at 8% 85%, rgb(15 163 196 / 0.08), transparent 58%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-8 md:py-36">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <span className="eyebrow">{NOTIFY.eyebrow}</span>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-5 font-display text-[clamp(1.85rem,4.4vw,3.2rem)] leading-[1.06] font-medium tracking-[-0.025em] text-balance">
                {NOTIFY.headline}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-[0.98rem] leading-relaxed text-muted">
                {NOTIFY.sub}
              </p>
            </Reveal>
          </div>

          <div className="lg:pt-10">
            <Reveal delay={0.1} y={32}>
              <form onSubmit={submit} noValidate>
                <label
                  htmlFor="notify-email"
                  className="font-mono text-[10px] tracking-[0.18em] text-muted-2 uppercase"
                >
                  Email address
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="notify-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (state !== "idle") setState("idle");
                    }}
                    placeholder={NOTIFY.placeholderText}
                    aria-invalid={state === "error"}
                    aria-describedby="notify-msg"
                    className={`flex-1 rounded-full border bg-surface px-5 py-3.5 text-[0.92rem] text-ink placeholder:text-muted-2 focus:outline-none ${
                      state === "error"
                        ? "border-red-400/70"
                        : "border-line-2 focus:border-[var(--accent)]"
                    }`}
                  />
                  <button
                    type="submit"
                    className="bg-accent rounded-full px-6 py-3.5 font-display text-[0.9rem] font-medium whitespace-nowrap text-white transition-transform duration-300 hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {NOTIFY.cta}
                  </button>
                </div>

                <div id="notify-msg" aria-live="polite" className="mt-3 min-h-[1.25rem]">
                  <AnimatePresence mode="wait">
                    {state === "done" && (
                      <motion.p
                        key="done"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                        className="text-accent text-[0.82rem]"
                      >
                        {NOTIFY.success}
                      </motion.p>
                    )}
                    {state === "error" && (
                      <motion.p
                        key="error"
                        initial={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={reduced ? { duration: 0 } : { duration: 0.35, ease: EASE }}
                        className="text-[0.82rem] text-red-400"
                      >
                        That doesn&apos;t look like a valid email address.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <p className="mt-2 font-mono text-[9.5px] leading-relaxed tracking-[0.1em] text-muted-2/80 uppercase">
                  {NOTIFY.disclaimer}
                </p>
              </form>
            </Reveal>

            {/* Contact — placeholders until the real details exist. */}
            <Reveal delay={0.18}>
              <dl className="mt-10 grid gap-5 border-t border-line pt-8 sm:grid-cols-3">
                {[
                  { k: "Email", v: CONTACT.email },
                  { k: "Phone", v: CONTACT.phone },
                  { k: "Office", v: CONTACT.address },
                ].map((c) => (
                  <div key={c.k}>
                    <dt className="font-mono text-[9.5px] tracking-[0.16em] text-muted-2 uppercase">
                      {c.k}
                    </dt>
                    <dd
                      data-placeholder="true"
                      title="Placeholder — pending confirmed company details"
                      className="mt-2 text-[0.88rem] text-muted"
                    >
                      {c.v}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
