import { describe, expect, it } from 'vitest'
import type { Reward } from '../api/types'
import { RECIPES } from '../recipes'
import { daypart, pickForDaypart, vnHour } from './daypart'
import { checkGift, giftNote, giftShareText } from './gift'
import { tierOf } from './tiers'
import { daysLeft, reorderLines, usableVouchers } from './wallet'

describe('hạng thành viên', () => {
  it('tính hạng và số hạt còn thiếu', () => {
    expect(tierOf(0)).toMatchObject({ current: { name: 'Tập sự' }, next: { name: 'Đảm đang' }, toNext: 200, pct: 0 })
    expect(tierOf(199).current.name).toBe('Tập sự')
    expect(tierOf(200)).toMatchObject({ current: { name: 'Đảm đang' }, toNext: 400, pct: 0 })
    expect(tierOf(400).pct).toBe(50)
    expect(tierOf(4000)).toMatchObject({ current: { name: 'Bếp trưởng' }, next: null, toNext: 0, pct: 100 })
  })
  it('giá trị lạ không làm hỏng', () => {
    expect(tierOf(-5).current.name).toBe('Tập sự')
    expect(tierOf(NaN).current.name).toBe('Tập sự')
  })
})

describe('trang chủ theo bữa', () => {
  it('giờ VN và bữa', () => {
    expect(vnHour(new Date('2026-10-24T01:00:00Z'))).toBe(8)
    expect(vnHour(new Date('2026-10-24T20:00:00Z'))).toBe(3)
    expect(daypart(8).key).toBe('sang')
    expect(daypart(11).key).toBe('trua')
    expect(daypart(16).key).toBe('chieu')
    expect(daypart(21).key).toBe('toi')
    expect(daypart(2).key).toBe('toi')
  })
  it('món buổi trưa là món nhanh, đổi theo ngày', () => {
    const a = pickForDaypart(RECIPES, 'trua', '2026-10-24')!
    expect(a.minutes).toBeLessThanOrEqual(30)
    const days = ['2026-10-24', '2026-10-25', '2026-10-26'].map(d => pickForDaypart(RECIPES, 'chieu', d)!.slug)
    expect(new Set(days).size).toBeGreaterThan(1)
  })
  it('danh sách rỗng trả undefined', () => {
    expect(pickForDaypart([], 'sang', '2026-10-24')).toBeUndefined()
  })
})

const reward = (over: Partial<Reward>): Reward => ({
  code: 'A', kind: 'voucher', program: 'p', amount: 20000, expires_at: null, status: 'da_cap', phone_masked: '09******01', ...over,
})

describe('ví ưu đãi và đặt lại', () => {
  const now = new Date('2026-10-24T00:00:00Z')
  it('chỉ voucher còn dùng, sắp hết hạn đứng trước', () => {
    const list = usableVouchers(
      [
        reward({ code: 'KHONGHAN' }),
        reward({ code: 'XA', expires_at: '2026-11-10T00:00:00Z' }),
        reward({ code: 'GAN', expires_at: '2026-10-26T00:00:00Z' }),
        reward({ code: 'DADUNG', status: 'da_dung' }),
        reward({ code: 'QUAHAN', expires_at: '2026-10-20T00:00:00Z' }),
        reward({ code: 'HOAN', kind: 'hoan_tien' }),
      ],
      now,
    )
    expect(list.map(r => r.code)).toEqual(['GAN', 'XA', 'KHONGHAN'])
    expect(daysLeft('2026-10-26T00:00:00Z', now)).toBe(2)
    expect(daysLeft('2026-10-24T05:00:00Z', now)).toBe(1)
    expect(daysLeft(null, now)).toBeNull()
  })
  it('đặt lại bỏ món đã ngừng bán', () => {
    const r = reorderLines(
      [
        { sku: 'SXX-300', label: 'Sốt xá xíu 300g', qty: 2, unit_price: 1 },
        { sku: 'CU', label: 'Món cũ', qty: 1, unit_price: 1 },
      ],
      s => s === 'SXX-300',
    )
    expect(r).toEqual({ lines: [{ sku: 'SXX-300', qty: 2 }], skipped: ['Món cũ'] })
  })
})

describe('gửi tặng', () => {
  it('kiểm tên, SĐT, lời nhắn', () => {
    expect(checkGift({ toName: 'A', toPhone: '0912345678', message: '' }).ok).toBe(false)
    expect(checkGift({ toName: 'Mẹ Lan', toPhone: '12345', message: '' }).ok).toBe(false)
    expect(checkGift({ toName: 'Mẹ Lan', toPhone: '0912345678', message: 'x'.repeat(151) }).ok).toBe(false)
    expect(checkGift({ toName: 'Mẹ Lan', toPhone: '+84 912 345 678', message: '' })).toEqual({ ok: true, phone: '0912345678' })
  })
  it('ghi chú đơn có phần quà đứng đầu', () => {
    const n = giftNote({ toName: ' Mẹ Lan ', toPhone: '', message: 'Chúc mẹ khoẻ' }, '0912345678', 'giao giờ hành chính')
    expect(n.startsWith('[QUÀ TẶNG] Người nhận: Mẹ Lan · SĐT 0912345678.')).toBe(true)
    expect(n).toContain('“Chúc mẹ khoẻ”')
    expect(n).toContain('Ghi chú: giao giờ hành chính')
    expect(giftShareText('', '')).toContain('Gửi bạn,')
    expect(giftShareText('Mẹ', 'Thương mẹ')).not.toMatch(/\d+đ/)
  })
})

describe('dải món theo bữa', () => {
  it('đủ số món, không trùng, đúng luật bữa, bỏ món skip', async () => {
    const { pickManyForDaypart, pickForDaypart } = await import('./daypart')
    const first = pickForDaypart(RECIPES, 'trua', '2026-10-24')!
    const list = pickManyForDaypart(RECIPES, 'trua', '2026-10-24', 5)
    expect(list[0]).toBe(first)
    expect(new Set(list.map(r => r.slug)).size).toBe(list.length)
    expect(list.every(r => r.minutes <= 30)).toBe(true)
    const skipped = pickManyForDaypart(RECIPES, 'trua', '2026-10-24', 5, [first.slug])
    expect(skipped.map(r => r.slug)).not.toContain(first.slug)
  })
})
