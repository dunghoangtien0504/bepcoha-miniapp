import { useEffect, useState } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import type { Order } from '../api/types'
import { dayMonth, money } from '../lib/format'
import { useMini } from '../state'

// Đơn của tôi: đơn đặt trong Mini App. Phiên chưa xác minh chỉ thấy đơn đặt từ máy này (server lọc).
export function OrdersPage() {
  const { api, session } = useMini()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState(false)

  const hasSession = !!session
  useEffect(() => {
    if (!hasSession) return
    api.orders().then(r => setOrders(r.orders), () => setError(true))
  }, [api, hasSession])

  return (
    <Page className="page">
      <BackBar fallback="/cua-toi" />
      <h2>Đơn của tôi</h2>
      {!session && <p className="muted">Chị đăng ký số điện thoại để xem đơn nhé.</p>}
      {error && <p className="error">Chưa tải được đơn, chị thử lại sau nhé.</p>}
      {orders?.length === 0 && (
        <>
          <p className="muted">Chị chưa đặt đơn nào trong app.</p>
          <Button onClick={() => navigate('/dat-hang')}>Chọn hàng</Button>
        </>
      )}
      {orders?.map(o => (
        <button key={o.ref_code} className="card order-row" onClick={() => navigate(`/don-hang/${o.ref_code}`)}>
          <div className="row">
            <b>{dayMonth(o.created_at)} · {money(o.total)}</b>
            <span className="badge">{o.status_label}</span>
          </div>
          <div className="muted small">{o.items.map(l => `${l.label} × ${l.qty}`).join(', ')}</div>
          {o.payment === 'chuyen_khoan' && (
            <div className="muted small">{o.payment_status === 'da_tra' ? 'Đã chuyển khoản' : 'Chờ chuyển khoản'}</div>
          )}
        </button>
      ))}
    </Page>
  )
}
