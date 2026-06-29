import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, PlusCircle, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import useAppStore from '../context/AppContext'

function KeywordChip({ keyword, type, delay }) {
  const config = {
    matched: { color: 'badge-green', icon: CheckCircle2, iconColor: 'text-green-500' },
    missing: { color: 'badge-red', icon: XCircle, iconColor: 'text-red-400' },
    suggested: { color: 'badge-blue', icon: PlusCircle, iconColor: 'text-blue-400' },
  }[type]
  const Icon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
      className="group relative flex items-center"
    >
      <div className={`badge ${config.color} flex items-center gap-1.5 cursor-default transition-all duration-200 group-hover:pr-7`}>
        <Icon size={10} className={config.iconColor} />
        {keyword}
        
        {type !== 'matched' && (
          <button 
            onClick={() => toast.success(`Inserted "${keyword}" into suggestions`)}
            className="absolute right-1 opacity-0 group-hover:opacity-100 hover:bg-white/40 dark:hover:bg-black/20 p-0.5 rounded transition-all"
            title="Insert into Resume"
          >
            <Plus size={10} className={config.iconColor} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function KeywordMatchCard() {
  const { keywords, atsScore } = useAppStore()
  const [activeTab, setActiveTab] = useState('matched')

  const hasData = atsScore !== null
  
  // Provide empty arrays if not yet loaded
  const matchedList = keywords?.matched || []
  const missingList = keywords?.missing || []
  const suggestedList = keywords?.suggested || []

  const tabs = [
    { id: 'matched', label: 'Matched', count: matchedList.length, color: 'text-green-500' },
    { id: 'missing', label: 'Missing', count: missingList.length, color: 'text-red-400' },
    { id: 'suggested', label: 'Suggested', count: suggestedList.length, color: 'text-blue-400' },
  ]

  const activeKeywords = {
    matched: matchedList,
    missing: missingList,
    suggested: suggestedList,
  }[activeTab]

  return (
    <div className="saas-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--text)]">Keyword Match</h4>
        {hasData && <span className="text-xs font-bold text-[var(--primary)]">{Math.round((matchedList.length / Math.max(1, matchedList.length + missingList.length)) * 100)}% Match</span>}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-[var(--bg-2)] p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs font-semibold py-1.5 px-1 md:px-2 rounded-lg transition-all
              ${activeTab === tab.id ? 'bg-[var(--surface)] shadow-sm text-[var(--text)]' : 'text-[var(--text-muted)] hover:text-[var(--text-2)]'}`}
          >
            {tab.label} <span className={tab.color}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex-1 min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 w-full">
            {!hasData ? (
              <p className="text-xs text-[var(--text-muted)] italic py-2 w-full text-center">Run tailored generation to see keywords.</p>
            ) : activeKeywords.length > 0 ? (
              activeKeywords.map((kw, i) => (
                <KeywordChip key={`${kw}-${i}`} keyword={kw} type={activeTab} delay={i * 0.03} />
              ))
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic py-2 w-full text-center">
                No {activeTab} keywords found.
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
