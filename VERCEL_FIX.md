# حل مشكلة 404 في Vercel 🔧

## المشكلة

عند رفع المشروع على Vercel، تظهر رسالة خطأ 404 NOT_FOUND

## الأسباب المحتملة

1. ❌ إعدادات Next.js غير مكتملة للنشر
2. ❌ متغيرات البيئة مفقودة في Vercel
3. ❌ مشكلة في Build Settings

## الحلول المطبقة ✅

### 1. تحديث `next.config.ts`

تم إضافة:

- `output: 'standalone'` - للنشر الصحيح على Vercel
- دعم صور Firebase Storage في `remotePatterns`

### 2. إنشاء `vercel.json`

ملف إعدادات Vercel لضمان البناء الصحيح

## خطوات النشر الصحيحة 📋

### الخطوة 1: رفع التغييرات على GitHub

```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```

### الخطوة 2: إعدادات Vercel

1. افتح مشروعك في [Vercel Dashboard](https://vercel.com/dashboard)
2. اذهب إلى **Settings** → **Environment Variables**
3. أضف المتغيرات التالية:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### الخطوة 3: إعادة النشر

1. اذهب إلى **Deployments**
2. اضغط على **Redeploy** للنشر الأخير
3. أو انتظر النشر التلقائي بعد الـ push

## التحقق من Build Settings ⚙️

تأكد من أن إعدادات البناء في Vercel كالتالي:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (اتركه فارغ أو .next)
- **Install Command**: `npm install`
- **Node Version**: 18.x أو أحدث

## استكشاف الأخطاء 🔍

### إذا استمرت المشكلة:

#### 1. تحقق من Logs

- اذهب إلى **Deployments** → اختر آخر deployment
- اضغط على **View Function Logs**
- ابحث عن أي أخطاء في البناء

#### 2. تحقق من الصفحة الرئيسية

- تأكد من وجود ملف `app/page.tsx`
- تأكد من أن الملف يحتوي على export default

#### 3. مسح Cache

في Vercel Dashboard:

- Settings → General
- اضغط على **Clear Cache and Redeploy**

#### 4. تحقق من .gitignore

تأكد من أن `.env.local` موجود في `.gitignore` (وهو موجود)
لا ترفع ملفات البيئة على GitHub!

## اختبار محلي قبل النشر 🧪

```bash
# تأكد من أن البناء يعمل محلياً
npm run build

# اختبر النسخة المبنية
npm start
```

إذا عمل محلياً، سيعمل على Vercel!

## ملاحظات مهمة 📌

1. **لا تنسى** إضافة متغيرات Firebase في Vercel
2. **تأكد** من أن المستودع على GitHub محدث
3. **انتظر** اكتمال البناء (قد يستغرق 2-3 دقائق)
4. **افحص** الـ Deployment Logs إذا فشل البناء

## روابط مفيدة 🔗

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Next.js Standalone Output](https://nextjs.org/docs/app/api-reference/next-config-js/output)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**تم إصلاح الإعدادات! الآن ارفع التغييرات وأعد النشر** 🚀
