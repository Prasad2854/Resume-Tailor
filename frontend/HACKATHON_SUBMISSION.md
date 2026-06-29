# 🏆 Resumint — Gappy AI (Lemma) Hackathon Submission

## 1. Problem Statement
In today's highly competitive job market, over 75% of resumes are rejected by Applicant Tracking Systems (ATS) before a human ever sees them. Job seekers struggle to manually tailor their resumes for every application, leading to burnout, missed opportunities, and keyword mismatch. Traditional resume builders are static and offer no real-time alignment with the target Job Description (JD).

## 2. Product Description
**Resumint (Fresh Resume Intelligence)** is a premium, AI-powered SaaS application that instantly tailors a base resume to a specific job description. It doesn't just rewrite text; it provides a comprehensive ATS score, identifies critical skill gaps, highlights matching keywords, and provides actionable improvement suggestions—all within a beautifully animated, highly responsive user interface.

## 3. Key Features
- **Intelligent ATS Scoring:** Calculates a predictive ATS compatibility score based on keyword density and layout extraction.
- **Dynamic Skill Gap Analysis:** Explicitly lists matching skills and identifies missing skills required by the JD.
- **AI Workflow Pipeline:** A stunning, animated 7-step pipeline (inspired by GitHub Actions/Stripe) that visually demonstrates the AI agent's thought process (Parsing -> Keyword Matching -> Gap Analysis -> Verification).
- **Session-Based State Management:** Mimics ChatGPT's "New Chat" functionality, allowing users to seamlessly start new tailoring sessions with a single click.
- **Privacy First:** Fully client-side React architecture leveraging local storage for instantaneous load times and user data privacy.

## 4. Lemma SDK Usage
Resumint heavily leverages the **Lemma Platform** to handle the complex AI orchestration. 
- We built a custom Lemma Pod (`tailor_workflow`) that orchestrates multiple LLM calls.
- The React frontend uses the native fetch API to trigger the Lemma Workflow via the `/runs` and `/form` endpoints.
- We utilize Lemma's asynchronous polling to track the workflow's state (`COMPLETED` / `FAILED`), providing real-time UI feedback to the user via our custom `useLemmaAPI` hook.
- The LLM's output is structured in a strict JSON schema defined within the Lemma execution context, ensuring the frontend always receives deterministic, typed data (ATS score, arrays of keywords, suggested improvements).

## 5. Technical Architecture
- **Frontend Framework:** React 19 + Vite (Optimized for SPA routing and Code Splitting).
- **State Management:** Zustand (for global application state and `sessionKey` based remounting).
- **Styling:** Tailwind CSS + Vanilla CSS Variables (Glassmorphism, Dark/Light mode).
- **Animations:** Framer Motion (Orchestrating the 7-step workflow pipeline and page transitions).
- **Parsers:** `pdfjs-dist` (PDF parsing) and `mammoth` (DOCX parsing) running entirely client-side.
- **API Connectivity:** Custom React Hook `useLemmaAPI` interfacing with `api.lemma.work`.

## 6. AI Workflow Explanation
When a user clicks "Tailor Resume", the following happens:
1. **Intake:** The base resume text and JD are sent to the Lemma Workflow.
2. **Extraction:** The AI agent extracts core entities (Experience, Education, Skills) from the resume and hard requirements from the JD.
3. **Diffing:** A comparative analysis identifies exactly what keywords are missing.
4. **Optimization:** The AI rewrites bullet points to include missing keywords *only if* they align with the user's existing experience (preventing hallucination).
5. **Output:** The workflow returns a structured JSON payload to the frontend.

## 7. Challenges Solved
- **UX Latency:** AI generation takes time (10-30 seconds). We solved the "waiting problem" by building an engaging, animated 7-step stepper that gives users real-time insights (e.g., "Identified 5 matching keywords...") while they wait.
- **React Stale State:** Ensuring a perfectly clean workspace when clicking "New Resume" was difficult. We solved this using a `sessionKey` in Zustand that acts as a React `key` to force a complete unmount/remount of the main view.
- **Bundle Size:** Large parsers (PDF.js) were bloating the app. We solved this by implementing Vite `manualChunks` to split the code, resulting in lightning-fast initial page loads.

## 8. Future Scope
- **Supabase Integration:** Moving from local storage to a fully authenticated Supabase backend to allow users to sync history across devices.
- **Native PDF Export:** Rendering the optimized markdown directly into a beautifully formatted, ATS-friendly PDF download.
- **Automated Applying:** Connecting with browser extensions to automatically inject the tailored resume into Greenhouse/Lever application forms.

---

## 🎬 Live Demo Script (2-3 Minutes)

**(0:00 - 0:30) Introduction & Problem**
* "Hi judges, welcome to Resumint. We built this because applying to jobs is broken. Over 75% of resumes are rejected by ATS systems because they lack the exact keywords from the Job Description. Manually tailoring resumes is exhausting. Let me show you how Resumint fixes this."

**(0:30 - 1:15) The Tailoring Process**
* *(Click "New Resume")* "We start with a clean workspace. I'll upload my standard software engineering resume here." *(Upload PDF)*
* "Next, I'll paste in a Job Description for a Senior React Developer role I really want." *(Paste JD)*
* "Now, I just click **Tailor My Resume**."

**(1:15 - 1:45) The AI Agent Workflow**
* "While we wait, you'll see our custom AI Workflow Pipeline. Instead of a boring loading spinner, this pipeline shows exactly what the Lemma AI agent is doing behind the scenes. It's extracting keywords, finding skill gaps, and optimizing the text in real-time. Notice the dynamic insights popping up."

**(1:45 - 2:30) Results & Analysis**
* *(Confetti fires, scroll to results)* "And it's done! On the right, we have a perfectly tailored resume ready to copy or download."
* "But more importantly, look at the analytics on the left. The Lemma API returned a structured JSON payload giving me a predictive ATS Score, a list of exactly which keywords I matched, and the critical skill gaps I need to address."

**(2:30 - 3:00) Conclusion**
* "Every tailored resume is saved locally to my History tab so I can track my applications. Resumint combines the power of Lemma's AI orchestration with a premium, lightning-fast React frontend to help job seekers actually land interviews. Thank you!"
