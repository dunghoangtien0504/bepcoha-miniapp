import { Button, Page } from 'zmp-ui'
import { LINKS, SHOP_ITEMS, asset, siteUrl } from '../content'
import { platform } from '../platform'
import { useMini } from '../state'

// Tab Đặt hàng ở v2-A: dẫn sang trang sản phẩm đang bán trên Haco-OS, hoặc đặt qua chat (60–70% khách vẫn chat để mua — B4 K14).
// Giỏ hàng ngay trong app (Checkout SDK → Pancake POS) là đợt v2-B.
export function ShopPage() {
  const { track } = useMini()
  const chat = () => {
    track('chat_click', { from: 'shop' })
    if (LINKS.oaId) void platform.openChat({ kind: 'zalo_oa', oaId: LINKS.oaId }, 'Cô ơi, cháu muốn đặt hàng')
    else if (LINKS.messenger) void platform.openChat({ kind: 'url', url: LINKS.messenger })
  }
  return (
    <Page className="page">
      <h2>Đặt hàng</h2>
      <div className="shop-grid">
        {SHOP_ITEMS.map(p => (
          <button
            key={p.href}
            className="shop-item"
            onClick={() => {
              track('product_click', { product: p.href, from: 'shop' })
              void platform.openExternal(siteUrl(p.href))
            }}
          >
            <img src={asset(p.image)} alt="" loading="lazy" />
            <span>{p.name}</span>
          </button>
        ))}
      </div>
      {(LINKS.oaId || LINKS.messenger) && (
        <Button variant="secondary" fullWidth onClick={chat}>
          Đặt nhanh qua tin nhắn với Cô Hạ
        </Button>
      )}
    </Page>
  )
}
