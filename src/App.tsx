import { useState, useCallback } from 'react'
import { usePoem } from './hooks/usePoem'
import { useJyutpingToggle } from './hooks/useJyutpingToggle'
import { useFirstVisit } from './hooks/useFirstVisit'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'
import { PoemView } from './components/PoemView'
import { DateHeader } from './components/DateHeader'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'
import { DayNavigation } from './components/DayNavigation'
import { WelcomeScreen } from './components/WelcomeScreen'

function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function App() {
  const [currentDate, setCurrentDate] = useState(todayStr)
  const { poem, loading, error, retry } = usePoem(currentDate)
  const { jyutpingOn, toggleJyutping, showFirstLabel } = useJyutpingToggle()
  const { showWelcome, dismiss: dismissWelcome } = useFirstVisit()

  const today = todayStr()
  const canGoForward = currentDate < today

  const goBack = useCallback(() => {
    setCurrentDate((d) => shiftDate(d, -1))
  }, [])

  const goForward = useCallback(() => {
    if (!canGoForward) return
    setCurrentDate((d) => {
      const next = shiftDate(d, 1)
      return next <= todayStr() ? next : d
    })
  }, [canGoForward])

  const swipe = useSwipeNavigation(goForward, goBack)

  if (showWelcome) {
    return <WelcomeScreen onDismiss={dismissWelcome} />
  }

  return (
    <div
      className="min-h-dvh bg-parchment relative"
      {...swipe}
    >
      {loading && (
        <div className="px-6 pt-8 max-w-[480px] mx-auto">
          <DateHeader date={currentDate} />
          <LoadingState date={currentDate} />
        </div>
      )}
      {error && !loading && <ErrorState onRetry={retry} />}
      {poem && !loading && !error && (
        <PoemView
          poem={poem}
          jyutpingOn={jyutpingOn}
          toggleJyutping={toggleJyutping}
          showFirstLabel={showFirstLabel}
        />
      )}

      <DayNavigation
        currentDate={currentDate}
        canGoForward={canGoForward}
        onPrev={goBack}
        onNext={goForward}
      />
    </div>
  )
}
