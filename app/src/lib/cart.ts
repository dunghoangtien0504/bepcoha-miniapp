// Giỏ hàng lưu trên máy (chỉ mã hàng + số lượng, không có dữ liệu cá nhân). Giá luôn lấy từ server khi tính tiền.
import type { CartLine } from '../api/types'

export const MAX_QTY_LINE = 20
export const MAX_LINES = 10

export function addToCart(cart: CartLine[], sku: string, qty = 1): CartLine[] {
  const found = cart.find(l => l.sku === sku)
  if (found) return setQty(cart, sku, found.qty + qty)
  if (cart.length >= MAX_LINES) return cart
  return [...cart, { sku, qty: Math.min(MAX_QTY_LINE, Math.max(1, qty)) }]
}

/** qty ≤ 0 thì bỏ món khỏi giỏ. */
export function setQty(cart: CartLine[], sku: string, qty: number): CartLine[] {
  if (qty <= 0) return cart.filter(l => l.sku !== sku)
  return cart.map(l => (l.sku === sku ? { ...l, qty: Math.min(MAX_QTY_LINE, Math.floor(qty)) } : l))
}

export const cartCount = (cart: CartLine[]) => cart.reduce((n, l) => n + l.qty, 0)

/** Đọc giỏ đã lưu; dữ liệu hỏng hoặc mã hàng không còn bán thì bỏ qua. */
export function parseCart(raw: string | null, known: (sku: string) => boolean = () => true): CartLine[] {
  try {
    const v = JSON.parse(raw || '[]')
    if (!Array.isArray(v)) return []
    let out: CartLine[] = []
    for (const l of v) {
      if (typeof l?.sku === 'string' && Number.isInteger(l.qty) && l.qty > 0 && known(l.sku)) out = addToCart(out, l.sku, l.qty)
    }
    return out
  } catch {
    return []
  }
}
