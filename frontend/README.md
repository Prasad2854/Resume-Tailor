# 🚀 Resumint

**Fresh Resume Intelligence.** Land your dream job with an ATS-optimized, AI-tailored resume.

Resumint is a premium SaaS application that leverages AI (via Lemma API) to analyze a user's base resume against a target job description. It generates an ATS-optimized resume, identifies skill gaps, matching keywords, and provides actionable improvement suggestions.

> **Hackathon Submission:** Built for the Gappy AI / Lemma Hackathon.

## ✨ Features
- **AI Resume Tailoring:** Completely re-writes and optimizes your resume based on a specific job description.
- **ATS Analysis:** Provides a predicted ATS score and keyword match percentage.
- **Skill Gap Identification:** Highlights missing skills and missing keywords so you know exactly what to learn or add.
- **Beautiful UI:** Built with Tailwind CSS, Framer Motion, and a premium Glassmorphism aesthetic.
- **Secure Sessions:** Fully client-side state management ensuring privacy and speed.
- **History Tracking:** Automatically saves tailored resumes to local history.

## 🛠 Tech Stack
- **Frontend Framework:** React 19 + Vite
- **State Management:** Zustand
- **Styling:** Tailwind CSS + Vanilla CSS (Custom tokens)
- **Animations:** Framer Motion + Canvas Confetti
- **Icons:** Lucide React
- **AI Backend:** Lemma API via official `lemma-sdk` (Pod: `tailor_workflow`)

## 📦 Local Development

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   Copy `.env.example` to `.env.local`. Ensure you are logged in via `lemma auth login` — local dev auth is handled automatically.
   ```bash
   cp .env.example .env.local
   ```
4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🚀 Deployment
This application is fully optimized for production deployment on platforms like Lemma, Vercel, or Netlify.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

## 📁 Architecture & File Structure
- `src/components/`: Reusable, atomic UI components (Stats, Pipeline, Modals).
- `src/pages/`: Main application views driven by context (Dashboard, TailorResume, History).
- `src/context/`: Zustand store (`AppContext.jsx`) managing global UI state and persistent history.
- `src/hooks/`: Custom hooks like `useLemmaAPI.js` connecting to the Lemma backend.

## 🔮 Future Improvements
- **Supabase Integration:** Transition from `localStorage` to a fully authenticated Supabase Postgres database.
- **PDF Export:** Native robust PDF generation directly from the optimized markdown.
- **OAuth:** Google/LinkedIn login.

---
*Built with ❤️ for the Gappy AI Hackathon.*
