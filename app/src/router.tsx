import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ZMPRouter } from 'zmp-ui'
import { AnimationRouterContext } from 'zmp-ui/esm/components/router/ZMPRouter'
import { IS_ZALO } from './platform'

// ZMPRouter của zmp-ui chỉ dùng được trong Zalo: ở bản build production nó LUÔN đặt basename "/zapps/<APP_ID>",
// nên chạy trên web (/m) thì router không khớp URL nào → trang trắng, không báo lỗi (bản dev không bị).
// Bản web dùng BrowserRouter với basename /m và tự cấp AnimationRouterContext — useNavigate, AnimationRoutes
// và Page của zmp-ui đều đọc context này.

type Direction = 'forward' | 'backward'

function WebRouter({ children }: { children: ReactNode }) {
  const [animate, setAnimateState] = useState(true)
  const [direction, setDirection] = useState<Direction>('forward')
  const positions = useRef<Record<string, number>>({})

  const setAnimate = useCallback(({ animate: a = true, direction: d = 'forward' }: { animate?: boolean; direction?: string }) => {
    setAnimateState(!!a)
    setDirection(d === 'backward' ? 'backward' : 'forward')
  }, [])

  const value = useMemo(
    () => ({
      setAnimate,
      animate,
      direction,
      pageScrollPosition: positions.current,
      updatePosition: (key: string, position: number) => {
        positions.current[key] = position
      },
    }),
    [setAnimate, animate, direction],
  )

  return (
    <AnimationRouterContext.Provider value={value}>
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>{children}</BrowserRouter>
    </AnimationRouterContext.Provider>
  )
}

export function AppRouter({ children }: { children: ReactNode }) {
  return IS_ZALO ? <ZMPRouter>{children}</ZMPRouter> : <WebRouter>{children}</WebRouter>
}
