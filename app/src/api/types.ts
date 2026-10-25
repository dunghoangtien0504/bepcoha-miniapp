// Hợp đồng /api/mini/* với Haco-OS (đã thống nhất với phiên CRM, 23/10/2026).
// Xem Mini-App/THIET-KE-MINI-APP-v1.md mục 6.

export type Channel = 'shopee' | 'tiktok' | 'facebook' | 'bep'
export type VerifiedVia = 'zalo_phone_token' | 'otp' | 'staff' | 'order_match'
export type ConsentChannel = 'zalo_oa' | 'dien_thoai' | 'sms'

export interface Batch {
  code: string
  channel: Channel
  cta: string
  landing_variant: string
}

export interface Session {
  id: number
  verified: boolean
  verified_via: VerifiedVia | null
  phone_masked: string
  started_at: string
}

export interface Reward {
  code: string
  kind: 'voucher' | 'hoan_tien' | 'gioi_thieu'
  program: string
  amount: number
  expires_at: string | null
  status: 'da_cap' | 'da_dung' | 'het_han' | 'huy'
  phone_masked: string
}

export interface LessonState {
  no: number
  unlocked_at: string
  watched_pct: number
  completed_at: string | null
}

export interface Claim {
  id: number
  status: 'cho_duyet' | 'da_khop' | 'tu_choi'
  created_at: string
}

export interface FunnelEvent {
  name: string
  step: number
  batch_code?: string
  props?: Record<string, unknown>
  at?: string
}

export interface SessionRes { batch: Batch | null; session: Session | null }

export interface IdentifyReq {
  anon_id: string
  batch_code?: string
  phone?: string
  zalo_phone_token?: string
  zalo_access_token?: string
  name?: string
  consents: { channel: ConsentChannel; purpose: 'cham_soc_sau_mua'; text_version: string }[]
}
export interface IdentifyRes { session: Session; token?: string; rewards: Reward[] }

export interface ClaimRes { claim_id: number; status: 'da_khop' | 'cho_duyet'; session: Session }

export interface CheckinState {
  today_done: boolean
  streak: number
  next_milestone: number | null
  freeze_available: boolean
}

/** Mức Hạt Cốm do server quyết (app_settings 'mini_points'); client chỉ hiển thị. */
export interface PointsRules {
  checkin: number
  milestones: Record<string, number>
}

export interface MeRes {
  session: Session
  rewards: Reward[]
  lessons: LessonState[]
  claims: Claim[]
  referral_code: string | null
  points: number
  /** v4: tổng Hạt Cốm đã tích (không trừ khi tiêu) để xếp hạng thành viên. Server cũ chưa có thì undefined. */
  points_earned?: number
  points_rules: PointsRules
  checkin: CheckinState
  saved_recipes: string[]
  /** v3-A: số tin chưa đọc cho chuông (server cũ chưa có thì undefined). */
  unread_notifications?: number
}

export interface CheckinRes {
  checkin: CheckinState
  earned: { reason: 'diem_danh' | 'moc_chuoi'; points: number; milestone?: number }[]
  points: number
}

export interface SaveRecipeRes {
  saved_recipes: string[]
}

export interface ProgressRes {
  no: number
  watched_pct: number
  completed_at: string | null
  unlocked: { no: number; unlocked_at: string }[]
}

// ── v2-B: giỏ hàng. Giá, giảm giá, tổng do server tính; app chỉ hiển thị. ──

export interface CatalogItem {
  sku: string
  product: string
  name: string
  variant: string
  price: number
  image: string
}

export interface CatalogRes {
  items: CatalogItem[]
  /** null = chưa bật đổi Hạt Cốm (Cô Hạ chưa chốt mức quy đổi). */
  redeem: { vnd_per_point: number; max_pct: number } | null
}

export interface CartLine { sku: string; qty: number }

export interface QuoteReq {
  items: CartLine[]
  voucher_code?: string | null
  use_points?: number
}

export interface OrderLine { sku: string; label: string; qty: number; unit_price: number }

export interface Quote {
  items: OrderLine[]
  subtotal: number
  voucher: { code: string; amount: number } | null
  /** null khi phiên chưa xác minh hoặc chưa bật đổi điểm. */
  points: { available: number; usable: number; used: number; amount: number; vnd_per_point: number } | null
  total: number
  shipping_note: string
}

export type Payment = 'cod' | 'chuyen_khoan'

export interface PlaceOrderReq extends QuoteReq {
  name: string
  address: string
  note?: string
  payment: Payment
  /** Tổng app đang hiện; lệch với server → 409 price_changed. */
  expected_total?: number
}

export interface Order {
  ref_code: string
  created_at: string
  items: OrderLine[]
  subtotal: number
  voucher_amount: number
  points_used: number
  points_amount: number
  total: number
  payment: Payment
  payment_status: 'chua_tra' | 'da_tra'
  status: 'moi' | 'huy'
  status_label: string
  phone_masked: string
}

export interface TransferQr {
  bankAccount: string
  bankCode: string
  accountName: string
  amount: number
  content: string
  qrUrl: string
}

export interface OrderRes { order: Order; qr: TransferQr | null }

// ── v3-A: sự kiện, thông báo ──

export type EventKind = 'livestream' | 'workshop' | 'thu_thach' | 'uu_dai' | 'le_tet' | 'khac'

export interface MiniEvent {
  slug: string
  title: string
  summary: string
  body: string
  kind: EventKind
  starts_at: string
  ends_at: string | null
  location: string
  image: string
  join_url: string
  status: 'cong_bo' | 'huy'
  capacity: number | null
  seats_left: number | null
  reminded: boolean
  booked: boolean
}

export interface MiniNotification {
  id: number
  title: string
  body: string
  /** Đường dẫn trong app ("/su-kien/…") hoặc rỗng. */
  link: string
  image: string
  kind: 'su_kien' | 'cong_thuc' | 'uu_dai' | 'don_hang' | 'khoe_mon' | 'he_thong'
  published_at: string
  read: boolean
}

export interface UpcomingReminder {
  slug: string
  title: string
  starts_at: string
  within_hour: boolean
}

export interface NotificationsRes {
  notifications: MiniNotification[]
  reminders: UpcomingReminder[]
  unread: number
}

// ── v8: Góc bếp chị em (khách đăng ảnh + caption, Bếp duyệt rồi mới hiện; không tim, không bình luận — Zalo 4.6) ──

export interface CommunityPost {
  id: number
  caption: string
  display_name: string
  area: string
  recipe_slug: string | null
  praised: boolean
  pinned: boolean
  created_at: string
  /** Đường dẫn ảnh trên Haco-OS (bản giả: data URL). */
  image_url: string
}

export interface MyPost extends CommunityPost {
  status: 'cho_duyet' | 'da_duyet' | 'tu_choi' | 'an'
  reject_reason: string
}

export interface CreatePostReq {
  /** data:image/jpeg;base64,… đã nén ở máy (≤ 1280px, ≤ 800KB). */
  image: string
  caption: string
  display_name?: string
  area?: string
  recipe_slug?: string | null
  /** Đồng ý cho Bếp đăng ảnh — bắt buộc true, ô không tick sẵn. */
  consent: boolean
}

export interface MiniApi {
  session(req: { anon_id: string; batch?: string; ref?: string }): Promise<SessionRes>
  events(req: { anon_id: string; events: FunnelEvent[] }): Promise<void>
  identify(req: IdentifyReq): Promise<IdentifyRes>
  claimOrder(code: string): Promise<ClaimRes>
  me(): Promise<MeRes>
  lessonProgress(no: number, watchedPct: number): Promise<ProgressRes>
  revokeConsent(channel?: ConsentChannel): Promise<void>
  checkin(): Promise<CheckinRes>
  saveRecipe(slug: string, saved: boolean): Promise<SaveRecipeRes>
  catalog(): Promise<CatalogRes>
  quote(req: QuoteReq): Promise<Quote>
  placeOrder(req: PlaceOrderReq): Promise<OrderRes>
  orders(): Promise<{ orders: Order[] }>
  order(ref: string): Promise<OrderRes>
  listEvents(tab: 'sap_toi' | 'da_qua'): Promise<{ events: MiniEvent[] }>
  event(slug: string): Promise<{ event: MiniEvent }>
  remindEvent(slug: string, kind: 'nhac' | 'giu_cho', on: boolean): Promise<{ event: MiniEvent }>
  notifications(): Promise<NotificationsRes>
  readNotifications(req: { ids: number[] } | { all: true }): Promise<{ unread: number }>
  communityPosts(): Promise<{ posts: CommunityPost[] }>
  myPosts(): Promise<{ posts: MyPost[] }>
  createPost(req: CreatePostReq): Promise<{ post: { id: number; status: MyPost['status']; created_at: string } }>
}

/** Lỗi API: `code` là mã máy (snake_case), `message` là câu tiếng Việt hiện cho khách. */
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public data: Record<string, unknown> = {},
  ) {
    super(message)
  }
}
