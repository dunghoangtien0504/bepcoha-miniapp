import { Button, useNavigate } from 'zmp-ui'
import { money } from '../lib/format'
import { daysLeft, usableVouchers } from '../lib/wallet'
import { useMini } from '../state'

// Ví ưu đãi ngay trang chủ (học McDonald's / Starbucks): khách có voucher thì thấy ngay, kèm số ngày còn lại.
export function WalletCard() {
  const { me, track } = useMini()
  const navigate = useNavigate()
  const list = usableVouchers(me?.rewards ?? [])
  if (!list.length) return null
  const first = list[0]
  const left = daysLeft(first.expires_at)

  return (
    <div className="card wallet-card">
      <div className="wallet-amount">−{money(first.amount)}</div>
      <div className="wallet-info">
        <b>{list.length > 1 ? `Chị có ${list.length} ưu đãi` : 'Chị có 1 ưu đãi'}</b>
        <span className="muted small">
          Mã {first.code}
          {left !== null ? (left <= 3 ? ` · chỉ còn ${left} ngày` : ` · còn ${left} ngày`) : ''}
        </span>
      </div>
      <Button
        size="small"
        onClick={() => {
          track('wallet_use', { code: first.code })
          navigate('/dat-hang')
        }}
      >
        Dùng ngay
      </Button>
    </div>
  )
}
