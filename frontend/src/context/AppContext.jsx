import { create } from 'zustand'

// Safe localStorage accessor
const ls = {
  get: (key, fallback = '') => {
    try { return localStorage.getItem(key) ?? fallback } catch { return fallback }
  },
  set: (key, value) => {
    try { localStorage.setItem(key, value) } catch {}
  },
  remove: (key) => {
    try { localStorage.removeItem(key) } catch {}
  },
  getJSON: (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
  },
  setJSON: (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
  },
}

// Blank session data
const BLANK_SESSION = {
  baseResume: '',
  uploadedFile: null,
  jobDescription: '',
  isGenerating: false,
  pipelineStep: -1,
  error: '',
  tailoredResume: '',
  atsScore: null,
  keywordMatchPercentage: 0,
  jdAnalysis: null,
  keywords: { matched: [], missing: [], suggested: [] },
  skillGap: { found: [], missing: [], certifications: [], projects: [] },
  strengths: [],
  weaknesses: [],
  improvementSuggestions: [],
  projectImprovements: [],
  coverLetter: '',
  interviewPrep: null,
  explanationOfChanges: '',
}

const useAppStore = create((set, get) => ({
  // Theme
  theme: ls.get('theme', 'light'),
  setTheme: (theme) => {
    ls.set('theme', theme)
    set({ theme })
  },

  // Navigation
  activeTab: 'Tailor Resume',
  setActiveTab: (tab) => set({ activeTab: tab }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  // ── Session key — changing this forces a full React remount of TailorResumePage
  sessionKey: ls.get('sessionKey', crypto.randomUUID()),

  // ── Confirmation dialog state
  showNewResumeDialog: false,
  setShowNewResumeDialog: (v) => set({ showNewResumeDialog: v }),

  // Resume inputs
  baseResume: ls.get('baseResume', ''),
  setBaseResume: (text) => { ls.set('baseResume', text); set({ baseResume: text }) },
  uploadedFile: null,
  setUploadedFile: (file) => set({ uploadedFile: file }),
  jobDescription: ls.get('jobDescription', ''),
  setJobDescription: (text) => { ls.set('jobDescription', text); set({ jobDescription: text }) },

  // Generation state
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  pipelineStep: -1,
  setPipelineStep: (step) => set({ pipelineStep: step }),
  error: '',
  setError: (err) => set({ error: err }),

  // Data from AI (JSON)
  tailoredResume: '',
  atsScore: null,
  keywordMatchPercentage: 0,
  jdAnalysis: null,
  keywords: { matched: [], missing: [], suggested: [] },
  skillGap: { found: [], missing: [], certifications: [], projects: [] },
  strengths: [],
  weaknesses: [],
  improvementSuggestions: [],
  projectImprovements: [],
  coverLetter: '',
  interviewPrep: null,
  explanationOfChanges: '',

  setAiData: (data) => set({
    tailoredResume: data.tailoredResume || '',
    atsScore: data.atsScore || null,
    keywordMatchPercentage: data.keywordMatchPercentage || 0,
    jdAnalysis: data.jdAnalysis || null,
    keywords: data.keywords || { matched: [], missing: [], suggested: [] },
    skillGap: data.skillGap || { found: [], missing: [], certifications: [], projects: [] },
    strengths: data.strengths || [],
    weaknesses: data.weaknesses || [],
    improvementSuggestions: data.improvementSuggestions || [],
    projectImprovements: data.projectImprovements || [],
    coverLetter: data.coverLetter || '',
    interviewPrep: data.interviewPrep || null,
    explanationOfChanges: data.explanationOfChanges || '',
  }),

  // Resume history (localStorage)
  history: ls.getJSON('resumeHistory', []),
  addToHistory: (entry) => {
    const updated = [entry, ...get().history].slice(0, 20)
    ls.setJSON('resumeHistory', updated)
    set({ history: updated })
  },
  clearHistory: () => {
    ls.setJSON('resumeHistory', [])
    set({ history: [] })
  },

  // ── Detect if current session has unsaved work
  hasUnsavedWork: () => {
    const { baseResume, jobDescription, tailoredResume } = get()
    return !!(baseResume.trim() || jobDescription.trim() || tailoredResume)
  },

  // ── Request new session — show dialog if unsaved, otherwise create immediately
  requestNewSession: () => {
    const { hasUnsavedWork } = get()
    if (hasUnsavedWork()) {
      set({ showNewResumeDialog: true })
    } else {
      get().createNewSession()
    }
  },

  // ── Actually create a fresh session, rotating the sessionKey so React unmounts TailorResumePage
  createNewSession: () => {
    const newKey = crypto.randomUUID()
    ls.set('baseResume', '')
    ls.set('jobDescription', '')
    ls.set('sessionKey', newKey)
    set({
      sessionKey: newKey,
      activeTab: 'Tailor Resume',
      showNewResumeDialog: false,
      ...BLANK_SESSION,
    })
  },

  // ── Legacy alias used by Dashboard hero / quick actions
  resetResumeState: () => {
    get().requestNewSession()
  },
}))

export default useAppStore
