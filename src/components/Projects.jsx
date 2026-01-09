import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";
import clsx from "clsx";

const categories = ["All", "Research", "Internship", "Academic"];

export default function Projects() {
  const [openId, setOpenId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const catOk = activeCategory === "All" || p.category === activeCategory;
      const text = `${p.title} ${p.subtitle} ${p.summary} ${p.tags.join(" ")}`.toLowerCase();
      const qOk = !q || text.includes(q);
      return catOk && qOk;
    });
  }, [activeCategory, query]);

  const selected = useMemo(
    () => projects.find((p) => p.id === openId) || null,
    [openId]
  );

  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-16">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Projects</h2>
          
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={clsx(
                  "rounded-full px-3 py-1 text-sm border transition",
                  activeCategory === c
                    ? "border-indigo-400/40 bg-indigo-500/15 text-white"
                    : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10"
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            className="w-full sm:w-64 rounded-xl border border-white/10 bg-neutral-950/40 px-3 py-2 text-sm text-white placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, idx) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
            onClick={() => setOpenId(p.id)}
            className="group text-left rounded-3xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/60"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-full border border-white/10 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-200">
                {p.category}
              </span>
              <span className="text-xs text-neutral-400">Click to open →</span>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-white">{p.title}</h3>
            <p className="mt-1 text-sm text-neutral-300">{p.subtitle}</p>

            <p className="mt-4 text-sm text-neutral-300 line-clamp-3">{p.summary}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {p.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-200"
                >
                  {t}
                </span>
              ))}
              {p.tags.length > 4 && (
                <span className="rounded-full border border-white/10 bg-neutral-950/40 px-3 py-1 text-xs text-neutral-400">
                  +{p.tags.length - 4}
                </span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* ✅ This modal must be FixedModal inside ProjectModal */}
      <ProjectModal
        project={selected}
        isOpen={!!selected}
        onClose={() => setOpenId(null)}
      />
    </section>
  );
}
