// Hạng thành viên theo tổng Hạt Cốm đã TÍCH (không trừ khi tiêu) — học Starbucks Rewards / McDonald's / Heytea.
// Mốc lấy từ THIET-KE-v3-CONG-DONG.md mục 3.2. Hạng chỉ là danh hiệu: quà theo hạng chờ Cô Hạ chốt
// (quà theo hạng là chương trình khách hàng thường xuyên, cần thông báo khuyến mại), nên app không hứa quà.

export interface Tier {
  key: string
  name: string
  from: number
}

export const TIERS: Tier[] = [
  { key: 'tap_su', name: 'Tập sự', from: 0 },
  { key: 'dam_dang', name: 'Đảm đang', from: 200 },
  { key: 'kheo_tay', name: 'Khéo tay', from: 600 },
  { key: 'bep_pho', name: 'Bếp phó', from: 1500 },
  { key: 'bep_truong', name: 'Bếp trưởng', from: 4000 },
]

export interface TierState {
  current: Tier
  next: Tier | null
  /** Còn bao nhiêu Hạt Cốm nữa để lên hạng sau (0 khi đã ở hạng cao nhất). */
  toNext: number
  /** Tiến độ trong hạng hiện tại, 0–100. */
  pct: number
}

export function tierOf(earned: number): TierState {
  const e = Math.max(0, Math.floor(Number.isFinite(earned) ? earned : 0))
  let i = 0
  while (i + 1 < TIERS.length && e >= TIERS[i + 1].from) i++
  const current = TIERS[i]
  const next = TIERS[i + 1] ?? null
  if (!next) return { current, next, toNext: 0, pct: 100 }
  return { current, next, toNext: next.from - e, pct: Math.floor(((e - current.from) / (next.from - current.from)) * 100) }
}
