import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, TrendingUp, Target, Star, Mic, MessageSquare,
  Upload, Wand2, BarChart2, BookOpen, Lightbulb, Clock,
  CheckCircle, Circle, Download, Copy, Trash2,
  ChevronRight, Zap, RefreshCw
} from 'lucide-react'
import useAppStore from '../context/AppContext'
import { AreaChart, Area, ResponsiveContainer, Tooltip, RadialBarChart, RadialBar } from 'recharts'

// ─── Animated Counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0)
  const frame = useRef(null)
  useEffect(() => {
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, duration])
  return count
}

// ─── Sparkline mock data ───────────────────────────────────────────────────────
const sparkline = (len = 8, base = 30, variance = 40) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(5, base + Math.sin(i * 0.8) * variance * 0.5 + (i * variance) / len)
  }))

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, unit = '', subtitle, trend, color, delay = 0 }) {
  const numericValue = typeof value === 'number' ? value : 0
  const animated = useCountUp(numericValue)
  const data = useRef(sparkline()).current
  const isPlaceholder = numericValue === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="saas-card saas-card-hover p-5 flex flex-col gap-3 cursor-default group"
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && numericValue > 0 && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-500'}`}>
            <TrendingUp size={11} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-[var(--text)] leading-none">
          {isPlaceholder ? '--' : `${animated}${unit}`}
        </p>
        <p className="text-sm font-semibold text-[var(--text-2)] mt-1">{label}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>
      <div className="h-10 -mx-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`g-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={() => null} />
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#g-${label})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

// ─── Gauge Circle ──────────────────────────────────────────────────────────────
function GaugeRing({ value, label, max = 100, color }) {
  const pct = value ? Math.round((value / max) * 100) : 0
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (pct / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="var(--border)" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36" fill="none"
            stroke={color} strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold text-[var(--text)]">{value ? `${pct}%` : '--'}</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-[var(--text-muted)] text-center leading-tight">{label}</p>
    </div>
  )
}

// ─── Workflow Step ─────────────────────────────────────────────────────────────
const WORKFLOW_STEPS = [
  'Upload Resume', 'Parse Resume', 'Parse Job Description', 'Extract Keywords',
  'ATS Analysis', 'Skill Matching', 'Resume Optimization', 'Generate Final Resume', 'Ready'
]

function WorkflowTimeline({ currentStep }) {
  return (
    <div className="flex items-start w-full relative mt-8 mb-4">
      {WORKFLOW_STEPS.map((step, i) => {
        const done = currentStep > i || currentStep === WORKFLOW_STEPS.length
        const active = currentStep === i
        
        return (
          <div key={step} className="flex-1 flex flex-col items-center gap-3 relative z-10">
            {/* Background Line */}
            {i < WORKFLOW_STEPS.length - 1 && (
              <div className="absolute left-[50%] right-[-50%] top-[15px] h-[2px] bg-[var(--border)] -z-10" />
            )}
            {/* Active Line Segment */}
            {i < WORKFLOW_STEPS.length - 1 && currentStep > i && (
              <div className="absolute left-[50%] right-[-50%] top-[15px] h-[2px] bg-[var(--primary)] -z-10" />
            )}

            <motion.div
              animate={done ? { scale: [1, 1.15, 1] } : {}}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 bg-white transition-all duration-500 font-bold text-xs ${
                done ? 'border-[var(--primary)] text-[var(--primary)]' :
                active ? 'border-[var(--primary)] text-[var(--primary)] shadow-[0_0_0_4px_rgba(91,95,239,0.15)]' :
                'border-[var(--border)] text-[var(--text-light)]'
              }`}
            >
              {i + 1}
            </motion.div>
            <p className={`text-[10px] font-bold text-center uppercase tracking-wider leading-tight px-1 whitespace-nowrap transition-colors ${
              done ? 'text-[var(--text-muted)]' : 
              active ? 'text-[var(--primary)]' : 
              'text-[var(--text-light)] opacity-70'
            }`}>
              {step}
            </p>
          </div>
        )
      })}
    </div>
  )
}

// ─── Empty State ───────────────────────────────────────────────────────────────
function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="flex flex-col items-center py-10 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-[#5B5FEF]" style={{ background: 'linear-gradient(135deg, rgba(91,95,239,0.12) 0%, rgba(124,77,255,0.12) 100%)' }}>
        {icon}
      </div>
      <p className="font-bold text-[var(--text)] mb-1">{title}</p>
      <p className="text-sm text-[var(--text-muted)] max-w-xs">{desc}</p>
      {action && (
        <button onClick={action.fn} className="btn-primary mt-4 px-4 py-2 text-sm font-semibold">
          {action.label}
        </button>
      )}
    </div>
  )
}

// ─── Main Dashboard ────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { history, atsScore, keywords, tailoredResume, isGenerating, pipelineStep, setActiveTab, requestNewSession } = useAppStore()
  const hasResume = !!tailoredResume
  const currentStep = isGenerating ? pipelineStep : (hasResume ? 7 : -1)

  const STATS = [
    { icon: FileText,      label: 'Resumes Tailored',  value: history.length,               unit: '', subtitle: 'All time',           trend: undefined, color: '#5B5FEF' },
    { icon: TrendingUp,    label: 'Avg. ATS Score',    value: atsScore || 0,                unit: '%', subtitle: 'Latest analysis',   trend: undefined, color: '#22C55E' },
    { icon: Target,        label: 'Jobs Analyzed',     value: history.length,               unit: '', subtitle: 'Total JDs processed', trend: undefined, color: '#4F8CFF' },
    { icon: Star,          label: 'Cover Letters',     value: 0,                            unit: '', subtitle: 'Generated',          trend: undefined, color: '#F59E0B' },
    { icon: Mic,           label: 'Interview Qs',      value: 0,                            unit: '', subtitle: 'Generated',          trend: undefined, color: '#EF4444' },
    { icon: MessageSquare, label: 'AI Suggestions',   value: (keywords?.matched?.length || 0), unit: '', subtitle: 'Keywords matched', trend: undefined, color: '#7C4DFF' },
  ]

  const QUICK_ACTIONS = [
    { icon: Upload,     label: 'Upload Resume',         desc: 'Upload your base resume',            tab: 'Tailor Resume', color: '#5B5FEF', reset: true },
    { icon: Wand2,      label: 'Tailor Resume',         desc: 'AI-optimize for a job description',  tab: 'Tailor Resume', color: '#7C4DFF', reset: true },
    { icon: BarChart2,  label: 'ATS Analysis',          desc: 'Check your ATS compatibility score', tab: 'ATS Score',     color: '#22C55E' },
    { icon: BookOpen,   label: 'Cover Letter',          desc: 'Generate a tailored cover letter',   tab: 'Cover Letter',  color: '#F59E0B' },
    { icon: Lightbulb,  label: 'Interview Prep',        desc: 'Practice with AI-generated Qs',     tab: 'Interview Prep',color: '#EF4444' },
    { icon: Clock,      label: 'Resume History',        desc: 'View past tailored resumes',         tab: 'History',       color: '#4F8CFF' },
  ]

  const ATS_GAUGES = [
    { label: 'Keyword Match',  value: keywords?.matched?.length ? Math.min(100, keywords.matched.length * 8) : 0,  color: '#5B5FEF' },
    { label: 'Formatting',     value: atsScore ? 88 : 0,  color: '#22C55E' },
    { label: 'Readability',    value: atsScore ? 76 : 0,  color: '#F59E0B' },
    { label: 'Skills Match',   value: atsScore ? Math.round(atsScore * 0.9) : 0, color: '#4F8CFF' },
    { label: 'Experience',     value: atsScore ? Math.round(atsScore * 0.85) : 0, color: '#EF4444' },
    { label: 'Education',      value: atsScore ? 92 : 0,  color: '#7C4DFF' },
  ]

  const AI_INSIGHTS = [
    { icon: Upload, text: 'Upload a resume to begin ATS analysis.', active: !hasResume },
    { icon: FileText, text: 'Add a job description for better keyword tailoring.', active: !hasResume },
    { icon: Wand2, text: 'Tailor your resume before generating a cover letter.', active: !hasResume },
    { icon: Mic, text: 'Generate interview questions after tailoring your resume.', active: !hasResume },
    { icon: TrendingUp, text: 'Improve keyword matching to increase ATS score above 85%.', active: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8 space-y-8 max-w-[1400px] mx-auto"
    >

      {/* ── HERO ── */}
      <div className="saas-card p-7 border-0 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5B5FEF 0%, #6366f1 50%, #7C4DFF 100%)' }}>
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-96 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left copy */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-3">
              <img src="/resumint-logo.png" alt="Resumint" className="w-8 h-8 rounded-xl object-contain shadow-sm" />
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Resumint</span>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight mb-3">
              Fresh Resume Intelligence. ✨
            </h1>
            <p className="text-white/80 text-sm max-w-lg leading-relaxed">
              Optimize your resume for Applicant Tracking Systems and increase your chances of landing interviews.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button 
                onClick={requestNewSession}
                className="flex items-center gap-2 bg-white text-[var(--primary)] font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/90 transition-all shadow-lg"
              >
                <FileText size={16} /> New Resume
              </button>
              <button onClick={() => setActiveTab('ATS Score')} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/25 transition-all border border-white/20">
                <BarChart2 size={15} /> Analyze Resume
              </button>
            </div>
          </div>
          {/* Info cards */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[220px]">
            {[
              { label: 'Resume Status',   value: hasResume ? '✅ Resume Ready' : '📂 No resume uploaded',     sub: hasResume ? 'Ready for tailoring' : 'Upload to get started' },
              { label: 'Latest ATS Score', value: atsScore ? `${atsScore}%` : '--%',                          sub: atsScore ? 'Last analysis result' : 'No analysis yet' },
              { label: 'Last Analysis',   value: history.length ? new Date(history[0]?.date).toLocaleDateString('en-IN') : 'None', sub: history.length ? 'Most recent session' : 'No analysis available' },
            ].map(card => (
              <div key={card.label} className="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/15">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">{card.label}</p>
                <p className="font-bold text-white text-sm mt-0.5">{card.value}</p>
                <p className="text-white/60 text-[10px] mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section>
        <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap size={12} className="text-[var(--primary)]" /> Application Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} {...stat} delay={i * 0.06} />
          ))}
        </div>
      </section>

      {/* ── QUICK ACTIONS ── */}
      <section>
        <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest mb-4 flex items-center gap-2">
          <Wand2 size={12} className="text-[var(--primary)]" /> Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                if (action.reset) requestNewSession()
                else setActiveTab(action.tab)
              }}
              className="saas-card p-5 flex flex-col gap-3 text-left group hover:border-[var(--primary)]/30 hover:shadow-[var(--primary)]/10 hover:shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ background: `${action.color}18` }}>
                <action.icon size={20} style={{ color: action.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors">{action.label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug">{action.desc}</p>
              </div>
              <ChevronRight size={14} className="text-[var(--text-light)] group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all mt-auto" />
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── WORKFLOW + ATS OVERVIEW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Workflow Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="saas-card p-6 lg:col-span-2 overflow-x-auto">
          <h3 className="text-sm font-bold text-[var(--text)] mb-8 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500 fill-yellow-500" /> AI Workflow Pipeline
          </h3>
          <div className="min-w-[950px] pb-2">
            <WorkflowTimeline currentStep={currentStep} />
          </div>
        </motion.div>
      </div>

      {/* ── ATS OVERVIEW & KEYWORD ANALYSIS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ATS Overview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="saas-card p-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-2 flex items-center gap-2">
            <BarChart2 size={15} className="text-[var(--primary)]" /> ATS Score Overview
          </h3>
          {atsScore ? (
            <>
              <div className="flex items-center gap-4 mb-6 p-4 bg-[var(--primary)]/5 rounded-xl border border-[var(--primary)]/10">
                <div className="text-5xl font-extrabold text-[var(--primary)]">{atsScore}<span className="text-2xl text-[var(--text-muted)]">%</span></div>
                <div>
                  <p className="font-bold text-[var(--text)] text-sm">Overall ATS Score</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">Based on last analysis</p>
                  <span className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${atsScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                    {atsScore >= 80 ? '✅ Good' : atsScore >= 60 ? '⚠️ Needs Work' : '❌ Low'}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {ATS_GAUGES.map(g => <GaugeRing key={g.label} {...g} />)}
              </div>
            </>
          ) : (
            <EmptyState
              icon={<BarChart2 size={28} />}
              title="No ATS Reports Yet"
              desc="Analyze a job description to generate your ATS score and insights."
              action={{ label: 'Analyze Now', fn: () => setActiveTab('Tailor Resume') }}
            />
          )}
        </motion.div>

        {/* Keyword Analysis */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="saas-card p-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Target size={15} className="text-[var(--primary)]" /> Keyword Analysis
          </h3>
          {keywords?.matched?.length > 0 || keywords?.missing?.length > 0 ? (
            <div className="space-y-4">
              {[
                { label: 'Matched Keywords', items: keywords.matched || [], color: 'green', badgeClass: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' },
                { label: 'Missing Keywords', items: keywords.missing || [], color: 'red', badgeClass: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
                { label: 'Suggested Keywords', items: keywords.suggested || [], color: 'purple', badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' },
              ].map(group => (
                <div key={group.label}>
                  <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">{group.label} ({group.items.length})</p>
                  {group.items.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.slice(0, 12).map(kw => (
                        <span key={kw} className={`text-xs font-semibold px-2 py-1 rounded-lg ${group.badgeClass}`}>{kw}</span>
                      ))}
                      {group.items.length > 12 && (
                        <span className="text-xs text-[var(--text-muted)] px-2 py-1">+{group.items.length - 12} more</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[var(--text-muted)] italic">None identified</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Target size={28} />}
              title="No Keywords Extracted"
              desc="Tailor a resume to see matched, missing, and suggested keywords."
              action={{ label: 'Tailor Resume', fn: () => setActiveTab('Tailor Resume') }}
            />
          )}
        </motion.div>

        {/* AI Insights */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="saas-card p-6">
          <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
            <Zap size={15} className="text-[var(--primary)]" /> AI Insights
          </h3>
          <div className="space-y-3">
            {AI_INSIGHTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--primary)]/30 transition-colors group cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0 mt-0.5 group-hover:bg-[var(--primary)]/20 transition-colors">
                  <item.icon size={15} />
                </div>
                <p className="text-sm text-[var(--text-2)] leading-snug">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── RECENT ACTIVITY ── */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
            <Clock size={12} className="text-[var(--primary)]" /> Recent Activity
          </h2>
          {history.length > 0 && (
            <button onClick={() => setActiveTab('History')} className="text-xs font-semibold text-[var(--primary)] hover:underline flex items-center gap-1">
              View All <ChevronRight size={12} />
            </button>
          )}
        </div>

        <div className="saas-card overflow-hidden">
          {history.length > 0 ? (
            <div className="divide-y divide-[var(--border)]">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-[var(--bg)]/60 text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                <span>Resume Name</span>
                <span>Date</span>
                <span>ATS Score</span>
                <span>Actions</span>
              </div>
              {history.slice(0, 6).map((h, i) => (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center hover:bg-[var(--surface-hover)] transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] flex-shrink-0">
                      <FileText size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text)] truncate">Tailored Resume v{history.length - i}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{h.preview?.slice(0, 60)}…</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-2)]">{new Date(h.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                  <div>
                    {h.atsScore ? (
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${h.atsScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : h.atsScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'}`}>
                        {h.atsScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-[var(--text-muted)]">N/A</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" title="Download">
                      <Download size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-[var(--primary)]/10 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors" title="Duplicate">
                      <Copy size={14} />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-red-50 text-[var(--text-muted)] hover:text-red-500 transition-colors dark:hover:bg-red-900/20" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText size={28} />}
              title="No Resumes Tailored Yet"
              desc="Upload your first resume to begin. Your tailored resume history will appear here."
              action={{ label: '📄 Upload Resume', fn: () => setActiveTab('Tailor Resume') }}
            />
          )}
        </div>
      </motion.section>

    </motion.div>
  )
}
