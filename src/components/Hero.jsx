import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import graduation from "../assets/graduation.jpg";

export default function Hero() {
  const containerRef = useRef(null);
  const [pos, setPos] = useState({ x: 0.5, y: 0.25 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const orbitItems = useMemo(
    () => [
      {to: "projects", emoji: "💼" },
      {to: "skills", emoji: "🧠" },
      {to: "contact", emoji: "✉️" },
      {to: "projects", emoji: "🧪" },
      {to: "projects", emoji: "⚡" },
      {to: "certifications", emoji: "🏅" },
      {to: "about", emoji: "🎮" },
      
    ],
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      const cx = r.width / 2;
      const cy = r.height / 2;

      setPos({ x: x / r.width, y: y / r.height });

      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      setTilt({
        rx: (-dy * 9).toFixed(2),
        ry: (dx * 10).toFixed(2),
      });
    };

    const onLeave = () => {
      setPos({ x: 0.5, y: 0.25 });
      setTilt({ rx: 0, ry: 0 });
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" ref={containerRef} className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-neutral-950" />
      <div className="absolute inset-0">
        <div className="absolute -top-24 left-[-8rem] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 right-[-8rem] h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(600px circle at ${pos.x * 100}% ${pos.y * 100}%, rgba(99,102,241,0.22), transparent 45%)`,
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* LEFT — redesigned (no stats) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
          >
            {/* badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available for opportunities
            </div>

            {/* glass card */}
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
              <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
                Melchor{" "}
                <span className="bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                  Espinosa
                </span>
              </h1>

              {/* role chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { t: "Aspiring Software Engineer", a: "from-indigo-500/20 to-indigo-500/5" },
                  { t: "Web Developer", a: "from-indigo-500/20 to-indigo-500/5" },
                  { t: "Full-Stack", a: "from-fuchsia-500/20 to-fuchsia-500/5" },
                  { t: "Automation Testing", a: "from-cyan-500/20 to-cyan-500/5" },
                  { t: "ML / Computer Vision", a: "from-emerald-500/15 to-emerald-500/5" },
                  

                ].map((x) => (
                  <span
                    key={x.t}
                    className={`rounded-full border border-white/10 bg-gradient-to-b ${x.a} px-3 py-1 text-xs font-semibold text-neutral-100`}
                  >
                    {x.t}
                  </span>
                ))}
              </div>

              {/* value prop */}
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-300">
                I build <span className="text-white/90 font-semibold">user-focused web apps</span> and{" "}
                <span className="text-white/90 font-semibold">reliable automated tests</span>.
                I also explore <span className="text-white/90 font-semibold">computer vision</span> for healthcare problems.
              </p>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => scrollTo("projects")}
                  className="group inline-flex items-center gap-2 rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
                >
                  View My Work
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </button>

                <a
                  href="/Melchor-Espinosa-CV.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                  Download CV <span aria-hidden>⬇</span>
                </a>
              </div>

              {/* socials */}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                <span className="mr-1">Connect:</span>
                <a
                  className="rounded-full border border-white/10 bg-neutral-950/30 px-3 py-1 hover:bg-white/10"
                  href="mailto:melchorespinosa37@gmail.com"
                >
                  Email
                </a>
                <a
                  className="rounded-full border border-white/10 bg-neutral-950/30 px-3 py-1 hover:bg-white/10"
                  href="https://www.linkedin.com/in/melchor-espinosa-1399b0359"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className="rounded-full border border-white/10 bg-neutral-950/30 px-3 py-1 hover:bg-white/10"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo("contact");
                  }}
                >
                  Message Me
                </a>
              </div>

              {/* tech */}
              <div className="mt-6">
                <p className="text-xs font-semibold text-neutral-300">Tech I use</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "React",
                    "Tailwind",
                    "Playwright",
                    "Vue.js",
                    "Spring Boot",
                    "MySQL",
                    "Python",
                    "OpenCV",
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200 hover:bg-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — orbit/photo kept */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative flex justify-center md:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-indigo-500/15 blur-2xl" />
              <div className="absolute -inset-10 rounded-full bg-fuchsia-500/10 blur-3xl" />

              <div className="relative h-[340px] w-[340px] md:h-[420px] md:w-[420px]">
                <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5" />
                <div className="absolute inset-3 rounded-full border border-white/10" />

                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
                >
                  {orbitItems.map((it, idx) => (
                    <OrbitChip
                      key={it.label}
                      idx={idx}
                      total={orbitItems.length}
                      label={it.label}
                      emoji={it.emoji}
                      onClick={() => scrollTo(it.to)}
                    />
                  ))}
                </motion.div>

                <motion.div
                  className="absolute inset-10 md:inset-12 rounded-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                  }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                >
                  <div className="relative h-full w-full rounded-full border border-white/10 bg-neutral-950/40 p-2 shadow-2xl">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-cyan-500/10 blur-xl" />
                    <img
                      src={graduation}
                      alt="Graduation"
                      className="relative h-full w-full rounded-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-neutral-950/70 px-3 py-1 text-xs text-neutral-200 backdrop-blur">
                      BS Computer Engineering • MMCL
                    </div>
                  </div>
                </motion.div>
              </div>

              <p className="mt-5 text-center text-xs text-neutral-500">
                Tip: Move your mouse over the photo • Click the orbit chips
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OrbitChip({ idx, total, label, emoji, onClick }) {
  const angle = (idx / total) * Math.PI * 2;
  const radius = 160;
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ transform: `translate(${x}px, ${y}px)` }}
      aria-label={label}
    >
      <div className="group rounded-2xl border border-white/10 bg-neutral-950/60 px-3 py-2 text-xs text-neutral-200 shadow-lg backdrop-blur hover:bg-white/10">
        <span className="mr-2">{emoji}</span>
        <span className="font-semibold">{label}</span>
      </div>
    </button>
  );
}
