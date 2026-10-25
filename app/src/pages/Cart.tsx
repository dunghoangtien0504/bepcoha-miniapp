import { useEffect, useState } from 'react'
import { Button, Input, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { ApiError, type Payment, type Quote } from '../api/types'
import { useCart } from '../cart'
import { asset } from '../content'
import { money } from '../lib/format'
import { GIFT_MESSAGE_MAX, checkGift, giftNote, rememberGift } from '../lib/gift'
import { missingFields, upsellFor } from '../lib/checkout'
import { useMini } from '../state'

// Giỏ hàng → đặt đơn (v2-B). Mọi con số hiển thị lấy từ server (/orders/quote); app không tự tính tiền.
// SĐT nhận hàng là SĐT đã đăng ký: đổi số thì đăng ký lại (voucher khoá theo số).
// v4 "Gửi tặng người thân" (học Starbucks "Say it with Starbucks"): giao tới người nhận, kèm lời nhắn.
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
  const [gift, setGift] = useState(false)
  const [toPhone, setToPhone] = useState('')
  const [giftMsg, setGiftMsg] = useState('')
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
  const missing = missingFields({ name, address, gift, toPhone })
  const canSubmit = !!quote && !sending && !missing.length
  const upsell = upsellFor(cart.lines, cart.catalog?.items ?? [])

  const submit = async () => {
    if (!quote) return
    let finalNote = note.trim()
    if (gift) {
      const g = { toName: name, toPhone, message: giftMsg }
      const ok = checkGift(g)
      if (!ok.ok) {
        setError(ok.error)
        return
      }
      finalNote = giftNote(g, ok.phone, note)
    }
    setSending(true)
    setError(null)
    try {
      const res = await api.placeOrder({
        items: cart.lines,
        voucher_code: voucher,
        use_points: quote.points?.used ?? 0,
        name: name.trim(),
        address: address.trim(),
        note: finalNote || undefined,
        payment,
        expected_total: quote.total,
      })
      cart.clear()
      if (gift) {
        rememberGift({ ref: res.order.ref_code, toName: name.trim(), message: giftMsg.trim() })
        track('gift_order', { ref: res.order.ref_code, message: !!giftMsg.trim() })
      }
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

      {/* Gợi ý mua kèm (phản biện CEO, theo bản đồ "bổ trợ tiếp theo" ở HACO-LOOP/06): tối đa 2 món chưa có trong giỏ. */}
      {upsell.length > 0 && (
        <div className="upsell">
          <div className="small muted">Hay mua kèm</div>
          {upsell.map(u => (
            <div key={u.item.sku} className="upsell-row">
              <img src={asset(u.item.image)} alt="" />
              <span className="upsell-text">
                <b>
                  {u.item.name} {u.item.variant}
                </b>
                <span className="muted small">{u.why}</span>
              </span>
              <button
                className="add-btn"
                aria-label={`Thêm ${u.item.name}`}
                onClick={() => {
                  cart.add(u.item.sku)
                  track('upsell_add', { sku: u.item.sku })
                }}
              >
                +
              </button>
            </div>
          ))}
        </div>
      )}

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
          <div className="two-choices">
            <button className={`choice ${!gift ? 'on' : ''}`} onClick={() => setGift(false)}>
              <b>Giao cho tôi</b>
            </button>
            <button className={`choice ${gift ? 'on' : ''}`} onClick={() => setGift(true)}>
              <b>🎁 Gửi tặng</b>
              <span className="small">Người thân, bạn bè</span>
            </button>
          </div>
          <div className="form">
            <div className="muted small">
              {gift ? 'Người đặt' : 'Số điện thoại'}: <b>{session.phone_masked}</b>
            </div>
            <Input
              label={gift ? 'Tên người nhận quà' : 'Tên người nhận'}
              type="text"
              autoComplete={gift ? 'off' : 'name'}
              value={name}
              onChange={e => setName(e.target.value)}
            />
            {gift && (
              <Input label="Số điện thoại người nhận" type="text" inputMode="tel" autoComplete="off" value={toPhone} onChange={e => setToPhone(e.target.value)} />
            )}
            <Input.TextArea
              label={gift ? 'Địa chỉ người nhận' : 'Địa chỉ nhận hàng'}
              placeholder="Số nhà, đường, phường/xã, tỉnh/thành"
              autoComplete={gift ? 'off' : 'street-address'}
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
            {gift && (
              <Input.TextArea
                label="Lời nhắn kèm quà (không bắt buộc)"
                placeholder="Chúc mẹ luôn khoẻ, con gửi mẹ set xôi cốm Cô Hạ…"
                maxLength={GIFT_MESSAGE_MAX}
                showCount
                value={giftMsg}
                onChange={e => setGiftMsg(e.target.value)}
              />
            )}
            <Input label="Ghi chú (không bắt buộc)" type="text" value={note} onChange={e => setNote(e.target.value)} />
            {gift && <p className="muted small">Cô Hạ gọi người nhận để hẹn giờ giao và không báo giá cho người nhận. Phí ship Cô báo cho chị.</p>}
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
          {missing.length > 0 && <div className="hint">Chị điền thêm: {missing.join(', ')}.</div>}
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
