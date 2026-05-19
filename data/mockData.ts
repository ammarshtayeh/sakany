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
  beds?: number;
  bathrooms?: number;
  sqft?: number;
  nearbyCollege?: "new_campus" | "old_campus" | "medical_campus" | "academy";
  reviews?: Review[];
  lat?: number | null;
  lng?: number | null;
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
      "أنا طالب سنة ثالثة هندسة، هادئ وغير مدخن، أبحث عن شخص يشاركني شقة غرفتين.",
    priceRange: "700-900 شيكل",
    preferredLocation: "رفيديا، بجانب المستشفى العربي",
    contactPhone: "0599000111",
    date: "2024-01-20",
  },
  {
    id: "rp2",
    userName: "نور الهدى",
    userGender: "female",
    title: "مطلوب شريكة سكن في شارع تونس",
    description:
      "أبحث عن طالبة لتشاركني غرفة مزدوجة في سكن طالبات، السكن مريح ونظيف جداً.",
    priceRange: "600 شيكل",
    preferredLocation: "شارع تونس، قريب من الحرم الجديد",
    contactPhone: "0598222333",
    date: "2024-01-18",
  },
];
