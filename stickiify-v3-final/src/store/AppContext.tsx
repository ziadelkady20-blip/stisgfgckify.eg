import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  type User as FirebaseUser,
} from "firebase/auth";
import { db, auth } from "../lib/firebase";
import { translations, type Lang } from "../lib/i18n";
import {
  products as seedProducts,
  categories as seedCategories,
  type Product,
  type Category,
  type Order,
  type CustomRequest,
  type RegisteredUser,
} from "../lib/mockData";

type CartItem = { productId: string; quantity: number };

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
} | null;

type Toast = { id: string; message: string; type: "success" | "error" | "info" };

type AppState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: any;
  dir: "ltr" | "rtl";
  theme: "light" | "dark";
  toggleTheme: () => void;

  user: User;
  login: (email: string, password: string) => Promise<{ ok: boolean; message: string }>;
  register: (name: string, email: string, password: string, phone: string) => Promise<{ ok: boolean; message: string }>;
  logout: () => void;
  updateUser: (patch: Partial<NonNullable<User>>) => void;
  forgotPassword: (emailOrPhone: string) => { ok: boolean; message: string };
  resetPassword: (email: string, code: string, newPassword: string) => { ok: boolean; message: string };

  cart: CartItem[];
  addToCart: (productId: string, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  products: Product[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  categories: Category[];
  addCategory: (c: Category) => void;
  deleteCategory: (id: string) => void;

  orders: Order[];
  customRequests: CustomRequest[];
  allUsers: RegisteredUser[];
  createOrder: (o: Omit<Order, "id" | "createdAt" | "history">) => Promise<string>;
  createRequest: (r: Omit<CustomRequest, "id" | "createdAt">) => void;
  updateOrderStatus: (id: string, status: Order["orderStatus"]) => void;
  updatePaymentStatus: (id: string, status: Order["paymentStatus"]) => void;
  updateRequestStatus: (id: string, status: CustomRequest["status"]) => void;
  updateShippingInfo: (id: string, info: { shippingCompany?: string; trackingNumber?: string; shippingNotes?: string; estimatedDelivery?: string; shippedAt?: string }) => void;

  toasts: Toast[];
  toast: (message: string, type?: Toast["type"]) => void;
  dismissToast: (id: string) => void;

  loading: boolean;
};

const AppContext = createContext<AppState | null>(null);

const ADMIN_EMAIL = "ziadelkady20@gmail.com";

const LS = {
  lang: "stk_lang",
  theme: "stk_theme",
  cart: "stk_cart",
  wish: "stk_wish",
};

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => loadJSON(LS.lang, "en" as Lang));
  const [theme, setTheme] = useState<"light" | "dark">(() => loadJSON(LS.theme, "light"));
  const [user, setUser] = useState<User>(null);
  const [cart, setCart] = useState<CartItem[]>(() => loadJSON(LS.cart, []));
  const [wishlist, setWishlist] = useState<string[]>(() => loadJSON(LS.wish, []));
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [categories, setCategories] = useState<Category[]>(seedCategories);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customRequests, setRequests] = useState<CustomRequest[]>([]);
  const [allUsers, setAllUsers] = useState<RegisteredUser[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);
  const [resetCodes, setResetCodes] = useState<Record<string, { code: string; expiresAt: number }>>({});

  const t = translations[lang];
  const dir: "ltr" | "rtl" = lang === "ar" ? "rtl" : "ltr";

  // ── Persist local prefs ───────────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LS.lang, JSON.stringify(lang));
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    localStorage.setItem(LS.theme, JSON.stringify(theme));
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => localStorage.setItem(LS.cart, JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem(LS.wish, JSON.stringify(wishlist)), [wishlist]);

  // ── Firebase Auth listener ────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      if (fbUser) {
        const role = fbUser.email === ADMIN_EMAIL ? "admin" : "user";
        // Get profile from Firestore
        try {
          const snap = await getDocs(query(collection(db, "users")));
          const found = snap.docs.find((d) => d.id === fbUser.uid);
          const data = found?.data();
          setUser({
            id: fbUser.uid,
            name: data?.name || fbUser.email?.split("@")[0] || "User",
            email: fbUser.email || "",
            phone: data?.phone,
            role,
          });
        } catch {
          setUser({
            id: fbUser.uid,
            name: fbUser.email?.split("@")[0] || "User",
            email: fbUser.email || "",
            role,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Firestore real-time listeners ─────────────────────────────────────────
  useEffect(() => {
    const unsubOrders = onSnapshot(
      query(collection(db, "orders"), orderBy("createdAt", "desc")),
      (snap) => setOrders(snap.docs.map((d) => ({ ...d.data(), id: d.id } as Order))),
      () => {}
    );
    const unsubReqs = onSnapshot(
      query(collection(db, "requests"), orderBy("createdAt", "desc")),
      (snap) => setRequests(snap.docs.map((d) => ({ ...d.data(), id: d.id } as CustomRequest))),
      () => {}
    );
    const unsubProducts = onSnapshot(
      collection(db, "products"),
      (snap) => {
        const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Product));
        setProducts(docs.length > 0 ? docs : seedProducts);
      },
      () => setProducts(seedProducts)
    );
    const unsubCategories = onSnapshot(
      collection(db, "categories"),
      (snap) => {
        const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id } as Category));
        setCategories(docs.length > 0 ? docs : seedCategories);
      },
      () => setCategories(seedCategories)
    );
    const unsubUsers = onSnapshot(
      collection(db, "users"),
      (snap) => setAllUsers(snap.docs.map((d) => ({ ...d.data(), id: d.id } as RegisteredUser))),
      () => {}
    );
    return () => {
      unsubOrders();
      unsubReqs();
      unsubProducts();
      unsubCategories();
      unsubUsers();
    };
  }, []);

  // ── Seed products/categories to Firestore once ────────────────────────────
  useEffect(() => {
    const seedFirestore = async () => {
      try {
        const prodSnap = await getDocs(collection(db, "products"));
        if (prodSnap.empty) {
          for (const p of seedProducts) {
            await setDoc(doc(db, "products", p.id), p);
          }
        }
        const catSnap = await getDocs(collection(db, "categories"));
        if (catSnap.empty) {
          for (const c of seedCategories) {
            await setDoc(doc(db, "categories", c.id), c);
          }
        }
      } catch {}
    };
    seedFirestore();
  }, []);

  const setLang = (l: Lang) => setLangState(l);
  const toggleTheme = () => setTheme((th) => (th === "light" ? "dark" : "light"));

  // ── Auth functions ────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return {
        ok: true,
        message: email.trim().toLowerCase() === ADMIN_EMAIL
          ? "Welcome back, Admin 👑"
          : lang === "ar" ? "أهلًا بيك! 👋" : "Logged in successfully",
      };
    } catch {
      return {
        ok: false,
        message: lang === "ar" ? "الإيميل أو كلمة السر غلط" : "Invalid email or password",
      };
    }
  };

  const register = async (name: string, email: string, password: string, phone: string) => {
    if (!name || !email || !password)
      return { ok: false, message: lang === "ar" ? "املأ كل الحقول" : "Fill all fields" };
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      // Save profile to Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        id: cred.user.uid,
        name,
        email: email.trim().toLowerCase(),
        phone: phone || "",
        role: "user",
        createdAt: new Date().toISOString(),
      });
      return { ok: true, message: lang === "ar" ? "تم إنشاء الحساب ✅" : "Account created ✅" };
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use")
        return { ok: false, message: lang === "ar" ? "الإيميل ده مسجل بالفعل" : "Email already registered" };
      if (err.code === "auth/weak-password")
        return { ok: false, message: lang === "ar" ? "كلمة السر ضعيفة (6 أحرف على الأقل)" : "Password too weak (min 6 chars)" };
      return { ok: false, message: lang === "ar" ? "حصل خطأ، حاول تاني" : "Something went wrong" };
    }
  };

  const logout = () => signOut(auth);

  const updateUser = (patch: Partial<NonNullable<User>>) =>
    setUser((u) => (u ? { ...u, ...patch } : u));

  // ── Forgot / Reset password ───────────────────────────────────────────────
  const forgotPassword = (emailOrPhone: string) => {
    const normalized = emailOrPhone.trim().toLowerCase();
    const found = allUsers.find(
      (u) =>
        u.email.toLowerCase() === normalized ||
        (u.phone && u.phone.replace(/\s/g, "") === normalized.replace(/\s/g, ""))
    );
    if (!found) {
      return { ok: false, message: lang === "ar" ? "مفيش حساب بالبيانات دي" : "No account found" };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000;
    setResetCodes((prev) => ({ ...prev, [found.email.toLowerCase()]: { code, expiresAt } }));

    const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
    const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;
    if (botToken && chatId) {
      const msg =
        "🔐 طلب إعادة تعيين كلمة السر\n\n" +
        "👤 الاسم: " + found.name + "\n" +
        "📧 الإيميل: " + found.email + "\n\n" +
        "✨ الكود: " + code + " ✨\n\n" +
        "⏰ الكود صالح 10 دقائق بس";
      fetch("https://api.telegram.org/bot" + botToken + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: msg }),
      }).catch(() => {});
    }
    return {
      ok: true,
      message: lang === "ar" ? "تم إرسال كود التحقق على Telegram ✅" : "Verification code sent to Telegram ✅",
      email: found.email,
    };
  };

  const resetPassword = (email: string, code: string, newPassword: string) => {
    const key = email.trim().toLowerCase();
    const entry = resetCodes[key];
    if (!entry) return { ok: false, message: lang === "ar" ? "اطلب كود تحقق أولاً" : "Request a reset code first" };
    if (Date.now() > entry.expiresAt) {
      setResetCodes((prev) => { const n = { ...prev }; delete n[key]; return n; });
      return { ok: false, message: lang === "ar" ? "الكود انتهت صلاحيته" : "Code expired" };
    }
    if (entry.code !== code.trim()) return { ok: false, message: lang === "ar" ? "كود التحقق غلط" : "Invalid code" };
    if (newPassword.length < 6) return { ok: false, message: lang === "ar" ? "كلمة السر لازم 6 أحرف على الأقل" : "Min 6 characters" };
    // Update in Firebase Auth
    if (auth.currentUser) {
      updatePassword(auth.currentUser, newPassword).catch(() => {});
    }
    setResetCodes((prev) => { const n = { ...prev }; delete n[key]; return n; });
    return { ok: true, message: lang === "ar" ? "تم تغيير كلمة السر ✅" : "Password changed ✅" };
  };

  // ── Cart ──────────────────────────────────────────────────────────────────
  const addToCart = (productId: string, qty = 1) => {
    setCart((c) => {
      const found = c.find((i) => i.productId === productId);
      if (found) return c.map((i) => i.productId === productId ? { ...i, quantity: i.quantity + qty } : i);
      return [...c, { productId, quantity: qty }];
    });
  };
  const removeFromCart = (productId: string) => setCart((c) => c.filter((i) => i.productId !== productId));
  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) return removeFromCart(productId);
    setCart((c) => c.map((i) => i.productId === productId ? { ...i, quantity: qty } : i));
  };
  const clearCart = () => setCart([]);
  const toggleWishlist = (productId: string) => {
    setWishlist((w) => w.includes(productId) ? w.filter((id) => id !== productId) : [...w, productId]);
  };

  // ── Products CRUD (Firestore) ─────────────────────────────────────────────
  const addProduct = async (p: Product) => {
    await setDoc(doc(db, "products", p.id), p);
  };
  const updateProduct = async (id: string, patch: Partial<Product>) => {
    await updateDoc(doc(db, "products", id), patch as any);
  };
  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, "products", id));
  };

  // ── Categories CRUD (Firestore) ───────────────────────────────────────────
  const addCategory = async (c: Category) => {
    await setDoc(doc(db, "categories", c.id), c);
  };
  const deleteCategory = async (id: string) => {
    await deleteDoc(doc(db, "categories", id));
  };

  // ── Orders (Firestore) ────────────────────────────────────────────────────
  const createOrder = async (o: Omit<Order, "id" | "createdAt" | "history">) => {
    const id = "ORD-" + Date.now();
    const now = new Date().toISOString();
    const raw: Order = {
      ...o,
      id,
      createdAt: now,
      history: [{ status: o.orderStatus, timestamp: now }],
    };
    // Remove undefined fields — Firestore doesn't accept them
    const order = Object.fromEntries(
      Object.entries(raw).filter(([, v]) => v !== undefined)
    ) as Order;
    await setDoc(doc(db, "orders", id), order);
    return id;
  };

  const updateOrderStatus = async (id: string, status: Order["orderStatus"]) => {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    const history = [...order.history, { status, timestamp: new Date().toISOString() }];
    await updateDoc(doc(db, "orders", id), { orderStatus: status, history });
  };

  const updatePaymentStatus = async (id: string, status: Order["paymentStatus"]) => {
    await updateDoc(doc(db, "orders", id), { paymentStatus: status });
  };

  const updateShippingInfo = async (
    id: string,
    info: { shippingCompany?: string; trackingNumber?: string; shippingNotes?: string; estimatedDelivery?: string; shippedAt?: string }
  ) => {
    await updateDoc(doc(db, "orders", id), info as any);
  };

  // ── Custom Requests (Firestore) ───────────────────────────────────────────
  const createRequest = async (r: Omit<CustomRequest, "id" | "createdAt">) => {
    const id = "REQ-" + Date.now();
    await setDoc(doc(db, "requests", id), { ...r, id, createdAt: new Date().toISOString() });
  };

  const updateRequestStatus = async (id: string, status: CustomRequest["status"]) => {
    await updateDoc(doc(db, "requests", id), { status });
  };

  // ── Toasts ────────────────────────────────────────────────────────────────
  const toast = (message: string, type: Toast["type"] = "success") => {
    const id = Math.random().toString(36).slice(2, 10);
    setToasts((ts) => [...ts, { id, message, type }]);
    setTimeout(() => dismissToast(id), 3500);
  };
  const dismissToast = (id: string) => setToasts((ts) => ts.filter((t) => t.id !== id));

  return (
    <AppContext.Provider
      value={{
        lang, setLang, t, dir, theme, toggleTheme,
        user, login, register, logout, updateUser, forgotPassword, resetPassword,
        cart, addToCart, removeFromCart, updateQty, clearCart,
        wishlist, toggleWishlist,
        products, addProduct, updateProduct, deleteProduct,
        categories, addCategory, deleteCategory,
        orders, customRequests, allUsers,
        createOrder, createRequest,
        updateOrderStatus, updatePaymentStatus, updateRequestStatus, updateShippingInfo,
        toasts, toast, dismissToast,
        loading,
      } as AppState}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
