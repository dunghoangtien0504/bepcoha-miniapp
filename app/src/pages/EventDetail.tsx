import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Page, useNavigate, useSnackbar } from 'zmp-ui'
import { ApiError, type MiniEvent } from '../api/types'
import { BackBar } from '../components/BackBar'
import { LINKS, asset } from '../content'
import { EVENT_KINDS, countdown, eventIcs, eventWhen } from '../lib/eventFormat'
import { IS_ZALO, platform } from '../platform'
import { useMini } from '../state'

export function EventDetailPage() {
  const { slug = '' } = useParams()
  const { api, session, track } = useMini()
  const navigate = useNavigate()
  const { openSnackbar } = useSnackbar()
  const [event, setEvent] = useState<MiniEvent | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [, tick] = useState(0)

  useEffect(() => {
    track('event_open', { slug })
    api.event(slug).then(
      r => setEvent(r.event),
      e => setError(e instanceof ApiError ? e.message : 'Chưa tải được sự kiện.'),
    )
  }, [api, slug, track])

  // Đếm ngược cập nhật mỗi phút.
  useEffect(() => {
    const id = setInterval(() => tick(n => n + 1), 60_000)
    return () => clearInterval(id)
  }, [])

  if (error) {
    return (
      <Page className="page">
        <BackBar fallback="/su-kien" />
        <p className="error">{error}</p>
      </Page>
    )
  }
  if (!event) return <Page className="page"><p className="muted">Đang tải…</p></Page>

  const k = EVENT_KINDS[event.kind] ?? EVENT_KINDS.khac
  const cd = countdown(event)
  const open = event.status === 'cong_bo' && cd !== 'Đã diễn ra' && cd !== 'Đang diễn ra'
  const live = event.status === 'cong_bo' && cd === 'Đang diễn ra'

  const remind = async (kind: 'nhac' | 'giu_cho', on: boolean) => {
    if (!session) {
      navigate(`/dang-ky?next=${encodeURIComponent('/su-kien/' + slug)}`)
      return
    }
    setBusy(true)
    try {
      const r = await api.remindEvent(slug, kind, on)
      setEvent(r.event)
      track('event_remind', { slug, kind, on })
      openSnackbar({
        type: 'success',
        duration: 2500,
        text: on ? (kind === 'giu_cho' ? 'Cô đã giữ chỗ cho chị. Cô sẽ nhắc trước giờ diễn ra.' : 'Cô sẽ nhắc chị trong mục Thông báo trước giờ diễn ra.') : 'Đã huỷ.',
      })
    } catch (e) {
      openSnackbar({ type: 'error', duration: 3000, text: e instanceof ApiError ? e.message : 'Chưa lưu được, chị thử lại nhé.' })
    } finally {
      setBusy(false)
    }
  }

  const addToCalendar = () => {
    const url = (LINKS.publicUrl || window.location.origin + import.meta.env.BASE_URL) + `su-kien/${event.slug}`
    const blob = new Blob([eventIcs(event, url)], { type: 'text/calendar;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${event.slug}.ics`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    track('event_calendar', { slug })
  }

  return (
    <Page className="page">
      <BackBar fallback="/su-kien" />
      {event.image && <img className="event-hero" src={asset(event.image)} alt="" />}
      <div className="event-tags">
        <span className="badge">
          {k.emoji} {k.label}
        </span>
        {event.status === 'huy' ? <span className="badge badge-new">Đã huỷ</span> : <span className="badge badge-new">{cd}</span>}
      </div>
      <h2>{event.title}</h2>
      <div className="card event-facts">
        <div>🗓 {eventWhen(event.starts_at)}</div>
        <div>📍 {event.location || 'Online'}</div>
        {event.capacity !== null && <div>🪑 Còn {event.seats_left} / {event.capacity} chỗ</div>}
      </div>
      {event.summary && <p>{event.summary}</p>}
      {event.body && <p className="muted pre-line">{event.body}</p>}

      {open && (
        <div className="event-actions">
          {event.capacity !== null &&
            (event.booked ? (
              <Button fullWidth variant="secondary" loading={busy} onClick={() => remind('giu_cho', false)}>
                ✓ Đã giữ chỗ — huỷ chỗ
              </Button>
            ) : (
              <Button fullWidth loading={busy} disabled={event.seats_left === 0} onClick={() => remind('giu_cho', true)}>
                {event.seats_left === 0 ? 'Đã đủ chỗ' : 'Giữ chỗ cho tôi'}
              </Button>
            ))}
          {!event.booked &&
            (event.reminded ? (
              <Button fullWidth variant="secondary" loading={busy} onClick={() => remind('nhac', false)}>
                🔔 Sẽ nhắc chị — tắt nhắc
              </Button>
            ) : (
              <Button fullWidth variant={event.capacity !== null ? 'secondary' : 'primary'} loading={busy} onClick={() => remind('nhac', true)}>
                🔔 Nhắc tôi
              </Button>
            ))}
          {!IS_ZALO && (
            <Button fullWidth variant="tertiary" onClick={addToCalendar}>
              Thêm vào lịch điện thoại
            </Button>
          )}
        </div>
      )}
      {(live || open) && event.join_url && (
        <Button
          fullWidth
          variant={live ? 'primary' : 'tertiary'}
          onClick={() => {
            track('event_join', { slug })
            void platform.openExternal(event.join_url)
          }}
        >
          {live ? 'Vào xem ngay' : 'Link tham gia'}
        </Button>
      )}
    </Page>
  )
}
