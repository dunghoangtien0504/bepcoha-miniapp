// Hiển thị sự kiện: nhãn loại, giờ theo giờ VN, đếm ngược, file lịch .ics cho nút "Thêm vào lịch" (bản web).
import type { EventKind, MiniEvent } from '../api/types'

export const EVENT_KINDS: Record<EventKind, { label: string; emoji: string }> = {
  livestream: { label: 'Livestream', emoji: '🎥' },
  workshop: { label: 'Workshop tại bếp', emoji: '👩‍🍳' },
  thu_thach: { label: 'Thử thách', emoji: '🏆' },
  uu_dai: { label: 'Ưu đãi', emoji: '🎁' },
  le_tet: { label: 'Lễ, Tết', emoji: '🏮' },
  khac: { label: 'Sự kiện', emoji: '📣' },
}

const TZ = 'Asia/Ho_Chi_Minh'

/** "Thứ Bảy, 25/10 · 20:00" (giờ VN). */
export function eventWhen(iso: string): string {
  const d = new Date(iso)
  const day = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', timeZone: TZ }).format(d)
  const dm = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: TZ }).format(d)
  const hm = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: TZ }).format(d)
  return `${day.charAt(0).toUpperCase() + day.slice(1)}, ${dm} · ${hm}`
}

/** "Còn 2 ngày", "Còn 3 giờ 15 phút", "Còn 8 phút", "Đang diễn ra", "Đã diễn ra". */
export function countdown(e: Pick<MiniEvent, 'starts_at' | 'ends_at'>, now: number = Date.now()): string {
  const start = Date.parse(e.starts_at)
  const end = e.ends_at ? Date.parse(e.ends_at) : start + 2 * 3600_000
  if (now >= end) return 'Đã diễn ra'
  if (now >= start) return 'Đang diễn ra'
  const min = Math.ceil((start - now) / 60_000)
  if (min < 60) return `Còn ${min} phút`
  const h = Math.floor(min / 60)
  if (h < 24) return `Còn ${h} giờ${min % 60 ? ` ${min % 60} phút` : ''}`
  return `Còn ${Math.floor(h / 24)} ngày`
}

const icsDate = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/[,;]/g, m => '\\' + m)

/** Nội dung file .ics (nhắc trước 1 giờ). */
export function eventIcs(e: MiniEvent, url: string): string {
  const end = e.ends_at ?? new Date(Date.parse(e.starts_at) + 2 * 3600_000).toISOString()
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Bep Co Ha//Mini App//VI',
    'BEGIN:VEVENT',
    `UID:${e.slug}@bepcoha`,
    `DTSTAMP:${icsDate(new Date().toISOString())}`,
    `DTSTART:${icsDate(e.starts_at)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText([e.summary, url].filter(Boolean).join('\n'))}`,
    e.location ? `LOCATION:${icsText(e.location)}` : '',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:${icsText(e.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}
