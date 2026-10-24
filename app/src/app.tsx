import { useState } from 'react'
import { Route, useLocation } from 'react-router-dom'
import { AnimationRoutes, App, BottomNavigation, Icon, SnackbarProvider, useNavigate } from 'zmp-ui'
import { AppRouter } from './router'
import { CartProvider } from './cart'
import { ShoppingProvider } from './shopping'
import { ShoppingPage } from './pages/Shopping'
import { ChatSheet, chatOptions } from './components/ChatSheet'
import { CartPage } from './pages/Cart'
import { ClaimOrderPage } from './pages/ClaimOrder'
import { CoursePage } from './pages/Course'
import { HomePage } from './pages/Home'
import { IdentifyPage } from './pages/Identify'
import { LessonPage } from './pages/Lesson'
import { MePage } from './pages/Me'
import { NotebookPage } from './pages/Notebook'
import { OrderDonePage } from './pages/OrderDone'
import { OrdersPage } from './pages/Orders'
import { EventDetailPage } from './pages/EventDetail'
import { EventsPage } from './pages/Events'
import { NotificationsPage } from './pages/Notifications'
import { PointsPage } from './pages/Points'
import { RecipePage } from './pages/Recipe'
import { RecipesPage } from './pages/Recipes'
import { ShopPage } from './pages/Shop'
import { WelcomePage } from './pages/Welcome'
import { MiniProvider, useMini } from './state'

// Thanh dưới 5 tab (học Mini App của group học): Trang chủ · Công thức · Zalo OA · Đặt hàng · Của tôi.
const TABS: { key: string; path: string | null; label: string; icon: string }[] = [
  { key: 'home', path: '/', label: 'Trang chủ', icon: 'zi-home' },
  { key: 'recipes', path: '/cong-thuc', label: 'Công thức', icon: 'zi-note' },
  { key: 'oa', path: null, label: 'Zalo OA', icon: 'zi-chat' },
  { key: 'shop', path: '/dat-hang', label: 'Đặt hàng', icon: 'zi-list-1' },
  { key: 'me', path: '/cua-toi', label: 'Của tôi', icon: 'zi-user' },
]

function activeTab(pathname: string): string {
  if (pathname.startsWith('/cong-thuc') || pathname.startsWith('/so-tay') || pathname.startsWith('/di-cho')) return 'recipes'
  if (pathname.startsWith('/dat-hang') || pathname.startsWith('/gio-hang') || pathname.startsWith('/don-hang')) return 'shop'
  if (pathname.startsWith('/cua-toi') || pathname.startsWith('/hat-com') || pathname.startsWith('/nhap-ma-don')) return 'me'
  return 'home'
}

function Shell() {
  const { ready, bootError } = useMini()
  const location = useLocation()
  const navigate = useNavigate()
  const [chatOpen, setChatOpen] = useState(false)

  if (!ready) return <div className="boot">Đang mở Bếp Cô Hạ…</div>
  if (bootError) return <div className="boot">{bootError}</div>

  const tabs = chatOptions().length ? TABS : TABS.filter(t => t.key !== 'oa')
  const hideBar = location.pathname.startsWith('/dang-ky')
  return (
    <>
      <AnimationRoutes>
        <Route path="/" element={<HomePage />} />
        <Route path="/khoa-hoc" element={<WelcomePage />} />
        <Route path="/dang-ky" element={<IdentifyPage />} />
        <Route path="/hoc" element={<CoursePage />} />
        <Route path="/hoc/:no" element={<LessonPage />} />
        <Route path="/cong-thuc" element={<RecipesPage />} />
        <Route path="/cong-thuc/:slug" element={<RecipePage />} />
        <Route path="/so-tay" element={<NotebookPage />} />
        <Route path="/di-cho" element={<ShoppingPage />} />
        <Route path="/su-kien" element={<EventsPage />} />
        <Route path="/su-kien/:slug" element={<EventDetailPage />} />
        <Route path="/thong-bao" element={<NotificationsPage />} />
        <Route path="/hat-com" element={<PointsPage />} />
        <Route path="/dat-hang" element={<ShopPage />} />
        <Route path="/gio-hang" element={<CartPage />} />
        <Route path="/don-hang" element={<OrdersPage />} />
        <Route path="/don-hang/:ref" element={<OrderDonePage />} />
        <Route path="/nhap-ma-don" element={<ClaimOrderPage />} />
        <Route path="/cua-toi" element={<MePage />} />
      </AnimationRoutes>
      <ChatSheet visible={chatOpen} onClose={() => setChatOpen(false)} />
      {!hideBar && (
        <BottomNavigation
          fixed
          activeKey={activeTab(location.pathname)}
          onChange={key => {
            const t = TABS.find(x => x.key === key)
            if (!t) return
            if (t.path === null) setChatOpen(true)
            else navigate(t.path, { animate: false })
          }}
        >
          {tabs.map(t => (
            <BottomNavigation.Item key={t.key} label={t.label} icon={<Icon icon={t.icon as never} />} activeIcon={<Icon icon={t.icon as never} />} />
          ))}
        </BottomNavigation>
      )}
    </>
  )
}

export function HacoMiniApp() {
  return (
    <App>
      <SnackbarProvider>
        <AppRouter>
          <MiniProvider>
            <CartProvider>
              <ShoppingProvider>
                <Shell />
              </ShoppingProvider>
            </CartProvider>
          </MiniProvider>
        </AppRouter>
      </SnackbarProvider>
    </App>
  )
}
