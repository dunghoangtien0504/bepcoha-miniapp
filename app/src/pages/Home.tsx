import { useEffect, useState, type FormEvent } from 'react'
import { Icon, Page, useNavigate } from 'zmp-ui'
import { CheckinCard } from '../components/CheckinCard'
import { OAFollowCard } from '../components/OAFollowCard'
import { RecipeCard } from '../components/RecipeCard'
import { BANNER, BRAND, COURSE, LINKS, asset } from '../content'
import { vnDay } from '../lib/streak'
import { platform } from '../platform'
import { recipeOfTheDay } from '../recipes'
import { useMini } from '../state'

// Trang chủ kiểu "ngôi nhà" (học từ Mini App của group học + Starbucks/Duolingo/Luckin — xem NGHIEN-CUU-TOP5-VA-THIET-KE-v2.md).
// Lý do để mở app mỗi ngày là NỘI DUNG (món của hôm nay, điểm danh), không phải giảm giá.
export function HomePage() {
  const { session, me, track, refreshMe } = useMini()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const today = recipeOfTheDay(vnDay())

  const hasSession = !!session
  useEffect(() => {
    track('welcome_view', { page: 'home' })
    if (hasSession) void refreshMe()
  }, [hasSession, refreshMe, track])

  const search = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/cong-thuc${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`)
  }

  const chat = () => {
    track('chat_click', { from: 'home_tile' })
    if (LINKS.oaId) void platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, 'Cô ơi, cháu muốn hỏi về món ăn')
    else if (LINKS.messenger) void platform.openChat({ kind: 'url', url: LINKS.messenger })
  }

  const share = () => {
    track('share_click', { from: 'home_tile' })
    const base = LINKS.publicUrl || window.location.origin + import.meta.env.BASE_URL
    const url = me?.referral_code ? `${base}?ref=${encodeURIComponent(me.referral_code)}` : base
    void platform.share({ title: BRAND.name, text: `Bếp Cô Hạ có công thức nấu miễn phí và khoá “${COURSE.title}”. Chị em vào học cùng nhé:`, url })
  }

  const tiles: { icon: string; label: string; go: () => void }[] = [
    { icon: 'zi-note', label: 'Công thức', go: () => navigate('/cong-thuc') },
    { icon: 'zi-video', label: 'Khoá xôi cốm', go: () => navigate(session ? '/hoc' : '/khoa-hoc') },
    { icon: 'zi-bookmark', label: 'Sổ tay', go: () => navigate('/so-tay') },
    { icon: 'zi-star', label: 'Hạt Cốm', go: () => navigate('/hat-com') },
    { icon: 'zi-inbox', label: 'Quà của tôi', go: () => navigate('/cua-toi') },
    { icon: 'zi-chat', label: 'Hỏi Cô Hạ', go: chat },
    {
      icon: 'zi-group',
      label: 'Group bếp',
      go: () => {
        track('group_click')
        void platform.openExternal(LINKS.group)
      },
    },
    { icon: 'zi-share', label: 'Giới thiệu bạn', go: share },
  ]

  return (
    <Page className="page page-home">
      <header className="home-head">
        <div>
          <div className="brand">{BRAND.name}</div>
          <div className="brand-sub">{session ? 'Chào chị, hôm nay nấu gì nhỉ?' : BRAND.tagline}</div>
        </div>
        {me && (
          <button className="points-pill" onClick={() => navigate('/hat-com')}>
            <Icon icon="zi-star" size={16} /> {me.points} Hạt Cốm
          </button>
        )}
      </header>

      <button className="banner" onClick={() => navigate(BANNER.to)} style={{ backgroundImage: `url("${asset(BANNER.image)}")` }}>
        <span className="banner-text">
          <b>{BANNER.title}</b>
          <span>{BANNER.subtitle}</span>
        </span>
      </button>

      <OAFollowCard />
      <CheckinCard />

      <div className="section-title">Món của hôm nay</div>
      <RecipeCard recipe={today} badge="Hôm nay" />

      <form className="search" onSubmit={search} role="search">
        <Icon icon="zi-search" size={18} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm món, nguyên liệu…" aria-label="Tìm công thức" />
      </form>

      <div className="tile-grid">
        {tiles.map(t => (
          <button key={t.label} className="tile" onClick={t.go}>
            <Icon icon={t.icon as never} size={24} />
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <p className="muted small center">
        Xem thêm công thức trên{' '}
        <button className="text-link" onClick={() => void platform.openExternal(LINKS.youtube)}>
          YouTube Cô Hạ dạy nấu ăn
        </button>
      </p>
    </Page>
  )
}
