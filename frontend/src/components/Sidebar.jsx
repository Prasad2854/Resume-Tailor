import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, FileText, CheckCircle, Clock, FileSignature, Presentation, ChevronLeft, ChevronRight } from 'lucide-react'
import useAppStore from '../context/AppContext'

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'Dashboard' },
  { icon: FileSignature, label: 'Tailor Resume', id: 'Tailor Resume' },
  { icon: CheckCircle, label: 'ATS Analysis', id: 'ATS Score' },
  { icon: FileText, label: 'Cover Letter', id: 'Cover Letter' },
  { icon: Presentation, label: 'Interview Prep', id: 'Interview Prep' },
  { icon: Clock, label: 'History', id: 'History' },
]

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar, requestNewSession } = useAppStore()

  const handleNavClick = (id) => {
    if (id === 'Tailor Resume' && activeTab !== 'Tailor Resume') {
      // Switching TO Tailor Resume from another page — just navigate, don't wipe state
      setActiveTab(id)
    } else if (id === 'Tailor Resume' && activeTab === 'Tailor Resume') {
      // Already on Tailor Resume — "New Resume" behavior
      requestNewSession()
    } else {
      setActiveTab(id)
    }
  }

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex-shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col h-screen relative z-30 overflow-visible"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 mb-2">
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2.5"
            >
              <img src="/resumint-logo.png" alt="Resumint" className="w-9 h-9 rounded-xl object-contain flex-shrink-0 shadow-md" />
              <div>
                <p className="font-extrabold text-sm text-[var(--text)] leading-none tracking-tight">Resumint</p>
                <p className="text-[10px] text-[var(--text-muted)] mt-0.5 font-medium">Fresh Resume Intelligence</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {sidebarCollapsed && (
          <img src="/resumint-logo.png" alt="Resumint" className="w-9 h-9 rounded-xl object-contain mx-auto shadow-md" />
        )}
        <motion.button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--primary)] shadow-sm z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </motion.button>
      </div>

      {/* Nav Menu */}
      <div className="flex-1 px-3 space-y-6 overflow-y-auto overflow-x-hidden">
        <div>
          {!sidebarCollapsed && (
            <p className="px-3 text-[10px] font-bold text-[var(--text-light)] uppercase tracking-wider mb-2 mt-4">
              Tools
            </p>
          )}
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => {
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group relative ${
                    isActive
                      ? 'text-[var(--primary)] bg-[var(--primary)]/5'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]'
                  }`}
                  title={sidebarCollapsed ? item.label : ''}
                >
                  {isActive && (
                    <motion.div layoutId="active-nav" className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[var(--primary)] rounded-r-full" />
                  )}
                  <item.icon
                    size={18}
                    className={`flex-shrink-0 transition-colors ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-light)] group-hover:text-[var(--text)]'}`}
                  />
                  <AnimatePresence>
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </motion.aside>
  )
}
