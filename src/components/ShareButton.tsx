import { useState } from 'react'
import type { Poem } from '../types/poem'

interface Props {
  poem: Poem
}

export function ShareButton({ poem }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const text = [
      poem.title_zh,
      poem.author_zh,
      '',
      ...poem.lines_zh,
      '',
      poem.translation_en,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Fallback: do nothing gracefully
    }
  }

  return (
    <button
      onClick={handleShare}
      className="font-[var(--font-serif-en)] italic text-warm-gray text-sm hover:text-vermillion transition-colors duration-200"
    >
      {copied ? 'copied' : 'share'}
    </button>
  )
}
