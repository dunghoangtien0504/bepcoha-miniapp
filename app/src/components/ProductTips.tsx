import { useNavigate } from 'zmp-ui'
import { useCart } from '../cart'
import { asset } from '../content'
import { findProduct, orderMessage, type Product, type ProductKey } from '../products'
import { useMini } from '../state'
import { canChat, chatWithBep } from './OABar'
import { RecipeImage } from './RecipeImage'

/** Nút mua 1 sản phẩm: đang bán trong app → bỏ giỏ; chưa có → nhắn Bếp đặt qua chat Zalo (không mở trang ngoài). */
export function BuyButton({ product, from }: { product: Product; from: string }) {
  const cart = useCart()
  const { track } = useMini()
  const navigate = useNavigate()
  const item = product.sku ? cart.item(product.sku) : undefined
  if (item) {
    return (
      <button
        className="pt-btn"
        onClick={() => {
          cart.add(item.sku)
          track('cart_add', { sku: item.sku, from })
          navigate('/gio-hang')
        }}
      >
        Thêm vào giỏ
      </button>
    )
  }
  if (!canChat()) return null
  return (
    <button
      className="pt-btn pt-chat"
      onClick={() => {
        track('chat_click', { from, product: product.key })
        void chatWithBep(orderMessage(product))
      }}
    >
      Nhắn Bếp đặt
    </button>
  )
}

/** Ảnh sản phẩm; sản phẩm chưa có ảnh thì hiện khối màu có chữ cái đầu. */
export function ProductImage({ product, className }: { product: Product; className: string }) {
  if (product.image) return <img className={className} src={asset(product.image)} alt="" loading="lazy" />
  return (
    <span className={`${className} pt-ph`} aria-hidden="true">
      🥫
    </span>
  )
}

// "Nấu nhanh hơn với sản phẩm của Bếp" trong trang công thức: lồng sản phẩm bán chạy vào đúng chỗ khách cần (yêu cầu 25/10).
export function ProductTips({ uses, from }: { uses: { product: ProductKey; tip: string }[]; from: string }) {
  if (!uses.length) return null
  return (
    <section className="ptips">
      <h3>Nấu nhanh hơn với sản phẩm của Bếp</h3>
      {uses.map(u => {
        const p = findProduct(u.product)
        return (
          <div key={u.product} className="ptip">
            <ProductImage product={p} className="ptip-img" />
            <div className="ptip-body">
              <b>{p.name}</b>
              <span className="small">{u.tip}</span>
              <div className="ptip-foot">
                <span className="ptip-price">{p.price}</span>
                <BuyButton product={p} from={from} />
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}

/** Dải món dùng 1 sản phẩm (dùng ở tab Đặt hàng). */
export function RecipesOf({ slugs, find }: { slugs: string[]; find: (s: string) => Parameters<typeof RecipeImage>[0]['recipe'] | undefined }) {
  const navigate = useNavigate()
  return (
    <span className="muted small">
      Làm món:{' '}
      {slugs.map((s, k) => {
        const r = find(s)
        if (!r) return null
        return (
          <button key={s} className="text-link" onClick={() => navigate(`/cong-thuc/${s}`)}>
            {r.title}
            {k < slugs.length - 1 ? ', ' : ''}
          </button>
        )
      })}
    </span>
  )
}
