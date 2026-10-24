import { useNavigate } from 'zmp-ui'
import { TIERS, tierOf } from '../lib/tiers'
import { useMini } from '../state'

// Thẻ hạng thành viên (học Starbucks: luôn thấy "còn bao nhiêu nữa để lên hạng").
// Server cũ chưa trả points_earned thì không hiện, tránh hiện sai hạng.
export function TierCard({ link = false }: { link?: boolean }) {
  const { me } = useMini()
  const navigate = useNavigate()
  if (!me || me.points_earned === undefined) return null
  const t = tierOf(me.points_earned)
  const level = TIERS.indexOf(t.current) + 1

  const body = (
    <>
      <div className="tier-head">
        <span className="tier-badge">Hạng {level}</span>
        <b>{t.current.name}</b>
        <span className="muted small tier-earned">Đã tích {me.points_earned} Hạt Cốm</span>
      </div>
      <div className="tier-bar" aria-label={`Tiến độ lên hạng ${t.pct}%`}>
        <span style={{ width: `${t.pct}%` }} />
      </div>
      <div className="muted small">{t.next ? `Còn ${t.toNext} Hạt Cốm nữa để lên ${t.next.name}` : 'Chị đã ở hạng cao nhất của Bếp Cô Hạ'}</div>
    </>
  )
  return link ? (
    <button className="card tier-card" onClick={() => navigate('/hat-com')}>
      {body}
    </button>
  ) : (
    <div className="card tier-card">{body}</div>
  )
}
