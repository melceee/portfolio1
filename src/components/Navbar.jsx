import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

const items = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");

  const ids = useMemo(() => items.map((i) => i.id), []);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length) return;

    // Track intersection ratio for ALL sections (not just current callback entries)
    const ratioById = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratioById.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        // Pick the section with the highest visible ratio
        let bestId = active;
        let bestRatio = 0;

        for (const [id, ratio] of ratioById.entries()) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        // Fallback: if none are intersecting (rare), choose nearest section by scroll position
        if (bestRatio === 0) {
          const y = window.scrollY + window.innerHeight * 0.35; // "reading line"
          let closestId = active;
          let closestDist = Infinity;

          for (const el of sections) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            const dist = Math.abs(top - y);
            if (dist < closestDist) {
              closestDist = dist;
              closestId = el.id;
            }
          }
          bestId = closestId;
        }

        setActive(bestId);
      },
      {
        // This makes the "active line" around top-third of the viewport.
        root: null,
        rootMargin: "-20% 0px -70% 0px",
        threshold: Array.from({ length: 21 }, (_, i) => i / 20), // 0..1 smooth
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  const handleNavClick = (id) => (e) => {
    // Instant feedback (highlight immediately)
    setActive(id);

    // Smooth scroll (and prevent weird offsets with sticky header)
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-neutral-950/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a
          href="#home"
          onClick={handleNavClick("home")}
          className="font-semibold tracking-tight"
        >
          <span className="text-white">Meles</span>
          <span className="text-indigo-400">.</span>
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={handleNavClick(item.id)}
              className={clsx(
                "rounded-xl px-3 py-2 text-sm font-medium transition",
                active === item.id
                  ? "bg-white/10 text-white"
                  : "text-neutral-300 hover:bg-white/5 hover:text-white"
              )}
              aria-current={active === item.id ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={handleNavClick("contact")}
          className="rounded-xl bg-indigo-500 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-400"
        >
          Contact
        </a>
      </div>
    </header>
  );
}
