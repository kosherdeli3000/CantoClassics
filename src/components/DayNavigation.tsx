const SHORT_MONTHS = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
]

interface Props {
  currentDate: string
  canGoForward: boolean
  onPrev: () => void
  onNext: () => void
}

export function DayNavigation({ currentDate, canGoForward, onPrev, onNext }: Props) {
  const d = new Date(currentDate + 'T00:00:00')
  const dateLabel = `${SHORT_MONTHS[d.getMonth()]}/${d.getDate()}`

  return (
    <div className="fixed bottom-6 left-0 right-0 flex items-center justify-center gap-8 pointer-events-none z-10">
      <button
        onClick={onPrev}
        className="pointer-events-auto text-vermillion/40 hover:text-vermillion transition-colors text-2xl w-11 h-11 flex items-center justify-center"
        aria-label="Previous day"
      >
        &lsaquo;
      </button>

      <span className="font-[var(--font-serif-en)] text-warm-gray-light text-xs">
        {dateLabel}
      </span>

      <button
        onClick={onNext}
        className={`pointer-events-auto text-2xl w-11 h-11 flex items-center justify-center transition-colors ${
          canGoForward
            ? 'text-vermillion/40 hover:text-vermillion'
            : 'text-rule cursor-default'
        }`}
        aria-label="Next day"
        disabled={!canGoForward}
      >
        &rsaquo;
      </button>
    </div>
  )
}
