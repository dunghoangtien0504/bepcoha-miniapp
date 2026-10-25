import { describe, expect, it } from 'vitest'
import type { CatalogItem } from '../api/types'
import { shopListText } from '../pages/WeeklyPlan'
import { RECIPES, findRecipe } from '../recipes'
import { SHOP, WEEK, weekTotals } from '../weekly'
import { missingFields, upsellFor } from './checkout'

const item = (sku: string, product: string, price: number): CatalogItem => ({ sku, product, name: sku, variant: '', price, image: '' })
const CAT = [item('sxc-set', '/set-xoi-com', 148000), item('kdx', '/khan-do-xoi', 49000), item('sxx-500g', '/sot-xa-xiu', 100000),
  item('sxx-1kg', '/sot-xa-xiu', 190000), item('stn-500g', '/sot-tron-nom', 65000)]

describe('giỏ hàng: báo thiếu và gợi ý mua kèm', () => {
  it('liệt kê đúng ô còn thiếu', () => {
    expect(missingFields({ name: '', address: '', gift: false, toPhone: '' })).toEqual(['tên người nhận', 'địa chỉ đủ số nhà, phường/xã, tỉnh/thành'])
    expect(missingFields({ name: 'Lan', address: '12 Ngõ 5, Cầu Giấy, Hà Nội', gift: true, toPhone: '09' })).toEqual(['số điện thoại người nhận'])
    expect(missingFields({ name: 'Lan', address: '12 Ngõ 5, Cầu Giấy, Hà Nội', gift: false, toPhone: '' })).toEqual([])
  })
  it('gợi ý theo bản đồ, không gợi món đã có, chọn biến thể rẻ nhất', () => {
    expect(upsellFor([{ sku: 'sxc-set', qty: 1 }], CAT).map(u => u.item.sku)).toEqual(['kdx'])
    expect(upsellFor([{ sku: 'sxc-set', qty: 1 }, { sku: 'kdx', qty: 1 }], CAT)).toEqual([])
    expect(upsellFor([{ sku: 'stn-500g', qty: 1 }], CAT).map(u => u.item.sku)).toEqual(['sxx-500g'])
    expect(upsellFor([{ sku: 'sxc-set', qty: 1 }, { sku: 'sxx-1kg', qty: 1 }], CAT).map(u => u.item.sku)).toEqual(['kdx', 'stn-500g'])
    expect(upsellFor([{ sku: 'khong-co', qty: 1 }], CAT)).toEqual([])
  })
})

describe('đi chợ cả tuần', () => {
  it('7 ngày, mọi món có trong thư viện công thức', () => {
    expect(WEEK).toHaveLength(7)
    for (const d of WEEK) for (const s of d.dishes) expect(findRecipe(s), s).toBeTruthy()
  })
  it('mã hàng không trùng, sốt Bếp Cô Hạ có sku, giá là số nguyên dương hoặc null', () => {
    expect(new Set(SHOP.map(i => i.id)).size).toBe(SHOP.length)
    for (const i of SHOP) {
      if (i.group === 'haco') expect(i.sku, i.id).toBeTruthy()
      if (i.price !== null) expect(Number.isInteger(i.price) && i.price > 0, i.id).toBe(true)
    }
  })
  it('tổng tiền tách đồ tươi, gia vị khô, sốt', () => {
    const t = weekTotals()
    const all = SHOP.reduce((n, i) => n + (i.price ?? 0), 0)
    expect(t.fresh + t.pantry + t.haco).toBe(all)
    expect(t.unpriced).toBe(SHOP.filter(i => i.price === null).length)
    expect(t.perMeal).toBe(Math.round(t.fresh / 7 / 1000) * 1000)
  })
  it('danh sách chép ra có đủ món và nguồn giá', () => {
    const txt = shopListText()
    for (const i of SHOP) expect(txt).toContain(i.name)
    expect(txt).toContain('Co.op Online')
  })
})

describe('công thức chi tiết', () => {
  it('mọi bước của món gia đình có giải thích; món gia đình có dấu hiệu món đạt', () => {
    for (const r of RECIPES.filter(x => x.review)) {
      expect(r.doneSign, r.slug).toBeTruthy()
      for (const s of r.steps) expect(s.detail, `${r.slug}: ${s.title}`).toBeTruthy()
    }
  })
  it('ảnh không phải của HACO đều ghi tác giả và giấy phép', () => {
    for (const r of RECIPES.filter(x => x.image?.startsWith('/images/cong-thuc/'))) {
      if (r.imageCredit) expect(r.imageCredit.author && r.imageCredit.license, r.slug).toBeTruthy()
    }
    expect(RECIPES.filter(r => r.imageCredit).length).toBe(7)
  })
})
