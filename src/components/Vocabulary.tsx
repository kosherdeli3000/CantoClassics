import type { VocabEntry } from '../types/poem'

interface Props {
  words: VocabEntry[]
  visible: boolean
  onToggle: () => void
}

export function Vocabulary({ words, visible, onToggle }: Props) {
  return (
    <div className="mt-6 mb-4 border-t border-rule pt-5">
      <button
        onClick={onToggle}
        className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-4 hover:text-vermillion transition-colors flex items-center gap-1"
      >
        Vocabulary {visible ? '−' : '↓'}
      </button>
      {visible && (
        <div className="reveal-enter space-y-4">
          {words.map((w, i) => (
            <div key={i} className="text-left">
              <div className="flex items-baseline gap-2">
                <span className="font-[var(--font-serif-zh)] text-ink text-xl">
                  {w.character}
                </span>
                <span className="font-[var(--font-serif-en)] italic text-warm-gray text-sm">
                  {w.jyutping}
                </span>
              </div>
              <p className="font-[var(--font-serif-en)] text-ink-light text-sm mt-0.5">
                {w.meaning}
              </p>
              {w.note && (
                <p className="font-[var(--font-serif-en)] italic text-warm-gray text-xs mt-0.5">
                  {w.note}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
