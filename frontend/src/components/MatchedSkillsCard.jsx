import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, PlusCircle, Info } from 'lucide-react'
import useAppStore from '../context/AppContext'

const MISSING = ['Docker', 'Kubernetes', 'CI/CD', 'TypeScript', 'System Design']
const RECOMMENDED = ['GraphQL', 'Redis', 'Kafka', 'Jenkins']

function SkillChip({ skill, type, delay }) {
  const [tooltip, setTooltip] = useState(false)
  const config = {
    matched: { color: 'badge-green', icon: CheckCircle2, iconColor: 'text-green-500', desc: 'Found in your resume — great match!' },
    missing: { color: 'badge-red', icon: XCircle, iconColor: 'text-red-400', desc: 'Not found in your resume — consider adding.' },
    recommended: { color: 'badge-blue', icon: PlusCircle, iconColor: 'text-blue-400', desc: 'Commonly requested — optional but helpful.' },
  }[type]
  const Icon = config.icon

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.2 }}
    >
      <button
        onClick={() => setTooltip(!tooltip)}
        className={`badge ${config.color} flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity`}
      >
        <Icon size={10} className={config.iconColor} />
        {skill}
      </button>
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-xl p-3 z-50"
          >
            <div className="flex items-start gap-2">
              <Info size={12} className="text-[var(--text-muted)] mt-0.5 flex-shrink-0" />
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">{config.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function MatchedSkillsCard() {
  const { matchedSkills } = useAppStore()
  const [activeTab, setActiveTab] = useState('matched')

  const tabs = [
    { id: 'matched', label: 'Matched', count: matchedSkills.length, color: 'text-green-500' },
    { id: 'missing', label: 'Missing', count: MISSING.length, color: 'text-red-400' },
    { id: 'recommended', label: 'Recommended', count: RECOMMENDED.length, color: 'text-blue-400' },
  ]

  const skills = {
    matched: matchedSkills,
    missing: MISSING,
    recommended: RECOMMENDED,
  }[activeTab]

  return (
    <div className="saas-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-bold text-[var(--text)]">Skills Analysis</h4>
        <button className="text-xs font-semibold text-[var(--primary)] hover:underline">View All</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-[var(--bg-2)] p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all
              ${activeTab === tab.id ? 'bg-[var(--surface)] shadow-sm text-[var(--text)]' : 'text-[var(--text-muted)]'}`}
          >
            {tab.label} <span className={tab.color}>({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Chips */}
      <div className="flex flex-wrap gap-2 min-h-16">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap gap-2 w-full">
            {skills.length > 0 ? skills.map((skill, i) => (
              <SkillChip key={skill} skill={skill} type={activeTab} delay={i * 0.04} />
            )) : (
              <p className="text-xs text-[var(--text-muted)] italic">
                {activeTab === 'matched' ? 'Generate a tailored resume to see matched skills.' : 'No skills found.'}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
