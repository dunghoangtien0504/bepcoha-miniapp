import { useEffect, useState } from 'react'
import { Button, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { RecipeImage } from '../components/RecipeImage'
import { useCart } from '../cart'
import { money } from '../lib/format'
import { readLocal, writeLocal } from '../lib/storage'
import { platform } from '../platform'
import { findRecipe } from '../recipes'
import { useMini } from '../state'
import { GROUPS, PEOPLE, PREP, PRICE_DATE, PRICE_SOURCE, SHOP, WEEK, weekTotals, type ShopItem } from '../weekly'

const CHECK_KEY = 'haco_week_checked'
type Tab = 'menu' | 'list' | 'prep'

/** Chữ để khách chép sang Zalo/ghi chú khi đi chợ. */
export function shopListText(items: ShopItem[] = SHOP): string {
  const lines = [`ĐI CHỢ CẢ TUẦN (${PEOPLE} người, 7 bữa tối) — Bếp Cô Hạ`]
  for (const g of GROUPS) {
    const list = items.filter(i => i.group === g.key)
    if (!list.length) continue
    lines.push('', g.label.replace(/^\S+\s/, '').toUpperCase())
    for (const i of list) lines.push(`☐ ${i.name}: ${i.buy}${i.price ? ` (~${money(i.price)})` : ''}`)
  }
  lines.push('', `Giá tham khảo ${PRICE_SOURCE} ngày ${PRICE_DATE}.`)
  return lines.join('\n')
}

// Đi chợ 1 lần, nấu cả tuần (cho người bận): thực đơn 7 bữa tối, danh sách mua gộp theo quầy, giá Co.opmart, sơ chế 1 lần.
// Dữ liệu ở src/weekly.ts. Ô đã mua chỉ lưu mã món trên máy (không phải dữ liệu cá nhân).
export function WeeklyPlanPage() {
  const navigate = useNavigate()
  const cart = useCart()
  const { track } = useMini()
  const { openSnackbar } = useSnackbar()
  const [tab, setTab] = useState<Tab>('menu')
  const [checked, setChecked] = useState<string[]>(() => {
    try {
      const v = JSON.parse(readLocal(CHECK_KEY) || '[]')
      return Array.isArray(v) ? v.filter((x: unknown) => typeof x === 'string') : []
    } catch {
      return []
    }
  })
  useEffect(() => writeLocal(CHECK_KEY, checked.length ? JSON.stringify(checked) : null), [checked])
  useEffect(() => track('week_plan_view', {}), [track])

  const t = weekTotals()
  const toggle = (id: string) => setChecked(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]))
  const left = SHOP.filter(i => !checked.includes(i.id)).length

  const copy = async () => {
    track('week_plan_share', {})
    const r = await platform.shareText(shopListText())
    if (r === 'copied') openSnackbar({ type: 'success', text: 'Đã chép danh sách, chị dán vào Zalo hoặc ghi chú nhé', duration: 2500 })
  }
  const addHaco = () => {
    const skus = SHOP.filter(i => i.sku && cart.item(i.sku)).map(i => i.sku!)
    if (!skus.length) return
    for (const s of skus) cart.add(s)
    track('cart_add', { from: 'week_plan', skus })
    navigate('/gio-hang')
  }

  return (
    <Page className="page page-with-cart">
      <BackBar fallback="/" />
      <h2>Đi chợ 1 lần, nấu cả tuần</h2>
      <p className="muted">Thực đơn 7 bữa tối cho {PEOPLE} người. Chủ nhật đi chợ, sơ chế 1 tiếng, cả tuần chỉ việc nấu.</p>

      <div className="card week-total">
        <div className="week-total-main">
          <span className="muted small">Đồ tươi cả tuần khoảng</span>
          <b>{money(t.fresh)}</b>
          <span className="small">
            ≈ {money(t.perMeal)}/bữa · {money(t.perPersonMeal)}/người/bữa
          </span>
        </div>
        <div className="week-total-side small">
          <span>Gia vị khô, gạo (nếu hết): {money(t.pantry)}</span>
          <span>Sốt Bếp Cô Hạ: {money(t.haco)}</span>
          {t.unpriced > 0 && <span className="muted">{t.unpriced} thứ chưa có giá (rau thơm, cà rốt, giá đỗ)</span>}
        </div>
        <p className="muted small week-source">
          Giá tham khảo {PRICE_SOURCE} ngày {PRICE_DATE}, có thể khác theo cửa hàng và khuyến mãi.
        </p>
      </div>

      <div className="seg">
        {(
          [
            ['menu', 'Thực đơn'],
            ['list', `Danh sách mua${left < SHOP.length ? ` · còn ${left}` : ''}`],
            ['prep', 'Sơ chế & bảo quản'],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' &&
        WEEK.map(d => (
          <div key={d.day} className="card week-day">
            <div className="week-day-head">
              <b>{d.day}</b>
              {d.note && <span className="muted small">{d.note}</span>}
            </div>
            <div className="week-dishes">
              {d.dishes.map(slug => {
                const r = findRecipe(slug)
                if (!r) return null
                return (
                  <button key={slug} className="week-dish" onClick={() => navigate(`/cong-thuc/${slug}`)}>
                    <RecipeImage recipe={r} className="week-dish-img" />
                    <span>{r.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}

      {tab === 'list' && (
        <>
          {GROUPS.map(g => {
            const list = SHOP.filter(i => i.group === g.key)
            return (
              <section key={g.key} className="week-group">
                <h3>{g.label}</h3>
                {g.hint && <p className="muted small">{g.hint}</p>}
                {list.map(i => (
                  <label key={i.id} className={`week-item ${checked.includes(i.id) ? 'done' : ''}`}>
                    <input type="checkbox" checked={checked.includes(i.id)} onChange={() => toggle(i.id)} />
                    <span className="week-item-body">
                      <b>{i.name}</b>
                      <span className="small">
                        {i.buy} · {i.days.join(', ')}
                      </span>
                      {i.ref && <span className="muted small">{i.ref}</span>}
                    </span>
                    <span className="week-item-price">{i.price === null ? <span className="muted small">chưa có giá</span> : money(i.price)}</span>
                  </label>
                ))}
                {g.key === 'haco' && (
                  <Button size="small" fullWidth onClick={addHaco}>
                    Thêm 2 loại sốt vào giỏ
                  </Button>
                )}
              </section>
            )
          })}
          <div className="two-choices">
            <Button variant="secondary" onClick={() => setChecked([])}>
              Bỏ đánh dấu
            </Button>
            <Button onClick={copy}>Chép danh sách</Button>
          </div>
        </>
      )}

      {tab === 'prep' && (
        <>
          <ol className="steps week-prep">
            {PREP.map(p => (
              <li key={p.title}>
                <b>{p.title}</b>
                <span className="muted small block">{p.detail}</span>
              </li>
            ))}
          </ol>
          <p className="muted small">Nhà 2 người: mua một nửa lượng thịt, cá; mỗi món nấu 1 lần ăn 2 bữa.</p>
        </>
      )}
    </Page>
  )
}
