import type { Platform } from './types'

let wakeLock: { release(): Promise<void> } | null = null

// Android Chrome báo app cài được qua sự kiện beforeinstallprompt; giữ lại để mở hộp cài đặt khi khách bấm.
type InstallPrompt = Event & { prompt(): Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }
let installPrompt: InstallPrompt | null = null

export const webPlatform: Platform = {
  mode: 'web',

  launchParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search))
  },

  async identify() {
    return { kind: 'phone_form' }
  },

  canFollowInApp: false,

  async followOA(oaId) {
    window.open(`https://zalo.me/${encodeURIComponent(oaId)}`, '_blank', 'noopener')
    return 'opened'
  },

  async openChat(target) {
    const url = target.kind === 'zalo_oa' ? `https://zalo.me/${encodeURIComponent(target.oaId)}` : target.url
    window.open(url, '_blank', 'noopener')
  },

  async share({ title, text, url }) {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return 'shared'
      } catch {
        return 'cancelled'
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      return 'copied'
    } catch {
      return 'cancelled'
    }
  },

  async openExternal(url) {
    // Trang sản phẩm của Haco-OS (cùng origin, bắt đầu bằng "/") mở ngay trong tab; link ngoài mở tab mới.
    if (url.startsWith('/')) window.location.assign(url)
    else window.open(url, '_blank', 'noopener')
  },

  async keepAwake(on) {
    const nav = navigator as Navigator & { wakeLock?: { request(type: 'screen'): Promise<{ release(): Promise<void> }> } }
    try {
      if (on && nav.wakeLock) wakeLock = await nav.wakeLock.request('screen')
      else if (!on && wakeLock) {
        await wakeLock.release()
        wakeLock = null
      }
    } catch {
      // trình duyệt không cho (tab ẩn, chưa hỗ trợ): bỏ qua, chế độ nấu vẫn dùng được
    }
  },

  vibrate(ms) {
    try {
      navigator.vibrate?.(ms)
    } catch {
      // iPhone không hỗ trợ rung từ web: chỉ có tiếng báo và chữ
    }
  },

  isOnHomeScreen() {
    const nav = navigator as Navigator & { standalone?: boolean }
    return window.matchMedia?.('(display-mode: standalone)').matches || nav.standalone === true
  },

  async addToHome() {
    if (installPrompt) {
      const p = installPrompt
      installPrompt = null
      await p.prompt()
      const { outcome } = await p.userChoice
      return outcome === 'accepted' ? 'added' : 'dismissed'
    }
    return /iphone|ipad|ipod/i.test(navigator.userAgent) ? 'guide_ios' : 'guide_other'
  },

  getToken: () => null,
  setToken: async () => {},
  // Bản web không dùng ZMPRouter (xem src/router.tsx), nên không cần đặt window.BASE_PATH.
  async init() {
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault()
      installPrompt = e as InstallPrompt
    })
  },
}
