import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-black/40 py-10 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 text-center">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-bold text-white"
        >
          Melchor S. Espinosa III
        </motion.h2>

        <p className="mt-2 text-sm text-neutral-400">
          Portfolio owned and developed by <span className="text-indigo-400">Melchor S. Espinosa III</span>
        </p>

        <p className="mt-1 text-xs text-neutral-500">
          Built using React.js and Tailwind CSS.
        </p>

        {/* Interactive Button */}
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={() => {
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-5 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500/40"
          >
            Send Message
          </motion.button>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-[11px] text-neutral-600">
          © {new Date().getFullYear()} Mel — All rights reserved.
        </p>

        {/* Accent Glow */}
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="absolute bottom-0 h-40 w-[40rem] bg-gradient-to-t from-indigo-500/10 blur-3xl" />
        </div>

      </div>
    </footer>
  );
}
