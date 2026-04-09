interface Props {
  authorBio: string
  poemBackground: string
  literaryNote: string
  sources: string[]
  visible: boolean
  onToggle: () => void
}

export function Context({
  authorBio,
  poemBackground,
  literaryNote,
  sources,
  visible,
  onToggle,
}: Props) {
  if (!visible) return null

  return (
    <div className="reveal-enter mt-6 mb-8 border-t border-rule pt-6 text-left">
      <button
        onClick={onToggle}
        className="text-xs text-warm-gray-light uppercase tracking-widest mb-4 hover:text-vermillion transition-colors"
      >
        Context &uarr;
      </button>

      <section className="mb-5">
        <h3 className="font-[var(--font-serif-en)] text-warm-gray text-xs uppercase tracking-widest mb-2">
          About the poet
        </h3>
        <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed">
          {authorBio}
        </p>
      </section>

      <section className="mb-5">
        <h3 className="font-[var(--font-serif-en)] text-warm-gray text-xs uppercase tracking-widest mb-2">
          Background
        </h3>
        <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed">
          {poemBackground}
        </p>
      </section>

      <section className="mb-5">
        <h3 className="font-[var(--font-serif-en)] text-warm-gray text-xs uppercase tracking-widest mb-2">
          A note on the craft
        </h3>
        <p className="font-[var(--font-serif-en)] text-ink-light text-base leading-relaxed italic">
          {literaryNote}
        </p>
      </section>

      {sources.length > 0 && (
        <section>
          <h3 className="font-[var(--font-serif-en)] text-warm-gray text-xs uppercase tracking-widest mb-2">
            Sources
          </h3>
          <ul className="list-none space-y-0.5">
            {sources.map((s, i) => (
              <li
                key={i}
                className="font-[var(--font-serif-en)] text-warm-gray text-sm"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
