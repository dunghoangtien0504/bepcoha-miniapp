import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createHttpApi } from './api/http'
import { createMockApi } from './api/mock'
import type { Batch, IdentifyRes, MeRes, MiniApi, Session } from './api/types'
import { createTracker, type Tracker } from './lib/events'
import { getAnonId, readLocal, writeLocal } from './lib/storage'
import { platform } from './platform'

interface MiniState {
  ready: boolean
  bootError: string | null
  api: MiniApi
  anonId: string
  batch: Batch | null
  session: Session | null
  me: MeRes | null
  track: Tracker['track']
  refreshMe(): Promise<MeRes | null>
  onIdentified(res: IdentifyRes): Promise<void>
  setSession(s: Session): void
}

const Ctx = createContext<MiniState | null>(null)

export function useMini(): MiniState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useMini ngoài MiniProvider')
  return v
}

const BATCH_KEY = 'haco_batch_code'

export function MiniProvider({ children }: { children: ReactNode }) {
  const api = useMemo<MiniApi>(
    () =>
      import.meta.env.MODE === 'mock'
        ? createMockApi()
        : // Bản Zalo báo cho server biết để nhận token phiên trong body (không dùng cookie).
          createHttpApi({ getToken: platform.getToken, headers: platform.mode === 'zalo' ? { 'X-Mini-Platform': 'zalo' } : {} }),
    [],
  )
  const anonId = useMemo(getAnonId, [])
  const [ready, setReady] = useState(false)
  const [bootError, setBootError] = useState<string | null>(null)
  const [batch, setBatch] = useState<Batch | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [me, setMe] = useState<MeRes | null>(null)
  const batchRef = useRef<string | undefined>(undefined)
  const tracker = useMemo(() => createTracker(api, anonId, () => batchRef.current), [api, anonId])

  const refreshMe = useCallback(async () => {
    try {
      const res = await api.me()
      setMe(res)
      setSession(res.session)
      return res
    } catch {
      return null
    }
  }, [api])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        await platform.init()
        const params = platform.launchParams()
        // Mã lô QR: lấy từ link lần này, không có thì dùng mã đã quét trước đó trên máy này.
        const code = params.b || readLocal(BATCH_KEY) || undefined
        const res = await api.session({ anon_id: anonId, batch: code, ref: params.ref })
        if (!alive) return
        if (res.batch) {
          batchRef.current = res.batch.code
          writeLocal(BATCH_KEY, res.batch.code)
        }
        setBatch(res.batch)
        setSession(res.session)
        if (res.session) await refreshMe()
      } catch {
        if (alive) setBootError('Chưa kết nối được tới Bếp Cô Hạ. Chị kiểm tra mạng rồi mở lại giúp Cô nhé.')
      } finally {
        if (alive) setReady(true)
      }
    })()
    const onHide = () => void tracker.flush()
    window.addEventListener('pagehide', onHide)
    return () => {
      alive = false
      window.removeEventListener('pagehide', onHide)
    }
  }, [api, anonId, refreshMe, tracker])

  const onIdentified = useCallback(
    async (res: IdentifyRes) => {
      if (res.token) await platform.setToken(res.token)
      setSession(res.session)
      await refreshMe()
    },
    [refreshMe],
  )

  const value: MiniState = { ready, bootError, api, anonId, batch, session, me, track: tracker.track, refreshMe, onIdentified, setSession }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
