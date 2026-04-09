import { useState, useCallback } from 'react'

const STORAGE_KEY = 'tangshi-jyutping-on'

function getInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export function useJyutpingToggle() {
  const [isOn, setIsOn] = useState(getInitial)

  const toggle = useCallback(() => {
    setIsOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch { /* noop */ }
      return next
    })
  }, [])

  return { jyutpingOn: isOn, toggleJyutping: toggle }
}
