import { useState, useEffect } from 'react'

const MESSAGES = [
  'finding today\'s poem...',
  'thinking of you...',
  'hi.',
]

interface Props {
  date: string
}

export function LoadingState({ date }: Props) {
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    setMessageIndex(0)
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [date])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <p
        key={messageIndex}
        className="font-[var(--font-serif-en)] text-warm-gray text-base italic reveal-enter"
      >
        {MESSAGES[messageIndex]}
      </p>
      <div className="flex gap-1.5">
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '0ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '300ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '600ms' }} />
      </div>
    </div>
  )
}
