interface Props {
  isOn: boolean
  onToggle: () => void
  showFirstLabel: boolean
}

export function JyutpingToggle({ isOn, onToggle, showFirstLabel }: Props) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button
        onClick={onToggle}
        aria-label={isOn ? 'Hide Jyutping' : 'Show Jyutping'}
        className={`
          w-9 h-9 rounded-full
          flex items-center justify-center
          font-[var(--font-serif-zh)] text-xs
          transition-all duration-200 ease-out
          border
          ${isOn
            ? 'bg-vermillion text-parchment border-vermillion'
            : 'bg-transparent text-warm-gray border-warm-gray-light hover:border-warm-gray'
          }
        `}
      >
        粵
      </button>
      {showFirstLabel && (
        <span className="font-[var(--font-serif-en)] italic text-warm-gray text-xs animate-pulse">
          粵拼 on
        </span>
      )}
    </div>
  )
}
