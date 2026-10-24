import { useEffect, useState } from 'react'
import { Page } from 'zmp-ui'
import type { MiniEvent } from '../api/types'
import { BackBar } from '../components/BackBar'
import { EventCard } from '../components/EventCard'
import { useMini } from '../state'

// Sự kiện: livestream, workshop tại bếp, thử thách tuần, mùa cốm, lễ Tết. Nhân viên tạo trên CRM.
export function EventsPage() {
  const { api } = useMini()
  const [tab, setTab] = useState<'sap_toi' | 'da_qua'>('sap_toi')
  const [events, setEvents] = useState<MiniEvent[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let alive = true
    setEvents(null)
    setError(false)
    api.listEvents(tab).then(
      r => alive && setEvents(r.events),
      () => alive && setError(true),
    )
    return () => {
      alive = false
    }
  }, [api, tab])

  return (
    <Page className="page">
      <BackBar fallback="/" />
      <h2>Sự kiện</h2>
      <div className="chips">
        <button className={`chip ${tab === 'sap_toi' ? 'on' : ''}`} onClick={() => setTab('sap_toi')}>
          Sắp diễn ra
        </button>
        <button className={`chip ${tab === 'da_qua' ? 'on' : ''}`} onClick={() => setTab('da_qua')}>
          Đã qua
        </button>
      </div>
      {error && <p className="error">Chưa tải được sự kiện, chị thử lại sau nhé.</p>}
      {!events && !error && <p className="muted">Đang tải…</p>}
      {events?.length === 0 && (
        <p className="muted">{tab === 'sap_toi' ? 'Chưa có sự kiện mới. Cô Hạ sẽ báo ở mục Thông báo khi có nhé.' : 'Chưa có sự kiện nào.'}</p>
      )}
      <div className="event-list">
        {events?.map(e => (
          <EventCard key={e.slug} event={e} />
        ))}
      </div>
    </Page>
  )
}
