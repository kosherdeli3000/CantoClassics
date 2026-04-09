export interface LineByLine {
  zh: string
  jyutping: string
  en: string
}

export interface VocabEntry {
  character: string
  jyutping: string
  meaning: string
  note?: string
}

export interface Poem {
  id: string
  date: string
  title_zh: string
  title_en: string
  author_zh: string
  author_en: string
  lines_zh: string[]
  lines_jyutping: string[]
  translation_en: string
  line_by_line: LineByLine[]
  vocabulary: VocabEntry[]
  author_bio: string
  poem_background: string
  literary_note: string
  sources: string[]
  season_hint: 'spring' | 'summer' | 'autumn' | 'winter' | null
  created_at: string
}

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
