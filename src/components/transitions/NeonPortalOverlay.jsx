import { motion, AnimatePresence } from "framer-motion";

/**
 * Fullscreen portal overlay (for route/section transitions).
 * Use: <NeonPortalOverlay show={show} />
 */
export default function NeonPortalOverlay({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[99999] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        >
          {/* base dim */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.72 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          {/* neon portal ring */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(99,102,241,0.45), rgba(217,70,239,0.30), rgba(56,189,248,0.22), rgba(0,0,0,0) 65%)",
            }}
            initial={{ scale: 0.7, opacity: 0.5 }}
            animate={{ scale: 1.1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          />

          {/* sweep wipe */}
          <motion.div
            className="absolute -left-[35%] top-0 h-full w-[70%] blur-3xl"
            style={{
              background:
                "linear-gradient(120deg, rgba(0,0,0,0), rgba(99,102,241,0.55), rgba(217,70,239,0.40), rgba(56,189,248,0.28), rgba(0,0,0,0))",
            }}
            initial={{ x: "-40%", opacity: 0 }}
            animate={{ x: "220%", opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
          />

          {/* scanlines */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, rgba(255,255,255,0.12), rgba(255,255,255,0.12) 1px, transparent 1px, transparent 7px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />

          {/* noise */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
