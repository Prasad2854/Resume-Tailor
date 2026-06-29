# Resume Tailor

Resume Tailor is an AI-assisted resume tailoring experience built for the Gappy AI / Lemma hackathon. The project combines a modern React frontend with a resume-tailor workflow pod to help users upload a resume, analyze a job description, and generate an ATS-friendly tailored resume.

## Live Demo

Open the deployed app here: https://resumint.apps.lemma.work/

## Project Structure

- frontend/: Vite + React application for the user experience
- resume-tailor-pod/: workflow, agent, and table definitions for resume tailoring

## Key Features

- Resume upload and preview
- Job description analysis
- AI-powered resume tailoring
- ATS score and keyword-match insights
- History and workflow pipeline experience

## Getting Started

1. Open the frontend app:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Follow the frontend setup instructions in [frontend/README.md](frontend/README.md) for any Lemma API authentication steps.

## Notes

- The frontend is built with React 19, Vite, Tailwind CSS, and Framer Motion.
- The resume-tailoring workflow is defined in the resume-tailor-pod folder.

## License

See the license files in the frontend project for usage details.
