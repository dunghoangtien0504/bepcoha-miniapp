import { useEffect, useState } from 'react'
import { Button, Page, useNavigate } from 'zmp-ui'
import type { MiniNotification, NotificationsRes } from '../api/types'
import { BackBar } from '../components/BackBar'
import { countdown, eventWhen } from '../lib/eventFormat'
import { dayMonth } from '../lib/format'
import { useMini } from '../state'

const KIND_EMOJI: Record<MiniNotification['kind'], string> = {
  su_kien: '📣', cong_thuc: '🍲', uu_dai: '🎁', don_hang: '📦', khoe_mon: '📸', he_thong: '🔔',
}

// Hộp thư: tin của Bếp (nhân viên soạn trên CRM) + nhắc sự kiện khách đã bấm "Nhắc tôi" sắp diễn ra trong 24 giờ.
export function NotificationsPage() {
  const { api, session, refreshMe, track } = useMini()
  const navigate = useNavigate()
  const [data, setData] = useState<NotificationsRes | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    api.notifications().then(setData, () => setError(true))
  }, [api])

  const open = async (n: MiniNotification) => {
    track('notification_open', { id: n.id, kind: n.kind })
    if (!n.read && session) {
      setData(d => d && { ...d, notifications: d.notifications.map(x => (x.id === n.id ? { ...x, read: true } : x)), unread: Math.max(0, d.unread - 1) })
      void api.readNotifications({ ids: [n.id] }).then(() => refreshMe())
    }
    if (n.link) navigate(n.link)
  }

  const readAll = async () => {
    await api.readNotifications({ all: true })
    setData(d => d && { ...d, notifications: d.notifications.map(x => ({ ...x, read: true })), unread: d.reminders.length })
    void refreshMe()
  }

  const hasUnread = !!data?.notifications.some(n => !n.read)
  return (
    <Page className="page">
      <BackBar fallback="/" />
      <div className="title-row">
        <h2>Thông báo</h2>
        {session && hasUnread && (
          <Button size="small" variant="tertiary" onClick={readAll}>
            Đã đọc hết
          </Button>
        )}
      </div>
      {error && <p className="error">Chưa tải được thông báo.</p>}
      {data?.reminders.map(r => (
        <button key={r.slug} className={`card notif-row notif-remind ${r.within_hour ? 'is-soon' : ''}`} onClick={() => navigate(`/su-kien/${r.slug}`)}>
          <span className="notif-emoji">⏰</span>
          <span>
            <b>{r.title}</b>
            <span className="small block">
              {countdown({ starts_at: r.starts_at, ends_at: null })} · {eventWhen(r.starts_at)}
            </span>
          </span>
        </button>
      ))}
      {data?.notifications.length === 0 && !data.reminders.length && <p className="muted">Chưa có thông báo nào.</p>}
      {data?.notifications.map(n => (
        <button key={n.id} className={`card notif-row ${n.read ? '' : 'is-unread'}`} onClick={() => open(n)}>
          <span className="notif-emoji">{KIND_EMOJI[n.kind] ?? '🔔'}</span>
          <span>
            <b>{n.title}</b>
            {n.body && <span className="muted small block">{n.body}</span>}
            <span className="muted small block">{dayMonth(n.published_at)}</span>
          </span>
          {!n.read && <span className="dot" aria-label="Chưa đọc" />}
        </button>
      ))}
      {!session && <p className="muted small">Đăng ký số điện thoại để nhận tin riêng và nhắc sự kiện.</p>}
    </Page>
  )
}
