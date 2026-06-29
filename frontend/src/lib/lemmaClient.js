import { LemmaClient } from 'lemma-sdk'

/**
 * Shared Lemma client for this app.
 * Production (lemma.work): host injects window.__LEMMA_CONFIG__; auth uses
 * cookie sessions with SuperTokens automatic refresh — no bearer token in the bundle.
 * Local dev: vite lemma-dev-auth plugin seeds localStorage["lemma_token"] via CLI.
 */
export const lemmaClient = new LemmaClient({
  apiUrl: import.meta.env.VITE_LEMMA_API_URL || import.meta.env.VITE_LEMMA_API_BASE || 'https://api.lemma.work',
  authUrl: import.meta.env.VITE_LEMMA_AUTH_URL || 'https://lemma.work/auth',
  podId: import.meta.env.VITE_LEMMA_POD_ID,
})

export const LEMMA_WORKFLOW = import.meta.env.VITE_LEMMA_WORKFLOW_NAME || 'tailor_workflow'
