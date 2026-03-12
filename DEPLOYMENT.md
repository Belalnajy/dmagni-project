# Deployment Guide — Vercel (Monorepo / Single Project)

الـ repo كله (frontend + backend) بيتـdeploy كـ **Vercel project واحد**.
- الـ Frontend (Next.js) على `/`
- الـ Backend (NestJS serverless) على `/api/*`

---

## المتطلبات الأولية

- حساب Vercel: https://vercel.com
- Vercel CLI (اختياري): `npm i -g vercel`
- قاعدة بيانات PostgreSQL — اختار واحدة:
  - **Neon** (مجاني): https://neon.tech
  - **Supabase**: https://supabase.com

---

## الخطوة 1 — جهّز قاعدة البيانات

### طريقة A — Neon (أسرع، مجاني)

1. افتح https://neon.tech واعمل حساب.
2. اضغط **New Project** → اختار اسم وـ region.
3. من الـ dashboard، **Connection Details** → انسخ الـ connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### طريقة B — Supabase

1. افتح https://supabase.com واعمل حساب.
2. **New Project** → حط اسم و password واختار region.
3. **Project Settings** → **Database** → **Connection string** → **URI**:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxx.supabase.co:5432/postgres?sslmode=require
   ```
   > ⚠️ استبدل `[YOUR-PASSWORD]` بالـ password بتاعك.

---

## الخطوة 2 — Deploy على Vercel

### Vercel Dashboard

1. افتح https://vercel.com/new
2. Import الـ repo من GitHub.
3. في **Configure Project**:
   - **Root Directory**: اتركه فاضي (الـ root)
   - **Framework Preset**: `Next.js`
4. في **Environment Variables**، ضيف:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | postgresql connection string (من الخطوة 1) |
   | `ALLOWED_ORIGINS` | https://your-project.vercel.app |
   | `NEXT_PUBLIC_API_URL` | https://your-project.vercel.app/api |
   | `CLOUDINARY_CLOUD_NAME` | من Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | من Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | من Cloudinary dashboard |
   | `REPLICATE_API_TOKEN` | من https://replicate.com/account/api-tokens |

5. اضغط **Deploy**.

### أو عن طريق CLI

```bash
vercel --prod
```

---

## الخطوة 3 — عدّل الـ URLs بعد أول Deploy

بعد ما تعرف الـ URL الفعلي (مثلاً `dmagni-project.vercel.app`):

1. Vercel dashboard → **Settings** → **Environment Variables**.
2. عدّل:
   - `ALLOWED_ORIGINS` → `https://dmagni-project.vercel.app`
   - `NEXT_PUBLIC_API_URL` → `https://dmagni-project.vercel.app/api`
3. **Deployments** → آخر deploy → **Redeploy**.

---

## الخطوة 4 — تحقق

```bash
# الـ frontend
curl https://dmagni-project.vercel.app/

# الـ backend
curl https://dmagni-project.vercel.app/api/

# endpoint معين
curl https://dmagni-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## هيكل الـ Deployment

```
GitHub Repo (monorepo)  →  Vercel Project واحد
├── frontend/           →  Next.js على /
├── backend/src/        →  NestJS logic
└── api/index.ts        →  Serverless handler على /api/*
```

---

## ملاحظات مهمة

### Serverless Limitations

- **Cold starts**: أول request بعد فترة هتبقى بطيئة.
- **File uploads**: Vercel بيحدد request body بـ **4.5MB** (Hobby). للصور الكبيرة ارفع مباشرة لـ Cloudinary.
- **Execution timeout**: **10 ثانية** (Hobby) / **30 ثانية** (Pro). الـ Replicate call ممكن تاخد أكتر.
  - الحل: upgrade لـ Pro أو اعمل الـ call async.

### قاعدة البيانات

- تأكد إن `?sslmode=require` موجود في الـ `DATABASE_URL`.
- `synchronize: true` هيعمل migration تلقائي أول deploy.
  > ⚠️ في production اعملها `false` واستخدم migrations.

---

## Troubleshooting

| المشكلة | الحل |
|---------|------|
| 404 على الـ frontend | تأكد إن `framework: nextjs` و `outputDirectory: frontend/.next` في `vercel.json` |
| 404 على `/api/*` | تأكد إن `api/index.ts` موجود في الـ root |
| CORS error | عدّل `ALLOWED_ORIGINS` في env vars وأعمل redeploy |
| Database connection error | تحقق من `DATABASE_URL` وإن SSL مفعّل |
| 504 Gateway Timeout | الـ Replicate بياخد أكتر من الـ timeout — upgrade لـ Pro |
| `Module not found` | تأكد إن `installCommand` في `vercel.json` بيعمل install للـ frontend و backend |
