import { ApiError, type MiniApi } from './types'

const FALLBACK_MESSAGE = 'Có lỗi kết nối, chị thử lại giúp Cô nhé.'

/**
 * Client gọi Haco-OS. Bản web dựa vào cookie httpOnly `mini_session` (cùng origin);
 * bản Zalo gửi token qua header Authorization (getToken).
 */
export function createHttpApi(opts: { base?: string; getToken?: () => string | null; headers?: Record<string, string> } = {}): MiniApi {
  const base = opts.base ?? ''

  async function call<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json', ...opts.headers }
    if (body !== undefined) headers['Content-Type'] = 'application/json'
    const token = opts.getToken?.()
    if (token) headers.Authorization = `Bearer ${token}`
    let res: Response
    try {
      res = await fetch(base + path, {
        method,
        headers,
        credentials: 'same-origin',
        body: body === undefined ? undefined : JSON.stringify(body),
      })
    } catch {
      throw new ApiError(0, 'network', FALLBACK_MESSAGE)
    }
    if (res.status === 204) return undefined as T
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      throw new ApiError(
        res.status,
        typeof data.error === 'string' ? data.error : 'http_' + res.status,
        typeof data.message === 'string' ? data.message : FALLBACK_MESSAGE,
        data,
      )
    }
    return data as T
  }

  return {
    session: req => call('POST', '/api/mini/session', req),
    events: req => call('POST', '/api/mini/event', req),
    identify: req => call('POST', '/api/mini/identify', req),
    claimOrder: code => call('POST', '/api/mini/claim-order', { code }),
    me: () => call('GET', '/api/mini/me'),
    lessonProgress: (no, watched_pct) => call('POST', `/api/mini/lesson/${no}/progress`, { watched_pct }),
    revokeConsent: channel => call('POST', '/api/mini/consent/revoke', channel ? { channel } : {}),
    checkin: () => call('POST', '/api/mini/checkin', {}),
    saveRecipe: (slug, saved) => call('POST', `/api/mini/recipes/${encodeURIComponent(slug)}/save`, { saved }),
    catalog: () => call('GET', '/api/mini/catalog'),
    quote: req => call('POST', '/api/mini/orders/quote', req),
    placeOrder: req => call('POST', '/api/mini/orders', req),
    orders: () => call('GET', '/api/mini/orders'),
    order: ref => call('GET', `/api/mini/orders/${encodeURIComponent(ref)}`),
  }
}
