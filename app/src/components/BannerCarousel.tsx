import { useRef, useState } from 'react'
import { useNavigate } from 'zmp-ui'
import { BANNERS, COURSE_READY, asset } from '../content'
import { useMini } from '../state'

// Banner trượt ngang có chấm chỉ trang (kiểu McDonald's / Shopee). Cuộn bằng tay, không tự chạy để khỏi giật khi khách đang đọc.
export function BannerCarousel() {
  const navigate = useNavigate()
  const { track } = useMini()
  const slides = BANNERS.filter(b => COURSE_READY || b.to !== '/khoa-hoc')
  const ref = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const onScroll = () => {
    const el = ref.current
    if (el) setI(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)))
  }
  return (
    <div className="banner-wrap">
      <div className="banner-track" ref={ref} onScroll={onScroll}>
        {slides.map(b => (
          <button
            key={b.title}
            className="banner"
            onClick={() => {
              track('banner_click', { to: b.to })
              navigate(b.to)
            }} style={{ backgroundImage: `url("${asset(b.image)}")` }}>
            <span className="banner-text">
              <b>{b.title}</b>
              <span>{b.subtitle}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="banner-dots" aria-hidden="true">
        {slides.map((b, k) => (
          <span key={b.title} className={k === i ? 'on' : ''} />
        ))}
      </div>
    </div>
  )
}
