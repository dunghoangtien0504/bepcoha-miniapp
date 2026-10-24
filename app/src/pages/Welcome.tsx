import { useEffect } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import { BRAND, COURSE, LESSONS } from '../content'
import { useMini } from '../state'

// ① Trang chào sau khi quét QR. Quà hẹp, đúng một lời mời (B4 K10, Dũng 2:51): khoá học xôi cốm.
export function WelcomePage() {
  const { session, track } = useMini()
  const navigate = useNavigate()

  useEffect(() => {
    if (session) navigate('/hoc', { replace: true, animate: false })
    else track('welcome_view')
  }, [session, navigate, track])

  return (
    <Page className="page page-welcome">
      <div className="hero">
        <div className="brand">{BRAND.name}</div>
        <div className="brand-sub">{BRAND.tagline}</div>
        {COURSE.introVideoUrl ? (
          <video className="hero-video" src={COURSE.introVideoUrl} controls playsInline preload="metadata" />
        ) : (
          <div className="hero-video placeholder">Video chào của Cô Hạ</div>
        )}
        <h1>Cô Hạ tặng chị khoá “{COURSE.title}”</h1>
        <p>{COURSE.subtitle}</p>
      </div>
      <ol className="lesson-preview">
        {LESSONS.map(l => (
          <li key={l.no}>
            <span className="num">{l.no}</span> {l.title}
          </li>
        ))}
      </ol>
      <div className="sticky-cta">
        <Button fullWidth onClick={() => navigate('/dang-ky?next=/hoc')}>
          Nhận khoá học miễn phí
        </Button>
      </div>
    </Page>
  )
}
