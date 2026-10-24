import { describe, expect, it } from 'vitest'
import { maskPhone, normalizeVnPhone } from './phone'

describe('normalizeVnPhone', () => {
  it.each([
    ['0912345678', '0912345678'],
    ['091 234 5678', '0912345678'],
    ['091.234.5678', '0912345678'],
    ['+84912345678', '0912345678'],
    ['84912345678', '0912345678'],
    ['0387-654-321', '0387654321'],
  ])('%s → %s', (raw, expected) => expect(normalizeVnPhone(raw)).toBe(expected))

  it.each(['', '091234567', '09123456789', '0212345678', 'abc', '+1 415 555 0100'])('từ chối %s', raw =>
    expect(normalizeVnPhone(raw)).toBeNull(),
  )
})

describe('maskPhone', () => {
  it('che giữa, giữ 2 số đầu và 2 số cuối', () => expect(maskPhone('0912345678')).toBe('09******78'))
})
