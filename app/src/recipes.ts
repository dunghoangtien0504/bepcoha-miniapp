// Thư viện công thức.
// - Món gắn sản phẩm HACO (xá xíu, nộm, đồ xôi, xôi cốm): lấy từ phần "Hướng dẫn sử dụng" trên trang sản phẩm Haco-OS.
// - Món gia đình còn lại: app biên soạn theo cách nấu phổ biến, viết cho người mới (định lượng cho 3–4 người,
//   cách nhận biết món đã chín). Gắn `review: 'cho_co_ha_duyet'` — Cô Hạ đọc lại định lượng trước khi mở cho khách thật.
// Thêm món: thêm 1 mục; slug không dấu và KHÔNG đổi về sau (Sổ tay, danh sách đi chợ lưu theo slug).
// Bước có `minutes` thì chế độ nấu hiện nút hẹn giờ. Ảnh nằm ở Haco-OS public/images; món chưa có ảnh hiện ảnh minh hoạ.
// Đợt v3-C chuyển thư viện này lên CRM để nhân viên tự thêm món.

export type RecipeCategory = 'mon-man' | 'canh' | 'rau-goi' | 'xoi-com' | 'che-banh' | 'mon-chay'

export const CATEGORIES: { key: RecipeCategory; label: string; emoji: string }[] = [
  { key: 'mon-man', label: 'Món mặn', emoji: '🍖' },
  { key: 'canh', label: 'Canh', emoji: '🍲' },
  { key: 'rau-goi', label: 'Rau & gỏi', emoji: '🥗' },
  { key: 'xoi-com', label: 'Xôi & cốm', emoji: '🍚' },
  { key: 'che-banh', label: 'Chè & món ngọt', emoji: '🍮' },
  { key: 'mon-chay', label: 'Món chay', emoji: '🌿' },
]

/** Món nhanh = tổng thời gian không quá chừng này (chip "Dưới 30 phút"). */
export const QUICK_MINUTES = 30

export type Phase = 'so_che' | 'nau' | 'trang_tri'
export const PHASES: { key: Phase; label: string }[] = [
  { key: 'so_che', label: 'Sơ chế' },
  { key: 'nau', label: 'Nấu' },
  { key: 'trang_tri', label: 'Trình bày' },
]

export interface Ingredient {
  name: string
  qty?: string
  note?: string
}

export interface Step {
  phase: Phase
  title: string
  detail?: string
  /** Thời gian chờ của bước (ngâm, ướp, kho…) → nút hẹn giờ trong chế độ nấu. */
  minutes?: number
}

export interface Recipe {
  slug: string
  title: string
  category: RecipeCategory
  /** Tổng thời gian làm (không tính thời gian ngâm qua đêm — ghi ở `prepNote`). */
  minutes: number
  prepNote?: string
  servings: number
  level: 'de' | 'vua'
  image?: string
  summary: string
  ingredients: Ingredient[]
  tools?: string[]
  steps: Step[]
  tips?: string[]
  storage?: string[]
  /** Sản phẩm Bếp Cô Hạ dùng trong món (trang sản phẩm trên Haco-OS, cùng origin). */
  product?: { name: string; href: string; sku: string }
  /** Món có công thức chi tiết trong khoá học / sét, không công khai từng bước. */
  fullRecipeIn?: { label: string; to: string }
  review?: 'cho_co_ha_duyet'
}

const R = 'cho_co_ha_duyet' as const

export const RECIPES: Recipe[] = [
  // ── Món gắn sản phẩm HACO (theo hướng dẫn sử dụng trên trang sản phẩm) ──
  {
    slug: 'thit-xa-xiu',
    title: 'Thịt xá xíu áp chảo',
    category: 'mon-man',
    minutes: 90,
    prepNote: 'Ướp trước 1–2 tiếng',
    servings: 6,
    level: 'de',
    image: '/images/sot-xa-xiu/san-pham/xa-xiu-com-trang.jpg',
    summary: 'Lên màu đỏ đẹp, thơm như tiệm mà không cần nêm thêm gia vị.',
    ingredients: [
      { qty: '1kg', name: 'thịt nạc vai hoặc ba chỉ' },
      { qty: '100g', name: 'Sốt Xá Xíu Bếp Cô Hạ' },
    ],
    steps: [
      { phase: 'so_che', title: 'Rửa sạch thịt, để ráo, cắt khối dài khoảng 5cm' },
      { phase: 'so_che', title: 'Ướp 1kg thịt cùng 100g sốt xá xíu', detail: 'Trộn đều, ướp đủ 1–2 tiếng để lên màu đều, đẹp mắt.', minutes: 90 },
      { phase: 'nau', title: 'Đổ nước xâm xấp mặt thịt, đun đến khi thịt mềm', detail: 'Đun lửa nhỏ, không cần lửa lớn. Xiên đũa vào miếng thịt thấy dễ là mềm.', minutes: 40 },
      { phase: 'nau', title: 'Khi ăn, áp chảo cho thơm', detail: 'Áp chảo lửa vừa, mỗi mặt 1–2 phút, tránh cháy khét.' },
      { phase: 'trang_tri', title: 'Thái lát mỏng, xếp ra đĩa', detail: 'Ăn với cơm trắng, dưa leo, rưới chút nước sốt còn trong nồi.' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.'],
    storage: ['Sốt: ngăn đông dùng được 6 tháng, ngăn mát 1 tháng.'],
    product: { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', sku: 'sxx-500g' },
  },
  {
    slug: 'nom-tron-5-phut',
    title: 'Nộm trộn 5 phút',
    category: 'rau-goi',
    minutes: 30,
    servings: 4,
    level: 'de',
    image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg',
    summary: 'Rau giòn, sốt sệt bám đều từng sợi — có khách bất ngờ cũng làm kịp.',
    ingredients: [
      { qty: '500g', name: 'rau củ, thịt hoặc tôm', note: 'tuỳ thích' },
      { qty: '50–80ml', name: 'Sốt Trộn Nộm Bếp Cô Hạ' },
      { name: 'Đậu phộng rang, hành phi, rau thơm, ớt sợi' },
      { name: 'Nước đá, muối, giấm', note: 'để ngâm rau' },
    ],
    steps: [
      { phase: 'so_che', title: 'Ngâm rau củ trong nước đá + muối + giấm để giòn', minutes: 15 },
      { phase: 'so_che', title: 'Vớt rau ra, để ráo nước', detail: 'Rau, thịt phải ráo hết nước trước khi trộn để gỏi không bị nhão.' },
      { phase: 'nau', title: 'Cho 50–80ml sốt cho 500g nguyên liệu, trộn đều' },
      { phase: 'nau', title: 'Để ngấm trước khi ăn', minutes: 10 },
      { phase: 'trang_tri', title: 'Rắc đậu phộng rang, hành phi, rau thơm, ớt sợi lên trên' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.', 'Muốn cay hơn: thêm ớt băm tươi.', 'Trộn lượng nhỏ trước, nếm thử rồi điều chỉnh theo khẩu vị gia đình.'],
    product: { name: 'Sốt Trộn Nộm Bếp Cô Hạ', href: '/sot-tron-nom', sku: 'stn-500g' },
  },
  {
    slug: 'do-xoi-bang-khan',
    title: 'Đồ xôi dẻo, không dính',
    category: 'xoi-com',
    minutes: 45,
    prepNote: 'Ngâm nếp trước 4–8 tiếng',
    servings: 4,
    level: 'de',
    image: '/images/khan-do-xoi/thanh-pham/724485203_2296217747574178_5800612475932619747_n.jpg',
    summary: 'Xôi ráo, hạt bóng, lấy ra không dính khăn — đẹp như hàng bán.',
    ingredients: [
      { qty: '500g', name: 'gạo nếp', note: 'ngâm trước 4–8 tiếng' },
      { qty: '1/2 thìa cà phê', name: 'muối' },
    ],
    tools: ['Khăn đồ xôi Bếp Cô Hạ', 'Chõ hoặc nồi hấp'],
    steps: [
      { phase: 'so_che', title: 'Ngâm nếp 4–8 tiếng', detail: 'Nếp nở đều → đồ nhanh hơn, chín đều hơn. Vo lại, trộn muối, để ráo.' },
      { phase: 'so_che', title: 'Làm ẩm khăn, lót vào chõ', detail: 'Khăn ẩm (không ướt đẫm) — hơi thấm qua đều, không đọng nước.' },
      { phase: 'nau', title: 'Đổ nếp, phủ khăn lên trên', detail: 'Khăn phủ hút hơi ngưng tụ, xôi không bị ướt từ trên xuống.' },
      { phase: 'nau', title: 'Đồ 20 phút đầu', detail: 'Nước trong nồi sôi đều, lửa vừa.', minutes: 20 },
      { phase: 'nau', title: 'Lật đảo 1 lần, đồ tiếp', detail: 'Lật phần trên xuống dưới để chín đều. Nhón vài hạt nếm: hạt trong, dẻo là chín.', minutes: 15 },
      { phase: 'trang_tri', title: 'Ủ 5 phút rồi lấy ra', detail: 'Xôi ráo, hạt bóng, lấy ra không dính khăn.', minutes: 5 },
    ],
    product: { name: 'Khăn đồ xôi Bếp Cô Hạ', href: '/khan-do-xoi', sku: 'kdx' },
  },
  {
    slug: 'xoi-com-sen-dua',
    title: 'Xôi cốm sen dừa',
    category: 'xoi-com',
    minutes: 60,
    servings: 4,
    level: 'vua',
    image: '/images/set-xoi-com/san-pham/722705000_1642171887632423_3979564310912375133_n.jpg',
    summary: 'Món làm nên tên tuổi Bếp Cô Hạ. 8 nguyên liệu, công thức bí quyết từng bước.',
    ingredients: [
      { name: 'Cốm khô' },
      { name: 'Đậu xanh đã cà vỏ' },
      { name: 'Hạt sen khô' },
      { name: 'Bột cốt dừa' },
      { name: 'Đường kính trắng' },
      { name: 'Muối tinh' },
      { name: 'Bột nghệ' },
      { name: 'Lá dứa' },
    ],
    steps: [
      { phase: 'so_che', title: 'Chuẩn bị đủ 8 nguyên liệu', detail: 'Sét Xôi Cốm Sen Dừa đã chọn sẵn đủ bộ, đúng loại.' },
      { phase: 'nau', title: 'Làm theo công thức bí quyết của Cô Hạ', detail: 'Tỷ lệ và từng bước có trong sét và trong khoá "Học làm xôi cốm cùng Cô Hạ".' },
    ],
    product: { name: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa', href: '/set-xoi-com', sku: 'sxc-set' },
    fullRecipeIn: { label: 'Học từng bước trong khoá xôi cốm', to: '/hoc' },
  },

  // ── Món mặn ──
  {
    slug: 'thit-kho-trung',
    title: 'Thịt kho trứng nước dừa',
    category: 'mon-man',
    minutes: 100,
    servings: 4,
    level: 'de',
    summary: 'Thịt mềm, trứng thấm, nước kho màu cánh gián — món cơm nhà ai cũng thèm.',
    ingredients: [
      { qty: '800g', name: 'thịt ba chỉ hoặc nạc vai' },
      { qty: '6 quả', name: 'trứng vịt hoặc trứng gà' },
      { qty: '1 lít', name: 'nước dừa tươi', note: 'khoảng 2 quả; không có thì dùng nước lọc + 1 thìa canh đường' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '3 tép', name: 'tỏi' },
      { qty: '3 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa canh', name: 'đường' },
      { qty: '1 thìa canh', name: 'nước màu', note: 'hoặc thắng 2 thìa đường đến màu cánh gián' },
      { qty: '1/2 thìa cà phê', name: 'tiêu xay' },
      { name: 'Ớt', note: 'tuỳ thích' },
    ],
    steps: [
      { phase: 'so_che', title: 'Chà thịt với muối, rửa sạch', detail: 'Chần thịt trong nồi nước sôi để sạch bọt bẩn, rồi vớt ra rửa lại nước lạnh.', minutes: 2 },
      { phase: 'so_che', title: 'Cắt thịt miếng vuông 4–5cm', detail: 'Miếng to vừa phải kho lâu không bị nát, vẫn giữ nạc mỡ dính nhau.' },
      { phase: 'so_che', title: 'Luộc trứng 10 phút', detail: 'Cho trứng vào nước lạnh rồi mới bật bếp. Luộc xong ngâm nước lạnh 5 phút cho dễ bóc vỏ.', minutes: 10 },
      { phase: 'so_che', title: 'Băm hành tím, tỏi. Ướp thịt', detail: 'Trộn thịt với hành tỏi băm, 2 thìa nước mắm, 1 thìa đường, nước màu, tiêu.', minutes: 30 },
      { phase: 'nau', title: 'Đảo thịt trên lửa vừa cho săn', detail: 'Đảo đến khi thịt săn lại, dậy mùi thơm.', minutes: 5 },
      { phase: 'nau', title: 'Đổ nước dừa ngập thịt, đun sôi rồi hớt bọt', detail: 'Hớt bọt kỹ để nước kho trong, đẹp.' },
      { phase: 'nau', title: 'Hạ lửa thật nhỏ, kho', detail: 'Mở hé vung. Nước chỉ lăn tăn, không sôi bùng — thịt mới mềm mà không nát.', minutes: 45 },
      { phase: 'nau', title: 'Cho trứng vào, kho thêm', detail: 'Kho đến khi thịt mềm (xiên đũa thấy ngọt), nước kho sánh màu cánh gián. Nếm lại, thiếu mặn thêm 1 thìa nước mắm.', minutes: 20 },
      { phase: 'trang_tri', title: 'Múc ra tô, rưới nước kho, thêm ớt', detail: 'Ăn với cơm nóng, dưa cải chua hoặc dưa giá.' },
    ],
    tips: ['Không đậy kín vung khi kho thì nước kho trong, không bị đục.', 'Kho hôm trước, hôm sau ăn còn ngon hơn vì thịt ngấm đều.'],
    storage: ['Ngăn mát 3–4 ngày. Mỗi lần ăn đun sôi lại.'],
    review: R,
  },
  {
    slug: 'ca-kho-to',
    title: 'Cá kho tộ',
    category: 'mon-man',
    minutes: 75,
    servings: 4,
    level: 'de',
    summary: 'Cá chắc thịt, đậm đà, nước kho sánh quyện — ăn bao nhiêu cơm cũng hết.',
    ingredients: [
      { qty: '600g', name: 'cá lóc, cá basa hoặc cá trắm', note: 'cắt khúc 3cm' },
      { qty: '2 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa canh', name: 'đường' },
      { qty: '1 thìa canh', name: 'nước màu' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '2 tép', name: 'tỏi' },
      { qty: '1 nhánh', name: 'gừng', note: 'để khử tanh' },
      { qty: '1 thìa cà phê', name: 'tiêu' },
      { qty: '2 quả', name: 'ớt' },
      { qty: '200ml', name: 'nước dừa hoặc nước lọc' },
      { name: 'Hành lá, dầu ăn' },
    ],
    tools: ['Tộ đất hoặc nồi đáy dày'],
    steps: [
      { phase: 'so_che', title: 'Làm sạch cá, khử tanh', detail: 'Chà cá với muối hạt và gừng đập dập, rửa lại nhiều lần nước, để ráo.' },
      { phase: 'so_che', title: 'Ướp cá', detail: 'Hành tím, tỏi băm + nước mắm + đường + nước màu + tiêu. Trộn nhẹ tay cho cá không nát.', minutes: 30 },
      { phase: 'nau', title: 'Phi thơm hành tỏi, xếp cá vào tộ', detail: 'Phi 1 thìa dầu với chút hành tỏi, xếp cá một lớp, rưới phần nước ướp lên.' },
      { phase: 'nau', title: 'Đun lửa vừa cho cá săn', detail: 'Sau 5 phút lật nhẹ từng khúc 1 lần.', minutes: 5 },
      { phase: 'nau', title: 'Đổ nước xâm xấp, kho lửa nhỏ', detail: 'Đun sôi rồi hạ lửa nhỏ. Không đảo — chỉ lắc nhẹ tộ để cá không nát. Kho đến khi nước sánh lại.', minutes: 35 },
      { phase: 'nau', title: 'Thêm tiêu, ớt, hành lá', detail: 'Nếm lại vị mặn ngọt rồi tắt bếp.' },
      { phase: 'trang_tri', title: 'Để nguyên trong tộ, rắc tiêu và ớt lát', detail: 'Dọn kèm cơm trắng và rau luộc chấm nước kho.' },
    ],
    tips: ['Kho lửa thật nhỏ, cá càng thấm và càng chắc thịt.'],
    storage: ['Ngăn mát 2–3 ngày.'],
    review: R,
  },
  {
    slug: 'suon-xao-chua-ngot',
    title: 'Sườn xào chua ngọt',
    category: 'mon-man',
    minutes: 50,
    servings: 3,
    level: 'de',
    summary: 'Sườn vàng thơm, sốt chua ngọt sánh bóng — trẻ con người lớn đều mê.',
    ingredients: [
      { qty: '500g', name: 'sườn non', note: 'nhờ người bán chặt miếng 3–4cm' },
      { qty: '2 thìa canh', name: 'nước mắm' },
      { qty: '2 thìa canh', name: 'đường' },
      { qty: '2 thìa canh', name: 'giấm', note: 'hoặc 1,5 thìa nước cốt chanh' },
      { qty: '3 thìa canh', name: 'tương cà' },
      { qty: '3 tép', name: 'tỏi' },
      { qty: '2 củ', name: 'hành tím' },
      { qty: '1 quả', name: 'cà chua' },
      { name: 'Hành lá, rau mùi, mè rang', note: 'trang trí' },
      { name: 'Dầu ăn, tiêu' },
    ],
    steps: [
      { phase: 'so_che', title: 'Rửa sườn với muối, chần qua nước sôi', detail: 'Chần 3 phút cho sạch bọt, vớt ra rửa lại, để ráo.', minutes: 3 },
      { phase: 'so_che', title: 'Ướp sườn', detail: '1 thìa nước mắm, nửa thìa đường, một nửa tỏi băm, chút tiêu.', minutes: 20 },
      { phase: 'so_che', title: 'Pha bát sốt', detail: '1 thìa nước mắm + 1,5 thìa đường + 2 thìa giấm + 3 thìa tương cà + 4 thìa nước lọc. Khuấy tan đường.' },
      { phase: 'nau', title: 'Chiên sườn vàng các mặt rồi vớt ra', detail: 'Lửa vừa, chiên đến khi sườn vàng đều và săn chắc.', minutes: 10 },
      { phase: 'nau', title: 'Phi hành tỏi, xào cà chua', detail: 'Để lại 1 thìa dầu trong chảo. Cà chua thái hạt lựu, xào mềm.', minutes: 2 },
      { phase: 'nau', title: 'Cho sườn vào, đổ bát sốt, rim lửa nhỏ', detail: 'Đảo đều đến khi sốt sánh lại và bám bóng quanh miếng sườn. Nếm lại cho vừa chua ngọt.', minutes: 10 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc hành lá, rau mùi, mè rang' },
    ],
    tips: ['Sườn dày thì sau khi đổ sốt, đậy vung om thêm 5 phút với 3 thìa nước cho chín kỹ bên trong.'],
    review: R,
  },
  {
    slug: 'ga-luoc-la-chanh',
    title: 'Gà luộc lá chanh',
    category: 'mon-man',
    minutes: 60,
    servings: 4,
    level: 'de',
    summary: 'Da vàng giòn, thịt ngọt, không bị đỏ xương — cách luộc gà chuẩn cho người mới.',
    ingredients: [
      { qty: '1 con', name: 'gà ta', note: 'khoảng 1,2–1,5kg' },
      { qty: '1 củ', name: 'gừng' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '1 thìa canh', name: 'muối' },
      { qty: '1 nắm', name: 'lá chanh non' },
      { name: 'Muối, tiêu, chanh, ớt', note: 'pha muối chấm' },
    ],
    steps: [
      { phase: 'so_che', title: 'Làm sạch gà', detail: 'Nhổ sạch lông tơ, xát muối và gừng đập dập khắp thân, rửa lại nước sạch.' },
      { phase: 'so_che', title: 'Nướng sơ gừng và hành tím rồi đập dập', detail: 'Nướng trên bếp đến khi vỏ hơi cháy, dậy mùi thơm.' },
      { phase: 'nau', title: 'Cho gà vào nồi nước LẠNH, đun đến sôi', detail: 'Nước ngập gà, thêm gừng, hành, 1 thìa muối. Bắt đầu từ nước lạnh để gà chín đều từ trong ra. Sôi thì hớt bọt.' },
      { phase: 'nau', title: 'Hạ lửa nhỏ, luộc', minutes: 15 },
      { phase: 'nau', title: 'Tắt bếp, đậy vung, ngâm gà trong nồi', detail: 'Kiểm tra: xiên đũa vào chỗ dày nhất của đùi, nước chảy ra trong là chín. Còn hồng thì bật bếp luộc thêm 5 phút.', minutes: 15 },
      { phase: 'nau', title: 'Vớt gà thả ngay vào tô nước đá', detail: 'Da gà co lại, giòn và vàng đẹp.', minutes: 5 },
      { phase: 'trang_tri', title: 'Chặt miếng vừa ăn, xếp đĩa', detail: 'Lá chanh thái chỉ thật nhỏ rắc lên. Chấm muối tiêu chanh. Nước luộc giữ lại nấu canh, nấu cháo.' },
    ],
    tips: ['Muốn da vàng bóng: lúc gà còn ấm, quét mỏng một lớp mỡ gà hoặc chút nghệ pha nước.'],
    storage: ['Ngăn mát 2 ngày, bọc kín.'],
    review: R,
  },
  {
    slug: 'thit-rang-chay-canh',
    title: 'Thịt ba chỉ rang cháy cạnh',
    category: 'mon-man',
    minutes: 35,
    servings: 3,
    level: 'de',
    summary: 'Miếng thịt xém cạnh, săn bóng, thơm hành — món cơm nhà nhanh gọn.',
    ingredients: [
      { qty: '400g', name: 'thịt ba chỉ' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa cà phê', name: 'đường' },
      { qty: '1 thìa cà phê', name: 'nước màu', note: 'tuỳ chọn' },
      { qty: '1/2 thìa cà phê', name: 'tiêu' },
      { name: 'Hành lá' },
    ],
    steps: [
      { phase: 'so_che', title: 'Rửa thịt, thái lát mỏng 3–4mm', detail: 'Để thịt vào ngăn đá 15 phút trước khi thái sẽ dễ thái mỏng đều.' },
      { phase: 'so_che', title: 'Thái hành tím, cắt hành lá' },
      { phase: 'nau', title: 'Rang thịt trong chảo không dầu', detail: 'Lửa vừa, đảo đều để mỡ chảy ra và thịt xém cạnh vàng.', minutes: 10 },
      { phase: 'nau', title: 'Chắt bớt mỡ, cho hành tím vào đảo thơm', detail: 'Chỉ để lại khoảng 1 thìa mỡ trong chảo.' },
      { phase: 'nau', title: 'Nêm nước mắm, đường, nước màu, đảo lửa to', detail: 'Đảo nhanh tay đến khi gia vị bám và thịt săn bóng.', minutes: 3 },
      { phase: 'trang_tri', title: 'Tắt bếp, rắc tiêu và hành lá', detail: 'Ăn với cơm nóng và dưa chua.' },
    ],
    review: R,
  },
  {
    slug: 'trung-duc-thit',
    title: 'Trứng đúc thịt',
    category: 'mon-man',
    minutes: 30,
    servings: 3,
    level: 'de',
    summary: 'Trứng mềm xốp, thịt thơm hành — món cứu cánh ngày bận rộn.',
    ingredients: [
      { qty: '4 quả', name: 'trứng gà' },
      { qty: '150g', name: 'thịt nạc băm' },
      { qty: '2 tai', name: 'mộc nhĩ', note: 'tuỳ chọn' },
      { qty: '1 củ', name: 'hành tím' },
      { qty: '2 cây', name: 'hành lá' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/4 thìa cà phê', name: 'tiêu' },
      { name: 'Dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Ngâm mộc nhĩ cho nở, thái nhỏ', minutes: 10 },
      { phase: 'so_che', title: 'Ướp thịt với hành tím băm, nửa thìa nước mắm, tiêu', minutes: 10 },
      { phase: 'nau', title: 'Xào thịt và mộc nhĩ đến khi thịt hết màu hồng', minutes: 4 },
      { phase: 'nau', title: 'Đánh tan trứng với nửa thìa nước mắm và hành lá, trộn thịt vào' },
      { phase: 'nau', title: 'Láng dầu chảo, đổ trứng, lửa nhỏ, đậy vung', detail: 'Rán đến khi mặt trên trứng se lại.', minutes: 6 },
      { phase: 'nau', title: 'Lật mặt, rán thêm', detail: 'Mẹo lật: úp một cái đĩa lên chảo, lật ngược, rồi trượt miếng trứng trở lại chảo.', minutes: 3 },
      { phase: 'trang_tri', title: 'Cắt miếng tam giác, bày đĩa, rắc hành lá', detail: 'Chấm tương ớt hoặc nước mắm ớt.' },
    ],
    review: R,
  },
  {
    slug: 'tom-rim-man-ngot',
    title: 'Tôm rim mặn ngọt',
    category: 'mon-man',
    minutes: 35,
    servings: 3,
    level: 'de',
    summary: 'Tôm đỏ au, vỏ giòn thấm vị mặn ngọt — đưa cơm, để được lâu.',
    ingredients: [
      { qty: '500g', name: 'tôm đất hoặc tôm thẻ' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1,5 thìa canh', name: 'đường' },
      { qty: '3 tép', name: 'tỏi' },
      { qty: '2 củ', name: 'hành tím' },
      { qty: '1/2 thìa cà phê', name: 'tiêu' },
      { qty: '1 quả', name: 'ớt' },
      { name: 'Hành lá, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Cắt râu, chân tôm; rạch lưng lấy chỉ đen', detail: 'Giữ vỏ để tôm giòn và đỏ đẹp. Rửa sạch, để ráo.' },
      { phase: 'so_che', title: 'Ướp tôm', detail: 'Một nửa hành tỏi băm + 1 thìa nước mắm + 1 thìa đường + tiêu.', minutes: 15 },
      { phase: 'nau', title: 'Phi thơm phần hành tỏi còn lại, cho tôm vào đảo lửa to', detail: 'Đảo đến khi tôm đỏ đều.', minutes: 2 },
      { phase: 'nau', title: 'Thêm nửa thìa đường và 2 thìa nước, rim lửa vừa', detail: 'Rim đến khi nước cạn, sệt lại và bám bóng quanh vỏ tôm.', minutes: 10 },
      { phase: 'trang_tri', title: 'Thêm ớt, hành lá, tiêu; xếp ra đĩa' },
    ],
    storage: ['Hộp kín, ngăn mát 3 ngày.'],
    review: R,
  },
  {
    slug: 'bo-xao-hanh-tay',
    title: 'Thịt bò xào hành tây',
    category: 'mon-man',
    minutes: 25,
    servings: 3,
    level: 'de',
    summary: 'Bò mềm, hành tây giòn ngọt — bí quyết là thái ngang thớ và xào thật nhanh.',
    ingredients: [
      { qty: '300g', name: 'thịt bò thăn' },
      { qty: '1 củ', name: 'hành tây' },
      { qty: '3 tép', name: 'tỏi' },
      { qty: '1 thìa canh', name: 'dầu hào' },
      { qty: '1 thìa cà phê', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'đường' },
      { qty: '1 thìa cà phê', name: 'bột năng hoặc bột ngô' },
      { name: 'Tiêu, hành lá, rau mùi, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Thái bò mỏng NGANG thớ', detail: 'Nhìn các thớ thịt chạy dọc, đặt dao cắt vuông góc với thớ — bò sẽ mềm, không dai.' },
      { phase: 'so_che', title: 'Ướp bò', detail: 'Nửa phần tỏi băm + dầu hào + tiêu + bột năng + 1 thìa dầu ăn. Dầu giúp bò không dính chảo và giữ mềm.', minutes: 15 },
      { phase: 'so_che', title: 'Hành tây bổ múi cau, tách lớp' },
      { phase: 'nau', title: 'Chảo thật nóng, lửa to: phi tỏi, xào bò', detail: 'Xào đến khi bò vừa đổi màu thì trút ra đĩa ngay.', minutes: 2 },
      { phase: 'nau', title: 'Xào hành tây lửa to', detail: 'Không cần rửa chảo. Hành tây vừa chín tới, còn giòn.', minutes: 2 },
      { phase: 'nau', title: 'Cho bò vào lại, nêm nước mắm, đường, đảo 30 giây rồi tắt bếp' },
      { phase: 'trang_tri', title: 'Rắc tiêu, hành lá, rau mùi' },
    ],
    tips: ['Xào bò quá lâu sẽ dai — thà hơi tái rồi để hơi nóng làm chín nốt.'],
    review: R,
  },

  // ── Canh ──
  {
    slug: 'canh-chua-ca',
    title: 'Canh chua cá',
    category: 'canh',
    minutes: 50,
    servings: 4,
    level: 'vua',
    summary: 'Chua thanh, ngọt nước, rau giòn — bát canh chua đúng vị miền Nam.',
    ingredients: [
      { qty: '400g', name: 'cá lóc, cá basa hoặc cá diêu hồng', note: 'cắt khúc' },
      { qty: '50g', name: 'me chua', note: 'hoặc 2 thìa canh nước cốt me' },
      { qty: '2 quả', name: 'cà chua' },
      { qty: '1/4 quả', name: 'dứa (thơm)' },
      { qty: '2 cây', name: 'bạc hà (dọc mùng)' },
      { qty: '5 quả', name: 'đậu bắp' },
      { qty: '100g', name: 'giá đỗ' },
      { name: 'Rau ngổ, ngò gai' },
      { qty: '2 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa canh', name: 'đường' },
      { name: 'Muối, tiêu, tỏi phi, ớt' },
    ],
    steps: [
      { phase: 'so_che', title: 'Làm sạch cá với muối và gừng, ướp nửa thìa nước mắm, tiêu', minutes: 10 },
      { phase: 'so_che', title: 'Ngâm me với 200ml nước ấm, dầm lấy nước, bỏ hạt', minutes: 10 },
      { phase: 'so_che', title: 'Sơ chế rau', detail: 'Cà chua bổ múi; dứa thái lát; bạc hà tước vỏ, thái xéo, bóp chút muối rồi rửa lại (đỡ ngứa); đậu bắp thái xéo; rau ngổ, ngò gai thái nhỏ.' },
      { phase: 'nau', title: 'Đun sôi 1,5 lít nước với nước me, dứa, cà chua', detail: 'Nêm nước mắm, đường, chút muối đến khi vị chua ngọt hài hoà.' },
      { phase: 'nau', title: 'Nước sôi lại thì thả cá, nấu lửa vừa, hớt bọt', detail: 'Cá chín khi thịt trắng đục, tách thớ dễ dàng.', minutes: 10 },
      { phase: 'nau', title: 'Cho đậu bắp, nấu thêm', minutes: 2 },
      { phase: 'nau', title: 'Thả bạc hà và giá rồi tắt bếp ngay', detail: 'Rau cho sau cùng mới giòn, xanh.' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc rau ngổ, ngò gai, tỏi phi, ớt lát' },
    ],
    review: R,
  },
  {
    slug: 'canh-bi-dao-tom',
    title: 'Canh bí đao nấu tôm',
    category: 'canh',
    minutes: 30,
    servings: 4,
    level: 'de',
    summary: 'Thanh mát, ngọt tự nhiên — bát canh giải nhiệt cho ngày nóng.',
    ingredients: [
      { qty: '500g', name: 'bí đao', note: 'khoảng nửa quả' },
      { qty: '150g', name: 'tôm tươi' },
      { qty: '1 củ', name: 'hành tím' },
      { qty: '2 cây', name: 'hành lá' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'muối hoặc hạt nêm' },
      { name: 'Tiêu, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Gọt vỏ bí, bỏ ruột, cắt miếng vừa ăn' },
      { phase: 'so_che', title: 'Bóc vỏ tôm, bỏ chỉ, băm nhỏ', detail: 'Tôm băm nấu canh ngọt nước hơn để nguyên con.' },
      { phase: 'so_che', title: 'Ướp tôm với nửa thìa nước mắm và tiêu', minutes: 5 },
      { phase: 'nau', title: 'Phi thơm hành tím, xào tôm cho săn', minutes: 1 },
      { phase: 'nau', title: 'Đổ 1 lít nước, đun sôi, cho bí vào', detail: 'Nấu lửa vừa đến khi bí trong và mềm.', minutes: 8 },
      { phase: 'nau', title: 'Nêm nước mắm, muối; tắt bếp, cho hành lá và tiêu' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc hành lá' },
    ],
    review: R,
  },
  {
    slug: 'canh-cai-thit-bam',
    title: 'Canh cải ngọt thịt băm',
    category: 'canh',
    minutes: 25,
    servings: 4,
    level: 'de',
    summary: 'Canh rau xanh ngọt nước, nấu 15 phút là có — mâm cơm nào cũng hợp.',
    ingredients: [
      { qty: '300g', name: 'cải ngọt hoặc cải cúc' },
      { qty: '150g', name: 'thịt nạc vai băm' },
      { qty: '1 củ', name: 'hành tím' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'hạt nêm' },
      { name: 'Tiêu, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Nhặt, rửa cải, cắt khúc 4cm' },
      { phase: 'so_che', title: 'Ướp thịt với hành tím băm, nửa thìa nước mắm, tiêu', minutes: 10 },
      { phase: 'nau', title: 'Phi thơm hành, xào thịt cho săn', minutes: 2 },
      { phase: 'nau', title: 'Đổ 1 lít nước, đun sôi, hớt bọt' },
      { phase: 'nau', title: 'Cho cải vào, nấu đến khi cải vừa chín', detail: 'Cải chuyển xanh đậm là được, đừng nấu lâu kẻo nhũn và vàng.', minutes: 3 },
      { phase: 'nau', title: 'Nêm nước mắm, hạt nêm, tắt bếp' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc tiêu' },
    ],
    review: R,
  },

  // ── Rau & gỏi ──
  {
    slug: 'rau-muong-xao-toi',
    title: 'Rau muống xào tỏi xanh giòn',
    category: 'rau-goi',
    minutes: 15,
    servings: 3,
    level: 'de',
    summary: 'Mẹo chần 30 giây giúp rau xanh mướt, giòn, không thâm.',
    ingredients: [
      { qty: '1 bó', name: 'rau muống', note: 'khoảng 500g' },
      { qty: '1 củ', name: 'tỏi' },
      { qty: '1 thìa canh', name: 'nước mắm', note: 'hoặc nửa thìa hạt nêm' },
      { qty: '1 thìa canh', name: 'dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Nhặt lấy ngọn và lá non, rửa sạch, để ráo' },
      { phase: 'so_che', title: 'Đập dập, băm tỏi' },
      { phase: 'so_che', title: 'Chần rau 30 giây trong nước sôi có chút muối, vớt ra ngâm nước đá', detail: 'Bước này giữ rau xanh giòn. Vớt ra để thật ráo.', minutes: 1 },
      { phase: 'nau', title: 'Phi tỏi vàng, vớt ra một nửa để rắc lên sau' },
      { phase: 'nau', title: 'Lửa to, cho rau vào đảo nhanh, nêm nước mắm', minutes: 2 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc tỏi phi' },
    ],
    review: R,
  },
  {
    slug: 'goi-ga-bap-cai',
    title: 'Gỏi gà bắp cải',
    category: 'rau-goi',
    minutes: 30,
    prepNote: 'Dùng gà đã luộc sẵn',
    servings: 4,
    level: 'de',
    summary: 'Bắp cải giòn, gà xé ngọt, sốt trộn sẵn — đĩa gỏi đãi khách trong nửa tiếng.',
    ingredients: [
      { qty: '300g', name: 'thịt gà luộc', note: 'ức hoặc đùi' },
      { qty: '300g', name: 'bắp cải', note: 'khoảng 1/4 bắp' },
      { qty: '1 củ', name: 'cà rốt' },
      { qty: '1/2 củ', name: 'hành tây' },
      { qty: '60ml', name: 'Sốt Trộn Nộm Bếp Cô Hạ' },
      { name: 'Rau răm, đậu phộng rang, hành phi' },
    ],
    steps: [
      { phase: 'so_che', title: 'Thái bắp cải thật mỏng, cà rốt bào sợi', detail: 'Ngâm vào nước đá có chút muối cho giòn, rồi vắt thật ráo.', minutes: 10 },
      { phase: 'so_che', title: 'Hành tây thái mỏng, ngâm nước đá cho bớt hăng', minutes: 10 },
      { phase: 'so_che', title: 'Xé gà thành sợi vừa ăn' },
      { phase: 'nau', title: 'Trộn rau, gà với 60ml sốt, để ngấm', detail: 'Rau phải ráo nước thì gỏi mới không nhão.', minutes: 10 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc rau răm, đậu phộng, hành phi' },
    ],
    product: { name: 'Sốt Trộn Nộm Bếp Cô Hạ', href: '/sot-tron-nom', sku: 'stn-500g' },
    review: R,
  },
  {
    slug: 'com-chien-xa-xiu',
    title: 'Cơm chiên xá xíu',
    category: 'mon-man',
    minutes: 25,
    prepNote: 'Dùng thịt xá xíu làm sẵn và cơm nguội',
    servings: 2,
    level: 'de',
    summary: 'Hạt cơm tơi vàng, xá xíu thơm ngọt — tận dụng cơm nguội thành món ngon.',
    ingredients: [
      { qty: '2 bát', name: 'cơm nguội', note: 'cơm để qua đêm chiên mới tơi' },
      { qty: '150g', name: 'thịt xá xíu', note: 'làm theo món "Thịt xá xíu áp chảo"' },
      { qty: '2 quả', name: 'trứng gà' },
      { qty: '1 củ', name: 'cà rốt nhỏ' },
      { qty: '50g', name: 'đậu Hà Lan' },
      { qty: '2 cây', name: 'hành lá' },
      { qty: '1 thìa canh', name: 'nước tương' },
      { name: 'Hạt nêm, tiêu, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Bóp tơi cơm nguội' },
      { phase: 'so_che', title: 'Thái xá xíu và cà rốt hạt lựu' },
      { phase: 'so_che', title: 'Luộc chín cà rốt và đậu Hà Lan', minutes: 3 },
      { phase: 'nau', title: 'Chảo nóng 2 thìa dầu, đổ trứng đánh tan, đảo tơi', detail: 'Cho cơm vào ngay khi trứng còn hơi ướt để trứng bám vào hạt cơm.' },
      { phase: 'nau', title: 'Đảo cơm lửa to đến khi hạt săn, hơi vàng', minutes: 4 },
      { phase: 'nau', title: 'Cho xá xíu, rau củ, nước tương, hạt nêm, đảo đều', minutes: 2 },
      { phase: 'trang_tri', title: 'Nén cơm vào bát, úp ra đĩa; rắc hành lá, tiêu', detail: 'Ăn kèm dưa leo thái lát.' },
    ],
    product: { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', sku: 'sxx-500g' },
    review: R,
  },

  // ── Xôi & cốm ──
  {
    slug: 'xoi-gac',
    title: 'Xôi gấc đỏ dẻo',
    category: 'xoi-com',
    minutes: 70,
    prepNote: 'Ngâm nếp trước 6–8 tiếng',
    servings: 6,
    level: 'vua',
    summary: 'Hạt xôi đỏ tươi, bóng, dẻo thơm — xôi cho ngày rằm, ngày vui.',
    ingredients: [
      { qty: '500g', name: 'gạo nếp cái hoa vàng' },
      { qty: '1/2 quả', name: 'gấc chín', note: 'khoảng 200g thịt gấc' },
      { qty: '2 thìa canh', name: 'rượu trắng' },
      { qty: '1 thìa cà phê', name: 'muối' },
      { qty: '2 thìa canh', name: 'đường' },
      { qty: '2 thìa canh', name: 'mỡ gà hoặc dầu ăn' },
      { qty: '100ml', name: 'nước cốt dừa', note: 'tuỳ chọn' },
    ],
    tools: ['Khăn đồ xôi Bếp Cô Hạ', 'Chõ hoặc nồi hấp'],
    steps: [
      { phase: 'so_che', title: 'Vo nếp, ngâm 6–8 tiếng (tốt nhất qua đêm)' },
      { phase: 'so_che', title: 'Lấy thịt gấc, trộn rượu, bóp tách hạt', detail: 'Bổ gấc, lấy phần thịt đỏ bọc quanh hạt, trộn 2 thìa rượu, bóp kỹ cho thịt gấc rời khỏi hạt. Bỏ hạt. Rượu giúp màu đỏ tươi và thơm.' },
      { phase: 'so_che', title: 'Để ráo nếp, trộn đều với gấc và muối', detail: 'Bóp nhẹ cho từng hạt nếp đều màu.', minutes: 15 },
      { phase: 'nau', title: 'Lót khăn ẩm vào chõ, cho nếp vào, đồ lửa vừa', minutes: 25 },
      { phase: 'nau', title: 'Trộn đường, mỡ gà (và nước cốt dừa), đồ thêm', detail: 'Xới nhẹ cho đều. Hạt xôi bóng, dẻo, cắn không còn lõi là được.', minutes: 10 },
      { phase: 'trang_tri', title: 'Nén xôi vào khuôn hoặc bát nhỏ, úp ra đĩa', detail: 'Lót lá chuối, rắc dừa nạo hoặc muối vừng.' },
    ],
    product: { name: 'Khăn đồ xôi Bếp Cô Hạ', href: '/khan-do-xoi', sku: 'kdx' },
    review: R,
  },
  {
    slug: 'xoi-dau-xanh',
    title: 'Xôi đậu xanh mỡ hành',
    category: 'xoi-com',
    minutes: 50,
    prepNote: 'Ngâm nếp 6–8 tiếng, đậu xanh 3 tiếng',
    servings: 6,
    level: 'de',
    summary: 'Xôi bùi béo, thơm mỡ hành — bữa sáng no lâu cho cả nhà.',
    ingredients: [
      { qty: '500g', name: 'gạo nếp' },
      { qty: '150g', name: 'đậu xanh cà vỏ' },
      { qty: '1 thìa cà phê', name: 'muối' },
      { qty: '100ml', name: 'nước cốt dừa' },
      { qty: '3 cây', name: 'hành lá', note: 'làm mỡ hành' },
      { qty: '3 thìa canh', name: 'dầu ăn hoặc mỡ' },
      { name: 'Hành phi, muối vừng', note: 'ăn kèm' },
    ],
    tools: ['Khăn đồ xôi Bếp Cô Hạ', 'Chõ hoặc nồi hấp'],
    steps: [
      { phase: 'so_che', title: 'Ngâm nếp 6–8 tiếng, đậu xanh 3 tiếng; vo lại, để ráo' },
      { phase: 'so_che', title: 'Trộn nếp, đậu xanh và muối' },
      { phase: 'nau', title: 'Lót khăn ẩm, đồ xôi', minutes: 15 },
      { phase: 'nau', title: 'Lật đảo, đồ tiếp', minutes: 15 },
      { phase: 'nau', title: 'Rưới nước cốt dừa, đảo nhẹ, đồ thêm', minutes: 5 },
      { phase: 'nau', title: 'Làm mỡ hành', detail: 'Đun nóng dầu, tắt bếp rồi mới cho hành lá thái nhỏ vào, khuấy đều — hành xanh, không bị úa.' },
      { phase: 'trang_tri', title: 'Xới xôi ra đĩa, rưới mỡ hành, rắc hành phi, muối vừng' },
    ],
    product: { name: 'Khăn đồ xôi Bếp Cô Hạ', href: '/khan-do-xoi', sku: 'kdx' },
    review: R,
  },
  {
    slug: 'cha-com',
    title: 'Chả cốm Hà Nội',
    category: 'xoi-com',
    minutes: 40,
    servings: 4,
    level: 'vua',
    summary: 'Vỏ vàng thơm, trong dẻo, lấm tấm hạt cốm xanh — đặc sản mùa thu Hà Nội.',
    ingredients: [
      { qty: '300g', name: 'giò sống', note: 'mua ở hàng giò chả uy tín' },
      { qty: '100g', name: 'cốm', note: 'cốm tươi; cốm khô thì ngâm mềm trước' },
      { qty: '1 thìa cà phê', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'tiêu' },
      { name: 'Dầu ăn, lá chuối', note: 'lá chuối để trình bày' },
    ],
    steps: [
      { phase: 'so_che', title: 'Chuẩn bị cốm', detail: 'Cốm khô: rửa thật nhanh qua nước, để ráo; còn cứng thì ngâm nước ấm cho mềm.', minutes: 5 },
      { phase: 'so_che', title: 'Trộn giò sống, cốm, nước mắm, tiêu; nhồi đều', detail: 'Nhúng tay vào nước để không bị dính. Nhồi đến khi hỗn hợp dẻo, quyện.', minutes: 5 },
      { phase: 'so_che', title: 'Chia viên khoảng 40g, ấn dẹt dày 1cm' },
      { phase: 'nau', title: 'Rán lửa vừa nhỏ, mỗi mặt 4–5 phút', detail: 'Chả vàng đều, ấn thấy chắc tay là chín. Lửa to quá chả cháy ngoài sống trong.', minutes: 10 },
      { phase: 'nau', title: 'Vớt ra giấy thấm dầu' },
      { phase: 'trang_tri', title: 'Bày trên lá chuối', detail: 'Ăn với bún, rau sống, tương ớt.' },
    ],
    review: R,
  },

  // ── Chè & món ngọt ──
  {
    slug: 'che-dau-xanh-cot-dua',
    title: 'Chè đậu xanh nước cốt dừa',
    category: 'che-banh',
    minutes: 45,
    prepNote: 'Ngâm đậu trước 2 tiếng',
    servings: 6,
    level: 'de',
    summary: 'Đậu bở tơi, ngọt thanh, nước cốt dừa béo thơm — ăn nóng hay ăn lạnh đều ngon.',
    ingredients: [
      { qty: '200g', name: 'đậu xanh cà vỏ' },
      { qty: '120g', name: 'đường', note: 'thêm bớt theo khẩu vị' },
      { qty: '2 thìa canh', name: 'bột năng' },
      { qty: '200ml', name: 'nước cốt dừa' },
      { qty: '2 lá', name: 'lá dứa' },
      { qty: '1/4 thìa cà phê', name: 'muối' },
      { name: 'Mè rang', note: 'rắc lên' },
    ],
    steps: [
      { phase: 'so_che', title: 'Ngâm đậu xanh 2 tiếng, vo sạch' },
      { phase: 'nau', title: 'Nấu đậu với 1 lít nước và lá dứa, lửa nhỏ', detail: 'Đến khi đậu mềm bở, bóp nhẹ là tan.', minutes: 30 },
      { phase: 'nau', title: 'Cho đường, khuấy tan, nấu tiếp', minutes: 5 },
      { phase: 'nau', title: 'Hoà 1 thìa bột năng với 3 thìa nước, đổ từ từ vào nồi', detail: 'Vừa đổ vừa khuấy đến khi chè hơi sánh thì tắt bếp.' },
      { phase: 'nau', title: 'Nấu nước cốt dừa', detail: 'Đun lửa nhỏ nước cốt dừa với muối, thêm 1 thìa bột năng hoà nước, khuấy đến khi sánh.', minutes: 3 },
      { phase: 'trang_tri', title: 'Múc chè ra chén, chan nước cốt dừa, rắc mè rang', detail: 'Ăn nóng, hoặc để nguội thêm đá.' },
    ],
    storage: ['Ngăn mát 2 ngày. Nước cốt dừa để riêng.'],
    review: R,
  },
  {
    slug: 'che-com',
    title: 'Chè cốm lá dứa',
    category: 'che-banh',
    minutes: 25,
    servings: 4,
    level: 'de',
    summary: 'Chè trong veo, hạt cốm dẻo thơm mùi lúa non — món quà mùa thu.',
    ingredients: [
      { qty: '100g', name: 'cốm', note: 'cốm khô hoặc cốm tươi' },
      { qty: '120g', name: 'đường' },
      { qty: '2 thìa canh', name: 'bột năng hoặc bột sắn dây' },
      { qty: '2 lá', name: 'lá dứa' },
      { qty: '800ml', name: 'nước' },
      { name: 'Dừa nạo hoặc nước cốt dừa', note: 'tuỳ chọn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Rửa cốm thật nhanh qua nước, để ráo', detail: 'Rửa nhanh tay để hạt cốm không bị nát.' },
      { phase: 'nau', title: 'Đun nước với lá dứa cho thơm, vớt lá ra', minutes: 5 },
      { phase: 'nau', title: 'Cho đường khuấy tan, thả cốm, nấu lửa nhỏ', minutes: 5 },
      { phase: 'nau', title: 'Hoà bột năng với nước lạnh, đổ từ từ, khuấy đều', detail: 'Đến khi chè trong và sánh thì tắt bếp.', minutes: 2 },
      { phase: 'trang_tri', title: 'Múc ra chén, rắc dừa nạo hoặc chan nước cốt dừa' },
    ],
    review: R,
  },

  // ── Món chay ──
  {
    slug: 'dau-phu-sot-ca-chua',
    title: 'Đậu phụ sốt cà chua',
    category: 'mon-chay',
    minutes: 30,
    servings: 3,
    level: 'de',
    summary: 'Đậu vàng mềm, sốt cà chua sánh đỏ — món chay hay mặn đều ngon.',
    ingredients: [
      { qty: '4 bìa', name: 'đậu phụ' },
      { qty: '3 quả', name: 'cà chua chín' },
      { qty: '2 cây', name: 'hành lá' },
      { qty: '2 củ', name: 'hành tím', note: 'ăn chay thuần thì bỏ' },
      { qty: '1 thìa canh', name: 'nước mắm', note: 'ăn chay: thay bằng nước tương' },
      { qty: '1 thìa cà phê', name: 'đường' },
      { name: 'Muối, tiêu, dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Cắt đậu miếng vuông 3cm, thấm thật khô bằng giấy', detail: 'Đậu khô mới chiên không bắn dầu và vàng đẹp.' },
      { phase: 'so_che', title: 'Cà chua bổ múi cau (hoặc băm nhỏ để sốt sánh hơn)' },
      { phase: 'so_che', title: 'Hành lá: phần trắng băm, phần xanh cắt khúc' },
      { phase: 'nau', title: 'Chiên đậu lửa vừa đến vàng các mặt, vớt ra', minutes: 10 },
      { phase: 'nau', title: 'Phi thơm hành, xào cà chua với chút muối', detail: 'Muối giúp cà nhanh nhừ, ra màu đỏ đẹp.', minutes: 5 },
      { phase: 'nau', title: 'Thêm 100ml nước, nêm nước mắm (nước tương), đường; cho đậu vào rim', minutes: 5 },
      { phase: 'trang_tri', title: 'Cho hành lá, tắt bếp; bày đĩa sâu, rắc tiêu' },
    ],
    review: R,
  },
  {
    slug: 'nam-kho-tieu',
    title: 'Nấm kho tiêu',
    category: 'mon-chay',
    minutes: 40,
    servings: 3,
    level: 'de',
    summary: 'Nấm dai ngọt, cay nồng tiêu — món chay đưa cơm cho ngày rằm, mùng một.',
    ingredients: [
      { qty: '300g', name: 'nấm rơm hoặc nấm đùi gà' },
      { qty: '2 thìa canh', name: 'nước tương' },
      { qty: '1 thìa canh', name: 'đường' },
      { qty: '1 thìa cà phê', name: 'tiêu đen hạt', note: 'đập dập' },
      { qty: '1/2 thìa cà phê', name: 'tiêu xay' },
      { qty: '100ml', name: 'nước dừa' },
      { name: 'Dầu ăn, ớt' },
    ],
    steps: [
      { phase: 'so_che', title: 'Cắt chân nấm, rửa nhẹ trong nước muối loãng, để ráo', detail: 'Nấm to thì cắt đôi.' },
      { phase: 'so_che', title: 'Ướp nấm với nước tương, đường, tiêu xay', minutes: 15 },
      { phase: 'nau', title: 'Phi thơm tiêu đập dập, cho nấm vào xào', minutes: 3 },
      { phase: 'nau', title: 'Đổ nước dừa, kho lửa nhỏ đến khi nước sệt', minutes: 15 },
      { phase: 'trang_tri', title: 'Rắc thêm tiêu, ớt; ăn với cơm trắng' },
    ],
    review: R,
  },
  {
    slug: 'dau-phu-chien-sa-ot',
    title: 'Đậu phụ chiên sả ớt',
    category: 'mon-chay',
    minutes: 30,
    servings: 3,
    level: 'de',
    summary: 'Đậu giòn ngoài mềm trong, sả phi vàng thơm lừng.',
    ingredients: [
      { qty: '4 bìa', name: 'đậu phụ' },
      { qty: '3 cây', name: 'sả' },
      { qty: '2 quả', name: 'ớt' },
      { qty: '1 thìa cà phê', name: 'muối hoặc hạt nêm chay' },
      { qty: '1/2 thìa cà phê', name: 'đường' },
      { name: 'Dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Cắt đậu miếng vuông, thấm khô' },
      { phase: 'so_che', title: 'Sả bóc lớp già, băm thật nhỏ; ớt băm' },
      { phase: 'nau', title: 'Chiên đậu vàng giòn các mặt, vớt ra', minutes: 10 },
      { phase: 'nau', title: 'Phi sả lửa nhỏ đến khi vàng thơm', detail: 'Sả cháy rất nhanh — đứng canh, đảo liên tục.', minutes: 4 },
      { phase: 'nau', title: 'Cho ớt, muối, đường; thả đậu vào đảo đều cho sả bám', minutes: 2 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc thêm sả phi lên trên' },
    ],
    review: R,
  },
]

export const findRecipe = (slug: string) => RECIPES.find(r => r.slug === slug)
export const categoryOf = (key: RecipeCategory) => CATEGORIES.find(c => c.key === key)!

/** Dòng nguyên liệu để hiện và để tìm: "800g thịt ba chỉ". */
export const ingredientText = (i: Ingredient) => (i.qty ? `${i.qty} ${i.name}` : i.name)

/** Món của hôm nay: đổi mỗi ngày theo giờ VN, lần lượt qua thư viện. */
export function recipeOfTheDay(vnDayStr: string): Recipe {
  const n = Math.round(Date.parse(vnDayStr + 'T00:00:00Z') / 86400000)
  return RECIPES[((n % RECIPES.length) + RECIPES.length) % RECIPES.length]
}

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase()

/** Tìm không phân biệt dấu: "xa xiu" khớp "xá xíu"; tìm cả theo nguyên liệu ("dau xanh"). */
export function searchRecipes(q: string, list: Recipe[] = RECIPES): Recipe[] {
  const k = norm(q.trim())
  if (!k) return list
  return list.filter(r => norm([r.title, r.summary, ...r.ingredients.map(i => i.name)].join(' ')).includes(k))
}
