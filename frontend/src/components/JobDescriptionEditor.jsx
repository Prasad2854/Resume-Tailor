import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, Trash2, Type } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'
import { useAutoSave } from '../hooks/useAutoSave'

export default function JobDescriptionEditor() {
  const { jobDescription, setJobDescription } = useAppStore()
  const textareaRef = useRef(null)
  useAutoSave(jobDescription, 'jobDescription', 2000)

  const wordCount = jobDescription.trim() ? jobDescription.trim().split(/\s+/).length : 0
  const charCount = jobDescription.length

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setJobDescription(text)
      toast.success('Pasted from clipboard!')
    } catch {
      toast.error('Could not access clipboard.')
    }
  }

  const autoResize = () => {
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <motion.button onClick={handlePaste} className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg" whileTap={{ scale: 0.95 }}>
          <Clipboard size={13} />Paste
        </motion.button>
        <motion.button
          onClick={() => { setJobDescription(''); toast('Cleared!', { icon: '🗑️' }) }}
          className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5 rounded-lg text-[var(--danger)]"
          whileTap={{ scale: 0.95 }}
        >
          <Trash2 size={13} />Clear
        </motion.button>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Type size={12} />
          <span>{wordCount} words · {charCount} chars</span>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        className="saas-input resize-none leading-relaxed"
        style={{ minHeight: '220px' }}
        placeholder="Paste the job description here...&#10;&#10;Include the full job posting for best results — responsibilities, requirements, and preferred skills all help the AI optimize your resume."
        value={jobDescription}
        onChange={(e) => { setJobDescription(e.target.value); autoResize() }}
      />

      {charCount > 0 && (
        <div className="h-1 bg-[var(--border)] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
            animate={{ width: `${Math.min((charCount / 3000) * 100, 100)}%` }}
          />
        </div>
      )}
    </div>
  )
}
