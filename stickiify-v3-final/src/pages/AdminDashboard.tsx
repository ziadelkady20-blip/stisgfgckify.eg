import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard, ShoppingCart, CheckCircle2, XCircle, Users, DollarSign, TrendingUp,
  Eye, Package, Plus, Upload, Trash2, Image, Tag, X, UserCheck,
} from "lucide-react";
import { useApp } from "../store/AppContext";
import type { Product, Category } from "../lib/mockData";
import { Button, StatusBadge, Badge } from "../components/ui";
import { ConfirmModal } from "../components/ConfirmModal";

type Tab = "analytics" | "products" | "categories" | "orders" | "payments" | "requests" | "users";

/* ==========================================================
 *  ADMIN DASHBOARD — top-level container
 * ========================================================== */
export default function AdminDashboard() {
  const { t, user, orders, customRequests, allUsers } = useApp();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("analytics");

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "pending").length;
  const pendingPayments = orders.filter(
    (o) => o.paymentMethod === "vodafone" && o.paymentStatus === "pending"
  ).length;
  const pendingRequests = customRequests.filter((r) => r.status === "pending").length;

  const tabs: { key: Tab; label: string; icon: any; badge?: number }[] = [
    { key: "analytics", label: t.admin.analytics, icon: LayoutDashboard },
    { key: "orders", label: t.admin.orders, icon: ShoppingCart, badge: pendingOrdersCount },
    { key: "payments", label: t.admin.payments, icon: CheckCircle2, badge: pendingPayments },
    { key: "products", label: t.admin.products, icon: Package },
    { key: "categories", label: t.admin.categories, icon: Tag },
    { key: "requests", label: t.admin.requests, icon: Eye, badge: pendingRequests },
    { key: "users", label: "العملاء", icon: UserCheck },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white flex items-center gap-3">
          {t.admin.title} <Badge color="lime">ADMIN</Badge>
        </h1>
        <p className="mt-2 text-brand-black/60 dark:text-brand-white/60">{user.email}</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1 glass rounded-3xl p-4 h-fit">
          <nav className="space-y-1">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                  tab === tb.key
                    ? "bg-brand-lime text-brand-black glow-lime-sm"
                    : "text-brand-black/70 dark:text-brand-white/70 hover:bg-brand-lime/10"
                }`}
              >
                <span className="flex items-center gap-3">
                  <tb.icon size={18} /> {tb.label}
                </span>
                {tb.badge !== undefined && tb.badge > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">
                    {tb.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="lg:col-span-4">
          {tab === "analytics" && <Analytics />}
          {tab === "orders" && <OrdersTab />}
          {tab === "payments" && <PaymentsTab />}
          {tab === "products" && <ProductsTab />}
          {tab === "categories" && <CategoriesTab />}
          {tab === "requests" && <RequestsTab />}
          {tab === "users" && <UsersTab />}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
 *  ANALYTICS
 * ========================================================== */
function Analytics() {
  const { t, orders } = useApp();
  const totalRevenue = orders
    .filter((o) => o.orderStatus === "delivered" || o.paymentStatus === "verified")
    .reduce((s, o) => s + o.total, 0);
  const usersCount = new Set(orders.map((o) => o.user)).size;

  const stats = [
    { label: t.admin.revenue, value: `${totalRevenue.toLocaleString()} ${t.egyptPound}`, icon: DollarSign, from: "from-[#8dff1a]", to: "to-[#7bea12]", text: "text-brand-green" },
    { label: t.admin.totalOrders, value: orders.length, icon: ShoppingCart, from: "from-[#004d1a]", to: "to-[#006b23]", text: "text-brand-lime" },
    { label: t.admin.users, value: usersCount, icon: Users, from: "from-[#6d28d9]", to: "to-[#4338ca]", text: "text-white" },
    { label: "Growth", value: "+24%", icon: TrendingUp, from: "from-[#f97316]", to: "to-[#ec4899]", text: "text-white" },
  ];

  // Simple bar chart data: order counts per status
  const statuses = ["underReview", "pendingPaymentVerification", "pending", "confirmed", "processing", "preparingShipment", "shipped", "outForDelivery", "delivered", "cancelled", "rejected"] as const;
  const chartData = statuses.map((s) => ({
    label: (t.statuses as any)[s],
    value: orders.filter((o) => o.orderStatus === s).length,
  }));
  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`rounded-3xl p-5 bg-gradient-to-br ${s.from} ${s.to} ${s.text} shadow-lg overflow-hidden relative`}
          >
            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10" />
            <s.icon size={28} className="mb-3 opacity-90" />
            <p className="text-xs opacity-80 font-medium">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">
          Orders by Status
        </h2>
        <div className="flex items-end gap-4 h-56">
          {chartData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-brand-black dark:text-brand-white">{d.value}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-lime to-[#b6ff6e] transition-all hover:opacity-80" style={{ height: `${(d.value / maxVal) * 100}%`, minHeight: d.value > 0 ? "8px" : "0" }} />
              <span className="text-[10px] font-bold text-brand-black/70 dark:text-brand-white/70 text-center">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders list */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {orders.slice(0, 5).map((o) => (
            <div key={o.id} className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-brand-black/30">
              <div>
                <p className="font-bold text-sm text-brand-black dark:text-brand-white">{o.id}</p>
                <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{o.name}</p>
              </div>
              <StatusBadge status={o.orderStatus} />
              <p className="font-black text-brand-green text-sm">{o.total} {t.egyptPound}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
 *  ORDERS MANAGEMENT
 * ========================================================== */
function OrdersTab() {
  const { t, orders, updateOrderStatus, updateShippingInfo } = useApp();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingShipping, setEditingShipping] = useState<string | null>(null);
  const [shippingForm, setShippingForm] = useState({
    shippingCompany: "",
    trackingNumber: "",
    shippingNotes: "",
    estimatedDelivery: "",
    shippedAt: "",
  });

  const filtered = orders
    .filter((o) => (filter === "all" ? true : o.orderStatus === filter))
    .filter((o) => o.id.toLowerCase().includes(search.toLowerCase()) || o.name.toLowerCase().includes(search.toLowerCase()));

  const statusOptions = [
    { key: "underReview", label: t.statuses.underReview },
    { key: "pendingPaymentVerification", label: t.statuses.pendingPaymentVerification },
    { key: "pending", label: t.statuses.pending },
    { key: "confirmed", label: t.statuses.confirmed },
    { key: "processing", label: t.statuses.processing },
    { key: "preparingShipment", label: t.statuses.preparingShipment },
    { key: "shipped", label: t.statuses.shipped },
    { key: "outForDelivery", label: t.statuses.outForDelivery },
    { key: "delivered", label: t.statuses.delivered },
    { key: "paymentIssue", label: t.statuses.paymentIssue },
    { key: "cancelled", label: t.statuses.cancelled },
    { key: "rejected", label: t.statuses.rejected },
  ];

  const openShippingEdit = (o: any) => {
    setEditingShipping(o.id);
    setShippingForm({
      shippingCompany: o.shippingCompany || "",
      trackingNumber: o.trackingNumber || "",
      shippingNotes: o.shippingNotes || "",
      estimatedDelivery: o.estimatedDelivery ? o.estimatedDelivery.slice(0, 10) : "",
      shippedAt: o.shippedAt ? o.shippedAt.slice(0, 10) : "",
    });
  };

  const saveShipping = (orderId: string) => {
    updateShippingInfo(orderId, {
      shippingCompany: shippingForm.shippingCompany || undefined,
      trackingNumber: shippingForm.trackingNumber || undefined,
      shippingNotes: shippingForm.shippingNotes || undefined,
      estimatedDelivery: shippingForm.estimatedDelivery ? new Date(shippingForm.estimatedDelivery).toISOString() : undefined,
      shippedAt: shippingForm.shippedAt ? new Date(shippingForm.shippedAt).toISOString() : undefined,
    });
    setEditingShipping(null);
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Search order ID or customer name..."
          className="flex-1 rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2.5 text-sm font-bold text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <p className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60 self-center">{filtered.length} orders</p>
      </div>

      <div className="space-y-3">
        {filtered.map((o) => (
          <div key={o.id} className="bg-white/50 dark:bg-brand-black/30 rounded-2xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-black text-brand-black dark:text-brand-white">{o.id}</p>
                <p className="text-sm text-brand-black/70 dark:text-brand-white/70">{o.name} • {o.phone}</p>
                <p className="text-xs text-brand-black/50 dark:text-brand-white/50 mt-0.5">
                  📍 {o.address} — {o.governorate}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={o.orderStatus} />
                <StatusBadge status={o.paymentStatus} />
                <select
                  value={o.orderStatus}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                  className="rounded-lg bg-brand-lime text-brand-black text-xs font-bold px-2.5 py-1.5 outline-none"
                >
                  {statusOptions.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs text-brand-black/70 dark:text-brand-white/70 flex flex-wrap gap-4">
              <span>💰 {o.total} {t.egyptPound}</span>
              <span>💳 {o.paymentMethod === "cod" ? t.checkout.cod : t.checkout.vodafone}</span>
              <span>📅 {new Date(o.createdAt).toLocaleDateString()}</span>
              {o.notes && <span>📝 {o.notes}</span>}
            </div>

            {/* Shipping info summary */}
            {(o.shippingCompany || o.trackingNumber) && (
              <div className="mt-2 text-xs text-brand-black/60 dark:text-brand-white/60 flex flex-wrap gap-3">
                {o.shippingCompany && <span>🚚 {o.shippingCompany}</span>}
                {o.trackingNumber && <span>📦 #{o.trackingNumber}</span>}
                {o.estimatedDelivery && <span>📅 ETA: {new Date(o.estimatedDelivery).toLocaleDateString()}</span>}
              </div>
            )}

            {/* Shipping edit button */}
            <div className="mt-3">
              {editingShipping === o.id ? (
                <div className="mt-2 p-4 bg-brand-lime/10 rounded-xl space-y-3">
                  <p className="font-black text-sm text-brand-black dark:text-brand-white">✏️ Edit Shipping Info</p>
                  <div className="grid md:grid-cols-2 gap-3">
                    <input
                      value={shippingForm.shippingCompany}
                      onChange={(e) => setShippingForm({ ...shippingForm, shippingCompany: e.target.value })}
                      placeholder="Shipping Company"
                      className="rounded-lg bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2 text-sm text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
                    />
                    <input
                      value={shippingForm.trackingNumber}
                      onChange={(e) => setShippingForm({ ...shippingForm, trackingNumber: e.target.value })}
                      placeholder="Tracking Number"
                      className="rounded-lg bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2 text-sm text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-brand-black/60 dark:text-brand-white/60">Shipped Date</label>
                      <input
                        type="date"
                        value={shippingForm.shippedAt}
                        onChange={(e) => setShippingForm({ ...shippingForm, shippedAt: e.target.value })}
                        className="rounded-lg bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2 text-sm text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-brand-black/60 dark:text-brand-white/60">Estimated Delivery</label>
                      <input
                        type="date"
                        value={shippingForm.estimatedDelivery}
                        onChange={(e) => setShippingForm({ ...shippingForm, estimatedDelivery: e.target.value })}
                        className="rounded-lg bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2 text-sm text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
                      />
                    </div>
                    <input
                      value={shippingForm.shippingNotes}
                      onChange={(e) => setShippingForm({ ...shippingForm, shippingNotes: e.target.value })}
                      placeholder="Shipping Notes"
                      className="rounded-lg bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-3 py-2 text-sm text-brand-black dark:text-brand-white outline-none focus:border-brand-lime md:col-span-2"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveShipping(o.id)}
                      className="px-4 py-1.5 bg-brand-lime text-brand-black text-xs font-black rounded-lg hover:opacity-90 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingShipping(null)}
                      className="px-4 py-1.5 bg-white/50 dark:bg-brand-black/30 text-brand-black/70 dark:text-brand-white/70 text-xs font-bold rounded-lg hover:opacity-80 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openShippingEdit(o)}
                  className="text-xs font-bold text-brand-lime hover:underline"
                >
                  🚚 Edit Shipping Info
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==========================================================
 *  PAYMENTS VERIFICATION
 * ========================================================== */
function PaymentsTab() {
  const { t, orders, updatePaymentStatus, toast } = useApp();
  const vodafoneOrders = orders.filter((o) => o.paymentMethod === "vodafone");

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">{t.admin.payments}</h2>
      {vodafoneOrders.length === 0 ? (
        <p className="text-brand-black/60 dark:text-brand-white/60 text-center py-10">No Vodafone Cash payments yet</p>
      ) : (
        <div className="space-y-4">
          {vodafoneOrders.map((o) => (
            <div key={o.id} className="bg-white/50 dark:bg-brand-black/30 rounded-2xl p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-black text-brand-black dark:text-brand-white">{o.id}</p>
                  <p className="text-sm text-brand-black/70 dark:text-brand-white/70">{o.name} • {o.senderPhone || "—"}</p>
                  <p className="text-brand-green font-black mt-1">{o.total} {t.egyptPound}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={o.paymentStatus} />
                  <StatusBadge status={o.orderStatus} />
                </div>
              </div>

              {o.screenshot && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-brand-black/70 dark:text-brand-white/70 mb-2">Transfer Screenshot:</p>
                  <a href={o.screenshot} target="_blank" rel="noreferrer">
                    <img
                      src={o.screenshot}
                      alt="Payment screenshot"
                      className="w-48 h-48 object-cover rounded-2xl border-4 border-brand-lime/40 hover:scale-105 transition-transform cursor-zoom-in"
                    />
                  </a>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={o.paymentStatus === "verified" ? "dark" : "primary"}
                  onClick={() => {
                    updatePaymentStatus(o.id, "verified");
                    toast("Payment verified");
                  }}
                >
                  <CheckCircle2 size={14} /> {t.admin.verify}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updatePaymentStatus(o.id, "rejected");
                    toast("Payment rejected", "error");
                  }}
                >
                  <XCircle size={14} /> {t.admin.reject}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================
 *  PRODUCTS MANAGEMENT — ADD / LIST / DELETE
 * ========================================================== */
function ProductsTab() {
  const { t, products, categories, addProduct, deleteProduct, toast } = useApp();
  void t;

  // Form state
  const [form, setForm] = useState({
    name: "",
    nameAr: "",
    price: "",
    description: "",
    descriptionAr: "",
    categoryId: categories[0]?.id || "",
    stock: "10",
    featured: false,
  });
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleImageFile = (f: File | null) => {
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setImageUrl(""); // Clear URL input when file chosen
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      toast("Please fill all required fields", "error");
      return;
    }
    const finalImage = imagePreview || imageUrl || "/category-stickers.jpg";
    const newProduct: Product = {
      id: "p-" + Math.random().toString(36).slice(2, 8),
      name: form.name,
      nameAr: form.nameAr || form.name,
      slug: form.name.toLowerCase().replace(/\s+/g, "-") + "-" + Math.random().toString(36).slice(2, 6),
      description: form.description || form.name,
      descriptionAr: form.descriptionAr || form.nameAr || form.name,
      images: [finalImage],
      categoryId: form.categoryId,
      price: Number(form.price),
      stock: Number(form.stock),
      featured: form.featured,
      active: true,
    };
    addProduct(newProduct);
    toast("Product added: " + form.name);
    // Reset form
    setForm({ name: "", nameAr: "", price: "", description: "", descriptionAr: "", categoryId: categories[0]?.id || "", stock: "10", featured: false });
    setImageUrl("");
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="space-y-6">
      {/* Add product form */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-2xl text-brand-black dark:text-brand-white mb-1 flex items-center gap-2">
          <Plus size={22} className="text-brand-green" /> {t.admin.addProduct}
        </h2>
        <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
          Fill in product details and choose an image.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          {/* Name (EN / AR) */}
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Product Name (English) *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="e.g. Neon Graffiti Laptop Skin"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              اسم المنتج (العربية)
            </label>
            <input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="مثال: سكن لابتوب نيون جرافيتي"
              dir="rtl"
            />
          </div>

          {/* Price & Stock & Category */}
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Price ({t.egyptPound}) *
            </label>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="180"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Stock
            </label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Category *
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white font-semibold"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} / {c.nameAr}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 self-end">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-5 h-5 accent-[#8DFF1A]"
              />
              <span className="text-sm font-bold text-brand-black/80 dark:text-brand-white/80">★ Featured product</span>
            </label>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Description (English)
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="Short description of your product..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5" dir="rtl">
              الوصف (العربية)
            </label>
            <textarea
              rows={3}
              value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="وصف مختصر للمنتج..."
              dir="rtl"
            />
          </div>

          {/* Image — two options: upload or paste URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Product Image *
            </label>
            <div className="grid md:grid-cols-2 gap-4">
              {/* File upload */}
              <div>
                <label className="block w-full cursor-pointer border-2 border-dashed border-brand-green/30 hover:border-brand-lime rounded-2xl p-6 text-center transition">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
                  />
                  <Upload size={28} className="mx-auto text-brand-lime mb-2" />
                  <p className="text-sm font-bold text-brand-black/80 dark:text-brand-white/80">
                    {imageFile ? imageFile.name : "📎 Click to upload image"}
                  </p>
                  <p className="text-xs text-brand-black/50 dark:text-brand-white/50 mt-1">PNG, JPG up to 5MB</p>
                </label>
              </div>

              {/* URL fallback */}
              <div>
                <label className="block text-xs font-bold text-brand-black/60 dark:text-brand-white/60 mb-1.5">
                  OR paste an image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview("");
                    setImageFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
                />
                {/* Preview */}
                {(imagePreview || imageUrl) && (
                  <div className="mt-3">
                    <p className="text-xs font-bold text-brand-black/60 dark:text-brand-white/60 mb-2">Preview:</p>
                    <div className="relative w-32 h-32">
                      <img
                        src={imagePreview || imageUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-xl border-2 border-brand-lime/50"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview("");
                          setImageFile(null);
                          setImageUrl("");
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs hover:scale-110 transition flex items-center justify-center"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <Button type="submit" size="lg" className="w-full">
              <Plus size={18} /> Add Product
            </Button>
          </div>
        </form>
      </div>

      {/* Products list */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-2xl text-brand-black dark:text-brand-white mb-1 flex items-center gap-2">
          <Package size={22} className="text-brand-green" /> Products ({products.length})
        </h2>
        <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
          Click the trash icon to delete any product.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-white/50 dark:bg-brand-black/30 rounded-2xl p-3 flex gap-3 items-center hover:ring-2 hover:ring-brand-lime/40 transition">
              <img src={p.images[0]} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-brand-black dark:text-brand-white truncate">{p.name}</p>
                <p className="text-xs text-brand-black/60 dark:text-brand-white/60 truncate">
                  {categories.find((c) => c.id === p.categoryId)?.name || "—"}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="font-black text-brand-green text-sm">{p.price} {t.egyptPound}</p>
                  {p.featured && (
                    <span className="text-[10px] bg-brand-lime text-brand-black font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPendingDelete({ id: p.id, name: p.name })}
                className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition"
                title="Delete product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteProduct(pendingDelete.id);
            toast(`Deleted "${pendingDelete.name}"`, "error");
          }
          setPendingDelete(null);
        }}
        title="Delete this product?"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? This action cannot be undone and the product will be removed from the shop immediately.`}
        confirmText="Delete Product"
      />
    </div>
  );
}

/* ==========================================================
 *  CATEGORIES MANAGEMENT — ADD / LIST / DELETE
 * ========================================================== */
function CategoriesTab() {
  const { t, categories, addCategory, deleteCategory, toast } = useApp();

  const [form, setForm] = useState({ name: "", nameAr: "", slug: "", active: true });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  const handleImageFile = (f: File | null) => {
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setImageUrl("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      toast("Please fill in the category name", "error");
      return;
    }
    const finalImage = imagePreview || imageUrl || "/category-stickers.jpg";
    const slug =
      form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    const newCategory: Category = {
      id: "cat-" + Math.random().toString(36).slice(2, 8),
      name: form.name,
      nameAr: form.nameAr || form.name,
      slug,
      image: finalImage,
      active: form.active,
    };
    addCategory(newCategory);
    toast(`Added category "${form.name}"`);
    setForm({ name: "", nameAr: "", slug: "", active: true });
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  };

  return (
    <div className="space-y-6">
      {/* Add category form */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-2xl text-brand-black dark:text-brand-white mb-1 flex items-center gap-2">
          <Plus size={22} className="text-brand-green" /> {t.admin.addCategory}
        </h2>
        <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
          Add a new product category. New categories will instantly appear on the Shop page.
        </p>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Name (English) *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="e.g. Phone Skins"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5" dir="rtl">
              الاسم (العربية)
            </label>
            <input
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="مثال: سكنات موبايل"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
              Slug (optional)
            </label>
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
              placeholder="auto-generated if empty"
            />
          </div>

          <div className="md:col-span-3 grid md:grid-cols-2 gap-4">
            {/* Image upload */}
            <div>
              <label className="block text-sm font-bold text-brand-black/80 dark:text-brand-white/80 mb-1.5">
                Category Image *
              </label>
              <label className="block w-full cursor-pointer border-2 border-dashed border-brand-green/30 hover:border-brand-lime rounded-2xl p-6 text-center transition">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files?.[0] || null)}
                />
                <Image size={28} className="mx-auto text-brand-lime mb-2" />
                <p className="text-sm font-bold text-brand-black/80 dark:text-brand-white/80">
                  {imageFile ? imageFile.name : "📎 Click to upload image"}
                </p>
              </label>
            </div>

            {/* URL + preview + checkbox */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-brand-black/60 dark:text-brand-white/60 mb-1.5">
                  OR paste an image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setImagePreview("");
                    setImageFile(null);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 outline-none focus:border-brand-lime text-brand-black dark:text-brand-white"
                />
              </div>
              {(imagePreview || imageUrl) && (
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={imagePreview || imageUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-brand-lime/50"
                    />
                    <button
                      type="button"
                      onClick={() => { setImagePreview(""); setImageFile(null); setImageUrl(""); }}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs hover:scale-110 transition flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.active}
                      onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-5 h-5 accent-[#8DFF1A]"
                    />
                    <span className="text-sm font-bold">Active (show in shop)</span>
                  </label>
                </div>
              )}
              {!imagePreview && !imageUrl && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-5 h-5 accent-[#8DFF1A]"
                  />
                  <span className="text-sm font-bold">Active (show in shop)</span>
                </label>
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <Button type="submit" size="lg" className="w-full">
              <Plus size={18} /> Add Category
            </Button>
          </div>
        </form>
      </div>

      {/* Categories list */}
      <div className="glass rounded-3xl p-6">
        <h2 className="font-black text-2xl text-brand-black dark:text-brand-white mb-1 flex items-center gap-2">
          <Tag size={22} className="text-brand-green" /> All Categories ({categories.length})
        </h2>
        <p className="text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
          Deleting a category removes it from the navigation & filters everywhere.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div
              key={c.id}
              className="relative bg-white/50 dark:bg-brand-black/30 rounded-2xl overflow-hidden hover:ring-2 hover:ring-brand-lime/40 transition"
            >
              <div className="relative h-32">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <button
                  onClick={() => setPendingDelete({ id: c.id, name: c.name })}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-red-500 text-white hover:scale-110 transition shadow-lg"
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="font-black text-white text-lg truncate">{c.name}</p>
                  <p className="text-brand-lime text-xs font-bold">/{c.slug}</p>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-brand-black/70 dark:text-brand-white/70 truncate">
                  {c.nameAr}
                </p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${c.active ? "bg-brand-lime text-brand-green" : "bg-gray-300 text-gray-700"}`}>
                  {c.active ? "ACTIVE" : "HIDDEN"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) {
            deleteCategory(pendingDelete.id);
            toast(`Deleted category "${pendingDelete.name}"`, "error");
          }
          setPendingDelete(null);
        }}
        title="Delete this category?"
        message={`Are you sure you want to delete "${pendingDelete?.name}"? Products inside it will remain but won't be filtered under this category anymore. This cannot be undone.`}
        confirmText="Delete Category"
      />
    </div>
  );
}

/* ==========================================================
 *  CUSTOM REQUESTS
 * ========================================================== */
function RequestsTab() {
  const { t, customRequests, updateRequestStatus, toast } = useApp();

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">{t.admin.requests}</h2>
      {customRequests.length === 0 ? (
        <p className="text-center py-10 text-brand-black/60 dark:text-brand-white/60">No requests yet</p>
      ) : (
        <div className="space-y-4">
          {customRequests.map((r) => (
            <div key={r.id} className="bg-white/50 dark:bg-brand-black/30 rounded-2xl p-5">
              <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                <div>
                  <p className="font-black text-brand-black dark:text-brand-white">{r.id}</p>
                  <p className="text-sm text-brand-black/70 dark:text-brand-white/70">{r.userName} • {r.userEmail}</p>
                  <p className="text-xs text-brand-black/50 dark:text-brand-white/50 mt-0.5">Product: {r.productType}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              {r.notes && (
                <p className="text-sm text-brand-black/80 dark:text-brand-white/80 mb-3 bg-brand-lime/10 rounded-xl p-3">
                  💬 {r.notes}
                </p>
              )}
              {r.image && (
                <img src={r.image} className="w-32 h-32 object-cover rounded-2xl mb-3 border-2 border-brand-lime/30" />
              )}
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant={r.status === "accepted" ? "dark" : "primary"}
                  onClick={() => {
                    updateRequestStatus(r.id, "accepted");
                    toast("Request accepted");
                  }}
                >
                  <CheckCircle2 size={14} /> Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateRequestStatus(r.id, "rejected");
                    toast("Request rejected", "error");
                  }}
                >
                  <XCircle size={14} /> Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================================
 *  USERS TAB
 * ========================================================== */
function UsersTab() {
  const { allUsers, orders } = useApp();
  const [search, setSearch] = useState("");

  const filtered = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search)
  );

  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="font-black text-xl text-brand-black dark:text-brand-white mb-4">
        👥 العملاء ({allUsers.length})
      </h2>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 ابحث باسم أو إيميل أو موبايل..."
        className="w-full mb-5 rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-2.5 text-brand-black dark:text-brand-white outline-none focus:border-brand-lime"
      />
      {filtered.length === 0 ? (
        <p className="text-center text-brand-black/50 dark:text-brand-white/50 py-10">مفيش عملاء لسه</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => {
            const userOrders = orders.filter((o) => o.user === u.email);
            const totalSpent = userOrders
              .filter((o) => o.paymentStatus === "verified" || o.orderStatus === "delivered")
              .reduce((s, o) => s + o.total, 0);
            return (
              <div key={u.id} className="bg-white/50 dark:bg-brand-black/30 rounded-2xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-lime text-brand-black font-black text-lg flex items-center justify-center">
                      {(u.name || u.email)?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-brand-black dark:text-brand-white">{u.name || "—"}</p>
                      <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{u.email}</p>
                      {u.phone && <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{u.phone}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-brand-black/60 dark:text-brand-white/60">{userOrders.length} طلب</p>
                    <p className="font-black text-brand-green text-sm">{totalSpent.toLocaleString()} ج.م</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${u.role === "admin" ? "bg-brand-lime text-brand-black" : "bg-brand-green/10 text-brand-green"}`}>
                      {u.role === "admin" ? "أدمن" : "عميل"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
