import { useState, useRef, useCallback } from 'react'
import { usePoem } from './hooks/usePoem'
import { useJyutpingToggle } from './hooks/useJyutpingToggle'
import { JyutpingToggle } from './components/JyutpingToggle'
import { PoemView } from './components/PoemView'
import { LoadingState } from './components/LoadingState'
import { ErrorState } from './components/ErrorState'

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
  const { jyutpingOn, toggleJyutping } = useJyutpingToggle()

  const today = todayStr()
  const canGoForward = currentDate < today

  // Swipe handling
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return
      const dx = e.changedTouches[0].clientX - touchStart.current.x
      const dy = e.changedTouches[0].clientY - touchStart.current.y
      touchStart.current = null

      // Only register horizontal swipes (dx > dy) with enough distance
      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy)) return

      if (dx > 0) {
        // Swipe right → previous day
        setCurrentDate((d) => shiftDate(d, -1))
      } else if (dx < 0 && canGoForward) {
        // Swipe left → next day
        setCurrentDate((d) => {
          const next = shiftDate(d, 1)
          return next <= today ? next : d
        })
      }
    },
    [canGoForward, today]
  )

  return (
    <div
      className="min-h-dvh bg-parchment relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <JyutpingToggle isOn={jyutpingOn} onToggle={toggleJyutping} />

      {loading && <LoadingState />}
      {error && !loading && <ErrorState onRetry={retry} />}
      {poem && !loading && !error && (
        <PoemView poem={poem} jyutpingOn={jyutpingOn} />
      )}

      {/* Navigation arrows */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-12 pointer-events-none">
        <button
          onClick={() => setCurrentDate((d) => shiftDate(d, -1))}
          className="pointer-events-auto text-warm-gray-light hover:text-vermillion transition-colors text-xl p-2"
          aria-label="Previous day"
        >
          &lsaquo;
        </button>
        <button
          onClick={() => {
            if (canGoForward) {
              setCurrentDate((d) => {
                const next = shiftDate(d, 1)
                return next <= today ? next : d
              })
            }
          }}
          className={`pointer-events-auto text-xl p-2 transition-colors ${
            canGoForward
              ? 'text-warm-gray-light hover:text-vermillion'
              : 'text-rule cursor-default'
          }`}
          aria-label="Next day"
          disabled={!canGoForward}
        >
          &rsaquo;
        </button>
      </div>
    </div>
  )
}
