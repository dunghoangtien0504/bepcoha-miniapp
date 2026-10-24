import { describe, expect, it } from 'vitest'
import { formatClock, minutesLabel, remainingSec } from './timer'

describe('hẹn giờ khi nấu', () => {
  it('định dạng đồng hồ', () => {
    expect(formatClock(75)).toBe('01:15')
    expect(formatClock(3725)).toBe('1:02:05')
    expect(formatClock(-3)).toBe('00:00')
  })
  it('còn lại tính theo giờ kết thúc, không âm', () => {
    expect(remainingSec(10_500, 10_000)).toBe(1)
    expect(remainingSec(10_000, 20_000)).toBe(0)
  })
  it('nhãn phút dễ đọc', () => {
    expect(minutesLabel(15)).toBe('15 phút')
    expect(minutesLabel(90)).toBe('1 tiếng 30 phút')
    expect(minutesLabel(120)).toBe('2 tiếng')
  })
})
