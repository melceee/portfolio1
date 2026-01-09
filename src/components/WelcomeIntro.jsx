import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WelcomeIntro({ onEnter }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 2);
        if (next === 100) clearInterval(t);
        return next;
      });
    }, 24);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-neutral-950 px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-[-12rem] h-[30rem] w-[30rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-12rem] h-[30rem] w-[30rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur"
        initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-neutral-200">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          System initializing
        </p>

        <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
          Welcome to my portfolio
        </h1>
        

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Loading modules</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-3 overflow-hidden rounded-full border border-white/10 bg-black/40">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500/80 via-fuchsia-500/70 to-sky-400/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onEnter}
            className="rounded-2xl bg-indigo-500 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-400"
          >
            Enter Now
          </button>
          <button
            type="button"
            onClick={onEnter}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-white hover:bg-white/10"
          >
            Skip Intro
          </button>
        </div>

        <p className="mt-4 text-xs text-neutral-500">
          Tip: This site uses smooth reveal transitions per section.
        </p>
      </motion.div>
    </div>
  );
}
