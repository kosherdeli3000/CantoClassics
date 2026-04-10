import { useState, useCallback } from 'react'
import { usePoem } from './hooks/usePoem'
import { useJyutpingToggle } from './hooks/useJyutpingToggle'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'
import { todayStr, getThursday, shiftWeek } from './lib/dates'
import { PoemView } from './components/PoemView'
import { PoemIllustration } from './components/PoemIllustration'
import { DateHeader } from './components/DateHeader'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'
import { DayNavigation } from './components/DayNavigation'
import { WelcomeScreen } from './components/WelcomeScreen'
import { FavoritesPage } from './components/FavoritesPage'

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
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

  if (showFavorites) {
    return (
      <FavoritesPage
        onBack={() => setShowFavorites(false)}
        onSelectPoem={(thursdayDate) => {
          setCurrentThursday(thursdayDate)
          setShowFavorites(false)
        }}
      />
    )
  }

  return (
    <div
      className="min-h-dvh bg-parchment relative"
      {...swipe}
    >
      {poem && <PoemIllustration dailyImages={poem.daily_images} dayKey={dayKey} />}

      {loading && (
        <div className="px-6 pt-8 max-w-[480px] mx-auto">
          <DateHeader date={currentThursday} />
          <LoadingState date={currentThursday} />
        </div>
      )}
      {error && !loading && (
        <ErrorState
          onRetry={retry}
          onGoHome={() => setCurrentThursday(getThursday(todayStr()))}
        />
      )}
      {poem && !loading && !error && (
        <PoemView
          poem={poem}
          jyutpingOn={jyutpingOn}
          toggleJyutping={toggleJyutping}
          showFirstLabel={showFirstLabel}
          onShowFavorites={() => setShowFavorites(true)}
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
