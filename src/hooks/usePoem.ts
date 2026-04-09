import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { getThursday, getDayKey, todayStr } from '../lib/dates'
import type { Poem, DayKey } from '../types/poem'

interface UsePoemResult {
  poem: Poem | null
  dayKey: DayKey
  loading: boolean
  error: string | null
  retry: () => void
}

export function usePoem(weekDate: string): UsePoemResult {
  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const thursday = getThursday(weekDate)
  const dayKey = getDayKey(todayStr())

  async function fetchPoem() {
    setLoading(true)
    setError(null)

    try {
      // Try to get from DB directly using the Thursday date
      const { data: existing } = await supabase
        .from('poems')
        .select('*')
        .eq('date', thursday)
        .single()

      if (existing) {
        setPoem(existing as Poem)
        setLoading(false)
        return
      }

      // If not found, call the edge function to generate
      const { data, error: fnError } = await supabase.functions.invoke(
        'generate-poem',
        { body: { date: weekDate } }
      )

      if (fnError) throw new Error(fnError.message)
      if (data?.error) throw new Error(data.error)

      setPoem(data as Poem)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load poem')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoem()
  }, [thursday])

  return { poem, dayKey, loading, error, retry: fetchPoem }
}
