import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useApp } from "../store/AppContext";

/* ---------------- Button ---------------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "dark";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};
export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: BtnProps) {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const variants = {
    primary: "bg-brand-lime text-brand-black hover:bg-[#7bea12] glow-lime-sm",
    ghost: "bg-transparent hover:bg-brand-lime/15 text-brand-black dark:text-brand-white",
    outline: "border-2 border-brand-green/30 hover:border-brand-lime hover:bg-brand-lime/10 text-brand-black dark:text-brand-white",
    dark: "bg-brand-green text-brand-lime hover:bg-[#006b23]",
  };
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- Badge ---------------- */
export function Badge({ children, color = "lime", className = "" }: { children: ReactNode; color?: "lime" | "green" | "dark"; className?: string }) {
  const colors = {
    lime: "bg-brand-lime text-brand-black",
    green: "bg-brand-green text-brand-lime",
    dark: "bg-black text-brand-lime",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color]} ${className}`}>{children}</span>;
}

/* ---------------- Input ---------------- */
export function Input(props: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const { label, error, className = "", ...rest } = props;
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80">{label}</label>}
      <input
        className={`w-full rounded-xl border border-brand-green/20 bg-white/70 dark:bg-brand-black/40 dark:border-brand-lime/20 backdrop-blur px-4 py-2.5 text-brand-black dark:text-brand-white placeholder:text-brand-black/40 dark:placeholder:text-brand-white/40 focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30 outline-none transition-all ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const { label, className = "", ...rest } = props;
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80">{label}</label>}
      <textarea
        className={`w-full rounded-xl border border-brand-green/20 bg-white/70 dark:bg-brand-black/40 dark:border-brand-lime/20 backdrop-blur px-4 py-2.5 text-brand-black dark:text-brand-white placeholder:text-brand-black/40 dark:placeholder:text-brand-white/40 focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30 outline-none transition-all ${className}`}
        {...rest}
      />
    </div>
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }) {
  const { label, options, className = "", ...rest } = props;
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-brand-black/80 dark:text-brand-white/80">{label}</label>}
      <select
        className={`w-full rounded-xl border border-brand-green/20 bg-white/70 dark:bg-brand-black/40 dark:border-brand-lime/20 backdrop-blur px-4 py-2.5 text-brand-black dark:text-brand-white focus:border-brand-lime focus:ring-2 focus:ring-brand-lime/30 outline-none transition-all ${className}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ---------------- Toast ---------------- */
export function Toaster() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 0 }}
            className={`pointer-events-auto glass rounded-2xl px-4 py-3 flex items-start gap-3 shadow-xl ${
              t.type === "success" ? "border-l-4 border-brand-lime" : t.type === "error" ? "border-l-4 border-red-500" : "border-l-4 border-blue-400"
            }`}
          >
            <div className="flex-1 text-sm text-brand-black dark:text-brand-white">
              <p>{t.message}</p>
            </div>
            <button onClick={() => dismissToast(t.id)} className="text-brand-black/50 dark:text-brand-white/50 hover:text-brand-black dark:hover:text-brand-white">
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Loader ---------------- */
export function LogoLoader() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <img src="/logo.png" alt="Stickiify" className="w-20 h-20 object-contain drop-shadow-2xl" />
      </motion.div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-brand-lime"
            animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}

export function Spinner({ className = "" }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}

/* ---------------- Status Badge ---------------- */
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300",
    confirmed: "bg-blue-400/20 text-blue-700 dark:text-blue-300",
    processing: "bg-indigo-400/20 text-indigo-700 dark:text-indigo-300",
    shipped: "bg-purple-400/20 text-purple-700 dark:text-purple-300",
    outForDelivery: "bg-orange-400/20 text-orange-700 dark:text-orange-300",
    delivered: "bg-brand-lime/30 text-brand-green",
    paymentIssue: "bg-red-400/20 text-red-700 dark:text-red-300",
    cancelled: "bg-gray-400/20 text-gray-700 dark:text-gray-300",
    verified: "bg-brand-lime/30 text-brand-green",
    rejected: "bg-red-400/20 text-red-700 dark:text-red-300",
    accepted: "bg-brand-lime/30 text-brand-green",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colors[status] || colors.pending}`}>{status}</span>;
}

/* ---------------- Rating ---------------- */
export function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" fill={n <= rating ? "#8DFF1A" : "none"} stroke={n <= rating ? "#8DFF1A" : "#aaa"} strokeWidth="2">
          <polygon points="12 2 15 8.5 22 9.3 17 14 18.2 21 12 17.8 5.8 21 7 14 2 9.3 9 8.5 12 2" />
        </svg>
      ))}
    </div>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-brand-green/10 dark:bg-brand-lime/10 rounded-xl ${className}`} />;
}

/* ---------------- Section Header ---------------- */
export function SectionHeader({ title, subtitle, badge }: { title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="text-center mb-10 md:mb-14">
      {badge && <Badge color="green" className="mb-3">{badge}</Badge>}
      <h2 className="text-3xl md:text-5xl font-black text-brand-black dark:text-brand-white tracking-tight">{title}</h2>
      {subtitle && <p className="mt-3 text-brand-black/60 dark:text-brand-white/60 text-base md:text-lg">{subtitle}</p>}
      <div className="mt-4 h-1 w-20 bg-brand-lime mx-auto rounded-full" />
    </div>
  );
}

/* ---------------- Logo ---------------- */
export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <motion.a href="/" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2">
      <img src="/logo.png" alt="Stickiify.eg" className={`${className} object-contain`} />
    </motion.a>
  );
}

/* ---------------- Empty state ---------------- */
export function EmptyState({ icon, title, subtitle, action }: { icon: ReactNode; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand-lime/20 flex items-center justify-center mb-6 text-brand-green">{icon}</div>
      <h3 className="text-2xl font-bold text-brand-black dark:text-brand-white">{title}</h3>
      {subtitle && <p className="mt-2 text-brand-black/60 dark:text-brand-white/60 max-w-md">{subtitle}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ---------------- useScrollTop ---------------- */
export function useScrollTop() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrolled;
}
