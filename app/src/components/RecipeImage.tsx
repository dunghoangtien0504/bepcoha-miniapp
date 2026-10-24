import { asset } from '../content'
import { categoryOf, type Recipe } from '../recipes'

/** Ảnh món; món chưa có ảnh thật thì hiện ảnh minh hoạ theo nhóm món (không dùng ảnh trên mạng không rõ bản quyền). */
export function RecipeImage({ recipe, className }: { recipe: Recipe; className: string }) {
  if (recipe.image) return <img className={className} src={asset(recipe.image)} alt="" loading="lazy" />
  const c = categoryOf(recipe.category)
  return (
    <div className={`${className} recipe-ph recipe-ph-${recipe.category}`} aria-hidden="true">
      <span>{c.emoji}</span>
    </div>
  )
}
