// Danh sách đi chợ: lưu trên máy (chỉ tên nguyên liệu và món, không có dữ liệu cá nhân).
import { findRecipe, ingredientText, type Recipe } from '../recipes'

export interface ShoppingItem {
  slug: string
  text: string
  checked: boolean
}

export const MAX_ITEMS = 120

/** Thêm toàn bộ nguyên liệu của món; dòng đã có (cùng món, cùng chữ) thì giữ nguyên, kể cả trạng thái đã mua. */
export function addRecipe(list: ShoppingItem[], recipe: Recipe): ShoppingItem[] {
  const have = new Set(list.map(i => i.slug + '|' + i.text))
  const add = recipe.ingredients
    .map(ingredientText)
    .filter(t => !have.has(recipe.slug + '|' + t))
    .map(text => ({ slug: recipe.slug, text, checked: false }))
  return [...list, ...add].slice(0, MAX_ITEMS)
}

export const hasRecipe = (list: ShoppingItem[], slug: string) => list.some(i => i.slug === slug)
export const removeRecipe = (list: ShoppingItem[], slug: string) => list.filter(i => i.slug !== slug)
export const clearChecked = (list: ShoppingItem[]) => list.filter(i => !i.checked)
export const toggleItem = (list: ShoppingItem[], slug: string, text: string) =>
  list.map(i => (i.slug === slug && i.text === text ? { ...i, checked: !i.checked } : i))
export const remainingCount = (list: ShoppingItem[]) => list.filter(i => !i.checked).length

/** Nhóm theo món, giữ thứ tự thêm vào. */
export function groupByRecipe(list: ShoppingItem[]): { slug: string; title: string; items: ShoppingItem[] }[] {
  const out = new Map<string, ShoppingItem[]>()
  for (const i of list) out.set(i.slug, [...(out.get(i.slug) ?? []), i])
  return [...out].map(([slug, items]) => ({ slug, title: findRecipe(slug)?.title ?? slug, items }))
}

/** Đọc danh sách đã lưu; dữ liệu hỏng thì bỏ qua. */
export function parseShopping(raw: string | null): ShoppingItem[] {
  try {
    const v = JSON.parse(raw || '[]')
    if (!Array.isArray(v)) return []
    return v
      .filter(i => typeof i?.slug === 'string' && typeof i?.text === 'string')
      .map(i => ({ slug: i.slug, text: i.text.slice(0, 120), checked: !!i.checked }))
      .slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}
