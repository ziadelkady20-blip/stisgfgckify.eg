import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Heart, User, Menu, X, Sun, Moon, Globe, Search, LogOut, Settings } from "lucide-react";
import { useApp } from "../store/AppContext";
import { Logo } from "./ui";

export function Navbar() {
  const { t, lang, setLang, theme, toggleTheme, user, logout, cart, wishlist } = useApp();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [loc.pathname]);

  const navLinks = [
    { to: "/", label: t.nav.home },
    { to: "/shop", label: t.nav.shop },
    { to: "/custom", label: t.nav.custom },
    { to: "/track", label: t.nav.track },
  ];

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      <div className="glass">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left */}
            <div className="flex items-center gap-6">
              <button
                className="md:hidden text-brand-black dark:text-brand-white"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Logo className="h-10 md:h-12" />
            </div>

            {/* Center */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="relative px-4 py-2 rounded-xl text-sm font-semibold text-brand-black/80 dark:text-brand-white/80 hover:text-brand-black dark:hover:text-brand-white transition-colors group"
                >
                  {l.label}
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-brand-lime transition-all group-hover:w-1/2 rounded-full" />
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-brand-green bg-brand-lime/20 hover:bg-brand-lime/40 transition-colors"
                >
                  {t.nav.admin}
                </Link>
              )}
            </nav>

            {/* Right */}
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/15 transition"
              >
                <Globe size={16} />
                {lang === "en" ? "العربية" : "EN"}
              </button>

              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/15 transition"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Link
                to="/shop"
                className="hidden md:flex p-2.5 rounded-xl text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/15 transition"
                aria-label="Search"
              >
                <Search size={18} />
              </Link>

              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-xl text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/15 transition"
                aria-label="Wishlist"
              >
                <Heart size={18} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-lime text-brand-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative p-2.5 rounded-xl text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/15 transition"
                aria-label="Cart"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-brand-lime text-brand-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 ml-1 px-3 py-2 rounded-xl bg-brand-green text-brand-lime font-semibold text-xs hover:bg-[#006b23] transition"
                >
                  <User size={16} />
                  <span className="hidden md:inline">
                    {user ? user.name.split(" ")[0] : t.nav.login}
                  </span>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-2xl shadow-2xl overflow-hidden"
                    >
                      {user ? (
                        <>
                          <div className="px-4 py-3 border-b border-brand-lime/20">
                            <p className="font-bold text-sm text-brand-black dark:text-brand-white truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-brand-black/60 dark:text-brand-white/60 truncate">
                              {user.email}
                            </p>
                            {user.role === "admin" && (
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-lime text-brand-black font-bold">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-black dark:text-brand-white hover:bg-brand-lime/10">
                            <Settings size={16} /> {t.nav.dashboard}
                          </Link>
                          {user.role === "admin" && (
                            <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-black dark:text-brand-white hover:bg-brand-lime/10">
                              <User size={16} /> {t.nav.admin}
                            </Link>
                          )}
                          <button
                            onClick={() => {
                              logout();
                              setProfileOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <LogOut size={16} /> {t.nav.logout}
                          </button>
                        </>
                      ) : (
                        <>
                          <Link to="/login" className="flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-brand-black dark:text-brand-white hover:bg-brand-lime/10">
                            {t.nav.login}
                          </Link>
                          <Link to="/register" className="block text-center px-4 py-2.5 text-sm font-semibold bg-brand-lime text-brand-black">
                            {t.nav.register}
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="px-4 py-3 rounded-xl font-semibold text-brand-black dark:text-brand-white hover:bg-brand-lime/15 transition"
                >
                  {l.label}
                </Link>
              ))}
              {user?.role === "admin" && (
                <Link to="/admin" className="px-4 py-3 rounded-xl font-semibold text-brand-green bg-brand-lime/20">
                  {t.nav.admin}
                </Link>
              )}
              <button
                onClick={() => setLang(lang === "en" ? "ar" : "en")}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-brand-black dark:text-brand-white hover:bg-brand-lime/15"
              >
                <Globe size={16} /> {lang === "en" ? "العربية" : "English"}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const { t } = useApp();
  return (
    <footer className="mt-24 bg-brand-green text-brand-white relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2 space-y-5">
            <Logo className="h-12" />
            <p className="text-brand-lime/80 text-lg font-medium">{t.slogan}</p>
            <p className="text-sm text-brand-white/70 max-w-md">
              {t.footer.tagline}
            </p>
            <a
              href="https://www.instagram.com/stickiify.eg"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-lime text-brand-black font-semibold text-sm hover:bg-[#7bea12] transition"
            >
              📸 {t.footer.follow}
            </a>
          </div>

          <div>
            <h4 className="font-bold text-brand-lime mb-4">{t.footer.links}</h4>
            <ul className="space-y-2.5 text-sm text-brand-white/80">
              <li><Link to="/shop" className="hover:text-brand-lime">{t.nav.shop}</Link></li>
              <li><Link to="/custom" className="hover:text-brand-lime">{t.nav.custom}</Link></li>
              <li><Link to="/track" className="hover:text-brand-lime">{t.nav.track}</Link></li>
              <li><Link to="/login" className="hover:text-brand-lime">{t.nav.login}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-brand-lime mb-4">{t.footer.help}</h4>
            <ul className="space-y-2.5 text-sm text-brand-white/80">
              <li><a href="mailto:hi@stickiify.eg" className="hover:text-brand-lime">hi@stickiify.eg</a></li>
              <li><a href="tel:+201107930397" className="hover:text-brand-lime">+20 110 793 0397</a></li>
              <li className="text-brand-white/60">Cairo, Egypt</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-brand-lime/20 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-white/60">
          <p>© 2026 Stickiify.eg — {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <a href="https://www.instagram.com/stickiify.eg" target="_blank" rel="noreferrer" className="hover:text-brand-lime">Instagram</a>
            <span>·</span>
            <a href="#" className="hover:text-brand-lime">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:text-brand-lime">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
