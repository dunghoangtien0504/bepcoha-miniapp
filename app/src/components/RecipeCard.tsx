import { Icon, useNavigate } from 'zmp-ui'
import type { Recipe } from '../recipes'
import { RecipeImage } from './RecipeImage'

export function RecipeCard({ recipe, badge }: { recipe: Recipe; badge?: string }) {
  const navigate = useNavigate()
  return (
    <button className="recipe-card" onClick={() => navigate(`/cong-thuc/${recipe.slug}`)}>
      <RecipeImage recipe={recipe} className="recipe-card-img" />
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
