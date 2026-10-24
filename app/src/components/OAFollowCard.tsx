import { useState } from 'react'
import { Button } from 'zmp-ui'
import { LINKS } from '../content'
import { platform } from '../platform'
import { readLocal, writeLocal } from '../lib/storage'
import { useMini } from '../state'

// Việc quan trọng nhất của Mini App: đổi lượt quét thành lượt quan tâm OA, vì tin truyền thông
// chỉ tới được người quan tâm OA (chính sách gửi tin Zalo). Lời mời là tiện ích, không phải giảm giá.
export function OAFollowCard() {
  const { track } = useMini()
  const [hidden, setHidden] = useState(readLocal('haco_oa_card') === 'done')
  if (!LINKS.oaId || hidden) return null

  const follow = async () => {
    track('oa_follow_click', { in_app: platform.canFollowInApp })
    const r = await platform.followOA(LINKS.oaId)
    if (r !== 'denied') {
      writeLocal('haco_oa_card', 'done')
      setHidden(true)
    }
  }

  return (
    <div className="card card-oa">
      <div className="card-title">Nhận bài mới qua Zalo</div>
      <p>Quan tâm Zalo của Bếp Cô Hạ để Cô báo khi có bài mới và hỏi thăm chị sau khi nấu.</p>
      <Button size="small" onClick={follow}>
        Quan tâm Zalo Bếp Cô Hạ
      </Button>
    </div>
  )
}
