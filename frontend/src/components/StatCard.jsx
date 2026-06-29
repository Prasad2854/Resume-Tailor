import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

function useCountUp(target, duration = 1200) {
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

const mockSparkline = (len = 7, base = 40, variance = 30) =>
  Array.from({ length: len }, (_, i) => ({
    v: Math.max(0, base + Math.random() * variance - variance / 2 + (i * variance) / len)
  }))

export default function StatCard({ icon: Icon, label, value, unit = '', subtitle, trend, color = 'var(--primary)' }) {
  const numericValue = parseFloat(value) || 0
  const animated = useCountUp(numericValue)
  const data = useRef(mockSparkline()).current
  const trendPositive = trend > 0

  return (
    <motion.div
      className="saas-card saas-card-hover p-5 flex flex-col gap-3 cursor-default"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${trendPositive ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400' : 'bg-red-50 text-red-500 dark:bg-red-950/30 dark:text-red-400'}`}>
            {trendPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-3xl font-extrabold text-[var(--text)] leading-none">
          {animated}{unit}
        </p>
        <p className="text-sm font-semibold text-[var(--text-2)] mt-1">{label}</p>
        {subtitle && <p className="text-xs text-[var(--text-muted)] mt-0.5">{subtitle}</p>}
      </div>

      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip content={() => null} />
            <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
