# Deployment Guide — Vercel (Monorepo)

الـ monorepo فيه frontend (Next.js) و backend (NestJS serverless).
كل واحد فيهم بيتـdeploy كـ Vercel project منفصل.

---

## المتطلبات الأولية

- حساب Vercel: https://vercel.com
- Vercel CLI: `npm i -g vercel`
- قاعدة بيانات PostgreSQL على الإنترنت (مش localhost):
  - نصيحة: استخدم **Neon** (مجاني): https://neon.tech
  - أو **Supabase**: https://supabase.com
  - أو **Railway**: https://railway.app

---

## الخطوة 1 — جهّز قاعدة البيانات

1. اعمل حساب على [Neon](https://neon.tech) أو أي hosted Postgres.
2. انسخ الـ `DATABASE_URL` (شكله كده):
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```
3. في `backend/src/app.module.ts`، خليك عارف إن `synchronize: true` هتعمل migrate تلقائي أول ما البيئة تشتغل.
   > ⚠️ في production حقيقية اعملها `false` واستخدم migrations، لكن للـ deploy الأول `true` أوكي.

---

## الخطوة 2 — Deploy الـ Backend

### طريقة 1: Vercel Dashboard (أسهل)

1. افتح https://vercel.com/new
2. Import الـ repo من GitHub.
3. في خطوة "Configure Project":
   - **Root Directory**: اختار `backend`
   - **Framework Preset**: `Other`
   - **Build Command**: `npm run build` ← (nest build)
   - **Output Directory**: اتركه فاضي
4. في تبويب **Environment Variables**، ضيف:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | postgresql connection string |
   | `ALLOWED_ORIGINS` | https://your-frontend.vercel.app |
   | `CLOUDINARY_CLOUD_NAME` | من Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | من Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | من Cloudinary dashboard |
   | `REPLICATE_API_TOKEN` | من https://replicate.com/account/api-tokens |

5. اضغط **Deploy**.
6. بعد ما يخلص، انسخ الـ URL بتاعه (مثلاً: `https://dmagni-backend.vercel.app`).

### طريقة 2: Vercel CLI

```bash
cd backend
vercel --prod
```

اتبع الـ prompts، وحدد `backend` كـ root.

---

## الخطوة 3 — Deploy الـ Frontend

1. افتح https://vercel.com/new تاني
2. Import نفس الـ repo.
3. في خطوة "Configure Project":
   - **Root Directory**: اختار `frontend`
   - **Framework Preset**: `Next.js` (هيتاخد تلقائي)
4. في **Environment Variables**، ضيف:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | https://dmagni-backend.vercel.app |

5. اضغط **Deploy**.

### طريقة 2: CLI

```bash
cd frontend
vercel --prod
```

---

## الخطوة 4 — اربط الـ CORS

بعد ما اتعرفت على URL الـ frontend:

1. روح على Vercel dashboard للـ **backend** project.
2. Settings → Environment Variables.
3. عدّل `ALLOWED_ORIGINS` وخليها:
   ```
   https://dmagni-frontend.vercel.app
   ```
   لو عندك أكتر من domain، افصل بفاصلة بدون مسافات:
   ```
   https://dmagni-frontend.vercel.app,https://www.dmagni.com
   ```
4. اضغط Save، ثم **Redeploy** من Deployments tab.

---

## الخطوة 5 — تحقق إن كل حاجة شغالة

```bash
# اختبر الـ backend
curl https://dmagni-backend.vercel.app/

# اختبر endpoint معين
curl https://dmagni-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## ملاحظات مهمة بعد الـ Deploy

### Serverless Limitations

- **Cold starts**: أول request بعد فترة هتبقى بطيئة (طبيعي في serverless).
- **File uploads (Multer)**: الـ tryon endpoints بترفع صور. Vercel بيحدد request body بـ **4.5MB**. لو الصور أكبر:
  - الحل: ارفع الصور مباشرة من الـ frontend إلى Cloudinary بدل ما تعدي على الـ backend.
  - أو استخدم Vercel Pro اللي بيدي لحد 50MB.
- **Execution timeout**: Vercel بيحدد الـ serverless function بـ **10 ثانية** (Hobby plan). الـ Replicate AI call ممكن تاخد وقت أطول.
  - الحل: اعمل upgrade لـ Pro (60 ثانية) أو استخدم Vercel Edge Functions لـ streaming.

### قاعدة البيانات

- تأكد إن الـ `DATABASE_URL` يحتوي على `?sslmode=require` لو بتستخدم Neon أو Supabase.
- `synchronize: true` هيعمل migration تلقائي. راقب الـ logs أول deploy.

### Variables Check

```bash
# تحقق إن الـ env vars اتحطت صح
vercel env ls --environment=production
```

---

## هيكل الـ Deployment

```
GitHub Repo (monorepo)
├── backend/   → Vercel Project: "dmagni-backend"  → https://dmagni-backend.vercel.app
└── frontend/  → Vercel Project: "dmagni-frontend" → https://dmagni-frontend.vercel.app
```

---

## Troubleshooting

| المشكلة | الحل |
|---------|------|
| `Cannot find module '../src/app.module'` | تأكد إن `tsconfig.vercel.json` موجود وإن الـ build command صح |
| CORS error في الـ browser | عدّل `ALLOWED_ORIGINS` في الـ backend env vars وأعمل redeploy |
| Database connection error | تحقق من الـ `DATABASE_URL` وإن الـ SSL مفعّل |
| 504 Gateway Timeout | الـ Replicate call بتاخد وقت أطول من 10 ثانية — upgrade لـ Vercel Pro |
| `Module not found: express` | تأكد إن `@nestjs/platform-express` في `dependencies` مش `devDependencies` |
