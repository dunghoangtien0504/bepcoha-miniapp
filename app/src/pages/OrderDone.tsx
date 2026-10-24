import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { ApiError, type OrderRes } from '../api/types'
import { OAFollowCard } from '../components/OAFollowCard'
import { fullDate, money } from '../lib/format'
import { useMini } from '../state'

const POLL_MS = 5000
const POLL_MAX = 120 // ~10 phút

// Trang cảm ơn sau khi đặt (B4 Dũng: thank-you có lựa chọn tiếp theo) và xem lại 1 đơn.
// Đơn chuyển khoản: hiện mã QR, hỏi lại server mỗi 5 giây tới khi SePay báo đã nhận tiền.
export function OrderDonePage() {
  const { ref = '' } = useParams()
  const { api, session } = useMini()
  const navigate = useNavigate()
  const [data, setData] = useState<OrderRes | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const hasSession = !!session
  useEffect(() => {
    if (!hasSession) return
    let alive = true
    let tries = 0
    let timer: ReturnType<typeof setTimeout> | undefined
    const load = async () => {
      try {
        const res = await api.order(ref)
        if (!alive) return
        setData(res)
        if (res.qr && ++tries < POLL_MAX) timer = setTimeout(load, POLL_MS)
      } catch (e) {
        if (alive) setError(e instanceof ApiError ? e.message : 'Chưa tải được đơn.')
      }
    }
    void load()
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [api, ref, hasSession])

  if (!session) {
    return (
      <Page className="page">
        <BackBar fallback="/don-hang" />
        <p className="muted">Chị đăng ký số điện thoại để xem đơn nhé.</p>
      </Page>
    )
  }
  if (error) {
    return (
      <Page className="page">
        <BackBar fallback="/don-hang" />
        <p className="error">{error}</p>
        <Button onClick={() => navigate('/don-hang')}>Đơn của tôi</Button>
      </Page>
    )
  }
  if (!data) return <Page className="page"><p className="muted">Đang tải…</p></Page>

  const { order, qr } = data
  const paid = order.payment === 'chuyen_khoan' && order.payment_status === 'da_tra'
  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(order.ref_code)
      setCopied(true)
    } catch {
      // trình duyệt chặn clipboard: khách tự chép mã đang hiện
    }
  }

  return (
    <Page className="page">
      <BackBar fallback="/don-hang" />
      <div className="card card-done">
        <div className="card-title">{order.status === 'huy' ? 'Đơn đã huỷ' : 'Cô Hạ đã nhận đơn của chị'}</div>
        <div className="muted small">
          Mã đơn <b>{order.ref_code}</b> · {fullDate(order.created_at)}
        </div>
        {order.payment === 'cod' && order.status !== 'huy' && (
          <p>Cô sẽ gọi số {order.phone_masked} để xác nhận và báo phí ship. Chị trả tiền khi nhận hàng.</p>
        )}
        {paid && <p>Cô đã nhận được tiền chuyển khoản. Cô sẽ gọi xác nhận và báo phí ship.</p>}
      </div>

      {qr && (
        <div className="card qr-card">
          <div className="card-title">Chuyển khoản {money(qr.amount)}</div>
          {qr.qrUrl && <img className="qr" src={qr.qrUrl} alt="Mã QR chuyển khoản" />}
          <div className="small">
            {qr.bankCode} · {qr.bankAccount} · {qr.accountName}
          </div>
          <div className="small">
            Nội dung: <b>{qr.content}</b>{' '}
            <button className="text-link" onClick={copyRef}>
              {copied ? 'Đã chép' : 'Chép'}
            </button>
          </div>
          <p className="muted small">Giữ đúng nội dung để Cô ghép tiền vào đơn. Trang này tự cập nhật khi Cô nhận được tiền. Phí ship Cô báo sau.</p>
        </div>
      )}

      <h3>Đơn hàng</h3>
      <ul className="plain">
        {order.items.map(l => (
          <li key={l.sku}>
            {l.label} × {l.qty} · {money(l.unit_price * l.qty)}
          </li>
        ))}
      </ul>
      <div className="card summary">
        {(order.voucher_amount > 0 || order.points_amount > 0) && (
          <div className="row">
            <span>Đã giảm</span>
            <span>−{money(order.voucher_amount + order.points_amount)}</span>
          </div>
        )}
        <div className="row total">
          <span>Tổng (chưa gồm ship)</span>
          <span>{money(order.total)}</span>
        </div>
        <div className="muted small">Trạng thái: {order.status_label}</div>
      </div>

      <OAFollowCard />
      <div className="two-choices">
        <Button variant="secondary" onClick={() => navigate('/cong-thuc')}>
          Xem công thức
        </Button>
        <Button variant="secondary" onClick={() => navigate('/')}>
          Về trang chủ
        </Button>
      </div>
    </Page>
  )
}
