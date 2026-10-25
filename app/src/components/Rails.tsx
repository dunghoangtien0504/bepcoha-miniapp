import { Icon, useNavigate, useSnackbar } from 'zmp-ui'
import type { CatalogItem } from '../api/types'
import { useCart } from '../cart'
import { asset } from '../content'
import { money } from '../lib/format'
import type { Recipe } from '../recipes'
import { useMini } from '../state'
import { RecipeImage } from './RecipeImage'

/** Mỗi sản phẩm lấy 1 thẻ: biến thể rẻ nhất làm giá "từ …", nút + thêm biến thể đó. */
export function productGroups(items: CatalogItem[]): CatalogItem[][] {
  const groups = new Map<string, CatalogItem[]>()
  for (const i of items) groups.set(i.product, [...(groups.get(i.product) ?? []), i])
  return [...groups.values()].map(v => [...v].sort((a, b) => a.price - b.price))
}

// Dải sản phẩm cuộn ngang có nút + thêm nhanh (học DoorDash / Uber Eats / Luckin: thêm vào giỏ ngay từ trang chủ).
export function ProductRail() {
  const cart = useCart()
  const { track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const groups = productGroups(cart.catalog?.items ?? [])
  if (!groups.length) return null

  return (
    <div className="rail">
      {groups.map(v => {
        const first = v[0]
        const qty = v.reduce((n, i) => n + (cart.lines.find(l => l.sku === i.sku)?.qty ?? 0), 0)
        return (
          <div key={first.product} className="rail-product">
            <button className="rail-img-btn" onClick={() => navigate('/dat-hang')} aria-label={first.name}>
              <img src={asset(first.image)} alt="" loading="lazy" />
              {qty > 0 && <span className="rail-qty">{qty}</span>}
            </button>
            <div className="rail-name">{first.name}</div>
            <div className="rail-row">
              <span className="rail-price">
                {v.length > 1 && <small>từ </small>}
                {money(first.price)}
              </span>
              <button
                className="add-btn"
                aria-label={`Thêm ${first.name} ${first.variant}`}
                onClick={() => {
                  cart.add(first.sku)
                  track('cart_add', { sku: first.sku, from: 'home_rail' })
                  openSnackbar({ type: 'success', text: `Đã thêm ${first.name} ${first.variant}`, duration: 1200 })
                }}
              >
                <Icon icon="zi-plus" size={18} />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Dải công thức cuộn ngang, ảnh lớn (học Starbucks "món yêu thích", NYT Cooking).
export function RecipeRail({ recipes }: { recipes: Recipe[] }) {
  const navigate = useNavigate()
  if (!recipes.length) return null
  return (
    <div className="rail">
      {recipes.map(r => (
        <button key={r.slug} className="rail-recipe" onClick={() => navigate(`/cong-thuc/${r.slug}`)}>
          <RecipeImage recipe={r} className="rail-recipe-img" />
          <span className="rail-name">{r.title}</span>
          <span className="muted small">
            <Icon icon="zi-clock-1" size={12} /> {r.minutes} phút
          </span>
        </button>
      ))}
    </div>
  )
}
