import { useState, useCallback } from 'react'

const STORAGE_KEY = 'tangshi-visited'

function hasVisited(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return true // if localStorage fails, skip welcome
  }
}

export function useFirstVisit() {
  const [showWelcome, setShowWelcome] = useState(() => !hasVisited())

  const dismiss = useCallback(() => {
    setShowWelcome(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch { /* noop */ }
  }, [])

  return { showWelcome, dismiss }
}
