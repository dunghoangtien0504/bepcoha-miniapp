import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon, Page } from 'zmp-ui'
import { RecipeCard } from '../components/RecipeCard'
import { CATEGORIES, QUICK_MINUTES, RECIPES, searchRecipes, type RecipeCategory } from '../recipes'

export function RecipesPage() {
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const [cat, setCat] = useState<RecipeCategory | 'nhanh' | null>(null)
  const base = cat === 'nhanh' ? RECIPES.filter(r => r.minutes <= QUICK_MINUTES) : cat ? RECIPES.filter(r => r.category === cat) : RECIPES
  const list = searchRecipes(q, base)

  return (
    <Page className="page">
      <h2>Công thức</h2>
      <div className="search" role="search">
        <Icon icon="zi-search" size={18} />
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tìm món, nguyên liệu…" aria-label="Tìm công thức" />
      </div>
      <div className="chips">
        <button className={`chip ${cat === null ? 'on' : ''}`} onClick={() => setCat(null)}>
          Tất cả
        </button>
        <button className={`chip ${cat === 'nhanh' ? 'on' : ''}`} onClick={() => setCat('nhanh')}>
          ⏱ Dưới {QUICK_MINUTES} phút
        </button>
        {CATEGORIES.map(c => (
          <button key={c.key} className={`chip ${cat === c.key ? 'on' : ''}`} onClick={() => setCat(c.key)}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      {list.length ? list.map(r => <RecipeCard key={r.slug} recipe={r} />) : <p className="muted">Chưa có món khớp “{q}”. Chị thử từ khác nhé.</p>}
      <p className="muted small center">{RECIPES.length} món · Cô Hạ đang soạn thêm món mới mỗi tuần.</p>
    </Page>
  )
}
