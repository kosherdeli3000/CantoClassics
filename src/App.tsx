import { useState, useCallback, useMemo } from 'react'
import { usePoem } from './hooks/usePoem'
import { usePoemDates } from './hooks/usePoemDates'
import { useJyutpingToggle } from './hooks/useJyutpingToggle'
import { useSwipeNavigation } from './hooks/useSwipeNavigation'
import { todayStr, getThursday } from './lib/dates'
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
  const { dates: poemDates } = usePoemDates()

  const thisThursday = getThursday(todayStr())

  // Navigation walks the list of dates that actually have poems, ordered
  // most-recent first. If the current Thursday isn't yet in the list (i.e.
  // this week's poem is still being generated), "back" jumps to the latest
  // existing poem.
  const { canGoBack, canGoForward, prevDate, nextDate } = useMemo(() => {
    if (poemDates.length === 0) {
      return { canGoBack: false, canGoForward: false, prevDate: null, nextDate: null }
    }

    const idx = poemDates.indexOf(currentThursday)

    if (idx === -1) {
      // Current Thursday isn't in the list — treat it as "newer than newest".
      // Back goes to the most recent existing poem; forward is disabled.
      return {
        canGoBack: true,
        canGoForward: false,
        prevDate: poemDates[0],
        nextDate: null,
      }
    }

    const prev = idx < poemDates.length - 1 ? poemDates[idx + 1] : null // older
    const next = idx > 0 ? poemDates[idx - 1] : null // newer

    return {
      canGoBack: prev !== null,
      canGoForward: next !== null,
      prevDate: prev,
      nextDate: next,
    }
  }, [poemDates, currentThursday])

  const goBack = useCallback(() => {
    if (prevDate) setCurrentThursday(prevDate)
  }, [prevDate])

  const goForward = useCallback(() => {
    if (nextDate) setCurrentThursday(nextDate)
  }, [nextDate])

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
          onGoHome={() => setCurrentThursday(thisThursday)}
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
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onPrev={goBack}
        onNext={goForward}
      />
    </div>
  )
}
