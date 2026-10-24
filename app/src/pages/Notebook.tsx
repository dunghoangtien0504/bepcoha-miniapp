import { useEffect } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { RecipeCard } from '../components/RecipeCard'
import { findRecipe, type Recipe } from '../recipes'
import { useMini } from '../state'

// Sổ tay của tôi (học NYT Cooking "Recipe Box"): món đã lưu — khách càng lưu nhiều càng có lý do quay lại.
export function NotebookPage() {
  const { session, me, refreshMe } = useMini()
  const navigate = useNavigate()
  const hasSession = !!session
  useEffect(() => {
    if (hasSession) void refreshMe()
  }, [hasSession, refreshMe])

  if (!session) {
    return (
      <Page className="page">
        <BackBar fallback="/" />
        <h2>Sổ tay của tôi</h2>
        <p className="muted">Đăng ký số điện thoại để lưu món yêu thích, mở trên máy nào cũng còn.</p>
        <Button onClick={() => navigate('/dang-ky?next=/so-tay')}>Đăng ký</Button>
      </Page>
    )
  }

  const list = (me?.saved_recipes ?? []).map(findRecipe).filter((r): r is Recipe => !!r)
  return (
    <Page className="page">
      <BackBar fallback="/" />
      <h2>Sổ tay của tôi</h2>
      {list.length ? (
        list.map(r => <RecipeCard key={r.slug} recipe={r} />)
      ) : (
        <>
          <p className="muted">Chị chưa lưu món nào. Bấm “Lưu Sổ tay” ở món chị thích nhé.</p>
          <Button onClick={() => navigate('/cong-thuc')}>Xem công thức</Button>
        </>
      )}
    </Page>
  )
}
