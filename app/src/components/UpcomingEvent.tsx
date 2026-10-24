import { useEffect, useState } from 'react'
import type { MiniEvent } from '../api/types'
import { useMini } from '../state'
import { EventCard } from './EventCard'

/** Thẻ "Sắp diễn ra" trên trang chủ: sự kiện gần nhất. Không có thì ẩn. */
export function UpcomingEvent() {
  const { api } = useMini()
  const [event, setEvent] = useState<MiniEvent | null>(null)
  useEffect(() => {
    let alive = true
    api.listEvents('sap_toi').then(
      r => alive && setEvent(r.events[0] ?? null),
      () => undefined,
    )
    return () => {
      alive = false
    }
  }, [api])
  if (!event) return null
  return (
    <>
      <div className="section-title">Sắp diễn ra</div>
      <EventCard event={event} compact />
    </>
  )
}
