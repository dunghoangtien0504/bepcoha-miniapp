import { useState } from 'react'
import { Button } from 'zmp-ui'
import { readLocal, writeLocal } from '../lib/storage'
import { platform } from '../platform'
import { useMini } from '../state'

const KEY = 'haco_add_home'

// Lý do để mở app mỗi ngày phải dễ chạm tới: mời đưa Bếp Cô Hạ ra màn hình chính SAU khi khách đã điểm danh
// (đã thấy giá trị), không mời ngay lần đầu. Zalo: createShortcut. Web: hộp cài đặt Android, hoặc hướng dẫn iPhone.
export function AddToHomeCard() {
  const { me, track } = useMini()
  const [hidden, setHidden] = useState(() => readLocal(KEY) === 'done' || platform.isOnHomeScreen())
  const [guide, setGuide] = useState<'guide_ios' | 'guide_other' | null>(null)
  if (hidden || !me?.checkin.today_done) return null

  const close = () => {
    writeLocal(KEY, 'done')
    setHidden(true)
  }
  const add = async () => {
    const r = await platform.addToHome()
    track('add_to_home', { result: r })
    if (r === 'added') close()
    else if (r === 'guide_ios' || r === 'guide_other') setGuide(r)
  }

  return (
    <div className="card card-home">
      <div className="card-title">Đưa Bếp Cô Hạ ra màn hình chính</div>
      {guide === 'guide_ios' ? (
        <p className="small">
          Trên Safari: bấm nút <b>Chia sẻ</b> (ô vuông có mũi tên lên) ở cuối màn hình → chọn <b>Thêm vào MH chính</b> → <b>Thêm</b>.
        </p>
      ) : guide === 'guide_other' ? (
        <p className="small">
          Bấm nút <b>⋮</b> (hoặc menu) của trình duyệt → chọn <b>Thêm vào màn hình chính</b> hoặc <b>Cài đặt ứng dụng</b>.
        </p>
      ) : (
        <p className="small">Mỗi sáng chạm 1 lần là vào điểm danh, xem món của hôm nay — không cần tìm lại link.</p>
      )}
      <div className="two-choices">
        <Button size="small" variant="secondary" onClick={close}>
          {guide ? 'Đã xong' : 'Để sau'}
        </Button>
        {!guide && (
          <Button size="small" onClick={add}>
            Thêm ngay
          </Button>
        )}
      </div>
    </div>
  )
}
