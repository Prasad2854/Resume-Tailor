# 🚀 Deployment Guide

This application is configured as a Single Page Application (SPA) using React and Vite. It is optimized for zero-config deployments on major static hosting platforms.

## Pre-requisites
For **Lemma deployment** (`lemma apps deploy`), only `lemma.app.json` is required — the host injects pod context and auth at serve time. **Do not bake `VITE_LEMMA_TOKEN` into production builds.**

For **local development**, copy `.env.example` to `.env.local`. Auth is handled automatically by the Vite dev plugin via `lemma auth print-token` (requires `lemma auth login`).

For third-party static hosts (Vercel/Netlify), cookie-based Lemma auth will not work — deploy via Lemma instead:
- `VITE_LEMMA_API_URL` (e.g., `https://api.lemma.work`)
- `VITE_LEMMA_AUTH_URL` (e.g., `https://lemma.work/auth`)
- `VITE_LEMMA_POD_ID`
- `VITE_LEMMA_WORKFLOW_NAME`

---

## 1. Deploying to Vercel (Recommended)
Vercel is natively supported. The included `vercel.json` ensures that SPA routing works out-of-the-box (rewriting all traffic to `index.html`).

1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. **Framework Preset:** Vercel should auto-detect **Vite**.
5. **Environment Variables:** Add your Lemma API credentials.
6. Click **Deploy**.

---

## 2. Deploying to Netlify
Netlify is also natively supported. The included `netlify.toml` handles build commands and SPA redirects.

1. Push your code to GitHub.
2. Go to [Netlify](https://netlify.com/) and click **Add new site > Import an existing project**.
3. Import your GitHub repository.
4. **Build settings:** Netlify will auto-read `netlify.toml`.
5. **Environment Variables:** Click "Show advanced" and add your credentials.
6. Click **Deploy site**.

---

## 3. Deploying to Lemma (Recommended)
Deploy directly via the Lemma CLI — this is the production path with automatic session auth:

```bash
cd frontend
npm install
lemma apps deploy resumint . --pod 019f0963-44fb-71ed-b3be-5eb7c654c558 --yes
```

The app will be served at `https://resumint.apps.lemma.work` with cookie-based authentication and automatic token refresh. No manual token management required.

---

## 4. (Optional) Supabase Backend Setup
Currently, Resumint operates entirely on the client-side utilizing `localStorage` for privacy and speed. 
If you intend to implement persistent user authentication and cloud history:

1. Create a project on [Supabase](https://supabase.com).
2. Grab your **Project URL** and **Anon Key**.
3. Add them to your environment:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Wire up the `@supabase/supabase-js` client in a new `src/lib/supabase.js` file.
