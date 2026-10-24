import { useEffect, useState } from 'react'
import { Button, useNavigate, useSnackbar } from 'zmp-ui'
import type { Order } from '../api/types'
import { useCart } from '../cart'
import { dayMonth } from '../lib/format'
import { reorderLines } from '../lib/wallet'
import { useMini } from '../state'

/** "Đặt lại" 1 chạm (học Luckin / McDonald's): bỏ các món của đơn cũ vào giỏ rồi mở giỏ. */
export function useReorder() {
  const cart = useCart()
  const { track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()

  return (order: Order, from: string) => {
    if (!cart.catalog) {
      openSnackbar({ type: 'error', text: 'Chưa tải xong danh sách hàng, chị thử lại sau giây lát nhé.', duration: 2500 })
      return
    }
    const { lines, skipped } = reorderLines(order.items, sku => !!cart.item(sku))
    if (!lines.length) {
      openSnackbar({ type: 'error', text: 'Các món trong đơn này đã ngừng bán, chị chọn món khác giúp Cô nhé.', duration: 3000 })
      navigate('/dat-hang')
      return
    }
    for (const l of lines) cart.add(l.sku, l.qty)
    track('reorder', { from, ref: order.ref_code, lines: lines.length, skipped: skipped.length })
    if (skipped.length) openSnackbar({ text: `Đã bỏ qua món ngừng bán: ${skipped.join(', ')}`, duration: 3000 })
    navigate('/gio-hang')
  }
}

/** Thẻ trang chủ: đơn gần nhất + nút đặt lại. Chỉ hiện khi khách đã có đơn đặt trong app. */
export function ReorderCard() {
  const { api, session } = useMini()
  const reorder = useReorder()
  const [last, setLast] = useState<Order | null>(null)

  const hasSession = !!session
  useEffect(() => {
    if (!hasSession) return
    let alive = true
    api.orders().then(
      r => alive && setLast(r.orders.find(o => o.status !== 'huy') ?? null),
      () => undefined, // không có đơn hoặc lỗi mạng: ẩn thẻ, trang chủ vẫn chạy
    )
    return () => {
      alive = false
    }
  }, [api, hasSession])

  if (!last) return null
  return (
    <div className="card reorder-card">
      <div className="reorder-info">
        <b>Đặt lại đơn {dayMonth(last.created_at)}</b>
        <span className="muted small">{last.items.map(l => `${l.label} × ${l.qty}`).join(', ')}</span>
      </div>
      <Button size="small" variant="secondary" onClick={() => reorder(last, 'home')}>
        Đặt lại
      </Button>
    </div>
  )
}
