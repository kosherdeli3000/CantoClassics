interface Props {
  isOn: boolean
  onToggle: () => void
}

export function JyutpingToggle({ isOn, onToggle }: Props) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOn ? 'Hide Jyutping' : 'Show Jyutping'}
      className={`
        fixed top-4 right-4 z-10
        w-10 h-10 rounded-full
        flex items-center justify-center
        font-[var(--font-serif-zh)] text-sm
        transition-all duration-200 ease-out
        border
        ${isOn
          ? 'bg-vermillion text-parchment border-vermillion'
          : 'bg-parchment text-warm-gray border-rule hover:border-warm-gray'
        }
      `}
    >
      粵
    </button>
  )
}
