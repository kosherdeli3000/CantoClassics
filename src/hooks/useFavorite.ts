import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useFavorite(poemId: string | undefined) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!poemId) return
    supabase
      .from('favorites')
      .select('id')
      .eq('poem_id', poemId)
      .single()
      .then(({ data }) => {
        setIsFavorited(!!data)
      })
  }, [poemId])

  const toggle = useCallback(async () => {
    if (!poemId || loading) return
    setLoading(true)

    if (isFavorited) {
      await supabase.from('favorites').delete().eq('poem_id', poemId)
      setIsFavorited(false)
    } else {
      await supabase.from('favorites').insert({ poem_id: poemId })
      setIsFavorited(true)
    }

    setLoading(false)
  }, [poemId, isFavorited, loading])

  return { isFavorited, toggleFavorite: toggle }
}
