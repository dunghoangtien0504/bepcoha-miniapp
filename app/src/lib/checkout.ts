// Giỏ hàng: báo khách còn thiếu gì (thay cho nút xám không rõ lý do) và gợi ý mua kèm.
import type { CartLine, CatalogItem } from '../api/types'

export function missingFields(f: { name: string; address: string; gift: boolean; toPhone: string }): string[] {
  const out: string[] = []
  if (f.name.trim().length < 2) out.push(f.gift ? 'tên người nhận quà' : 'tên người nhận')
  if (f.gift && f.toPhone.replace(/\D/g, '').length < 9) out.push('số điện thoại người nhận')
  if (f.address.trim().length < 10) out.push('địa chỉ đủ số nhà, phường/xã, tỉnh/thành')
  return out
}

// Bản đồ mua kèm theo cột "Bổ trợ tiếp theo" ở HACO-LOOP/06-DANH-MUC-TOP30.md, chỉ giữ món đang bán trong app.
// Khoá là trang sản phẩm (CatalogItem.product). Không gợi ý lại khăn cho người đã có khăn trong giỏ.
const PAIRS: Record<string, { product: string; why: string }[]> = {
  '/set-xoi-com': [{ product: '/khan-do-xoi', why: 'Lót chõ đồ xôi, xôi không dính, không nhão' }],
  '/khan-do-xoi': [{ product: '/set-xoi-com', why: 'Đủ nguyên liệu cho mâm xôi cốm sen dừa' }],
  '/sot-xa-xiu': [{ product: '/sot-tron-nom', why: 'Thêm đĩa nộm 5 phút cho bữa cơm' }],
  '/sot-tron-nom': [{ product: '/sot-xa-xiu', why: 'Thịt xá xíu áp chảo, ướp 1 lần là xong' }],
}

export function upsellFor(lines: CartLine[], items: CatalogItem[], max = 2): { item: CatalogItem; why: string }[] {
  const bySku = new Map(items.map(i => [i.sku, i]))
  const inCart = new Set(lines.map(l => bySku.get(l.sku)?.product).filter((p): p is string => !!p))
  const out: { item: CatalogItem; why: string }[] = []
  for (const p of inCart) {
    for (const pair of PAIRS[p] ?? []) {
      if (inCart.has(pair.product) || out.some(o => o.item.product === pair.product)) continue
      // Biến thể rẻ nhất của sản phẩm gợi ý.
      const item = items.filter(i => i.product === pair.product).sort((a, b) => a.price - b.price)[0]
      if (item) out.push({ item, why: pair.why })
      if (out.length >= max) return out
    }
  }
  return out
}
