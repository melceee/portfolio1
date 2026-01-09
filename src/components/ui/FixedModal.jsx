import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModalPortal from "./ModalPortal";

export default function FixedModal({ open, onClose, title, subtitle, children }) {
  // lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <ModalPortal>
          <motion.div
            className="fixed inset-0 z-[99999] grid place-items-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) onClose?.();
            }}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/90 shadow-2xl backdrop-blur"
              initial={{ y: 18, scale: 0.985, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 10, scale: 0.99, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
                <div className="min-w-0">
                  {subtitle ? <p className="text-xs text-neutral-400">{subtitle}</p> : null}
                  {title ? (
                    <h3 className="truncate text-sm font-semibold text-white">{title}</h3>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* only modal scrolls */}
              <div className="max-h-[75vh] overflow-auto p-5">{children}</div>
            </motion.div>
          </motion.div>
        </ModalPortal>
      ) : null}
    </AnimatePresence>
  );
}
