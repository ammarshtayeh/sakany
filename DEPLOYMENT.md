# دليل تشغيل ونشر منصة "سكني" 🚀

تهانينا! الموقع الآن جاهز تماماً بأعلى معايير الجودة (Premium UI) وتم تخصيصه لجامعة النجاح الوطنية في نابلس.

## 🛠️ التجهيز للربط مع Firebase

الموقع مجهز برمجياً للتعامل مع Firebase في ملف `lib/firebase.ts`. كل ما عليك فعله هو إضافة القيم الخاصة بمشروعك في ملف `.env.local` في المجلد الرئيسي:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 🌐 النشر على الدومين (Vercel)

بما أن المشروع مبني بـ Next.js، فإن أفضل خيار للنشر هو **Vercel**:

1. ارفع المشروع على مستودع (GitHub).
2. قم بربط المستودع بموقع [Vercel](https://vercel.com).
3. أضف متغيرات البيئة (Environment Variables) المذكورة أعلاه في إعدادات المشروع على Vercel.
4. اضغط **Deploy**.

## ✨ ما تم إنجازه في النسخة النهائية:

1. **تصميم فاخر (Orange & Black):** ثيم قوي وعصري يليق بهوية المنصة الجديدة.
2. **توطين كامل:** العملة هي الشيكل (₪) والموقع هو نابلس (جامعة النجاح).
3. **صفحة 404 مخصصة:** صفحة احترافية تمنع ضياع المستخدم عند البحث عن روابط غير صحيحة.
4. **شريط تنقل (Navbar) ذكي:** منظم جداً مع مدخل خفي للأدمن وسهولة تصفح فائقة.
5. **بطاقات السكن (Listing Cards):** تم إصلاح جميع الألوان والبادجات (Badges) لتكون متناغمة تماماً مع الثيم.
6. **لوحة تحكم كاملة (Admin):** لوحة تحكم بمظهر تقني فائق الجودة لإدارة العقارات والإحصائيات.

**جاهز للانطلاق! بقية الخطوات هي مجرد إدخال مفاتيح Firebase الخاصة بك وسيكون الموقع حياً بالكامل.** 👋🔥🇵🇸
