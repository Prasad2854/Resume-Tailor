import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Copy, Printer, Maximize2, RotateCcw, Check, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'

function ToolbarBtn({ icon: Icon, label, onClick, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      title={label}
      className="btn-ghost p-2 rounded-lg flex items-center gap-1.5 text-xs font-medium disabled:opacity-40"
    >
      <Icon size={14} />
      <span className="hidden lg:inline">{label}</span>
    </motion.button>
  )
}

export default function ResumePreview() {
  const { tailoredResume, isGenerating, history } = useAppStore()
  const [copied, setCopied] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(tailoredResume)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([tailoredResume], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `tailored_resume_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    toast.success('Download started!')
  }

  const handlePrint = () => window.print()

  const preview = (
    <div className="flex-1 overflow-y-auto bg-[var(--bg-2)] p-4">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center gap-5">
            <div className="flex gap-1.5">
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-2.5 h-2.5 bg-[var(--primary)] rounded-full"
                  animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
              ))}
            </div>
            <p className="text-sm text-[var(--text-muted)] font-medium text-center">
              Lemma AI is crafting<br />your tailored resume…
            </p>
          </motion.div>
        ) : tailoredResume ? (
          <motion.div key="result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[var(--surface)] rounded-xl shadow-sm border border-[var(--border)] p-8 min-h-full font-serif text-sm leading-relaxed text-[var(--text)] whitespace-pre-wrap">
            {tailoredResume}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="h-full flex flex-col items-center justify-center gap-4 text-center p-8">
            <div className="w-20 h-24 bg-[var(--surface)] border-2 border-[var(--border)] rounded-lg shadow-sm relative overflow-hidden mx-auto">
              {[4, 6, 10, 12, 16].map(top => (
                <div key={top} className="absolute h-1.5 bg-[var(--border)] rounded" style={{ top, left: 8, right: top % 4 === 0 ? 16 : 8 }} />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={24} className="text-[var(--border)]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-2)]">Your tailored resume will appear here</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Paste your resume + job description, then click Tailor My Resume</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const card = (
    <div className={`saas-card flex flex-col overflow-hidden ${fullscreen ? 'fixed inset-4 z-50' : 'sticky top-8 h-[calc(100vh-8rem)]'}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-sm rounded-t-[19px] flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-[var(--text)]">Tailored Resume</h3>
          {tailoredResume && <span className="badge badge-green">ATS Optimized ✓</span>}
        </div>
        <div className="flex items-center gap-0.5">
          <ToolbarBtn icon={copied ? Check : Copy} label={copied ? 'Copied!' : 'Copy'} onClick={handleCopy} disabled={!tailoredResume} />
          <ToolbarBtn icon={Download} label="Download" onClick={handleDownload} disabled={!tailoredResume} />
          <ToolbarBtn icon={Printer} label="Print" onClick={handlePrint} disabled={!tailoredResume} />
          <ToolbarBtn icon={Maximize2} label="Fullscreen" onClick={() => setFullscreen(!fullscreen)} disabled={!tailoredResume} />
        </div>
      </div>

      {preview}

      {/* History */}
      {history.length > 0 && (
        <div className="px-4 py-3 border-t border-[var(--border)] flex-shrink-0">
          <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Recent Versions</p>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {history.slice(0, 3).map((h, i) => (
              <div key={h.id} className="text-xs text-[var(--text-muted)] truncate flex items-center gap-2">
                <RotateCcw size={10} />
                <span>v{history.length - i} — {new Date(h.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {card}
      {fullscreen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setFullscreen(false)} />}
    </>
  )
}
