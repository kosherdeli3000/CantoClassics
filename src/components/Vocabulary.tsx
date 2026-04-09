import type { VocabEntry } from '../types/poem'

interface Props {
  words: VocabEntry[]
  visible: boolean
  onToggle: () => void
}

export function Vocabulary({ words, visible, onToggle }: Props) {
  if (!visible) return null

  return (
    <div className="reveal-enter mt-6 mb-4 border-t border-rule pt-6">
      <button
        onClick={onToggle}
        className="text-xs text-warm-gray-light uppercase tracking-widest mb-4 hover:text-vermillion transition-colors"
      >
        Vocabulary &uarr;
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {words.map((w, i) => (
          <div
            key={i}
            className="bg-parchment-dark rounded-lg px-4 py-3 text-left"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-[var(--font-serif-zh)] text-ink text-xl">
                {w.character}
              </span>
              <span className="font-[var(--font-serif-en)] italic text-warm-gray text-sm">
                {w.jyutping}
              </span>
            </div>
            <p className="font-[var(--font-serif-en)] text-ink-light text-sm mt-1">
              {w.meaning}
            </p>
            {w.note && (
              <p className="font-[var(--font-serif-en)] italic text-warm-gray text-xs mt-1">
                {w.note}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
