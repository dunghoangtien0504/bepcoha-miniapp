// Kiểu cho module nội bộ của zmp-ui mà src/router.tsx dùng (zmp-ui không có "exports", import sâu được).
declare module 'zmp-ui/esm/components/router/ZMPRouter' {
  import type { Context } from 'react'
  export const AnimationRouterContext: Context<
    | {
        setAnimate(opts: { animate?: boolean; direction?: string }): void
        animate: boolean
        direction: string
        pageScrollPosition: Record<string, number>
        updatePosition(key: string, position: number): void
      }
    | undefined
  >
}
