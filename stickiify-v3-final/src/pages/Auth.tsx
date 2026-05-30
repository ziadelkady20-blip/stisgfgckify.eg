import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Eye, EyeOff, KeyRound, ArrowLeft } from "lucide-react";
import { useApp } from "../store/AppContext";
import { Button } from "../components/ui";

type Mode = "login" | "register";
type ForgotStep = "idle" | "enterContact" | "enterCode" | "done";

export default function Auth({ mode }: { mode: Mode }) {
  const { t, lang, login, register, forgotPassword, resetPassword, toast, user } = useApp();
  const navigate = useNavigate();

  // Redirect when Firebase confirms the user is logged in
  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  // Forgot password state
  const [forgotStep, setForgotStep] = useState<ForgotStep>("idle");
  const [forgotContact, setForgotContact] = useState("");
  const [forgotEmail, setForgotEmail] = useState(""); // resolved email after step 1
  const [forgotCode, setForgotCode] = useState("");
  const [forgotNewPw, setForgotNewPw] = useState("");
  const [showForgotPw, setShowForgotPw] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = isLogin
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password, form.phone);
    if (res.ok) {
      toast(res.message);
      // navigation handled by useEffect above when user state updates
    } else {
      toast(res.message, "error");
    }
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const res = forgotPassword(forgotContact) as any;
    if (res.ok) {
      setForgotEmail(res.email);
      toast(res.message);
      setForgotStep("enterCode");
    } else {
      toast(res.message, "error");
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const res = resetPassword(forgotEmail, forgotCode, forgotNewPw);
    if (res.ok) {
      toast(res.message);
      setForgotStep("idle");
      setForgotContact("");
      setForgotCode("");
      setForgotNewPw("");
    } else {
      toast(res.message, "error");
    }
  };

  // ── Forgot password modal ────────────────────────────────────────────────
  if (forgotStep !== "idle") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-brand-lime flex items-center justify-center mx-auto mb-4">
              <KeyRound size={28} className="text-brand-black" />
            </div>
            <h1 className="text-3xl font-black text-brand-black dark:text-brand-white">
              {lang === "en" ? "Reset Password" : "إعادة تعيين كلمة السر"}
            </h1>
            <p className="mt-2 text-brand-black/60 dark:text-brand-white/60 text-sm">
              {forgotStep === "enterContact"
                ? (lang === "en" ? "Enter your email or phone number" : "ادخل إيميلك أو رقم موبايلك")
                : (lang === "en" ? "Enter the code sent to you and your new password" : "ادخل الكود اللي اتبعتلك وكلمة السر الجديدة")}
            </p>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 space-y-4">
            <AnimatePresence mode="wait">
              {forgotStep === "enterContact" && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleForgotRequest}
                  className="space-y-4"
                >
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
                    <input
                      required
                      value={forgotContact}
                      onChange={(e) => setForgotContact(e.target.value)}
                      placeholder={lang === "en" ? "Email or phone number" : "الإيميل أو رقم الموبايل"}
                      className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    {lang === "en" ? "Send Verification Code" : "ابعتلي كود التحقق"}
                  </Button>
                </motion.form>
              )}

              {forgotStep === "enterCode" && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleResetPassword}
                  className="space-y-4"
                >
                  <div className="p-3 bg-brand-lime/20 rounded-xl text-sm text-brand-black dark:text-brand-white text-center font-medium">
                    {lang === "en" ? `Code sent to: ${forgotEmail}` : `تم الإرسال إلى: ${forgotEmail}`}
                  </div>
                  <div className="relative">
                    <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
                    <input
                      required
                      value={forgotCode}
                      onChange={(e) => setForgotCode(e.target.value)}
                      placeholder={lang === "en" ? "6-digit code" : "الكود المكون من 6 أرقام"}
                      maxLength={6}
                      className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white tracking-widest font-mono text-lg"
                    />
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
                    <input
                      required
                      type={showForgotPw ? "text" : "password"}
                      value={forgotNewPw}
                      onChange={(e) => setForgotNewPw(e.target.value)}
                      placeholder={lang === "en" ? "New password" : "كلمة السر الجديدة"}
                      className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-11 py-3 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
                    />
                    <button type="button" onClick={() => setShowForgotPw(!showForgotPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40">
                      {showForgotPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    {lang === "en" ? "Reset Password" : "تغيير كلمة السر"}
                  </Button>
                  <button
                    type="button"
                    onClick={() => setForgotStep("enterContact")}
                    className="w-full text-center text-sm text-brand-black/50 dark:text-brand-white/50 hover:text-brand-lime transition"
                  >
                    {lang === "en" ? "Resend code" : "أعد إرسال الكود"}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setForgotStep("idle")}
            className="flex items-center gap-2 mx-auto mt-6 text-sm text-brand-black/60 dark:text-brand-white/60 hover:text-brand-lime transition"
          >
            <ArrowLeft size={16} />
            {lang === "en" ? "Back to login" : "رجوع لتسجيل الدخول"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Normal login / register form ─────────────────────────────────────────
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Stickiify" className="w-20 h-20 mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white">
            {isLogin ? t.auth.login : t.auth.register}
          </h1>
          <p className="mt-2 text-brand-black/60 dark:text-brand-white/60">
            {isLogin ? t.slogan : lang === "en" ? "Join the Stickiify community" : "انضم لمجتمع ستيكفاي"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-8 space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={t.auth.name}
                  className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime"
                />
              </div>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={t.auth.phone}
                  className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder={t.auth.email}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime"
            />
          </div>

          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
            <input
              type={showPw ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={t.auth.password}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-11 py-3 outline-none focus:border-brand-lime"
            />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-black/40">
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => setForgotStep("enterContact")}
                className="text-sm text-brand-lime hover:underline"
              >
                {t.auth.forgot}
              </button>
            </div>
          )}

          <Button type="submit" size="lg" className="w-full">
            {isLogin ? t.auth.login : t.auth.register}
          </Button>

          {isLogin && (
            <p className="text-center text-xs text-brand-black/50 dark:text-brand-white/50">
              {lang === "en"
                ? "Use your account credentials to continue."
                : "استخدم بيانات حسابك للمتابعة."}
            </p>
          )}
        </form>

        <p className="text-center mt-6 text-sm text-brand-black/60 dark:text-brand-white/60">
          {isLogin ? t.auth.noAccount : t.auth.hasAccount}{" "}
          <Link to={isLogin ? "/register" : "/login"} className="text-brand-lime font-bold hover:underline">
            {isLogin ? t.auth.register : t.auth.login}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
