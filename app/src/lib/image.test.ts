import { describe, expect, it } from 'vitest'
import { dataUrlBytes, fitSize } from './image'

describe('nén ảnh trước khi đăng', () => {
  it('giữ tỉ lệ, cạnh dài tối đa 1280px, ảnh nhỏ giữ nguyên', () => {
    expect(fitSize(4000, 3000)).toEqual({ w: 1280, h: 960 })
    expect(fitSize(3000, 4000)).toEqual({ w: 960, h: 1280 })
    expect(fitSize(800, 600)).toEqual({ w: 800, h: 600 })
  })
  it('tính đúng số byte của data URL', () => {
    expect(dataUrlBytes('data:image/jpeg;base64,' + btoa('abcdef'))).toBe(6)
  })
})
