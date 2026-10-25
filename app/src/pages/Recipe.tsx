import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Icon, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { useCart } from '../cart'
import { BackBar } from '../components/BackBar'
import { CookTimer, useCookTimer } from '../components/CookTimer'
import { RecipeImage } from '../components/RecipeImage'
import { siteUrl } from '../content'
import { minutesLabel } from '../lib/timer'
import { IS_ZALO, platform } from '../platform'
import { PHASES, findRecipe, type Step } from '../recipes'
import { useShopping } from '../shopping'
import { useMini } from '../state'

const LEVEL = { de: 'Dễ làm', vua: 'Cần chút kinh nghiệm' } as const

// Trang công thức (học Tasty / Kitchen Stories / NYT Cooking): nguyên liệu có định lượng, các bước chia
// Sơ chế → Nấu → Trình bày, chế độ nấu chữ to giữ màn hình sáng có hẹn giờ, Lưu vào Sổ tay, danh sách đi chợ,
// và nút dẫn sang sản phẩm dùng trong món (công thức bán được hàng — "hộp đen").
export function RecipePage() {
  const { slug = '' } = useParams()
  const recipe = findRecipe(slug)
  const { session, me, api, refreshMe, track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const cart = useCart()
  const shopping = useShopping()
  const timer = useCookTimer()
  const [cooking, setCooking] = useState(false)
  const [step, setStep] = useState(0)
  const saved = !!me?.saved_recipes.includes(slug)

  useEffect(() => {
    if (recipe) track('recipe_open', { slug })
  }, [recipe, slug, track])

  useEffect(() => {
    void platform.keepAwake(cooking)
    // Chế độ nấu chiếm cả màn: ẩn thanh tab dưới để tay ướt không bấm nhầm.
    document.body.classList.toggle('cooking', cooking)
    return () => {
      void platform.keepAwake(false)
      document.body.classList.remove('cooking')
    }
  }, [cooking])

  if (!recipe) {
    return (
      <Page className="page">
        <p>Không tìm thấy món này.</p>
        <Button onClick={() => navigate('/cong-thuc')}>Xem các món khác</Button>
      </Page>
    )
  }

  const toggleSave = async () => {
    if (!session) {
      navigate(`/dang-ky?next=${encodeURIComponent('/cong-thuc/' + slug)}`)
      return
    }
    track('recipe_save', { slug, saved: !saved })
    try {
      await api.saveRecipe(slug, !saved)
      await refreshMe()
      openSnackbar({ type: 'success', text: saved ? 'Đã bỏ khỏi Sổ tay' : 'Đã lưu vào Sổ tay', duration: 2000 })
    } catch {
      openSnackbar({ type: 'error', text: 'Chưa lưu được, chị thử lại nhé', duration: 2500 })
    }
  }

  const openProduct = () => {
    if (!recipe.product) return
    track('product_click', { slug, product: recipe.product.href })
    void platform.openExternal(siteUrl(recipe.product.href))
  }

  // "Mua đủ nguyên liệu": bỏ sản phẩm của món vào giỏ rồi mở giỏ (v2-B).
  const productItem = recipe.product ? cart.item(recipe.product.sku) : undefined
  const buyProduct = () => {
    if (!productItem) return
    cart.add(productItem.sku)
    track('cart_add', { sku: productItem.sku, from: 'recipe', slug })
    navigate('/gio-hang')
  }

  const inShopping = shopping.items.some(i => i.slug === slug)
  const addShopping = () => {
    if (inShopping) {
      navigate('/di-cho')
      return
    }
    shopping.add(recipe)
    track('shopping_add', { slug })
    openSnackbar({ type: 'success', text: `Đã thêm ${recipe.ingredients.length} nguyên liệu vào danh sách đi chợ`, duration: 2000 })
  }

  const startTimer = (s: Step) => {
    if (!s.minutes) return
    timer.start(s.title, s.minutes)
    track('cook_timer', { slug, minutes: s.minutes })
  }

  if (cooking) {
    const s = recipe.steps[step]
    const last = step === recipe.steps.length - 1
    const phase = PHASES.find(p => p.key === s.phase)!
    return (
      <Page className="page cook-mode">
        <div className="cook-top">
          <span className="muted small">
            {recipe.title} · bước {step + 1}/{recipe.steps.length}
          </span>
          <button className="text-link" onClick={() => setCooking(false)}>
            Thoát
          </button>
        </div>
        <div className="cook-progress">
          <span style={{ width: `${((step + 1) / recipe.steps.length) * 100}%` }} />
        </div>
        <CookTimer timer={timer} />
        <div className="cook-body">
          <span className={`phase-tag phase-${s.phase}`}>{phase.label}</span>
          <div className="cook-step">{s.title}</div>
          {s.detail && <p className="cook-detail">{s.detail}</p>}
          {last && recipe.doneSign && <p className="cook-done">✓ Món đạt khi: {recipe.doneSign}</p>}
          {s.minutes && !timer.running && (
            <Button variant="secondary" className="timer-btn" onClick={() => startTimer(s)}>
              ⏱ Hẹn giờ {minutesLabel(s.minutes)}
            </Button>
          )}
        </div>
        <div className="two-choices cook-actions">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Bước trước
          </Button>
          {last ? (
            <Button
              onClick={() => {
                track('cook_done', { slug })
                setCooking(false)
                openSnackbar({ type: 'success', text: 'Chị nấu xong rồi! Chụp ảnh món khoe Cô Hạ nhé.', duration: 3000 })
              }}
            >
              Xong rồi
            </Button>
          ) : (
            <Button onClick={() => setStep(step + 1)}>Bước tiếp</Button>
          )}
        </div>
      </Page>
    )
  }

  return (
    <Page className="page">
      <BackBar fallback="/cong-thuc" overlay />
      <RecipeImage recipe={recipe} className="recipe-hero" />
      {/* Ảnh CC phải ghi tác giả và giấy phép. Chỉ ghi chữ, không gắn link (Zalo mục 4.1 cấm đưa khách ra link ngoài). */}
      {recipe.imageCredit && (
        <p className="img-credit">
          Ảnh minh hoạ: {recipe.imageCredit.author} · {recipe.imageCredit.license} · Wikimedia Commons
        </p>
      )}
      <h2>{recipe.title}</h2>
      <p className="muted">{recipe.summary}</p>
      <div className="recipe-facts">
        <span>
          <Icon icon="zi-clock-1" size={16} /> {minutesLabel(recipe.minutes)}
        </span>
        <span>
          <Icon icon="zi-group" size={16} /> {recipe.servings} người
        </span>
        <span>{LEVEL[recipe.level]}</span>
      </div>
      {recipe.prepNote && <p className="prep-note">⏳ {recipe.prepNote}</p>}
      <button className={`save-btn ${saved ? 'on' : ''}`} onClick={toggleSave} aria-pressed={saved}>
        <Icon icon="zi-bookmark" size={16} /> {saved ? 'Đã lưu Sổ tay' : 'Lưu Sổ tay'}
      </button>

      <h3>Nguyên liệu</h3>
      <ul className="ingredients">
        {recipe.ingredients.map(i => (
          <li key={i.name}>
            {i.qty && <b>{i.qty}</b>} {i.name}
            {i.note && <span className="muted small"> ({i.note})</span>}
          </li>
        ))}
      </ul>
      {recipe.tools && <p className="muted small">Dụng cụ: {recipe.tools.join(', ')}</p>}
      <Button size="small" variant="secondary" onClick={addShopping}>
        {inShopping ? '✓ Đã có trong danh sách đi chợ — xem' : '🛒 Thêm vào danh sách đi chợ'}
      </Button>

      {recipe.product && (
        <div className="card card-product">
          <div className="small">Món này dùng</div>
          <b>{recipe.product.name}</b>
          {/* Bản Zalo không mở trang web sản phẩm (mục 4.1), chỉ thêm vào giỏ trong app. */}
          {productItem ? (
            IS_ZALO ? (
              <Button size="small" onClick={buyProduct}>
                Thêm vào giỏ
              </Button>
            ) : (
              <div className="two-choices">
                <Button size="small" variant="secondary" onClick={openProduct}>
                  Xem sản phẩm
                </Button>
                <Button size="small" onClick={buyProduct}>
                  Thêm vào giỏ
                </Button>
              </div>
            )
          ) : (
            !IS_ZALO && (
              <Button size="small" onClick={openProduct}>
                Xem và đặt mua
              </Button>
            )
          )}
        </div>
      )}

      {PHASES.map(p => {
        const steps = recipe.steps.map((s, idx) => ({ s, idx })).filter(x => x.s.phase === p.key)
        if (!steps.length) return null
        return (
          <section key={p.key}>
            <h3>
              <span className={`phase-tag phase-${p.key}`}>{p.label}</span>
            </h3>
            <ol className="steps" start={steps[0].idx + 1}>
              {steps.map(({ s, idx }) => (
                <li key={idx}>
                  <b>{s.title}</b>
                  {s.minutes ? <span className="step-min"> · {minutesLabel(s.minutes)}</span> : null}
                  {s.detail && <span className="muted small block">{s.detail}</span>}
                </li>
              ))}
            </ol>
          </section>
        )
      })}
      {recipe.doneSign && (
        <div className="card done-sign">
          <b>✓ Món đạt khi</b>
          <span>{recipe.doneSign}</span>
        </div>
      )}
      {recipe.fullRecipeIn && (
        <Button variant="secondary" fullWidth onClick={() => navigate(session ? recipe.fullRecipeIn!.to : '/khoa-hoc')}>
          {recipe.fullRecipeIn.label}
        </Button>
      )}

      {recipe.tips && (
        <>
          <h3>Bí quyết</h3>
          <ul className="plain">
            {recipe.tips.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}
      {recipe.storage && (
        <>
          <h3>Bảo quản</h3>
          <ul className="plain">
            {recipe.storage.map(t => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </>
      )}

      <div className="sticky-cta">
        <Button
          fullWidth
          onClick={() => {
            track('cook_mode', { slug })
            setStep(0)
            setCooking(true)
          }}
        >
          Bắt đầu nấu
        </Button>
      </div>
    </Page>
  )
}
