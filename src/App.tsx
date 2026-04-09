import { useState, useCallback } from 'react'
import { usePoem } from './hooks/usePoem'
import { useJyutpingToggle } from './hooks/useJyutpingToggle'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'
import { todayStr, getThursday, shiftWeek } from './lib/dates'
import { PoemView } from './components/PoemView'
import { DateHeader } from './components/DateHeader'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'
import { DayNavigation } from './components/DayNavigation'
import { WelcomeScreen } from './components/WelcomeScreen'

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [currentThursday, setCurrentThursday] = useState(() => getThursday(todayStr()))
  const { poem, dayKey, loading, error, retry } = usePoem(currentThursday)
  const { jyutpingOn, toggleJyutping, showFirstLabel } = useJyutpingToggle()

  const thisThursday = getThursday(todayStr())
  const canGoForward = currentThursday < thisThursday

  const goBack = useCallback(() => {
    setCurrentThursday((d) => shiftWeek(d, -1))
  }, [])

  const goForward = useCallback(() => {
    if (!canGoForward) return
    setCurrentThursday((d) => {
      const next = shiftWeek(d, 1)
      return next <= getThursday(todayStr()) ? next : d
    })
  }, [canGoForward])

  const swipe = useSwipeNavigation(goForward, goBack)

  if (showWelcome) {
    return <WelcomeScreen onDismiss={() => setShowWelcome(false)} />
  }

  return (
    <div
      className="min-h-dvh bg-parchment relative"
      {...swipe}
    >
      {loading && (
        <div className="px-6 pt-8 max-w-[480px] mx-auto">
          <DateHeader date={currentThursday} />
          <LoadingState date={currentThursday} />
        </div>
      )}
      {error && !loading && <ErrorState onRetry={retry} />}
      {poem && !loading && !error && (
        <PoemView
          poem={poem}
          dayKey={dayKey}
          jyutpingOn={jyutpingOn}
          toggleJyutping={toggleJyutping}
          showFirstLabel={showFirstLabel}
        />
      )}

      <DayNavigation
        currentDate={currentThursday}
        canGoForward={canGoForward}
        onPrev={goBack}
        onNext={goForward}
      />
    </div>
  )
}
