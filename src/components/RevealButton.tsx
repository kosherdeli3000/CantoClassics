import type { RevealLayer } from '../hooks/useRevealState'

const LAYER_LABELS: Record<RevealLayer, string> = {
  translation: 'reveal translation',
  lineByLine: 'line-by-line breakdown',
  vocabulary: 'vocabulary',
  context: 'context & history',
}

interface Props {
  nextLayer: RevealLayer | null
  onReveal: () => void
}

export function RevealButton({ nextLayer, onReveal }: Props) {
  if (!nextLayer) return null

  return (
    <button
      onClick={onReveal}
      className="
        mx-auto block mt-8 mb-4
        text-warm-gray hover:text-vermillion
        text-sm font-[var(--font-serif-en)] italic
        transition-colors duration-200
        py-2 px-4
      "
    >
      {LAYER_LABELS[nextLayer]} &darr;
    </button>
  )
}
