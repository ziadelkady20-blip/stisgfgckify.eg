import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Package, Check, Truck, CheckCircle2 } from "lucide-react";
import { useApp } from "../store/AppContext";
import { Button, Input, StatusBadge, EmptyState } from "../components/ui";

export default function OrderTracking() {
  const { t, lang, orders } = useApp();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("orderId") || "");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);

  const order = orders.find((o) => o.id.toUpperCase() === orderId.toUpperCase() && o.phone === phone);

  const allStatuses: { key: string; label: string; icon: any }[] = [
    { key: "pending", label: t.statuses.pending, icon: Package },
    { key: "confirmed", label: t.statuses.confirmed, icon: Check },
    { key: "processing", label: t.statuses.processing, icon: Package },
    { key: "shipped", label: t.statuses.shipped, icon: Truck },
    { key: "outForDelivery", label: t.statuses.outForDelivery, icon: Truck },
    { key: "delivered", label: t.statuses.delivered, icon: CheckCircle2 },
  ];

  const statusIndex = allStatuses.findIndex((s) => s.key === order?.orderStatus);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black dark:text-brand-white">{t.track.title}</h1>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 mb-8">
        <div className="grid md:grid-cols-3 gap-4 items-end">
          <Input label={t.track.orderId} value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="ORD-1001" />
          <Input label={t.track.phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
          <Button size="lg" className="w-full" onClick={() => setSearched(true)}>
            <Search size={18} /> {t.track.search}
          </Button>
        </div>
      </div>

      {searched && !order && (
        <EmptyState
          icon={<Search size={40} />}
          title={t.track.notFound}
        />
      )}

      {order && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="glass rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between gap-4">
            <div>
              <p className="text-sm text-brand-black/60 dark:text-brand-white/60">{lang === "en" ? "Order ID" : "رقم الطلب"}</p>
              <p className="text-2xl font-black text-brand-black dark:text-brand-white">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-brand-black/60 dark:text-brand-white/60">{t.track.status}</p>
              <StatusBadge status={order.orderStatus} />
            </div>
            <div>
              <p className="text-sm text-brand-black/60 dark:text-brand-white/60">{t.cart.total}</p>
              <p className="text-2xl font-black text-brand-green">{order.total} {t.egyptPound}</p>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-6">{t.track.timeline}</h2>
            <div className="space-y-6">
              {allStatuses.map((s, i) => {
                const Icon = s.icon;
                const isActive = i <= statusIndex;
                const isCurrent = i === statusIndex;
                return (
                  <div key={s.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition ${
                        isActive ? "bg-brand-lime text-brand-green glow-lime-sm" : "bg-brand-green/10 text-brand-black/30 dark:text-brand-white/30"
                      } ${isCurrent ? "ring-4 ring-brand-lime/30" : ""}`}>
                        <Icon size={18} />
                      </div>
                      {i < allStatuses.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-2 ${i < statusIndex ? "bg-brand-lime" : "bg-brand-green/10"}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-bold ${isActive ? "text-brand-black dark:text-brand-white" : "text-brand-black/40 dark:text-brand-white/40"}`}>{s.label}</p>
                      {isActive && order.history[i] && (
                        <p className="text-xs text-brand-black/60 dark:text-brand-white/60 mt-0.5">
                          {new Date(order.history[i].timestamp).toLocaleString(lang === "en" ? "en-US" : "ar-EG")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8">
            <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">{lang === "en" ? "Order Details" : "تفاصيل الطلب"}</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div><p className="text-brand-black/60 dark:text-brand-white/60">{t.checkout.name}</p><p className="font-bold text-brand-black dark:text-brand-white">{order.name}</p></div>
              <div><p className="text-brand-black/60 dark:text-brand-white/60">{t.checkout.phone}</p><p className="font-bold text-brand-black dark:text-brand-white">{order.phone}</p></div>
              <div><p className="text-brand-black/60 dark:text-brand-white/60">{t.checkout.gov}</p><p className="font-bold text-brand-black dark:text-brand-white">{order.governorate}</p></div>
              <div><p className="text-brand-black/60 dark:text-brand-white/60">{t.checkout.payment}</p><p className="font-bold text-brand-black dark:text-brand-white">{order.paymentMethod === "cod" ? t.checkout.cod : t.checkout.vodafone}</p></div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Demo hint */}
      <div className="mt-10 text-center text-sm text-brand-black/50 dark:text-brand-white/50">
        <p>{lang === "en" ? "Demo orders:" : "طلبات تجريبية:"} ORD-1001 / 01101234567, ORD-1002 / 01223456789</p>
      </div>
    </div>
  );
}
