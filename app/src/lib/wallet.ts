// Ví ưu đãi trên trang chủ (học McDonald's / Starbucks: coupon nằm ngay màn đầu, có đếm ngày hết hạn).
import type { CartLine, OrderLine, Reward } from '../api/types'

const DAY_MS = 86400000

/** Voucher còn dùng được, sắp hết hạn đứng trước; voucher không hạn đứng cuối. */
export function usableVouchers(rewards: Reward[], now: Date = new Date()): Reward[] {
  const t = now.getTime()
  return rewards
    .filter(r => r.kind === 'voucher' && r.status === 'da_cap' && (!r.expires_at || Date.parse(r.expires_at) > t))
    .sort((a, b) => (a.expires_at ? Date.parse(a.expires_at) : Infinity) - (b.expires_at ? Date.parse(b.expires_at) : Infinity))
}

/** Số ngày còn lại (làm tròn lên); null khi không có hạn. */
export function daysLeft(expiresAt: string | null, now: Date = new Date()): number | null {
  if (!expiresAt) return null
  return Math.max(0, Math.ceil((Date.parse(expiresAt) - now.getTime()) / DAY_MS))
}

/**
 * "Đặt lại" 1 chạm (học Luckin / McDonald's "đặt lại đơn trước"): lấy các món của đơn cũ còn đang bán.
 * Chỉ lấy mã hàng + số lượng; giá luôn tính lại ở server khi vào giỏ.
 */
export function reorderLines(items: OrderLine[], known: (sku: string) => boolean): { lines: CartLine[]; skipped: string[] } {
  const lines: CartLine[] = []
  const skipped: string[] = []
  for (const i of items) {
    if (known(i.sku)) lines.push({ sku: i.sku, qty: i.qty })
    else skipped.push(i.label)
  }
  return { lines, skipped }
}
