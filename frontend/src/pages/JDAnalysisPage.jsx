import { motion } from 'framer-motion'
import { Briefcase, Building, Layers, CheckCircle } from 'lucide-react'
import useAppStore from '../context/AppContext'

function AnalysisSection({ title, items }) {
  if (!items || items.length === 0) return null

  return (
    <div className="mb-6 last:mb-0">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)] mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="px-2.5 py-1.5 bg-[var(--bg-2)] border border-[var(--border)] rounded-lg text-xs font-semibold text-[var(--text)]">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function JDAnalysisPage() {
  const { jdAnalysis, atsScore } = useAppStore()
  const hasData = atsScore !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8 space-y-6 max-w-5xl mx-auto"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text)] mb-2">Job Description Analysis</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl">
          AI breakdown of the core requirements, skills, and context from the provided job description.
        </p>
      </div>

      {!hasData ? (
        <div className="saas-card p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-16 h-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
            <Briefcase size={28} className="text-[var(--text-light)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-2)]">No analysis available</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Tailor your resume first to analyze the job description.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="md:col-span-1 saas-card p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-500 rounded-2xl flex items-center justify-center">
                <Building size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">Company</p>
                <p className="text-sm font-bold text-[var(--text)]">{jdAnalysis?.companyName || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 text-purple-500 rounded-2xl flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">Role</p>
                <p className="text-sm font-bold text-[var(--text)]">{jdAnalysis?.role || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-2xl flex items-center justify-center">
                <Layers size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-light)]">Experience Required</p>
                <p className="text-sm font-bold text-[var(--text)]">{jdAnalysis?.experienceRequired || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="md:col-span-2 saas-card p-6">
            <AnalysisSection title="Required Skills" items={jdAnalysis?.requiredSkills} />
            <AnalysisSection title="Preferred Skills" items={jdAnalysis?.preferredSkills} />
            
            {jdAnalysis?.responsibilities && jdAnalysis.responsibilities.length > 0 && (
              <div className="mt-6">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-light)] mb-3">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {jdAnalysis.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[var(--text)] leading-relaxed">
                      <CheckCircle size={14} className="text-[var(--primary)] mt-1 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
