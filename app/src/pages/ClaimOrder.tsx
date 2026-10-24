import { useState, type FormEvent } from 'react'
import { Button, Input, Page, useNavigate } from 'zmp-ui'
import { BackBar } from '../components/BackBar'
import { ApiError } from '../api/types'
import { useMini } from '../state'

// Ghép mã đơn sàn/Facebook với khách (B4 K17). Màn hình KHÔNG nói vì sao đơn đang chờ
// (không lộ mã đơn đó có tồn tại hay không — chống dò mã).
export function ClaimOrderPage() {
  const { api, session, setSession, track, refreshMe } = useMini()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<'da_khop' | 'cho_duyet' | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!session) {
    return (
      <Page className="page">
        <BackBar fallback="/cua-toi" />
        <p>Chị nhận khoá học trước, rồi quay lại đây nhập mã đơn nhé.</p>
        <Button onClick={() => navigate('/')}>Nhận khoá học</Button>
      </Page>
    )
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (code.trim().length < 4) {
      setError('Mã đơn chưa đủ, chị kiểm tra lại giúp Cô nhé.')
      return
    }
    setBusy(true)
    track('claim_submit')
    try {
      const res = await api.claimOrder(code.trim())
      setSession(res.session)
      setResult(res.status)
      setCode('')
      void refreshMe()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Có lỗi, chị thử lại giúp Cô nhé.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page className="page">
      <BackBar fallback="/cua-toi" />
      <form className="form" onSubmit={submit}>
        <h2>Nhập mã đơn</h2>
        <Input
          label="Mã đơn"
          type="text"
          autoCapitalize="characters"
          autoComplete="off"
          placeholder="Ví dụ: 42308"
          helperText="TikTok/Shopee: xem trong app sàn · Facebook: số in trên phiếu giao hàng"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        {error && <div className="error" role="alert">{error}</div>}
        {result === 'da_khop' && <div className="ok">Cô đã ghép được đơn của chị. Cảm ơn chị!</div>}
        {result === 'cho_duyet' && <div className="ok">Cô Hạ đang kiểm tra đơn của chị, sẽ báo trong vòng 24 giờ.</div>}
        <Button htmlType="submit" fullWidth loading={busy}>
          Gửi mã đơn
        </Button>
      </form>
    </Page>
  )
}
