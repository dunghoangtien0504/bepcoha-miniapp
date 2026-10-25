// "Đi chợ 1 lần, nấu cả tuần": 3 thực đơn gợi ý + khách tự chọn món. Danh sách mua sinh tự động từ nguyên liệu
// các món (src/lib/ingredients.ts), nhân theo số người ăn, ước tính giá theo Co.op Online.
// Giá chép tay từ Co.op Online (cooponline.vn) ngày 25/10/2026, khu vực mặc định của trang; món đang giảm giá lấy giá gốc.
// Đơn vị đếm (củ, quả, tép…) quy ra gram theo cân nặng trung bình ghi bên cạnh — chỉ để ước tính.
// Thứ không có giá bán lẻ trên Co.op Online (cà rốt, giá đỗ, rau thơm…) thì không ước tính, không tự đoán.
// Mẹo sơ chế/bảo quản là kiến thức chung, cần Cô Hạ đọc lại.
import { formatAmount, mergeIngredients, type Line, type ShopGroup } from './lib/ingredients'
import { RECIPES, findRecipe, type Recipe } from './recipes'

export const PRICE_DATE = '25/10/2026'
export const PRICE_SOURCE = 'Co.op Online (cooponline.vn)'
export const PEOPLE_CHOICES = [2, 3, 4, 6]
export const DEFAULT_PEOPLE = 4

export interface WeekDay {
  day: string
  dishes: string[]
}

export interface Menu {
  key: string
  name: string
  hint: string
  days: WeekDay[]
}

const D = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
const week = (...pairs: [string, string][]): WeekDay[] => pairs.map((p, i) => ({ day: D[i], dishes: p }))

export const MENUS: Menu[] = [
  {
    key: 'truyen-thong',
    name: 'Cơm nhà truyền thống',
    hint: 'Đủ thịt, tôm, gà, bò; mỗi bữa 1 mặn + 1 canh hoặc rau',
    days: week(
      ['suon-xao-chua-ngot', 'rau-muong-xao-toi'],
      ['tom-rim-man-ngot', 'canh-cai-thit-bam'],
      ['ga-luoc-la-chanh', 'goi-ga-bap-cai'],
      ['thit-kho-trung', 'canh-bi-dao-tom'],
      ['thit-xa-xiu', 'nom-tron-5-phut'],
      ['bo-xao-hanh-tay', 'dau-phu-sot-ca-chua'],
      ['trung-duc-thit', 'canh-chua-ca'],
    ),
  },
  {
    key: 'tiet-kiem',
    name: 'Tiết kiệm',
    hint: 'Nhiều trứng, đậu, thịt heo; vẫn đủ chất',
    days: week(
      ['trung-duc-thit', 'canh-cai-thit-bam'],
      ['dau-phu-sot-ca-chua', 'rau-muong-xao-toi'],
      ['thit-rang-chay-canh', 'canh-bi-dao-tom'],
      ['trung-chien-hanh', 'canh-mong-toi-thit-bam'],
      ['thit-kho-trung', 'bap-cai-xao-ca-chua'],
      ['dau-phu-chien-sa-ot', 'canh-chua-ca'],
      ['thit-luoc-cham-mam', 'rau-muong-xao-toi'],
    ),
  },
  {
    key: 'thanh-dam',
    name: 'Thanh đạm, nhiều rau',
    hint: 'Ít dầu mỡ, nhiều rau, đậu, nấm',
    days: week(
      ['dau-phu-sot-ca-chua', 'rau-muong-xao-toi'],
      ['nam-kho-tieu', 'canh-bi-dao-tom'],
      ['ga-luoc-la-chanh', 'goi-ga-bap-cai'],
      ['dau-phu-chien-sa-ot', 'canh-mong-toi-thit-bam'],
      ['tom-rim-man-ngot', 'bap-cai-xao-ca-chua'],
      ['dau-que-xao-thit', 'canh-chua-ca'],
      ['cha-com', 'canh-cai-thit-bam'],
    ),
  },
]

export const findMenu = (key: string) => MENUS.find(m => m.key === key)

/** Mỗi món trong thực đơn nấu 1 lần; món lặp lại trong tuần thì nấu 2 lần. */
export function menuRecipes(m: Menu): Recipe[] {
  return m.days.flatMap(d => d.dishes).map(s => findRecipe(s)).filter((r): r is Recipe => !!r)
}

export const GROUPS: { key: ShopGroup; label: string; hint?: string }[] = [
  { key: 'thit_ca', label: '🥩 Thịt, cá, tôm' },
  { key: 'trung_dau', label: '🥚 Trứng, đậu phụ' },
  { key: 'rau_cu', label: '🥬 Rau, củ, quả' },
  { key: 'gia_vi_tuoi', label: '🧄 Hành, tỏi, gừng, gia vị tươi' },
  { key: 'gia_vi_kho', label: '🧂 Gia vị khô (nhà thường có sẵn)', hint: 'Không tính vào tiền đi chợ. Kiểm tra xem nhà còn không.' },
]

/** Giá tham khảo theo tên chuẩn (lib/ingredients.ts canon). perG = đồng/gram; perUnit = đồng/đơn vị đếm. */
export const PRICES: Record<string, { perG?: number; perMl?: number; perUnit?: Record<string, number>; ref: string }> = {
  'thịt ba chỉ': { perG: 209, ref: '209.000đ/kg · Ba rọi heo' },
  'thịt nạc vai': { perG: 165, ref: '165.000đ/kg · Nạc vai heo' },
  'thịt heo xay': { perG: 142, ref: '142.000đ/kg · Thịt heo xay' },
  'sườn non': { perG: 281, ref: '281.000đ/kg · Sườn non heo' },
  'thịt bò': { perG: 280, ref: '280.000đ/kg · Thịt đùi bò' },
  'gà ta': { perUnit: { con: 139000 }, ref: '139.000đ/con 1,1–1,3kg · Gà ta (giá gốc)' },
  'cá basa (hoặc cá lóc)': { perG: 69.9, ref: '69.900đ/kg · Cá basa bỏ đầu' },
  'tôm': { perG: 199.9, ref: '199.900đ/kg · Tôm thẻ 51–60 con' },
  'trứng vịt': { perUnit: { quả: 3700 }, ref: '22.200đ/vỉ 6 quả' },
  'trứng gà': { perUnit: { quả: 3850 }, ref: '38.500đ/vỉ 10 quả (giá gốc)' },
  'đậu phụ': { perUnit: { bìa: 6300 }, ref: '6.300đ/miếng' },
  'rau muống': { perG: 32.9, perUnit: { bó: 16450 }, ref: '32.900đ/kg (1 bó ≈ 500g)' },
  'cải ngọt': { perG: 55.3, ref: '16.600đ/gói 300g' },
  'bắp cải': { perG: 28.9, ref: '28.900đ/kg · Bắp cải trái tim' },
  'bí đao': { perG: 21.9, ref: '21.900đ/kg' },
  'cà chua': { perUnit: { quả: 4400 }, ref: '36.900đ/kg (1 quả ≈ 120g)' },
  'hành tây': { perUnit: { củ: 7600 }, ref: '38.000đ/kg (1 củ ≈ 200g)' },
  'dứa (thơm)': { perUnit: { quả: 22000 }, ref: '22.000đ/quả' },
  'đậu bắp': { perUnit: { quả: 1050 }, ref: '12.500đ/gói 200g (≈ 12 quả)' },
  'nấm (rơm hoặc đùi gà)': { perG: 200, ref: '40.000đ/gói 200g · Nấm đùi gà' },
  'hành tím': { perUnit: { củ: 1400 }, ref: '116.900đ/kg (1 củ ≈ 12g)' },
  'tỏi': { perUnit: { tép: 550, củ: 5500 }, ref: '32.900đ/gói 300g (1 tép ≈ 5g)' },
  'gừng': { perUnit: { củ: 4250 }, ref: '8.500đ/gói 100g (1 củ ≈ 50g)' },
  'hành lá': { perUnit: { cây: 1250 }, ref: '12.500đ/gói 100g (1 cây ≈ 10g)' },
  'me chua': { perG: 53, ref: '53.000đ/kg · Me vắt' },
  'rau mồng tơi': { perG: 45, ref: '13.500đ/gói 300g · Co.op Select' },
  'giò sống': { perG: 159.5, ref: '31.900đ/vỉ 200g · Co.op Select (giá gốc)' },
  'sả': { perUnit: { cây: 750 }, ref: '24.900đ/kg (1 cây ≈ 30g)' },
  'mộc nhĩ': { perUnit: { tai: 1100 }, ref: '35.400đ/gói 100g · Nấm mèo (1 tai ≈ 3g)' },
  'cà rốt': { perUnit: { củ: 6400 }, ref: '42.900đ/kg · Cà rốt Đà Lạt (1 củ ≈ 150g)' },
  'cốm': { perG: 80, ref: '80.000đ/kg · Cốm khô Bếp Cô Hạ' },
  'ớt': { perUnit: { quả: 750 }, ref: '72.500đ/kg · Ớt sừng (1 quả ≈ 10g)' },
  'chanh': { perUnit: { quả: 1200 }, ref: '23.500đ/kg · Chanh không hạt (1 quả ≈ 50g)' },
  'nước dừa': { perMl: 45, ref: '45.000đ/hộp 1L (giá gốc)' },
}

/** Tiền ước tính của 1 dòng; null = không có giá hoặc không đổi được đơn vị. */
export function estimate(l: Line): number | null {
  const p = PRICES[l.label]
  if (!p || l.amount === null) return null
  let v: number | null = null
  if (l.unit === 'g' && p.perG) v = l.amount * p.perG
  else if (l.unit === 'ml' && p.perMl) v = l.amount * p.perMl
  else if (p.perUnit && p.perUnit[l.unit] !== undefined) v = l.amount * p.perUnit[l.unit]
  return v === null ? null : Math.round(v / 100) * 100
}

export interface ShopList {
  lines: (Line & { cost: number | null; ref?: string; text: string })[]
  fresh: number
  unpriced: number
  /** Tên các thứ có định lượng mà chưa có giá (để ghi rõ cho khách). */
  unpricedNames: string[]
  meals: number
}

/** Danh sách mua cho các món đã chọn, cho `people` người. `meals` = số bữa (mỗi bữa 2 món) để tính tiền/bữa. */
export function shopList(recipes: Recipe[], people: number, meals = Math.max(1, Math.ceil(recipes.length / 2))): ShopList {
  const lines = mergeIngredients(recipes, people).map(l => ({ ...l, cost: estimate(l), ref: PRICES[l.label]?.ref, text: formatAmount(l) }))
  const fresh = lines.filter(l => l.group !== 'gia_vi_kho').reduce((n, l) => n + (l.cost ?? 0), 0)
  // Chỉ đếm thứ có định lượng mà chưa có giá; thứ "một ít" (rau thơm, ớt…) không tính.
  const unpricedNames = lines.filter(l => l.group !== 'gia_vi_kho' && l.cost === null && l.amount !== null).map(l => l.label)
  return { lines, fresh, unpriced: unpricedNames.length, unpricedNames, meals }
}

export const perMeal = (s: ShopList) => Math.round(s.fresh / s.meals / 1000) * 1000

/** Món khách có thể tự chọn (mọi món trong thư viện). */
export const PICKABLE = RECIPES

/** Sơ chế 1 lần vào ngày đi chợ (khoảng 60–90 phút) để cả tuần nấu nhanh. */
export const PREP: { title: string; detail: string }[] = [
  { title: 'Chia thịt theo bữa', detail: 'Mỗi bữa một túi zip, ghi tên món và ngày ăn. Phần ăn từ thứ 4 trở đi cho ngăn đá; tối hôm trước chuyển xuống ngăn mát để rã đông.' },
  { title: 'Làm sạch cá, tôm rồi chia phần', detail: 'Cá chà muối và gừng, rửa sạch, cắt khúc. Tôm cắt râu, rút chỉ. Phần ăn trong 2 ngày đầu để ngăn mát, còn lại cho ngăn đá.' },
  { title: 'Gà để ngăn đá', detail: 'Gà tươi ở ngăn mát chỉ nên giữ 1–2 ngày. Cho ngăn đá ngay, tối hôm trước chuyển xuống ngăn mát.' },
  { title: 'Rau lá: không rửa trước', detail: 'Nhặt bỏ lá úa, bọc khăn giấy khô rồi cho hộp hoặc túi kín, để ngăn rau. Rửa ngay trước khi nấu. Rau muống, cải ngọt ăn trong 2–3 ngày đầu.' },
  { title: 'Củ quả để được lâu', detail: 'Bí đao, bắp cải, cà rốt, hành tây, cà chua, dứa giữ được 5–7 ngày. Hành tây, hành tím, tỏi để nơi khô thoáng, không cho tủ lạnh.' },
  { title: 'Hành lá, rau thơm', detail: 'Cắt bớt rễ, cuộn khăn giấy hơi ẩm, cho hộp kín. Có thể thái sẵn một ít hành lá cho hộp nhỏ để dùng dần.' },
  { title: 'Phi sẵn hành tỏi', detail: 'Phi một mẻ hành tím và tỏi, để nguội cho hũ kín. Cả tuần rắc canh, xào, kho đều nhanh hơn.' },
]

/** Chữ để khách chép sang Zalo/ghi chú khi đi chợ. */
export function shopListText(title: string, s: ShopList, people: number): string {
  const out = [`ĐI CHỢ — ${title} (${people} người) · Bếp Cô Hạ`]
  for (const g of GROUPS) {
    const list = s.lines.filter(l => l.group === g.key)
    if (!list.length) continue
    out.push('', g.label.replace(/^\S+\s/, '').toUpperCase())
    for (const l of list) out.push(`☐ ${l.label}: ${l.text}${l.cost ? ` (~${l.cost.toLocaleString('vi-VN')}đ)` : ''}`)
  }
  out.push('', `Giá tham khảo ${PRICE_SOURCE} ngày ${PRICE_DATE}.`)
  return out.join('\n')
}
