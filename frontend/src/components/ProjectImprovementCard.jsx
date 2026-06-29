import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ArrowRight, Zap, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'

function ImprovementItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const [applied, setApplied] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-[var(--border)] rounded-xl overflow-hidden mb-2 last:mb-0"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-[var(--bg-2)] transition-colors"
      >
        <div className="flex-1 min-w-0 pr-3">
          <p className="text-xs text-[var(--text-muted)] truncate line-through mb-0.5">{item.originalTitle}</p>
          <div className="flex items-center gap-1.5">
            <ArrowRight size={12} className="text-[var(--primary)] flex-shrink-0" />
            <p className="text-sm font-semibold text-[var(--text)] truncate">{item.betterTitle}</p>
          </div>
        </div>
        <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-[var(--bg-2)] border-t border-[var(--border)]"
          >
            <div className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)] mb-1">ATS Optimized Description</p>
                <p className="text-xs text-[var(--text)] leading-relaxed">{item.atsDescription}</p>
              </div>
              
              {item.impact && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)] mb-1">Business Impact</p>
                  <p className="text-xs text-[var(--text-2)] leading-relaxed italic border-l-2 border-[var(--primary)] pl-2">{item.impact}</p>
                </div>
              )}

              <button
                onClick={() => {
                  setApplied(true)
                  toast.success('Applied project improvement!')
                }}
                disabled={applied}
                className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all ${
                  applied ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 cursor-not-allowed' : 'btn-primary'
                }`}
              >
                {applied ? <><Check size={14}/> Applied</> : <><Zap size={14}/> Apply to Resume</>}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ProjectImprovementCard() {
  const { atsScore, projectImprovements } = useAppStore()
  const hasData = atsScore !== null

  return (
    <div className="saas-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--text)]">Project Improvements</h4>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {!hasData ? (
          <p className="text-xs text-[var(--text-muted)] italic text-center py-4">
            Run tailored generation to see project improvements.
          </p>
        ) : (!projectImprovements || projectImprovements.length === 0) ? (
          <p className="text-xs text-[var(--text-muted)] italic text-center py-4">
            No specific project improvements suggested.
          </p>
        ) : (
          projectImprovements.map((item, i) => (
            <ImprovementItem key={i} item={item} index={i} />
          ))
        )}
      </div>
    </div>
  )
}
