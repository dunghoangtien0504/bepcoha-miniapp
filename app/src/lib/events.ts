import type { FunnelEvent, MiniApi } from '../api/types'

// Gom event và gửi theo lô (tối đa 20/lần, server giới hạn 60 event/anon_id/phút).
// qr_scan KHÔNG gửi từ client: server tự ghi khi /session nhận mã lô hợp lệ.

const MAX_BATCH = 20
const FLUSH_MS = 4000

export type EventName =
  | 'welcome_view'
  | 'identify_submit'
  | 'oa_follow_click'
  | 'lesson_open'
  | 'lesson_complete'
  | 'combo_click'
  | 'chat_click'
  | 'share_click'
  | 'claim_submit'
  | 'consent_revoke'
  | 'checkin'
  | 'recipe_open'
  | 'recipe_save'
  | 'cook_mode'
  | 'product_click'
  | 'group_click'
  | 'cart_add'
  | 'checkout_view'

const STEP: Record<EventName, number> = {
  checkin: 6,
  recipe_open: 5,
  recipe_save: 5,
  cook_mode: 5,
  product_click: 7,
  group_click: 6,
  cart_add: 7,
  checkout_view: 7,
  welcome_view: 3,
  identify_submit: 4,
  oa_follow_click: 4,
  lesson_open: 5,
  lesson_complete: 5,
  combo_click: 7,
  chat_click: 2,
  share_click: 9,
  claim_submit: 3,
  consent_revoke: 6,
}

export function createTracker(api: MiniApi, anonId: string, getBatch: () => string | undefined) {
  let queue: FunnelEvent[] = []
  let timer: ReturnType<typeof setTimeout> | null = null

  async function flush() {
    if (timer) clearTimeout(timer)
    timer = null
    while (queue.length) {
      const chunk = queue.slice(0, MAX_BATCH)
      queue = queue.slice(MAX_BATCH)
      try {
        await api.events({ anon_id: anonId, events: chunk })
      } catch {
        // mất vài event đo lường thì chấp nhận, không làm phiền khách
      }
    }
  }

  function track(name: EventName, props?: Record<string, unknown>) {
    queue.push({ name, step: STEP[name], batch_code: getBatch(), props, at: new Date().toISOString() })
    if (queue.length >= MAX_BATCH) void flush()
    else timer ??= setTimeout(() => void flush(), FLUSH_MS)
  }

  return { track, flush }
}

export type Tracker = ReturnType<typeof createTracker>
