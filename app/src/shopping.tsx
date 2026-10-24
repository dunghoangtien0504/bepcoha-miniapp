import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { addRecipe, clearChecked, parseShopping, remainingCount, removeRecipe, toggleItem, type ShoppingItem } from './lib/shopping'
import { readLocal, writeLocal } from './lib/storage'
import type { Recipe } from './recipes'

const KEY = 'haco_di_cho'

interface ShoppingState {
  items: ShoppingItem[]
  remaining: number
  add(recipe: Recipe): void
  remove(slug: string): void
  toggle(slug: string, text: string): void
  clearDone(): void
}

const Ctx = createContext<ShoppingState | null>(null)

export function useShopping(): ShoppingState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useShopping ngoài ShoppingProvider')
  return v
}

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShoppingItem[]>(() => parseShopping(readLocal(KEY)))
  useEffect(() => writeLocal(KEY, items.length ? JSON.stringify(items) : null), [items])
  const value = useMemo<ShoppingState>(
    () => ({
      items,
      remaining: remainingCount(items),
      add: r => setItems(l => addRecipe(l, r)),
      remove: s => setItems(l => removeRecipe(l, s)),
      toggle: (s, t) => setItems(l => toggleItem(l, s, t)),
      clearDone: () => setItems(clearChecked),
    }),
    [items],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
