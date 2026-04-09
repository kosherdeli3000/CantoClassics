import type { RevealLayer } from '../hooks/useRevealState'

const LAYER_LABELS: Record<RevealLayer, string> = {
  translation: 'translation',
  lineByLine: 'line by line',
  vocabulary: 'vocabulary',
  context: 'about this poem',
}

interface Props {
  nextLayer: RevealLayer | null
  onReveal: () => void
}

export function RevealLink({ nextLayer, onReveal }: Props) {
  if (!nextLayer) return null

  return (
    <button
      onClick={onReveal}
      className="
        mx-auto block mt-8 mb-4
        text-vermillion hover:text-vermillion-light
        text-sm font-[var(--font-serif-en)] italic
        transition-colors duration-200
        py-2 px-4
      "
    >
      {LAYER_LABELS[nextLayer]} &darr;
    </button>
  )
}
