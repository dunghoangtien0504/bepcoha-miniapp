import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { Route, Routes } from 'react-router-dom'
import { AppRouter } from './router'

// Lỗi đã gặp: ZMPRouter ở chế độ production đặt basename "/zapps/<APP_ID>" → trang trắng khi chạy web dưới /m.
// Kiểm router web vẫn khớp đường dẫn /m/... kể cả khi NODE_ENV = production.
describe('AppRouter (bản web)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    cleanup()
  })

  it.each(['/m/', '/m/hoc/3'])('hiển thị đúng trang ở %s khi build production', path => {
    vi.stubEnv('NODE_ENV', 'production')
    window.history.pushState({}, '', path)
    render(
      <AppRouter>
        <Routes>
          <Route path="/" element={<div>trang-chao</div>} />
          <Route path="/hoc/:no" element={<div>trang-bai</div>} />
        </Routes>
      </AppRouter>,
    )
    expect(screen.getByText(path === '/m/' ? 'trang-chao' : 'trang-bai')).toBeTruthy()
  })
})
