export function CardSkeleton({ height = 'h-32' }) {
  return (
    <div className="saas-card p-5 space-y-3">
      <div className={`skeleton h-4 w-1/3 rounded`} />
      <div className={`skeleton ${height} w-full rounded-xl`} />
      <div className="skeleton h-3 w-2/3 rounded" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="saas-card p-5 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton w-10 h-10 rounded-xl" />
        <div className="skeleton w-12 h-6 rounded-full" />
      </div>
      <div className="skeleton h-8 w-16 rounded" />
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-12 w-full rounded-xl" />
    </div>
  )
}

export function TextSkeleton({ lines = 4 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`skeleton h-3 rounded`} style={{ width: `${60 + Math.random() * 40}%` }} />
      ))}
    </div>
  )
}
