import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, AlertCircle, Lightbulb, ChevronDown, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

const SUGGESTIONS = [
  {
    category: 'critical',
    title: 'Add Quantified Achievements',
    explanation: 'Recruiters and ATS systems look for measurable impact. Numbers make your experience stand out.',
    example: 'Instead of "Improved API performance", write "Improved API response time by 40%, handling 10K+ req/s"',
  },
  {
    category: 'critical',
    title: 'Include Missing Keywords',
    explanation: 'Your resume is missing several keywords from the job description that ATS will scan for.',
    example: 'Add: microservices, CI/CD, Docker, distributed systems',
  },
  {
    category: 'important',
    title: 'Strengthen Project Descriptions',
    explanation: 'Project descriptions should highlight impact and technical depth, not just tasks.',
    example: 'Add business outcomes: "Built RESTful API reducing mobile load time by 60%"',
  },
  {
    category: 'important',
    title: 'Optimize Summary Section',
    explanation: 'Your summary should be tailored to this specific role. Generic summaries are skipped.',
    example: 'Mention the company name and specific skills they asked for.',
  },
  {
    category: 'optional',
    title: 'Add AWS Certifications',
    explanation: 'The JD mentions cloud experience. Certifications give you an edge over other candidates.',
    example: 'AWS Solutions Architect, AWS Developer Associate',
  },
]

const CATEGORY_CONFIG = {
  critical: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20', badge: 'badge-red', label: 'Critical' },
  important: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20', badge: 'badge-amber', label: 'Important' },
  optional: { icon: Lightbulb, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', badge: 'badge-blue', label: 'Optional' },
}

function SuggestionItem({ item, index }) {
  const [open, setOpen] = useState(false)
  const cfg = CATEGORY_CONFIG[item.category]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="border border-[var(--border)] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 p-3 text-left hover:bg-[var(--bg-2)] transition-colors ${open ? cfg.bg : ''}`}
      >
        <Icon size={15} className={cfg.color + ' flex-shrink-0'} />
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">{item.title}</span>
        <span className={`badge ${cfg.badge} mr-1`}>{cfg.label}</span>
        <ChevronDown size={14} className={`text-[var(--text-muted)] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] space-y-3">
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{item.explanation}</p>
              <div className="bg-[var(--bg-2)] rounded-lg px-3 py-2">
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-1">Example</p>
                <p className="text-xs text-[var(--text-2)] leading-relaxed italic">{item.example}</p>
              </div>
              <button
                onClick={() => toast.success('Applied suggestion!')}
                className="btn-primary flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
              >
                <Zap size={11} /> Apply Suggestion
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AISuggestionsCard() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? SUGGESTIONS : SUGGESTIONS.filter(s => s.category === filter)

  return (
    <div className="saas-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--text)]">AI Suggestions</h4>
        <button className="text-xs font-semibold text-[var(--primary)] hover:underline">View All</button>
      </div>

      <div className="flex gap-1 mb-4 flex-wrap">
        {['all', 'critical', 'important', 'optional'].map(f => (
          <button key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-all capitalize
              ${filter === f ? 'bg-[var(--primary)] text-white shadow-sm' : 'bg-[var(--bg-2)] text-[var(--text-muted)] hover:bg-[var(--border)]'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((item, i) => <SuggestionItem key={item.title} item={item} index={i} />)}
      </div>
    </div>
  )
}
