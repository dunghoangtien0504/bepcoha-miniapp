// Quy tắc mở bài (server quyết, ở đây chỉ dùng cho API giả và để hiển thị):
// bài 1 mở lúc khách đăng ký; bài n mở lúc 00:00 giờ VN của ngày đăng ký + (n − 1). Hoàn thành khi xem ≥ 90%.

export const COMPLETE_PCT = 90
const VN_OFFSET_MS = 7 * 3600 * 1000
const DAY_MS = 24 * 3600 * 1000

export function unlockAt(startedAt: Date, no: number): Date {
  if (no <= 1) return startedAt
  const vnMidnight = Math.floor((startedAt.getTime() + VN_OFFSET_MS) / DAY_MS) * DAY_MS - VN_OFFSET_MS
  return new Date(vnMidnight + (no - 1) * DAY_MS)
}

/** "hôm nay" / "ngày mai" / "thứ Hai 27/10" theo giờ VN, để báo bài tiếp theo mở lúc nào. */
export function describeUnlock(at: Date, now: Date = new Date()): string {
  const day = (d: Date) => Math.floor((d.getTime() + VN_OFFSET_MS) / DAY_MS)
  const diff = day(at) - day(now)
  if (diff <= 0) return 'hôm nay'
  if (diff === 1) return 'ngày mai'
  return new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).format(at)
}
