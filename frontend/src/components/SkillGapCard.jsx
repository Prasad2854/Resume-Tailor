import { motion } from 'framer-motion'
import { Target, AlertTriangle, Lightbulb, TrendingUp } from 'lucide-react'
import useAppStore from '../context/AppContext'

function GapSection({ title, items, icon: Icon, color, bg }) {
  if (!items || items.length === 0) return null
  
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center gap-2 mb-2">
        <div className={`p-1 rounded-md ${bg}`}>
          <Icon size={12} className={color} />
        </div>
        <h5 className="text-xs font-bold text-[var(--text-2)]">{title}</h5>
      </div>
      <div className="flex flex-wrap gap-1.5 pl-7">
        {items.map((item, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="px-2 py-1 bg-[var(--bg-2)] border border-[var(--border)] rounded-md text-[11px] font-medium text-[var(--text)]"
          >
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

export default function SkillGapCard() {
  const { atsScore, skillGap } = useAppStore()
  const hasData = atsScore !== null
  
  return (
    <div className="saas-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-sm font-bold text-[var(--text)]">Skill Gap Analysis</h4>
        <div className="p-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-blue-500">
          <Target size={14} />
        </div>
      </div>
      
      {!hasData ? (
        <div className="flex-1 flex flex-col items-center justify-center py-4">
          <Target size={24} className="text-[var(--border)] mb-2" />
          <p className="text-xs text-[var(--text-muted)] italic text-center">
            Run tailored generation to identify skill gaps.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          <GapSection 
            title="Missing Core Skills" 
            items={skillGap?.missing} 
            icon={AlertTriangle} 
            color="text-red-500" bg="bg-red-50 dark:bg-red-950/20" 
          />
          <GapSection 
            title="Recommended Certifications" 
            items={skillGap?.certifications} 
            icon={Lightbulb} 
            color="text-amber-500" bg="bg-amber-50 dark:bg-amber-950/20" 
          />
          <GapSection 
            title="Suggested Projects" 
            items={skillGap?.projects} 
            icon={TrendingUp} 
            color="text-blue-500" bg="bg-blue-50 dark:bg-blue-950/20" 
          />
          {(!skillGap?.missing?.length && !skillGap?.certifications?.length && !skillGap?.projects?.length) && (
            <p className="text-xs text-[var(--text-muted)] italic text-center py-4">
              No significant skill gaps found. You're a strong match!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
