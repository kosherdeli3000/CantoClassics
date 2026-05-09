import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

/**
 * Returns all Thursday dates that have a poem in the database, ordered
 * most-recent first. Used by the prev/next navigation so the buttons
 * jump between actual poems instead of stepping week-by-week.
 */
export function usePoemDates(): { dates: string[]; loading: boolean } {
  const [dates, setDates] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await supabase
        .from('poems')
        .select('date')
        .order('date', { ascending: false })

      if (cancelled) return

      if (error || !data) {
        setDates([])
      } else {
        setDates(data.map((row: { date: string }) => row.date))
      }
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { dates, loading }
}
