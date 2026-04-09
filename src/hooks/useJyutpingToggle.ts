import { useState, useCallback } from 'react'

const STORAGE_KEY = 'tangshi-jyutping-on'
const FIRST_TOGGLE_KEY = 'tangshi-jyutping-first-toggle'

function getInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function hasToggledBefore(): boolean {
  try {
    return localStorage.getItem(FIRST_TOGGLE_KEY) === 'true'
  } catch {
    return true
  }
}

export function useJyutpingToggle() {
  const [isOn, setIsOn] = useState(getInitial)
  const [showFirstLabel, setShowFirstLabel] = useState(false)

  const toggle = useCallback(() => {
    setIsOn((prev) => {
      const next = !prev
      try {
        localStorage.setItem(STORAGE_KEY, String(next))
      } catch { /* noop */ }

      // Show "粵拼 on" label on first-ever toggle-on
      if (next && !hasToggledBefore()) {
        setShowFirstLabel(true)
        try {
          localStorage.setItem(FIRST_TOGGLE_KEY, 'true')
        } catch { /* noop */ }
        setTimeout(() => setShowFirstLabel(false), 1500)
      }

      return next
    })
  }, [])

  return { jyutpingOn: isOn, toggleJyutping: toggle, showFirstLabel }
}
