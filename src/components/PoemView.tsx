import type { Poem } from '../types/poem'
import { useRevealState } from '../hooks/useRevealState'
import { useFavorite } from '../hooks/useFavorite'
import { DateHeader } from './DateHeader'
import { JyutpingToggle } from './JyutpingToggle'
import { PoemLines } from './PoemLines'
import { FavoriteButton } from './FavoriteButton'
import { Translation } from './Translation'
import { LineByLine } from './LineByLine'
import { Vocabulary } from './Vocabulary'
import { Context } from './Context'
import { RevealLink } from './RevealLink'
import { PoemIllustration } from './PoemIllustration'

interface Props {
  poem: Poem
  jyutpingOn: boolean
  toggleJyutping: () => void
  showFirstLabel: boolean
}

export function PoemView({ poem, jyutpingOn, toggleJyutping, showFirstLabel }: Props) {
  const { isRevealed, nextLayer, revealNext, toggleLayer } = useRevealState()
  const { isFavorited, toggleFavorite } = useFavorite(poem.id)

  return (
    <article className="px-6 pt-8 pb-20 max-w-[480px] mx-auto min-h-dvh relative">
      <PoemIllustration imageUrl={poem.image_url} />
      <div className="relative">
      <DateHeader date={poem.date} />

      {/* Jyutping toggle — below date, right-aligned */}
      <div className="flex justify-end mb-4 -mt-2">
        <JyutpingToggle
          isOn={jyutpingOn}
          onToggle={toggleJyutping}
          showFirstLabel={showFirstLabel}
        />
      </div>

      {/* Title & Author */}
      <div className="text-center mb-2">
        <div className="flex items-center justify-center gap-3">
          <h1 className="font-[var(--font-serif-zh)] text-ink text-xl sm:text-2xl font-semibold">
            {poem.title_zh}
          </h1>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <p className="font-[var(--font-serif-zh)] text-warm-gray text-base">
            {poem.author_zh}
          </p>
          <FavoriteButton isFavorited={isFavorited} onToggle={toggleFavorite} />
        </div>
        <p className="font-[var(--font-serif-en)] text-warm-gray-light text-sm italic mt-0.5">
          {poem.title_en} — {poem.author_en}
        </p>
      </div>

      {/* Decorative rule */}
      <div className="flex justify-center my-4">
        <div className="w-10 h-px bg-vermillion/40" />
      </div>

      {/* Poem lines */}
      <PoemLines
        linesZh={poem.lines_zh}
        linesJyutping={poem.lines_jyutping}
        jyutpingOn={jyutpingOn}
      />

      {/* First reveal link — appears below poem if nothing revealed yet */}
      {!isRevealed('translation') && (
        <RevealLink nextLayer={nextLayer} onReveal={revealNext} />
      )}

      {/* Progressive layers — each collapsible, reveal link follows the last open section */}
      {isRevealed('translation') && (
        <>
          <Translation
            text={poem.translation_en}
            visible={isRevealed('translation')}
            onToggle={() => toggleLayer('translation')}
          />
          {!isRevealed('lineByLine') && (
            <RevealLink nextLayer={nextLayer} onReveal={revealNext} />
          )}
        </>
      )}

      {isRevealed('lineByLine') && (
        <>
          <LineByLine
            lines={poem.line_by_line}
            visible={isRevealed('lineByLine')}
            onToggle={() => toggleLayer('lineByLine')}
          />
          {!isRevealed('vocabulary') && (
            <RevealLink nextLayer={nextLayer} onReveal={revealNext} />
          )}
        </>
      )}

      {isRevealed('vocabulary') && (
        <>
          <Vocabulary
            words={poem.vocabulary}
            visible={isRevealed('vocabulary')}
            onToggle={() => toggleLayer('vocabulary')}
          />
          {!isRevealed('context') && (
            <RevealLink nextLayer={nextLayer} onReveal={revealNext} />
          )}
        </>
      )}

      {isRevealed('context') && (
        <Context
          poem={poem}
          visible={isRevealed('context')}
          onToggle={() => toggleLayer('context')}
        />
      )}
      </div>
    </article>
  )
}
