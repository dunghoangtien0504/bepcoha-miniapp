import { describe, expect, it } from 'vitest'
import { RECIPES, recipeOfTheDay, searchRecipes } from './recipes'

describe('thư viện công thức', () => {
  it('slug là duy nhất và không dấu (Sổ tay lưu theo slug)', () => {
    const slugs = RECIPES.map(r => r.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/)
  })
  it('món của hôm nay đổi theo ngày và lặp lại theo vòng', () => {
    const a = recipeOfTheDay('2026-10-24')
    const b = recipeOfTheDay('2026-10-25')
    expect(a.slug).not.toBe(b.slug)
    const later = new Date(Date.parse('2026-10-24T00:00:00Z') + RECIPES.length * 86400000).toISOString().slice(0, 10)
    expect(recipeOfTheDay(later).slug).toBe(a.slug)
  })
  it('tìm không dấu vẫn ra món có dấu', () => {
    expect(searchRecipes('xa xiu').map(r => r.slug)).toContain('thit-xa-xiu')
    expect(searchRecipes('dau xanh').map(r => r.slug)).toContain('xoi-com-sen-dua')
    expect(searchRecipes('').length).toBe(RECIPES.length)
  })
})
