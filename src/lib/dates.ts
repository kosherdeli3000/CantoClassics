import { DAY_KEYS, type DayKey } from '../types/poem'

/** Format a Date as YYYY-MM-DD */
export function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Today as YYYY-MM-DD */
export function todayStr(): string {
  return formatDate(new Date())
}

/** Get the Thursday that starts the week containing the given date.
 *  Our week runs Thu–Wed. */
export function getThursday(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay() // 0=Sun ... 4=Thu ... 6=Sat
  // Days since Thursday: Thu=0, Fri=1, Sat=2, Sun=3, Mon=4, Tue=5, Wed=6
  const offset = (day - 4 + 7) % 7
  d.setDate(d.getDate() - offset)
  return formatDate(d)
}

/** Shift a Thursday date by N weeks */
export function shiftWeek(thursdayStr: string, weeks: number): string {
  const d = new Date(thursdayStr + 'T00:00:00')
  d.setDate(d.getDate() + weeks * 7)
  return formatDate(d)
}

/** Get the day key (thu, fri, ...) for a given date */
export function getDayKey(dateStr: string): DayKey {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const offset = (day - 4 + 7) % 7
  return DAY_KEYS[offset]
}

/** Get the JS day-of-week index (0=Sun) for today */
export function todayDayIndex(): number {
  return new Date().getDay()
}
