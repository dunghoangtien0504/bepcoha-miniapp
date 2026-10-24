// Chép bản build web (dist/) vào Haco-OS-v2/public/m — Haco-OS phục vụ Mini App ở /m, cùng origin với /api/mini/*.
// Chạy sau `npm run build`:  node scripts/copy-to-haco.mjs [đường-dẫn-Haco-OS]
import { cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = join(dirname(fileURLToPath(import.meta.url)), '..')
const haco = resolve(process.argv[2] || join(app, '../../Haco-OS-v2'))
const src = join(app, 'dist')
const dest = join(haco, 'public/m')

if (!existsSync(join(src, 'index.html'))) throw new Error('Chưa có dist/index.html — chạy npm run build trước')
if (!existsSync(join(haco, 'next.config.ts'))) throw new Error('Không thấy Haco-OS ở ' + haco)
rmSync(dest, { recursive: true, force: true })
cpSync(src, dest, { recursive: true })
console.log('Đã chép Mini App vào', dest)
