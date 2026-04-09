export function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="font-[var(--font-serif-en)] text-warm-gray text-base italic">
        finding today's poem
      </p>
      <div className="flex gap-1.5">
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '0ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '300ms' }} />
        <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-warm-gray" style={{ animationDelay: '600ms' }} />
      </div>
    </div>
  )
}
