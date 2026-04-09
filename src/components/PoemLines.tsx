interface Props {
  linesZh: string[]
  linesJyutping: string[]
  jyutpingOn: boolean
}

export function PoemLines({ linesZh, linesJyutping, jyutpingOn }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 my-8">
      {linesZh.map((line, i) => (
        <div key={i} className="text-center">
          <p className="font-[var(--font-serif-zh)] text-ink text-2xl sm:text-3xl leading-relaxed tracking-wider">
            {line}
          </p>
          <div
            className={`overflow-hidden transition-all duration-250 ease-out ${
              jyutpingOn ? 'max-h-8 opacity-100 mt-1' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm">
              {linesJyutping[i]}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
