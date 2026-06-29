import { motion } from 'framer-motion'
import { Clock, Download, Trash2, Copy, FileText, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'

export default function HistoryPage() {
  const { history, clearHistory, setTailoredResume } = useAppStore()

  const handleDownload = (h) => {
    const blob = new Blob([h.full], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tailored_resume_${new Date(h.date).toISOString().slice(0, 10)}.txt`
    a.click()
    toast.success('Download started!')
  }

  const handleCopy = (h) => {
    navigator.clipboard.writeText(h.full)
    toast.success('Copied to clipboard!')
  }
  
  const handleRestore = (h) => {
    setTailoredResume(h.full)
    toast.success('Restored to editor!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text)] mb-2">Resume History</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            View, download, and manage your previously tailored resumes.
          </p>
        </div>
        
        {history.length > 0 && (
          <button 
            onClick={clearHistory} 
            className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="saas-card p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-16 h-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
            <Clock size={28} className="text-[var(--text-light)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-2)]">No history found</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Your generated resumes will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h, i) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="saas-card p-5 flex flex-col md:flex-row md:items-center gap-4 hover:border-[var(--primary-light)] transition-colors"
            >
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText size={20} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="text-sm font-bold text-[var(--text)]">Tailored Resume v{history.length - i}</p>
                  <span className="badge badge-green text-[10px]">85% ATS Match</span>
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate">{h.preview}...</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] text-[var(--text-light)] font-medium">
                  <Clock size={10} />
                  <span>{new Date(h.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0 border-t md:border-t-0 md:border-l border-[var(--border)] pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                <button onClick={() => handleCopy(h)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-2)] hover:bg-[var(--border)] rounded-lg transition-colors" title="Copy">
                  <Copy size={14} />
                </button>
                <button onClick={() => handleDownload(h)} className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--bg-2)] hover:bg-[var(--border)] rounded-lg transition-colors" title="Download">
                  <Download size={14} />
                </button>
                <button onClick={() => handleRestore(h)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[var(--primary)] bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 rounded-lg transition-colors">
                  Restore <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
