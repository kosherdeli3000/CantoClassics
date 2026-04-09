import { useState, useEffect } from 'react'

interface Props {
  date: string
}

export function LoadingState({ date }: Props) {
  const [showSecondary, setShowSecondary] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowSecondary(true), 5000)
    return () => clearTimeout(timer)
  }, [date])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p className="font-[var(--font-serif-en)] text-warm-gray text-base italic">
        finding today's poem...
      </p>
      <div className="flex gap-1.5">
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '0ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '300ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '600ms' }} />
      </div>
      {showSecondary && (
        <p className="font-[var(--font-serif-en)] text-warm-gray-light text-sm italic mt-2 reveal-enter">
          this may take a moment on the first visit
        </p>
      )}
    </div>
  )
}
