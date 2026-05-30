import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Send, Check } from "lucide-react";
import { useApp } from "../store/AppContext";
import { categories } from "../lib/mockData";
import { Button, Textarea, Select } from "../components/ui";

export default function CustomDesign() {
  const { t, lang, createRequest, toast } = useApp();
  const [form, setForm] = useState({ productType: "", notes: "" });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [done, setDone] = useState(false);

  const productTypes = categories.filter((c) => c.id !== "cat-custom");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productType || !image) {
      toast(lang === "en" ? "Please fill all required fields" : "املأ كل الحقول المطلوبة", "error");
      return;
    }
    createRequest({
      userName: "Guest",
      userEmail: "guest@stickiify.eg",
      productType: form.productType,
      notes: form.notes,
      image: preview,
      status: "pending",
    });
    setDone(true);
    toast(t.custom.success);
  };

  const handleImage = (f: File | null) => {
    if (!f) return;
    setImage(f);
    setPreview(URL.createObjectURL(f));
  };

  if (done) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 rounded-full bg-brand-lime mx-auto flex items-center justify-center mb-6 glow-lime">
          <Check size={48} className="text-brand-green" strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-black text-brand-black dark:text-brand-white mb-4">
          {lang === "en" ? "Request Submitted!" : "تم إرسال الطلب!"}
        </h1>
        <p className="text-lg text-brand-black/70 dark:text-brand-white/70 mb-8">{t.custom.success}</p>
        <Link to="/shop">
          <Button size="lg">{lang === "en" ? "Continue shopping" : "كمّل تسوق"}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-brand-black dark:text-brand-white">{t.custom.title}</h1>
        <p className="mt-3 text-lg text-brand-black/70 dark:text-brand-white/70">{t.custom.subtitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Select
            label={t.custom.productType}
            value={form.productType}
            onChange={(e) => setForm({ ...form, productType: e.target.value })}
            options={[
              { value: "", label: t.custom.chooseType },
              ...productTypes.map((c) => ({ value: lang === "en" ? c.name : c.nameAr, label: lang === "en" ? c.name : c.nameAr })),
            ]}
          />
          <Textarea
            label={t.custom.notes}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={5}
            placeholder={lang === "en" ? "Describe what you want..." : "اوصف اللي عايزه..."}
          />
          <Button type="submit" size="lg" className="w-full">
            <Send size={18} /> {t.custom.submit}
          </Button>
        </div>

        <div>
          <label className="block">
            <span className="block text-sm font-medium mb-2 text-brand-black/80 dark:text-brand-white/80">{t.custom.image}</span>
            <label
              className={`block w-full cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition aspect-square flex items-center justify-center ${
                preview ? "border-brand-lime bg-brand-lime/5" : "border-brand-green/30 hover:border-brand-lime"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0] || null)}
              />
              {preview ? (
                <img src={preview} className="w-full h-full object-contain rounded-2xl" />
              ) : (
                <div className="text-brand-black/60 dark:text-brand-white/60">
                  <Upload size={48} className="mx-auto mb-3 text-brand-lime" />
                  <p className="font-semibold">{t.custom.imageHint}</p>
                </div>
              )}
            </label>
          </label>
        </div>
      </form>
    </div>
  );
}
