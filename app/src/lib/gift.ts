// "Gửi tặng người thân" (học Starbucks China "Say it with Starbucks" — quà kèm lời nhắn gửi qua WeChat).
// Server chưa có cột riêng cho quà tặng, nên thông tin người nhận đi trong ghi chú đơn (nhân viên đọc trên POScake
// và gọi người nhận khi giao). Khi phiên CRM thêm cột gift_* vào mini_orders thì chuyển sang gửi trường riêng.
import { normalizeVnPhone } from './phone'

export const GIFT_MESSAGE_MAX = 150

export interface GiftInput {
  toName: string
  toPhone: string
  message: string
}

export type GiftCheck = { ok: true; phone: string } | { ok: false; error: string }

export function checkGift(g: GiftInput): GiftCheck {
  if (g.toName.trim().length < 2) return { ok: false, error: 'Chị ghi tên người nhận quà giúp Cô nhé.' }
  const phone = normalizeVnPhone(g.toPhone)
  if (!phone) return { ok: false, error: 'Số điện thoại người nhận chưa đúng (10 số, bắt đầu bằng 0).' }
  if (g.message.length > GIFT_MESSAGE_MAX) return { ok: false, error: `Lời nhắn tối đa ${GIFT_MESSAGE_MAX} chữ.` }
  return { ok: true, phone }
}

/** Ghi chú đơn khi gửi tặng. Server cắt ghi chú ở 500 ký tự; phần quà đứng đầu để không bị cắt. */
export function giftNote(g: GiftInput, phone: string, note: string): string {
  const parts = [`[QUÀ TẶNG] Người nhận: ${g.toName.trim()} · SĐT ${phone}. Gọi người nhận khi giao, không báo giá cho người nhận.`]
  if (g.message.trim()) parts.push(`Lời nhắn in thiệp: “${g.message.trim()}”`)
  if (note.trim()) parts.push(`Ghi chú: ${note.trim()}`)
  return parts.join(' ')
}

/** Lời báo quà để khách tự gửi cho người nhận (Zalo / chia sẻ), không kèm giá. */
export function giftShareText(toName: string, message: string): string {
  const hi = toName.trim() ? `Gửi ${toName.trim()},` : 'Gửi bạn,'
  return [hi, message.trim() || 'Mình gửi tặng một phần quà từ Bếp Cô Hạ, Cô Hạ sẽ giao tận nơi nhé!', '— Quà từ Bếp Cô Hạ 🎁'].join('\n')
}

// Lời nhắn của đơn quà vừa đặt, chỉ giữ trong bộ nhớ (không ghi localStorage: tên người nhận là dữ liệu cá nhân)
// để trang cảm ơn hiện nút "Báo quà cho người nhận".
let lastGift: { ref: string; toName: string; message: string } | null = null
export const rememberGift = (g: { ref: string; toName: string; message: string }) => {
  lastGift = g
}
export const recallGift = (ref: string) => (lastGift?.ref === ref ? lastGift : null)
