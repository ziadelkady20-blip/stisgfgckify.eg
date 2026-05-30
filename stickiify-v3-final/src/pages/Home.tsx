import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Truck, Shield, Palette, ChevronRight, ArrowRight, Camera } from "lucide-react";
import { useApp } from "../store/AppContext";
import { reviews } from "../lib/mockData";
import { Button, Badge, Stars, SectionHeader } from "../components/ui";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { t, lang, products, categories } = useApp();

  const featured = products.filter((p: any) => p.featured).slice(0, 4);
  const bestSellers = products.filter((p: any) => p.bestSeller).slice(0, 4);
  const cats = categories.slice(0, 6);

  const faqs = [
    {
      q: lang === "en" ? "How long does delivery take?" : "التوصيل بياخد وقت قد إيه؟",
      a: lang === "en" ? "2-5 working days inside Cairo/Giza, up to 7 days for other governorates." : "٢-٥ أيام جوه القاهرة والجيزة، لغاية ٧ أيام للمحافظات التانية.",
    },
    {
      q: lang === "en" ? "Are the stickers waterproof?" : "الستيكرز مضادة للماء؟",
      a: lang === "en" ? "Yes! All our stickers are printed on premium waterproof vinyl." : "أيوه! كل الستيكرز مطبوعة على فينيل بريميوم مضاد للماء.",
    },
    {
      q: lang === "en" ? "Can I return my order?" : "أقدر أرجع الطلب؟",
      a: lang === "en" ? "Custom orders can't be returned, but defective items are replaced free of charge." : "طلبات الكستوم مش بنرجعها، بس لو في مشكلة في المنتج بنبدله مجاناً.",
    },
    {
      q: lang === "en" ? "How do I track my order?" : "أقدر أتتبع طلبي إزاي؟",
      a: lang === "en" ? "Use the Track Order page with your order ID and phone number." : "استخدم صفحة تتبع الطلب برقم الطلب ورقم موبايلك.",
    },
  ];

  return (
    <div className="space-y-20 md:space-y-32">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-lime/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-12 md:pt-20 pb-20 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="space-y-6"
          >
            <motion.div variants={fadeUp}>
              <Badge color="green" className="mb-4">
                🇬 {lang === "en" ? "Made in Egypt" : "صناعة مصرية"}
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight text-brand-black dark:text-brand-white">
                {t.hero.title1}
                <br />
                <span className="lime-text">{t.hero.title2}</span>
                <br />
                {t.hero.title3}
              </h1>
            </motion.div>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-brand-black/70 dark:text-brand-white/70 max-w-lg">
              {t.hero.subtitle}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link to="/shop">
                <Button size="lg">
                  {t.hero.cta} <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/custom">
                <Button size="lg" variant="outline">
                  {t.hero.cta2}
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Truck size={18} className="text-brand-lime" />
                <span className="text-brand-black/70 dark:text-brand-white/70">{t.hero.badge}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield size={18} className="text-brand-lime" />
                <span className="text-brand-black/70 dark:text-brand-white/70">{lang === "en" ? "Premium Quality" : "جودة عالية"}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden glow-lime aspect-square">
              <img
                src="/hero.jpg"
                alt="Stickiify products"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-green/40 to-transparent" />
            </div>

            {/* Floating stickers */}
            {[
              { emoji: "🔥", top: "5%", left: "5%", rot: "-15deg", delay: "0s" },
              { emoji: "✨", top: "15%", right: "5%", rot: "20deg", delay: "0.5s" },
              { emoji: "🎨", bottom: "15%", left: "-5%", rot: "-10deg", delay: "1s" },
              { emoji: "💚", bottom: "5%", right: "10%", rot: "15deg", delay: "1.5s" },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="absolute w-14 h-14 md:w-20 md:h-20 rounded-2xl glass flex items-center justify-center text-3xl md:text-4xl animate-floaty"
                style={{
                  top: (s as any).top,
                  left: (s as any).left,
                  right: (s as any).right,
                  bottom: (s as any).bottom,
                  // @ts-ignore
                  "--rot": s.rot,
                  animationDelay: s.delay,
                }}
              >
                {s.emoji}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden py-6 bg-brand-green">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, r) => (
            <div key={r} className="flex items-center gap-8 px-4">
              {["STICKERS", "★", "LAPTOP SKINS", "★", "MUGS", "★", "NOTEBOOKS", "★", "MOUSEPADS", "★", "KEYBOARD COVERS", "★"].map((word, i) => (
                <span key={i} className="text-2xl md:text-4xl font-black text-brand-lime">
                  {word}
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader title={t.categories.title} subtitle={t.categories.subtitle} badge={lang === "en" ? "BROWSE" : "تصفح"} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {cats.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link to={`/shop?cat=${c.slug}`} className="group block relative aspect-[4/5] rounded-3xl overflow-hidden">
                <img src={c.image} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end text-brand-white">
                  <h3 className="text-2xl md:text-3xl font-black">{lang === "en" ? c.name : c.nameAr}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-brand-lime opacity-0 group-hover:opacity-100 transition-opacity">
                    {lang === "en" ? "Shop now" : "تسوق"} <ChevronRight size={16} className="flip-rtl" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader title={t.featured.title} subtitle={t.featured.subtitle} badge="NEW" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader title={t.bestSellers.title} subtitle={t.bestSellers.subtitle} badge="🔥 HOT" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/shop">
            <Button variant="outline" size="lg">
              {lang === "en" ? "View all products" : "عرض كل المنتجات"} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader title={t.reviews.title} subtitle={t.reviews.subtitle} badge="⭐ REVIEWS" />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-6 hover:scale-[1.02] transition-transform"
            >
              <Stars rating={r.rating} />
              <p className="mt-4 text-sm text-brand-black/80 dark:text-brand-white/80 leading-relaxed">
                {lang === "en" ? r.comment : r.commentAr}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-lime text-brand-black font-bold flex items-center justify-center">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-brand-black dark:text-brand-white">{r.name}</p>
                  <p className="text-xs text-brand-black/50 dark:text-brand-white/50">{lang === "en" ? "Verified buyer" : "مشتري مؤكد"}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 md:px-8">
        <SectionHeader title={t.faq.title} subtitle={t.faq.subtitle} badge="FAQ" />
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <details key={i} className="group glass rounded-2xl p-5 [&_summary]:cursor-pointer [&_summary]:list-none">
              <summary className="flex items-center justify-between font-bold text-brand-black dark:text-brand-white">
                {f.q}
                <ChevronRight size={20} className="text-brand-lime transition-transform group-open:rotate-90 flip-rtl" />
              </summary>
              <p className="mt-3 text-brand-black/70 dark:text-brand-white/70">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-3">
            <Camera className="text-brand-lime" size={28} />
            <h2 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white">{t.insta.title}</h2>
          </div>
          <a
            href="https://www.instagram.com/stickiify.eg"
            target="_blank"
            rel="noreferrer"
            className="inline-block mt-2 text-brand-lime font-bold hover:underline"
          >
            {t.insta.handle}
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {["/category-stickers.jpg", "/category-laptop.jpg", "/category-mug.jpg", "/hero.jpg"].map((src, i) => (
            <a
              key={i}
              href="https://www.instagram.com/stickiify.eg"
              target="_blank"
              rel="noreferrer"
              className="relative group aspect-square rounded-2xl overflow-hidden"
            >
              <img src={src} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-green/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="text-brand-lime" size={32} />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-brand-green p-10 md:p-16 text-center">
          <div className="absolute inset-0 grid-pattern opacity-20" />
          <div className="relative">
            <Sparkles className="mx-auto text-brand-lime mb-4" size={40} />
            <h2 className="text-3xl md:text-5xl font-black text-brand-white mb-4">
              {lang === "en" ? "Ready to make it yours?" : "جاهز تصممه لنفسك؟"}
            </h2>
            <p className="text-brand-lime/80 text-lg mb-8">
              {lang === "en" ? "Upload your design and we'll print it on anything." : "ارفع تصميمك واحنا هنطبعه على أي حاجة."}
            </p>
            <Link to="/custom">
              <Button size="lg">
                <Palette size={18} /> {t.nav.custom}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Product Card ---------------- */
function ProductCard({ product }: { product: any }) {
  const { t, lang, addToCart, toggleWishlist, wishlist, toast, products } = useApp();
  void products;
  const inWishlist = wishlist.includes(product.id);
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
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
            <HeartIcon filled={inWishlist} />
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
    </motion.div>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#8DFF1A" : "none"} stroke={filled ? "#8DFF1A" : "currentColor"} strokeWidth="2.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
