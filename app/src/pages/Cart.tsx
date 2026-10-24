import { useEffect, useState } from 'react'
import { Button, Input, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { ApiError, type Payment, type Quote } from '../api/types'
import { useCart } from '../cart'
import { asset } from '../content'
import { money } from '../lib/format'
import { useMini } from '../state'

// Giỏ hàng → đặt đơn (v2-B). Mọi con số hiển thị lấy từ server (/orders/quote); app không tự tính tiền.
// SĐT nhận hàng là SĐT đã đăng ký: đổi số thì đăng ký lại (voucher khoá theo số).
export function CartPage() {
  const { session, me, api, refreshMe, track } = useMini()
  const cart = useCart()
  const navigate = useNavigate()
  const [voucher, setVoucher] = useState<string | null>(null)
  const [usePoints, setUsePoints] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoteError, setQuoteError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState<Payment>('cod')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const hasSession = !!session
  useEffect(() => {
    track('checkout_view', { lines: cart.lines.length })
    if (hasSession) void refreshMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSession])

  const linesKey = JSON.stringify(cart.lines)
  const pointsWanted = usePoints ? Number.MAX_SAFE_INTEGER : 0
  useEffect(() => {
    if (!hasSession || !cart.lines.length) {
      setQuote(null)
      return
    }
    let alive = true
    const t = setTimeout(() => {
      api.quote({ items: cart.lines, voucher_code: voucher, use_points: pointsWanted }).then(
        q => {
          if (!alive) return
          setQuote(q)
          setQuoteError(null)
        },
        (e: unknown) => {
          if (!alive) return
          if (e instanceof ApiError && e.code === 'voucher_invalid') setVoucher(null)
          setQuoteError(e instanceof ApiError ? e.message : 'Chưa tính được tiền, chị thử lại giúp Cô nhé.')
        },
      )
    }, 250)
    return () => {
      alive = false
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, hasSession, linesKey, voucher, pointsWanted])

  if (!cart.lines.length) {
    return (
      <Page className="page">
        <BackBar fallback="/dat-hang" />
        <h2>Giỏ hàng</h2>
        <p className="muted">Giỏ hàng đang trống.</p>
        <Button onClick={() => navigate('/dat-hang')}>Chọn hàng</Button>
      </Page>
    )
  }

  const vouchers = (me?.rewards ?? []).filter(r => r.kind === 'voucher' && r.status === 'da_cap')
  const canSubmit = !!quote && !sending && name.trim().length >= 2 && address.trim().length >= 10

  const submit = async () => {
    if (!quote) return
    setSending(true)
    setError(null)
    try {
      const res = await api.placeOrder({
        items: cart.lines,
        voucher_code: voucher,
        use_points: quote.points?.used ?? 0,
        name: name.trim(),
        address: address.trim(),
        note: note.trim() || undefined,
        payment,
        expected_total: quote.total,
      })
      cart.clear()
      void refreshMe()
      navigate(`/don-hang/${res.order.ref_code}`, { replace: true })
    } catch (e) {
      if (e instanceof ApiError && e.code === 'price_changed' && e.data.quote) setQuote(e.data.quote as Quote)
      setError(e instanceof ApiError ? e.message : 'Chưa gửi được đơn, chị thử lại giúp Cô nhé.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Page className="page page-with-cart">
      <BackBar fallback="/dat-hang" />
      <h2>Giỏ hàng</h2>
      <div className="cart-lines">
        {cart.lines.map(l => {
          const item = cart.item(l.sku)
          return (
            <div key={l.sku} className="cart-line">
              {item && <img src={asset(item.image)} alt="" />}
              <div className="cart-line-info">
                <b>{item ? `${item.name} ${item.variant}` : l.sku}</b>
                {item && <span className="muted small">{money(item.price)}</span>}
                <div className="stepper">
                  <button aria-label="Bớt 1" onClick={() => cart.set(l.sku, l.qty - 1)}>
                    −
                  </button>
                  <span>{l.qty}</span>
                  <button aria-label="Thêm 1" onClick={() => cart.set(l.sku, l.qty + 1)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <button className="text-link" onClick={() => navigate('/dat-hang')}>
        + Chọn thêm hàng
      </button>

      {!session ? (
        <div className="card">
          <p>Chị đăng ký số điện thoại để Cô Hạ giao hàng và gọi xác nhận nhé.</p>
          <Button onClick={() => navigate('/dang-ky?next=/gio-hang')}>Đăng ký để đặt hàng</Button>
        </div>
      ) : (
        <>
          {vouchers.length > 0 && (
            <>
              <h3>Ưu đãi</h3>
              <div className="chips">
                {vouchers.map(v => (
                  <button key={v.code} className={`chip ${voucher === v.code ? 'on' : ''}`} onClick={() => setVoucher(voucher === v.code ? null : v.code)}>
                    {v.code} · −{money(v.amount)}
                  </button>
                ))}
              </div>
            </>
          )}

          {quote?.points && quote.points.usable > 0 && (
            <label className="check-row">
              <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} />
              <span>
                Dùng {quote.points.usable} Hạt Cốm (−{money(quote.points.usable * quote.points.vnd_per_point)})
              </span>
            </label>
          )}
          {!session.verified && cart.catalog?.redeem && (me?.points ?? 0) > 0 && (
            <p className="muted small">
              Chị có {me!.points} Hạt Cốm.{' '}
              <button className="text-link" onClick={() => navigate('/nhap-ma-don')}>
                Xác nhận số điện thoại
              </button>{' '}
              để dùng Hạt Cốm trừ vào đơn.
            </p>
          )}

          <h3>Giao tới</h3>
          <div className="form">
            <div className="muted small">
              Số điện thoại: <b>{session.phone_masked}</b>
            </div>
            <Input label="Tên người nhận" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} />
            <Input.TextArea
              label="Địa chỉ nhận hàng"
              placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
              autoComplete="street-address"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            <Input label="Ghi chú (không bắt buộc)" type="text" value={note} onChange={e => setNote(e.target.value)} />
          </div>

          <h3>Thanh toán</h3>
          <div className="two-choices">
            <button className={`choice ${payment === 'cod' ? 'on' : ''}`} onClick={() => setPayment('cod')}>
              <b>Khi nhận hàng</b>
              <span className="small">COD</span>
            </button>
            <button className={`choice ${payment === 'chuyen_khoan' ? 'on' : ''}`} onClick={() => setPayment('chuyen_khoan')}>
              <b>Chuyển khoản</b>
              <span className="small">Quét mã QR</span>
            </button>
          </div>

          {quote && (
            <div className="card summary">
              <div className="row">
                <span>Tạm tính</span>
                <span>{money(quote.subtotal)}</span>
              </div>
              {quote.voucher && (
                <div className="row">
                  <span>Ưu đãi {quote.voucher.code}</span>
                  <span>−{money(quote.voucher.amount)}</span>
                </div>
              )}
              {quote.points && quote.points.used > 0 && (
                <div className="row">
                  <span>{quote.points.used} Hạt Cốm</span>
                  <span>−{money(quote.points.amount)}</span>
                </div>
              )}
              <div className="row total">
                <span>Tổng</span>
                <span>{money(quote.total)}</span>
              </div>
              <p className="muted small">{quote.shipping_note}</p>
            </div>
          )}
          {quoteError && <div className="error">{quoteError}</div>}
          {error && <div className="error">{error}</div>}

          <div className="sticky-cta">
            <Button fullWidth loading={sending} disabled={!canSubmit} onClick={submit}>
              {quote ? `Đặt hàng · ${money(quote.total)}` : 'Đặt hàng'}
            </Button>
          </div>
        </>
      )}
    </Page>
  )
}
