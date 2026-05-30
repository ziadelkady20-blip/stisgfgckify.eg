import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Minus, Plus, ShoppingCart, ChevronRight, Check } from "lucide-react";
import { useState } from "react";
import { useApp } from "../store/AppContext";
import { products, categories } from "../lib/mockData";
import { Button, Badge, SectionHeader } from "../components/ui";

export default function ProductDetail() {
  const { slug } = useParams();
  const { t, lang, addToCart, toggleWishlist, wishlist, toast } = useApp();
  const [qty, setQty] = useState(1);
  const [imgIdx, setImgIdx] = useState(0);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-brand-black dark:text-brand-white">
          {lang === "en" ? "Product not found" : "المنتج مش موجود"}
        </h1>
        <Link to="/shop">
          <Button className="mt-6">{lang === "en" ? "Back to shop" : "ارجع للمتجر"}</Button>
        </Link>
      </div>
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-brand-black/60 dark:text-brand-white/60 mb-6">
        <Link to="/" className="hover:text-brand-lime">{t.nav.home}</Link>
        <ChevronRight size={14} />
        <Link to="/shop" className="hover:text-brand-lime">{t.nav.shop}</Link>
        <ChevronRight size={14} />
        {category && <Link to={`/shop?cat=${category.slug}`} className="hover:text-brand-lime">{lang === "en" ? category.name : category.nameAr}</Link>}
        <ChevronRight size={14} />
        <span className="text-brand-black dark:text-brand-white font-medium">{lang === "en" ? product.name : product.nameAr}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green/5 to-brand-lime/5 glow-lime-sm">
            <img src={product.images[imgIdx]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-4">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition ${
                    i === imgIdx ? "border-brand-lime" : "border-transparent"
                  }`}
                >
                  <img src={src} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          {category && (
            <Badge color="green">{lang === "en" ? category.name : category.nameAr}</Badge>
          )}
          <h1 className="text-4xl md:text-5xl font-black text-brand-black dark:text-brand-white leading-tight">
            {lang === "en" ? product.name : product.nameAr}
          </h1>

          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-brand-green">
              {product.price} <span className="text-lg">{t.egyptPound}</span>
            </span>
            {product.stock > 0 && (
              <span className="text-sm text-brand-green/80 flex items-center gap-1">
                <Check size={14} /> {lang === "en" ? "In stock" : "متوفر"} ({product.stock})
              </span>
            )}
          </div>

          <p className="text-brand-black/70 dark:text-brand-white/70 text-lg leading-relaxed">
            {lang === "en" ? product.description : product.descriptionAr}
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 glass rounded-2xl p-1">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl hover:bg-brand-lime/20 flex items-center justify-center">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="w-10 h-10 rounded-xl hover:bg-brand-lime/20 flex items-center justify-center">
                <Plus size={16} />
              </button>
            </div>
            <Button
              size="lg"
              disabled={outOfStock}
              onClick={() => {
                addToCart(product.id, qty);
                toast(lang === "en" ? "Added to cart" : "أُضيف للسلة");
              }}
            >
              <ShoppingCart size={18} /> {t.addCart}
            </Button>
            <button
              onClick={() => {
                toggleWishlist(product.id);
                toast(inWishlist ? (lang === "en" ? "Removed from wishlist" : "اتشال من المفضلة") : (lang === "en" ? "Added to wishlist" : "أضيف للمفضلة"));
              }}
              className={`p-3.5 rounded-2xl border-2 transition ${
                inWishlist ? "bg-brand-lime/20 border-brand-lime text-brand-green" : "border-brand-green/20 hover:border-brand-lime"
              }`}
            >
              <Heart size={20} fill={inWishlist ? "#8DFF1A" : "none"} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { icon: "🚚", label: lang === "en" ? "Fast delivery" : "توصيل سريع" },
              { icon: "🛡️", label: lang === "en" ? "Premium quality" : "جودة بريميوم" },
              { icon: "💧", label: lang === "en" ? "Waterproof" : "مضاد للماء" },
              { icon: "✨", label: lang === "en" ? "Custom designs" : "تصاميم مخصصة" },
            ].map((f) => (
              <div key={f.label} className="glass rounded-2xl p-3 flex items-center gap-3">
                <span className="text-2xl">{f.icon}</span>
                <span className="text-sm font-semibold text-brand-black dark:text-brand-white">{f.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <SectionHeader title={t.related} />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <Link key={p.id} to={`/product/${p.slug}`} className="group block">
                <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green/5 to-brand-lime/5">
                  <img src={p.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="mt-3">
                  <h3 className="font-bold text-brand-black dark:text-brand-white line-clamp-1">{lang === "en" ? p.name : p.nameAr}</h3>
                  <p className="text-brand-green font-black mt-1">{p.price} {t.egyptPound}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
