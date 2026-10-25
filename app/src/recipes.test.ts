import { describe, expect, it } from 'vitest'
import { CATEGORIES, PHASES, RECIPES, ingredientText, recipeOfTheDay, searchRecipes } from './recipes'

describe('thư viện công thức', () => {
  it('slug là duy nhất và không dấu (Sổ tay, danh sách đi chợ lưu theo slug)', () => {
    const slugs = RECIPES.map(r => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/)
  })
  it('mỗi món đủ dữ liệu cho người mới: nhóm hợp lệ, có nguyên liệu, có bước, thời gian hợp lý', () => {
    const cats = new Set(CATEGORIES.map(c => c.key))
    const phases = new Set(PHASES.map(p => p.key))
    for (const r of RECIPES) {
      expect(cats.has(r.category), r.slug).toBe(true)
      expect(r.ingredients.length, r.slug).toBeGreaterThan(0)
      expect(r.steps.length, r.slug).toBeGreaterThan(1)
      expect(r.servings, r.slug).toBeGreaterThan(0)
      expect(r.minutes, r.slug).toBeGreaterThan(0)
      for (const s of r.steps) {
        expect(phases.has(s.phase), `${r.slug}: ${s.title}`).toBe(true)
        if (s.minutes !== undefined) expect(s.minutes, `${r.slug}: ${s.title}`).toBeGreaterThan(0)
      }
      // Bước đi theo thứ tự Sơ chế → Nấu → Trình bày (trang công thức nhóm theo phần và đánh số liên tục)
      const order = r.steps.map(s => PHASES.findIndex(p => p.key === s.phase))
      expect(order, r.slug).toEqual([...order].sort((a, b) => a - b))
    }
  })
  it('món do app biên soạn đều đánh dấu chờ Cô Hạ duyệt; món gắn sản phẩm có mã hàng', () => {
    expect(RECIPES.length).toBeGreaterThanOrEqual(20)
    for (const r of RECIPES) if (r.product) expect(r.product.sku, r.slug).toMatch(/^[a-z0-9-]+$/)
    expect(RECIPES.filter(r => r.review === 'cho_co_ha_duyet').length).toBeGreaterThan(15)
  })
  it('món của hôm nay đổi theo ngày và lặp lại theo vòng', () => {
    const a = recipeOfTheDay('2026-10-24')
    const b = recipeOfTheDay('2026-10-25')
    expect(a.slug).not.toBe(b.slug)
    const later = new Date(Date.parse('2026-10-24T00:00:00Z') + RECIPES.length * 86400000).toISOString().slice(0, 10)
    expect(recipeOfTheDay(later).slug).toBe(a.slug)
  })
  it('tìm không dấu theo tên món và nguyên liệu', () => {
    expect(searchRecipes('xa xiu').map(r => r.slug)).toContain('thit-xa-xiu')
    expect(searchRecipes('dau phu').map(r => r.slug)).toEqual(expect.arrayContaining(['dau-phu-sot-ca-chua', 'dau-phu-chien-sa-ot']))
    expect(searchRecipes('trung').map(r => r.slug)).toContain('thit-kho-trung')
    expect(searchRecipes('').length).toBe(RECIPES.length)
  })
  it('dòng nguyên liệu ghép định lượng + tên', () => {
    expect(ingredientText({ qty: '2 quả', name: 'trứng' })).toBe('2 quả trứng')
    expect(ingredientText({ name: 'Hành lá' })).toBe('Hành lá')
  })
})
