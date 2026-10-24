import { describe, expect, it } from 'vitest'
import { computeStreak, vnDay } from './streak'

describe('vnDay', () => {
  it('đổi sang ngày giờ VN (UTC+7)', () => {
    expect(vnDay(new Date('2026-10-23T16:59:00Z'))).toBe('2026-10-23')
    expect(vnDay(new Date('2026-10-23T17:00:00Z'))).toBe('2026-10-24')
  })
})

describe('computeStreak', () => {
  const T = '2026-10-24'
  it('chưa điểm danh lần nào', () => {
    expect(computeStreak([], T)).toMatchObject({ streak: 0, today_done: false, next_milestone: 3 })
  })
  it('điểm danh hôm nay, liên tiếp 3 ngày', () => {
    const s = computeStreak(['2026-10-22', '2026-10-23', '2026-10-24'], T)
    expect(s).toMatchObject({ streak: 3, today_done: true, chain_start: '2026-10-22', next_milestone: 7 })
  })
  it('hôm qua có điểm danh, hôm nay chưa: chuỗi vẫn sống', () => {
    expect(computeStreak(['2026-10-22', '2026-10-23'], T)).toMatchObject({ streak: 2, today_done: false })
  })
  it('lỡ đúng 1 ngày: giữ chuỗi (1 lần/7 ngày)', () => {
    const s = computeStreak(['2026-10-20', '2026-10-21', '2026-10-23', '2026-10-24'], T)
    expect(s.streak).toBe(4)
    expect(s.freeze_available).toBe(false)
  })
  it('lỡ 2 lần trong 7 ngày: đứt ở lần lỡ thứ hai', () => {
    const s = computeStreak(['2026-10-18', '2026-10-20', '2026-10-22', '2026-10-24'], T)
    expect(s.streak).toBe(2)
  })
  it('lỡ 2 ngày liền: đứt chuỗi', () => {
    expect(computeStreak(['2026-10-20', '2026-10-21'], T).streak).toBe(0)
  })
  it('trùng ngày không đếm 2 lần', () => {
    expect(computeStreak(['2026-10-24', '2026-10-24'], T).streak).toBe(1)
  })
  it('đủ 30 ngày thì hết mốc', () => {
    const days = Array.from({ length: 30 }, (_, i) => new Date(Date.parse('2026-09-25T00:00:00Z') + i * 86400000).toISOString().slice(0, 10))
    expect(computeStreak(days, T)).toMatchObject({ streak: 30, next_milestone: null })
  })
})
