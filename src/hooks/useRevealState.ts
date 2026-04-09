import { useState, useCallback } from 'react'

export type RevealLayer = 'translation' | 'lineByLine' | 'vocabulary' | 'context'

const LAYERS: RevealLayer[] = ['translation', 'lineByLine', 'vocabulary', 'context']

export function useRevealState() {
  const [revealed, setRevealed] = useState<Set<RevealLayer>>(new Set())

  const nextLayer = LAYERS.find((l) => !revealed.has(l)) ?? null

  const revealNext = useCallback(() => {
    setRevealed((prev) => {
      const next = LAYERS.find((l) => !prev.has(l))
      if (!next) return prev
      const updated = new Set(prev)
      updated.add(next)
      return updated
    })
  }, [])

  const toggleLayer = useCallback((layer: RevealLayer) => {
    setRevealed((prev) => {
      const updated = new Set(prev)
      if (updated.has(layer)) {
        updated.delete(layer)
      } else {
        updated.add(layer)
      }
      return updated
    })
  }, [])

  const reset = useCallback(() => {
    setRevealed(new Set())
  }, [])

  return {
    revealed,
    nextLayer,
    revealNext,
    toggleLayer,
    reset,
    isRevealed: (layer: RevealLayer) => revealed.has(layer),
  }
}
