import { useEffect } from 'react'

const CHINESE_DAYS: Record<number, string> = {
  0: '星期日',
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
}

interface Props {
  onDismiss: () => void
}

export function WelcomeScreen({ onDismiss }: Props) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 3500)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const dayOfWeek = new Date().getDay()
  const chineseDay = CHINESE_DAYS[dayOfWeek]

  return (
    <div
      className="fixed inset-0 z-50 bg-parchment flex flex-col items-center justify-center cursor-pointer gap-3"
      onClick={onDismiss}
    >
      <p className="font-[var(--font-serif-zh)] text-ink-light text-xl text-center px-12">
        你好，我的愛。
      </p>
      <p className="font-[var(--font-serif-zh)] text-warm-gray text-lg text-center px-12">
        今天{chineseDay}
      </p>
    </div>
  )
}
