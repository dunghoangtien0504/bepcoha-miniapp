// Hẹn giờ trong chế độ nấu: tính theo thời điểm kết thúc (không đếm tick), nên app bị ẩn rồi mở lại vẫn đúng giờ.

export const remainingSec = (endsAt: number, now: number = Date.now()) => Math.max(0, Math.ceil((endsAt - now) / 1000))

/** 75 → "01:15"; 3725 → "1:02:05". */
export function formatClock(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  const two = (n: number) => String(n).padStart(2, '0')
  return h ? `${h}:${two(m)}:${two(r)}` : `${two(m)}:${two(r)}`
}

/** 15 → "15 phút"; 90 → "1 tiếng 30 phút"; 120 → "2 tiếng". */
export function minutesLabel(min: number): string {
  if (min < 60) return `${min} phút`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} tiếng ${m} phút` : `${h} tiếng`
}
