// Thư viện công thức.
// - Món gắn sản phẩm HACO (xá xíu, nộm, đồ xôi, xôi cốm): lấy từ phần "Hướng dẫn sử dụng" trên trang sản phẩm Haco-OS.
// - Món gia đình còn lại: app biên soạn theo cách nấu phổ biến, viết cho người mới (định lượng cho 3–4 người,
//   cách nhận biết món đã chín). Gắn `review: 'cho_co_ha_duyet'` — Cô Hạ đọc lại định lượng trước khi mở cho khách thật.
// Thêm món: thêm 1 mục; slug không dấu và KHÔNG đổi về sau (Sổ tay, danh sách đi chợ lưu theo slug).
// Bước có `minutes` thì chế độ nấu hiện nút hẹn giờ. Ảnh nằm ở Haco-OS public/images; món chưa có ảnh hiện ảnh minh hoạ.
// Đợt v3-C chuyển thư viện này lên CRM để nhân viên tự thêm món.

import type { ProductKey } from './products'

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
  /** Sản phẩm Bếp Cô Hạ giúp nấu nhanh hơn/ngon hơn — hiện thành thẻ mua kèm trong công thức (src/products.ts). */
  uses?: { product: ProductKey; tip: string }[]
  /** 'nhan' = công thức chép đúng từ hướng dẫn in trên bao bì sản phẩm Bếp Cô Hạ (không cần duyệt lại). */
  source?: 'nhan'
  /** Ảnh không phải của HACO: ghi tác giả + giấy phép (bắt buộc với CC BY / CC BY-SA). Ảnh của HACO thì bỏ trống. */
  imageCredit?: { author: string; license: string; url: string; source?: string }
  /** Dấu hiệu món đã đạt, hiện cuối trang công thức và ở bước cuối chế độ nấu. */
  doneSign?: string
  /** Sản phẩm Bếp Cô Hạ dùng trong món (trang sản phẩm trên Haco-OS, cùng origin). */
  product?: { name: string; href: string; sku: string }
  /** Món có công thức chi tiết trong khoá học / sét, không công khai từng bước. */
  fullRecipeIn?: { label: string; to: string }
  review?: 'cho_co_ha_duyet'
}

const R = 'cho_co_ha_duyet' as const

// KHÔNG đưa vào thư viện các món Bếp đang BÁN hoặc đang DẠY (Cô Hạ, 25/10/2026): xôi các loại, chè các loại, bánh khúc,
// gà ủ muối, cá kho, dưa cà, rau má, bánh mì. Các sản phẩm đó vẫn bán ở tab Đặt hàng (src/products.ts).
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
    image: '/images/cong-thuc/xa-xiu-thanh-pham.jpg',
    summary: 'Lên màu đỏ đẹp, thơm như tiệm mà không cần nêm thêm gia vị. Ướp 1 lần, ăn được 2–3 bữa.',
    ingredients: [
      { qty: '1kg', name: 'thịt nạc vai hoặc ba chỉ', note: 'chọn miếng có chút mỡ xen, dày đều 3–4cm' },
      { qty: '100g', name: 'Sốt Xá Xíu Bếp Cô Hạ', note: 'tỉ lệ 100g sốt cho 1kg thịt' },
      { qty: '1 thìa canh', name: 'dầu ăn', note: 'để áp chảo' },
      { name: 'Dưa leo, cơm trắng', note: 'ăn kèm' },
    ],
    tools: ['Nồi đáy dày', 'Chảo chống dính', 'Khăn giấy'],
    steps: [
      { phase: 'so_che', title: 'Rửa sạch thịt, để ráo, cắt khối dài khoảng 5cm', detail: 'Cắt dọc thớ thành khối dài khoảng 5cm, dày 3–4cm cho chín đều. Thấm khô mặt thịt bằng khăn giấy để sốt bám chặt, lên màu đẹp.' },
      { phase: 'so_che', title: 'Ướp 1kg thịt cùng 100g sốt xá xíu', detail: 'Trộn và bóp nhẹ cho sốt phủ kín mọi mặt. Đậy kín, để ngăn mát, ướp đủ 1–2 tiếng để lên màu đều, đẹp mắt. Giữa chừng trở mặt thịt 1 lần.', minutes: 90 },
      { phase: 'nau', title: 'Cho thịt cùng phần sốt ướp vào nồi, đổ nước xâm xấp mặt thịt', detail: 'Nước chỉ vừa ngang mặt thịt, không ngập hẳn, để nước sốt rút lại sánh.' },
      { phase: 'nau', title: 'Đun đến khi thịt mềm', detail: 'Đun lửa nhỏ, không cần lửa lớn. Khoảng 15 phút trở mặt thịt 1 lần. Xiên đũa vào miếng thịt thấy dễ là mềm.', minutes: 40 },
      { phase: 'nau', title: 'Đun tiếp cho nước sốt sánh lại rồi tắt bếp', detail: 'Mở vung, lửa vừa, đảo nhẹ cho sốt bám bóng quanh miếng thịt. Giữ lại phần nước sốt trong nồi để rưới khi ăn.' },
      { phase: 'nau', title: 'Khi ăn, áp chảo cho thơm', detail: 'Chảo nóng với 1 thìa dầu, áp chảo lửa vừa, mỗi mặt 1–2 phút, phết thêm ít nước sốt cho bóng. Tránh lửa to vì sốt có đường dễ cháy khét.' },
      { phase: 'trang_tri', title: 'Để nghỉ 3–5 phút rồi thái lát mỏng, xếp ra đĩa', detail: 'Để thịt nghỉ cho nước thịt ngấm lại, thái ngược thớ lát mỏng thì mềm, không vụn.' },
      { phase: 'trang_tri', title: 'Ăn kèm và rưới sốt', detail: 'Ăn với cơm trắng, dưa leo, rưới chút nước sốt còn trong nồi. Thịt thừa thái hạt lựu làm cơm chiên xá xíu.' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.', 'Ướp xong chưa nấu ngay thì để ngăn mát, đậy kín.', 'Nấu 1kg, áp chảo dần từng bữa cho thịt luôn nóng giòn cạnh.'],
    storage: ['Sốt: ngăn đông dùng được 6 tháng, ngăn mát 1 tháng.', 'Thịt đã nấu: hộp kín, ngăn mát, áp chảo lại trước khi ăn.'],
    doneSign: 'Miếng thịt đỏ bóng, cạnh hơi xém thơm; thái ra mềm, không còn màu hồng ở giữa.',
    product: { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', sku: 'sxx-500g' },
    uses: [{ product: 'sot-xa-xiu', tip: 'Thay cả chục loại gia vị pha sốt (mật ong, tương, ngũ vị hương, dầu hào, màu hạt điều) bằng 1 hũ sốt, tiết kiệm khoảng 20 phút cân đo.' }],
    review: R,
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
      { qty: '500g', name: 'rau củ, thịt hoặc tôm', note: 'vd 200g dưa leo, 150g cà rốt, 150g bắp cải; hoặc thêm tai heo, tôm luộc' },
      { qty: '50–80ml', name: 'Sốt Trộn Nộm Bếp Cô Hạ', note: 'cho 500g nguyên liệu' },
      { name: 'Đậu phộng rang, hành phi, rau thơm, ớt sợi' },
      { name: 'Nước đá, muối, giấm', note: 'để ngâm rau' },
    ],
    steps: [
      { phase: 'so_che', title: 'Thái sợi rau củ', detail: 'Dưa leo bỏ ruột, cà rốt, bắp cải thái sợi mảnh đều tay để thấm sốt nhanh. Thịt, tôm luộc chín, thái mỏng.' },
      { phase: 'so_che', title: 'Ngâm rau củ trong nước đá + muối + giấm để giòn', detail: 'Pha khoảng 1 lít nước đá với 1 thìa cà phê muối và 1 thìa canh giấm, ngâm rau cho giòn và bớt hăng.', minutes: 15 },
      { phase: 'so_che', title: 'Vớt rau ra, để ráo nước', detail: 'Rau, thịt phải ráo hết nước trước khi trộn để gỏi không bị nhão. Có thể vắt nhẹ hoặc quay ráo.' },
      { phase: 'nau', title: 'Cho 50–80ml sốt cho 500g nguyên liệu, trộn đều', detail: 'Rưới sốt từ từ, trộn nhẹ tay bằng đũa. Nếm thử rồi thêm sốt theo khẩu vị gia đình.' },
      { phase: 'nau', title: 'Để ngấm trước khi ăn', detail: 'Để khoảng 10 phút cho rau ngấm sốt, không để quá lâu kẻo rau ra nước.', minutes: 10 },
      { phase: 'trang_tri', title: 'Rắc đậu phộng rang, hành phi, rau thơm, ớt sợi lên trên', detail: 'Rắc ngay trước khi ăn để đậu phộng và hành phi còn giòn.' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.', 'Muốn cay hơn: thêm ớt băm tươi.', 'Trộn lượng nhỏ trước, nếm thử rồi điều chỉnh theo khẩu vị gia đình.'],
    doneSign: 'Rau còn giòn, sốt sệt bám đều từng sợi, không đọng nước dưới đĩa.',
    product: { name: 'Sốt Trộn Nộm Bếp Cô Hạ', href: '/sot-tron-nom', sku: 'stn-500g' },
    uses: [
      { product: 'sot-tron-nom', tip: 'Không phải pha nước mắm chua ngọt, 5 phút là có đĩa nộm vừa vị.' },
      { product: 'hanh-phi', tip: 'Rắc hành phi giòn sẵn, không phải phi hành.' },
    ],
    review: R,
  },
  {
    slug: 'thit-kho-trung',
    title: 'Thịt kho trứng nước dừa',
    category: 'mon-man',
    minutes: 100,
    servings: 4,
    level: 'de',
    image: '/images/cong-thuc/thit-kho-trung.jpg',
    imageCredit: { author: 'HungryHuy', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Vietnamese_thit_kho,_braised_pork_belly_and_boiled_eggs.jpg' },
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
    doneSign: 'Thịt mềm, xiên đũa dễ; trứng thấm màu nâu; nước kho sánh, màu cánh gián.',
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
    doneSign: 'Sườn chín mềm, sốt sánh bóng bám đều; vị chua ngọt hài hoà.',
    uses: [{ product: 'sot-suon', tip: 'Cách nhanh: bỏ bước pha nước sốt, rim sườn với Sốt Sườn Chua Ngọt của Bếp theo lượng in trên chai.' }],
    steps: [
      { phase: 'so_che', title: 'Rửa sườn với muối, chần qua nước sôi', detail: 'Chần 3 phút cho sạch bọt, vớt ra rửa lại, để ráo.', minutes: 3 },
      { phase: 'so_che', title: 'Ướp sườn', detail: '1 thìa nước mắm, nửa thìa đường, một nửa tỏi băm, chút tiêu.', minutes: 20 },
      { phase: 'so_che', title: 'Pha bát sốt', detail: '1 thìa nước mắm + 1,5 thìa đường + 2 thìa giấm + 3 thìa tương cà + 4 thìa nước lọc. Khuấy tan đường.' },
      { phase: 'nau', title: 'Chiên sườn vàng các mặt rồi vớt ra', detail: 'Lửa vừa, chiên đến khi sườn vàng đều và săn chắc.', minutes: 10 },
      { phase: 'nau', title: 'Phi hành tỏi, xào cà chua', detail: 'Để lại 1 thìa dầu trong chảo. Cà chua thái hạt lựu, xào mềm.', minutes: 2 },
      { phase: 'nau', title: 'Cho sườn vào, đổ bát sốt, rim lửa nhỏ', detail: 'Đảo đều đến khi sốt sánh lại và bám bóng quanh miếng sườn. Nếm lại cho vừa chua ngọt.', minutes: 10 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc hành lá, rau mùi, mè rang', detail: 'Rắc hành rau khi còn nóng để dậy mùi; ăn ngay khi nước sốt còn sánh bóng.' },
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
    image: '/images/cong-thuc/ga-luoc-la-chanh.jpg',
    imageCredit: { author: 'Sjschen', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:BeiQieJi-WhiteCutChicken.jpg' },
    summary: 'Da vàng giòn, thịt ngọt, không bị đỏ xương — cách luộc gà chuẩn cho người mới.',
    ingredients: [
      { qty: '1 con', name: 'gà ta', note: 'khoảng 1,2–1,5kg' },
      { qty: '1 củ', name: 'gừng' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '1 thìa canh', name: 'muối' },
      { qty: '1 nắm', name: 'lá chanh non' },
      { name: 'Muối, tiêu, chanh, ớt', note: 'pha muối chấm' },
    ],
    doneSign: 'Da vàng căng, không nứt; xiên đùi gà không còn nước hồng chảy ra.',
    uses: [{ product: 'gia-vi-ga-u-muoi', tip: 'Muốn gà vàng da, giòn và thơm thảo mộc hơn: thử gói Gia Vị Gà Ủ Muối của Bếp, cách làm in sẵn trên gói.' }],
    steps: [
      { phase: 'so_che', title: 'Làm sạch gà', detail: 'Nhổ sạch lông tơ, xát muối và gừng đập dập khắp thân, rửa lại nước sạch.' },
      { phase: 'so_che', title: 'Nướng sơ gừng và hành tím rồi đập dập', detail: 'Nướng trên bếp đến khi vỏ hơi cháy, dậy mùi thơm.' },
      { phase: 'nau', title: 'Cho gà vào nồi nước LẠNH, đun đến sôi', detail: 'Nước ngập gà, thêm gừng, hành, 1 thìa muối. Bắt đầu từ nước lạnh để gà chín đều từ trong ra. Sôi thì hớt bọt.' },
      { phase: 'nau', title: 'Hạ lửa nhỏ, luộc', detail: 'Nước chỉ lăn tăn, không sôi mạnh để da gà không nứt. Tắt bếp, đậy vung ngâm thêm 10 phút cho gà chín tới mà thịt vẫn mềm.', minutes: 15 },
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
    image: '/images/cong-thuc/thit-rang-chay-canh.jpg',
    imageCredit: { author: 'Buileducanh', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Thit_rang_chay_canh.jpg' },
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
    doneSign: 'Thịt vàng xém cạnh, săn lại, mỡ trong; nước rim bám đều miếng thịt.',
    uses: [{ product: 'sot-nuong', tip: 'Biến tấu: ướp ba chỉ với Sốt Ướp Nướng của Bếp rồi nướng nồi chiên không dầu (lượng sốt theo hướng dẫn trên hũ).' }],
    steps: [
      { phase: 'so_che', title: 'Rửa thịt, thái lát mỏng 3–4mm', detail: 'Để thịt vào ngăn đá 15 phút trước khi thái sẽ dễ thái mỏng đều.' },
      { phase: 'so_che', title: 'Thái hành tím, cắt hành lá', detail: 'Thái hành tím mỏng để phi nhanh vàng; tách riêng hành lá để cho vào cuối, giữ màu xanh.' },
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
    doneSign: 'Mặt trứng vàng đều, bên trong chín tới, thịt và mộc nhĩ rải đều.',
    steps: [
      { phase: 'so_che', title: 'Ngâm mộc nhĩ cho nở, thái nhỏ', detail: 'Ngâm nước ấm khoảng 10 phút là nở đều; cắt bỏ phần chân cứng rồi thái sợi nhỏ.', minutes: 10 },
      { phase: 'so_che', title: 'Ướp thịt với hành tím băm, nửa thìa nước mắm, tiêu', detail: 'Ướp vừa đủ, thịt sẽ ngấm mà không ra nước khi chiên trứng.', minutes: 10 },
      { phase: 'nau', title: 'Xào thịt và mộc nhĩ đến khi thịt hết màu hồng', detail: 'Xào lửa vừa, đảo tơi để thịt không vón cục; để nguội bớt rồi mới trộn trứng, tránh trứng bị chín lổn nhổn.', minutes: 4 },
      { phase: 'nau', title: 'Đánh tan trứng với nửa thìa nước mắm và hành lá, trộn thịt vào', detail: 'Đánh trứng vừa tan, không cần nổi bọt; trộn đều để thịt rải khắp mặt trứng.' },
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
    doneSign: 'Tôm đỏ au, vỏ bóng; nước rim sệt bám quanh con tôm.',
    steps: [
      { phase: 'so_che', title: 'Cắt râu, chân tôm; rạch lưng lấy chỉ đen', detail: 'Giữ vỏ để tôm giòn và đỏ đẹp. Rửa sạch, để ráo.' },
      { phase: 'so_che', title: 'Ướp tôm', detail: 'Một nửa hành tỏi băm + 1 thìa nước mắm + 1 thìa đường + tiêu.', minutes: 15 },
      { phase: 'nau', title: 'Phi thơm phần hành tỏi còn lại, cho tôm vào đảo lửa to', detail: 'Đảo đến khi tôm đỏ đều.', minutes: 2 },
      { phase: 'nau', title: 'Thêm nửa thìa đường và 2 thìa nước, rim lửa vừa', detail: 'Rim đến khi nước cạn, sệt lại và bám bóng quanh vỏ tôm.', minutes: 10 },
      { phase: 'trang_tri', title: 'Thêm ớt, hành lá, tiêu; xếp ra đĩa', detail: 'Rắc hành lá và tiêu lúc tắt bếp; tôm đạt khi vỏ đỏ au, nước rim sệt bám đều quanh con tôm.' },
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
    doneSign: 'Thịt bò vừa chín, còn mềm; hành tây trong và vẫn giòn.',
    steps: [
      { phase: 'so_che', title: 'Thái bò mỏng NGANG thớ', detail: 'Nhìn các thớ thịt chạy dọc, đặt dao cắt vuông góc với thớ — bò sẽ mềm, không dai.' },
      { phase: 'so_che', title: 'Ướp bò', detail: 'Nửa phần tỏi băm + dầu hào + tiêu + bột năng + 1 thìa dầu ăn. Dầu giúp bò không dính chảo và giữ mềm.', minutes: 15 },
      { phase: 'so_che', title: 'Hành tây bổ múi cau, tách lớp', detail: 'Bổ múi cau dày khoảng 1cm rồi tách lớp, xào nhanh vẫn còn giòn ngọt.' },
      { phase: 'nau', title: 'Chảo thật nóng, lửa to: phi tỏi, xào bò', detail: 'Xào đến khi bò vừa đổi màu thì trút ra đĩa ngay.', minutes: 2 },
      { phase: 'nau', title: 'Xào hành tây lửa to', detail: 'Không cần rửa chảo. Hành tây vừa chín tới, còn giòn.', minutes: 2 },
      { phase: 'nau', title: 'Cho bò vào lại, nêm nước mắm, đường, đảo 30 giây rồi tắt bếp', detail: 'Đảo nhanh tay trong 30 giây; xào lâu thịt bò sẽ dai và ra nước.' },
      { phase: 'trang_tri', title: 'Rắc tiêu, hành lá, rau mùi', detail: 'Rắc khi vừa tắt bếp, bày ra đĩa ngay để hơi nóng không làm bò chín thêm.' },
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
    image: '/images/cong-thuc/canh-chua-ca.jpg',
    imageCredit: { author: 'Phương Huy', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Canh_chua_cá_lóc_ở_Thủy_Trúc_Quán,_đường_Nguyễn_Nhữ_Lãm_(2).jpg' },
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
    doneSign: 'Nước canh trong, vị chua dịu, cá chín trắng mà không nát.',
    steps: [
      { phase: 'so_che', title: 'Làm sạch cá với muối và gừng, ướp nửa thìa nước mắm, tiêu', detail: 'Chà cá với muối và gừng đập dập rồi rửa lại cho hết nhớt, canh sẽ không tanh.', minutes: 10 },
      { phase: 'so_che', title: 'Ngâm me với 200ml nước ấm, dầm lấy nước, bỏ hạt', detail: 'Dùng nước ấm để me tan nhanh; lọc bỏ hạt và xơ cho nước canh trong.', minutes: 10 },
      { phase: 'so_che', title: 'Sơ chế rau', detail: 'Cà chua bổ múi; dứa thái lát; bạc hà tước vỏ, thái xéo, bóp chút muối rồi rửa lại (đỡ ngứa); đậu bắp thái xéo; rau ngổ, ngò gai thái nhỏ.' },
      { phase: 'nau', title: 'Đun sôi 1,5 lít nước với nước me, dứa, cà chua', detail: 'Nêm nước mắm, đường, chút muối đến khi vị chua ngọt hài hoà.' },
      { phase: 'nau', title: 'Nước sôi lại thì thả cá, nấu lửa vừa, hớt bọt', detail: 'Cá chín khi thịt trắng đục, tách thớ dễ dàng.', minutes: 10 },
      { phase: 'nau', title: 'Cho đậu bắp, nấu thêm', detail: 'Đậu bắp chín nhanh, nấu lâu sẽ nhớt và nhũn.', minutes: 2 },
      { phase: 'nau', title: 'Thả bạc hà và giá rồi tắt bếp ngay', detail: 'Rau cho sau cùng mới giòn, xanh.' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc rau ngổ, ngò gai, tỏi phi, ớt lát', detail: 'Cho rau thơm khi đã múc ra tô để rau giữ màu xanh và mùi thơm.' },
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
    image: '/images/cong-thuc/canh-bi-dao-tom.jpg',
    imageCredit: { author: 'roland', license: 'CC0', url: 'https://www.flickr.com/photos/35034347371@N01/44513407', source: 'Flickr' },
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
    doneSign: 'Bí trong, mềm, còn giữ miếng; nước canh trong, ngọt vị tôm.',
    steps: [
      { phase: 'so_che', title: 'Gọt vỏ bí, bỏ ruột, cắt miếng vừa ăn', detail: 'Gọt sạch phần vỏ xanh, khoét bỏ ruột xốp; cắt miếng dày khoảng 1cm cho chín đều.' },
      { phase: 'so_che', title: 'Bóc vỏ tôm, bỏ chỉ, băm nhỏ', detail: 'Tôm băm nấu canh ngọt nước hơn để nguyên con.' },
      { phase: 'so_che', title: 'Ướp tôm với nửa thìa nước mắm và tiêu', detail: 'Ướp sơ giúp tôm ngọt và chắc thịt hơn khi nấu.', minutes: 5 },
      { phase: 'nau', title: 'Phi thơm hành tím, xào tôm cho săn', detail: 'Xào đến khi tôm vừa đỏ là đủ, không xào lâu kẻo tôm dai.', minutes: 1 },
      { phase: 'nau', title: 'Đổ 1 lít nước, đun sôi, cho bí vào', detail: 'Nấu lửa vừa đến khi bí trong và mềm.', minutes: 8 },
      { phase: 'nau', title: 'Nêm nước mắm, muối; tắt bếp, cho hành lá và tiêu', detail: 'Nêm khi bí đã trong và mềm (xiên đũa thấy dễ). Nếm lại trước khi tắt bếp.' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc hành lá', detail: 'Ăn nóng; canh để nguội bí sẽ ngả màu vàng.' },
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
    doneSign: 'Cải vừa chín, còn xanh; nước canh trong, ngọt thịt.',
    steps: [
      { phase: 'so_che', title: 'Nhặt, rửa cải, cắt khúc 4cm', detail: 'Ngâm cải trong nước muối loãng 5 phút rồi rửa lại; cắt khúc đều để chín cùng lúc.' },
      { phase: 'so_che', title: 'Ướp thịt với hành tím băm, nửa thìa nước mắm, tiêu', detail: 'Ướp vừa đủ cho thịt ngấm, khi nấu canh sẽ ngọt hơn.', minutes: 10 },
      { phase: 'nau', title: 'Phi thơm hành, xào thịt cho săn', detail: 'Dùng đũa đảo tơi thịt để không vón cục.', minutes: 2 },
      { phase: 'nau', title: 'Đổ 1 lít nước, đun sôi, hớt bọt', detail: 'Hớt bọt kỹ thì nước canh trong và không bị mùi.' },
      { phase: 'nau', title: 'Cho cải vào, nấu đến khi cải vừa chín', detail: 'Cải chuyển xanh đậm là được, đừng nấu lâu kẻo nhũn và vàng.', minutes: 3 },
      { phase: 'nau', title: 'Nêm nước mắm, hạt nêm, tắt bếp', detail: 'Cho cải vào trước, đun sôi lại khoảng 1–2 phút đến khi cải vừa chín tới, còn xanh, rồi mới nêm và tắt bếp.' },
      { phase: 'trang_tri', title: 'Múc ra tô, rắc tiêu', detail: 'Ăn nóng; cải để lâu trong nồi sẽ bị vàng.' },
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
    image: '/images/cong-thuc/rau-muong-xao-toi.jpg',
    imageCredit: { author: 'Phương Huy', license: 'Public domain', url: 'https://commons.wikimedia.org/wiki/File:Rau_muống_xào_tỏi,_tháng_4_năm_2018.jpg' },
    summary: 'Mẹo chần 30 giây giúp rau xanh mướt, giòn, không thâm.',
    ingredients: [
      { qty: '1 bó', name: 'rau muống', note: 'khoảng 500g' },
      { qty: '1 củ', name: 'tỏi' },
      { qty: '1 thìa canh', name: 'nước mắm', note: 'hoặc nửa thìa hạt nêm' },
      { qty: '1 thìa canh', name: 'dầu ăn' },
    ],
    doneSign: 'Rau xanh mướt, giòn, không ra nước; thơm mùi tỏi phi.',
    steps: [
      { phase: 'so_che', title: 'Nhặt lấy ngọn và lá non, rửa sạch, để ráo', detail: 'Ngâm rau 5 phút trong nước muối loãng rồi để ráo thật kỹ; rau còn nước sẽ bị úng khi xào.' },
      { phase: 'so_che', title: 'Đập dập, băm tỏi', detail: 'Đập dập trước rồi băm, tỏi sẽ thơm hơn.' },
      { phase: 'so_che', title: 'Chần rau 30 giây trong nước sôi có chút muối, vớt ra ngâm nước đá', detail: 'Bước này giữ rau xanh giòn. Vớt ra để thật ráo.', minutes: 1 },
      { phase: 'nau', title: 'Phi tỏi vàng, vớt ra một nửa để rắc lên sau', detail: 'Phi lửa vừa đến khi tỏi vàng nhạt là vớt ngay; tỏi cháy sẽ đắng.' },
      { phase: 'nau', title: 'Lửa to, cho rau vào đảo nhanh, nêm nước mắm', detail: 'Chảo phải thật nóng. Đảo liên tục để rau chín đều, giữ màu xanh và độ giòn; rau vừa mềm là tắt bếp.', minutes: 2 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc tỏi phi', detail: 'Bày ra đĩa ngay, rắc phần tỏi phi đã vớt ra lên trên.' },
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
    image: '/images/cong-thuc/goi-ga-bap-cai.jpg',
    imageCredit: { author: 'T.Tseng', license: 'CC BY 2.0', url: 'https://www.flickr.com/photos/68147320@N02/43126707124', source: 'Flickr' },
    summary: 'Bắp cải giòn, gà xé ngọt, sốt trộn sẵn — đĩa gỏi đãi khách trong nửa tiếng.',
    ingredients: [
      { qty: '300g', name: 'thịt gà luộc', note: 'ức hoặc đùi' },
      { qty: '300g', name: 'bắp cải', note: 'khoảng 1/4 bắp' },
      { qty: '1 củ', name: 'cà rốt' },
      { qty: '1/2 củ', name: 'hành tây' },
      { qty: '60ml', name: 'Sốt Trộn Nộm Bếp Cô Hạ' },
      { name: 'Rau răm, đậu phộng rang, hành phi' },
    ],
    doneSign: 'Bắp cải giòn, gà thấm sốt; vị chua ngọt vừa, không bị ra nước.',
    uses: [{ product: 'sot-tron-nom', tip: 'Sốt trộn sẵn vị chua ngọt, trộn là ăn.' }, { product: 'hanh-phi', tip: 'Rắc hành phi giòn ngay trước khi ăn.' }],
    steps: [
      { phase: 'so_che', title: 'Thái bắp cải thật mỏng, cà rốt bào sợi', detail: 'Ngâm vào nước đá có chút muối cho giòn, rồi vắt thật ráo.', minutes: 10 },
      { phase: 'so_che', title: 'Hành tây thái mỏng, ngâm nước đá cho bớt hăng', detail: 'Ngâm nước đá giúp hành tây giòn và bớt hăng; vớt ra để thật ráo.', minutes: 10 },
      { phase: 'so_che', title: 'Xé gà thành sợi vừa ăn', detail: 'Xé theo thớ thịt, sợi vừa ăn; bỏ bớt da nếu thích gỏi thanh.' },
      { phase: 'nau', title: 'Trộn rau, gà với 60ml sốt, để ngấm', detail: 'Rau phải ráo nước thì gỏi mới không nhão.', minutes: 10 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc rau răm, đậu phộng, hành phi', detail: 'Trộn xong ăn trong khoảng 15 phút để bắp cải còn giòn.' },
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
    image: '/images/cong-thuc/com-chien-xa-xiu.jpg',
    imageCredit: { author: 'Peachyeung316', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Fried_rice_in_home.jpg' },
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
    doneSign: 'Hạt cơm săn, tơi, vàng nhẹ; không dính chảo, không bị nhão.',
    uses: [{ product: 'sot-xa-xiu', tip: 'Chưa có xá xíu sẵn? Ướp thịt với Sốt Xá Xíu của Bếp, nấu 1 lần ăn được cả cơm và cơm chiên.' }],
    steps: [
      { phase: 'so_che', title: 'Bóp tơi cơm nguội', detail: 'Cơm nguội để qua đêm là ngon nhất. Bóp tơi để hạt không dính chùm.' },
      { phase: 'so_che', title: 'Thái xá xíu và cà rốt hạt lựu', detail: 'Thái hạt lựu đều tay để chín đều và đẹp mắt.' },
      { phase: 'so_che', title: 'Luộc chín cà rốt và đậu Hà Lan', detail: 'Luộc vừa chín tới, vớt ra để ráo; rau còn nước sẽ làm cơm bị nhão.', minutes: 3 },
      { phase: 'nau', title: 'Chảo nóng 2 thìa dầu, đổ trứng đánh tan, đảo tơi', detail: 'Cho cơm vào ngay khi trứng còn hơi ướt để trứng bám vào hạt cơm.' },
      { phase: 'nau', title: 'Đảo cơm lửa to đến khi hạt săn, hơi vàng', detail: 'Lửa to, đảo liên tục và dàn mỏng cơm ra chảo; hạt cơm săn, kêu lách tách là được.', minutes: 4 },
      { phase: 'nau', title: 'Cho xá xíu, rau củ, nước tương, hạt nêm, đảo đều', detail: 'Đảo nhanh cho đều màu; nêm vừa phải vì xá xíu đã có vị đậm.', minutes: 2 },
      { phase: 'trang_tri', title: 'Nén cơm vào bát, úp ra đĩa; rắc hành lá, tiêu', detail: 'Ăn kèm dưa leo thái lát.' },
    ],
    product: { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', sku: 'sxx-500g' },
    review: R,
  },

  // ── Xôi & cốm ──
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
    doneSign: 'Mặt chả vàng đều, bên trong dẻo, thơm mùi cốm.',
    uses: [{ product: 'com-kho', tip: 'Cốm khô của Bếp làm chả cốm được quanh năm, không đợi mùa cốm.' }],
    steps: [
      { phase: 'so_che', title: 'Chuẩn bị cốm', detail: 'Cốm khô: rửa thật nhanh qua nước, để ráo; còn cứng thì ngâm nước ấm cho mềm.', minutes: 5 },
      { phase: 'so_che', title: 'Trộn giò sống, cốm, nước mắm, tiêu; nhồi đều', detail: 'Nhúng tay vào nước để không bị dính. Nhồi đến khi hỗn hợp dẻo, quyện.', minutes: 5 },
      { phase: 'so_che', title: 'Chia viên khoảng 40g, ấn dẹt dày 1cm', detail: 'Thấm chút dầu ăn vào tay trước khi nặn để chả không dính tay và mặt chả mịn.' },
      { phase: 'nau', title: 'Rán lửa vừa nhỏ, mỗi mặt 4–5 phút', detail: 'Chả vàng đều, ấn thấy chắc tay là chín. Lửa to quá chả cháy ngoài sống trong.', minutes: 10 },
      { phase: 'nau', title: 'Vớt ra giấy thấm dầu', detail: 'Đặt chả lên giấy thấm dầu vài phút cho bớt ngấy, ăn khi còn ấm.' },
      { phase: 'trang_tri', title: 'Bày trên lá chuối', detail: 'Ăn với bún, rau sống, tương ớt.' },
    ],
    review: R,
  },

  // ── Chè & món ngọt ──
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
    doneSign: 'Đậu vàng mặt, mềm trong; sốt cà đỏ sánh, bám đều miếng đậu.',
    steps: [
      { phase: 'so_che', title: 'Cắt đậu miếng vuông 3cm, thấm thật khô bằng giấy', detail: 'Đậu khô mới chiên không bắn dầu và vàng đẹp.' },
      { phase: 'so_che', title: 'Cà chua bổ múi cau (hoặc băm nhỏ để sốt sánh hơn)', detail: 'Băm nhỏ thì sốt sánh và bám đậu hơn; bổ múi cau thì còn miếng cà đẹp mắt.' },
      { phase: 'so_che', title: 'Hành lá: phần trắng băm, phần xanh cắt khúc', detail: 'Phần trắng phi cùng hành tím cho thơm, phần xanh cho vào cuối.' },
      { phase: 'nau', title: 'Chiên đậu lửa vừa đến vàng các mặt, vớt ra', detail: 'Thấm thật khô đậu trước khi chiên để dầu không bắn. Lật nhẹ tay khi mặt dưới đã vàng.', minutes: 10 },
      { phase: 'nau', title: 'Phi thơm hành, xào cà chua với chút muối', detail: 'Muối giúp cà nhanh nhừ, ra màu đỏ đẹp.', minutes: 5 },
      { phase: 'nau', title: 'Thêm 100ml nước, nêm nước mắm (nước tương), đường; cho đậu vào rim', detail: 'Rim lửa nhỏ cho sốt ngấm vào đậu; sốt sánh lại là được.', minutes: 5 },
      { phase: 'trang_tri', title: 'Cho hành lá, tắt bếp; bày đĩa sâu, rắc tiêu', detail: 'Tắt bếp ngay khi cho hành lá để giữ màu xanh.' },
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
    image: '/images/cong-thuc/nam-kho-tieu.jpg',
    imageCredit: { author: 'Phương Huy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:M%C3%B3n_%C4%83n_c%C3%BAng_%C4%91%C6%B0a,_T%E1%BA%BFt_2022_(m%C3%B3n_n%E1%BA%A5m_x%C3%A0o_chay)_(4).jpg', source: 'Wikimedia Commons' },
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
    doneSign: 'Nấm săn, thấm vị, nước kho sệt và thơm mùi tiêu.',
    steps: [
      { phase: 'so_che', title: 'Cắt chân nấm, rửa nhẹ trong nước muối loãng, để ráo', detail: 'Nấm to thì cắt đôi.' },
      { phase: 'so_che', title: 'Ướp nấm với nước tương, đường, tiêu xay', detail: 'Rửa nấm nhanh, để thật ráo rồi mới ướp để nấm thấm gia vị.', minutes: 15 },
      { phase: 'nau', title: 'Phi thơm tiêu đập dập, cho nấm vào xào', detail: 'Phi tiêu lửa nhỏ vừa dậy mùi là cho nấm vào ngay; tiêu cháy sẽ đắng.', minutes: 3 },
      { phase: 'nau', title: 'Đổ nước dừa, kho lửa nhỏ đến khi nước sệt', detail: 'Kho lửa nhỏ, thỉnh thoảng đảo nhẹ; nước còn sệt bám quanh nấm là tắt bếp.', minutes: 15 },
      { phase: 'trang_tri', title: 'Rắc thêm tiêu, ớt; ăn với cơm trắng', detail: 'Nấm kho để qua bữa vẫn ngon, đun nóng lại trước khi ăn.' },
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
    doneSign: 'Đậu vàng giòn ngoài, mềm trong; sả phi vàng bám đều.',
    steps: [
      { phase: 'so_che', title: 'Cắt đậu miếng vuông, thấm khô', detail: 'Đặt đậu lên khăn sạch, thấm khô các mặt để chiên giòn và ít bắn dầu.' },
      { phase: 'so_che', title: 'Sả bóc lớp già, băm thật nhỏ; ớt băm', detail: 'Sả băm càng nhỏ thì phi càng giòn và bám vào đậu càng nhiều.' },
      { phase: 'nau', title: 'Chiên đậu vàng giòn các mặt, vớt ra', detail: 'Dầu đủ nóng mới thả đậu; chiên lửa vừa, lật khi mặt dưới đã vàng.', minutes: 10 },
      { phase: 'nau', title: 'Phi sả lửa nhỏ đến khi vàng thơm', detail: 'Sả cháy rất nhanh — đứng canh, đảo liên tục.', minutes: 4 },
      { phase: 'nau', title: 'Cho ớt, muối, đường; thả đậu vào đảo đều cho sả bám', detail: 'Đảo nhanh tay trên lửa nhỏ để sả không cháy mà bám đều miếng đậu.', minutes: 2 },
      { phase: 'trang_tri', title: 'Bày đĩa, rắc thêm sả phi lên trên', detail: 'Ăn ngay khi còn giòn, chấm kèm tương ớt.' },
    ],
    review: R,
  },
  {
    slug: 'ga-rang-gung',
    title: 'Gà rang gừng',
    category: 'mon-man',
    minutes: 40,
    servings: 4,
    level: 'de',
    image: '/images/cong-thuc/ga-rang-gung.jpg',
    imageCredit: { author: 'NickNguyen', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/24606258@N05/3748516748', source: 'Flickr' },
    summary: 'Gà săn, thấm vị mặn ngọt, thơm cay gừng — ăn với cơm nóng ngày mưa thì hết nồi.',
    ingredients: [
      { qty: '600g', name: 'thịt gà ta', note: 'đùi hoặc cánh, chặt miếng vừa ăn' },
      { qty: '1 củ', name: 'gừng', note: 'khoảng 50g, thái sợi' },
      { qty: '3 củ', name: 'hành tím' },
      { qty: '2 tép', name: 'tỏi' },
      { qty: '2 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa canh', name: 'đường' },
      { qty: '1/2 thìa cà phê', name: 'tiêu' },
      { qty: '1 thìa canh', name: 'dầu ăn' },
      { name: 'Hành lá' },
    ],
    steps: [
      { phase: 'so_che', title: 'Rửa gà với muối và chút gừng đập dập, để ráo', detail: 'Chà nhẹ muối lên da rồi rửa lại nước sạch, thấm khô để khi rang gà săn, không bắn dầu.' },
      { phase: 'so_che', title: 'Gừng cạo vỏ, thái sợi; hành tím, tỏi băm', detail: 'Để riêng một nắm gừng sợi rắc lúc cuối cho thơm.' },
      { phase: 'so_che', title: 'Ướp gà với nước mắm, đường, tiêu, nửa phần hành tỏi', detail: 'Trộn đều cho gia vị bám khắp miếng gà.', minutes: 20 },
      { phase: 'nau', title: 'Phi thơm phần hành tỏi còn lại và gừng sợi', detail: 'Lửa vừa, phi đến khi gừng dậy mùi, hành vàng nhạt.' },
      { phase: 'nau', title: 'Cho gà vào đảo đến khi săn và vàng mặt', detail: 'Lửa vừa lớn, đảo đều tay khoảng 5 phút để gà săn, không ra nhiều nước.', minutes: 5 },
      { phase: 'nau', title: 'Đậy vung, hạ lửa nhỏ cho gà chín và cạn nước', detail: 'Thỉnh thoảng đảo. Khi nước rút gần hết, mở vung đảo thêm cho gà bám màu cánh gián.', minutes: 12 },
      { phase: 'trang_tri', title: 'Nêm lại, rắc gừng sợi, hành lá rồi tắt bếp', detail: 'Nếm thử, thiếu mặn thêm chút nước mắm. Bày ra đĩa khi còn nóng.' },
    ],
    doneSign: 'Thịt gà chín săn, xiên không còn nước hồng; da vàng cánh gián, sốt sệt bám đều, thơm gừng.',
    tips: ['Dùng gừng già cho vị cay ấm, gừng non thì thơm dịu hơn.'],
    review: R,
  },
  {
    slug: 'thit-luoc-cham-mam',
    title: 'Thịt luộc chấm mắm tỏi',
    category: 'mon-man',
    minutes: 35,
    servings: 4,
    level: 'de',
    image: '/images/cong-thuc/thit-luoc-cham-mam.jpg',
    imageCredit: { author: 'Phương Huy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Cam_L%E1%BB%99_th5n2023_(m%C3%B3n_%C4%83n_%C4%91%E1%BB%8Ba_ph%C6%B0%C6%A1ng,_th%E1%BB%8Bt_lu%E1%BB%99c_Cam_L%E1%BB%99)_(2).jpg', source: 'Wikimedia Commons' },
    summary: 'Thịt trắng hồng, mềm ngọt, chấm mắm tỏi ớt — món nhanh mà nhà nào cũng thích.',
    ingredients: [
      { qty: '600g', name: 'thịt ba chỉ', note: 'hoặc thịt nách, để nguyên miếng' },
      { qty: '1 củ', name: 'gừng' },
      { qty: '2 củ', name: 'hành tím' },
      { qty: '1 thìa cà phê', name: 'muối' },
      { qty: '3 tép', name: 'tỏi', note: 'pha mắm' },
      { qty: '1 quả', name: 'ớt' },
      { qty: '3 thìa canh', name: 'nước mắm' },
      { qty: '1 thìa canh', name: 'đường' },
      { name: 'Chanh, rau sống, dưa leo', note: 'ăn kèm' },
    ],
    steps: [
      { phase: 'so_che', title: 'Chà thịt với muối, rửa sạch', detail: 'Cạo sạch bì, chà muối rồi rửa lại để thịt trắng và không hôi.' },
      { phase: 'nau', title: 'Đun sôi nước với gừng đập dập, hành tím nướng sơ', detail: 'Nước đủ ngập thịt, thêm 1 thìa cà phê muối.' },
      { phase: 'nau', title: 'Thả thịt vào, đun sôi lại rồi hạ lửa nhỏ', detail: 'Hớt bọt. Luộc lửa liu riu, không sôi bùng để thịt chín đều, không bị dai.', minutes: 20 },
      { phase: 'nau', title: 'Tắt bếp, ngâm thêm trong nồi', detail: 'Đậy vung ngâm 5 phút. Xiên đũa vào chỗ dày nhất không thấy nước hồng là chín.', minutes: 5 },
      { phase: 'nau', title: 'Vớt thịt ngâm vào bát nước lạnh', detail: 'Ngâm 2–3 phút cho thịt săn lại, khi thái không bị vụn.' },
      { phase: 'trang_tri', title: 'Pha mắm tỏi ớt', detail: '3 thìa nước mắm, 1 thìa đường, 2 thìa nước lọc, khuấy tan rồi cho tỏi ớt băm, vắt chút chanh.' },
      { phase: 'trang_tri', title: 'Thái lát mỏng, xếp đĩa', detail: 'Dùng dao sắc thái ngang thớ, lát mỏng đều. Ăn kèm rau sống, dưa leo.' },
    ],
    doneSign: 'Thịt trắng hồng, bì trong, lát thái mềm mà không vụn, không còn nước hồng.',
    review: R,
  },
  {
    slug: 'canh-mong-toi-thit-bam',
    title: 'Canh mồng tơi thịt băm',
    category: 'canh',
    minutes: 20,
    servings: 4,
    level: 'de',
    image: '/images/cong-thuc/canh-mong-toi-thit-bam.jpg',
    imageCredit: { author: 'Phương Huy', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Nh%C3%A0_m%C3%ACnh_L%E1%BB%85_30th4n2023_(t%C3%B4_canh_rau)_(1).jpg', source: 'Wikimedia Commons' },
    summary: 'Canh rau mát, ngọt nước thịt — 20 phút là xong, hợp ngày nóng.',
    ingredients: [
      { qty: '300g', name: 'rau mồng tơi', note: 'nhặt lá và ngọn non' },
      { qty: '150g', name: 'thịt heo xay' },
      { qty: '1 củ', name: 'hành tím' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'hạt nêm' },
      { name: 'Tiêu' },
    ],
    steps: [
      { phase: 'so_che', title: 'Nhặt mồng tơi, rửa sạch, để ráo', detail: 'Lấy lá và ngọn non; ngâm nước muối loãng 5 phút rồi rửa lại. Vò nhẹ lá cho canh sánh nhẹ nếu thích.' },
      { phase: 'so_che', title: 'Ướp thịt với hành tím băm, chút nước mắm, tiêu', detail: 'Ướp khoảng 10 phút cho thịt ngấm.', minutes: 10 },
      { phase: 'nau', title: 'Đun sôi 1 lít nước, cho thịt vào, dùng đũa đánh tơi', detail: 'Đánh tơi ngay khi cho thịt để không vón cục. Hớt bọt cho nước trong.' },
      { phase: 'nau', title: 'Cho mồng tơi vào, đun sôi lại 1–2 phút', detail: 'Rau vừa chín mềm, còn xanh là được. Nấu lâu rau bị nhũn và thâm.', minutes: 2 },
      { phase: 'trang_tri', title: 'Nêm nước mắm, hạt nêm, tắt bếp, rắc tiêu', detail: 'Nếm lại cho vừa. Múc ra tô ăn nóng.' },
    ],
    doneSign: 'Rau xanh, mềm vừa; nước canh trong, ngọt thịt, sánh nhẹ.',
    review: R,
  },
  {
    slug: 'trung-chien-hanh',
    title: 'Trứng chiên hành lá',
    category: 'mon-man',
    minutes: 15,
    servings: 3,
    level: 'de',
    image: '/images/cong-thuc/trung-chien-hanh.jpg',
    imageCredit: { author: 'anokarina', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/30760976@N04/7774216922', source: 'Flickr' },
    summary: 'Trứng vàng mềm, thơm hành — món cứu bữa khi bận, 15 phút là có.',
    ingredients: [
      { qty: '4 quả', name: 'trứng gà' },
      { qty: '3 cây', name: 'hành lá' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/4 thìa cà phê', name: 'tiêu' },
      { qty: '2 thìa canh', name: 'dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Hành lá rửa sạch, thái nhỏ', detail: 'Để ráo nước để khi chiên trứng không bị bắn dầu.' },
      { phase: 'so_che', title: 'Đập trứng, thêm nước mắm, tiêu, hành, đánh tan', detail: 'Đánh vừa tan đều, có thể thêm 1 thìa nước lọc cho trứng mềm xốp hơn.' },
      { phase: 'nau', title: 'Làm nóng chảo với dầu, đổ trứng, xoay đều chảo', detail: 'Lửa vừa. Dàn mỏng đều mặt chảo để trứng chín cùng lúc.' },
      { phase: 'nau', title: 'Chiên đến khi mặt dưới vàng, lật mặt', detail: 'Khoảng 2 phút mỗi mặt. Muốn trứng mềm thì gấp đôi khi mặt trên còn hơi ướt.', minutes: 4 },
      { phase: 'trang_tri', title: 'Cắt miếng, bày đĩa', detail: 'Ăn nóng với cơm, chấm nước mắm ớt.' },
    ],
    doneSign: 'Trứng vàng đều hai mặt, bên trong chín mềm, không cháy, thơm hành.',
    review: R,
  },
  {
    slug: 'bap-cai-xao-ca-chua',
    title: 'Bắp cải xào cà chua',
    category: 'rau-goi',
    minutes: 15,
    servings: 4,
    level: 'de',
    summary: 'Bắp cải giòn ngọt, cà chua chua dịu — đĩa rau đẹp mắt, rẻ và nhanh.',
    ingredients: [
      { qty: '400g', name: 'bắp cải', note: 'khoảng 1/3 bắp' },
      { qty: '2 quả', name: 'cà chua' },
      { qty: '2 tép', name: 'tỏi' },
      { qty: '1 thìa canh', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'đường' },
      { qty: '1 thìa canh', name: 'dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Tách lá bắp cải, rửa sạch, thái miếng vừa ăn', detail: 'Ngâm nước muối loãng 5 phút, rửa lại, để thật ráo.' },
      { phase: 'so_che', title: 'Cà chua bổ múi cau, tỏi đập dập', detail: 'Cà chua chín đỏ sẽ cho màu và vị đẹp hơn.' },
      { phase: 'nau', title: 'Phi tỏi, cho cà chua vào xào mềm', detail: 'Lửa vừa, đảo đến khi cà chua ra nước, hơi nát.', minutes: 2 },
      { phase: 'nau', title: 'Cho bắp cải vào, lửa to, đảo nhanh', detail: 'Đảo liên tục để bắp cải chín đều mà vẫn giòn.', minutes: 3 },
      { phase: 'trang_tri', title: 'Nêm nước mắm, đường, đảo đều rồi tắt bếp', detail: 'Bắp cải vừa mềm, còn giòn là tắt bếp, bày đĩa ngay.' },
    ],
    doneSign: 'Bắp cải chín tới, còn giòn; cà chua mềm, sốt đỏ bám đều.',
    review: R,
  },
  {
    slug: 'dau-que-xao-thit',
    title: 'Đậu que xào thịt bò',
    category: 'mon-man',
    minutes: 20,
    servings: 4,
    level: 'de',
    image: '/images/cong-thuc/dau-que-xao-thit.jpg',
    imageCredit: { author: 'Laurel Fan', license: 'CC BY-SA 2.0', url: 'https://www.flickr.com/photos/18295242@N00/50537449', source: 'Flickr' },
    summary: 'Đậu xanh giòn, thịt bò mềm thơm tỏi — một đĩa vừa rau vừa thịt.',
    ingredients: [
      { qty: '300g', name: 'đậu que', note: 'tước xơ, cắt khúc 4cm' },
      { qty: '200g', name: 'thịt bò', note: 'thái mỏng' },
      { qty: '3 tép', name: 'tỏi' },
      { qty: '1 thìa canh', name: 'dầu hào' },
      { qty: '1 thìa cà phê', name: 'nước mắm' },
      { qty: '1/2 thìa cà phê', name: 'tiêu' },
      { qty: '2 thìa canh', name: 'dầu ăn' },
    ],
    steps: [
      { phase: 'so_che', title: 'Thái bò mỏng ngang thớ, ướp dầu hào, tiêu, chút tỏi', detail: 'Thái ngang thớ thì thịt mềm. Thêm 1 thìa cà phê dầu ăn khi ướp để bò không bị khô.', minutes: 10 },
      { phase: 'so_che', title: 'Đậu que tước xơ, cắt khúc, chần qua nước sôi', detail: 'Chần 1–2 phút có chút muối rồi xả nước lạnh, đậu giữ màu xanh và giòn.', minutes: 2 },
      { phase: 'nau', title: 'Xào bò lửa to đến khi vừa tái, trút ra', detail: 'Chảo thật nóng, xào nhanh khoảng 1 phút để bò không dai.', minutes: 1 },
      { phase: 'nau', title: 'Phi tỏi, cho đậu que vào xào', detail: 'Đảo nhanh khoảng 2 phút, nêm nước mắm.', minutes: 2 },
      { phase: 'trang_tri', title: 'Cho bò vào lại, đảo đều 30 giây, tắt bếp', detail: 'Bày đĩa ngay, rắc thêm tiêu.' },
    ],
    doneSign: 'Đậu que xanh giòn; thịt bò chín tới, mềm, thơm tỏi.',
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
