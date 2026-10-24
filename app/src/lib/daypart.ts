// Trang chủ đổi theo bữa trong ngày (học McDonald's: menu sáng/trưa/tối khác nhau trên app).
// Chị em mở app lúc 10 giờ sáng là để nghĩ bữa trưa, lúc 4 giờ chiều là để nghĩ bữa tối — gợi ý đúng bữa.

export type Daypart = 'sang' | 'trua' | 'chieu' | 'toi'

export interface DaypartInfo {
  key: Daypart
  greeting: string
  /** Tiêu đề khối gợi ý món trên trang chủ. */
  title: string
}

const INFO: Record<Daypart, DaypartInfo> = {
  sang: { key: 'sang', greeting: 'Chào buổi sáng chị', title: 'Bữa trưa nay nấu gì?' },
  trua: { key: 'trua', greeting: 'Chào buổi trưa chị', title: 'Món nhanh cho bữa trưa' },
  chieu: { key: 'chieu', greeting: 'Chào buổi chiều chị', title: 'Tối nay nấu gì?' },
  toi: { key: 'toi', greeting: 'Chào buổi tối chị', title: 'Ngày mai nấu gì?' },
}

/** Giờ hiện tại theo giờ Việt Nam (0–23). */
export function vnHour(d: Date = new Date()): number {
  return (d.getUTCHours() + 7) % 24
}

export function daypart(hour: number): DaypartInfo {
  if (hour >= 4 && hour < 10) return INFO.sang
  if (hour >= 10 && hour < 13) return INFO.trua
  if (hour >= 13 && hour < 18) return INFO.chieu
  return INFO.toi
}

/** Chọn món theo bữa từ danh sách: lọc theo luật của bữa, đổi mỗi ngày; không có món hợp thì lấy cả danh sách. */
export function pickForDaypart<T extends { category: string; minutes: number }>(list: T[], part: Daypart, vnDayStr: string): T | undefined {
  const rules: Record<Daypart, (r: T) => boolean> = {
    // Sáng nghĩ bữa trưa, chiều và tối nghĩ bữa cơm gia đình: món mặn, canh, rau.
    sang: r => ['mon-man', 'canh', 'rau-goi'].includes(r.category),
    trua: r => r.minutes <= 30,
    chieu: r => ['mon-man', 'canh', 'rau-goi', 'mon-chay'].includes(r.category),
    toi: r => ['mon-man', 'canh', 'xoi-com', 'che-banh'].includes(r.category),
  }
  const pool = list.filter(rules[part])
  const from = pool.length ? pool : list
  if (!from.length) return undefined
  const n = Math.round(Date.parse(vnDayStr + 'T00:00:00Z') / 86400000)
  // Lệch theo bữa để 4 bữa trong cùng một ngày không ra trùng món.
  const offset = { sang: 0, trua: 3, chieu: 5, toi: 7 }[part]
  return from[(((n + offset) % from.length) + from.length) % from.length]
}
