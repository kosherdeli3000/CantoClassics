import type { Poem } from '../types/poem'
import { useRevealState } from '../hooks/useRevealState'
import { DateHeader } from './DateHeader'
import { PoemLines } from './PoemLines'
import { Translation } from './Translation'
import { LineByLine } from './LineByLine'
import { Vocabulary } from './Vocabulary'
import { Context } from './Context'
import { RevealButton } from './RevealButton'

interface Props {
  poem: Poem
  jyutpingOn: boolean
}

export function PoemView({ poem, jyutpingOn }: Props) {
  const { isRevealed, nextLayer, revealNext, toggleLayer } = useRevealState()

  return (
    <article className="px-6 py-8 max-w-md mx-auto">
      <DateHeader date={poem.date} />

      {/* Title & Author */}
      <div className="text-center mb-2">
        <h1 className="font-[var(--font-serif-zh)] text-ink text-xl sm:text-2xl font-semibold">
          {poem.title_zh}
        </h1>
        <p className="font-[var(--font-serif-zh)] text-warm-gray text-base mt-1">
          {poem.author_zh}
        </p>
        <p className="font-[var(--font-serif-en)] text-warm-gray-light text-sm italic mt-0.5">
          {poem.title_en} — {poem.author_en}
        </p>
      </div>

      {/* Decorative rule */}
      <div className="flex justify-center my-4">
        <div className="w-12 h-px bg-rule" />
      </div>

      {/* Poem lines */}
      <PoemLines
        linesZh={poem.lines_zh}
        linesJyutping={poem.lines_jyutping}
        jyutpingOn={jyutpingOn}
      />

      {/* Reveal button */}
      <RevealButton nextLayer={nextLayer} onReveal={revealNext} />

      {/* Progressive layers */}
      <Translation
        text={poem.translation_en}
        visible={isRevealed('translation')}
        onToggle={() => toggleLayer('translation')}
      />

      <LineByLine
        lines={poem.line_by_line}
        visible={isRevealed('lineByLine')}
        onToggle={() => toggleLayer('lineByLine')}
      />

      <Vocabulary
        words={poem.vocabulary}
        visible={isRevealed('vocabulary')}
        onToggle={() => toggleLayer('vocabulary')}
      />

      <Context
        authorBio={poem.author_bio}
        poemBackground={poem.poem_background}
        literaryNote={poem.literary_note}
        sources={poem.sources}
        visible={isRevealed('context')}
        onToggle={() => toggleLayer('context')}
      />
    </article>
  )
}
