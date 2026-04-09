interface Props {
  text: string
  visible: boolean
  onToggle: () => void
}

export function Translation({ text, visible, onToggle }: Props) {
  if (!visible) return null

  return (
    <div className="reveal-enter mt-6 mb-4 border-t border-rule pt-6">
      <button
        onClick={onToggle}
        className="text-xs text-warm-gray-light uppercase tracking-widest mb-3 hover:text-vermillion transition-colors"
      >
        Translation &uarr;
      </button>
      <p className="font-[var(--font-serif-en)] text-ink-light text-lg leading-relaxed text-center whitespace-pre-line">
        {text}
      </p>
    </div>
  )
}
