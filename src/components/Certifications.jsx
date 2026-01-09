import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import FixedModal from "./ui/FixedModal";

export default function Certifications() {
  const certs = useMemo(
    () => [
      {
        id: "ccst",
        title: "Cisco Certified Support Technician (CCST) — Cybersecurity",
        issuer: "Cisco",
        date: "Aug 11, 2025",
        valid: "Valid through Aug 11, 2030",
        img: "/images/ccst.jpg",
        tags: ["Cybersecurity", "Support", "Networking"],
      },
      {
        id: "comptia",
        title: "CompTIA Tech+ (Plus Series)",
        issuer: "CompTIA",
        date: "Aug 15, 2025",
        valid: "Expiration date shown on certificate",
        img: "/images/comptia.jpg",
        tags: ["IT Fundamentals", "Troubleshooting", "Security Basics"],
      },

      {
        id: "softdev",
        title: "Introduction to Software Engineering",
        issuer: "IBM (Coursera)",
        date: "Nov 3, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/Softdev.jpg",
        tags: ["Software Engineering", "Foundations", "IBM"],
      },
      {
        id: "cloud",
        title: "Introduction to Cloud Computing",
        issuer: "IBM (Coursera)",
        date: "Nov 2, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/cloud.jpg",
        tags: ["Cloud", "Foundations", "IBM"],
      },
      {
        id: "ai",
        title: "Google AI Essentials",
        issuer: "Google (Coursera)",
        date: "Nov 21, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/AI.jpg",
        tags: ["AI", "ML", "Google"],
      },
      {
        id: "fullstack",
        title: "Full Stack Software Developer Assessment",
        issuer: "IBM (Coursera)",
        date: "Nov 20, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/fullstack.jpg",
        tags: ["Full-Stack", "Assessment", "IBM"],
      },
      {
        id: "saas",
        title: "Cloud Computing Primer: Software as a Service (SaaS)",
        issuer: "Codio (Coursera)",
        date: "Nov 20, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/SaaS.jpg",
        tags: ["Cloud", "SaaS", "Codio"],
      },
      {
        id: "devops",
        title: "Introduction to DevOps",
        issuer: "IBM (Coursera)",
        date: "Sep 25, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/devops.jpg",
        tags: ["DevOps", "CI/CD", "IBM"],
      },
      {
        id: "webdev",
        title: "Introduction to Web Development",
        issuer: "UC Davis (Coursera)",
        date: "Sep 25, 2024",
        valid: "Certificate (Coursera)",
        img: "/images/webdev.jpg",
        tags: ["Web Development", "Frontend", "UC Davis"],
      },
    ],
    []
  );

  const [activeTag, setActiveTag] = useState("All");
  const [openCert, setOpenCert] = useState(null);

  const allTags = useMemo(() => {
    const s = new Set(["All"]);
    certs.forEach((c) => c.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [certs]);

  const filtered = useMemo(() => {
    if (activeTag === "All") return certs;
    return certs.filter((c) => c.tags.includes(activeTag));
  }, [activeTag, certs]);

  return (
    <section id="certifications" className="relative py-20">
      {/* background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-[-10rem] h-[24rem] w-[24rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-24 right-[-10rem] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Verified credentials
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              Certifications
            </h2>
            
          </div>

          {/* Filter */}
          <div className="flex flex-wrap gap-2">
            {allTags.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTag(t)}
                className={[
                  "rounded-full border px-3 py-1 text-xs transition",
                  activeTag === t
                    ? "border-indigo-400/50 bg-indigo-500/15 text-white"
                    : "border-white/10 bg-white/5 text-neutral-200 hover:bg-white/10",
                ].join(" ")}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {filtered.map((c) => (
            <CertCard key={c.id} cert={c} onOpen={() => setOpenCert(c)} />
          ))}
        </div>
      </div>

      {/* ✅ FIXED MODAL */}
      <FixedModal
        open={!!openCert}
        onClose={() => setOpenCert(null)}
        title={openCert?.title}
        subtitle={openCert?.issuer}
      >
        {openCert ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {openCert.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="text-xs text-neutral-400">
              {openCert.date} • {openCert.valid}
            </p>

            <img
              src={openCert.img}
              alt={openCert.title}
              className="w-full rounded-2xl border border-white/10"
              draggable={false}
            />

            <div className="flex flex-wrap gap-2">
              <a
                href={openCert.img}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
              >
                Open
              </a>
              <a
                href={openCert.img}
                download
                className="rounded-xl bg-indigo-500 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
              >
                Download
              </a>
            </div>
          </div>
        ) : null}
      </FixedModal>
    </section>
  );
}

function CertCard({ cert, onOpen }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-xl backdrop-blur transition hover:-translate-y-1 hover:bg-white/7"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.995 }}
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute left-1/3 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative p-5">
        {/* image preview */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/40">
          <img
            src={cert.img}
            alt={cert.title}
            className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white backdrop-blur">
              {cert.issuer}
            </span>
            <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[11px] text-white backdrop-blur">
              Click to preview
            </span>
          </div>
        </div>

        {/* content */}
        <h3 className="mt-4 text-base font-semibold text-white">{cert.title}</h3>
        <p className="mt-1 text-xs text-neutral-400">
          {cert.date} • {cert.valid}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {cert.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
