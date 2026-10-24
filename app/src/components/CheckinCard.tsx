import { useState } from 'react'
import { Button, useNavigate, useSnackbar } from 'zmp-ui'
import { ApiError } from '../api/types'
import { MILESTONES } from '../lib/streak'
import { useMini } from '../state'

// Điểm danh hằng ngày + chuỗi ngày (học Duolingo). Quà theo mốc là cố định, KHÔNG may rủi
// (vòng quay/bốc thăm là khuyến mại may rủi, phải đăng ký Sở Công Thương).
export function CheckinCard() {
  const { session, me, api, refreshMe, track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const [busy, setBusy] = useState(false)

  if (!session || !me) {
    return (
      <div className="card checkin">
        <div className="checkin-head">
          <div>
            <div className="card-title">Điểm danh mỗi ngày</div>
            <div className="muted small">Nhận Hạt Cốm, giữ chuỗi để mở quà của Cô Hạ.</div>
          </div>
          <Button size="small" onClick={() => navigate('/dang-ky?next=/')}>
            Bắt đầu
          </Button>
        </div>
      </div>
    )
  }

  const c = me.checkin
  const nextBonus = c.next_milestone ? me.points_rules.milestones[String(c.next_milestone)] : undefined
  const goal = c.next_milestone ?? MILESTONES[MILESTONES.length - 1]
  const filled = Math.min(c.streak, goal)

  const doCheckin = async () => {
    setBusy(true)
    track('checkin', { streak: c.streak })
    try {
      const res = await api.checkin()
      const total = res.earned.reduce((a, e) => a + e.points, 0)
      const milestone = res.earned.find(e => e.reason === 'moc_chuoi')
      openSnackbar({
        type: 'success',
        text: milestone ? `Chuỗi ${milestone.milestone} ngày! +${total} Hạt Cốm` : total ? `+${total} Hạt Cốm. Hẹn chị ngày mai nhé` : 'Hôm nay chị đã điểm danh rồi',
        duration: 3000,
      })
      await refreshMe()
    } catch (e) {
      openSnackbar({ type: 'error', text: e instanceof ApiError ? e.message : 'Chưa điểm danh được, chị thử lại nhé', duration: 3000 })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card checkin">
      <div className="checkin-head">
        <div>
          <div className="card-title">{c.today_done ? 'Đã điểm danh hôm nay' : 'Điểm danh hôm nay'}</div>
          <div className="muted small">
            Chuỗi {c.streak} ngày
            {c.next_milestone ? ` · còn ${c.next_milestone - c.streak} ngày tới quà${nextBonus ? ` +${nextBonus}` : ''}` : ' · đã qua mọi mốc'}
          </div>
        </div>
        <Button size="small" disabled={c.today_done} loading={busy} onClick={doCheckin}>
          {c.today_done ? 'Xong' : `+${me.points_rules.checkin}`}
        </Button>
      </div>
      <div className="streak-bar" aria-label={`Chuỗi ${c.streak} trên ${goal} ngày`}>
        {Array.from({ length: Math.min(goal, 14) }, (_, i) => (
          <span key={i} className={i < (goal > 14 ? Math.round((filled / goal) * 14) : filled) ? 'on' : ''} />
        ))}
      </div>
      {c.freeze_available && c.streak > 0 && <div className="muted small">Lỡ 1 ngày vẫn giữ chuỗi (1 lần mỗi tuần).</div>}
    </div>
  )
}
