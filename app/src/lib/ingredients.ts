// Gộp nguyên liệu của nhiều món thành 1 danh sách đi chợ: đọc định lượng ("800g", "1/2 thìa cà phê", "50–80ml"),
// nhân theo số người ăn, gộp món trùng, xếp theo quầy, ước tính giá theo bảng Co.op Online (src/weekly.ts PRICES).
import type { Recipe } from '../recipes'

export type ShopGroup = 'thit_ca' | 'trung_dau' | 'rau_cu' | 'gia_vi_tuoi' | 'gia_vi_kho' | 'haco'

export interface Qty {
  amount: number | null
  /** Đơn vị chuẩn: g, ml, hoặc đơn vị đếm (quả, củ, tép, bìa, bó, con, cây, nắm, tai, bát, thìa canh, thìa cà phê). */
  unit: string
}

const UNITS = ['thìa cà phê', 'thìa canh', 'kg', 'g', 'lít', 'ml', 'quả', 'củ', 'tép', 'bìa', 'bó', 'con', 'cây', 'nắm', 'tai', 'bát', 'gói', 'chai', 'hũ']

function num(s: string): number | null {
  const t = s.trim().replace(',', '.')
  const f = t.match(/^(\d+)\/(\d+)$/)
  if (f) return Number(f[1]) / Number(f[2])
  const n = Number(t)
  return Number.isFinite(n) ? n : null
}

/** "800g" → 800 g; "1 lít" → 1000 ml; "50–80ml" → 80 ml (lấy số lớn để không thiếu); "một ít" → không có số. */
export function parseQty(raw: string | undefined): Qty {
  const s = (raw ?? '').trim().toLowerCase()
  if (!s) return { amount: null, unit: '' }
  const m = s.match(/^([\d.,/]+)(?:\s*[–-]\s*([\d.,/]+))?\s*(.*)$/)
  if (!m) return { amount: null, unit: s }
  const a = num(m[2] ?? m[1])
  const rest = m[3].trim()
  const unit = UNITS.find(u => rest === u || rest.startsWith(u + ' ') || rest.startsWith(u + '(')) ?? rest
  if (a === null) return { amount: null, unit }
  if (unit === 'kg') return { amount: a * 1000, unit: 'g' }
  if (unit === 'lít') return { amount: a * 1000, unit: 'ml' }
  return { amount: a, unit }
}

export interface Canon {
  label: string
  group: ShopGroup
}

/** Tên chuẩn của nguyên liệu (bỏ "hoặc …", gộp tên gần nhau). Thứ tự quan trọng: khớp cụ thể trước. */
const ALIASES: [RegExp, string, ShopGroup][] = [
  [/bếp cô hạ/, '', 'haco'],
  [/ba chỉ|ba rọi|thịt nách/, 'thịt ba chỉ', 'thit_ca'],
  [/nạc băm|nạc vai băm|thịt băm|heo xay/, 'thịt heo xay', 'thit_ca'],
  [/nạc vai/, 'thịt nạc vai', 'thit_ca'],
  [/sườn/, 'sườn non', 'thit_ca'],
  [/thịt bò|bò thăn|bò đùi/, 'thịt bò', 'thit_ca'],
  [/thịt gà luộc/, 'thịt gà luộc (dùng gà luộc còn hoặc mua thêm)', 'thit_ca'],
  [/thịt gà ta/, 'thịt gà (đùi, cánh)', 'thit_ca'],
  [/gà ta|gà mái/, 'gà ta', 'thit_ca'],
  [/thịt xá xíu/, 'thịt xá xíu (nấu từ món xá xíu)', 'thit_ca'],
  [/giò sống/, 'giò sống', 'thit_ca'],
  [/^cá |cá lóc|cá basa|cá diêu hồng/, 'cá basa (hoặc cá lóc)', 'thit_ca'],
  [/tôm/, 'tôm', 'thit_ca'],
  [/trứng vịt/, 'trứng vịt', 'trung_dau'],
  [/trứng gà/, 'trứng gà', 'trung_dau'],
  [/đậu phụ/, 'đậu phụ', 'trung_dau'],
  [/rau muống/, 'rau muống', 'rau_cu'],
  [/cải ngọt|cải cúc/, 'cải ngọt', 'rau_cu'],
  [/bắp cải/, 'bắp cải', 'rau_cu'],
  [/bí đao/, 'bí đao', 'rau_cu'],
  [/cà chua/, 'cà chua', 'rau_cu'],
  [/hành tây/, 'hành tây', 'rau_cu'],
  [/cà rốt/, 'cà rốt', 'rau_cu'],
  [/dứa|thơm\)/, 'dứa (thơm)', 'rau_cu'],
  [/đậu bắp/, 'đậu bắp', 'rau_cu'],
  [/đậu que/, 'đậu que', 'rau_cu'],
  [/mồng tơi/, 'rau mồng tơi', 'rau_cu'],
  [/giá đỗ/, 'giá đỗ', 'rau_cu'],
  [/nấm/, 'nấm (rơm hoặc đùi gà)', 'rau_cu'],
  [/mộc nhĩ/, 'mộc nhĩ', 'rau_cu'],
  [/đậu hà lan/, 'đậu Hà Lan', 'rau_cu'],
  [/dưa leo/, 'dưa leo', 'rau_cu'],
  [/^rau củ, thịt/, 'rau củ để trộn nộm (dưa leo, cà rốt, bắp cải…)', 'rau_cu'],
  [/bạc hà|dọc mùng/, 'dọc mùng (bạc hà)', 'rau_cu'],
  [/rau ngổ|ngò gai|rau răm|rau mùi|rau thơm|lá chanh|lá chuối|rau sống/, '', 'rau_cu'],
  [/cốm/, 'cốm', 'rau_cu'],
  [/cơm nguội/, 'cơm nguội', 'gia_vi_kho'],
  [/hành tím/, 'hành tím', 'gia_vi_tuoi'],
  [/hành lá/, 'hành lá', 'gia_vi_tuoi'],
  [/tỏi phi/, 'tỏi', 'gia_vi_tuoi'],
  [/tỏi/, 'tỏi', 'gia_vi_tuoi'],
  [/gừng/, 'gừng', 'gia_vi_tuoi'],
  [/sả/, 'sả', 'gia_vi_tuoi'],
  [/ớt/, 'ớt', 'gia_vi_tuoi'],
  [/chanh/, 'chanh', 'gia_vi_tuoi'],
  [/me chua/, 'me chua', 'gia_vi_tuoi'],
  [/nước dừa/, 'nước dừa', 'gia_vi_tuoi'],
  [/đậu phộng/, 'đậu phộng rang', 'gia_vi_kho'],
  [/hành phi/, 'hành phi', 'gia_vi_kho'],
  [/nước mắm|đường|muối|tiêu|dầu ăn|hạt nêm|nước màu|giấm|tương cà|dầu hào|bột năng|bột ngô|nước tương|mè|nước đá/, '', 'gia_vi_kho'],
]

/** Tách "Hành lá, rau mùi, mè rang" thành từng thứ; bỏ phần "hoặc …". */
export function splitNames(name: string): string[] {
  return name
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

export function canon(name: string): Canon {
  // Lấy lựa chọn đầu tiên: "thịt nạc vai hoặc ba chỉ" là nạc vai.
  const n = name.toLowerCase().split(' hoặc ')[0]
  for (const [re, label, group] of ALIASES) {
    if (re.test(n)) return { label: label || n, group }
  }
  return { label: n, group: 'rau_cu' }
}

export interface Line {
  id: string
  label: string
  group: ShopGroup
  amount: number | null
  unit: string
  /** Món dùng thứ này. */
  dishes: string[]
}

const roundAmount = (a: number, unit: string) => {
  if (unit === 'g' || unit === 'ml') return a >= 500 ? Math.ceil(a / 50) * 50 : Math.ceil(a / 10) * 10
  if (unit === 'con' || unit === 'bó') return Math.ceil(a)
  if (unit.startsWith('thìa')) return Math.ceil(a * 2) / 2
  return Math.ceil(a * 2) / 2 // quả, củ, tép, bìa… làm tròn lên nửa
}

/** Gộp nguyên liệu các món (cho `people` người). Mỗi món được nấu 1 lần. */
export function mergeIngredients(recipes: Recipe[], people: number): Line[] {
  const map = new Map<string, Line>()
  for (const r of recipes) {
    const factor = people / r.servings
    for (const ing of r.ingredients) {
      const q = parseQty(ing.qty)
      const names = q.amount === null && !ing.qty ? splitNames(ing.name) : [ing.name]
      for (const nm of names) {
        const c = canon(nm)
        if (c.group === 'haco') continue // sốt Bếp Cô Hạ: liệt kê riêng (hacoProducts)
        const id = `${c.label}|${q.amount === null ? '' : q.unit}`
        const prev = map.get(id)
        const add = q.amount === null ? null : q.amount * factor
        if (prev) {
          prev.amount = prev.amount === null || add === null ? prev.amount ?? add : prev.amount + add
          if (!prev.dishes.includes(r.title)) prev.dishes.push(r.title)
        } else {
          map.set(id, { id, label: c.label, group: c.group, amount: add, unit: q.amount === null ? '' : q.unit, dishes: [r.title] })
        }
      }
    }
  }
  const out = [...map.values()].map(l => (l.amount === null ? l : { ...l, amount: roundAmount(l.amount, l.unit) }))
  return out.sort((a, b) => a.label.localeCompare(b.label, 'vi'))
}

/** "1200 g" → "1,2kg"; "1500 ml" → "1,5 lít"; "2 thìa canh". Không có lượng → "một ít". */
export function formatAmount(l: Pick<Line, 'amount' | 'unit'>): string {
  if (l.amount === null) return 'một ít'
  const v = (n: number) => String(Math.round(n * 100) / 100).replace('.', ',')
  if (l.unit === 'g') return l.amount >= 1000 ? `${v(l.amount / 1000)}kg` : `${v(l.amount)}g`
  if (l.unit === 'ml') return l.amount >= 1000 ? `${v(l.amount / 1000)} lít` : `${v(l.amount)}ml`
  return `${v(l.amount)} ${l.unit}`
}

/** Sốt Bếp Cô Hạ mà các món cần (để hiện nút thêm vào giỏ). */
export function hacoProducts(recipes: Recipe[]): string[] {
  const out = new Set<string>()
  for (const r of recipes) for (const i of r.ingredients) if (/bếp cô hạ/i.test(i.name)) out.add(i.name)
  return [...out]
}
