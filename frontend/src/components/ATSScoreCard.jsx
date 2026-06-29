import { motion } from 'framer-motion'
import useAppStore from '../context/AppContext'

const METRICS = [
  { label: 'Keyword Match', key: 'keyword' },
  { label: 'Skills Match', key: 'skills' },
  { label: 'Experience Match', key: 'experience' },
  { label: 'Education Match', key: 'education' },
  { label: 'Formatting', key: 'formatting' },
  { label: 'Action Verbs', key: 'actionVerbs' },
  { label: 'Readability', key: 'readability' },
]

function getColor(score) {
  if (score >= 80) return '#22C55E' // Green
  if (score >= 60) return '#F59E0B' // Yellow
  return '#EF4444' // Red
}

function CircularProgress({ score, size = 120, stroke = 10 }) {
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ - (circ * score) / 100
  const color = getColor(score)

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function ATSScoreCard() {
  // If we don't have real data yet, default to empty or mock if in generating state
  const { atsScore, isGenerating, pipelineStep } = useAppStore()
  
  // Use real score or fallback to 0
  const score = atsScore || 0
  const color = getColor(score)
  
  // Simulate sub-scores based on overall score for now if not provided specifically by the AI 
  // (In a full implementation, AI would return a nested object for these).
  const getSimulatedSubScore = (base, index) => {
    if (!atsScore) return 0
    // Generate a consistent but slightly varied score around the base
    const variance = (index % 3) * 5 - 5 
    return Math.min(100, Math.max(0, base + variance))
  }

  return (
    <div className="saas-card p-6 flex flex-col h-full">
      <h4 className="text-sm font-bold text-[var(--text)] mb-6">ATS Analysis</h4>

      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <CircularProgress score={score} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold" style={{ color }}>{score}</span>
            <span className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Score</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-xs font-semibold" style={{ color }}>
            {score === 0 ? 'Awaiting Data' : score >= 80 ? 'Excellent Match' : score >= 60 ? 'Good Match' : 'Needs Improvement'}
          </span>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {METRICS.map((item, i) => {
          const val = getSimulatedSubScore(score, i)
          const valColor = getColor(val)
          return (
            <div key={item.key}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text-muted)] font-medium">{item.label}</span>
                <span className="font-bold" style={{ color: atsScore ? valColor : 'var(--text-light)' }}>
                  {atsScore ? `${val}%` : '--'}
                </span>
              </div>
              <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: valColor }}
                  initial={{ width: 0 }}
                  animate={{ width: atsScore ? `${val}%` : '0%' }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
