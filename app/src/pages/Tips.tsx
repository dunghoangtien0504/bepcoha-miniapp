import { useEffect, useState } from 'react'
import { Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { OABar } from '../components/OABar'
import { BuyButton, ProductImage } from '../components/ProductTips'
import { findProduct } from '../products'
import { findRecipe } from '../recipes'
import { useMini } from '../state'
import { TIPS, TIP_CATEGORIES, type Tip, type TipCategory } from '../tips'

export function TipCard({ tip, from }: { tip: Tip; from: string }) {
  const navigate = useNavigate()
  const p = tip.product ? findProduct(tip.product) : undefined
  const r = tip.recipe ? findRecipe(tip.recipe) : undefined
  return (
    <div className="card tip-card">
      <b>💡 {tip.title}</b>
      <span>{tip.body}</span>
      {tip.source === 'nhan' && <span className="source-note">Theo hướng dẫn in trên bao bì của Bếp</span>}
      {(p || r) && (
        <div className="tip-actions">
          {r && (
            <button className="text-link" onClick={() => navigate(`/cong-thuc/${r.slug}`)}>
              Xem công thức {r.title} ›
            </button>
          )}
          {p && (
            <span className="tip-product">
              <ProductImage product={p} className="tip-product-img" />
              <span className="small">{p.name}</span>
              <BuyButton product={p} from={from} />
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// Mẹo vặt nấu ăn: chip theo nhóm, mỗi mẹo có thể dẫn sang công thức và sản phẩm của Bếp.
export function TipsPage() {
  const { track } = useMini()
  const [cat, setCat] = useState<TipCategory | null>(null)
  useEffect(() => track('tips_view', {}), [track])
  const list = cat ? TIPS.filter(t => t.category === cat) : TIPS

  return (
    <Page className="page page-with-cart">
      <BackBar fallback="/" />
      <h2>💡 Mẹo vặt nấu ăn</h2>
      <p className="muted">{TIPS.length} mẹo nhỏ giúp món ngon hơn, nấu nhanh hơn.</p>
      <div className="chips">
        <button className={`chip ${cat === null ? 'on' : ''}`} onClick={() => setCat(null)}>
          Tất cả
        </button>
        {TIP_CATEGORIES.map(c => (
          <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {list.map(t => (
        <TipCard key={t.id} tip={t} from={`tip:${t.id}`} />
      ))}
      <div className="card ask-co">
        <b>Chị có mẹo hay?</b>
        <span className="small muted">Nhắn cho Bếp, Cô chọn đăng và ghi tên chị.</span>
        <OABar from="tips" message="Cô ơi, cháu có mẹo nấu ăn muốn chia sẻ ạ" compact />
      </div>
    </Page>
  )
}
