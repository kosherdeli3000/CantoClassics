import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Poem } from '../types/poem'

interface Props {
  onBack: () => void
  onSelectPoem: (thursdayDate: string) => void
}

export function FavoritesPage({ onBack, onSelectPoem }: Props) {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('favorites')
        .select('poem_id, poems(*)')
        .order('favorited_at', { ascending: false })

      if (data) {
        const favorites = data
          .map((f: any) => f.poems)
          .filter(Boolean) as Poem[]
        setPoems(favorites)
      }
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="min-h-dvh bg-parchment px-6 pt-8 pb-20 max-w-[480px] mx-auto">
      <button
        onClick={onBack}
        className="font-[var(--font-serif-en)] italic text-warm-gray text-sm hover:text-vermillion transition-colors mb-8"
      >
        &larr; back
      </button>

      <h1 className="font-[var(--font-serif-en)] italic text-ink-light text-lg text-center mb-8">
        poems I loved
      </h1>

      {loading && (
        <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm text-center">
          loading...
        </p>
      )}

      {!loading && poems.length === 0 && (
        <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm text-center">
          no favorites yet — tap the heart on a poem you love
        </p>
      )}

      {!loading && poems.length > 0 && (
        <div className="space-y-6">
          {poems.map((poem) => (
            <button
              key={poem.id}
              onClick={() => onSelectPoem(poem.date)}
              className="w-full text-left py-4 border-b border-rule hover:bg-parchment-dark/30 transition-colors rounded-lg px-3 -mx-3 cursor-pointer"
            >
              <p className="font-[var(--font-serif-zh)] text-ink text-lg">
                {poem.title_zh}
              </p>
              <p className="font-[var(--font-serif-zh)] text-warm-gray text-sm mt-0.5">
                {poem.author_zh}
              </p>
              <p className="font-[var(--font-serif-en)] italic text-warm-gray-light text-xs mt-1">
                {poem.title_en} — {poem.author_en}
              </p>
              <p className="font-[var(--font-serif-zh)] text-ink-light text-base mt-2 leading-relaxed">
                {poem.lines_zh[0]}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
