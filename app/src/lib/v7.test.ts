import { describe, expect, it } from 'vitest'
import { COMMUNITY } from '../content'
import { PRODUCTS, findProduct, orderMessage } from '../products'
import { RECIPES, findRecipe } from '../recipes'
import { TIPS, TIP_CATEGORIES, tipOfTheDay } from '../tips'

describe('sản phẩm bán chạy lồng vào công thức', () => {
  it('đủ 15 nhóm sản phẩm Cô Hạ gửi, khoá không trùng', () => {
    expect(PRODUCTS).toHaveLength(15)
    expect(new Set(PRODUCTS.map(p => p.key)).size).toBe(15)
  })
  it('công thức trỏ tới sản phẩm có thật, sản phẩm trỏ tới công thức có thật', () => {
    for (const p of PRODUCTS) for (const s of p.recipes ?? []) expect(findRecipe(s), `${p.key} → ${s}`).toBeTruthy()
    for (const r of RECIPES) for (const u of r.uses ?? []) expect(findProduct(u.product), `${r.slug} → ${u.product}`).toBeTruthy()
  })
  it('tin nhắn đặt hàng có tên và giá', () => {
    const p = findProduct('com-kho')
    expect(orderMessage(p)).toContain('Cốm Khô')
    expect(orderMessage(p)).toContain('80.000đ')
  })
})

describe('thư viện không có món Bếp đang bán hoặc đang dạy', () => {
  it('không có xôi, chè, bánh khúc, gà ủ muối, cá kho, dưa cà, rau má, bánh mì', () => {
    const banned = /xôi|chè|bánh khúc|gà ủ|cá kho|dưa cà|rau má|bánh mì/i
    for (const r of RECIPES) expect(banned.test(r.title), r.title).toBe(false)
    expect(RECIPES.some(r => r.category === 'che-banh')).toBe(false)
  })
  it('món sản phẩm HACO không còn chỉ 2–5 bước sơ sài', () => {
    for (const s of ['thit-xa-xiu', 'nom-tron-5-phut']) expect(findRecipe(s)!.steps.length, s).toBeGreaterThanOrEqual(6)
  })
})

describe('mẹo vặt và cộng đồng', () => {
  it('mẹo trỏ đúng công thức/sản phẩm, nhóm có thật, id không trùng', () => {
    expect(TIPS.length).toBeGreaterThanOrEqual(20)
    expect(new Set(TIPS.map(t => t.id)).size).toBe(TIPS.length)
    const cats = new Set(TIP_CATEGORIES.map(c => c.key))
    for (const t of TIPS) {
      expect(cats.has(t.category), t.id).toBe(true)
      if (t.recipe) expect(findRecipe(t.recipe), t.id).toBeTruthy()
      if (t.product) expect(findProduct(t.product), t.id).toBeTruthy()
      expect(t.source === 'nhan' || t.review === 'cho_co_ha_duyet', `${t.id}: mẹo tự viết phải gắn cờ duyệt`).toBe(true)
    }
    expect(tipOfTheDay('2026-10-25')).toBeTruthy()
  })
  it('thử thách tuần trỏ tới công thức có thật; ảnh cộng đồng có chú thích', () => {
    expect(findRecipe(COMMUNITY.challenge.recipe)).toBeTruthy()
    for (const g of COMMUNITY.gallery) expect(g.caption && g.image.startsWith('/images/cong-dong/')).toBeTruthy()
  })
})
