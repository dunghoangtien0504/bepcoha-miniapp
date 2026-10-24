import { beforeEach, describe, expect, it } from 'vitest'
import { createMockApi } from './mock'
import { ApiError } from './types'

// API giả phải giữ đúng các quy tắc của hợp đồng, để giao diện được thử đúng trước khi có API thật.
describe('mock /api/mini', () => {
  beforeEach(() => localStorage.clear())

  const start = async () => {
    const api = createMockApi()
    const res = await api.identify({ anon_id: 'a1', phone: '0912 345 678', consents: [] })
    return { api, res }
  }

  it('SĐT tự gõ trên web là chưa xác minh, và trả về đã che', async () => {
    const { res } = await start()
    expect(res.session.verified).toBe(false)
    expect(res.session.phone_masked).toBe('09******78')
    expect(JSON.stringify(res)).not.toContain('0912345678')
  })

  it('SĐT sai bị từ chối với mã invalid_phone', async () => {
    const api = createMockApi()
    await expect(api.identify({ anon_id: 'a1', phone: '123', consents: [] })).rejects.toMatchObject({ code: 'invalid_phone' })
  })

  it('mã đơn khớp → da_khop và phiên được xác minh qua order_match', async () => {
    const { api } = await start()
    const r = await api.claimOrder('test-123')
    expect(r.status).toBe('da_khop')
    expect(r.session.verified_via).toBe('order_match')
  })

  it('5 lần không khớp thì khoá nhập mã (429 claim_locked)', async () => {
    const { api } = await start()
    for (let i = 0; i < 5; i++) await api.claimOrder('99999')
    const err = await api.claimOrder('99999').catch(e => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(429)
    expect(err.code).toBe('claim_locked')
  })

  it('chỉ bài 1 mở ngày đầu; ghi tiến độ bài chưa mở bị 403', async () => {
    const { api } = await start()
    const me = await api.me()
    expect(me.lessons.map(l => l.no)).toEqual([1])
    await expect(api.lessonProgress(2, 50)).rejects.toMatchObject({ status: 403, code: 'not_unlocked' })
  })

  it('xem ≥ 90% thì hoàn thành; tiến độ không giảm', async () => {
    const { api } = await start()
    expect((await api.lessonProgress(1, 95)).completed_at).not.toBeNull()
    expect((await api.lessonProgress(1, 10)).watched_pct).toBe(95)
  })

  it('điểm danh: mỗi ngày 1 lần; đủ 3 ngày liền thì thưởng mốc', async () => {
    const { api } = await start()
    const d1 = await api.checkin()
    expect(d1.earned.map(e => e.reason)).toEqual(['diem_danh'])
    expect((await api.checkin()).earned).toEqual([])
    localStorage.setItem('haco_mock_days', '1')
    await api.checkin()
    localStorage.setItem('haco_mock_days', '2')
    const d3 = await api.checkin()
    expect(d3.checkin.streak).toBe(3)
    expect(d3.earned.find(e => e.reason === 'moc_chuoi')?.milestone).toBe(3)
    expect(d3.points).toBe(5 * 3 + 10)
  })

  it('sổ tay: lưu, bỏ lưu; món không có thì báo lỗi', async () => {
    const { api } = await start()
    expect((await api.saveRecipe('thit-xa-xiu', true)).saved_recipes).toEqual(['thit-xa-xiu'])
    expect((await api.saveRecipe('thit-xa-xiu', false)).saved_recipes).toEqual([])
    await expect(api.saveRecipe('khong-co', true)).rejects.toMatchObject({ status: 404 })
  })

  it('mã giới thiệu chỉ có khi đã xác minh', async () => {
    const { api } = await start()
    expect((await api.me()).referral_code).toBeNull()
    await api.claimOrder('TEST1')
    expect((await api.me()).referral_code).not.toBeNull()
  })
})
