import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

function useReducedMotionSafe() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!m) return;
    setReduced(!!m.matches);
    const onChange = () => setReduced(!!m.matches);
    m.addEventListener?.("change", onChange);
    return () => m.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

export default function HUDSection({ id, title, subtitle, children }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-12% 0px -12% 0px", once: true });
  const reduced = useReducedMotionSafe();

  const glitch = useMemo(() => {
    // small random offsets for a subtle glitch
    const a = (Math.random() * 4 - 2).toFixed(2);
    const b = (Math.random() * 4 - 2).toFixed(2);
    return { a, b };
  }, []);

  return (
    <section id={id} ref={ref} className="relative mx-auto max-w-6xl px-4 py-20">
      {/* Corner brackets + background grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[2rem]">
        <div className="absolute inset-0 opacity-[0.18] [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent" />
      </div>

      {/* section shell */}
      <motion.div
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur md:p-10"
        initial={{ opacity: 0, y: 28, filter: "blur(12px)" }}
        animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
        transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {/* scanline sweep */}
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-0 h-[2px]"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(99,102,241,0.9), rgba(217,70,239,0.8), rgba(56,189,248,0.7), transparent)",
            }}
            initial={{ x: "-120%", opacity: 0.0 }}
            animate={inView ? { x: "120%", opacity: 0.8 } : {}}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        )}

        {/* neon glow accents */}
        <div className="pointer-events-none absolute -top-24 left-[-10rem] h-[18rem] w-[18rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-[-10rem] h-[18rem] w-[18rem] rounded-full bg-fuchsia-500/10 blur-3xl" />

        {/* corner brackets */}
        <div className="pointer-events-none absolute left-5 top-5 h-6 w-6 border-l border-t border-white/25" />
        <div className="pointer-events-none absolute right-5 top-5 h-6 w-6 border-r border-t border-white/25" />
        <div className="pointer-events-none absolute left-5 bottom-5 h-6 w-6 border-b border-l border-white/25" />
        <div className="pointer-events-none absolute right-5 bottom-5 h-6 w-6 border-b border-r border-white/25" />

        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-neutral-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {subtitle ?? "System module"}
            </p>

            {/* Title with subtle glitch layers */}
            <div className="relative mt-4">
              <motion.h2
                className="relative text-3xl font-bold tracking-tight text-white md:text-4xl"
                initial={false}
                animate={
                  inView && !reduced
                    ? { textShadow: "0 0 18px rgba(99,102,241,0.20)" }
                    : {}
                }
                transition={{ duration: 0.4 }}
              >
                {title}
              </motion.h2>

              {!reduced && (
                <>
                  <motion.h2
                    className="pointer-events-none absolute left-0 top-0 text-3xl font-bold tracking-tight text-indigo-300/30 md:text-4xl"
                    style={{ transform: `translate(${glitch.a}px, -1px)` }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.25 }}
                  >
                    {title}
                  </motion.h2>
                  <motion.h2
                    className="pointer-events-none absolute left-0 top-0 text-3xl font-bold tracking-tight text-fuchsia-300/25 md:text-4xl"
                    style={{ transform: `translate(${glitch.b}px, 1px)` }}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.25 }}
                  >
                    {title}
                  </motion.h2>
                </>
              )}
            </div>
          </div>

          {/* right mini status */}
          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/10 bg-neutral-950/30 px-4 py-3">
              <p className="text-[11px] text-neutral-400">Status</p>
              <p className="text-sm font-semibold text-white">
                {inView ? "Online" : "Booting…"}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-neutral-950/30 px-4 py-3">
              <p className="text-[11px] text-neutral-400">Signal</p>
              <p className="text-sm font-semibold text-white">Stable</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.12 }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
