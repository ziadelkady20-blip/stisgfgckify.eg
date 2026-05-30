import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Heart, Settings, LogOut, Truck } from "lucide-react";
import { useApp } from "../store/AppContext";
import { products } from "../lib/mockData";
import { Button, StatusBadge, EmptyState } from "../components/ui";

export default function UserDashboard() {
  const { t, lang, user, logout, orders, wishlist } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("profile");

  if (!user) {
    navigate("/login");
    return null;
  }

  const myOrders = orders.filter((o) => o.user === user.email);
  const wishProducts = products.filter((p) => wishlist.includes(p.id));

  const tabs: { key: string; label: string; icon: any; count?: number }[] = [
    { key: "profile", label: t.dashboard.profile, icon: User },
    { key: "orders", label: t.dashboard.orders, icon: Package, count: myOrders.length },
    { key: "shipping", label: lang === "en" ? "Shipping" : "تفاصيل الشحن", icon: Truck, count: myOrders.filter(o => o.trackingNumber).length || undefined },
    { key: "wishlist", label: t.dashboard.wishlist, icon: Heart, count: wishProducts.length },
    { key: "settings", label: t.dashboard.settings, icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="grid lg:grid-cols-4 gap-6">
        <aside className="glass rounded-3xl p-6 h-fit">
          <div className="text-center pb-5 border-b border-brand-green/20">
            <div className="w-20 h-20 rounded-full bg-brand-lime text-brand-black font-black text-3xl mx-auto mb-3 flex items-center justify-center">
              {user.name[0].toUpperCase()}
            </div>
            <h2 className="font-black text-lg text-brand-black dark:text-brand-white">{user.name}</h2>
            <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{user.email}</p>
          </div>
          <nav className="mt-4 space-y-1">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  tab === tabItem.key ? "bg-brand-lime text-brand-black" : "text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <tabItem.icon size={18} /> {tabItem.label}
                </span>
                {tabItem.count !== undefined && tabItem.count > 0 && (
                  <span className="text-xs bg-brand-black/10 px-2 py-0.5 rounded-full">{tabItem.count}</span>
                )}
              </button>
            ))}
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            >
              <LogOut size={18} /> {t.nav.logout}
            </button>
          </nav>
        </aside>

        <div className="lg:col-span-3">
          {tab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6">{t.dashboard.profile}</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-5 bg-brand-green/5 rounded-2xl">
                  <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-1">{t.auth.name}</p>
                  <p className="font-bold text-brand-black dark:text-brand-white">{user.name}</p>
                </div>
                <div className="p-5 bg-brand-green/5 rounded-2xl">
                  <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-1">{t.auth.email}</p>
                  <p className="font-bold text-brand-black dark:text-brand-white">{user.email}</p>
                </div>
                {user.phone && (
                  <div className="p-5 bg-brand-green/5 rounded-2xl">
                    <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-1">{t.auth.phone}</p>
                    <p className="font-bold text-brand-black dark:text-brand-white">{user.phone}</p>
                  </div>
                )}
                <div className="p-5 bg-brand-green/5 rounded-2xl">
                  <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-1">{lang === "en" ? "Member since" : "عضو من"}</p>
                  <p className="font-bold text-brand-black dark:text-brand-white">2026</p>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6">{t.dashboard.orderHistory}</h2>
              {myOrders.length === 0 ? (
                <EmptyState
                  icon={<Package size={40} />}
                  title={t.dashboard.noOrders}
                  action={<Link to="/shop"><Button>{lang === "en" ? "Start shopping" : "ابدأ التسوق"}</Button></Link>}
                />
              ) : (
                <div className="space-y-4">
                  {myOrders.map((o) => (
                    <Link key={o.id} to={`/track?orderId=${o.id}`} className="block">
                      <div className="glass rounded-2xl p-5 hover:scale-[1.01] transition">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-black text-brand-black dark:text-brand-white">{o.id}</p>
                            <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mt-1">
                              {new Date(o.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")}
                            </p>
                          </div>
                          <StatusBadge status={o.orderStatus} />
                          <p className="font-black text-brand-green">{o.total} {t.egyptPound}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "shipping" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6">
                {lang === "en" ? "Shipping Details" : "تفاصيل الشحن"}
              </h2>
              {myOrders.length === 0 ? (
                <EmptyState
                  icon={<Truck size={40} />}
                  title={lang === "en" ? "No orders yet" : "مفيش طلبات لسه"}
                  action={<Link to="/shop"><Button>{lang === "en" ? "Start shopping" : "ابدأ التسوق"}</Button></Link>}
                />
              ) : (
                <div className="space-y-5">
                  {myOrders.map((o) => (
                    <div key={o.id} className="glass rounded-2xl p-5">
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div>
                          <p className="font-black text-lg text-brand-black dark:text-brand-white">{o.id}</p>
                          <p className="text-xs text-brand-black/50 dark:text-brand-white/50">
                            {lang === "en" ? "Created: " : "تاريخ الطلب: "}
                            {new Date(o.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")}
                          </p>
                        </div>
                        <StatusBadge status={o.orderStatus} />
                      </div>

                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Order Status */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Order Status" : "حالة الطلب"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {(t.statuses as any)[o.orderStatus] || o.orderStatus}
                          </p>
                        </div>

                        {/* Payment Status */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Payment Status" : "حالة الدفع"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {o.paymentStatus === "verified"
                              ? (lang === "en" ? "Verified ✅" : "مؤكد ✅")
                              : o.paymentStatus === "rejected"
                              ? (lang === "en" ? "Rejected ❌" : "مرفوض ❌")
                              : (lang === "en" ? "Pending ⏳" : "قيد المراجعة ⏳")}
                          </p>
                        </div>

                        {/* Shipping Company */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Shipping Company" : "شركة الشحن"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {o.shippingCompany || (lang === "en" ? "Not assigned yet" : "لم يتم التحديد بعد")}
                          </p>
                        </div>

                        {/* Tracking Number */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Tracking Number" : "رقم التتبع"}
                          </p>
                          <p className="font-bold text-brand-lime text-sm font-mono">
                            {o.trackingNumber || (lang === "en" ? "—" : "—")}
                          </p>
                        </div>

                        {/* Shipped Date */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Shipped Date" : "تاريخ الشحن"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {o.shippedAt
                              ? new Date(o.shippedAt).toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")
                              : (lang === "en" ? "Not shipped yet" : "لم يتم الشحن بعد")}
                          </p>
                        </div>

                        {/* Estimated Delivery */}
                        <div className="p-3 bg-brand-green/5 rounded-xl">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Estimated Delivery" : "التاريخ المتوقع للوصول"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {o.estimatedDelivery
                              ? new Date(o.estimatedDelivery).toLocaleDateString(lang === "en" ? "en-US" : "ar-EG")
                              : (lang === "en" ? "—" : "—")}
                          </p>
                        </div>

                        {/* Shipping Address */}
                        <div className="p-3 bg-brand-green/5 rounded-xl md:col-span-2">
                          <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                            {lang === "en" ? "Shipping Address" : "عنوان الشحن"}
                          </p>
                          <p className="font-bold text-brand-black dark:text-brand-white text-sm">
                            {o.address}, {o.governorate}
                          </p>
                        </div>

                        {/* Shipping Notes */}
                        {o.shippingNotes && (
                          <div className="p-3 bg-brand-lime/10 rounded-xl md:col-span-2">
                            <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mb-1">
                              {lang === "en" ? "Shipping Notes" : "ملاحظات الشحن"}
                            </p>
                            <p className="font-medium text-brand-black dark:text-brand-white text-sm">
                              {o.shippingNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "wishlist" && (            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6">{t.dashboard.wishlist}</h2>
              {wishProducts.length === 0 ? (
                <EmptyState
                  icon={<Heart size={40} />}
                  title={lang === "en" ? "Your wishlist is empty" : "مفضلتك فاضية"}
                  action={<Link to="/shop"><Button>{lang === "en" ? "Discover products" : "اكتشف المنتجات"}</Button></Link>}
                />
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {wishProducts.map((p) => (
                    <Link key={p.id} to={`/product/${p.slug}`} className="block glass rounded-2xl p-4 flex gap-4 hover:scale-[1.01] transition">
                      <img src={p.images[0]} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-black dark:text-brand-white line-clamp-1">{lang === "en" ? p.name : p.nameAr}</h3>
                        <p className="text-brand-green font-black mt-1">{p.price} {t.egyptPound}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-black text-brand-black dark:text-brand-white mb-6">{t.dashboard.settings}</h2>
              <div className="space-y-4 max-w-md">
                <button className="w-full text-left p-4 bg-brand-green/5 rounded-2xl hover:bg-brand-lime/10 transition flex items-center justify-between">
                  <span className="font-semibold text-brand-black dark:text-brand-white">{lang === "en" ? "Change Password" : "تغيير كلمة السر"}</span>
                  <span>→</span>
                </button>
                <button className="w-full text-left p-4 bg-brand-green/5 rounded-2xl hover:bg-brand-lime/10 transition flex items-center justify-between">
                  <span className="font-semibold text-brand-black dark:text-brand-white">{lang === "en" ? "Notifications" : "الإشعارات"}</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => { logout(); navigate("/"); }}
                  className="w-full text-left p-4 bg-red-500/10 text-red-600 rounded-2xl hover:bg-red-500/20 transition flex items-center gap-3"
                >
                  <LogOut size={18} /> {t.nav.logout}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
