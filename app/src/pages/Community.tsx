import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { ApiError, type CommunityPost, type MyPost } from '../api/types'
import { BackBar } from '../components/BackBar'
import { OABar, canChat, chatWithBep } from '../components/OABar'
import { RecipeImage } from '../components/RecipeImage'
import { COMMUNITY, LINKS, asset } from '../content'
import { dayMonth } from '../lib/format'
import { compressImage } from '../lib/image'
import { IS_ZALO, platform } from '../platform'
import { RECIPES, findRecipe } from '../recipes'
import { useMini } from '../state'

/** Tắt form đăng ảnh bằng VITE_COMMUNITY_UPLOAD=off (nếu Zalo yêu cầu khi duyệt) — khi đó khách gửi ảnh qua chat OA. */
const UPLOAD_ON = import.meta.env.VITE_COMMUNITY_UPLOAD !== 'off'
const CAPTION_MAX = 300
const STATUS: Record<MyPost['status'], string> = { cho_duyet: 'Chờ Bếp duyệt', da_duyet: 'Đã đăng', tu_choi: 'Chưa đăng được', an: 'Đã ẩn' }
const imgSrc = (url: string) => (url.startsWith('data:') ? url : asset(url))

// Góc bếp chị em: khách đăng ảnh món + caption; Bếp duyệt trên CRM rồi mới hiện cho người khác.
// Đúng chính sách Zalo Mini App 4.6: không thả tim, không bình luận, không trang cá nhân; bài gửi cho Bếp, Bếp chọn đăng.
export function CommunityPage() {
  const { api, session, track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [mine, setMine] = useState<MyPost[]>([])
  const ch = COMMUNITY.challenge
  const r = findRecipe(ch.recipe)
  const site = (import.meta.env.VITE_SITE_ORIGIN as string | undefined) || (typeof window !== 'undefined' ? window.location.origin : '')
  const groupUrl = IS_ZALO ? LINKS.zaloGroup : LINKS.zaloGroup || LINKS.facebookGroup

  const hasSession = !!session
  const reload = useCallback(() => {
    api.communityPosts().then(r2 => setPosts(r2.posts), () => undefined)
    if (hasSession) api.myPosts().then(r2 => setMine(r2.posts), () => undefined)
  }, [api, hasSession])
  useEffect(() => {
    track('community_view', {})
    reload()
  }, [track, reload])

  const brag = async () => {
    track('community_feed', {})
    const img = r?.image ? (r.image.startsWith('https://') ? r.image : site + r.image) : ''
    const res = await platform.postFeed(img, `Mình vừa nấu ${r?.title ?? 'món ngon'} theo công thức của Bếp Cô Hạ 🍲`)
    if (res === 'copied') openSnackbar({ type: 'success', text: 'Đã chép lời khoe, chị dán vào Nhật ký Zalo nhé', duration: 2500 })
  }

  return (
    <Page className="page page-with-cart">
      <BackBar fallback="/" />
      <h2>Góc bếp chị em</h2>
      <p className="muted">Đăng ảnh món chị tự nấu, chia sẻ cách làm. Bếp duyệt rồi đăng lên đây; ảnh đẹp được Cô Hạ khen và ghim lên đầu.</p>

      <div className="card challenge">
        {r && <RecipeImage recipe={r} className="challenge-img" />}
        <div className="challenge-body">
          <span className="badge badge-new">Thử thách tuần</span>
          <b>{ch.title}</b>
          <span className="small">{ch.body}</span>
          {r && (
            <Button size="small" variant="secondary" onClick={() => navigate(`/cong-thuc/${r.slug}`)}>
              Xem công thức
            </Button>
          )}
        </div>
      </div>

      {UPLOAD_ON ? (
        <Composer
          onDone={() => {
            reload()
            openSnackbar({ type: 'success', text: 'Đã gửi! Cô Hạ duyệt trong 24 giờ rồi đăng lên Góc bếp nhé.', duration: 3500 })
          }}
          defaultRecipe={ch.recipe}
        />
      ) : (
        canChat() && (
          <Button fullWidth onClick={() => void chatWithBep('Cô ơi, cháu gửi ảnh món cháu nấu ạ')}>
            Gửi ảnh cho Bếp qua Zalo
          </Button>
        )
      )}

      {mine.length > 0 && (
        <>
          <h3>Bài của tôi</h3>
          <div className="my-posts">
            {mine.map(p => (
              <div key={p.id} className="my-post">
                {IS_ZALO && p.status !== 'da_duyet' ? <div className="my-post-img pt-ph">🍲</div> : <img className="my-post-img" src={imgSrc(p.image_url)} alt="" loading="lazy" />}
                <div className="my-post-body">
                  <span className={`badge ${p.status === 'da_duyet' ? 'badge-ok' : p.status === 'tu_choi' ? 'badge-warn' : ''}`}>{STATUS[p.status]}</span>
                  <span className="small">{p.caption}</span>
                  {p.reject_reason && <span className="small muted">Lý do: {p.reject_reason}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Button variant="secondary" fullWidth onClick={brag}>
        {IS_ZALO ? 'Khoe lên Nhật ký Zalo' : 'Chia sẻ cho bạn bè'}
      </Button>

      <h3>Món ngon của chị em</h3>
      {posts.length > 0 ? (
        <div className="feed">
          {posts.map(p => {
            const rr = p.recipe_slug ? findRecipe(p.recipe_slug) : undefined
            return (
              <article key={p.id} className="feed-item">
                <img src={imgSrc(p.image_url)} alt={p.caption} loading="lazy" />
                <div className="feed-body">
                  <div className="feed-head">
                    <b>{p.display_name}</b>
                    {p.area && <span className="muted small"> · {p.area}</span>}
                    <span className="muted small"> · {dayMonth(p.created_at)}</span>
                  </div>
                  {(p.praised || p.pinned) && (
                    <div className="feed-tags">
                      {p.pinned && <span className="badge badge-new">Món của tuần</span>}
                      {p.praised && <span className="badge badge-ok">Cô Hạ khen ❤</span>}
                    </div>
                  )}
                  <p className="feed-caption">{p.caption}</p>
                  {rr && (
                    <button className="text-link small" onClick={() => navigate(`/cong-thuc/${rr.slug}`)}>
                      Công thức: {rr.title} ›
                    </button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <p className="muted small">Chưa có bài nào được đăng. Chị là người đầu tiên khoe món nhé!</p>
      )}

      <h3>Từ lớp học của Bếp</h3>
      <div className="gallery">
        {COMMUNITY.gallery.map(g => (
          <figure key={g.image} className="gallery-item">
            <img src={asset(g.image)} alt={g.caption} loading="lazy" />
            <figcaption>
              <b>{g.caption}</b>
              <span>{g.by || 'Lớp học của Bếp Cô Hạ'}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {groupUrl && (
        <div className="card ask-co">
          <b>Trò chuyện cùng chị em</b>
          <span className="small muted">Hỏi đáp, bàn chuyện bếp núc trong nhóm của Cô Hạ.</span>
          <Button
            size="small"
            onClick={() => {
              track('group_click', { from: 'community' })
              void platform.openExternal(groupUrl)
            }}
          >
            {LINKS.zaloGroup ? 'Vào Nhóm Zalo của Cô' : 'Vào nhóm Facebook Công thức Cô Hạ'}
          </Button>
        </div>
      )}
      <OABar from="community" message="Cô ơi, cháu muốn hỏi Bếp ạ" />
      <p className="muted small center">Bếp duyệt mọi ảnh trước khi đăng. Không hiện số điện thoại của chị.</p>
    </Page>
  )
}

function Composer({ onDone, defaultRecipe }: { onDone: () => void; defaultRecipe: string }) {
  const { api, session, track } = useMini()
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const [slug, setSlug] = useState(defaultRecipe)
  const [name, setName] = useState('')
  const [area, setArea] = useState('')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!session) {
    return (
      <div className="card composer">
        <b>📷 Đăng ảnh món của chị</b>
        <span className="small muted">Đăng ký số điện thoại (miễn phí) để đăng ảnh và nhận lời khen của Cô Hạ.</span>
        <Button size="small" onClick={() => navigate('/dang-ky?next=/cong-dong')}>
          Đăng ký để đăng ảnh
        </Button>
      </div>
    )
  }

  const pick = async (f: File | undefined) => {
    setError(null)
    if (!f) return
    try {
      setImage(await compressImage(f))
    } catch {
      setError('Chưa đọc được ảnh này, chị chọn ảnh khác (JPG, PNG) giúp Cô nhé.')
    }
  }
  const missing = !image ? 'Chọn ảnh món ăn' : caption.trim().length < 2 ? 'Viết vài chữ giới thiệu món' : !consent ? 'Tick đồng ý cho Bếp đăng ảnh' : null

  const submit = async () => {
    if (!image || missing) return
    setBusy(true)
    setError(null)
    try {
      await api.createPost({ image, caption: caption.trim(), display_name: name.trim(), area: area.trim(), recipe_slug: slug || null, consent })
      track('community_post', { recipe: slug || null })
      setImage(null)
      setCaption('')
      setConsent(false)
      onDone()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Chưa gửi được, chị thử lại giúp Cô nhé.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="card composer">
      <b>📷 Đăng ảnh món của chị</b>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => void pick(e.target.files?.[0])} />
      {image ? (
        <div className="composer-preview">
          <img src={image} alt="Ảnh món sắp đăng" />
          <button className="text-link small" onClick={() => fileRef.current?.click()}>
            Đổi ảnh khác
          </button>
        </div>
      ) : (
        <button className="composer-pick" onClick={() => fileRef.current?.click()}>
          <span className="composer-pick-icon">📷</span>
          <span>Chụp hoặc chọn ảnh món ăn</span>
          <span className="small muted">Chỉ chụp món ăn, không cần mặt người</span>
        </button>
      )}
      <Input.TextArea
        label="Chia sẻ về món của chị"
        placeholder="Lần đầu nấu thịt kho theo công thức của Cô, cả nhà khen ngon…"
        maxLength={CAPTION_MAX}
        showCount
        value={caption}
        onChange={e => setCaption(e.target.value)}
      />
      <label className="small">
        Món đã nấu
        <select className="composer-select" value={slug} onChange={e => setSlug(e.target.value)}>
          <option value="">Món khác</option>
          {RECIPES.map(r => (
            <option key={r.slug} value={r.slug}>
              {r.title}
            </option>
          ))}
        </select>
      </label>
      <div className="two-choices">
        <Input label="Tên hiển thị" placeholder="Chị Lan" maxLength={40} value={name} onChange={e => setName(e.target.value)} />
        <Input label="Khu vực" placeholder="Hà Nội" maxLength={40} value={area} onChange={e => setArea(e.target.value)} />
      </div>
      <label className="check-row consent-row">
        <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
        <span className="small">Tôi đồng ý để Bếp Cô Hạ đăng ảnh và lời chia sẻ này trong Mini App (hiện tên hiển thị, không hiện số điện thoại).</span>
      </label>
      {missing && image !== null && <div className="hint">{missing}.</div>}
      {error && <div className="error">{error}</div>}
      <Button fullWidth loading={busy} disabled={!!missing} onClick={submit}>
        Gửi cho Bếp duyệt
      </Button>
    </div>
  )
}
