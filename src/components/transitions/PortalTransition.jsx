import { motion } from "framer-motion";

/**
 * Fullscreen futuristic transition overlay.
 * Call by setting `show=true`, then hide it after 600–900ms.
 */
export default function PortalTransition({ show }) {
  return (
    <motion.div
      className="fixed inset-0 z-[99999] pointer-events-none"
      initial={false}
      animate={show ? "in" : "out"}
      variants={{
        out: { opacity: 0 },
        in: { opacity: 1 },
      }}
      transition={{ duration: 0.12 }}
    >
      {/* Dark base */}
      <motion.div
        className="absolute inset-0 bg-black"
        variants={{
          out: { opacity: 0 },
          in: { opacity: 0.65 },
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Portal sweep */}
      <motion.div
        className="absolute inset-0"
        variants={{
          out: { opacity: 0 },
          in: { opacity: 1 },
        }}
      >
        {/* Gradient wipe */}
        <motion.div
          className="absolute -left-[30%] top-0 h-full w-[60%] blur-2xl"
          style={{
            background:
              "linear-gradient(120deg, rgba(99,102,241,0.0), rgba(99,102,241,0.45), rgba(217,70,239,0.35), rgba(56,189,248,0.25), rgba(0,0,0,0))",
          }}
          variants={{
            out: { x: "-40%", opacity: 0 },
            in: { x: "220%", opacity: 1 },
          }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        />

        {/* Scanlines */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "repeating-linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.10) 1px, transparent 1px, transparent 7px)",
          }}
          variants={{
            out: { opacity: 0 },
            in: { opacity: 0.22 },
          }}
          transition={{ duration: 0.2 }}
        />

        {/* Subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
