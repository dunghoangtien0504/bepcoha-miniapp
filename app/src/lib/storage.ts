// localStorage có thể ném lỗi (chế độ riêng tư, webview chặn) — mọi lần đọc/ghi đều bọc try/catch.
// Chỉ lưu thứ không phải dữ liệu cá nhân: anon_id, mã lô QR, cờ giao diện.

export function readLocal(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeLocal(key: string, value: string | null): void {
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    // bỏ qua: app vẫn chạy, chỉ mất ghi nhớ giữa các lần mở
  }
}

let memoryAnon: string | null = null

export function getAnonId(): string {
  const saved = readLocal('haco_anon_id')
  if (saved) return saved
  memoryAnon ??=
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : 'a-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10)
  writeLocal('haco_anon_id', memoryAnon)
  return memoryAnon
}
