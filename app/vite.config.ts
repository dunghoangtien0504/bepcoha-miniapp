import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import zaloMiniApp from 'zmp-vite-plugin'

// 3 chế độ build:
//  - mặc định (web): chạy dưới /m của Haco-OS, gọi /api/mini/* cùng origin (dev: proxy sang Haco-OS-v2).
//  - mock: như web nhưng dùng API giả trong trình duyệt, để dựng giao diện khi API chưa có.
//  - zalo: đóng gói Zalo Mini App (thư mục www), dùng zmp-sdk.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const zalo = mode === 'zalo'
  return {
    base: zalo ? '' : '/m/',
    plugins: [react(), ...(zalo ? [zaloMiniApp({ app: { title: 'Bếp Cô Hạ', headerColor: '#2f5d3a', textColor: 'white' } })] : [])],
    server: {
      port: 5173,
      strictPort: true,
      proxy:
        mode === 'mock'
          ? undefined
          : {
              '/api': {
                target: env.HACO_API_ORIGIN || 'http://localhost:3030',
                // Server kiểm Origin trùng host (chống CSRF). Qua proxy dev, báo host gốc của trình duyệt bằng x-forwarded-host.
                configure: proxy => {
                  proxy.on('proxyReq', (proxyReq, req) => {
                    if (req.headers.host) proxyReq.setHeader('x-forwarded-host', req.headers.host)
                  })
                },
              },
            },
    },
    build: { outDir: zalo ? 'www' : 'dist', emptyOutDir: true },
    test: { environment: 'jsdom', include: ['src/**/*.test.ts', 'src/**/*.test.tsx'] },
  }
})
