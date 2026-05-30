import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

/**
 * ConfirmModal — a reusable, brand-styled confirmation dialog.
 * Use it for destructive actions (delete) to prevent accidental clicks.
 *
 * Example:
 *   <ConfirmModal
 *     open={open}
 *     onClose={() => setOpen(false)}
 *     onConfirm={() => { deleteItem(); setOpen(false); }}
 *     title="Delete product?"
 *     message="This action cannot be undone."
 *   />
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  danger = true,
  icon,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            className="relative w-full max-w-md rounded-3xl bg-[#1f2937] dark:bg-[#161a1a] border border-brand-lime/30 shadow-2xl p-6 md:p-8 text-brand-white"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Close corner */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 text-brand-white/60 hover:text-brand-lime transition"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              {/* Icon ring — danger (red) by default for delete actions */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                  danger ? "bg-red-500/20 text-red-400" : "bg-brand-lime/20 text-brand-lime"
                }`}
              >
                {icon || <AlertTriangle size={32} />}
              </div>

              <h3 className="text-2xl font-black text-brand-white mb-2">{title}</h3>
              <p className="text-brand-white/70 mb-6 max-w-sm">{message}</p>

              <div className="flex w-full gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-3 rounded-xl font-semibold bg-[#27272a] hover:bg-[#33333a] text-brand-white/90 transition"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 px-5 py-3 rounded-xl font-bold transition ${
                    danger
                      ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30"
                      : "bg-brand-lime hover:bg-[#7bea12] text-brand-black glow-lime-sm"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
