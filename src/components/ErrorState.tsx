interface Props {
  onRetry: () => void
}

export function ErrorState({ onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="font-[var(--font-serif-en)] text-warm-gray text-base italic text-center px-8">
        No poem arrived today — try again in a moment?
      </p>
      <button
        onClick={onRetry}
        className="
          font-[var(--font-serif-en)] text-sm
          text-vermillion hover:text-vermillion-light
          transition-colors duration-200
          py-2 px-6
          border border-vermillion/30 rounded-full
          hover:border-vermillion/50
        "
      >
        try again
      </button>
    </div>
  )
}
