import type { LineByLine as LineByLineType } from '../types/poem'

interface Props {
  lines: LineByLineType[]
  visible: boolean
  onToggle: () => void
}

export function LineByLine({ lines, visible, onToggle }: Props) {
  if (!visible) return null

  return (
    <div className="reveal-enter mt-6 mb-4 border-t border-rule pt-6">
      <button
        onClick={onToggle}
        className="text-xs text-warm-gray-light uppercase tracking-widest mb-4 hover:text-vermillion transition-colors"
      >
        Line by line &uarr;
      </button>
      <div className="space-y-5">
        {lines.map((line, i) => (
          <div key={i} className="text-center">
            <p className="font-[var(--font-serif-zh)] text-ink text-xl">{line.zh}</p>
            <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mt-0.5">
              {line.jyutping}
            </p>
            <p className="font-[var(--font-serif-en)] text-ink-light text-base mt-1">
              {line.en}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
