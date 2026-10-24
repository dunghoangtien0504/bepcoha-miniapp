import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Icon, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { asset, siteUrl } from '../content'
import { platform } from '../platform'
import { findRecipe } from '../recipes'
import { useMini } from '../state'

// Trang công thức (học Tasty / Kitchen Stories / NYT Cooking): nguyên liệu, từng bước, chế độ nấu chữ to giữ màn hình sáng,
// Lưu vào Sổ tay, và nút dẫn sang sản phẩm dùng trong món (công thức bán được hàng — "hộp đen").
export function RecipePage() {
  const { slug = '' } = useParams()
  const recipe = findRecipe(slug)
  const { session, me, api, refreshMe, track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const [cooking, setCooking] = useState(false)
  const [step, setStep] = useState(0)
  const saved = !!me?.saved_recipes.includes(slug)

  useEffect(() => {
    if (recipe) track('recipe_open', { slug })
  }, [recipe, slug, track])

  useEffect(() => {
    void platform.keepAwake(cooking)
    return () => void platform.keepAwake(false)
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

  if (cooking) {
    const s = recipe.steps[step]
    return (
      <Page className="page cook-mode">
        <div className="muted small">
          {recipe.title} · bước {step + 1}/{recipe.steps.length}
        </div>
        <div className="cook-step">{s.title}</div>
        {s.detail && <p className="cook-detail">{s.detail}</p>}
        <div className="two-choices">
          <Button variant="secondary" disabled={step === 0} onClick={() => setStep(step - 1)}>
            Bước trước
          </Button>
          {step < recipe.steps.length - 1 ? (
            <Button onClick={() => setStep(step + 1)}>Bước tiếp</Button>
          ) : (
            <Button onClick={() => setCooking(false)}>Xong rồi</Button>
          )}
        </div>
        <button className="text-link center block" onClick={() => setCooking(false)}>
          Thoát chế độ nấu
        </button>
      </Page>
    )
  }

  return (
    <Page className="page">
      <img className="recipe-hero" src={asset(recipe.image)} alt={recipe.title} />
      <h2>{recipe.title}</h2>
      <p className="muted">{recipe.summary}</p>
      <div className="recipe-meta">
        <span>
          <Icon icon="zi-clock-1" size={16} /> {recipe.minutes} phút
        </span>
        <button className={`save-btn ${saved ? 'on' : ''}`} onClick={toggleSave} aria-pressed={saved}>
          <Icon icon="zi-bookmark" size={16} /> {saved ? 'Đã lưu' : 'Lưu Sổ tay'}
        </button>
      </div>

      <h3>Nguyên liệu</h3>
      <ul className="plain">
        {recipe.ingredients.map(i => (
          <li key={i}>{i}</li>
        ))}
      </ul>
      {recipe.product && (
        <div className="card card-product">
          <div className="small">Món này dùng</div>
          <b>{recipe.product.name}</b>
          <Button size="small" onClick={openProduct}>
            Xem và đặt mua
          </Button>
        </div>
      )}

      <h3>Các bước</h3>
      <ol className="steps">
        {recipe.steps.map((s, i) => (
          <li key={i}>
            <b>{s.title}</b>
            {s.detail && <span className="muted small block">{s.detail}</span>}
          </li>
        ))}
      </ol>
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
