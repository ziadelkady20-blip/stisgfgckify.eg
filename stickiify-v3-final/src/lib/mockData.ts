export type Product = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  description: string;
  descriptionAr: string;
  images: string[];
  categoryId: string;
  price: number;
  stock: number;
  featured: boolean;
  active: boolean;
  bestSeller?: boolean;
};

export type Category = {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  image: string;
  active: boolean;
};

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  commentAr: string;
  avatar: string;
};

export type OrderStatus =
  | "underReview"
  | "pendingPaymentVerification"
  | "pending"
  | "confirmed"
  | "processing"
  | "preparingShipment"
  | "shipped"
  | "outForDelivery"
  | "delivered"
  | "paymentIssue"
  | "cancelled"
  | "rejected";

export type Order = {
  id: string;
  user: string;
  products: { productId: string; quantity: number; price: number }[];
  total: number;
  paymentMethod: "cod" | "vodafone";
  paymentStatus: "pending" | "verified" | "rejected";
  orderStatus: OrderStatus;
  address: string;
  phone: string;
  name: string;
  governorate: string;
  notes?: string;
  screenshot?: string;
  senderPhone?: string;
  createdAt: string;
  history: { status: OrderStatus; timestamp: string }[];
  // Shipping fields
  shippingCompany?: string;
  trackingNumber?: string;
  shippingNotes?: string;
  shippedAt?: string;
  estimatedDelivery?: string;
};

// Registered users store (used for login validation)
export type RegisteredUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string; // stored as plaintext for frontend-only app
  role: "user" | "admin";
};

export const registeredUsers: RegisteredUser[] = [
  {
    id: "admin-1",
    name: "Admin",
    email: "ziadelkady20@gmail.com",
    password: "Zeyad2006#",
    role: "admin",
  },
];

export type CustomRequest = {
  id: string;
  userName: string;
  userEmail: string;
  productType: string;
  notes: string;
  image: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
};

export const categories: Category[] = [
  {
    id: "cat-stickers",
    name: "Stickers",
    nameAr: "ستيكرز",
    slug: "stickers",
    image: "/category-stickers.jpg",
    active: true,
  },
  {
    id: "cat-laptop",
    name: "Laptop Skins",
    nameAr: "سكنز لابتوب",
    slug: "laptop-skins",
    image: "/category-laptop.jpg",
    active: true,
  },
  {
    id: "cat-mug",
    name: "Custom Mugs",
    nameAr: "ماجات مخصصة",
    slug: "mugs",
    image: "/category-mug.jpg",
    active: true,
  },
  {
    id: "cat-keyboard",
    name: "Keyboard Covers",
    nameAr: "كيبورد كوفر",
    slug: "keyboard-covers",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    active: true,
  },
  {
    id: "cat-notebook",
    name: "Notebooks",
    nameAr: "دفاتر",
    slug: "notebooks",
    image:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
    active: true,
  },
  {
    id: "cat-mousepad",
    name: "Mousepads",
    nameAr: "ماوس باد",
    slug: "mousepads",
    image:
      "https://images.unsplash.com/photo-1615858603815-8b08690884c7?auto=format&fit=crop&w=900&q=80",
    active: true,
  },
  {
    id: "cat-custom",
    name: "Create Your Own",
    nameAr: "صمم بنفسك",
    slug: "custom",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=900&q=80",
    active: true,
  },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Lime Graffiti Laptop Skin",
    nameAr: "سكن لابتوب جرافيتي لايم",
    slug: "lime-graffiti-laptop",
    description:
      "Premium matte vinyl laptop skin with bold lime green graffiti art. Fits 13-15 inch laptops. Scratch resistant, easy apply & remove.",
    descriptionAr:
      "سكن لابتوب من الفينيل الماط بتصميم جرافيتي جريء باللون اللايم. يناسب لابتوبات 13-15 بوصة. مقاوم للخدش، سهل التركيب والإزالة.",
    images: ["/category-laptop.jpg"],
    categoryId: "cat-laptop",
    price: 450,
    stock: 25,
    featured: true,
    active: true,
    bestSeller: true,
  },
  {
    id: "p2",
    name: "Sticker Pack — Egyptian Vibes",
    nameAr: "باكيت ستيكرز — ستايل مصري",
    slug: "egyptian-vibes-stickers",
    description:
      "Set of 20 waterproof vinyl stickers with Egyptian street culture designs. Die-cut, UV resistant, perfect for laptops & bottles.",
    descriptionAr:
      "طقم 20 ستيكر فينيل مضاد للماء بتصاميم ستريت مصري. مقاوم للأشعة فوق البنفسجية، مناسب للابتوب والزجاجات.",
    images: ["/category-stickers.jpg"],
    categoryId: "cat-stickers",
    price: 180,
    stock: 150,
    featured: true,
    active: true,
    bestSeller: true,
  },
  {
    id: "p3",
    name: "Custom Name Mug",
    nameAr: "ماجة باسمك",
    slug: "custom-name-mug",
    description:
      "Ceramic mug with your name or phrase in bold typography. Dishwasher safe, 11oz capacity.",
    descriptionAr: "ماجة سيراميك باسمك أو أي عبارة بخط بولد. آمنة للغسالة، 11 أونصة.",
    images: ["/category-mug.jpg"],
    categoryId: "cat-mug",
    price: 220,
    stock: 80,
    featured: true,
    active: true,
    bestSeller: true,
  },
  {
    id: "p4",
    name: "Dark Mode Keyboard Cover",
    nameAr: "كيبورد كوفر دارك مود",
    slug: "dark-mode-keyboard",
    description:
      "Silicone keyboard cover with dark theme key labels. Fits most 15.6 inch laptops. Waterproof & dustproof.",
    descriptionAr:
      "كفر سيليكون للكيبورد بتصميم دارك مود. يناسب معظم لابتوبات 15.6 بوصة. مضاد للماء والغبار.",
    images: [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80",
    ],
    categoryId: "cat-keyboard",
    price: 150,
    stock: 60,
    featured: false,
    active: true,
    bestSeller: true,
  },
  {
    id: "p5",
    name: "Creator's Notebook — A5",
    nameAr: "دفتر كريتر — A5",
    slug: "creators-notebook-a5",
    description:
      "192-page dotted notebook with hardcover custom design. 120gsm paper, lays flat.",
    descriptionAr:
      "دفتر 192 صفحة منقط بغلاف صلب بتصميم مخصص. ورق 120 جرام، يفتح مسطح.",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
    ],
    categoryId: "cat-notebook",
    price: 280,
    stock: 40,
    featured: true,
    active: true,
  },
  {
    id: "p6",
    name: "Gamer Mousepad XL",
    nameAr: "ماوس باد جيمنج XL",
    slug: "gamer-mousepad-xl",
    description:
      "Extended gaming mousepad with anti-slip rubber base. Smooth surface, 900x400mm.",
    descriptionAr:
      "ماوس باد جيمنج كبير بقاعدة مطاطية مضادة للانزلاق. سطح ناعم، 900x400 مم.",
    images: [
      "https://images.unsplash.com/photo-1615858603815-8b08690884c7?auto=format&fit=crop&w=900&q=80",
    ],
    categoryId: "cat-mousepad",
    price: 320,
    stock: 30,
    featured: false,
    active: true,
    bestSeller: true,
  },
  {
    id: "p7",
    name: "Arabic Calligraphy Sticker",
    nameAr: "ستيكر خط عربي",
    slug: "arabic-calligraphy-sticker",
    description:
      "Large die-cut sticker with Arabic calligraphy. Matte finish, 15cm size.",
    descriptionAr: "ستيكر كبير بخط عربي.Finish ماط، حجم 15 سم.",
    images: ["/category-stickers.jpg"],
    categoryId: "cat-stickers",
    price: 60,
    stock: 200,
    featured: false,
    active: true,
  },
  {
    id: "p8",
    name: "Neon Wave Laptop Skin",
    nameAr: "سكن لابتوب نيون ويف",
    slug: "neon-wave-laptop",
    description:
      "Holographic neon wave design laptop skin. Turns heads everywhere.",
    descriptionAr: "سكن لابتوب بتصميم موجات نيون هولوغرافيك. يلفت الأنظار في كل مكان.",
    images: ["/category-laptop.jpg"],
    categoryId: "cat-laptop",
    price: 480,
    stock: 15,
    featured: true,
    active: true,
  },
  {
    id: "p9",
    name: "Coffee Addict Mug",
    nameAr: "ماجة أدمان القهوة",
    slug: "coffee-addict-mug",
    description: "White ceramic mug with witty coffee-themed print.",
    descriptionAr: "ماجة سيراميك أبيض بطباعة عن القهوة.",
    images: ["/category-mug.jpg"],
    categoryId: "cat-mug",
    price: 190,
    stock: 100,
    featured: false,
    active: true,
  },
  {
    id: "p10",
    name: "Holographic Sticker Sheet",
    nameAr: "شيت ستيكرز هولوغرافيك",
    slug: "holographic-sticker-sheet",
    description: "A5 sheet of 12 holographic stickers. Shines in the sun.",
    descriptionAr: "شيت A5 فيه 12 ستيكر هولوغرافيك. بيلمع في الشمس.",
    images: ["/category-stickers.jpg"],
    categoryId: "cat-stickers",
    price: 120,
    stock: 120,
    featured: true,
    active: true,
  },
  {
    id: "p11",
    name: "Minimal Notebook — Black",
    nameAr: "دفتر مينيمل — أسود",
    slug: "minimal-notebook-black",
    description: "Sleek black dotted notebook, 160 pages.",
    descriptionAr: "دفتر أسود أنيق منقط، 160 صفحة.",
    images: [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
    ],
    categoryId: "cat-notebook",
    price: 250,
    stock: 50,
    featured: false,
    active: true,
  },
  {
    id: "p12",
    name: "Desk Mat — Green Marble",
    nameAr: "ديسك مات — رخام أخضر",
    slug: "desk-mat-green-marble",
    description: "Premium desk mat with green marble pattern. 800x300mm.",
    descriptionAr: "ديسك مات بريميوم بتصميم رخام أخضر. 800x300 مم.",
    images: [
      "https://images.unsplash.com/photo-1615858603815-8b08690884c7?auto=format&fit=crop&w=900&q=80",
    ],
    categoryId: "cat-mousepad",
    price: 380,
    stock: 20,
    featured: false,
    active: true,
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    name: "Youssef M.",
    rating: 5,
    comment: "The laptop skin quality is insane. Fits perfectly and looks premium.",
    commentAr: "جودة سكن اللابتوب جنونية. بيفيت بالظبط وشكله بريميوم.",
    avatar: "YM",
  },
  {
    id: "r2",
    name: "Nour K.",
    rating: 5,
    comment: "Ordered custom mugs for my team. Everyone loved them!",
    commentAr: "طلبت ماجات مخصصة لفريقي. الكل حبها!",
    avatar: "NK",
  },
  {
    id: "r3",
    name: "Ahmed R.",
    rating: 5,
    comment: "Fast delivery, great packaging. The stickers are waterproof as promised.",
    commentAr: "توصيل سريع وتغليف ممتاز. الستيكرز مضادة للماء زي ما قالوا.",
    avatar: "AR",
  },
  {
    id: "r4",
    name: "Salma T.",
    rating: 4,
    comment: "Loved the notebook! Paper quality is great for fountain pens too.",
    commentAr: "حببت الدفتر! جودة الورق حلوة حتى لأقلام الحبر.",
    avatar: "ST",
  },
];

export const sampleOrders: Order[] = [
  {
    id: "ORD-1001",
    user: "user@demo.com",
    products: [
      { productId: "p1", quantity: 1, price: 450 },
      { productId: "p2", quantity: 2, price: 180 },
    ],
    total: 810,
    paymentMethod: "vodafone",
    paymentStatus: "verified",
    orderStatus: "delivered",
    address: "15 El Nozha St, Heliopolis",
    phone: "01101234567",
    name: "Youssef Mahmoud",
    governorate: "Cairo",
    createdAt: "2026-01-10T10:30:00Z",
    history: [
      { status: "pending", timestamp: "2026-01-10T10:30:00Z" },
      { status: "confirmed", timestamp: "2026-01-10T11:00:00Z" },
      { status: "processing", timestamp: "2026-01-11T09:00:00Z" },
      { status: "shipped", timestamp: "2026-01-12T14:00:00Z" },
      { status: "outForDelivery", timestamp: "2026-01-13T10:00:00Z" },
      { status: "delivered", timestamp: "2026-01-13T16:30:00Z" },
    ],
  },
  {
    id: "ORD-1002",
    user: "user2@demo.com",
    products: [{ productId: "p3", quantity: 1, price: 220 }],
    total: 220,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "processing",
    address: "22 Corniche El Nil, Maadi",
    phone: "01223456789",
    name: "Nour Khalil",
    governorate: "Cairo",
    createdAt: "2026-01-15T08:00:00Z",
    history: [
      { status: "pending", timestamp: "2026-01-15T08:00:00Z" },
      { status: "confirmed", timestamp: "2026-01-15T09:00:00Z" },
      { status: "processing", timestamp: "2026-01-16T10:00:00Z" },
    ],
  },
  {
    id: "ORD-1003",
    user: "user3@demo.com",
    products: [
      { productId: "p5", quantity: 1, price: 280 },
      { productId: "p6", quantity: 1, price: 320 },
    ],
    total: 600,
    paymentMethod: "vodafone",
    paymentStatus: "verified",
    orderStatus: "shipped",
    address: "5 El Horreya, Alexandria",
    phone: "01098765432",
    name: "Ahmed Rifaat",
    governorate: "Alexandria",
    createdAt: "2026-01-18T12:00:00Z",
    history: [
      { status: "pending", timestamp: "2026-01-18T12:00:00Z" },
      { status: "confirmed", timestamp: "2026-01-18T13:00:00Z" },
      { status: "processing", timestamp: "2026-01-19T10:00:00Z" },
      { status: "shipped", timestamp: "2026-01-20T11:00:00Z" },
    ],
  },
  {
    id: "ORD-1004",
    user: "user4@demo.com",
    products: [{ productId: "p10", quantity: 3, price: 120 }],
    total: 360,
    paymentMethod: "cod",
    paymentStatus: "pending",
    orderStatus: "pending",
    address: "10 El Geish, Mansoura",
    phone: "01112233445",
    name: "Salma Tarek",
    governorate: "Dakahlia",
    createdAt: "2026-01-20T15:00:00Z",
    history: [{ status: "pending", timestamp: "2026-01-20T15:00:00Z" }],
  },
];

export const sampleRequests: CustomRequest[] = [
  {
    id: "REQ-001",
    userName: "Mohamed Adel",
    userEmail: "mo@demo.com",
    productType: "Laptop Skin",
    notes: "Want my logo centered, dark background",
    image: "/category-laptop.jpg",
    status: "pending",
    createdAt: "2026-01-19T10:00:00Z",
  },
  {
    id: "REQ-002",
    userName: "Jana Hany",
    userEmail: "jana@demo.com",
    productType: "Mug",
    notes: "Photo of my cat with text 'Boss'",
    image: "/category-mug.jpg",
    status: "accepted",
    createdAt: "2026-01-17T09:00:00Z",
  },
  {
    id: "REQ-003",
    userName: "Omar Saeed",
    userEmail: "omar@demo.com",
    productType: "Mousepad",
    notes: "Anime character, full print",
    image:
      "https://images.unsplash.com/photo-1615858603815-8b08690884c7?auto=format&fit=crop&w=900&q=80",
    status: "rejected",
    createdAt: "2026-01-14T11:00:00Z",
  },
];

export const governorates = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Dakahlia",
  "Sharqia",
  "Qalyubia",
  "Kafr El Sheikh",
  "Gharbia",
  "Monufia",
  "Beheira",
  "Ismailia",
  "Port Said",
  "Suez",
  "Luxor",
  "Aswan",
  "Fayoum",
  "Beni Suef",
  "Minya",
  "Assiut",
  "Sohag",
  "Qena",
  "Red Sea",
  "New Valley",
  "Matrouh",
  "North Sinai",
  "South Sinai",
];
