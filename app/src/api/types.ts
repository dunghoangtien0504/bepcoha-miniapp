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
  points_rules: PointsRules
  checkin: CheckinState
  saved_recipes: string[]
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
