import { describe, expect, it } from 'vitest'
import type { CatalogItem } from '../api/types'
import { RECIPES, findRecipe } from '../recipes'
import { MENUS, PRICES, menuRecipes, perMeal, shopList, shopListText } from '../weekly'
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
  it('3 thực đơn, mỗi thực đơn 7 ngày, món nào cũng có trong thư viện', () => {
    expect(MENUS.length).toBeGreaterThanOrEqual(3)
    for (const m of MENUS) {
      expect(m.days).toHaveLength(7)
      for (const d of m.days) for (const s of d.dishes) expect(findRecipe(s), `${m.key}: ${s}`).toBeTruthy()
    }
  })
  it('danh sách có tiền ước tính, tiền/bữa = tổng/7, gia vị khô không tính tiền', () => {
    const l = shopList(menuRecipes(MENUS[0]), 4, 7)
    expect(l.fresh).toBeGreaterThan(300000)
    expect(l.fresh).toBe(l.lines.filter(x => x.group !== 'gia_vi_kho').reduce((n, x) => n + (x.cost ?? 0), 0))
    expect(perMeal(l)).toBe(Math.round(l.fresh / 7 / 1000) * 1000)
    expect(l.lines.filter(x => x.group === 'gia_vi_kho').every(x => x.cost === null || x.cost > 0)).toBe(true)
  })
  it('nhiều người thì nhiều tiền hơn; tên trong bảng giá đều là tên chuẩn có thật', () => {
    const r = menuRecipes(MENUS[0])
    expect(shopList(r, 6, 7).fresh).toBeGreaterThan(shopList(r, 2, 7).fresh)
    const labels = new Set(shopList(MENUS.flatMap(menuRecipes), 4).lines.map(x => x.label))
    for (const k of Object.keys(PRICES)) expect(labels.has(k), `bảng giá có "${k}" nhưng không món nào dùng`).toBe(true)
  })
  it('chép danh sách có đủ dòng và nguồn giá', () => {
    const l = shopList(menuRecipes(MENUS[1]), 4, 7)
    const txt = shopListText('Thực đơn Tiết kiệm', l, 4)
    for (const x of l.lines) expect(txt).toContain(x.label)
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
    expect(RECIPES.filter(r => r.imageCredit).length).toBeGreaterThanOrEqual(6)
  })
})
