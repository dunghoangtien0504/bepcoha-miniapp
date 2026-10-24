import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, Checkbox, Input, Page, useNavigate } from 'zmp-ui'
import { ApiError } from '../api/types'
import { CONSENT } from '../content'
import { normalizeVnPhone } from '../lib/phone'
import { IS_ZALO, platform } from '../platform'
import { useMini } from '../state'

// ② Xin SĐT đúng lúc khách bấm nhận quà, nói rõ mục đích (chính sách Mini App 3.3.4).
// Ô đồng ý KHÔNG tick sẵn; không tick vẫn được học (đồng ý phải tự nguyện, không đổi lấy quà).
export function IdentifyPage() {
  const { api, anonId, batch, onIdentified, track } = useMini()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  // Chỉ nhận đường dẫn nội bộ ("/..."), không nhận "//host" hay link ngoài (chống chuyển hướng mở).
  const nextRaw = params.get('next') || '/'
  const next = /^\/(?![/\\])/.test(nextRaw) ? nextRaw : '/'
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    setError(null)
    const consents = agree ? [{ channel: 'zalo_oa' as const, purpose: 'cham_soc_sau_mua' as const, text_version: CONSENT.textVersion }, { channel: 'dien_thoai' as const, purpose: 'cham_soc_sau_mua' as const, text_version: CONSENT.textVersion }] : []
    let req: Parameters<typeof api.identify>[0]
    if (IS_ZALO) {
      try {
        const m = await platform.identify()
        if (m.kind !== 'zalo') return
        req = { anon_id: anonId, batch_code: batch?.code, zalo_phone_token: m.phoneToken, zalo_access_token: m.accessToken, consents }
      } catch {
        setError('Cô cần số điện thoại để gửi bài học và giữ ưu đãi cho chị. Chị bấm lại và chọn “Cho phép” nhé.')
        return
      }
    } else {
      const normalized = normalizeVnPhone(phone)
      if (!normalized) {
        setError('Số điện thoại chưa đúng, chị kiểm tra lại giúp Cô nhé.')
        return
      }
      req = { anon_id: anonId, batch_code: batch?.code, phone: normalized, name: name.trim() || undefined, consents }
    }
    setBusy(true)
    track('identify_submit', { consent: agree })
    try {
      const res = await api.identify(req)
      await onIdentified(res)
      navigate(next, { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Có lỗi, chị thử lại giúp Cô nhé.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Page className="page">
      <form className="form" onSubmit={submit}>
        <h2>Nhận khoá học</h2>
        <p className="muted">
          Cô cần số điện thoại để mở bài học mỗi ngày cho chị và giữ ưu đãi đúng cho số này. Cô không gửi tin quảng cáo nếu chị không đồng ý ở ô bên dưới.
        </p>
        {!IS_ZALO && (
          <>
            <Input label="Số điện thoại" type="text" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" value={phone} onChange={e => { setPhone(e.target.value); setError(null) }} />
            <Input label="Tên chị (không bắt buộc)" type="text" autoComplete="given-name" placeholder="Ví dụ: Lan" value={name} onChange={e => setName(e.target.value)} />
          </>
        )}
        <label className="consent">
          <Checkbox value="consent" checked={agree} onChange={() => setAgree(a => !a)} />
          <span>{CONSENT.text}</span>
        </label>
        {error && <div className="error" role="alert">{error}</div>}
        <Button htmlType="submit" fullWidth loading={busy}>
          {IS_ZALO ? 'Dùng số điện thoại Zalo của tôi' : 'Mở bài học đầu tiên'}
        </Button>
      </form>
    </Page>
  )
}
