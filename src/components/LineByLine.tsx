import { useState } from 'react'
import type { LineByLine as LineByLineType } from '../types/poem'

interface Props {
  lines: LineByLineType[]
  visible: boolean
  onToggle: () => void
}

export function LineByLine({ lines, visible, onToggle }: Props) {
  const [activeLine, setActiveLine] = useState<number | null>(null)

  return (
    <div className="mt-6 mb-4 border-t border-rule pt-5">
      <button
        onClick={onToggle}
        className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-4 hover:text-vermillion transition-colors flex items-center gap-1"
      >
        Line by line {visible ? '−' : '↓'}
      </button>
      {visible && (
        <div className="reveal-enter space-y-3">
          {lines.map((line, i) => (
            <button
              key={i}
              onClick={() => setActiveLine(activeLine === i ? null : i)}
              className={`
                w-full text-center rounded-lg px-4 py-3
                transition-all duration-200 ease-out cursor-pointer
                ${activeLine === i
                  ? 'bg-parchment-dark'
                  : 'hover:bg-parchment-dark/50'
                }
              `}
            >
              <p className="font-[var(--font-serif-zh)] text-ink text-xl">{line.zh}</p>
              <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mt-0.5">
                {line.jyutping}
              </p>
              <p className="font-[var(--font-serif-en)] text-ink-light text-base mt-1">
                {line.en}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
