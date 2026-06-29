import { motion } from 'framer-motion'
import { MessagesSquare, Code, Users, Briefcase } from 'lucide-react'
import useAppStore from '../context/AppContext'

function QuestionCategory({ title, icon: Icon, questions, color, bg }) {
  if (!questions || questions.length === 0) return null

  return (
    <div className="saas-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-xl ${bg}`}>
          <Icon size={18} className={color} />
        </div>
        <h3 className="text-sm font-bold text-[var(--text)]">{title}</h3>
      </div>
      <div className="space-y-3">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 bg-[var(--bg-2)] rounded-xl border border-[var(--border)] text-sm text-[var(--text)] font-medium leading-relaxed"
          >
            <span className={`font-bold mr-2 ${color}`}>Q:</span>
            {q}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default function InterviewPrepPage() {
  const { interviewPrep, atsScore } = useAppStore()
  const hasData = atsScore !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 lg:p-8 space-y-6"
    >
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--text)] mb-2">Interview Prep</h2>
        <p className="text-sm text-[var(--text-muted)] max-w-2xl">
          Custom interview questions generated based on the overlap between your resume and the job description.
        </p>
      </div>

      {!hasData ? (
        <div className="saas-card p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <div className="w-16 h-16 bg-[var(--bg-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center mb-4">
            <MessagesSquare size={28} className="text-[var(--text-light)]" />
          </div>
          <p className="text-sm font-semibold text-[var(--text-2)]">No data yet</p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Tailor your resume first to generate interview questions.</p>
        </div>
      ) : (!interviewPrep?.technical?.length && !interviewPrep?.hr?.length) ? (
        <div className="saas-card p-12 text-center flex flex-col items-center justify-center min-h-[40vh]">
          <p className="text-sm font-semibold text-[var(--text-2)]">No questions generated</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <QuestionCategory 
            title="Technical & Role-Specific" 
            icon={Code} 
            questions={interviewPrep?.technical} 
            color="text-blue-500" 
            bg="bg-blue-50 dark:bg-blue-950/20" 
          />
          <QuestionCategory 
            title="HR & Behavioral" 
            icon={Users} 
            questions={interviewPrep?.hr || interviewPrep?.behavioral} 
            color="text-purple-500" 
            bg="bg-purple-50 dark:bg-purple-950/20" 
          />
        </div>
      )}
    </motion.div>
  )
}
