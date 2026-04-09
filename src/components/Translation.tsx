interface Props {
  text: string
  visible: boolean
  onToggle: () => void
}

export function Translation({ text, visible, onToggle }: Props) {
  return (
    <div className="mt-6 mb-4 border-t border-rule pt-5">
      <button
        onClick={onToggle}
        className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-3 hover:text-vermillion transition-colors flex items-center gap-1"
      >
        Translation {visible ? '−' : '↓'}
      </button>
      {visible && (
        <div className="reveal-enter">
          <p className="font-[var(--font-serif-en)] text-ink-light text-lg leading-relaxed text-center whitespace-pre-line">
            {text}
          </p>
        </div>
      )}
    </div>
  )
}
