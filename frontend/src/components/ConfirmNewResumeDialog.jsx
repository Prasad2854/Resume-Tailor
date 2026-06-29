import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, FilePlus, X } from 'lucide-react'
import useAppStore from '../context/AppContext'

export default function ConfirmNewResumeDialog() {
  const { showNewResumeDialog, setShowNewResumeDialog, createNewSession } = useAppStore()

  return (
    <AnimatePresence>
      {showNewResumeDialog && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowNewResumeDialog(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
          >
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl w-full max-w-md pointer-events-auto p-8 relative">
              {/* Close button */}
              <button
                onClick={() => setShowNewResumeDialog(false)}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-2)] hover:text-[var(--text)] transition-colors"
              >
                <X size={16} />
              </button>

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 flex items-center justify-center mb-5">
                <AlertTriangle size={26} className="text-amber-500" />
              </div>

              {/* Text */}
              <h2 className="text-lg font-bold text-[var(--text)] mb-2">Start a new resume?</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                Your current work — including the resume text, job description, and AI analysis — has not been saved to history. Starting a new resume will clear this session.
              </p>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowNewResumeDialog(false)}
                  className="flex-1 py-3 rounded-xl border border-[var(--border)] text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-2)] transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={createNewSession}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-[var(--primary)]/20"
                >
                  <FilePlus size={16} />
                  Create New Resume
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
