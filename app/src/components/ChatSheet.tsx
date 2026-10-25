import { Sheet } from 'zmp-ui'
import { LINKS } from '../content'
import { IS_ZALO, platform } from '../platform'
import { useMini } from '../state'

/** Các kênh chat với Cô Hạ đang có (Zalo OA ưu tiên, rồi Messenger). Rỗng thì ẩn mọi nút chat. */
export function chatOptions() {
  return [
    LINKS.oaId ? { key: 'zalo', label: 'Nhắn Zalo cho Cô Hạ', go: () => platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }) } : null,
    // Bản Zalo chỉ chat qua OA (chính sách Zalo Mini App mục 4.1: không đưa khách ra link ngoài).
    LINKS.zaloChat && !LINKS.oaId && !IS_ZALO ? { key: 'zalo', label: 'Nhắn Zalo cho Cô Hạ', go: () => platform.openChat({ kind: 'url', url: LINKS.zaloChat }) } : null,
    LINKS.messenger && !IS_ZALO ? { key: 'messenger', label: 'Nhắn Messenger', go: () => platform.openChat({ kind: 'url', url: LINKS.messenger }) } : null,
  ].filter((o): o is NonNullable<typeof o> => o !== null)
}

// Chọn kênh chat — mở từ tab "Zalo OA" ở thanh dưới. Mini App không thay chat: 60–70% khách Zalo vẫn chat để mua (B4 K14).
export function ChatSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { track } = useMini()
  const options = chatOptions()
  return (
    <Sheet visible={visible} onClose={onClose} autoHeight title="Chị muốn nhắn qua đâu?">
      <div className="sheet-list">
        {options.length ? (
          options.map(o => (
            <button
              key={o.key}
              className="sheet-item"
              onClick={() => {
                track('chat_click', { via: o.key })
                onClose()
                void o.go()
              }}
            >
              {o.label}
            </button>
          ))
        ) : (
          <p className="muted small">Kênh chat của Bếp Cô Hạ đang được cập nhật.</p>
        )}
      </div>
    </Sheet>
  )
}
