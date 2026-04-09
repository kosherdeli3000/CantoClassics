import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Poem } from '../types/poem'

export function usePoem(date: string) {
  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchPoem() {
    setLoading(true)
    setError(null)

    try {
      // First try to get from DB directly
      const { data: existing } = await supabase
        .from('poems')
        .select('*')
        .eq('date', date)
        .single()

      if (existing) {
        setPoem(existing as Poem)
        setLoading(false)
        return
      }

      // If not found, call the edge function to generate
      const { data, error: fnError } = await supabase.functions.invoke(
        'generate-poem',
        { body: { date } }
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
  }, [date])

  return { poem, loading, error, retry: fetchPoem }
}
