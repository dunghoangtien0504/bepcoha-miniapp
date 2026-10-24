import { Icon, useNavigate } from 'zmp-ui'
import { asset } from '../content'
import type { Recipe } from '../recipes'

export function RecipeCard({ recipe, badge }: { recipe: Recipe; badge?: string }) {
  const navigate = useNavigate()
  return (
    <button className="recipe-card" onClick={() => navigate(`/cong-thuc/${recipe.slug}`)}>
      <img src={asset(recipe.image)} alt="" loading="lazy" />
      <span className="recipe-card-body">
        {badge && <span className="badge badge-ok">{badge}</span>}
        <b>{recipe.title}</b>
        <span className="muted small block">{recipe.summary}</span>
        <span className="muted small block">
          <Icon icon="zi-clock-1" size={14} /> {recipe.minutes} phút · {recipe.ingredients.length} nguyên liệu
        </span>
      </span>
    </button>
  )
}
