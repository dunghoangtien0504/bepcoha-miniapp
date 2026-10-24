import { Button, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { groupByRecipe } from '../lib/shopping'
import { findRecipe } from '../recipes'
import { useCart } from '../cart'
import { useShopping } from '../shopping'
import { useMini } from '../state'

// Danh sách đi chợ: gom nguyên liệu các món định nấu, tick khi mua. Món dùng sản phẩm Bếp Cô Hạ có nút đặt luôn.
export function ShoppingPage() {
  const shopping = useShopping()
  const cart = useCart()
  const { track } = useMini()
  const navigate = useNavigate()
  const groups = groupByRecipe(shopping.items)
  const done = shopping.items.length - shopping.remaining

  return (
    <Page className="page">
      <BackBar fallback="/" />
      <h2>Danh sách đi chợ</h2>
      {!groups.length ? (
        <>
          <p className="muted">Chưa có gì. Mở một công thức và bấm “Thêm vào danh sách đi chợ” nhé.</p>
          <Button onClick={() => navigate('/cong-thuc')}>Xem công thức</Button>
        </>
      ) : (
        <>
          <p className="muted small">
            Còn {shopping.remaining} thứ cần mua{done ? ` · đã mua ${done}` : ''}.
          </p>
          {groups.map(g => {
            const product = findRecipe(g.slug)?.product
            const item = product ? cart.item(product.sku) : undefined
            return (
              <div key={g.slug} className="card shop-list-card">
                <div className="shop-list-head">
                  <button className="text-link" onClick={() => navigate(`/cong-thuc/${g.slug}`)}>
                    <b>{g.title}</b>
                  </button>
                  <button className="text-link muted small" onClick={() => shopping.remove(g.slug)}>
                    Bỏ món
                  </button>
                </div>
                <ul className="check-list">
                  {g.items.map(i => (
                    <li key={i.text}>
                      <label className={i.checked ? 'is-checked' : ''}>
                        <input type="checkbox" checked={i.checked} onChange={() => shopping.toggle(i.slug, i.text)} />
                        <span>{i.text}</span>
                      </label>
                    </li>
                  ))}
                </ul>
                {item && (
                  <Button
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      cart.add(item.sku)
                      track('cart_add', { sku: item.sku, from: 'shopping' })
                      navigate('/gio-hang')
                    }}
                  >
                    Đặt {item.name} {item.variant}
                  </Button>
                )}
              </div>
            )
          })}
          {done > 0 && (
            <Button variant="tertiary" fullWidth onClick={shopping.clearDone}>
              Xoá các thứ đã mua
            </Button>
          )}
        </>
      )}
    </Page>
  )
}
