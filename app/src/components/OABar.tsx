import { LINKS } from '../content'
import { IS_ZALO, platform } from '../platform'
import { useMini } from '../state'
import { Glyph } from './Glyph'

/** Có kênh chat nào với Bếp không (bản Zalo chỉ tính OA, vì chính sách cấm đưa khách ra link ngoài). */
export const canChat = () => !!LINKS.oaId || (!IS_ZALO && !!(LINKS.zaloChat || LINKS.messenger))
/** Có nút Quan tâm/Kết bạn không: OA (cả 2 bản) hoặc Zalo của Bếp (chỉ bản web). */
export const canFollow = () => !!LINKS.oaId || (!IS_ZALO && !!LINKS.zaloChat)

/** Mở chat với Bếp, kèm câu soạn sẵn (Zalo OA điền sẵn tin nhắn; link zalo.me thì khách tự gõ). */
export function chatWithBep(message?: string) {
  if (LINKS.oaId) return platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, message)
  if (IS_ZALO) return Promise.resolve()
  if (LINKS.zaloChat) return platform.openChat({ kind: 'url', url: LINKS.zaloChat }, message)
  if (LINKS.messenger) return platform.openChat({ kind: 'url', url: LINKS.messenger }, message)
  return Promise.resolve()
}

// Hai nút luôn có (yêu cầu của Cô Hạ 25/10): Quan tâm OA để nhận tin, Chat để hỏi và đặt hàng ngay.
// Quan tâm OA quan trọng vì tin truyền thông của Zalo chỉ tới người đã quan tâm OA.
export function OABar({ message = 'Cô ơi, cháu muốn hỏi Bếp ạ', from, compact = false }: { message?: string; from: string; compact?: boolean }) {
  const { track } = useMini()
  if (!canChat() && !canFollow()) return null

  const follow = async () => {
    track('oa_follow_click', { from, in_app: platform.canFollowInApp })
    if (LINKS.oaId) await platform.followOA(LINKS.oaId)
    else await chatWithBep()
  }
  const chat = async () => {
    track('chat_click', { from })
    await chatWithBep(message)
  }

  return (
    <div className={`oa-bar ${compact ? 'compact' : ''}`}>
      {canFollow() && (
        <button className="oa-btn oa-follow" onClick={follow}>
          <Glyph name="group" size={18} />
          {LINKS.oaId ? 'Quan tâm OA' : 'Kết bạn Zalo Bếp'}
        </button>
      )}
      {canChat() && (
        <button className="oa-btn oa-chat" onClick={chat}>
          <Glyph name="chat" size={18} />
          Chat với Bếp
        </button>
      )}
    </div>
  )
}
