import { useLocation } from 'react-router-dom'
import { useNavigate } from 'zmp-ui'
import { useCart } from '../cart'
import { money } from '../lib/format'
import { Glyph } from './Glyph'

const PAGES = ['/', '/dat-hang', '/cong-thuc', '/di-cho', '/di-cho-tuan']

// Thanh giỏ hàng nổi trên thanh tab (học DoorDash / Uber Eats / McDonald's): có hàng trong giỏ là luôn thấy đường đi thanh toán.
// Số tiền chỉ là tạm tính theo giá đang hiện; tổng thật (voucher, Hạt Cốm) do server tính ở Giỏ hàng.
export function CartBar() {
  const cart = useCart()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  if (!cart.count || !PAGES.includes(pathname)) return null
  const subtotal = cart.lines.reduce((n, l) => n + (cart.item(l.sku)?.price ?? 0) * l.qty, 0)

  return (
    <button className="cart-bar" onClick={() => navigate('/gio-hang')}>
      <span className="cart-bar-icon">
        <Glyph name="bag" size={20} />
        <i>{cart.count}</i>
      </span>
      <span className="cart-bar-text">
        <b>Xem giỏ hàng</b>
        <small>{cart.count} món</small>
      </span>
      <span className="cart-bar-total">{money(subtotal)} ›</span>
    </button>
  )
}
