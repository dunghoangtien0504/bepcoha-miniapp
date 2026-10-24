import { useEffect } from 'react'
import { Icon, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { OAFollowCard } from '../components/OAFollowCard'
import { RewardCard } from '../components/RewardCard'
import { COURSE, LESSONS } from '../content'
import { COMPLETE_PCT, describeUnlock, unlockAt } from '../lib/lessons'
import { useMini } from '../state'

// ③ Danh sách 8 bài; mỗi ngày mở 1 bài (server quyết, danh sách bài đã mở lấy từ /me).
export function CoursePage() {
  const { session, me, refreshMe } = useMini()
  const navigate = useNavigate()

  const hasSession = !!session
  useEffect(() => {
    if (!hasSession) navigate('/khoa-hoc', { replace: true, animate: false })
  }, [hasSession, navigate])
  // Làm mới khi mở trang (bài mới có thể vừa mở theo ngày). Không phụ thuộc `session` để tránh vòng lặp.
  useEffect(() => {
    if (hasSession) void refreshMe()
  }, [hasSession, refreshMe])

  if (!session) return null
  const opened = new Map((me?.lessons ?? []).map(l => [l.no, l]))
  const started = new Date(session.started_at)
  const activeRewards = (me?.rewards ?? []).filter(r => r.status === 'da_cap')
  const doneCount = [...opened.values()].filter(l => l.watched_pct >= COMPLETE_PCT).length

  return (
    <Page className="page">
      <BackBar fallback="/" />
      <h2>{COURSE.title}</h2>
      <div className="progress-line">
        <div className="bar">
          <div style={{ width: `${(doneCount / LESSONS.length) * 100}%` }} />
        </div>
        <span className="muted small">
          {doneCount}/{LESSONS.length} bài
        </span>
      </div>

      {activeRewards.map(r => (
        <RewardCard key={r.code} reward={r} />
      ))}
      <OAFollowCard />

      <ul className="lesson-list">
        {LESSONS.map(l => {
          const st = opened.get(l.no)
          const done = !!st && st.watched_pct >= COMPLETE_PCT
          return (
            <li key={l.no}>
              <button className={`lesson-row ${st ? '' : 'locked'}`} disabled={!st} onClick={() => navigate(`/hoc/${l.no}`)}>
                <span className={`num ${done ? 'done' : ''}`}>{done ? <Icon icon="zi-check" size={16} /> : l.no}</span>
                <span className="lesson-title">
                  {l.title}
                  {!st && <span className="muted small block">Mở {describeUnlock(unlockAt(started, l.no))}</span>}
                  {st && !done && st.watched_pct > 0 && <span className="muted small block">Đã xem {st.watched_pct}%</span>}
                </span>
                <Icon icon={st ? 'zi-play-solid' : 'zi-lock'} />
              </button>
            </li>
          )
        })}
      </ul>

      <button className="link-card" onClick={() => navigate('/nhap-ma-don')}>
        <b>Chị đã mua hàng của Bếp?</b>
        <span className="muted small block">Nhập mã đơn để Cô ghép đơn và giữ ưu đãi đúng cho chị.</span>
      </button>
    </Page>
  )
}
