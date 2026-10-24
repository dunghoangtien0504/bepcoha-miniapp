import { useEffect, useState } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import { RewardCard } from '../components/RewardCard'
import { COURSE, LINKS } from '../content'
import { dayMonth as date } from '../lib/format'
import { platform } from '../platform'
import { useMini } from '../state'

const CLAIM_STATUS = { cho_duyet: 'Đang kiểm tra', da_khop: 'Đã ghép', tu_choi: 'Không ghép được' } as const

// ⑥ "Của tôi". Phiên chưa xác minh: server chỉ trả dữ liệu do chính phiên tạo ra (không lịch sử đơn, địa chỉ).
export function MePage() {
  const { session, me, api, refreshMe, track } = useMini()
  const navigate = useNavigate()
  const [revoked, setRevoked] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [revokeError, setRevokeError] = useState<string | null>(null)

  const hasSession = !!session
  useEffect(() => {
    if (!hasSession) navigate('/', { replace: true, animate: false })
    else void refreshMe()
  }, [hasSession, navigate, refreshMe])

  if (!session) return null

  const shareCode = async () => {
    if (!me?.referral_code) return
    track('share_click', { from: 'me' })
    const base = LINKS.publicUrl || window.location.origin + import.meta.env.BASE_URL
    await platform.share({ title: COURSE.title, text: `Cô Hạ tặng khoá “${COURSE.title}”, miễn phí:`, url: `${base}?ref=${encodeURIComponent(me.referral_code)}` })
  }

  // Không dùng window.confirm/alert: webview của Zalo có thể chặn hộp thoại hệ thống.
  const revoke = async () => {
    setRevokeError(null)
    try {
      await api.revokeConsent()
      track('consent_revoke')
      setRevoked(true)
    } catch {
      setRevokeError('Chưa huỷ được, chị nhắn Cô Hạ giúp nhé.')
    }
  }

  return (
    <Page className="page">
      <h2>Của tôi</h2>
      <div className="card">
        <div>
          Số điện thoại: <b>{session.phone_masked}</b>
        </div>
        <div className={`badge ${session.verified ? 'badge-ok' : ''}`}>{session.verified ? 'Đã xác minh' : 'Chưa xác minh'}</div>
        {!session.verified && (
          <p className="muted small">
            Chị đã mua hàng của Bếp?{' '}
            <button className="text-link" onClick={() => navigate('/nhap-ma-don')}>
              Nhập mã đơn
            </button>{' '}
            để Cô xác nhận đúng số của chị.
          </p>
        )}
      </div>

      {(me?.rewards.length ?? 0) > 0 && <h3>Ưu đãi</h3>}
      {me?.rewards.map(r => <RewardCard key={r.code} reward={r} />)}

      {(me?.claims.length ?? 0) > 0 && (
        <>
          <h3>Mã đơn đã gửi</h3>
          <ul className="plain">
            {me!.claims.map(c => (
              <li key={c.id}>
                {date(c.created_at)} · {CLAIM_STATUS[c.status]}
              </li>
            ))}
          </ul>
        </>
      )}

      {me?.referral_code && (
        <div className="card">
          <div className="card-title">Rủ bạn học cùng</div>
          <p className="muted small">Gửi link khoá học cho bạn bè. Mã của chị: <b>{me.referral_code}</b></p>
          <Button size="small" onClick={shareCode}>
            Gửi link cho bạn
          </Button>
        </div>
      )}

      <div className="footer-actions">
        {revoked ? (
          <p className="muted small">Cô đã ghi nhận: không nhắn tin, gọi điện chăm sóc nữa.</p>
        ) : confirming ? (
          <div className="card">
            <p className="small">Chị muốn Cô ngừng nhắn tin và gọi điện chăm sóc? Chị vẫn học tiếp được bình thường.</p>
            <div className="two-choices">
              <Button size="small" variant="secondary" onClick={() => setConfirming(false)}>
                Không
              </Button>
              <Button size="small" type="danger" onClick={revoke}>
                Ngừng nhận tin
              </Button>
            </div>
            {revokeError && <div className="error">{revokeError}</div>}
          </div>
        ) : (
          <button className="text-link" onClick={() => setConfirming(true)}>
            Ngừng nhận tin chăm sóc
          </button>
        )}
      </div>
    </Page>
  )
}
