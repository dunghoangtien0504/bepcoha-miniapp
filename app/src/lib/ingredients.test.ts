import { describe, expect, it } from 'vitest'
import { findRecipe } from '../recipes'
import { canon, formatAmount, hacoProducts, mergeIngredients, parseQty } from './ingredients'

describe('đọc định lượng', () => {
  it('số, phân số, thập phân, khoảng, kg/lít', () => {
    expect(parseQty('800g')).toEqual({ amount: 800, unit: 'g' })
    expect(parseQty('1kg')).toEqual({ amount: 1000, unit: 'g' })
    expect(parseQty('1 lít')).toEqual({ amount: 1000, unit: 'ml' })
    expect(parseQty('1/2 thìa cà phê')).toEqual({ amount: 0.5, unit: 'thìa cà phê' })
    expect(parseQty('1,5 thìa canh')).toEqual({ amount: 1.5, unit: 'thìa canh' })
    expect(parseQty('50–80ml')).toEqual({ amount: 80, unit: 'ml' })
    expect(parseQty('6 quả')).toEqual({ amount: 6, unit: 'quả' })
    expect(parseQty(undefined)).toEqual({ amount: null, unit: '' })
  })
  it('tên chuẩn gộp tên gần nhau', () => {
    expect(canon('thịt ba chỉ hoặc nạc vai').label).toBe('thịt ba chỉ')
    expect(canon('thịt nạc vai băm').label).toBe('thịt heo xay')
    expect(canon('tôm đất hoặc tôm thẻ').label).toBe('tôm')
    expect(canon('cải ngọt hoặc cải cúc').group).toBe('rau_cu')
    expect(canon('nước mắm').group).toBe('gia_vi_kho')
    expect(canon('Sốt Xá Xíu Bếp Cô Hạ').group).toBe('haco')
  })
  it('định dạng lượng dễ đọc', () => {
    expect(formatAmount({ amount: 1200, unit: 'g' })).toBe('1,2kg')
    expect(formatAmount({ amount: 1500, unit: 'ml' })).toBe('1,5 lít')
    expect(formatAmount({ amount: 2.5, unit: 'củ' })).toBe('2,5 củ')
    expect(formatAmount({ amount: null, unit: '' })).toBe('một ít')
  })
})

describe('gộp nguyên liệu nhiều món', () => {
  const kho = findRecipe('thit-kho-trung')!
  const rang = findRecipe('thit-rang-chay-canh')!
  it('cộng dồn thứ trùng, nhân theo số người, ghi món dùng', () => {
    const lines = mergeIngredients([kho, rang], kho.servings)
    const baChi = lines.find(l => l.label === 'thịt ba chỉ' && l.unit === 'g')!
    expect(baChi.amount).toBe(Math.ceil((800 + (400 * kho.servings) / rang.servings) / 50) * 50)
    expect(baChi.dishes).toEqual([kho.title, rang.title])
    const hanh = lines.find(l => l.label === 'hành tím' && l.unit === 'củ')!
    expect(hanh.amount).toBeGreaterThanOrEqual(6)
    const double = mergeIngredients([kho], kho.servings * 2).find(l => l.label === 'thịt ba chỉ')!
    expect(double.amount).toBe(1600)
  })
  it('tách "Hành lá, rau mùi, mè rang"; không đưa sốt Bếp vào danh sách chợ', () => {
    const suon = findRecipe('suon-xao-chua-ngot')!
    const labels = mergeIngredients([suon], 4).map(l => l.label)
    expect(labels).toContain('hành lá')
    const xx = findRecipe('thit-xa-xiu')!
    expect(mergeIngredients([xx], 4).some(l => /bếp cô hạ/i.test(l.label))).toBe(false)
    expect(hacoProducts([xx])).toEqual(['Sốt Xá Xíu Bếp Cô Hạ'])
  })
})
