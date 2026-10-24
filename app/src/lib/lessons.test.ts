import { describe, expect, it } from 'vitest'
import { describeUnlock, unlockAt } from './lessons'

describe('unlockAt (giờ Việt Nam)', () => {
  // 23/10/2026 21:30 giờ VN = 14:30 UTC
  const started = new Date('2026-10-23T14:30:00Z')

  it('bài 1 mở ngay lúc đăng ký', () => expect(unlockAt(started, 1).toISOString()).toBe(started.toISOString()))

  it('bài 2 mở 00:00 giờ VN ngày hôm sau', () => expect(unlockAt(started, 2).toISOString()).toBe('2026-10-23T17:00:00.000Z'))

  it('bài 8 mở 00:00 giờ VN ngày thứ 7 sau đó', () => expect(unlockAt(started, 8).toISOString()).toBe('2026-10-29T17:00:00.000Z'))

  it('đăng ký lúc 01:00 sáng VN vẫn tính là cùng ngày VN', () => {
    const early = new Date('2026-10-23T18:00:00Z') // 24/10 01:00 VN
    expect(unlockAt(early, 2).toISOString()).toBe('2026-10-24T17:00:00.000Z')
  })
})

describe('describeUnlock', () => {
  const now = new Date('2026-10-23T14:30:00Z')
  it('hôm nay', () => expect(describeUnlock(new Date('2026-10-23T16:00:00Z'), now)).toBe('hôm nay'))
  it('ngày mai', () => expect(describeUnlock(new Date('2026-10-23T17:00:00Z'), now)).toBe('ngày mai'))
})
