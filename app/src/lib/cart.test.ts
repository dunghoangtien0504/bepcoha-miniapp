import { describe, expect, it } from 'vitest'
import { MAX_LINES, MAX_QTY_LINE, addToCart, cartCount, parseCart, setQty } from './cart'

describe('giỏ hàng', () => {
  it('thêm món mới, thêm lại thì cộng số lượng', () => {
    let c = addToCart([], 'kdx')
    c = addToCart(c, 'sxc-set', 2)
    c = addToCart(c, 'kdx')
    expect(c).toEqual([{ sku: 'kdx', qty: 2 }, { sku: 'sxc-set', qty: 2 }])
    expect(cartCount(c)).toBe(4)
  })
  it('không vượt số lượng tối đa mỗi món và số dòng tối đa', () => {
    expect(addToCart([], 'kdx', 99)).toEqual([{ sku: 'kdx', qty: MAX_QTY_LINE }])
    let c: { sku: string; qty: number }[] = []
    for (let i = 0; i < MAX_LINES + 3; i++) c = addToCart(c, 'm' + i)
    expect(c).toHaveLength(MAX_LINES)
  })
  it('đặt số lượng 0 thì bỏ món', () => {
    expect(setQty([{ sku: 'kdx', qty: 2 }], 'kdx', 0)).toEqual([])
    expect(setQty([{ sku: 'kdx', qty: 2 }], 'kdx', 3)).toEqual([{ sku: 'kdx', qty: 3 }])
  })
  it('đọc giỏ đã lưu: bỏ dữ liệu hỏng và món không còn bán, gộp dòng trùng', () => {
    expect(parseCart('không phải json')).toEqual([])
    expect(parseCart('{"a":1}')).toEqual([])
    const raw = JSON.stringify([{ sku: 'kdx', qty: 1 }, { sku: 'cu', qty: 1 }, { sku: 'kdx', qty: 2 }, { sku: 'x', qty: -1 }, { sku: 'y', qty: 1.5 }])
    expect(parseCart(raw, s => s !== 'cu')).toEqual([{ sku: 'kdx', qty: 3 }])
  })
})
