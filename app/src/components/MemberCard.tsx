import { useNavigate } from 'zmp-ui'
import { tierOf } from '../lib/tiers'
import { useMini } from '../state'
import { useCheckin } from './CheckinCard'
import { Glyph } from './Glyph'

// Thẻ thành viên đầu trang chủ (học Starbucks Rewards), bản gọn theo phản biện v6:
// khách nội trợ thấy thẻ to chiếm cả màn đầu mà chưa rõ được gì → chỉ còn 1 dải: Hạt Cốm + hạng + nút điểm danh.
// Không hứa "quà" khi chưa có quà thật (CEO): mốc chuỗi ngày ghi đúng số Hạt Cốm được cộng.
export function MemberCard() {
  const { session, me } = useMini()
  const navigate = useNavigate()
  const { busy, doCheckin } = useCheckin()

  if (!session || !me) {
    return (
      <div className="member-card member-invite">
        <div className="member-invite-text">
          <b>Thành viên Bếp Cô Hạ · miễn phí</b>
          <span>Lưu công thức, đặt lại hàng nhanh, tích Hạt Cốm. Cô không gửi quảng cáo nếu chị không đồng ý.</span>
        </div>
        <button className="member-btn small-btn" onClick={() => navigate('/dang-ky?next=/')}>
          Đăng ký
        </button>
      </div>
    )
  }

  const c = me.checkin
  const tier = me.points_earned !== undefined ? tierOf(me.points_earned) : null
  const bonus = c.next_milestone ? me.points_rules.milestones[String(c.next_milestone)] : undefined
  return (
    <div className="member-card member-compact">
      <button className="member-points" onClick={() => navigate('/hat-com')}>
        <span className="member-label">Hạt Cốm{tier ? ` · ${tier.current.name}` : ''}</span>
        <span className="member-num">{me.points.toLocaleString('vi-VN')}</span>
      </button>
      <span className="member-streak">
        <span className="member-streak-main">
          <Glyph name="fire" size={16} /> Điểm danh liền {c.streak} ngày
        </span>
        {c.next_milestone && bonus ? <small>Thêm {c.next_milestone - c.streak} ngày: +{bonus} Hạt Cốm</small> : null}
      </span>
      <button className="member-btn small-btn" disabled={c.today_done || busy} onClick={doCheckin}>
        {c.today_done ? '✓ Xong' : busy ? 'Đang…' : `Điểm danh +${me.points_rules.checkin}`}
      </button>
    </div>
  )
}
