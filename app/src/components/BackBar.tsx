import { useNavigate } from 'zmp-ui'

/** Về trang trước; mở thẳng từ link (không có trang trước trong app) thì về `fallback`. */
export function useBack(fallback: string) {
  const navigate = useNavigate()
  return () => {
    const idx = (window.history.state as { idx?: number } | null)?.idx ?? 0
    if (idx > 0) navigate(-1)
    else navigate(fallback, { replace: true })
  }
}

// Nút quay lại cho trang con: bản web không có thanh tiêu đề của Zalo, khách cần đường lùi rõ ràng.
export function BackBar({ fallback, overlay = false }: { fallback: string; overlay?: boolean }) {
  const back = useBack(fallback)
  return (
    <button className={overlay ? 'back-overlay' : 'back-bar'} onClick={back} aria-label="Quay lại">
      ‹{overlay ? '' : ' Quay lại'}
    </button>
  )
}
