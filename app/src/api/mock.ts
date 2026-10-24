// API giả chạy trong trình duyệt (vite --mode mock), mô phỏng đúng quy tắc của hợp đồng /api/mini/*,
// để dựng và thử giao diện khi Haco-OS chưa có route. Không gửi dữ liệu đi đâu.
//
// Mẹo thử (thêm "haco_mock_days" +1 mỗi lần để thử điểm danh nhiều ngày liền):
//  - Mã đơn bắt đầu bằng "TEST" → khớp SĐT (da_khop, phiên được xác minh). Mã khác → chờ duyệt.
//  - localStorage "haco_mock_days" = số ngày giả lập đã trôi qua (để mở các bài sau).
//  - ?mock_voucher=1 trên URL lúc đăng ký → cấp voucher thử (Đợt A chưa chốt số tiền).
//  - Giỏ hàng: bật sẵn đổi Hạt Cốm (100đ/hạt, tối đa 20%) để thấy giao diện; server thật mặc định TẮT tới khi Cô Hạ chốt.
//  - Đơn chuyển khoản: localStorage "haco_mock_paid" = mã đơn → coi như đã nhận tiền.
import { COMPLETE_PCT, unlockAt } from '../lib/lessons'
import { maskPhone, normalizeVnPhone } from '../lib/phone'
import { readLocal, writeLocal } from '../lib/storage'
import { computeStreak, vnDay } from '../lib/streak'
import { LESSONS } from '../content'
import { findRecipe } from '../recipes'
import { ApiError, type Batch, type CatalogItem, type CheckinState, type Claim, type LessonState, type MiniApi, type Order, type OrderLine, type PlaceOrderReq, type PointsRules, type Quote, type QuoteReq, type Reward, type Session, type MiniEvent, type MiniNotification } from './types'

const KEY = 'haco_mock_state'
const CLAIM_LIMIT_PER_SESSION = 5
// Giống mặc định của server (Haco-OS lib/mini/points.ts) — Cô Hạ chưa chốt mức điểm.
const RULES: PointsRules = { checkin: 5, milestones: { '3': 10, '7': 30, '14': 60, '30': 150 } }

// Giống lib/mini/catalog.ts của Haco-OS (giá BG0926-001).
const CATALOG: CatalogItem[] = [
  { sku: 'sxc-set', product: '/set-xoi-com', name: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa', variant: '1 sét', price: 148000, image: '/images/set-xoi-com/san-pham/z7728489506719_b50b067d25c4d1ac0ef7f35b9a862580.jpg' },
  { sku: 'sxx-500g', product: '/sot-xa-xiu', name: 'Sốt Xá Xíu Bếp Cô Hạ', variant: '500g', price: 100000, image: '/images/sot-xa-xiu/san-pham/hero-sot-xa-xiu.jpg' },
  { sku: 'sxx-1kg', product: '/sot-xa-xiu', name: 'Sốt Xá Xíu Bếp Cô Hạ', variant: '1kg', price: 190000, image: '/images/sot-xa-xiu/san-pham/hero-sot-xa-xiu.jpg' },
  { sku: 'stn-500g', product: '/sot-tron-nom', name: 'Sốt Trộn Nộm Bếp Cô Hạ', variant: '500g', price: 65000, image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg' },
  { sku: 'stn-1kg', product: '/sot-tron-nom', name: 'Sốt Trộn Nộm Bếp Cô Hạ', variant: '1kg', price: 105000, image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg' },
  { sku: 'kdx', product: '/khan-do-xoi', name: 'Khăn Đồ Xôi Bếp Cô Hạ', variant: '1m×1m', price: 49000, image: '/images/khan-do-xoi/san-pham/724597989_1683075906108439_2952143396022032152_n.jpg' },
]
const REDEEM = { vnd_per_point: 100, max_pct: 20 }
const SHIPPING_NOTE = 'Chưa gồm phí ship. Cô Hạ gọi xác nhận và báo phí ship theo khu vực (thường 20–40k).'

function mockQuote(state: MockState, req: QuoteReq): Quote {
  const s = requireSession(state)
  if (!req.items?.length) throw new ApiError(400, 'empty_cart', 'Giỏ hàng đang trống.')
  const items: OrderLine[] = req.items.map(l => {
    const c = CATALOG.find(x => x.sku === l.sku)
    if (!c || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > 20) throw new ApiError(400, 'bad_request', 'Có món trong giỏ không còn bán, chị xoá đi rồi đặt lại giúp Cô nhé.')
    return { sku: c.sku, label: `${c.name} ${c.variant}`, qty: l.qty, unit_price: c.price }
  })
  const subtotal = items.reduce((t, l) => t + l.qty * l.unit_price, 0)
  let voucher: Quote['voucher'] = null
  if (req.voucher_code) {
    const r = state.rewards.find(x => x.code === req.voucher_code && x.status === 'da_cap' && (!x.expires_at || new Date(x.expires_at) > now()))
    if (!r) throw new ApiError(400, 'voucher_invalid', 'Mã ưu đãi không dùng được cho số điện thoại này, hoặc đã hết hạn.')
    voucher = { code: r.code, amount: Math.min(r.amount, subtotal) }
  }
  let points: Quote['points'] = null
  if (s.verified) {
    const available = balance(state)
    const cap = Math.floor(((subtotal - (voucher?.amount ?? 0)) * REDEEM.max_pct) / 100 / REDEEM.vnd_per_point)
    const usable = Math.max(0, Math.min(available, cap))
    const used = Math.min(req.use_points ?? 0, usable)
    points = { available, usable, used, amount: used * REDEEM.vnd_per_point, vnd_per_point: REDEEM.vnd_per_point }
  }
  return { items, subtotal, voucher, points, total: subtotal - (voucher?.amount ?? 0) - (points?.amount ?? 0), shipping_note: SHIPPING_NOTE }
}

const mockQr = (o: Order) => ({ bankAccount: '0000000000', bankCode: 'MB', accountName: 'BEP CO HA (THU)', amount: o.total, content: o.ref_code, qrUrl: '' })

// Sự kiện và thông báo MẪU chỉ để dựng giao diện ở chế độ mock (giờ tính theo lúc mở app). Server thật lấy từ CRM.
function mockEvents(): MiniEvent[] {
  const at = (days: number, hour: number) => {
    const d = new Date(now().getTime() + days * 86400000)
    d.setHours(hour, 0, 0, 0)
    return d.toISOString()
  }
  const base = { body: '', ends_at: null, image: '', join_url: '', status: 'cong_bo' as const, reminded: false, booked: false }
  return [
    { ...base, slug: 'live-xoi-com-mua-thu', kind: 'livestream', title: '[Mẫu] Livestream: Nấu xôi cốm mùa thu cùng Cô Hạ', summary: 'Cô Hạ nấu trực tiếp, trả lời câu hỏi của chị em.', starts_at: at(0, 23), location: '', capacity: null, seats_left: null, body: 'Buổi livestream trên nhóm Zalo của Cô Hạ. Chuẩn bị sẵn nguyên liệu để nấu cùng nhé.' },
    { ...base, slug: 'workshop-banh-com', kind: 'workshop', title: '[Mẫu] Workshop làm bánh cốm tại bếp', summary: 'Học trực tiếp, mang thành phẩm về nhà.', starts_at: at(6, 9), location: 'Bếp Cô Hạ', capacity: 12, seats_left: 5 },
    { ...base, slug: 'thu-thach-tuan-xoi', kind: 'thu_thach', title: '[Mẫu] Thử thách tuần: Cùng đồ xôi dẻo', summary: 'Nấu món đồ xôi, khoe ảnh để nhận Hạt Cốm.', starts_at: at(1, 8), location: '', capacity: null, seats_left: null },
    { ...base, slug: 'live-dua-ca-muoi', kind: 'livestream', title: '[Mẫu] Livestream: Muối dưa cà giòn', summary: 'Đã diễn ra tuần trước.', starts_at: at(-7, 20), location: '', capacity: null, seats_left: null },
  ]
}

const MOCK_NOTIFICATIONS: Omit<MiniNotification, 'read' | 'published_at'>[] = [
  { id: 3, title: '[Mẫu] Có 22 công thức mới', body: 'Từ thịt kho trứng tới chè cốm — mở mục Công thức xem ngay.', link: '/cong-thuc', image: '', kind: 'cong_thuc' },
  { id: 2, title: '[Mẫu] Livestream tối nay 23h', body: 'Nấu xôi cốm mùa thu cùng Cô Hạ.', link: '/su-kien/live-xoi-com-mua-thu', image: '', kind: 'su_kien' },
  { id: 1, title: 'Chào mừng chị tới Bếp Cô Hạ', body: 'Điểm danh mỗi ngày để tích Hạt Cốm nhé.', link: '/hat-com', image: '', kind: 'he_thong' },
]

interface MockState {
  session: (Session & { phone: string }) | null
  rewards: Reward[]
  claims: Claim[]
  failedClaims: string[]
  claimLockedUntil: string | null
  progress: Record<number, { watched_pct: number; completed_at: string | null }>
  consents: { channel: string; revoked_at: string | null }[]
  checkins: string[]
  points: { reason: string; ref: string; delta: number }[]
  saved: string[]
  orders: Order[]
  reminders: { slug: string; kind: 'nhac' | 'giu_cho' }[]
  readIds: number[]
}

const empty = (): MockState => ({ session: null, rewards: [], claims: [], failedClaims: [], claimLockedUntil: null, progress: {}, consents: [], checkins: [], points: [], saved: [], orders: [], reminders: [], readIds: [] })
const balance = (s: MockState) => s.points.reduce((a, p) => a + p.delta, 0)
const checkinState = (s: MockState): CheckinState => {
  const { today_done, streak, next_milestone, freeze_available } = computeStreak(s.checkins, vnDay(now()))
  return { today_done, streak, next_milestone, freeze_available }
}

function load(): MockState {
  try {
    return { ...empty(), ...JSON.parse(readLocal(KEY) || '{}') }
  } catch {
    return empty()
  }
}
const save = (s: MockState) => writeLocal(KEY, JSON.stringify(s))
const now = () => new Date(Date.now() + Number(readLocal('haco_mock_days') || 0) * 86400000)
const delay = <T>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 250))
const publicSession = (s: MockState['session']): Session | null => {
  if (!s) return null
  const { phone: _phone, ...rest } = s
  return rest
}

function guessChannel(code: string): Batch['channel'] {
  if (code.includes('TT')) return 'tiktok'
  if (code.includes('SP')) return 'shopee'
  if (code.includes('BEP')) return 'bep'
  return 'facebook'
}

function lessons(state: MockState): LessonState[] {
  if (!state.session) return []
  const started = new Date(state.session.started_at)
  return LESSONS.filter(l => unlockAt(started, l.no) <= now()).map(l => ({
    no: l.no,
    unlocked_at: unlockAt(started, l.no).toISOString(),
    watched_pct: state.progress[l.no]?.watched_pct ?? 0,
    completed_at: state.progress[l.no]?.completed_at ?? null,
  }))
}

function requireSession(state: MockState) {
  if (!state.session) throw new ApiError(401, 'no_session', 'Chị đăng ký số điện thoại trước giúp Cô nhé.')
  return state.session
}

function withMine(state: MockState, e: MiniEvent): MiniEvent {
  const mine = (k: 'nhac' | 'giu_cho') => state.reminders.some(r => r.slug === e.slug && r.kind === k)
  const booked = mine('giu_cho')
  return { ...e, reminded: mine('nhac'), booked, seats_left: e.seats_left === null ? null : Math.max(0, e.seats_left - (booked ? 1 : 0)) }
}

export function createMockApi(): MiniApi {
  return {
    async session({ batch }) {
      const state = load()
      const code = batch?.trim().toUpperCase()
      const b: Batch | null = code && /^[A-Z0-9-]{3,40}$/.test(code)
        ? { code, channel: guessChannel(code), cta: 'Quét mã — học nấu xôi cốm cùng Cô Hạ', landing_variant: 'a' }
        : null
      return delay({ batch: b, session: publicSession(state.session) })
    },

    async events() {
      return delay(undefined)
    },

    async identify(req) {
      let phone: string | null
      let verified = false
      if (req.zalo_phone_token) {
        phone = '0912345678'
        verified = true
      } else {
        phone = normalizeVnPhone(req.phone || '')
        if (!phone) throw new ApiError(400, 'invalid_phone', 'Số điện thoại chưa đúng, chị kiểm tra lại giúp Cô nhé.')
      }
      const session = {
        id: Math.floor(Math.random() * 1e6),
        verified,
        verified_via: verified ? ('zalo_phone_token' as const) : null,
        phone_masked: maskPhone(phone),
        started_at: now().toISOString(),
        phone,
      }
      const rewards: Reward[] = []
      if (new URLSearchParams(location.search).get('mock_voucher') === '1') {
        rewards.push({
          code: 'THU' + Math.random().toString(36).slice(2, 7).toUpperCase(),
          kind: 'voucher',
          program: 'mini-dot-a-2610',
          amount: 1000,
          expires_at: new Date(now().getTime() + 14 * 86400000).toISOString(),
          status: 'da_cap',
          phone_masked: session.phone_masked,
        })
      }
      save({ ...empty(), session, rewards, consents: req.consents.map(c => ({ channel: c.channel, revoked_at: null })) })
      return delay({ session: publicSession(session)!, rewards })
    },

    async claimOrder(code) {
      const state = load()
      const s = requireSession(state)
      if (state.claimLockedUntil && new Date(state.claimLockedUntil) > now()) {
        throw new ApiError(429, 'claim_locked', 'Chị đã nhập sai nhiều lần. Chị thử lại sau, hoặc nhắn Cô Hạ để Cô kiểm tra giúp nhé.', { until: state.claimLockedUntil })
      }
      const ref = code.toUpperCase().replace(/[\s\-#.]/g, '')
      const matched = ref.startsWith('TEST')
      const claim: Claim = { id: state.claims.length + 1, status: matched ? 'da_khop' : 'cho_duyet', created_at: now().toISOString() }
      state.claims.push(claim)
      if (matched) {
        state.session = { ...s, verified: true, verified_via: 'order_match' }
      } else {
        state.failedClaims.push(now().toISOString())
        if (state.failedClaims.length >= CLAIM_LIMIT_PER_SESSION) {
          state.claimLockedUntil = new Date(now().getTime() + 86400000).toISOString()
        }
      }
      save(state)
      return delay({ claim_id: claim.id, status: claim.status as 'da_khop' | 'cho_duyet', session: publicSession(state.session)! })
    },

    async me() {
      const state = load()
      const s = requireSession(state)
      return delay({
        session: publicSession(s)!,
        rewards: state.rewards,
        lessons: lessons(state),
        claims: state.claims,
        referral_code: s.verified ? 'COHA' + String(s.id).slice(0, 4) : null,
        points: balance(state),
        points_earned: state.points.filter(p => p.delta > 0 && p.reason !== 'hoan_don').reduce((a, p) => a + p.delta, 0),
        points_rules: RULES,
        checkin: checkinState(state),
        saved_recipes: state.saved,
        unread_notifications: MOCK_NOTIFICATIONS.filter(n => !state.readIds.includes(n.id)).length,
      })
    },

    async checkin() {
      const state = load()
      requireSession(state)
      const today = vnDay(now())
      const earned: { reason: 'diem_danh' | 'moc_chuoi'; points: number; milestone?: number }[] = []
      if (!state.checkins.includes(today)) {
        state.checkins.push(today)
        state.points.push({ reason: 'diem_danh', ref: today, delta: RULES.checkin })
        earned.push({ reason: 'diem_danh', points: RULES.checkin })
        const st = computeStreak(state.checkins, today)
        const bonus = RULES.milestones[String(st.streak)]
        const ref = `${st.streak}@${st.chain_start}`
        if (bonus && !state.points.some(p => p.reason === 'moc_chuoi' && p.ref === ref)) {
          state.points.push({ reason: 'moc_chuoi', ref, delta: bonus })
          earned.push({ reason: 'moc_chuoi', points: bonus, milestone: st.streak })
        }
        save(state)
      }
      return delay({ checkin: checkinState(state), earned, points: balance(state) })
    },

    async saveRecipe(slug, saved) {
      const state = load()
      requireSession(state)
      if (!findRecipe(slug)) throw new ApiError(404, 'not_found', 'Không tìm thấy món này.')
      state.saved = saved ? [...new Set([slug, ...state.saved])] : state.saved.filter(s => s !== slug)
      save(state)
      return delay({ saved_recipes: state.saved })
    },

    async catalog() {
      return delay({ items: CATALOG, redeem: REDEEM })
    },

    async quote(req) {
      return delay(mockQuote(load(), req))
    },

    async placeOrder(req: PlaceOrderReq) {
      const state = load()
      const s = requireSession(state)
      if ((req.name ?? '').trim().length < 2) throw new ApiError(400, 'bad_request', 'Chị cho Cô xin tên người nhận nhé.')
      if ((req.address ?? '').trim().length < 10) throw new ApiError(400, 'bad_request', 'Chị ghi rõ địa chỉ nhận hàng (số nhà, phường/xã, tỉnh) giúp Cô nhé.')
      const q = mockQuote(state, req)
      if (req.expected_total !== undefined && req.expected_total !== q.total) {
        throw new ApiError(409, 'price_changed', 'Giá vừa thay đổi, chị xem lại tổng tiền rồi đặt lại giúp Cô nhé.', { quote: q })
      }
      const recent = state.orders.filter(o => now().getTime() - new Date(o.created_at).getTime() < 3600000)
      if (recent.length >= 3) throw new ApiError(429, 'order_limit', 'Chị vừa đặt mấy đơn rồi. Cần sửa đơn thì nhắn Cô Hạ giúp Cô nhé.')
      const ref = 'HMA' + String(Date.now()).slice(-10) + Math.random().toString(16).slice(2, 6).toUpperCase().padEnd(4, '0')
      const order: Order = {
        ref_code: ref, created_at: now().toISOString(), items: q.items, subtotal: q.subtotal,
        voucher_amount: q.voucher?.amount ?? 0, points_used: q.points?.used ?? 0, points_amount: q.points?.amount ?? 0, total: q.total,
        payment: req.payment, payment_status: 'chua_tra', status: 'moi', status_label: 'Cô Hạ đã nhận đơn', phone_masked: s.phone_masked,
      }
      state.orders.unshift(order)
      if (q.voucher) state.rewards = state.rewards.map(r => (r.code === q.voucher!.code ? { ...r, status: 'da_dung' } : r))
      if (q.points?.used) state.points.push({ reason: 'dung_don', ref, delta: -q.points.used })
      save(state)
      return delay({ order, qr: req.payment === 'chuyen_khoan' ? mockQr(order) : null })
    },

    async orders() {
      const state = load()
      requireSession(state)
      return delay({ orders: state.orders })
    },

    async order(ref) {
      const state = load()
      requireSession(state)
      const o = state.orders.find(x => x.ref_code === ref)
      if (!o) throw new ApiError(404, 'not_found', 'Không tìm thấy đơn này.')
      if (readLocal('haco_mock_paid') === ref && o.payment_status === 'chua_tra') {
        o.payment_status = 'da_tra'
        save(state)
      }
      return delay({ order: o, qr: o.payment === 'chuyen_khoan' && o.payment_status === 'chua_tra' ? mockQr(o) : null })
    },

    async listEvents(tab) {
      const state = load()
      const t = now().getTime()
      const list = mockEvents()
        .map(e => withMine(state, e))
        .filter(e => (tab === 'da_qua' ? Date.parse(e.starts_at) + 7200000 < t : Date.parse(e.starts_at) + 7200000 >= t))
        .sort((a, b) => (tab === 'da_qua' ? -1 : 1) * (Date.parse(a.starts_at) - Date.parse(b.starts_at)))
      return delay({ events: list })
    },

    async event(slug) {
      const e = mockEvents().find(x => x.slug === slug)
      if (!e) throw new ApiError(404, 'not_found', 'Không tìm thấy sự kiện này.')
      return delay({ event: withMine(load(), e) })
    },

    async remindEvent(slug, kind, on) {
      const state = load()
      requireSession(state)
      const e = mockEvents().find(x => x.slug === slug)
      if (!e) throw new ApiError(404, 'not_found', 'Không tìm thấy sự kiện này.')
      if (on && Date.parse(e.starts_at) < now().getTime()) throw new ApiError(409, 'event_closed', 'Sự kiện này đã diễn ra hoặc đã huỷ.')
      if (kind === 'giu_cho' && e.capacity === null) throw new ApiError(400, 'bad_request', 'Sự kiện này không cần giữ chỗ, chị bấm "Nhắc tôi" nhé.')
      state.reminders = state.reminders.filter(r => !(r.slug === slug && r.kind === kind))
      if (on) {
        state.reminders.push({ slug, kind })
        if (kind === 'giu_cho' && !state.reminders.some(r => r.slug === slug && r.kind === 'nhac')) state.reminders.push({ slug, kind: 'nhac' })
      }
      save(state)
      return delay({ event: withMine(state, e) })
    },

    async notifications() {
      const state = load()
      const t = now().getTime()
      const notifications = MOCK_NOTIFICATIONS.map((n, i) => ({
        ...n,
        published_at: new Date(t - (i + 1) * 3 * 3600000).toISOString(),
        read: !state.session || state.readIds.includes(n.id),
      }))
      const reminders = mockEvents()
        .filter(e => state.reminders.some(r => r.slug === e.slug && r.kind === 'nhac'))
        .filter(e => Date.parse(e.starts_at) > t && Date.parse(e.starts_at) - t <= 86400000)
        .map(e => ({ slug: e.slug, title: e.title, starts_at: e.starts_at, within_hour: Date.parse(e.starts_at) - t <= 3600000 }))
      return delay({ notifications, reminders, unread: notifications.filter(n => !n.read).length + reminders.length })
    },

    async readNotifications(req) {
      const state = load()
      if (!state.session) return delay({ unread: 0 })
      const ids = 'all' in req ? MOCK_NOTIFICATIONS.map(n => n.id) : req.ids
      state.readIds = [...new Set([...state.readIds, ...ids])]
      save(state)
      return delay({ unread: MOCK_NOTIFICATIONS.filter(n => !state.readIds.includes(n.id)).length })
    },

    async lessonProgress(no, watchedPct) {
      const state = load()
      requireSession(state)
      if (!lessons(state).some(l => l.no === no)) throw new ApiError(403, 'not_unlocked', 'Bài này chưa mở, chị chờ tới ngày học nhé.')
      const prev = state.progress[no] ?? { watched_pct: 0, completed_at: null }
      const pct = Math.max(prev.watched_pct, Math.min(100, Math.round(watchedPct)))
      state.progress[no] = { watched_pct: pct, completed_at: prev.completed_at ?? (pct >= COMPLETE_PCT ? now().toISOString() : null) }
      save(state)
      return delay({ no, ...state.progress[no], unlocked: lessons(state).map(l => ({ no: l.no, unlocked_at: l.unlocked_at })) })
    },

    async revokeConsent(channel) {
      const state = load()
      requireSession(state)
      state.consents = state.consents.map(c => (!channel || c.channel === channel ? { ...c, revoked_at: now().toISOString() } : c))
      save(state)
      return delay(undefined)
    },
  }
}
