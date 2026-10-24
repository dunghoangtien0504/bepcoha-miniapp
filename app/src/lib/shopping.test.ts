import { describe, expect, it } from 'vitest'
import { findRecipe } from '../recipes'
import { addRecipe, clearChecked, groupByRecipe, parseShopping, remainingCount, removeRecipe, toggleItem } from './shopping'

const kho = findRecipe('thit-kho-trung')!
const canh = findRecipe('canh-bi-dao-tom')!

describe('danh sách đi chợ', () => {
  it('thêm nguyên liệu kèm định lượng; thêm lại cùng món không bị trùng', () => {
    let l = addRecipe([], kho)
    expect(l[0].text).toBe('800g thịt ba chỉ hoặc nạc vai')
    expect(l).toHaveLength(kho.ingredients.length)
    l = toggleItem(l, kho.slug, l[0].text)
    l = addRecipe(l, kho)
    expect(l).toHaveLength(kho.ingredients.length)
    expect(l[0].checked).toBe(true)
  })
  it('đếm còn phải mua, xoá món đã mua, bỏ một món, nhóm theo món', () => {
    let l = addRecipe(addRecipe([], kho), canh)
    l = toggleItem(l, canh.slug, l.find(i => i.slug === canh.slug)!.text)
    expect(remainingCount(l)).toBe(l.length - 1)
    expect(clearChecked(l)).toHaveLength(l.length - 1)
    expect(groupByRecipe(l).map(g => g.title)).toEqual([kho.title, canh.title])
    expect(removeRecipe(l, kho.slug).every(i => i.slug === canh.slug)).toBe(true)
  })
  it('đọc dữ liệu hỏng không làm sập app', () => {
    expect(parseShopping('{')).toEqual([])
    expect(parseShopping('[{"slug":1}]')).toEqual([])
    expect(parseShopping('[{"slug":"a","text":"b","checked":1}]')).toEqual([{ slug: 'a', text: 'b', checked: true }])
  })
})
