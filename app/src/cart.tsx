import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, CatalogItem, CatalogRes } from './api/types'
import { addToCart, cartCount, parseCart, setQty } from './lib/cart'
import { readLocal, writeLocal } from './lib/storage'
import { useMini } from './state'

const KEY = 'haco_cart'

interface CartState {
  lines: CartLine[]
  count: number
  catalog: CatalogRes | null
  catalogError: boolean
  item(sku: string): CatalogItem | undefined
  add(sku: string, qty?: number): void
  set(sku: string, qty: number): void
  clear(): void
  reloadCatalog(): void
}

const Ctx = createContext<CartState | null>(null)

export function useCart(): CartState {
  const v = useContext(Ctx)
  if (!v) throw new Error('useCart ngoài CartProvider')
  return v
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { api } = useMini()
  const [lines, setLines] = useState<CartLine[]>(() => parseCart(readLocal(KEY)))
  const [catalog, setCatalog] = useState<CatalogRes | null>(null)
  const [catalogError, setCatalogError] = useState(false)
  const [reload, setReload] = useState(0)

  useEffect(() => {
    let alive = true
    setCatalogError(false)
    api.catalog().then(
      c => {
        if (!alive) return
        setCatalog(c)
        // Món đã ngừng bán thì tự bỏ khỏi giỏ.
        const known = new Set(c.items.map(i => i.sku))
        setLines(l => l.filter(x => known.has(x.sku)))
      },
      () => alive && setCatalogError(true),
    )
    return () => {
      alive = false
    }
  }, [api, reload])

  useEffect(() => writeLocal(KEY, lines.length ? JSON.stringify(lines) : null), [lines])

  const item = useCallback((sku: string) => catalog?.items.find(i => i.sku === sku), [catalog])
  const value = useMemo<CartState>(
    () => ({
      lines,
      count: cartCount(lines),
      catalog,
      catalogError,
      item,
      add: (sku, qty = 1) => setLines(l => addToCart(l, sku, qty)),
      set: (sku, qty) => setLines(l => setQty(l, sku, qty)),
      clear: () => setLines([]),
      reloadCatalog: () => setReload(n => n + 1),
    }),
    [lines, catalog, catalogError, item],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
