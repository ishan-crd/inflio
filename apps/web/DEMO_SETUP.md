# Inflio demo — go-live checklist

This gets the hosted demo on **inflio.in** working end-to-end (register, login,
Google auth, clean creators + campaigns) and keeps it clean automatically.

The app code is ready. What remains is **configuration that needs your accounts**
(Convex, Postgres, Google). Do these once and the demo runs itself.

---

## 1. Environment variables

Copy `.env.example` → `.env.local` for local dev, and set the same keys in
**Vercel → Project → Settings → Environment Variables** for production.

| Key | Where it comes from | Notes |
|-----|--------------------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | `npx convex deploy` output | Data layer |
| `CONVEX_DEPLOYMENT` | written by `npx convex dev` | Dev only |
| `NEXT_PUBLIC_APP_URL` | `https://www.inflio.in` in prod | **Must** be the real domain or auth cookies break |
| `DATABASE_URL` | Neon/Supabase Postgres | Auth accounts live here |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Cloud Console | See step 4 |
| `RESEND_API_KEY` | Resend dashboard | Only needed for email-OTP sign-in |

---

## 2. Auth database (Postgres) — makes register/login work

1. Create a free Postgres DB (Neon or Supabase) and copy its connection string
   into `DATABASE_URL`.
2. Create the Better Auth tables **once**:
   ```bash
   cd apps/web
   npx @better-auth/cli migrate
   ```
   (or apply `better-auth_migrations/*.sql` manually.)

Without this, "sign in / register" fail because the auth tables don't exist.

---

## 3. Convex — deploy functions + seed clean demo data

```bash
cd apps/web

# deploy the latest functions (seed + nightly cron) to your prod deployment
npx convex deploy

# wipe any old/duplicate data and load the clean demo set
# (12 brands, 12 campaigns, 23 creators)
npx convex run seed:resetAndSeed
```

After this the `/creators` and `/marketplace` pages are populated with clean,
non-duplicated data.

> **Auto-clean:** `convex/crons.ts` runs `seed:resetAndSeed` every night at
> 02:00 IST, wiping visitor-created junk (fake profiles, applications,
> duplicate campaigns) and reseeding the curated set. No manual upkeep needed.
> To change the demo content, edit `convex/seed.ts` and redeploy.

---

## 4. Google sign-in

In **Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID**:

- Authorized redirect URIs:
  - `https://www.inflio.in/api/auth/callback/google`
  - `http://localhost:3000/api/auth/callback/google` (for local testing)
- Copy the client ID/secret into `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
  (locally and on Vercel).

---

## 5. Verify end-to-end

1. Visit `/login`, create an account with email + password → you should land on
   `/onboarding`.
2. Complete onboarding → a real creator/brand profile is written to Convex and
   you're routed to `/marketplace` (creator) or `/creators` (brand).
3. Sign out, sign back in → the callback routes you straight to your dashboard.
4. `/creators` shows 23 distinct creators; `/marketplace` shows 12 distinct
   campaigns.
5. "Continue with Google" completes the OAuth round-trip.

If register/login still fails, it's almost always `DATABASE_URL` (tables not
migrated) or `NEXT_PUBLIC_APP_URL` not matching the real domain.
