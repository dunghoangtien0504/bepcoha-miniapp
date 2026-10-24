import { useState } from 'react'
import { Button, Page, useNavigate, useSnackbar } from 'zmp-ui'
import type { CatalogItem } from '../api/types'
import { useCart } from '../cart'
import { LINKS, asset } from '../content'
import { money } from '../lib/format'
import { platform } from '../platform'
import { useMini } from '../state'

// Tab Đặt hàng (v2-B): chọn hàng → giỏ → đặt; đơn vào POScake. Giá lấy từ server.
// Vẫn giữ đường đặt qua tin nhắn: 60–70% khách vẫn chat để mua (B4 K14).
export function ShopPage() {
  const { track } = useMini()
  const cart = useCart()
  const navigate = useNavigate()

  const groups = new Map<string, CatalogItem[]>()
  for (const i of cart.catalog?.items ?? []) groups.set(i.product, [...(groups.get(i.product) ?? []), i])

  const chat = () => {
    track('chat_click', { from: 'shop' })
    if (LINKS.oaId) void platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, 'Cô ơi, cháu muốn đặt hàng')
    else if (LINKS.messenger) void platform.openChat({ kind: 'url', url: LINKS.messenger })
  }

  return (
    <Page className="page page-with-cart">
      <h2>Đặt hàng</h2>
      {cart.catalogError && (
        <div className="card">
          <p>Chưa tải được danh sách hàng.</p>
          <Button size="small" onClick={cart.reloadCatalog}>
            Thử lại
          </Button>
        </div>
      )}
      {!cart.catalog && !cart.catalogError && <p className="muted">Đang tải…</p>}
      <div className="shop-list">
        {[...groups.values()].map(variants => (
          <ProductCard key={variants[0].product} variants={variants} />
        ))}
      </div>
      <p className="muted small">Giá chưa gồm phí ship. Thanh toán khi nhận hàng (COD) hoặc chuyển khoản.</p>
      {(LINKS.oaId || LINKS.messenger) && (
        <Button variant="secondary" fullWidth onClick={chat}>
          Đặt nhanh qua tin nhắn với Cô Hạ
        </Button>
      )}
      {cart.count > 0 && (
        <div className="sticky-cta">
          <Button fullWidth onClick={() => navigate('/gio-hang')}>
            Xem giỏ hàng · {cart.count} món
          </Button>
        </div>
      )}
    </Page>
  )
}

function ProductCard({ variants }: { variants: CatalogItem[] }) {
  const { track } = useMini()
  const cart = useCart()
  const { openSnackbar } = useSnackbar()
  const [sku, setSku] = useState(variants[0].sku)
  const item = variants.find(v => v.sku === sku) ?? variants[0]
  const inCart = cart.lines.find(l => l.sku === item.sku)?.qty ?? 0

  const add = () => {
    cart.add(item.sku)
    track('cart_add', { sku: item.sku, from: 'shop' })
    openSnackbar({ text: `Đã thêm ${item.name} ${item.variant} vào giỏ`, type: 'success', duration: 1500 })
  }

  return (
    <div className="product-card">
      <img src={asset(item.image)} alt="" loading="lazy" />
      <div className="product-info">
        <b>{item.name}</b>
        {variants.length > 1 && (
          <div className="chips">
            {variants.map(v => (
              <button key={v.sku} className={`chip ${v.sku === sku ? 'on' : ''}`} onClick={() => setSku(v.sku)}>
                {v.variant}
              </button>
            ))}
          </div>
        )}
        <div className="product-price">{money(item.price)}</div>
        <Button size="small" onClick={add}>
          {inCart ? `Thêm nữa (đang có ${inCart})` : 'Thêm vào giỏ'}
        </Button>
      </div>
    </div>
  )
}
