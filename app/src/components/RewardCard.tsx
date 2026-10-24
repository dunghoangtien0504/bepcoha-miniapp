import type { Reward } from '../api/types'
import { fullDate as date, money } from '../lib/format'

const STATUS: Record<Reward['status'], string> = { da_cap: 'Còn dùng được', da_dung: 'Đã dùng', het_han: 'Hết hạn', huy: 'Đã huỷ' }

export function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div className={`card card-reward ${reward.status === 'da_cap' ? '' : 'is-off'}`}>
      <div className="reward-amount">{money(reward.amount)}</div>
      <div className="reward-code">
        Mã: <b>{reward.code}</b>
      </div>
      <div className="muted small">
        {STATUS[reward.status]}
        {reward.expires_at ? ` · hạn ${date(reward.expires_at)}` : ''}
      </div>
      <div className="muted small">Chỉ dùng khi đặt đơn bằng số {reward.phone_masked}: chọn mã ở Giỏ hàng, hoặc nhắn mã cho Cô Hạ khi đặt qua tin nhắn.</div>
    </div>
  )
}
