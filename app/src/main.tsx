import 'zmp-ui/zaui.css'
import './styles.css'
import { createRoot } from 'react-dom/client'
import { HacoMiniApp } from './app'

// Font icon của zmp-ui tải từ CDN Zalo. Chưa tải xong (mạng chậm, bị chặn) thì ẩn chữ "zi_home"… thay vì hiện ra.
document.fonts?.load('24px zaui-icons').then(
  f => f.length && document.documentElement.classList.add('icons-ready'),
  () => undefined,
)

createRoot(document.getElementById('app')!).render(<HacoMiniApp />)
