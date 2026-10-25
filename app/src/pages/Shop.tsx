import { useEffect, useState } from 'react'
import { Button, Icon, Page, useSnackbar } from 'zmp-ui'
import type { CatalogItem } from '../api/types'
import { useCart } from '../cart'
import { productGroups } from '../components/Rails'
import { LINKS, asset } from '../content'
import { money } from '../lib/format'
import { platform } from '../platform'
import { useMini } from '../state'

// Tab Đặt hàng (v5, học McDonald's / Luckin / DoorDash): chip danh mục, lưới ảnh 2 cột, nút + và bộ tăng/giảm ngay trên thẻ,
// thanh giỏ hàng nổi (CartBar). Đơn vào POScake, giá do server quyết.
// Vẫn giữ đường đặt qua tin nhắn: 60–70% khách vẫn chat để mua (B4 K14).

/** Danh mục suy từ trang sản phẩm (catalog server không có cột danh mục). */
const CATS = [
  { key: 'all', label: 'Tất cả', match: () => true },
  { key: 'xoi', label: '🍚 Xôi cốm', match: (p: string) => p.includes('xoi-com') },
  { key: 'sot', label: '🥫 Sốt nấu', match: (p: string) => p.startsWith('/sot-') },
  { key: 'dung-cu', label: '🧺 Dụng cụ', match: (p: string) => p.includes('khan') },
] as const

export function ShopPage() {
  const { track } = useMini()
  const cart = useCart()
  const [cat, setCat] = useState<(typeof CATS)[number]['key']>('all')
  const groups = productGroups(cart.catalog?.items ?? [])
  const match = CATS.find(c => c.key === cat)!.match
  const shown = groups.filter(v => match(v[0].product))
  useEffect(() => track('shop_view', {}), [track])

  const chat = () => {
    track('chat_click', { from: 'shop' })
    if (LINKS.oaId) void platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, 'Cô ơi, cháu muốn đặt hàng')
    else if (LINKS.messenger) void platform.openChat({ kind: 'url', url: LINKS.messenger })
  }

  return (
    <Page className="page page-with-cart page-shop">
      <div className="shop-head">
        <h2>Đặt hàng</h2>
        <div className="shop-promise">
          <span>📞 Cô gọi xác nhận và báo phí ship trước khi gửi</span>
          <span>💵 COD hoặc chuyển khoản</span>
        </div>
      </div>
      <div className="chips shop-cats">
        {CATS.filter(c => c.key === 'all' || groups.some(v => c.match(v[0].product))).map(c => (
          <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
            {c.label}
          </button>
        ))}
      </div>
      {cart.catalogError && (
        <div className="card">
          <p>Chưa tải được danh sách hàng.</p>
          <Button size="small" onClick={cart.reloadCatalog}>
            Thử lại
          </Button>
        </div>
      )}
      {!cart.catalog && !cart.catalogError && (
        <div className="shop-grid">
          {[0, 1, 2, 3].map(k => (
            <div key={k} className="shop-card skeleton-card">
              <div className="skeleton sk-img" />
              <div className="skeleton sk-line" />
              <div className="skeleton sk-line short" />
            </div>
          ))}
        </div>
      )}
      <div className="shop-grid">
        {shown.map(variants => (
          <ProductCard key={variants[0].product} variants={variants} />
        ))}
      </div>
      <p className="muted small center">Giá chưa gồm phí ship. Cô Hạ gọi xác nhận và báo phí ship.</p>
      {(LINKS.oaId || LINKS.messenger) && (
        <Button variant="secondary" fullWidth onClick={chat}>
          Đặt nhanh qua tin nhắn với Cô Hạ
        </Button>
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
  const qty = cart.lines.find(l => l.sku === item.sku)?.qty ?? 0

  const add = () => {
    cart.add(item.sku)
    track('cart_add', { sku: item.sku, from: 'shop' })
    if (!qty) openSnackbar({ text: `Đã thêm ${item.name} ${item.variant}`, type: 'success', duration: 1200 })
  }

  return (
    <div className="shop-card">
      <div className="shop-img">
        <img src={asset(item.image)} alt="" loading="lazy" />
      </div>
      <div className="shop-name">{item.name}</div>
      {variants.length > 1 ? (
        <div className="variant-row">
          {variants.map(v => (
            <button key={v.sku} className={`variant ${v.sku === sku ? 'on' : ''}`} onClick={() => setSku(v.sku)}>
              {v.variant}
            </button>
          ))}
        </div>
      ) : (
        <div className="muted small">{item.variant}</div>
      )}
      <div className="shop-foot">
        <span className="shop-price">{money(item.price)}</span>
        {qty ? (
          <div className="mini-stepper">
            <button aria-label="Bớt 1" onClick={() => cart.set(item.sku, qty - 1)}>
              −
            </button>
            <span>{qty}</span>
            <button aria-label="Thêm 1" onClick={add}>
              +
            </button>
          </div>
        ) : (
          <button className="add-btn" aria-label={`Thêm ${item.name} ${item.variant}`} onClick={add}>
            <Icon icon="zi-plus" size={18} />
          </button>
        )}
      </div>
    </div>
  )
}
