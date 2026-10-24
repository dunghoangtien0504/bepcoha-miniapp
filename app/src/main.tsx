import 'zmp-ui/zaui.css'
import './styles.css'
import { createRoot } from 'react-dom/client'
import { HacoMiniApp } from './app'

createRoot(document.getElementById('app')!).render(<HacoMiniApp />)
