import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, Plus, Sun, Moon } from 'lucide-react'
import useAppStore from '../context/AppContext'
import { useTheme } from '../hooks/useTheme'

const navLabels = {
  'Dashboard': 'Dashboard',
  'Tailor Resume': 'Tailor Your Resume',
  'ATS Score': 'ATS Score Checker',
  'Resume Insights': 'Resume Insights',
  'Cover Letter': 'Cover Letter Generator',
  'Interview Prep': 'Interview Prep',
  'History': 'Resume History',
}

export default function TopNav({ activeTab }) {
  const { theme, toggleTheme } = useTheme()
  const { requestNewSession } = useAppStore()
  const [searchOpen, setSearchOpen] = useState(false)

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-xl">
      {/* Left */}
      <div>
        <h2 className="text-xl font-bold text-[var(--text)]">{navLabels[activeTab] || activeTab}</h2>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{dateStr}</p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <AnimatePresence>
          {searchOpen && (
            <motion.input
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 200, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="saas-input text-sm py-2"
              placeholder="Search resumes..."
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => setSearchOpen(!searchOpen)}
          className="btn-ghost p-2.5 rounded-xl"
          whileTap={{ scale: 0.9 }}
        >
          <Search size={17} />
        </motion.button>

        {/* Notifications */}
        <motion.button className="btn-ghost p-2.5 rounded-xl relative" whileTap={{ scale: 0.9 }}>
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--danger)] rounded-full" />
        </motion.button>

        {/* Theme toggle */}
        <motion.button
          onClick={toggleTheme}
          className="btn-ghost p-2.5 rounded-xl"
          whileTap={{ scale: 0.9 }}
          title="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </motion.button>

        {/* New Resume — triggers session dialog */}
        <motion.button
          onClick={requestNewSession}
          className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm font-semibold"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus size={15} />
          New Resume
        </motion.button>
      </div>
    </header>
  )
}

