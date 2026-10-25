import { useEffect } from 'react'
import { Icon, Page, useNavigate } from 'zmp-ui'
import { AddToHomeCard } from '../components/AddToHomeCard'
import { BannerCarousel } from '../components/BannerCarousel'
import { Glyph, type GlyphName } from '../components/Glyph'
import { MemberCard } from '../components/MemberCard'
import { OAFollowCard } from '../components/OAFollowCard'
import { ProductRail, RecipeRail } from '../components/Rails'
import { RecipeCard } from '../components/RecipeCard'
import { ReorderCard } from '../components/Reorder'
import { UpcomingEvent } from '../components/UpcomingEvent'
import { WalletCard } from '../components/WalletCard'
import { BRAND, COURSE_READY, LINKS } from '../content'
import { daypart, pickManyForDaypart, vnHour } from '../lib/daypart'
import { money } from '../lib/format'
import { vnDay } from '../lib/streak'
import { IS_ZALO, platform } from '../platform'
import { RECIPES, recipeOfTheDay } from '../recipes'
import { useShopping } from '../shopping'
import { useMini } from '../state'
import { weekTotals } from '../weekly'

type Tile = { glyph: GlyphName; label: string; badge?: number; go: () => void }

// Trang chủ v6 (NANG-CAP-v6-PHAN-BIEN.md). Học Starbucks / McDonald's / DoorDash (v5), sửa theo phản biện:
// - Khách nội trợ: màn đầu phục vụ việc cần nhất (mua lại, nấu gì, đi chợ); thẻ Hạt Cốm gọn lại; không gợi ý chè cho bữa tối;
//   dải món ưu tiên món có ảnh thật.
// - CEO: "Đặt lại" và "Bán chạy" lên trên banner; bỏ ô Ưu đãi (đã có ví khi có voucher); ẩn khoá học khi chưa có video;
//   bản Zalo không mở nhóm Facebook (mục 4.1).
export function HomePage() {
  const { session, me, track, refreshMe } = useMini()
  const navigate = useNavigate()
  const shopping = useShopping()
  const day = vnDay()
  const part = daypart(vnHour())
  const today = recipeOfTheDay(day)
  const forMeal = pickManyForDaypart(RECIPES, part.key, day, 12, [today.slug])
    .sort((a, b) => Number(!!b.image) - Number(!!a.image))
    .slice(0, 6)
  const week = weekTotals()

  const hasSession = !!session
  useEffect(() => {
    track('home_view', { session: hasSession })
    if (hasSession) void refreshMe()
  }, [hasSession, refreshMe, track])

  const chat = () => {
    track('chat_click', { from: 'home_tile' })
    if (LINKS.oaId) void platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, 'Cô ơi, cháu muốn hỏi về món ăn')
    else if (LINKS.messenger) void platform.openChat({ kind: 'url', url: LINKS.messenger })
  }
  // Bản Zalo chỉ mở nhóm Zalo; chưa có link nhóm Zalo thì ẩn ô (không dẫn sang Facebook).
  const groupUrl = IS_ZALO ? LINKS.zaloGroup : LINKS.zaloGroup || LINKS.facebookGroup

  const primary: Tile[] = [
    { glyph: 'bag', label: 'Đặt hàng', go: () => navigate('/dat-hang') },
    { glyph: 'book', label: 'Công thức', go: () => navigate('/cong-thuc') },
    { glyph: 'list', label: 'Đi chợ tuần', go: () => navigate('/di-cho-tuan') },
    { glyph: 'bookmark', label: 'Sổ tay', go: () => navigate('/so-tay') },
  ]
  const more: Tile[] = [
    { glyph: 'list', label: 'Danh sách đi chợ', badge: shopping.remaining, go: () => navigate('/di-cho') },
    { glyph: 'calendar', label: 'Sự kiện', go: () => navigate('/su-kien') },
    { glyph: 'gift', label: 'Hạt Cốm', go: () => navigate('/hat-com') },
    ...(COURSE_READY ? [{ glyph: 'video' as const, label: 'Khoá xôi cốm', go: () => navigate(session ? '/hoc' : '/khoa-hoc') }] : []),
    ...(LINKS.oaId || LINKS.messenger ? [{ glyph: 'chat' as const, label: 'Hỏi Cô Hạ', go: chat }] : []),
    ...(groupUrl
      ? [
          {
            glyph: 'group' as const,
            label: 'Nhóm Zalo của Cô',
            go: () => {
              track('group_click', { zalo: !!LINKS.zaloGroup })
              void platform.openExternal(groupUrl)
            },
          },
        ]
      : []),
  ]

  return (
    <Page className="page page-home">
      <header className="home-head">
        <img className="brand-logo" src={`${import.meta.env.BASE_URL}brand/logo-256.png`} alt="" />
        <div className="brand-text">
          <div className="brand-hello">{session ? part.greeting : 'Chào mừng chị tới'}</div>
          <div className="brand">{BRAND.name}</div>
        </div>
        <button className="bell" onClick={() => navigate('/thong-bao')} aria-label="Thông báo">
          <Icon icon="zi-notif" size={24} />
          {!!me?.unread_notifications && <span className="bell-count">{me.unread_notifications > 9 ? '9+' : me.unread_notifications}</span>}
        </button>
      </header>

      <button className="search search-btn" onClick={() => navigate('/cong-thuc')}>
        <Icon icon="zi-search" size={18} />
        <span>Tìm món, nguyên liệu…</span>
      </button>

      <MemberCard />

      <div className="quick">
        {primary.map(t => (
          <button key={t.label} className="quick-item" onClick={t.go}>
            <span className="quick-icon">
              <Glyph name={t.glyph} />
              {!!t.badge && <i className="tile-badge">{t.badge}</i>}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <ReorderCard />
      <WalletCard />

      <div className="section-head">
        <span className="section-title">Bán chạy ở Bếp Cô Hạ</span>
        <button className="see-all" onClick={() => navigate('/dat-hang')}>
          Xem tất cả ›
        </button>
      </div>
      <ProductRail />

      <div className="section-head">
        <span className="section-title">{part.title}</span>
        <button className="see-all" onClick={() => navigate('/cong-thuc')}>
          Xem tất cả ›
        </button>
      </div>
      <RecipeRail recipes={forMeal} />

      <button className="card week-promo" onClick={() => navigate('/di-cho-tuan')}>
        <span className="week-promo-icon">
          <Glyph name="list" size={26} />
        </span>
        <span className="week-promo-text">
          <b>Bận rộn? Đi chợ 1 lần cho cả tuần</b>
          <span className="small">
            7 bữa tối cho 4 người · khoảng {money(week.perMeal)}/bữa theo giá Co.opmart
          </span>
        </span>
        <span className="see-all">›</span>
      </button>

      <BannerCarousel />
      <UpcomingEvent />

      <div className="section-head">
        <span className="section-title">Món của hôm nay</span>
      </div>
      <RecipeCard recipe={today} badge="Hôm nay" />

      <div className="section-head">
        <span className="section-title">Tiện ích</span>
      </div>
      <div className="more-grid">
        {more.map(t => (
          <button key={t.label} className="more-item" onClick={t.go}>
            <Glyph name={t.glyph} size={20} />
            <span>{t.label}</span>
            {!!t.badge && <i className="tile-badge">{t.badge}</i>}
          </button>
        ))}
      </div>

      <OAFollowCard />
      <AddToHomeCard />

      {/* Bản Zalo không đưa khách ra link ngoài (chính sách Zalo Mini App mục 4.1). */}
      {!IS_ZALO && (
        <p className="muted small center">
          Xem thêm công thức trên{' '}
          <button className="text-link" onClick={() => void platform.openExternal(LINKS.youtube)}>
            YouTube Cô Hạ dạy nấu ăn
          </button>
        </p>
      )}
    </Page>
  )
}
