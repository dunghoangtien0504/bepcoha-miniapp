// API giả chạy trong trình duyệt (vite --mode mock), mô phỏng đúng quy tắc của hợp đồng /api/mini/*,
// để dựng và thử giao diện khi Haco-OS chưa có route. Không gửi dữ liệu đi đâu.
//
// Mẹo thử (thêm "haco_mock_days" +1 mỗi lần để thử điểm danh nhiều ngày liền):
//  - Mã đơn bắt đầu bằng "TEST" → khớp SĐT (da_khop, phiên được xác minh). Mã khác → chờ duyệt.
//  - localStorage "haco_mock_days" = số ngày giả lập đã trôi qua (để mở các bài sau).
//  - ?mock_voucher=1 trên URL lúc đăng ký → cấp voucher thử (Đợt A chưa chốt số tiền).
import { COMPLETE_PCT, unlockAt } from '../lib/lessons'
import { maskPhone, normalizeVnPhone } from '../lib/phone'
import { readLocal, writeLocal } from '../lib/storage'
import { computeStreak, vnDay } from '../lib/streak'
import { LESSONS } from '../content'
import { findRecipe } from '../recipes'
import { ApiError, type Batch, type CheckinState, type Claim, type LessonState, type MiniApi, type PointsRules, type Reward, type Session } from './types'

const KEY = 'haco_mock_state'
const CLAIM_LIMIT_PER_SESSION = 5
// Giống mặc định của server (Haco-OS lib/mini/points.ts) — Cô Hạ chưa chốt mức điểm.
const RULES: PointsRules = { checkin: 5, milestones: { '3': 10, '7': 30, '14': 60, '30': 150 } }

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
}

const empty = (): MockState => ({ session: null, rewards: [], claims: [], failedClaims: [], claimLockedUntil: null, progress: {}, consents: [], checkins: [], points: [], saved: [] })
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
        points_rules: RULES,
        checkin: checkinState(state),
        saved_recipes: state.saved,
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
