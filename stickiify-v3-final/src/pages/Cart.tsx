import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useApp } from "../store/AppContext";
import { products, governorates } from "../lib/mockData";
import { Button, Input, Textarea, Select, EmptyState } from "../components/ui";

export default function Cart() {
  const { t, lang, cart, updateQty, removeFromCart, clearCart, toast } = useApp();

  const items = cart.map((c) => {
    const p = products.find((pp) => pp.id === c.productId);
    return { ...c, product: p };
  }).filter((i) => i.product);

  const subtotal = items.reduce((s, i) => s + (i.product!.price * i.quantity), 0);
  const shipping = subtotal > 300 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title={t.cart.empty}
          action={
            <Link to="/shop">
              <Button size="lg">{lang === "en" ? "Start shopping" : "ابدأ التسوق"}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white mb-10">{t.cart.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((i) => (
            <motion.div key={i.productId} layout className="glass rounded-3xl p-4 md:p-5 flex gap-4 items-center">
              <Link to={`/product/${i.product!.slug}`} className="shrink-0">
                <img src={i.product!.images[0]} className="w-20 h-20 md:w-28 md:h-28 rounded-2xl object-cover" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${i.product!.slug}`}>
                  <h3 className="font-bold text-brand-black dark:text-brand-white truncate">{lang === "en" ? i.product!.name : i.product!.nameAr}</h3>
                </Link>
                <p className="text-brand-green font-black text-lg mt-1">{i.product!.price} {t.egyptPound}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 glass rounded-xl p-1">
                    <button onClick={() => updateQty(i.productId, i.quantity - 1)} className="w-7 h-7 rounded-lg hover:bg-brand-lime/20 flex items-center justify-center">
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm">{i.quantity}</span>
                    <button onClick={() => updateQty(i.productId, i.quantity + 1)} className="w-7 h-7 rounded-lg hover:bg-brand-lime/20 flex items-center justify-center">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => removeFromCart(i.productId)} className="text-red-500 hover:text-red-700 ml-2">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-black text-brand-green text-lg">{i.product!.price * i.quantity} {t.egyptPound}</p>
              </div>
            </motion.div>
          ))}
          <div className="flex justify-end pt-2">
            <button onClick={() => { clearCart(); toast(lang === "en" ? "Cart cleared" : "السلة اتفرغت"); }} className="text-sm text-red-500 hover:underline">
              {t.cart.clear}
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 h-fit sticky top-28">
          <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">{lang === "en" ? "Summary" : "الملخص"}</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-black/70 dark:text-brand-white/70">{t.cart.subtotal}</span>
              <span className="font-bold text-brand-black dark:text-brand-white">{subtotal} {t.egyptPound}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-black/70 dark:text-brand-white/70">{t.cart.shipping}</span>
              <span className="font-bold text-brand-black dark:text-brand-white">{shipping === 0 ? t.cart.free : `${shipping} ${t.egyptPound}`}</span>
            </div>
            <div className="border-t border-brand-green/20 pt-3 flex justify-between text-base">
              <span className="font-bold text-brand-black dark:text-brand-white">{t.cart.total}</span>
              <span className="font-black text-2xl text-brand-green">{total} {t.egyptPound}</span>
            </div>
          </div>
          <Link to="/checkout" className="block mt-6">
            <Button size="lg" className="w-full">
              {t.cart.checkout} <ArrowRight size={18} />
            </Button>
          </Link>
          {subtotal < 300 && (
            <p className="text-xs text-center mt-3 text-brand-black/60 dark:text-brand-white/60">
              {lang === "en" ? `Add ${300 - subtotal} ${t.egyptPound} more for free shipping!` : `أضف ${300 - subtotal} ${t.egyptPound} تاني عشان الشحن مجاناً!`}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CHECKOUT ---------------- */
export function Checkout() {
  const { t, lang, cart, createOrder, clearCart, toast, user } = useApp();
  const [step, setStep] = useState<"form" | "payment" | "done">("form");
  const [payment, setPayment] = useState<"cod" | "vodafone">("cod");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [senderPhone, setSenderPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [form, setForm] = useState({ name: user?.name || "", phone: user?.phone || "", address: "", governorate: "Cairo", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const items = cart.map((c) => {
    const p = products.find((pp) => pp.id === c.productId);
    return { ...c, product: p };
  }).filter((i) => i.product);

  const subtotal = items.reduce((s, i) => s + (i.product!.price * i.quantity), 0);
  const shipping = subtotal > 300 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0 && step !== "done") {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20">
        <EmptyState
          icon={<ShoppingBag size={40} />}
          title={t.cart.empty}
          action={<Link to="/shop"><Button size="lg">{lang === "en" ? "Start shopping" : "ابدأ التسوق"}</Button></Link>}
        />
      </div>
    );
  }

  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.checkout.required;
    if (!form.phone.trim() || form.phone.length < 10) e.phone = t.checkout.required;
    if (!form.address.trim()) e.address = t.checkout.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = () => {
    const id = createOrder({
      user: user?.email || "guest@stickiify.eg",
      products: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.product!.price })),
      total,
      paymentMethod: payment,
      paymentStatus: payment === "vodafone" ? "pending" : "pending",
      orderStatus: "pending",
      address: form.address,
      phone: form.phone,
      name: form.name,
      governorate: form.governorate,
      notes: form.notes,
      senderPhone: payment === "vodafone" ? senderPhone : undefined,
      screenshot: screenshot ? URL.createObjectURL(screenshot) : undefined,
    });
    setOrderId(id);
    clearCart();
    setStep("done");
    toast(t.checkout.success + " " + id);
  };

  if (step === "done") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-brand-lime mx-auto flex items-center justify-center mb-6 glow-lime">
          <Check size={48} className="text-brand-green" strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white mb-4">
          {lang === "en" ? "Order Placed!" : "تم الطلب!"}
        </h1>
        <p className="text-lg text-brand-black/70 dark:text-brand-white/70 mb-2">
          {t.checkout.success}
        </p>
        <p className="text-3xl font-black text-brand-green mb-8">{orderId}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to={`/track?orderId=${orderId}`}>
            <Button size="lg">{lang === "en" ? "Track Order" : "تتبع الطلب"}</Button>
          </Link>
          <Link to="/shop">
            <Button size="lg" variant="outline">{lang === "en" ? "Continue shopping" : "كمّل تسوق"}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white mb-10">{t.checkout.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass rounded-3xl p-6 space-y-4">
            <h2 className="font-black text-xl text-brand-black dark:text-brand-white">{lang === "en" ? "Delivery Info" : "بيانات التوصيل"}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Input label={t.checkout.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <Input label={t.checkout.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
              <Input label={t.checkout.address} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} error={errors.address} className="md:col-span-2" />
              <Select label={t.checkout.gov} value={form.governorate} onChange={(e) => setForm({ ...form, governorate: e.target.value })} options={governorates.map((g) => ({ value: g, label: g }))} />
              <Textarea label={t.checkout.notes} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="md:col-span-2" rows={3} />
            </div>
          </section>

          <section className="glass rounded-3xl p-6 space-y-4">
            <h2 className="font-black text-xl text-brand-black dark:text-brand-white">{t.checkout.payment}</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { id: "cod", label: t.checkout.cod, icon: "💵" },
                { id: "vodafone", label: t.checkout.vodafone, icon: "📱" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPayment(p.id as any)}
                  className={`p-5 rounded-2xl border-2 text-left transition ${
                    payment === p.id ? "border-brand-lime bg-brand-lime/10" : "border-brand-green/20 hover:border-brand-lime/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <p className="font-bold text-brand-black dark:text-brand-white">{p.label}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {payment === "vodafone" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-brand-green/10 rounded-2xl p-5 space-y-4">
                <div>
                  <p className="text-sm text-brand-black/70 dark:text-brand-white/70 mb-1">{t.checkout.vodafoneNumber}</p>
                  <p className="text-2xl font-black text-brand-green">+20 110 793 0397</p>
                </div>
                <Input label={t.checkout.senderPhone} value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} />
                <div>
                  <label className="block text-sm font-medium mb-2 text-brand-black/80 dark:text-brand-white/80">
                    {t.checkout.screenshot}
                    <span className="ml-2 text-xs opacity-60">{t.checkout.screenshotHint}</span>
                  </label>
                  <label className="block w-full cursor-pointer border-2 border-dashed border-brand-green/30 rounded-2xl p-6 text-center hover:border-brand-lime transition">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setScreenshot(e.target.files?.[0] || null)}
                    />
                    <div className="text-brand-green font-semibold">
                      {screenshot ? screenshot.name : (lang === "en" ? "📎 Click to upload" : "📎 اضغط للرفع")}
                    </div>
                  </label>
                </div>
              </motion.div>
            )}
          </section>
        </div>

        <div className="glass rounded-3xl p-6 h-fit sticky top-28">
          <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">{lang === "en" ? "Summary" : "الملخص"}</h2>
          <div className="space-y-3 mb-4">
            {items.map((i) => (
              <div key={i.productId} className="flex gap-3 items-center">
                <img src={i.product!.images[0]} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-black dark:text-brand-white truncate">{lang === "en" ? i.product!.name : i.product!.nameAr}</p>
                  <p className="text-xs text-brand-black/60 dark:text-brand-white/60">× {i.quantity}</p>
                </div>
                <p className="font-bold text-brand-green">{i.product!.price * i.quantity} {t.egyptPound}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-brand-green/20 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-brand-black/70 dark:text-brand-white/70">{t.cart.subtotal}</span>
              <span className="font-bold">{subtotal} {t.egyptPound}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-brand-black/70 dark:text-brand-white/70">{t.cart.shipping}</span>
              <span className="font-bold">{shipping === 0 ? t.cart.free : `${shipping} ${t.egyptPound}`}</span>
            </div>
            <div className="border-t border-brand-green/20 pt-2 flex justify-between">
              <span className="font-bold">{t.cart.total}</span>
              <span className="font-black text-2xl text-brand-green">{total} {t.egyptPound}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-6" onClick={() => { if (payment === "cod" && validateForm()) handlePlaceOrder(); else if (payment === "vodafone" && validateForm() && senderPhone) handlePlaceOrder(); else if (!validateForm()) toast(lang === "en" ? "Please fill all required fields" : "املأ كل الحقول المطلوبة", "error"); }}>
            {t.checkout.place} <Check size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
