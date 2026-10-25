import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon, Page, useNavigate } from 'zmp-ui'
import { RecipeImage } from '../components/RecipeImage'
import { CATEGORIES, QUICK_MINUTES, RECIPES, searchRecipes, type RecipeCategory } from '../recipes'

export function RecipesPage() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [cat, setCat] = useState<RecipeCategory | 'nhanh' | null>(null)
  const base = cat === 'nhanh' ? RECIPES.filter(r => r.minutes <= QUICK_MINUTES) : cat ? RECIPES.filter(r => r.category === cat) : RECIPES
  const list = searchRecipes(q, base)
  const navigate = useNavigate()

  return (
    <Page className="page">
      <h2>Công thức</h2>
      <div className="search" role="search">
        <Icon icon="zi-search" size={18} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm món, nguyên liệu…" aria-label="Tìm công thức" />
      </div>
      <button className="card tips-entry" onClick={() => navigate('/meo-vat')}>
        <b>💡 Mẹo vặt nấu ăn</b>
        <span className="small muted">Khử tanh, giữ rau xanh, xôi không dính… ›</span>
      </button>
      <div className="chips">
        <button className={`chip ${cat === null ? 'on' : ''}`} onClick={() => setCat(null)}>
          Tất cả
        </button>
        <button className={`chip ${cat === 'nhanh' ? 'on' : ''}`} onClick={() => setCat('nhanh')}>
          ⏱ Dưới {QUICK_MINUTES} phút
        </button>
        {CATEGORIES.filter(c => RECIPES.some(r => r.category === c.key)).map(c => (
          <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {list.length ? (
        // Lưới ảnh 2 cột (học NYT Cooking / Kitchen Stories): nhìn ảnh chọn món nhanh hơn đọc danh sách.
        <div className="recipe-grid">
          {list.map(r => (
            <button key={r.slug} className="recipe-tile" onClick={() => navigate(`/cong-thuc/${r.slug}`)}>
              <RecipeImage recipe={r} className="recipe-tile-img" />
              <span className="recipe-tile-body">
                <b>{r.title}</b>
                <span className="muted small">
                  <Icon icon="zi-clock-1" size={12} /> {r.minutes} phút · {r.level === 'de' ? 'Dễ' : 'Vừa'}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="muted">Chưa có món khớp “{q}”. Chị thử từ khác nhé.</p>
      )}
      <p className="muted small center">{RECIPES.length} món cơm nhà. Xôi, chè, bánh khúc, gà ủ muối… có sét nguyên liệu kèm hướng dẫn ở tab Đặt hàng.</p>
    </Page>
  )
}
