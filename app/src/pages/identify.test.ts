import { describe, expect, it } from 'vitest'
import { identifyCopy } from './Identify'

describe('lời mời đăng ký theo việc khách đang làm', () => {
  it('đặt hàng, khoá học, còn lại', () => {
    expect(identifyCopy('/gio-hang').cta).toBe('Tiếp tục đặt hàng')
    expect(identifyCopy('/hoc').cta).toBe('Mở bài học đầu tiên')
    expect(identifyCopy('/hat-com').title).toBe('Đăng ký thành viên Bếp Cô Hạ')
    expect(identifyCopy('/').cta).toBe('Đăng ký')
  })
})
