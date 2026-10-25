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

type Pickable = { slug?: string; category: string; minutes: number }

// Sáng nghĩ bữa trưa, chiều và tối nghĩ bữa cơm gia đình: món mặn, canh, rau.
const RULES: Record<Daypart, (r: Pickable) => boolean> = {
  sang: r => ['mon-man', 'canh', 'rau-goi'].includes(r.category),
  trua: r => r.minutes <= 30,
  chieu: r => ['mon-man', 'canh', 'rau-goi', 'mon-chay'].includes(r.category),
  // Tối nghĩ bữa cơm ngày mai: chỉ món mặn, canh, rau (không gợi ý chè — phản biện của khách nội trợ).
  toi: r => ['mon-man', 'canh', 'rau-goi'].includes(r.category),
}
// Lệch theo bữa để 4 bữa trong cùng một ngày không ra trùng món.
const OFFSET: Record<Daypart, number> = { sang: 0, trua: 3, chieu: 5, toi: 7 }

/** Món hợp bữa; không có món nào hợp thì lấy cả danh sách. */
const poolFor = <T extends Pickable>(list: T[], part: Daypart) => {
  const pool = list.filter(RULES[part])
  return pool.length ? pool : list
}
const startIndex = (len: number, part: Daypart, vnDayStr: string) => {
  const n = Math.round(Date.parse(vnDayStr + 'T00:00:00Z') / 86400000) + OFFSET[part]
  return ((n % len) + len) % len
}

/** Chọn món theo bữa từ danh sách, đổi mỗi ngày. */
export function pickForDaypart<T extends Pickable>(list: T[], part: Daypart, vnDayStr: string): T | undefined {
  const from = poolFor(list, part)
  return from.length ? from[startIndex(from.length, part, vnDayStr)] : undefined
}

/** Nhiều món theo bữa cho dải cuộn ngang: bắt đầu từ món của bữa hôm nay, bỏ món trong `skip`. */
export function pickManyForDaypart<T extends Pickable & { slug: string }>(list: T[], part: Daypart, vnDayStr: string, count: number, skip: string[] = []): T[] {
  const from = poolFor(list, part)
  if (!from.length) return []
  const start = startIndex(from.length, part, vnDayStr)
  const out: T[] = []
  for (let i = 0; i < from.length && out.length < count; i++) {
    const r = from[(start + i) % from.length]
    if (!skip.includes(r.slug)) out.push(r)
  }
  return out
}
