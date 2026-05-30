import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useApp } from "../store/AppContext";
import { categories, products } from "../lib/mockData";
import { Button, EmptyState } from "../components/ui";

export default function Shop() {
  const { t, lang } = useApp();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("cat") || "all";
  const [cat, setCat] = useState(initialCat);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc" | "newest">("featured");
  const [maxPrice, setMaxPrice] = useState(1000);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.active);
    if (cat !== "all") {
      const c = categories.find((c) => c.slug === cat);
      if (c) list = list.filter((p) => p.categoryId === c.id);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.nameAr.includes(search));
    }
    list = list.filter((p) => p.price <= maxPrice);
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "newest") list = [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }, [cat, search, sort, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black dark:text-brand-white">
          {lang === "en" ? "Shop All" : "تسوق الكل"}
        </h1>
        <p className="mt-2 text-brand-black/60 dark:text-brand-white/60">
          {filtered.length} {lang === "en" ? "products" : "منتج"}
        </p>
      </div>

      <div className="glass rounded-3xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-black/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            className="w-full rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 pl-11 pr-4 py-3 outline-none focus:border-brand-lime"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="rounded-xl bg-white/70 dark:bg-brand-black/40 border border-brand-green/20 px-4 py-3 outline-none"
        >
          <option value="featured">{t.sortBy.featured}</option>
          <option value="priceAsc">{t.sortBy.priceAsc}</option>
          <option value="priceDesc">{t.sortBy.priceDesc}</option>
          <option value="newest">{t.sortBy.newest}</option>
        </select>
        <div className="flex items-center gap-3">
          <SlidersHorizontal size={16} className="text-brand-black/60" />
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(+e.target.value)}
            className="w-32 accent-[#8DFF1A]"
          />
          <span className="text-sm font-bold text-brand-green whitespace-nowrap">
            ≤ {maxPrice} {t.egyptPound}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setCat("all")}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
            cat === "all" ? "bg-brand-lime text-brand-black" : "bg-brand-green/10 text-brand-black dark:text-brand-white hover:bg-brand-lime/20"
          }`}
        >
          {t.all}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.slug)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              cat === c.slug ? "bg-brand-lime text-brand-black" : "bg-brand-green/10 text-brand-black dark:text-brand-white hover:bg-brand-lime/20"
            }`}
          >
            {lang === "en" ? c.name : c.nameAr}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={32} />}
          title={lang === "en" ? "No products found" : "مفيش نتائج"}
          subtitle={lang === "en" ? "Try a different search or category" : "جرب بحث أو فئة تانية"}
        />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ShopCard product={p} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShopCard({ product }: any) {
  const { t, lang, addToCart, toggleWishlist, wishlist, toast } = useApp();
  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-brand-green/5 to-brand-lime/5">
          <img
            src={product.images[0]}
            alt={lang === "en" ? product.name : product.nameAr}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {product.featured && (
            <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-brand-lime text-brand-black font-bold">
              {lang === "en" ? "NEW" : "جديد"}
            </span>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-brand-white font-bold">
              {t.outOfStock}
            </div>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
              toast(inWishlist ? (lang === "en" ? "Removed from wishlist" : "اتشال من المفضلة") : (lang === "en" ? "Added to wishlist" : "أضيف للمفضلة"));
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "#8DFF1A" : "none"} stroke={inWishlist ? "#8DFF1A" : "currentColor"} strokeWidth="2.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
      </Link>
      <div className="mt-4 px-1">
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-bold text-brand-black dark:text-brand-white line-clamp-1">
            {lang === "en" ? product.name : product.nameAr}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="font-black text-brand-green text-lg">
            {product.price} <span className="text-xs font-semibold">{t.egyptPound}</span>
          </span>
          <Button
            size="sm"
            disabled={outOfStock}
            onClick={() => {
              addToCart(product.id);
              toast(lang === "en" ? "Added to cart" : "أُضيف للسلة");
            }}
          >
            {t.addCart}
          </Button>
        </div>
      </div>
    </div>
  );
}
