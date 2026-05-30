import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./store/AppContext";
import { Navbar, Footer } from "./components/Layout";
import { Toaster, LogoLoader } from "./components/ui";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart, { Checkout } from "./pages/Cart";
import CustomDesign from "./pages/CustomDesign";
import OrderTracking from "./pages/OrderTracking";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function ProtectedRoute({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function WishlistPage() {
  const { t, lang, wishlist, toggleWishlist, addToCart, toast } = useApp();
  const { products } = useApp();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-8">{t.nav.wishlist}</h1>
        <p className="text-brand-black/60 dark:text-brand-white/60 mb-6">{lang === "en" ? "Your wishlist is empty" : "مفضلتك فاضية"}</p>
        <a href="/shop" className="inline-block px-6 py-3 bg-brand-lime text-brand-black rounded-xl font-bold hover:bg-[#7bea12]">
          {lang === "en" ? "Discover products" : "اكتشف المنتجات"}
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-4xl font-black text-brand-black dark:text-brand-white mb-8">{t.nav.wishlist}</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => (
          <div key={p.id} className="group">
            <a href={`/product/${p.slug}`} className="block">
              <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green/5 to-brand-lime/5">
                <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            </a>
            <div className="mt-3">
              <a href={`/product/${p.slug}`}>
                <h3 className="font-bold text-brand-black dark:text-brand-white line-clamp-1">{lang === "en" ? p.name : p.nameAr}</h3>
              </a>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-black text-brand-green">{p.price} {t.egyptPound}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(p.id);
                      toast(lang === "en" ? "Added to cart" : "أُضيف للسلة");
                    }}
                    className="px-3 py-1.5 bg-brand-lime text-brand-black rounded-lg text-xs font-bold hover:bg-[#7bea12]"
                  >
                    {t.addCart}
                  </button>
                  <button
                    onClick={() => toggleWishlist(p.id)}
                    className="px-2 py-1.5 border border-red-300 text-red-500 rounded-lg text-xs hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <div className="text-9xl font-black text-brand-lime mb-4">404</div>
      <h1 className="text-3xl font-black text-brand-black dark:text-brand-white mb-4">
        Oops! Page not found
      </h1>
      <p className="text-brand-black/60 dark:text-brand-white/60 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a href="/" className="inline-block px-6 py-3 bg-brand-lime text-brand-black rounded-xl font-bold hover:bg-[#7bea12]">
        Go Home
      </a>
    </div>
  );
}

function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/custom" element={<CustomDesign />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute admin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-green via-[#00260d] to-brand-black">
        <LogoLoader />
      </div>
    );
  }

  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}
