interface Props {
  linesZh: string[]
  linesJyutping: string[]
  jyutpingOn: boolean
}

export function PoemLines({ linesZh, linesJyutping, jyutpingOn }: Props) {
  return (
    <div className="flex flex-col items-center my-8">
      {linesZh.map((line, i) => (
        <div key={i} className={`text-center ${jyutpingOn ? 'mb-8' : 'mb-2'}`} style={{ transition: 'margin 250ms ease' }}>
          <p className="font-[var(--font-serif-zh)] text-ink text-[28px] sm:text-[32px] leading-[1.8] tracking-wider">
            {line}
          </p>
          <div
            className={`overflow-hidden transition-all duration-250 ease-out ${
              jyutpingOn ? 'max-h-8 opacity-100 mt-1.5' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="font-[var(--font-serif-en)] italic text-warm-gray text-sm">
              {linesJyutping[i]}
            </p>
          </div>
        </div>
      ))}
      {jyutpingOn && (
        <p className="font-[var(--font-serif-en)] text-warm-gray-light text-[11px] mt-2 italic">
          粵拼由 AI 生成，或有偏差
        </p>
      )}
    </div>
  )
}
