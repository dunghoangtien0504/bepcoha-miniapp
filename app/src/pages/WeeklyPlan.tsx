import { useEffect, useMemo, useState } from 'react'
import { Button, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { RecipeImage } from '../components/RecipeImage'
import { useCart } from '../cart'
import { money } from '../lib/format'
import { hacoProducts } from '../lib/ingredients'
import { readLocal, writeLocal } from '../lib/storage'
import { platform } from '../platform'
import { CATEGORIES, findRecipe, type Recipe } from '../recipes'
import { useMini } from '../state'
import {
  DEFAULT_PEOPLE, GROUPS, MENUS, PEOPLE_CHOICES, PICKABLE, PREP, PRICE_DATE, PRICE_SOURCE, findMenu, menuRecipes, perMeal, shopList, shopListText,
} from '../weekly'

type Tab = 'menu' | 'pick' | 'list' | 'prep'
type Source = { kind: 'menu'; key: string } | { kind: 'custom' }

// Chỉ lưu trên máy thứ không phải dữ liệu cá nhân: nguồn đang xem, số người, mã món đã chọn, ô đã mua.
const K = { source: 'haco_week_source', people: 'haco_week_people', custom: 'haco_week_custom', checked: 'haco_week_checked2' }
const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const v = JSON.parse(readLocal(key) || 'null')
    return v ?? fallback
  } catch {
    return fallback
  }
}

/** Sốt Bếp Cô Hạ (tên trong nguyên liệu) → mã hàng trong giỏ. */
const HACO_SKU: [RegExp, string][] = [
  [/xá xíu/i, 'sxx-500g'],
  [/trộn nộm/i, 'stn-500g'],
]

// Đi chợ 1 lần, nấu cả tuần: chọn thực đơn gợi ý hoặc tự chọn món → app gộp nguyên liệu, nhân theo số người, ước tính giá Co.opmart.
export function WeeklyPlanPage() {
  const navigate = useNavigate()
  const cart = useCart()
  const { track } = useMini()
  const { openSnackbar } = useSnackbar()
  const [tab, setTab] = useState<Tab>('menu')
  const [source, setSource] = useState<Source>(() => readJson<Source>(K.source, { kind: 'menu', key: MENUS[0].key }))
  const [people, setPeople] = useState<number>(() => readJson<number>(K.people, DEFAULT_PEOPLE))
  const [custom, setCustom] = useState<string[]>(() => readJson<string[]>(K.custom, []).filter(s => !!findRecipe(s)))
  const [checked, setChecked] = useState<string[]>(() => readJson<string[]>(K.checked, []))
  const [menuKey, setMenuKey] = useState(source.kind === 'menu' ? source.key : MENUS[0].key)
  const [cat, setCat] = useState<string | null>(null)

  useEffect(() => writeLocal(K.source, JSON.stringify(source)), [source])
  useEffect(() => writeLocal(K.people, JSON.stringify(people)), [people])
  useEffect(() => writeLocal(K.custom, JSON.stringify(custom)), [custom])
  useEffect(() => writeLocal(K.checked, checked.length ? JSON.stringify(checked) : null), [checked])
  useEffect(() => track('week_plan_view', {}), [track])

  const menu = findMenu(source.kind === 'menu' ? source.key : menuKey) ?? MENUS[0]
  const recipes: Recipe[] = useMemo(
    () => (source.kind === 'menu' ? menuRecipes(menu) : custom.map(s => findRecipe(s)).filter((r): r is Recipe => !!r)),
    [source, menu, custom],
  )
  const title = source.kind === 'menu' ? `Thực đơn ${menu.name}` : `Món chị chọn (${custom.length} món)`
  const list = useMemo(() => shopList(recipes, people, source.kind === 'menu' ? 7 : undefined), [recipes, people, source])
  const sauces = hacoProducts(recipes)
  const left = list.lines.filter(l => !checked.includes(l.id)).length

  const toggleCheck = (id: string) => setChecked(c => (c.includes(id) ? c.filter(x => x !== id) : [...c, id]))
  const toggleDish = (slug: string) => setCustom(c => (c.includes(slug) ? c.filter(x => x !== slug) : [...c, slug]))
  const useMenu = (key: string) => {
    setSource({ kind: 'menu', key })
    setChecked([])
    setTab('list')
    track('week_plan_view', { menu: key })
  }
  const useCustom = () => {
    setSource({ kind: 'custom' })
    setChecked([])
    setTab('list')
    track('week_plan_view', { custom: custom.length })
  }
  const copy = async () => {
    track('week_plan_share', { source: source.kind })
    const r = await platform.shareText(shopListText(title, list, people))
    if (r === 'copied') openSnackbar({ type: 'success', text: 'Đã chép danh sách, chị dán vào Zalo hoặc ghi chú nhé', duration: 2500 })
  }
  const addSauces = () => {
    const skus = sauces.map(n => HACO_SKU.find(([re]) => re.test(n))?.[1]).filter((s): s is string => !!s && !!cart.item(s))
    for (const s of new Set(skus)) cart.add(s)
    track('cart_add', { from: 'week_plan', skus })
    navigate('/gio-hang')
  }
  const pickable = cat ? PICKABLE.filter(r => r.category === cat) : PICKABLE

  return (
    <Page className="page page-with-cart">
      <BackBar fallback="/" />
      <h2>Đi chợ 1 lần, nấu cả tuần</h2>
      <p className="muted">Chọn thực đơn có sẵn hoặc tự chọn món. App gộp nguyên liệu thành 1 danh sách đi chợ, kèm giá tham khảo Co.opmart.</p>

      <div className="card week-total">
        <div className="week-total-main">
          <span className="muted small">{title}</span>
          <b>{recipes.length ? money(list.fresh) : '—'}</b>
          {recipes.length > 0 && (
            <span className="small">
              ≈ {money(perMeal(list))}/bữa · {money(Math.round(perMeal(list) / people / 1000) * 1000)}/người/bữa
            </span>
          )}
        </div>
        <div className="people-row">
          <span className="small">Số người ăn:</span>
          {PEOPLE_CHOICES.map(n => (
            <button key={n} className={`chip ${people === n ? 'on' : ''}`} onClick={() => setPeople(n)}>
              {n}
            </button>
          ))}
        </div>
        {list.unpriced > 0 && <span className="muted small">Chưa tính vào tổng (Co.op Online chưa có giá): {list.unpricedNames.join(', ')}. Rau thơm, gia vị "một ít" cũng không tính.</span>}
        <p className="muted small week-source">
          Giá tham khảo {PRICE_SOURCE} ngày {PRICE_DATE}, có thể khác theo cửa hàng và khuyến mãi. Không tính gia vị khô.
        </p>
      </div>

      <div className="seg seg4">
        {(
          [
            ['menu', 'Thực đơn'],
            ['pick', `Tự chọn${custom.length ? ` · ${custom.length}` : ''}`],
            ['list', `Danh sách${list.lines.length ? ` · ${left}` : ''}`],
            ['prep', 'Sơ chế'],
          ] as [Tab, string][]
        ).map(([k, label]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'menu' && (
        <>
          <div className="chips">
            {MENUS.map(m => (
              <button key={m.key} className={`chip ${menuKey === m.key ? 'on' : ''}`} onClick={() => setMenuKey(m.key)}>
                {m.name}
              </button>
            ))}
          </div>
          {(() => {
            const m = findMenu(menuKey) ?? MENUS[0]
            return (
              <>
                <p className="muted small">{m.hint}. 7 bữa tối.</p>
                {m.days.map(d => (
                  <div key={d.day} className="card week-day">
                    <b className="week-day-name">{d.day}</b>
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
                <div className="sticky-cta">
                  <Button fullWidth onClick={() => useMenu(m.key)}>
                    Lập danh sách đi chợ cho thực đơn này
                  </Button>
                </div>
              </>
            )
          })()}
        </>
      )}

      {tab === 'pick' && (
        <>
          <p className="muted small">Bấm vào món chị định nấu trong tuần (bấm lại để bỏ). App cộng nguyên liệu của các món đã chọn.</p>
          <div className="chips">
            <button className={`chip ${cat === null ? 'on' : ''}`} onClick={() => setCat(null)}>
              Tất cả
            </button>
            {CATEGORIES.filter(c => PICKABLE.some(r => r.category === c.key)).map(c => (
              <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
          <div className="pick-grid">
            {pickable.map(r => {
              const on = custom.includes(r.slug)
              return (
                <button key={r.slug} className={`pick-item ${on ? 'on' : ''}`} onClick={() => toggleDish(r.slug)} aria-pressed={on}>
                  <RecipeImage recipe={r} className="pick-img" />
                  <span className="pick-check">{on ? '✓' : '+'}</span>
                  <span className="pick-name">{r.title}</span>
                  <span className="muted small">
                    {r.minutes} phút · {r.ingredients.length} nguyên liệu
                  </span>
                </button>
              )
            })}
          </div>
          <div className="sticky-cta">
            <Button fullWidth disabled={!custom.length} onClick={useCustom}>
              {custom.length ? `Xem danh sách đi chợ · ${custom.length} món` : 'Chọn ít nhất 1 món'}
            </Button>
          </div>
        </>
      )}

      {tab === 'list' && (
        <>
          {!recipes.length ? (
            <p className="muted">Chưa có món nào. Chọn 1 thực đơn hoặc tự chọn món trước nhé.</p>
          ) : (
            <>
              <div className="list-for small">
                <span>
                  Danh sách cho: <b>{title}</b> · {people} người
                </span>
                <button className="text-link" onClick={() => setTab(source.kind === 'menu' ? 'menu' : 'pick')}>
                  Đổi
                </button>
              </div>
              {GROUPS.map(g => {
                const rows = list.lines.filter(l => l.group === g.key)
                if (!rows.length) return null
                return (
                  <section key={g.key} className="week-group">
                    <h3>{g.label}</h3>
                    {g.hint && <p className="muted small">{g.hint}</p>}
                    {rows.map(l => (
                      <label key={l.id} className={`week-item ${checked.includes(l.id) ? 'done' : ''}`}>
                        <input type="checkbox" checked={checked.includes(l.id)} onChange={() => toggleCheck(l.id)} />
                        <span className="week-item-body">
                          <b>
                            {l.label}: {l.text}
                          </b>
                          <span className="muted small">{l.dishes.join(', ')}</span>
                          {l.ref && <span className="muted small">{l.ref}</span>}
                        </span>
                        {g.key !== 'gia_vi_kho' && (
                          <span className="week-item-price">{l.cost === null ? <span className="muted small">—</span> : money(l.cost)}</span>
                        )}
                      </label>
                    ))}
                  </section>
                )
              })}
              {sauces.length > 0 && (
                <section className="week-group">
                  <h3>🌿 Sốt Bếp Cô Hạ cần cho các món</h3>
                  <p className="muted small">{sauces.join(', ')} — 1 hũ/chai dùng được nhiều lần, giao tận nhà.</p>
                  <Button size="small" fullWidth onClick={addSauces}>
                    Thêm sốt vào giỏ
                  </Button>
                </section>
              )}
              <div className="two-choices">
                <Button variant="secondary" onClick={() => setChecked([])}>
                  Bỏ đánh dấu
                </Button>
                <Button onClick={copy}>Chép danh sách</Button>
              </div>
            </>
          )}
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
        </>
      )}
    </Page>
  )
}
