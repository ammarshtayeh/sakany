export interface Ad {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
}

export const mockAds: Ad[] = [
  {
    id: "ad_1",
    title: "خصم 15% على سكنات رفيديا للطلاب الجدد - سجل الآن!",
    imageUrl: "https://images.unsplash.com/photo-1556761175-b813f53a362d?auto=format&fit=crop&w=1200&q=80",
    linkUrl: "/students",
    isActive: true,
  },
  {
    id: "ad_2",
    title: "سكنات البنات الفاخرة - القرب والأمان والراحة التامة",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    linkUrl: "/studentesses",
    isActive: true,
  }
];

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  category: "students" | "studentesses";
  image: string;
  images?: string[];
  features: string[];
  type: "apartment" | "room" | "studio";
  status: "available" | "booked";
  isPending: boolean;
  ownerName: string;
  ownerPhone: string;
  ownerEmail?: string;
  beds?: number;
  bathrooms?: number;
  sqft?: number;
  nearbyCollege?: "new_campus" | "old_campus" | "medical_campus" | "academy";
  reviews?: Review[];
  lat?: number | null;
  lng?: number | null;
  viewsCount?: number;
  contactsCount?: number;
}

export interface RoommatePost {
  id: string;
  userName: string;
  userGender: "male" | "female";
  title: string;
  description: string;
  priceRange: string;
  preferredLocation: string;
  contactPhone: string;
  date: string;
  major?: string;
  studyYear?: "first" | "second" | "third" | "fourth" | "graduate";
  habits?: string[];
}

export const mockListings: Listing[] = [
  {
    id: "1",
    title: "شقة فاخرة بالقرب من الحرم الجديد - جامعة النجاح",
    description:
      "شقة واسعة مؤثثة بالكامل تتكون من 3 غرف وصالة، مثالية لطلاب جامعة النجاح الوطنية، قريبة من الخدمات والمطاعم والمواصلات العامة.",
    price: 1500,
    location: "نابلس، شارع تونس، بالقرب من الحرم الجديد",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    features: [
      "تكييف سريع",
      "إنترنت فايبر",
      "مواقف سيارات",
      "مصعد",
      "صيانة مجانية",
    ],
    type: "apartment",
    status: "available",
    isPending: false,
    ownerName: "أبو العبد النابلسي",
    ownerPhone: "0599123456",
    beds: 3,
    bathrooms: 2,
    sqft: 120,
    nearbyCollege: "new_campus",
    lat: 32.2272,
    lng: 35.2227,
    reviews: [
      {
        id: "r1",
        userName: "أحمد علي",
        rating: 5,
        comment: "سكن رائع جداً وقريب من كلية الهندسة.",
        date: "2024-01-15",
      },
      {
        id: "r2",
        userName: "محمد عمر",
        rating: 4,
        comment: "الغرف واسعة لكن السعر مرتفع قليلاً.",
        date: "2024-01-10",
      },
    ],
  },
  {
    id: "2",
    title: "غرفة هادئة للطالبات - الحرم القديم",
    description:
      "غرفة مفردة في سكن مخصص للطالبات، يتميز بالأمن والخصوصية التامة، بالقرب من كليات الحرم القديم وصيدلية رفيديا.",
    price: 1200,
    location: "نابلس، رفيديا، بالقرب من الحرم القديم",
    category: "studentesses",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
    features: [
      "أمن وحراسة",
      "بيئة دراسية هادئة",
      "قريب من المواصلات",
      "تكييف",
      "غسالة ملابس",
    ],
    type: "room",
    status: "available",
    isPending: false,
    ownerName: "أم محمد",
    ownerPhone: "0598876543",
    beds: 1,
    bathrooms: 1,
    sqft: 20,
    nearbyCollege: "old_campus",
    lat: 32.2217,
    lng: 35.2425,
    reviews: [
      {
        id: "r3",
        userName: "سارة خالد",
        rating: 5,
        comment: "مكان هادئ جداً ومناسب للدراسة.",
        date: "2024-01-12",
      },
    ],
  },
  {
    id: "3",
    title: "استوديو مودرن للطلاب - الأكاديمية",
    description:
      "استوديو عصري مصمم بشكل رائع، إطلالة جبلية خلابة، وقريب من منطقة الأكاديمية ومجمع التدريب المهني.",
    price: 900,
    location: "نابلس، منطقة الأكاديمية، خلف الجامعة",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
    features: [
      "مطبخ متكامل",
      "إطلالة بانورامية",
      "سعر شامل الكهرباء والماء",
      "أثاث جديد",
    ],
    type: "studio",
    status: "available",
    isPending: false,
    ownerName: "خالد المصري",
    ownerPhone: "0597456789",
    beds: 1,
    bathrooms: 1,
    sqft: 45,
    nearbyCollege: "academy",
    lat: 32.2312,
    lng: 35.2155,
  },
  {
    id: "4",
    title: "سكن طالبات متميز - شارع رفيديا الرئيسي",
    description:
      "شقة راقية للطالبات، نظام غرف مزدوجة ومفردة، أثاث جديد جداً وخدمات صيانة فورية على مدار الساعة.",
    price: 1800,
    location: "نابلس، شارع رفيديا، مقابل المستشفى العربي",
    category: "studentesses",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800",
    features: [
      "خدمة تنظيف",
      "تدفئة مركزية",
      "دخول آمن",
      "كاميرات مراقبة",
      "إطلالة",
    ],
    type: "apartment",
    status: "available",
    isPending: false,
    ownerName: "سارة القاسم",
    ownerPhone: "0595890123",
    beds: 2,
    bathrooms: 1,
    sqft: 85,
  },
  {
    id: "5",
    title: "شقة شبابية بالقرب من ملعب البلدية",
    description:
      "شقة مريحة تناسب 4 طلاب، قريبة من المطاعم والخدمات المركزية، مجهزة بكافة الأدوات المنزلية.",
    price: 1300,
    location: "نابلس، المركز، خلف بنك فلسطين",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800",
    features: ["مطبخ واسع", "إنترنت سريع", "قريب من محطة الباصات", "سخان شمسي"],
    type: "apartment",
    status: "available",
    isPending: false,
    ownerName: "سامي العلي",
    ownerPhone: "0594121212",
    beds: 4,
    bathrooms: 2,
    sqft: 110,
  },
  {
    id: "6",
    title: "رووف بإطلالة ملكية للطالبات",
    description:
      "رووف مميز جداً به إطلالة كاشفة لمدينة نابلس، مجهز بجلسة خارجية رائعة وتدفئة ممتازة.",
    price: 2200,
    location: "نابلس، الجبل الشمالي، شارع عصيرة",
    category: "studentesses",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    features: [
      "تراس واسع",
      "أثاث VIP",
      "هدوء تام",
      "غسالة ونشاف",
      "ديكورات حديثة",
    ],
    type: "apartment",
    status: "available",
    isPending: false,
    ownerName: "ليلى صالح",
    ownerPhone: "0593344556",
    beds: 2,
    bathrooms: 1,
    sqft: 100,
  },
  {
    id: "7",
    title: "استوديو اقتصادي بالقرب من جامعة القدس المفتوحة",
    description:
      "استوديو صغير ومناسب من حيث التكلفة لطالب واحد، هادئ وقريب من مكتبة الجامعة.",
    price: 700,
    location: "نابلس، المساكن الشعبية",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    features: ["سعر مخفض", "شامل الكهرباء", "منطقة هادئة"],
    type: "studio",
    status: "available",
    isPending: false,
    ownerName: "أبو خليل",
    ownerPhone: "0592233445",
    beds: 1,
    bathrooms: 1,
    sqft: 35,
  },
  {
    id: "8",
    title: "شقة عصرية للطالبات - الضاحية",
    description:
      "شقة جديدة في منطقة الضاحية الراقية، هدوء تام وأمان، مخصصة للطالبات الدارسات في المجمع الصحي.",
    price: 2000,
    location: "نابلس، حي الضاحية العليا",
    category: "studentesses",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    features: ["موقف خاص", "مصعد حديث", "شبابيك دبل جلاس", "نظام حماية"],
    type: "apartment",
    status: "available",
    isPending: false,
    ownerName: "مريم عابد",
    ownerPhone: "0591122334",
    beds: 3,
    bathrooms: 2,
    sqft: 130,
  },
  {
    id: "9",
    title: "غرفة مزدوجة للطلاب - جبل الطور",
    description:
      "غرفة واسعة تتسع لطالبين مع حمام خاص ومطبخ مشترك، إطلالة رائعة على نابلس القديمة.",
    price: 800,
    location: "نابلس، جبل الطور، صعود العبد",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    features: ["إطلالة جبلية", "قريب من المسجد", "تكييف"],
    type: "room",
    status: "available",
    isPending: false,
    ownerName: "أنس الجعبري",
    ownerPhone: "0590099887",
    beds: 2,
    bathrooms: 1,
    sqft: 30,
  },
  {
    id: "10",
    title: 'سكن "الأخوات" المتميز للطالبات',
    description:
      "سكن مرخص مجهز بكل سبل الراحة والأمان، مشرفات مقيمات، وجبات طعام اختيارية، وبيئة اجتماعية مميزة.",
    price: 1600,
    location: "نابلس، رفيديا، خلف جامعة القدس المفتوحة",
    category: "studentesses",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    features: ["مشرفات", "وجبات طعام", "قاعة دراسة مشتركة", "إنترنت 5G"],
    type: "room",
    status: "available",
    isPending: false,
    ownerName: "إدارة سكن الأخوات",
    ownerPhone: "0598765432",
    beds: 1,
    bathrooms: 1,
    sqft: 25,
  },
  {
    id: "11",
    title: "استوديو قيد الموافقة (للأدمن فقط)",
    description: "هذا السكن لا يظهر للعامة حالياً حتى يوافق عليه الأدمن.",
    price: 1000,
    location: "نابلس، شارع تونس",
    category: "students",
    image:
      "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800",
    features: ["ميزة 1", "ميزة 2"],
    type: "studio",
    status: "available",
    isPending: true,
    ownerName: "صاحب عقار جديد",
    ownerPhone: "0590000000",
    beds: 1,
    bathrooms: 1,
    sqft: 40,
  },
];

export const mockRoommatePosts: RoommatePost[] = [
  {
    id: "rp1",
    userName: "خليل ابراهيم",
    userGender: "male",
    title: "أبحث عن شريك سكن في منطقة رفيديا",
    description:
      "أنا طالب سنة ثالثة هندسة، هادئ وغير مدخن، أبحث عن شخص يشاركني شقة غرفتين بسعر معقول.",
    priceRange: "700-900 شيكل",
    preferredLocation: "رفيديا، بجانب المستشفى العربي",
    contactPhone: "0599000111",
    date: "2024-01-20",
    major: "هندسة حاسوب",
    studyYear: "third",
    habits: ["غير مدخن", "ينام مبكراً", "بيئة هادئة", "منظم"],
  },
  {
    id: "rp2",
    userName: "نور الهدى",
    userGender: "female",
    title: "مطلوب شريكة سكن في شارع تونس",
    description:
      "أبحث عن طالبة لتشاركني غرفة مزدوجة في سكن طالبات، السكن مريح ونظيف جداً وقريب من الحرم.",
    priceRange: "600 شيكل",
    preferredLocation: "شارع تونس، قريب من الحرم الجديد",
    contactPhone: "0598222333",
    date: "2024-01-18",
    major: "علم النفس",
    studyYear: "second",
    habits: ["هادئة", "نظيفة", "ملتزمة دراسياً"],
  },
  {
    id: "rp3",
    userName: "أحمد سالم",
    userGender: "male",
    title: "أبحث عن شريك لشقة في المركز",
    description:
      "طالب طب سنة أولى، ملتزم ومجتهد، أبحث عن شريك هادئ للسكن في شقة قرب المجمع الطبي.",
    priceRange: "800-1000 شيكل",
    preferredLocation: "المركز، قرب المجمع الطبي",
    contactPhone: "0597111222",
    date: "2024-01-22",
    major: "طب بشري",
    studyYear: "first",
    habits: ["غير مدخن", "بيئة هادئة", "يهتم بالنظافة"],
  },
  {
    id: "rp4",
    userName: "ريم العلي",
    userGender: "female",
    title: "شريكة سكن مطلوبة - ضاحية",
    description:
      "أسكن في شقة ممتازة بمنطقة الضاحية وأبحث عن شريكة لتقاسم الإيجار. الشقة واسعة ومريحة جداً.",
    priceRange: "900 شيكل",
    preferredLocation: "حي الضاحية",
    contactPhone: "0595888777",
    date: "2024-01-25",
    major: "إدارة أعمال",
    studyYear: "fourth",
    habits: ["اجتماعية", "منظمة", "تحب الطبخ"],
  },
];

export interface NearbyService {
  id: string;
  name: string;
  category: "restaurant" | "cafe" | "supermarket" | "laundry" | "other";
  image: string;
  description: string;
  phone?: string;
  whatsapp?: string;
  address: string;
  discount?: string;
  isActive: boolean;
  lat?: number | null;
  lng?: number | null;
  // Sponsorship fields
  sponsorTier?: "basic" | "featured" | "premium";
  logoUrl?: string;
  openHours?: string;
  rating?: number;
  reviewCount?: number;
  studentOffer?: string;
  tags?: string[];
  instagramUrl?: string;
  mapUrl?: string;
  clicksCount?: number;
}

export interface BusinessRequest {
  id?: string;
  businessName: string;
  category: string;
  ownerName: string;
  phone: string;
  whatsapp?: string;
  address: string;
  selectedTier: "basic" | "featured" | "premium";
  studentOffer?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export const mockNearbyServices: NearbyService[] = [
  {
    id: "ns1",
    name: "مطعم البرجر الذهبي",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    description: "أشهى الوجبات السريعة والبرجر المشوي على الفحم. تذوق الطعم الأصيل والمذاق الرائع مع خدمات التوصيل السريع لجميع السكنات الجامعية.",
    phone: "0599123456",
    whatsapp: "970599123456",
    address: "رفيديا - الشارع الرئيسي - مقابل المستشفى العربي",
    discount: "خصم 15% لحاملي بطاقة جامعة النجاح",
    studentOffer: "خصم 15% بذكر سكنو",
    isActive: true,
    lat: 32.2265,
    lng: 35.2215,
    sponsorTier: "premium",
    rating: 4.8,
    reviewCount: 142,
    openHours: "10:00 ص - 12:00 م",
    tags: ["توصيل", "وجبات سريعة", "برجر"],
  },
  {
    id: "ns2",
    name: "مقهى ومكتبة الرواد",
    category: "cafe",
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=800",
    description: "المكان الأمثل للدراسة والتركيز. نوفر غرف دراسية هادئة، إنترنت فائق السرعة، ومشروبات باردة وساخنة مع قائمة طعام خفيفة للطلاب.",
    phone: "0598765432",
    whatsapp: "970598765432",
    address: "شارع الأكاديمية - بجانب الحرم الجديد لجامعة النجاح",
    discount: "مشروب مجاني مع كل 3 ساعات دراسة",
    studentOffer: "مشروب مجاني مع 3 ساعات دراسة",
    isActive: true,
    lat: 32.2285,
    lng: 35.2240,
    sponsorTier: "featured",
    rating: 4.6,
    reviewCount: 89,
    openHours: "8:00 ص - 11:00 م",
    tags: ["واي فاي", "جلسات دراسة", "قهوة"],
  },
  {
    id: "ns3",
    name: "سوبرماركت النجاح المركزي",
    category: "supermarket",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    description: "تجد لدينا كل مستلزماتك اليومية والغذائية. خدمة التوصيل مجانية للطلبات فوق 50 شيكل لجميع سكنات الطلاب في منطقة المخفية ورفيديا.",
    phone: "0597111222",
    whatsapp: "970597111222",
    address: "المخفية - الدوار الرئيسي",
    discount: "توصيل مجاني بالكامل لكافة سكنات الطلاب",
    studentOffer: "توصيل مجاني للطلاب",
    isActive: true,
    lat: 32.2245,
    lng: 35.2255,
    sponsorTier: "featured",
    rating: 4.4,
    reviewCount: 67,
    openHours: "7:00 ص - 10:00 م",
    tags: ["توصيل مجاني", "مواد غذائية", "مستلزمات"],
  },
  {
    id: "ns4",
    name: "مغسلة النور السريعة",
    category: "laundry",
    image: "https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&q=80&w=800",
    description: "غسيل وكوي وتجفيف بأحدث المعدات. نقوم باستلام الملابس من السكن وإعادتها معقمة ونظيفة خلال 24 ساعة فقط. عروض خاصة للاشتراكات الشهرية للطلاب.",
    phone: "0595333444",
    whatsapp: "970595333444",
    address: "شارع تونس - قرب سكنات الطلاب",
    discount: "كوي مجاني لقطعتين عند غسيل أكثر من 5 كغم",
    studentOffer: "كوي مجاني مع كل غسلة",
    isActive: true,
    lat: 32.2255,
    lng: 35.2205,
    sponsorTier: "basic",
    rating: 4.2,
    reviewCount: 34,
    openHours: "8:00 ص - 8:00 م",
    tags: ["استلام من السكن", "24 ساعة"],
  },
  {
    id: "ns5",
    name: "مطعم شاورما الشام",
    category: "restaurant",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&q=80&w=800",
    description: "أصالة الشاورما السورية الحقيقية في قلب نابلس. لحوم طازجة يومياً، خبز طازج، وصلصات بيتية لا مثيل لها. الطالب بضيافتنا دائماً.",
    phone: "0594555666",
    whatsapp: "970594555666",
    address: "شارع تونس - بجانب دوار رفيديا",
    discount: "ساندويش مجاني مع كل 5 زيارات",
    studentOffer: "ساندويش هدية مع كل 5 زيارات",
    isActive: true,
    lat: 32.2270,
    lng: 35.2195,
    sponsorTier: "premium",
    rating: 4.9,
    reviewCount: 213,
    openHours: "11:00 ص - 2:00 ص",
    tags: ["شاورما", "توصيل", "24 ساعة"],
  },
  {
    id: "ns6",
    name: "صيدلية الصحة الطلابية",
    category: "other",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=800",
    description: "صيدلية متخصصة بالقرب من الحرم الجامعي. نوفر جميع الأدوية والمستلزمات الطبية مع استشارة صيدلانية مجانية لجميع الطلاب.",
    phone: "0593777888",
    whatsapp: "970593777888",
    address: "الحرم الجديد - مقابل البوابة الرئيسية",
    discount: "استشارة صيدلانية مجانية",
    studentOffer: "استشارة مجانية + خصم 10% على المستلزمات",
    isActive: true,
    lat: 32.2290,
    lng: 35.2250,
    sponsorTier: "basic",
    rating: 4.5,
    reviewCount: 58,
    openHours: "8:00 ص - 9:00 م",
    tags: ["صيدلية", "استشارة مجانية", "طوارئ"],
  },
];

