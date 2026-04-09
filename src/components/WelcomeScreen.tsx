import { useEffect } from 'react'

interface Props {
  onDismiss: () => void
}

export function WelcomeScreen({ onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <div
      className="fixed inset-0 z-50 bg-parchment flex items-center justify-center cursor-pointer"
      onClick={onDismiss}
    >
      <p className="font-[var(--font-serif-en)] italic text-ink-light text-lg text-center px-12 leading-relaxed">
        A poem, just for you, every morning.
      </p>
    </div>
  )
}
