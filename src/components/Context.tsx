import { ShareButton } from './ShareButton'
import type { Poem } from '../types/poem'

interface Props {
  poem: Poem
  visible: boolean
  onToggle: () => void
}

export function Context({ poem, visible, onToggle }: Props) {
  return (
    <div className="mt-6 mb-8 border-t border-rule pt-5 text-left">
      <button
        onClick={onToggle}
        className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-4 hover:text-vermillion transition-colors flex items-center gap-1"
      >
        About this poem {visible ? '−' : '↓'}
      </button>

      {visible && (
        <div className="reveal-enter">
          <section className="mb-5">
            <h3 className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-2">
              About the poet
            </h3>
            <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed">
              {poem.author_bio}
            </p>
          </section>

          <section className="mb-5">
            <h3 className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-2">
              Background
            </h3>
            <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed">
              {poem.poem_background}
            </p>
          </section>

          <section className="mb-5">
            <h3 className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-2">
              A note on the craft
            </h3>
            <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed italic">
              {poem.literary_note}
            </p>
          </section>

          {poem.sources.length > 0 && (
            <section className="mb-5">
              <h3 className="font-[var(--font-serif-en)] italic text-warm-gray text-sm mb-2">
                Sources
              </h3>
              <ul className="list-none space-y-0.5">
                {poem.sources.map((s, i) => (
                  <li
                    key={i}
                    className="font-[var(--font-serif-en)] text-warm-gray-light text-sm"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex justify-center pt-2">
            <ShareButton poem={poem} />
          </div>
        </div>
      )}
    </div>
  )
}
