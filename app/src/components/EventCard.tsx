import { useNavigate } from 'zmp-ui'
import type { MiniEvent } from '../api/types'
import { asset } from '../content'
import { EVENT_KINDS, countdown, eventWhen } from '../lib/eventFormat'

export function EventCard({ event, compact = false }: { event: MiniEvent; compact?: boolean }) {
  const navigate = useNavigate()
  const k = EVENT_KINDS[event.kind] ?? EVENT_KINDS.khac
  const cd = countdown(event)
  return (
    <button className={`event-card ${compact ? 'is-compact' : ''}`} onClick={() => navigate(`/su-kien/${event.slug}`)}>
      {event.image ? <img src={asset(event.image)} alt="" loading="lazy" /> : <span className="event-emoji" aria-hidden="true">{k.emoji}</span>}
      <span className="event-body">
        <span className="event-tags">
          <span className="badge">{k.label}</span>
          {event.status === 'huy' ? <span className="badge badge-new">Đã huỷ</span> : cd !== 'Đã diễn ra' && <span className="badge badge-new">{cd}</span>}
        </span>
        <b>{event.title}</b>
        <span className="muted small block">{eventWhen(event.starts_at)}{event.location ? ` · ${event.location}` : ' · Online'}</span>
        {(event.reminded || event.booked) && <span className="small event-mine">{event.booked ? '✓ Đã giữ chỗ' : '🔔 Sẽ nhắc chị'}</span>}
      </span>
    </button>
  )
}
