// "Đi chợ 1 lần, nấu cả tuần": thực đơn 7 bữa tối cho 4 người, danh sách mua gộp theo quầy, giá tham khảo Co.opmart.
// Giá chép tay từ Co.op Online (cooponline.vn) ngày 25/10/2026, khu vực mặc định của trang. Món đang giảm giá thì lấy
// giá gốc để ước tính không bị thấp. Thứ Co.op Online không bán lẻ (cà rốt, giá đỗ, rau thơm) để price: null, không tự đoán.
// Định lượng gộp từ công thức trong recipes.ts (món 3 người nhân lên cho 4 người). Cập nhật giá: sửa bảng dưới và PRICE_DATE.
// Mẹo bảo quản là kiến thức chung, cần Cô Hạ đọc lại (giống các công thức gia đình).

export const PRICE_DATE = '25/10/2026'
export const PRICE_SOURCE = 'Co.op Online (cooponline.vn)'
export const PEOPLE = 4

export interface WeekDay {
  day: string
  dishes: string[] // slug trong recipes.ts
  note?: string
}

export const WEEK: WeekDay[] = [
  { day: 'Thứ 2', dishes: ['ca-kho-to', 'rau-muong-xao-toi'], note: 'Cá và rau lá mua về ăn trước cho tươi.' },
  { day: 'Thứ 3', dishes: ['tom-rim-man-ngot', 'canh-cai-thit-bam'] },
  { day: 'Thứ 4', dishes: ['ga-luoc-la-chanh', 'goi-ga-bap-cai'], note: 'Luộc 1 con gà: một nửa chặt ăn, một nửa xé làm gỏi.' },
  { day: 'Thứ 5', dishes: ['thit-kho-trung', 'canh-bi-dao-tom'], note: 'Thịt kho để được 3–4 ngày, dư thì để dành bữa sau.' },
  { day: 'Thứ 6', dishes: ['thit-xa-xiu', 'nom-tron-5-phut'], note: 'Ướp xá xíu từ tối thứ 5 cho nhanh.' },
  { day: 'Thứ 7', dishes: ['bo-xao-hanh-tay', 'dau-phu-sot-ca-chua'] },
  { day: 'Chủ nhật', dishes: ['trung-duc-thit', 'canh-chua-ca'] },
]

export type ShopGroup = 'thit_ca' | 'trung_dau' | 'rau_cu' | 'gia_vi_tuoi' | 'gia_vi_kho' | 'haco'

export const GROUPS: { key: ShopGroup; label: string; hint?: string }[] = [
  { key: 'thit_ca', label: '🥩 Thịt, cá, tôm' },
  { key: 'trung_dau', label: '🥚 Trứng, đậu phụ' },
  { key: 'rau_cu', label: '🥬 Rau, củ, quả' },
  { key: 'gia_vi_tuoi', label: '🧄 Hành, tỏi, gừng, chanh' },
  { key: 'gia_vi_kho', label: '🧂 Gia vị khô, gạo', hint: 'Nhà đã có thì bỏ qua, dùng được nhiều tuần.' },
  { key: 'haco', label: '🌿 Sốt Bếp Cô Hạ', hint: 'Đặt trong app, giao tận nhà.' },
]

export interface ShopItem {
  id: string
  group: ShopGroup
  name: string
  /** Lượng cần mua, ghi như khi đi chợ. */
  buy: string
  /** Thành tiền ước tính (đồng); null = Co.op Online không có giá bán lẻ. */
  price: number | null
  /** Đơn giá và tên hàng đã tra, để khách đối chiếu tại quầy. */
  ref?: string
  /** Dùng cho bữa nào. */
  days: string[]
  /** Mã hàng trong catalog Mini App (chỉ sốt Bếp Cô Hạ). */
  sku?: string
}

// Thành tiền = đơn giá × lượng mua (làm tròn tới 100đ).
export const SHOP: ShopItem[] = [
  { id: 'ca-basa', group: 'thit_ca', name: 'Cá basa (hoặc cá lóc)', buy: '1kg', price: 69900, ref: '69.900đ/kg · Cá basa nguyên con bỏ đầu', days: ['Thứ 2', 'Chủ nhật'] },
  { id: 'tom-the', group: 'thit_ca', name: 'Tôm thẻ', buy: '800g', price: 159900, ref: '199.900đ/kg · Tôm thẻ 51–60 con', days: ['Thứ 3', 'Thứ 5'] },
  { id: 'ga-ta', group: 'thit_ca', name: 'Gà ta nguyên con', buy: '1 con (1,1–1,3kg)', price: 139000, ref: '139.000đ/con · Gà ta Tam Nông (giá gốc)', days: ['Thứ 4'] },
  { id: 'ba-chi', group: 'thit_ca', name: 'Thịt ba chỉ', buy: '800g', price: 167200, ref: '209.000đ/kg · Ba rọi heo', days: ['Thứ 5'] },
  { id: 'nac-vai', group: 'thit_ca', name: 'Thịt nạc vai', buy: '700g', price: 115500, ref: '165.000đ/kg · Nạc vai heo', days: ['Thứ 6'] },
  { id: 'thit-xay', group: 'thit_ca', name: 'Thịt heo xay', buy: '350g', price: 49700, ref: '142.000đ/kg · Thịt heo xay', days: ['Thứ 3', 'Chủ nhật'] },
  { id: 'bo', group: 'thit_ca', name: 'Thịt bò đùi (hoặc thăn)', buy: '400g', price: 112000, ref: '280.000đ/kg · Thịt đùi bò', days: ['Thứ 7'] },

  { id: 'trung-vit', group: 'trung_dau', name: 'Trứng vịt', buy: '1 vỉ 6 quả', price: 22200, ref: '22.200đ/vỉ 6 quả', days: ['Thứ 5'] },
  { id: 'trung-ga', group: 'trung_dau', name: 'Trứng gà', buy: '1 vỉ 10 quả', price: 38500, ref: '38.500đ/vỉ 10 quả (giá gốc)', days: ['Chủ nhật'] },
  { id: 'dau-phu', group: 'trung_dau', name: 'Đậu phụ trắng', buy: '5 miếng', price: 31500, ref: '6.300đ/miếng', days: ['Thứ 7'] },

  { id: 'rau-muong', group: 'rau_cu', name: 'Rau muống', buy: '700g', price: 23000, ref: '32.900đ/kg', days: ['Thứ 2'] },
  { id: 'cai-ngot', group: 'rau_cu', name: 'Cải ngọt', buy: '1 gói 300g', price: 16600, ref: '16.600đ/gói 300g', days: ['Thứ 3'] },
  { id: 'bap-cai', group: 'rau_cu', name: 'Bắp cải', buy: '500g (nửa bắp nhỏ)', price: 14500, ref: '28.900đ/kg · Bắp cải trái tim', days: ['Thứ 4', 'Thứ 6'] },
  { id: 'bi-dao', group: 'rau_cu', name: 'Bí đao', buy: '500g', price: 11000, ref: '21.900đ/kg', days: ['Thứ 5'] },
  { id: 'ca-chua', group: 'rau_cu', name: 'Cà chua', buy: '700g (khoảng 6 quả)', price: 25800, ref: '36.900đ/kg', days: ['Thứ 7', 'Chủ nhật'] },
  { id: 'hanh-tay', group: 'rau_cu', name: 'Hành tây', buy: '2 củ (khoảng 400g)', price: 15200, ref: '38.000đ/kg', days: ['Thứ 4', 'Thứ 7'] },
  { id: 'dua-leo', group: 'rau_cu', name: 'Dưa leo (dưa chuột)', buy: '500g', price: 19200, ref: '19.200đ/gói 500g', days: ['Thứ 6'] },
  { id: 'thom', group: 'rau_cu', name: 'Dứa (thơm)', buy: '1 quả', price: 22000, ref: '22.000đ/quả', days: ['Chủ nhật'] },
  { id: 'dau-bap', group: 'rau_cu', name: 'Đậu bắp', buy: '1 gói 200g', price: 12500, ref: '12.500đ/gói 200g', days: ['Chủ nhật'] },
  { id: 'ca-rot', group: 'rau_cu', name: 'Cà rốt', buy: '2 củ', price: null, days: ['Thứ 4', 'Thứ 6'] },
  { id: 'gia-do', group: 'rau_cu', name: 'Giá đỗ', buy: '100g', price: null, days: ['Chủ nhật'] },
  { id: 'rau-thom', group: 'rau_cu', name: 'Rau thơm: rau răm, ngò gai, rau ngổ, lá chanh, dọc mùng', buy: 'mỗi thứ 1 nắm', price: null, days: ['Thứ 4', 'Chủ nhật'] },

  { id: 'hanh-tim', group: 'gia_vi_tuoi', name: 'Hành tím', buy: '200g', price: 23400, ref: '116.900đ/kg', days: ['Cả tuần'] },
  { id: 'toi', group: 'gia_vi_tuoi', name: 'Tỏi', buy: '1 gói 300g (dùng 2–3 tuần)', price: 32900, ref: '32.900đ/gói 300g', days: ['Cả tuần'] },
  { id: 'hanh-la', group: 'gia_vi_tuoi', name: 'Hành lá', buy: '2 gói 100g', price: 25000, ref: '12.500đ/gói 100g', days: ['Cả tuần'] },
  { id: 'gung', group: 'gia_vi_tuoi', name: 'Gừng', buy: '100g', price: 8500, ref: '8.500đ/gói 100g', days: ['Thứ 2', 'Thứ 4', 'Chủ nhật'] },
  { id: 'chanh', group: 'gia_vi_tuoi', name: 'Chanh', buy: '250g', price: 12500, ref: '12.500đ/vỉ 250g', days: ['Thứ 4'] },
  { id: 'me', group: 'gia_vi_tuoi', name: 'Me chua (me vắt)', buy: '100g', price: 5300, ref: '53.000đ/kg', days: ['Chủ nhật'] },
  { id: 'nuoc-dua', group: 'gia_vi_tuoi', name: 'Nước dừa tươi', buy: '1 lít', price: 45000, ref: '45.000đ/hộp 1L (giá gốc)', days: ['Thứ 5'] },

  { id: 'nuoc-mam', group: 'gia_vi_kho', name: 'Nước mắm', buy: '1 chai 900ml', price: 59000, ref: '59.000đ · Nam Ngư 900ml (giá gốc)', days: ['Cả tuần'] },
  { id: 'duong', group: 'gia_vi_kho', name: 'Đường', buy: '1kg', price: 31200, ref: '31.200đ · Biên Hòa 1kg', days: ['Cả tuần'] },
  { id: 'dau-an', group: 'gia_vi_kho', name: 'Dầu ăn', buy: '1 chai 1L', price: 69800, ref: '69.800đ · Dầu đậu nành 1L (giá gốc)', days: ['Cả tuần'] },
  { id: 'dau-hao', group: 'gia_vi_kho', name: 'Dầu hào', buy: '1 chai 350g', price: 24000, ref: '24.000đ · Cholimex 350g', days: ['Thứ 7'] },
  { id: 'gao', group: 'gia_vi_kho', name: 'Gạo', buy: '1 túi 5kg', price: 197000, ref: '197.000đ · Gạo ST25 5kg', days: ['Cả tuần'] },

  { id: 'sot-xa-xiu', group: 'haco', name: 'Sốt Xá Xíu Bếp Cô Hạ', buy: '1 hũ 500g (dùng 5–7 lần)', price: 100000, days: ['Thứ 6'], sku: 'sxx-500g' },
  { id: 'sot-nom', group: 'haco', name: 'Sốt Trộn Nộm Bếp Cô Hạ', buy: '1 chai 500g (dùng 6–8 lần)', price: 65000, days: ['Thứ 4', 'Thứ 6'], sku: 'stn-500g' },
]

export interface WeekTotals {
  fresh: number
  pantry: number
  haco: number
  unpriced: number
  perMeal: number
  perPersonMeal: number
}

/** Tổng tiền: đồ tươi của tuần (tính vào giá mỗi bữa), gia vị khô và sốt tính riêng vì dùng được nhiều tuần. */
export function weekTotals(items: ShopItem[] = SHOP, days = WEEK.length, people = PEOPLE): WeekTotals {
  const sum = (f: (i: ShopItem) => boolean) => items.filter(f).reduce((n, i) => n + (i.price ?? 0), 0)
  const fresh = sum(i => i.group !== 'gia_vi_kho' && i.group !== 'haco')
  return {
    fresh,
    pantry: sum(i => i.group === 'gia_vi_kho'),
    haco: sum(i => i.group === 'haco'),
    unpriced: items.filter(i => i.price === null).length,
    perMeal: Math.round(fresh / days / 1000) * 1000,
    perPersonMeal: Math.round(fresh / days / people / 1000) * 1000,
  }
}

/** Sơ chế 1 lần vào ngày đi chợ (khoảng 60–90 phút) để cả tuần nấu nhanh. */
export const PREP: { title: string; detail: string }[] = [
  { title: 'Chia thịt theo bữa', detail: 'Mỗi bữa một túi zip, ghi tên món và ngày ăn. Phần ăn từ thứ 4 trở đi cho ngăn đá; tối hôm trước chuyển xuống ngăn mát để rã đông.' },
  { title: 'Làm sạch cá, tôm rồi chia phần', detail: 'Cá chà muối và gừng, rửa sạch, cắt khúc. Tôm cắt râu, rút chỉ. Phần ăn thứ 2 để ngăn mát, còn lại cho ngăn đá.' },
  { title: 'Gà để ngăn đá', detail: 'Gà tươi ở ngăn mát chỉ nên giữ 1–2 ngày. Cho ngăn đá ngay, tối thứ 3 chuyển xuống ngăn mát để thứ 4 luộc.' },
  { title: 'Rau lá: không rửa trước', detail: 'Nhặt bỏ lá úa, bọc khăn giấy khô rồi cho hộp hoặc túi kín, để ngăn rau. Rửa ngay trước khi nấu. Rau muống, cải ngọt ăn trong 2–3 ngày đầu.' },
  { title: 'Củ quả để được lâu', detail: 'Bí đao, bắp cải, cà rốt, hành tây, cà chua, dứa giữ được 5–7 ngày. Hành tây, hành tím, tỏi để nơi khô thoáng, không cho tủ lạnh.' },
  { title: 'Hành lá, rau thơm', detail: 'Cắt bớt rễ, cuộn khăn giấy hơi ẩm, cho hộp kín. Có thể thái sẵn một ít hành lá cho hộp nhỏ để dùng dần.' },
  { title: 'Phi sẵn hành tỏi', detail: 'Phi một mẻ hành tím và tỏi, để nguội cho hũ kín. Cả tuần rắc canh, xào, kho đều nhanh hơn.' },
]
