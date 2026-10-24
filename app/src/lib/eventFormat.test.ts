import { describe, expect, it } from 'vitest'
import type { MiniEvent } from '../api/types'
import { countdown, eventIcs, eventWhen } from './eventFormat'

const ev = (starts: string, ends: string | null = null): MiniEvent => ({
  slug: 'live-xoi', title: 'Nấu xôi; cốm, mùa thu', summary: 'Cùng Cô Hạ', body: '', kind: 'livestream', starts_at: starts, ends_at: ends,
  location: '', image: '', join_url: '', status: 'cong_bo', capacity: null, seats_left: null, reminded: false, booked: false,
})

describe('hiển thị sự kiện', () => {
  it('giờ theo giờ Việt Nam', () => {
    expect(eventWhen('2026-10-25T13:00:00Z')).toBe('Chủ Nhật, 25/10 · 20:00')
  })
  it('đếm ngược', () => {
    const now = Date.parse('2026-10-25T10:00:00Z')
    expect(countdown(ev('2026-10-25T10:08:00Z'), now)).toBe('Còn 8 phút')
    expect(countdown(ev('2026-10-25T13:15:00Z'), now)).toBe('Còn 3 giờ 15 phút')
    expect(countdown(ev('2026-10-27T13:00:00Z'), now)).toBe('Còn 2 ngày')
    expect(countdown(ev('2026-10-25T09:30:00Z'), now)).toBe('Đang diễn ra')
    expect(countdown(ev('2026-10-25T07:00:00Z', '2026-10-25T08:00:00Z'), now)).toBe('Đã diễn ra')
  })
  it('file lịch .ics đúng giờ UTC, có nhắc trước 1 giờ, thoát dấu phẩy chấm phẩy', () => {
    const ics = eventIcs(ev('2026-10-25T13:00:00Z'), 'https://hacofood.vn/m/su-kien/live-xoi')
    expect(ics).toContain('DTSTART:20261025T130000Z')
    expect(ics).toContain('DTEND:20261025T150000Z')
    expect(ics).toContain('TRIGGER:-PT1H')
    expect(ics).toContain(String.raw`SUMMARY:Nấu xôi\; cốm\, mùa thu`)
  })
})
