import type { Platform } from './types'

// zmp-sdk chỉ được nạp trong bản Zalo (import động), bản web không kéo thư viện này vào.
const sdk = () => import('zmp-sdk/apis')

const TOKEN_KEY = 'haco_mini_token'
let token: string | null = null

export const zaloPlatform: Platform = {
  mode: 'zalo',

  launchParams() {
    // Zalo truyền tham số deep link/QR qua query của trang mở đầu.
    return Object.fromEntries(new URLSearchParams(window.location.search))
  },

  async identify() {
    const { getPhoneNumber, getAccessToken } = await sdk()
    // getPhoneNumber hiện bảng xin quyền; token chỉ dùng 1 lần, hết hạn sau 2 phút → gửi lên server ngay.
    const { token: phoneToken } = await getPhoneNumber({})
    if (!phoneToken) throw new Error('denied')
    const accessToken = await getAccessToken({})
    return { kind: 'zalo', phoneToken, accessToken }
  },

  canFollowInApp: true,

  async followOA(oaId) {
    const { followOA } = await sdk()
    try {
      await followOA({ id: oaId })
      return 'followed'
    } catch {
      return 'denied' // -201: khách từ chối
    }
  },

  async openChat(target, message) {
    const { openChat, openWebview } = await sdk()
    if (target.kind === 'zalo_oa') await openChat({ type: 'oa', id: target.oaId, message })
    else await openWebview({ url: target.url })
  },

  async share({ url }) {
    // Chia sẻ dạng link: Zalo tự lấy tiêu đề/ảnh từ trang, nên không dùng title/text.
    const { openShareSheet } = await sdk()
    try {
      await openShareSheet({ type: 'link', data: { link: url, chatOnly: false } })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  },

  async openExternal(url) {
    const { openWebview } = await sdk()
    // Trang sản phẩm Haco-OS là đường dẫn tương đối ở bản web; trong Zalo phải mở bằng địa chỉ đầy đủ.
    const full = url.startsWith('/') ? (import.meta.env.VITE_SITE_ORIGIN || '') + url : url
    await openWebview({ url: full })
  },

  async keepAwake(on) {
    const { keepScreen } = await sdk()
    try {
      await keepScreen({ keepScreenOn: on })
    } catch {
      // bỏ qua: chế độ nấu vẫn dùng được
    }
  },

  getToken: () => token,

  async setToken(next) {
    token = next
    const { nativeStorage } = await sdk()
    try {
      if (next) nativeStorage.setItem(TOKEN_KEY, next)
      else nativeStorage.removeItem(TOKEN_KEY)
    } catch {
      // bỏ qua: lần mở sau khách đăng nhập lại bằng SĐT Zalo
    }
  },

  async init() {
    const { nativeStorage } = await sdk()
    try {
      token = nativeStorage.getItem(TOKEN_KEY) || null
    } catch {
      token = null
    }
  },
}
