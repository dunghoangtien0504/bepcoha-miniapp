import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Page, useNavigate } from 'zmp-ui'
import { ApiError } from '../api/types'
import { COURSE, LESSONS, LINKS } from '../content'
import { COMPLETE_PCT } from '../lib/lessons'
import { platform } from '../platform'
import { useMini } from '../state'

// Mốc gửi tiến độ xem: không gửi mỗi giây, chỉ khi vượt mốc.
const MILESTONES = [25, 50, 75, COMPLETE_PCT, 100]

export function LessonPage() {
  const { no: noParam } = useParams()
  const no = Number(noParam)
  const lesson = LESSONS.find(l => l.no === no)
  const { api, me, session, track, refreshMe } = useMini()
  const navigate = useNavigate()
  const state = me?.lessons.find(l => l.no === no)
  const [pct, setPct] = useState(state?.watched_pct ?? 0)
  const [done, setDone] = useState(!!state && state.watched_pct >= COMPLETE_PCT)
  const [error, setError] = useState<string | null>(null)
  const sent = useRef(new Set<number>())

  const ok = !!session && !!lesson
  useEffect(() => {
    if (!ok) navigate('/hoc', { replace: true, animate: false })
    else track('lesson_open', { no })
  }, [ok, no, navigate, track])

  if (!lesson || !session) return null

  const report = async (value: number) => {
    const milestone = MILESTONES.filter(m => value >= m).pop()
    if (milestone === undefined || sent.current.has(milestone)) return
    sent.current.add(milestone)
    try {
      const res = await api.lessonProgress(no, milestone)
      setPct(res.watched_pct)
      if (res.completed_at && !done) {
        setDone(true)
        track('lesson_complete', { no })
        void refreshMe()
      }
    } catch (err) {
      sent.current.delete(milestone)
      if (err instanceof ApiError && err.code === 'not_unlocked') setError(err.message)
    }
  }

  const onTime = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget
    if (v.duration > 0) void report((v.currentTime / v.duration) * 100)
  }

  const buyCombo = () => {
    track('combo_click', { no })
    if (LINKS.combo) void platform.openExternal(LINKS.combo)
  }

  const share = async () => {
    track('share_click', { from: 'lesson', no })
    const url = LINKS.publicUrl || window.location.origin + import.meta.env.BASE_URL
    await platform.share({ title: COURSE.title, text: `Mình đang học “${COURSE.title}”, miễn phí. Chị em học cùng nhé:`, url })
  }

  const next = LESSONS.find(l => l.no === no + 1)
  const nextOpen = next && me?.lessons.some(l => l.no === next.no)

  return (
    <Page className="page">
      <div className="muted small">Bài {lesson.no}/{LESSONS.length}</div>
      <h2>{lesson.title}</h2>
      {lesson.videoUrl ? (
        <video className="lesson-video" src={lesson.videoUrl} controls playsInline preload="metadata" onTimeUpdate={onTime} onEnded={() => void report(100)} />
      ) : (
        <div className="lesson-video placeholder">
          Video bài này đang được Cô Hạ quay.
          {/* Chưa có video: cho đánh dấu đã xem để thử luồng (bỏ khi có video thật). */}
          {!done && (
            <Button size="small" variant="secondary" onClick={() => void report(100)}>
              Đánh dấu đã xem
            </Button>
          )}
        </div>
      )}
      {pct > 0 && !done && <div className="muted small">Đã xem {pct}%</div>}
      {error && <div className="error">{error}</div>}

      {lesson.ingredients.length > 0 && (
        <div className="card">
          <div className="card-title">Nguyên liệu trong bài</div>
          <ul className="plain">
            {lesson.ingredients.map(i => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {done ? (
        // Trang cảm ơn 2 lựa chọn (B4 Z15): không ai đi ra tay không — rủ bạn học cùng, hoặc mua đủ bộ để làm.
        <div className="card card-done">
          <div className="card-title">Chị đã xong bài {lesson.no} 🎉</div>
          <p className="muted small">{next ? (nextOpen ? `Bài ${next.no} đã mở.` : `Bài ${next.no} sẽ mở vào ngày mai.`) : 'Chị đã học hết khoá. Cô cảm ơn chị!'}</p>
          <div className="two-choices">
            <Button variant="secondary" onClick={share}>
              Rủ bạn học cùng
            </Button>
            {LINKS.combo ? <Button onClick={buyCombo}>Mua nguyên liệu</Button> : <Button onClick={() => navigate('/hoc')}>Về danh sách</Button>}
          </div>
        </div>
      ) : (
        LINKS.combo && (
          <Button variant="tertiary" fullWidth onClick={buyCombo}>
            Mua combo nguyên liệu để làm theo
          </Button>
        )
      )}
      {nextOpen && done && (
        <Button fullWidth onClick={() => navigate(`/hoc/${no + 1}`)}>
          Học bài {no + 1}
        </Button>
      )}
    </Page>
  )
}
