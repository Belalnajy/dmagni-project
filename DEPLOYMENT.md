# Deployment Guide — Vercel (Single Project)

الـ frontend (Next.js) والـ backend (API Routes) كلهم في project واحد.
- الصفحات على `/`
- الـ API على `/api/*`

---

## المتطلبات

- حساب Vercel: https://vercel.com
- قاعدة بيانات PostgreSQL — اختار واحدة:
  - **Neon** (مجاني): https://neon.tech
  - **Supabase**: https://supabase.com

---

## الخطوة 1 — جهّز قاعدة البيانات

### Neon

1. https://neon.tech → New Project → انسخ الـ connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require
   ```

### Supabase

1. https://supabase.com → New Project → Project Settings → Database → Connection string → URI
2. ضيف `?sslmode=require` في الآخر

---

## الخطوة 2 — Deploy على Vercel

1. https://vercel.com/new → Import الـ repo
2. **Root Directory**: اتركه فاضي
3. **Framework Preset**: `Next.js`
4. **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | postgresql connection string |
   | `CLOUDINARY_CLOUD_NAME` | من Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | من Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | من Cloudinary dashboard |
   | `REPLICATE_API_TOKEN` | من https://replicate.com/account/api-tokens |

5. Deploy.

---

## الخطوة 3 — تحقق

```bash
curl https://your-project.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'
```

---

## هيكل الـ Project

```
dmagni-project/
├── frontend/
│   ├── src/app/api/      ← API Route Handlers
│   ├── src/lib/db.ts     ← TypeORM connection
│   ├── src/lib/entities/ ← DB entities
│   └── src/lib/services/ ← Cloudinary, Replicate
├── backend/              ← Reference (not deployed)
└── vercel.json
```

---

## Troubleshooting

| المشكلة | الحل |
|---------|------|
| Database connection error | تحقق من `DATABASE_URL` وإن SSL مفعّل |
| 504 Gateway Timeout | الـ Replicate بياخد وقت — upgrade لـ Vercel Pro |
| TypeORM decorator errors | تأكد `experimentalDecorators` في `tsconfig.json` |
