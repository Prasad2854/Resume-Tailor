import { useEffect, useRef } from 'react'

export function useAutoSave(value, key, delay = 2000) {
  const timer = useRef(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      if (value) localStorage.setItem(key, value)
    }, delay)
    return () => clearTimeout(timer.current)
  }, [value, key, delay])
}
