import type { DailyImages, DayKey } from '../types/poem'

interface Props {
  dailyImages: DailyImages | null
  dayKey: DayKey
}

export function PoemIllustration({ dailyImages, dayKey }: Props) {
  const imageUrl = dailyImages?.[dayKey] || dailyImages?.thu || null

  if (!imageUrl) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <img
        src={imageUrl}
        alt=""
        className="w-full h-full object-cover"
        style={{ opacity: 0.08 }}
        loading="eager"
      />
    </div>
  )
}
