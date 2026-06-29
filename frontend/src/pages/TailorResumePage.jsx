import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, AlertCircle, Columns, Maximize } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'
import { runTailorWorkflow } from '../hooks/useLemmaAPI'
import ResumeUploader from '../components/ResumeUploader'
import JobDescriptionEditor from '../components/JobDescriptionEditor'
import WorkflowPipeline from '../components/WorkflowPipeline'
import ResumePreview from '../components/ResumePreview'
import ATSScoreCard from '../components/ATSScoreCard'
import KeywordMatchCard from '../components/KeywordMatchCard'
import SkillGapCard from '../components/SkillGapCard'
import ProjectImprovementCard from '../components/ProjectImprovementCard'
import AISuggestionsCard from '../components/AISuggestionsCard'
import { useAutoSave } from '../hooks/useAutoSave'

export default function TailorResumePage() {
  const { baseResume, setBaseResume, jobDescription, isGenerating, error, pipelineStep, tailoredResume } = useAppStore()
  const [localStep, setLocalStep] = useState(-1)
  const [splitScreen, setSplitScreen] = useState(false)
  useAutoSave(baseResume, 'baseResume', 2000)
  useEffect(() => {
    if (!baseResume && !jobDescription) {
      setLocalStep(-1)
      setSplitScreen(false)
    }
  }, [baseResume, jobDescription])

  // Scroll to preview when done
  const previewRef = useRef(null)
  useEffect(() => {
    if (pipelineStep === 8 && previewRef.current) {
      setTimeout(() => {
        previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 1500)
    }
  }, [pipelineStep])

  const wordCount = baseResume.trim() ? baseResume.trim().split(/\s+/).length : 0

  const handleTailor = async () => {
    if (!baseResume.trim() && !jobDescription.trim()) {
      toast.error('Please add your resume and a job description first.')
      return
    }
    if (!baseResume.trim()) { toast.error('Please paste or upload your resume.'); return }
    if (!jobDescription.trim()) { toast.error('Please paste the job description.'); return }

    try {
      await runTailorWorkflow(baseResume, jobDescription, setLocalStep)
    } catch {
      // error is handled inside hook
    }
  }

  const step = pipelineStep !== -1 ? pipelineStep : localStep
  const hasData = tailoredResume !== ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8"
    >
      <div className="flex justify-end mb-4">
        {hasData && (
          <button 
            onClick={() => setSplitScreen(!splitScreen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
              splitScreen ? 'bg-[var(--primary)] text-white border-[var(--primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text)]'
            }`}
          >
            {splitScreen ? <Maximize size={14} /> : <Columns size={14} />}
            {splitScreen ? 'Standard View' : 'Compare Before/After'}
          </button>
        )}
      </div>

      <div className={`grid grid-cols-1 ${splitScreen ? 'xl:grid-cols-2' : 'xl:grid-cols-3'} gap-8`}>

        {/* Left — Inputs / Or Original Resume if split screen */}
        <div className={`space-y-6 ${splitScreen ? 'xl:col-span-1' : 'xl:col-span-2'}`}>

          {!splitScreen ? (
            <>
              {/* Resume Upload */}
              <div className="saas-card p-1 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
                  <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <h3 className="font-bold text-[var(--text)]">Your Resume</h3>
                </div>
                <div className="p-5 space-y-4">
                  <ResumeUploader />
                  <div className="relative">
                    <div className="absolute inset-x-0 -top-2 flex items-center">
                      <div className="flex-1 border-t border-[var(--border)]" />
                      <span className="px-3 text-xs text-[var(--text-muted)] font-medium bg-[var(--surface)]">or paste text</span>
                      <div className="flex-1 border-t border-[var(--border)]" />
                    </div>
                    <textarea
                      className="saas-input resize-none mt-4 leading-relaxed font-mono text-xs"
                      style={{ minHeight: '200px' }}
                      placeholder="Paste your resume text here…"
                      value={baseResume}
                      onChange={e => setBaseResume(e.target.value)}
                    />
                  </div>
                  {wordCount > 0 && (
                    <p className="text-xs text-[var(--text-muted)] text-right">{wordCount} words · {baseResume.length} chars</p>
                  )}
                </div>
              </div>

              {/* Job Description */}
              <div className="saas-card p-1 overflow-hidden">
                <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-2)]/50">
                  <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <h3 className="font-bold text-[var(--text)]">Job Description</h3>
                </div>
                <div className="p-5">
                  <JobDescriptionEditor />
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    className="flex items-start gap-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
                    <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700 dark:text-red-400">Error</p>
                      <p className="text-xs text-red-600 dark:text-red-300 mt-0.5">{error}</p>
                      {error.includes('401') && (
                        <p className="text-xs text-red-500 mt-2">Your Lemma session expired. Refresh the page to sign in again.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CTA Button */}
              <motion.button
                onClick={handleTailor}
                disabled={isGenerating}
                className="btn-primary w-full py-5 text-base font-bold flex items-center justify-center gap-3 shadow-lg shadow-[var(--primary)]/20"
                whileTap={{ scale: 0.98 }}
              >
                {isGenerating ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>✨</motion.span>
                    <span>AI Agent is analyzing and tailoring…</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Tailor My Resume
                  </>
                )}
              </motion.button>

              {/* Workflow Pipeline */}
              <WorkflowPipeline activeStep={step} />

              {/* Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ATSScoreCard />
                <KeywordMatchCard />
                <SkillGapCard />
                <ProjectImprovementCard />
                <div className="md:col-span-2">
                  <AISuggestionsCard />
                </div>
              </div>
            </>
          ) : (
            <div className="saas-card h-[calc(100vh-12rem)] sticky top-8 flex flex-col">
              <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-2)]/50 rounded-t-[19px]">
                <h3 className="text-sm font-bold text-[var(--text)]">Original Resume</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-6 font-serif text-sm leading-relaxed text-[var(--text)] whitespace-pre-wrap bg-[var(--surface)] opacity-70">
                {baseResume || 'No original resume provided.'}
              </div>
            </div>
          )}
        </div>

        {/* Right — Preview */}
        <div className="xl:col-span-1" ref={previewRef}>
          <ResumePreview />
        </div>
      </div>
    </motion.div>
  )
}
