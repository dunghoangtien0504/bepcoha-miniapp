import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from 'zmp-ui'
import { formatClock, remainingSec } from '../lib/timer'
import { platform } from '../platform'

interface TimerState {
  label: string
  endsAt: number
  totalSec: number
}

export interface CookTimerApi {
  running: boolean
  done: boolean
  left: number
  state: TimerState | null
  start(label: string, minutes: number): void
  addMinute(): void
  stop(): void
}

/** Hẹn giờ trong chế độ nấu: một đồng hồ chạy suốt khi khách chuyển sang bước khác. Hết giờ thì rung + kêu "bíp". */
export function useCookTimer(): CookTimerApi {
  const [state, setState] = useState<TimerState | null>(null)
  const [now, setNow] = useState(Date.now())
  const [done, setDone] = useState(false)
  const audio = useRef<AudioContext | null>(null)

  useEffect(() => {
    if (!state || done) return
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [state, done])

  const left = state ? remainingSec(state.endsAt, now) : 0

  useEffect(() => {
    if (!state || done || left > 0) return
    setDone(true)
    platform.vibrate(800)
    beep(audio.current)
  }, [state, done, left])

  const start = useCallback((label: string, minutes: number) => {
    // Tạo AudioContext ngay lúc khách bấm (trình duyệt chỉ cho phát tiếng sau một thao tác của người dùng).
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (Ctx && !audio.current) audio.current = new Ctx()
    } catch {
      audio.current = null
    }
    setDone(false)
    setNow(Date.now())
    setState({ label, endsAt: Date.now() + minutes * 60_000, totalSec: minutes * 60 })
  }, [])

  return {
    running: !!state && !done,
    done,
    left,
    state,
    start,
    addMinute: () => setState(s => (s ? { ...s, endsAt: Math.max(s.endsAt, Date.now()) + 60_000, totalSec: s.totalSec + 60 } : s)),
    stop: () => {
      setState(null)
      setDone(false)
    },
  }
}

function beep(ctx: AudioContext | null) {
  if (!ctx) return
  try {
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = 880
      g.gain.value = 0.2
      o.connect(g).connect(ctx.destination)
      const t = ctx.currentTime + i * 0.45
      o.start(t)
      o.stop(t + 0.25)
    }
  } catch {
    // không phát được tiếng: vẫn còn chữ "Hết giờ" và rung
  }
}

export function CookTimer({ timer }: { timer: CookTimerApi }) {
  if (!timer.state) return null
  const pct = timer.state.totalSec ? (timer.left / timer.state.totalSec) * 100 : 0
  return (
    <div className={`cook-timer ${timer.done ? 'is-done' : ''}`} role="timer" aria-live="polite">
      <div className="cook-timer-row">
        <div>
          <div className="small">{timer.done ? 'Hết giờ!' : 'Đang hẹn giờ'}</div>
          <div className="cook-timer-label">{timer.state.label}</div>
        </div>
        <div className="cook-timer-clock">{formatClock(timer.left)}</div>
      </div>
      {!timer.done && (
        <div className="cook-timer-bar">
          <span style={{ width: `${pct}%` }} />
        </div>
      )}
      <div className="cook-timer-actions">
        {!timer.done && (
          <Button size="small" variant="tertiary" onClick={timer.addMinute}>
            +1 phút
          </Button>
        )}
        <Button size="small" variant={timer.done ? 'primary' : 'tertiary'} onClick={timer.stop}>
          {timer.done ? 'Đã xong' : 'Huỷ hẹn giờ'}
        </Button>
      </div>
    </div>
  )
}
