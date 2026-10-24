import { useEffect } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import { CheckinCard } from '../components/CheckinCard'
import { useMini } from '../state'

// Hạt Cốm (học Starbucks Rewards). v2-A chỉ tích điểm; đổi quà mở ở đợt sau, khi Cô Hạ chốt bảng đổi.
// Chỉ phiên đã xác minh SĐT mới đổi được điểm, để người gõ số của người khác không tiêu được điểm của khách thật.
export function PointsPage() {
  const { session, me, refreshMe } = useMini()
  const navigate = useNavigate()
  const hasSession = !!session
  useEffect(() => {
    if (hasSession) void refreshMe()
  }, [hasSession, refreshMe])

  if (!session || !me) {
    return (
      <Page className="page">
        <h2>Hạt Cốm</h2>
        <p className="muted">Điểm thưởng của Bếp Cô Hạ. Đăng ký để bắt đầu tích.</p>
        <Button onClick={() => navigate('/dang-ky?next=/hat-com')}>Đăng ký</Button>
      </Page>
    )
  }

  const rules = me.points_rules
  return (
    <Page className="page">
      <h2>Hạt Cốm</h2>
      <div className="card points-total">
        <div className="muted small">Chị đang có</div>
        <div className="points-big">{me.points}</div>
        <div className="muted small">Hạt Cốm</div>
      </div>
      <CheckinCard />
      <h3>Cách tích</h3>
      <ul className="plain">
        <li>Điểm danh mỗi ngày: +{rules.checkin}</li>
        {Object.entries(rules.milestones).map(([days, pts]) => (
          <li key={days}>
            Giữ chuỗi {days} ngày: +{pts}
          </li>
        ))}
      </ul>
      <h3>Đổi quà</h3>
      <p className="muted small">Sắp mở: dùng Hạt Cốm đổi voucher và quà của Cô Hạ.</p>
      {!session.verified && (
        <p className="muted small">
          Để đổi quà, chị cần xác nhận số điện thoại.{' '}
          <button className="text-link" onClick={() => navigate('/nhap-ma-don')}>
            Nhập mã đơn
          </button>{' '}
          là cách nhanh nhất.
        </p>
      )}
    </Page>
  )
}
