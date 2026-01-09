import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import FixedModal from "./ui/FixedModal";

const CATEGORIES = ["All", "Frontend", "Backend", "Testing", "ML/CV", "Tools"];

export default function Skills() {
  const skills = useMemo(
    () => [
      // Frontend
      {
        id: "react",
        name: "React",
        category: "Frontend",
        level: 85,
        desc: "Component-driven UI, reusable architecture, hooks, modern patterns.",
        bullets: ["Reusable components", "State management", "Performance awareness"],
      },
      {
        id: "tailwind",
        name: "Tailwind CSS",
        category: "Frontend",
        level: 88,
        desc: "Design systems with utility-first styling and responsive layouts.",
        bullets: ["Responsive layouts", "Design tokens", "Consistent UI"],
      },
      {
        id: "vue",
        name: "Vue.js",
        category: "Frontend",
        level: 78,
        desc: "Built UI flows for booking systems with dynamic forms and state.",
        bullets: ["Forms + validation", "Composable logic", "API integration"],
      },

      // Backend
      {
        id: "spring",
        name: "Spring Boot",
        category: "Backend",
        level: 72,
        desc: "REST APIs, endpoints, business logic integration and testing workflows.",
        bullets: ["REST endpoints", "Service layers", "API debugging"],
      },
      {
        id: "java",
        name: "Java",
        category: "Backend",
        level: 75,
        desc: "OOP foundations, backend development, data structures, clean code.",
        bullets: ["OOP", "Data structures", "Backend fundamentals"],
      },
      {
        id: "sql",
        name: "SQL / MySQL",
        category: "Backend",
        level: 76,
        desc: "CRUD operations, joins, schema understanding for web applications.",
        bullets: ["Queries + joins", "Schema design basics", "Data validation"],
      },

      // Testing
      {
        id: "playwright",
        name: "Playwright",
        category: "Testing",
        level: 82,
        desc: "Automation testing for client-side features, E2E flows, bug reproduction.",
        bullets: ["E2E flows", "Selectors strategy", "Regression checks"],
      },

      // ML/CV
      {
        id: "python",
        name: "Python",
        category: "ML/CV",
        level: 80,
        desc: "Scripting, automation, image processing pipelines and experimentation.",
        bullets: ["Automation scripts", "Data handling", "Prototyping"],
      },
      {
        id: "opencv",
        name: "OpenCV",
        category: "ML/CV",
        level: 74,
        desc: "Preprocessing, segmentation, and detection workflows for images.",
        bullets: ["Preprocessing", "Segmentation", "Detection basics"],
      },
      {
        id: "tf",
        name: "TensorFlow / Keras",
        category: "ML/CV",
        level: 66,
        desc: "CNN training/evaluation pipeline for classification prototypes.",
        bullets: ["CNN basics", "Training workflow", "Evaluation metrics"],
      },

      // Tools
      {
        id: "git",
        name: "Git / GitHub",
        category: "Tools",
        level: 78,
        desc: "Version control, branching, collaboration and project maintenance.",
        bullets: ["Branching workflow", "Pull requests", "Conflict resolution"],
      },
      {
        id: "debug",
        name: "Debugging",
        category: "Tools",
        level: 84,
        desc: "Step-by-step problem solving and issue isolation across frontend/backend.",
        bullets: ["Reproduce issues", "Trace logs", "Fix + verify"],
      },
    ],
    []
  );

  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const wrapRef = useRef(null);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      el.style.setProperty("--mx", `${x}%`);
      el.style.setProperty("--my", `${y}%`);
    };

    el.addEventListener("pointermove", move);
    return () => el.removeEventListener("pointermove", move);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return skills.filter((s) => {
      const matchCat = category === "All" ? true : s.category === category;
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [skills, category, query]);

  return (
    <section id="skills" className="relative py-20">
      {/* Background accents + spotlight */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div
        ref={wrapRef}
        className="relative mx-auto max-w-6xl px-4"
        style={{ ["--mx"]: "50%", ["--my"]: "50%" }}
      >
        {/* Title */}
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Interactive skill console
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Skills
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-neutral-300">
              Hover (or tap on mobile) to inspect skills. Click a card to open details.
            </p>
          </div>

          {/* Search */}
          <div className="flex w-full flex-col gap-3 md:w-[420px]">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-neutral-400">
                ⌕
              </div>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search skills (e.g., React, Playwright, OpenCV)…"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-3 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-indigo-400/40"
              />
            </div>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    "rounded-full border px-3 py-1 text-xs transition",
                    category === c
                      ? "border-indigo-400/50 bg-indigo-500/15 text-white"
                      : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10",
                  ].join(" ")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* “Realistic spotlight” overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(500px circle at var(--mx) var(--my), rgba(99,102,241,0.18), transparent 55%)",
            }}
          />
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SkillCard key={s.id} skill={s} onOpen={() => setActive(s)} />
          ))}
        </div>

        {/* ✅ FIXED MODAL (centered even on scroll) */}
        <FixedModal
          open={!!active}
          onClose={() => setActive(null)}
          title={active?.name}
          subtitle={active?.category}
        >
          {active ? (
            <div className="space-y-4">
              <p className="text-sm text-neutral-300">{active.desc}</p>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-white">Confidence level</p>
                  <p className="text-sm text-neutral-300">{active.level}%</p>
                </div>

                <div className="mt-3 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500/80 via-fuchsia-500/70 to-sky-400/70"
                    initial={{ width: 0 }}
                    animate={{ width: `${active.level}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {active.bullets.map((b) => (
                    <div
                      key={b}
                      className="rounded-2xl border border-white/10 bg-neutral-950/35 p-3 text-xs text-neutral-200"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-xs text-neutral-500">
                Tip: Press <span className="text-neutral-300">Esc</span> or click outside to close.
              </p>
            </div>
          ) : null}
        </FixedModal>
      </div>
    </section>
  );
}

function SkillCard({ skill, onOpen }) {
  const ref = useRef(null);

  // 3D tilt
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      const rx = (py - 0.5) * -10; // rotateX
      const ry = (px - 0.5) * 12; // rotateY

      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
      el.style.setProperty("--hx", `${px * 100}%`);
      el.style.setProperty("--hy", `${py * 100}%`);
    };

    const onLeave = () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
      el.style.setProperty("--hx", `50%`);
      el.style.setProperty("--hy", `50%`);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <motion.button type="button" onClick={onOpen} className="group relative text-left" whileTap={{ scale: 0.98 }}>
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur"
        style={{
          transform: "perspective(900px) rotateX(var(--rx)) rotateY(var(--ry))",
          transition: "transform 150ms ease",
          ["--rx"]: "0deg",
          ["--ry"]: "0deg",
          ["--hx"]: "50%",
          ["--hy"]: "50%",
        }}
      >
        {/* Hologram highlight */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(280px circle at var(--hx) var(--hy), rgba(168,85,247,0.22), transparent 55%)",
            }}
          />
          <div className="absolute -inset-32 bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-sky-400/10 blur-3xl" />
        </div>

        {/* Top row */}
        <div className="relative flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-neutral-400">{skill.category}</p>
            <h3 className="mt-1 text-base font-semibold text-white">{skill.name}</h3>
          </div>

          <span className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] text-neutral-200">
            {skill.level}%
          </span>
        </div>

        {/* Desc */}
        <p className="relative mt-3 line-clamp-2 text-sm text-neutral-300">{skill.desc}</p>

        {/* Progress bar */}
        <div className="relative mt-4 h-2 overflow-hidden rounded-full border border-white/10 bg-black/40">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500/80 via-fuchsia-500/70 to-sky-400/70"
            style={{ width: `${skill.level}%` }}
          />
        </div>

        {/* Inspect hint */}
        <div className="relative mt-4 flex items-center justify-between text-xs text-neutral-400">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            Hover / Tap to inspect
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">Open ▸</span>
        </div>

        {/* Grid texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.18]">
          <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(255,255,255,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      </div>
    </motion.button>
  );
}
