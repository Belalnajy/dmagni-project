# Deployment Guide — Vercel (Monorepo / Single Project)

الـ repo كله (frontend + backend) بيتـdeploy كـ **Vercel project واحد**.
- الـ Frontend (Next.js) على `/`
- الـ Backend (NestJS serverless) على `/api/*`

---

## المتطلبات الأولية

- حساب Vercel: https://vercel.com
- Vercel CLI: `npm i -g vercel`
- قاعدة بيانات PostgreSQL على الإنترنت — اختار واحدة:
  - **Neon** (مجاني): https://neon.tech
  - **Supabase**: https://supabase.com

---

## الخطوة 1 — جهّز قاعدة البيانات

اختار واحدة من الطريقتين:

---

### طريقة A — Neon (أسرع، مجاني)

1. افتح https://neon.tech واعمل حساب.
2. اضغط **New Project** → اختار اسم وـ region.
3. من الـ dashboard، روح **Connection Details** → انسخ الـ connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
4. هذا هو الـ `DATABASE_URL` اللي هتحطه في Vercel.

---

### طريقة B — Supabase

1. افتح https://supabase.com واعمل حساب.
2. اضغط **New Project** → حط اسم وـ password للـ database واختار region.
3. استنى دقيقة لحد ما يخلص الـ provisioning.
4. من الـ sidebar: **Project Settings** → **Database**.
5. تحت **Connection string**، اختار تبويب **URI** وانسخ الـ string:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. ضيف `?sslmode=require` في الآخر:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
   ```
   > ⚠️ استبدل `[YOUR-PASSWORD]` بالـ password اللي حطيته وقت إنشاء المشروع.

---

في `backend/src/app.module.ts`، `synchronize: true` هتعمل migrate تلقائي أول deploy.
> ⚠️ في production حقيقية اعملها `false` واستخدم migrations، لكن للـ deploy الأول `true` أوكي.

---

## الخطوة 2 — Deploy على Vercel

### طريقة 1: Vercel Dashboard

1. افتح https://vercel.com/new
2. Import الـ repo من GitHub.
3. في خطوة "Configure Project":
   - **Root Directory**: اتركه فاضي (الـ root)
   - **Framework Preset**: `Other` ← مهم، مش Next.js (لأن الـ `vercel.json` بيتحكم في كل حاجة)
   - **Build Command**: اتركه فاضي
   - **Output Directory**: اتركه فاضي
4. في تبويب **Environment Variables**، ضيف:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | postgresql connection string |
   | `ALLOWED_ORIGINS` | https://your-project.vercel.app |
   | `NEXT_PUBLIC_API_URL` | https://your-project.vercel.app/api |
   | `CLOUDINARY_CLOUD_NAME` | من Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | من Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | من Cloudinary dashboard |
   | `REPLICATE_API_TOKEN` | من https://replicate.com/account/api-tokens |

   > بعد ما تعرف الـ URL الفعلي من Vercel، ارجع وعدّل `ALLOWED_ORIGINS` و `NEXT_PUBLIC_API_URL`.

5. اضغط **Deploy**.

---

### طريقة 2: Vercel CLI

```bash
# من الـ monorepo root
vercel --prod
```

---

## الخطوة 3 — عدّل الـ CORS بعد أول Deploy

1. روح Vercel dashboard → الـ project → **Settings** → **Environment Variables**.
2. عدّل:
   - `ALLOWED_ORIGINS` → `https://your-actual-project.vercel.app`
   - `NEXT_PUBLIC_API_URL` → `https://your-actual-project.vercel.app/api`
3. من تبويب **Deployments**، اضغط على آخر deploy → **Redeploy**.

---

## الخطوة 4 — تحقق إن كل حاجة شغالة

```bash
# اختبر الـ backend
curl https://your-project.vercel.app/api

# اختبر endpoint معين
curl https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## هيكل الـ Deployment

```
GitHub Repo (monorepo)
└── Vercel Project واحد
    ├── /           → frontend (Next.js) — مبني من frontend/
    └── /api/*      → backend (NestJS serverless) — مبني من backend/api/index.ts
```

---

## ملاحظات مهمة

### Serverless Limitations

- **Cold starts**: أول request بعد فترة هتبقى بطيئة (طبيعي في serverless).
- **File uploads (Multer)**: الـ tryon endpoints بترفع صور. Vercel بيحدد request body بـ **4.5MB**.
  - الحل: ارفع الصور مباشرة من الـ frontend إلى Cloudinary.
  - أو استخدم Vercel Pro اللي بيدي لحد 50MB.
- **Execution timeout**: Vercel بيحدد الـ serverless function بـ **10 ثانية** (Hobby plan). الـ Replicate AI call ممكن تاخد وقت أطول.
  - الحل: upgrade لـ Vercel Pro (60 ثانية).

### قاعدة البيانات

- تأكد إن الـ `DATABASE_URL` يحتوي على `?sslmode=require`.
- `synchronize: true` هيعمل migration تلقائي. راقب الـ logs أول deploy.

### Variables Check

```bash
vercel env ls --environment=production
```

---

## Troubleshooting

| المشكلة | الحل |
|---------|------|
| `Cannot find module '../src/app.module'` | تأكد إن `tsconfig.vercel.json` موجود في `backend/` |
| CORS error في الـ browser | عدّل `ALLOWED_ORIGINS` في الـ env vars وأعمل redeploy |
| Database connection error | تحقق من الـ `DATABASE_URL` وإن الـ SSL مفعّل |
| 404 على `/api/*` | تأكد إن الـ root `vercel.json` موجود وإن الـ routes مضبوطة |
| 504 Gateway Timeout | الـ Replicate call بتاخد وقت أطول من 10 ثانية — upgrade لـ Vercel Pro |
| `Module not found: express` | تأكد إن `@nestjs/platform-express` في `dependencies` مش `devDependencies` |
