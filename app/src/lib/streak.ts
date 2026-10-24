// Chuỗi ngày điểm danh (học từ Duolingo): đếm số ngày điểm danh liên tiếp theo giờ VN.
// "Giữ chuỗi": được lỡ 1 ngày mà không đứt chuỗi, tối đa 1 lần trong 7 ngày (đỡ nản khi quên 1 hôm).
// Server (Haco-OS lib/mini/checkin.ts) dùng cùng thuật toán — sửa ở đây thì sửa cả bên đó.

const DAY_MS = 86400000
const VN_OFFSET_MS = 7 * 3600 * 1000

export const MILESTONES = [3, 7, 14, 30] as const

/** 'YYYY-MM-DD' theo giờ Việt Nam. */
export function vnDay(d: Date = new Date()): string {
  return new Date(d.getTime() + VN_OFFSET_MS).toISOString().slice(0, 10)
}

const dayNum = (s: string) => Math.round(Date.parse(s + 'T00:00:00Z') / DAY_MS)

export interface StreakState {
  streak: number
  today_done: boolean
  /** Ngày bắt đầu chuỗi hiện tại (dùng làm khoá thưởng mốc, để chuỗi mới được thưởng lại). */
  chain_start: string | null
  /** Còn được lỡ 1 ngày không đứt chuỗi không. */
  freeze_available: boolean
  next_milestone: number | null
}

/** days: các ngày đã điểm danh ('YYYY-MM-DD'), thứ tự bất kỳ, có thể trùng. */
export function computeStreak(days: string[], today: string): StreakState {
  const uniq = [...new Set(days)].map(dayNum).sort((a, b) => b - a)
  const t = dayNum(today)
  const empty: StreakState = { streak: 0, today_done: false, chain_start: null, freeze_available: true, next_milestone: MILESTONES[0] }
  if (!uniq.length || uniq[0] > t) return empty

  let lastFreeze: number | null = null
  const freezeOk = (at: number) => lastFreeze === null || lastFreeze - at >= 7

  // Chuỗi còn sống nếu lần cuối là hôm nay, hôm qua, hoặc hôm kia (khi còn quyền giữ chuỗi).
  const gapToToday = t - uniq[0]
  if (gapToToday === 2) lastFreeze = t - 1
  else if (gapToToday > 2) return { ...empty }

  let streak = 1
  let start = uniq[0]
  for (let i = 1; i < uniq.length; i++) {
    const gap = uniq[i - 1] - uniq[i]
    if (gap === 1) {
      streak++
      start = uniq[i]
    } else if (gap === 2 && freezeOk(uniq[i - 1] - 1)) {
      lastFreeze = uniq[i - 1] - 1
      streak++
      start = uniq[i]
    } else break
  }
  const startStr = new Date(start * DAY_MS).toISOString().slice(0, 10)
  return {
    streak,
    today_done: uniq[0] === t,
    chain_start: startStr,
    freeze_available: freezeOk(t),
    next_milestone: MILESTONES.find(m => m > streak) ?? null,
  }
}
