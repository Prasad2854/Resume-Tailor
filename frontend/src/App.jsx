import { Toaster } from 'react-hot-toast'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import TailorResumePage from './pages/TailorResumePage'
import DashboardPage from './pages/DashboardPage'
import CoverLetterPage from './pages/CoverLetterPage'
import InterviewPrepPage from './pages/InterviewPrepPage'
import JDAnalysisPage from './pages/JDAnalysisPage'
import HistoryPage from './pages/HistoryPage'
import ConfirmNewResumeDialog from './components/ConfirmNewResumeDialog'
import useAppStore from './context/AppContext'
import { useTheme } from './hooks/useTheme'

function PlaceholderPage({ title }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-[var(--bg-2)] border border-[var(--border)] rounded-3xl flex items-center justify-center text-4xl mb-6">✨</div>
      <h2 className="text-xl font-bold text-[var(--text)] mb-2">{title}</h2>
      <p className="text-sm text-[var(--text-muted)]">This feature is coming soon. Stay tuned!</p>
    </motion.div>
  )
}

const PAGES = {
  'Dashboard': DashboardPage,
  'Tailor Resume': TailorResumePage,
  'JD Analysis': JDAnalysisPage,
  'Cover Letter': CoverLetterPage,
  'Interview Prep': InterviewPrepPage,
  'History': HistoryPage,
}

export default function App() {
  useTheme()
  const { activeTab, sessionKey } = useAppStore()

  const PageComponent = PAGES[activeTab] || (() => <PlaceholderPage title={activeTab} />)

  // For TailorResumePage, use sessionKey as the React key so changing it forces a full unmount+remount
  const pageKey = activeTab === 'Tailor Resume' ? `tailor-${sessionKey}` : activeTab

  return (
    <>
      <div className="flex min-h-screen bg-[var(--bg)]">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <TopNav activeTab={activeTab} />
          <main className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <PageComponent key={pageKey} />
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Global confirmation dialog — shown above everything */}
      <ConfirmNewResumeDialog />

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--surface)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: '500',
            boxShadow: 'var(--shadow-lg)',
          },
          success: { iconTheme: { primary: '#22C55E', secondary: 'white' } },
          error: { iconTheme: { primary: '#EF4444', secondary: 'white' } },
        }}
      />
    </>
  )
}

