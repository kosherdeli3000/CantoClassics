const CHINESE_MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

const CHINESE_DAYS = [
  '', '一日', '二日', '三日', '四日', '五日', '六日', '七日', '八日', '九日', '十日',
  '十一日', '十二日', '十三日', '十四日', '十五日', '十六日', '十七日', '十八日', '十九日', '二十日',
  '二十一日', '二十二日', '二十三日', '二十四日', '二十五日', '二十六日', '二十七日', '二十八日', '二十九日', '三十日', '三十一日',
]

interface Props {
  date: string
}

export function DateHeader({ date }: Props) {
  const d = new Date(date + 'T00:00:00')
  const month = d.getMonth()
  const day = d.getDate()

  const zhDate = `${CHINESE_MONTHS[month]}${CHINESE_DAYS[day]}`
  const enDate = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <header className="text-center mb-8">
      <p className="font-[var(--font-serif-zh)] text-warm-gray text-lg tracking-widest">
        {zhDate}
      </p>
      <p className="font-[var(--font-serif-en)] text-warm-gray-light text-sm mt-1">
        {enDate}
      </p>
    </header>
  )
}
