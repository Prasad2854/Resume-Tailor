import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, ClipboardList, Search, Brain, 
  Sparkles, ShieldCheck, CircleCheck, AlertCircle, Loader2, Zap
} from 'lucide-react'
import confetti from 'canvas-confetti'
import useAppStore from '../context/AppContext'

const STEPS = [
  { label: 'Parse Resume', sub: 'Reading structure', icon: Upload, desc: 'Parsing your original resume file...' },
  { label: 'Analyze Job', sub: 'Extracting reqs', icon: ClipboardList, desc: 'Analyzing the provided job description...' },
  { label: 'Keyword Match', sub: 'ATS scoring', icon: Search, desc: 'Comparing extracted ATS keywords...' },
  { label: 'Skill Gap', sub: 'Identifying gaps', icon: Brain, desc: 'Evaluating missing skills and matches...' },
  { label: 'Optimization', sub: 'Enhancing content', icon: Sparkles, desc: 'Optimizing experience for ATS systems...' },
  { label: 'Verification', sub: 'Quality checks', icon: ShieldCheck, desc: 'Verifying final parsing compatibility...' },
  { label: 'Completed', sub: 'Ready to use', icon: CircleCheck, desc: 'Resume successfully tailored! ✨' }
]

export default function WorkflowPipeline({ activeStep: backendStep }) {
  const { isGenerating, error, baseResume, keywords, skillGap } = useAppStore()
  
  const hasResume = !!baseResume

  const [visualStep, setVisualStep] = useState(0)
  const [fastForward, setFastForward] = useState(false)
  const [progressPct, setProgressPct] = useState(0)
  const [hasConfettid, setHasConfettid] = useState(false)

  // Reset logic
  useEffect(() => {
    if (!hasResume && !isGenerating) {
      setVisualStep(0)
      setFastForward(false)
      setProgressPct(0)
      setHasConfettid(false)
    }
  }, [hasResume, isGenerating])

  // Sync internal state with backend start/stop
  useEffect(() => {
    if (isGenerating && visualStep === 0) {
      setVisualStep(1)
      setFastForward(false)
      setHasConfettid(false)
    }

    if (backendStep === 8) {
      if (visualStep < 6) {
        setFastForward(true)
      } else {
        setVisualStep(6)
      }
    }
  }, [backendStep, isGenerating, visualStep])

  // Animation Loop
  useEffect(() => {
    if (!isGenerating && !fastForward) return
    if (visualStep >= 6) return
    if (error) return

    const delay = fastForward ? 150 : 800
    const timer = setTimeout(() => {
      setVisualStep(prev => {
        if (!fastForward && prev >= 5) return prev // Pause at step 5 if backend is still generating
        return prev + 1
      })
    }, delay)

    return () => clearTimeout(timer)
  }, [visualStep, isGenerating, fastForward, error])

  // Smooth Progress & Confetti
  useEffect(() => {
    if (visualStep === 0) {
      setProgressPct(hasResume ? 15 : 0)
    } else if (visualStep > 0 && visualStep < 6) {
      setProgressPct(Math.min(15 + visualStep * 15, 95))
    } else if (visualStep === 6) {
      setProgressPct(100)
      if (!hasConfettid) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#5B5FEF', '#22C55E', '#4F8CFF', '#F59E0B']
        })
        setHasConfettid(true)
        setFastForward(false)
      }
    }
  }, [visualStep, hasResume, hasConfettid])

  // Calculate ETA
  const remainingSteps = 6 - visualStep
  const etaSeconds = fastForward ? 0 : Math.max(1, remainingSteps * 0.8).toFixed(1)

  return (
    <div className="saas-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-2)]/50 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
          <Zap size={16} className="text-yellow-500 fill-yellow-500" /> AI Agent Workflow
        </h3>
        {visualStep === 6 ? (
          <span className="badge bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
            ✓ Complete
          </span>
        ) : isGenerating ? (
          <span className="badge badge-purple animate-pulse">
            Processing...
          </span>
        ) : (
          <span className="badge badge-gray text-xs">
            Ready
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Desktop: horizontal */}
        <div className="hidden lg:flex items-start justify-between relative mb-8 mt-2">
          {STEPS.map((step, i) => {
            const isCompleted = i < visualStep
            const isActive = i === visualStep
            const isError = error && isActive
            const Icon = step.icon

            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 relative z-10">
                {/* Connector Line to Next */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[50%] right-[-50%] top-[14px] h-[3px] bg-[var(--border)] -z-10 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-green-500 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: fastForward ? 0.15 : 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}

                {/* Step Circle */}
                <motion.div
                  animate={
                    isActive && !isError ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0px var(--primary)', '0 0 20px var(--primary)', '0 0 0px var(--primary)'] } :
                    isCompleted ? { scale: [0.8, 1.2, 1] } :
                    { scale: 1 }
                  }
                  transition={
                    isActive && !isError ? { repeat: Infinity, duration: 1.5 } : 
                    isCompleted ? { duration: 0.4, type: 'spring' } : {}
                  }
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isError ? 'bg-red-500 text-white border-2 border-red-500' :
                    isCompleted ? 'bg-green-500 text-white border-2 border-green-500' :
                    isActive ? 'bg-[var(--primary)] text-white border-2 border-[var(--primary)]' :
                    'bg-[var(--surface)] text-[var(--text-muted)] border-2 border-[var(--border)]'
                  }`}
                >
                  {isError ? <AlertCircle size={14} /> : 
                   isCompleted ? <CheckIcon /> : 
                   isActive && i > 0 && i < 6 ? <Loader2 size={14} className="animate-spin" /> : 
                   <Icon size={14} />}
                </motion.div>

                {/* Step Label & Subtitle */}
                <div className="flex flex-col items-center mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider leading-tight text-center whitespace-nowrap transition-colors ${
                    isError ? 'text-red-500' :
                    isActive ? 'text-[var(--primary)]' : 
                    isCompleted ? 'text-[var(--text)]' : 
                    'text-[var(--text-light)] opacity-60'
                  }`}>
                    {step.label}
                  </span>
                  <span className={`text-[9px] font-medium tracking-wide text-center whitespace-nowrap transition-colors mt-0.5 ${
                    isError ? 'text-red-400 opacity-80' :
                    isActive ? 'text-[var(--primary)] opacity-80' : 
                    isCompleted ? 'text-[var(--text-muted)]' : 
                    'text-[var(--text-light)] opacity-40'
                  }`}>
                    {step.sub}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical list */}
        <div className="lg:hidden space-y-3 mb-6">
          {STEPS.map((step, i) => {
            const isCompleted = i < visualStep
            const isActive = i === visualStep
            const isError = error && isActive
            const Icon = step.icon

            return (
              <div key={i} className="relative flex items-start gap-4">
                {/* Vertical Connector */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[15px] top-[30px] bottom-[-15px] w-[2px] bg-[var(--border)] -z-10 overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-green-500 origin-top"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isCompleted ? 1 : 0 }}
                      transition={{ duration: fastForward ? 0.15 : 0.4, ease: "easeOut" }}
                    />
                  </div>
                )}
                
                <motion.div
                  animate={isActive && !isError ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={isActive && !isError ? { repeat: Infinity, duration: 1.5 } : {}}
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                    isError ? 'bg-red-500 text-white' :
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-[var(--primary)] text-white shadow-[0_0_15px_var(--primary-light)]' :
                    'bg-[var(--surface)] text-[var(--text-muted)] border-2 border-[var(--border)]'
                  }`}
                >
                  {isError ? <AlertCircle size={14} /> : 
                   isCompleted ? <CheckIcon /> : 
                   <Icon size={14} />}
                </motion.div>
                
                <div className={`flex-1 pt-1 ${isActive ? '' : 'opacity-70'}`}>
                  <h4 className={`text-sm font-bold ${isError ? 'text-red-500' : isActive ? 'text-[var(--primary)]' : 'text-[var(--text)]'}`}>
                    {step.label}
                  </h4>
                  <span className={`text-[10px] font-medium tracking-wide uppercase block mb-1 ${isError ? 'text-red-400' : isActive ? 'text-[var(--primary)] opacity-80' : 'text-[var(--text-muted)]'}`}>
                    {step.sub}
                  </span>
                  {isActive && !isError && (
                    <p className="text-xs text-[var(--text-muted)] animate-pulse">{step.desc}</p>
                  )}
                </div>
                {isActive && !isError && i > 0 && i < 6 && (
                  <Loader2 size={16} className="animate-spin text-[var(--primary)] mt-1" />
                )}
              </div>
            )
          })}
        </div>

        {/* Current Step Panel */}
        <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
                {error ? 'Workflow Error' : visualStep === 6 ? 'Workflow Complete' : 'Current Step'}
              </p>
              <h4 className={`text-sm md:text-base font-bold mb-1 ${error ? 'text-red-500' : 'text-[var(--text)]'}`}>
                {error ? error : STEPS[visualStep]?.desc}
              </h4>
              {/* Dynamic Insights */}
              {!error && visualStep > 1 && (
                <p className="text-xs text-[var(--primary)]/80 font-medium">
                  {visualStep === 2 && 'Scanning job requirements...'}
                  {visualStep === 3 && keywords?.matched?.length > 0 && `Identified ${keywords.matched.length} matching ATS keywords.`}
                  {visualStep === 4 && skillGap?.missing?.length > 0 && `Discovered ${skillGap.missing.length} skill gaps.`}
                  {visualStep === 5 && 'Applying tailored enhancements...'}
                  {visualStep === 6 && 'Tailored resume generated.'}
                </p>
              )}
            </div>

            {/* Progress & ETA */}
            {visualStep >= 0 && visualStep < 6 && !error && (
              <div className="md:text-right min-w-[120px]">
                <div className="flex items-end md:justify-end gap-2 mb-1">
                  <span className="text-2xl font-black text-[var(--primary)] leading-none">{Math.round(progressPct)}%</span>
                </div>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Est. {etaSeconds}s remaining
                </p>
              </div>
            )}
            
            {visualStep === 6 && (
              <div className="md:text-right">
                <span className="text-xl font-black text-green-500">100%</span>
                <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Finished
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-[var(--border)] rounded-full mt-4 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${error ? 'bg-red-500' : visualStep === 6 ? 'bg-green-500' : 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
