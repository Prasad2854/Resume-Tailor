import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Copy, Download, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'

export default function CoverLetterPage() {
  const { coverLetter, atsScore, jdAnalysis } = useAppStore()
  const [copied, setCopied] = useState(false)
  const hasData = atsScore !== null

  const handleCopy = () => {
    if (!coverLetter) return
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!coverLetter) return
    const blob = new Blob([coverLetter], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `cover_letter_${jdAnalysis?.companyName?.replace(/\s+/g, '_') || 'tailored'}.txt`
    a.click()
    toast.success('Download started!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8 flex flex-col h-full max-w-4xl mx-auto"
    >
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--text)] mb-2">Cover Letter</h2>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl">
            AI-generated cover letter highlighting your strengths for {jdAnalysis?.companyName || 'this role'}.
          </p>
        </div>
        
        {hasData && coverLetter && (
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-ghost flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg">
              {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={handleDownload} className="btn-primary flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg">
              <Download size={14} /> Download
            </button>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="saas-card p-12 text-center flex flex-col items-center justify-center min-h-[40vh] flex-1">
          <div className="w-16 h-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
            <FileText size={28} className="text-[var(--text-light)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-2)]">No cover letter available</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Tailor your resume first to generate a cover letter.</p>
        </div>
      ) : (
        <div className="saas-card p-8 md:p-12 flex-1 shadow-xl">
          <div 
            className="w-full h-full font-serif text-sm leading-loose text-[var(--text)] whitespace-pre-wrap outline-none"
            contentEditable
            suppressContentEditableWarning
          >
            {coverLetter || 'No cover letter content was generated.'}
          </div>
        </div>
      )}
    </motion.div>
  )
}
