// Thư viện công thức. Nội dung lấy từ phần "Hướng dẫn sử dụng" trên các trang sản phẩm của HACO
// (Haco-OS/app/<sản phẩm>/page.tsx) — không tự bịa công thức. Muốn thêm món: thêm 1 mục, slug không dấu và không đổi về sau
// (Sổ tay của khách lưu theo slug). Ảnh nằm ở Haco-OS public/images (cùng origin khi chạy dưới /m).

export type RecipeCategory = 'xoi-com' | 'mon-man' | 'mon-nhanh'

export const CATEGORIES: { key: RecipeCategory; label: string }[] = [
  { key: 'xoi-com', label: 'Xôi & cốm' },
  { key: 'mon-man', label: 'Món mặn' },
  { key: 'mon-nhanh', label: 'Món nhanh' },
]

export interface Recipe {
  slug: string
  title: string
  category: RecipeCategory
  minutes: number
  image: string
  summary: string
  ingredients: string[]
  steps: { title: string; detail?: string }[]
  tips?: string[]
  storage?: string[]
  /** Sản phẩm Bếp Cô Hạ dùng trong món (trang sản phẩm trên Haco-OS, cùng origin). */
  product?: { name: string; href: string; sku: string }
  /** Món có công thức chi tiết trong khoá học / sét, không công khai từng bước. */
  fullRecipeIn?: { label: string; to: string }
}

export const RECIPES: Recipe[] = [
  {
    slug: 'thit-xa-xiu',
    title: 'Thịt xá xíu áp chảo',
    category: 'mon-man',
    minutes: 90,
    image: '/images/sot-xa-xiu/san-pham/xa-xiu-com-trang.jpg',
    summary: 'Lên màu đỏ đẹp, thơm như tiệm mà không cần nêm thêm gia vị.',
    ingredients: ['1kg thịt (nạc vai hoặc ba chỉ)', '100g Sốt Xá Xíu Bếp Cô Hạ'],
    steps: [
      { title: 'Ướp 1kg thịt cùng 100g sốt xá xíu' },
      { title: 'Trộn đều, ướp 1–2 giờ cho ngấm', detail: 'Ướp đủ 1–2 tiếng để lên màu đều, đẹp mắt.' },
      { title: 'Đổ nước xâm xấp mặt thịt, đun đến khi thịt mềm', detail: 'Đun lửa nhỏ, không cần lửa lớn.' },
      { title: 'Khi ăn, áp chảo cho thơm là hoàn tất', detail: 'Áp chảo lửa vừa, tránh cháy khét.' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.'],
    storage: ['Sốt: ngăn đông dùng được 6 tháng, ngăn mát 1 tháng.'],
    product: { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', sku: 'sxx-500g' },
  },
  {
    slug: 'nom-tron-5-phut',
    title: 'Nộm trộn 5 phút',
    category: 'mon-nhanh',
    minutes: 30,
    image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg',
    summary: 'Rau giòn, sốt sệt bám đều từng sợi — có khách bất ngờ cũng làm kịp.',
    ingredients: ['500g rau củ, thịt hoặc tôm tuỳ thích', '50–80ml Sốt Trộn Nộm Bếp Cô Hạ', 'Đậu phộng rang, hành phi, rau thơm, ớt sợi', 'Nước đá, muối, giấm để ngâm rau'],
    steps: [
      { title: 'Ngâm rau củ trong nước đá + muối + giấm 15–20 phút để giòn' },
      { title: 'Vớt rau ra, để ráo nước', detail: 'Rau, thịt phải ráo hết nước trước khi trộn để gỏi không bị nhão.' },
      { title: 'Cho 50–80ml sốt cho 500g nguyên liệu, trộn đều' },
      { title: 'Để ngấm 10–15 phút trước khi ăn' },
      { title: 'Rắc đậu phộng rang, hành phi, rau thơm, ớt sợi lên trên' },
    ],
    tips: ['Sốt đã cân bằng vị, không cần thêm gia vị.', 'Muốn cay hơn: thêm ớt băm tươi.', 'Trộn lượng nhỏ trước, nếm thử rồi điều chỉnh theo khẩu vị gia đình.'],
    product: { name: 'Sốt Trộn Nộm Bếp Cô Hạ', href: '/sot-tron-nom', sku: 'stn-500g' },
  },
  {
    slug: 'do-xoi-bang-khan',
    title: 'Đồ xôi dẻo, không dính',
    category: 'xoi-com',
    minutes: 45,
    image: '/images/khan-do-xoi/thanh-pham/724485203_2296217747574178_5800612475932619747_n.jpg',
    summary: 'Xôi ráo, hạt bóng, lấy ra không dính khăn — đẹp như hàng bán.',
    ingredients: ['Gạo nếp (ngâm trước 4–8 tiếng)', 'Khăn đồ xôi Bếp Cô Hạ', 'Chõ hoặc nồi hấp'],
    steps: [
      { title: 'Ngâm nếp 4–8 tiếng', detail: 'Nếp nở đều → đồ nhanh hơn, chín đều hơn.' },
      { title: 'Làm ẩm khăn, lót vào chõ', detail: 'Khăn ẩm (không ướt đẫm) — hơi thấm qua đều, không đọng nước.' },
      { title: 'Đổ nếp, phủ khăn lên trên', detail: 'Khăn phủ hút hơi ngưng tụ, xôi không bị ướt từ trên xuống.' },
      { title: 'Đồ 30–40 phút, lật đảo 1 lần', detail: 'Lật ở phút 20 — phần trên xuống dưới, chín đều.' },
      { title: 'Ủ 5 phút rồi lấy ra', detail: 'Xôi ráo, hạt bóng, lấy ra không dính khăn.' },
    ],
    product: { name: 'Khăn đồ xôi Bếp Cô Hạ', href: '/khan-do-xoi', sku: 'kdx' },
  },
  {
    slug: 'xoi-com-sen-dua',
    title: 'Xôi cốm sen dừa',
    category: 'xoi-com',
    minutes: 60,
    image: '/images/set-xoi-com/san-pham/722705000_1642171887632423_3979564310912375133_n.jpg',
    summary: 'Món làm nên tên tuổi Bếp Cô Hạ. 8 nguyên liệu, công thức bí quyết từng bước.',
    ingredients: ['Cốm khô', 'Đậu xanh đã cà vỏ', 'Hạt sen khô', 'Bột cốt dừa', 'Đường kính trắng', 'Muối tinh', 'Bột nghệ', 'Lá dứa'],
    steps: [
      { title: 'Chuẩn bị đủ 8 nguyên liệu', detail: 'Sét Xôi Cốm Sen Dừa đã chọn sẵn đủ bộ, đúng loại.' },
      { title: 'Làm theo công thức bí quyết của Cô Hạ', detail: 'Tỷ lệ và từng bước có trong sét và trong khoá "Học làm xôi cốm cùng Cô Hạ".' },
    ],
    product: { name: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa', href: '/set-xoi-com', sku: 'sxc-set' },
    fullRecipeIn: { label: 'Học từng bước trong khoá xôi cốm', to: '/hoc' },
  },
]

export const findRecipe = (slug: string) => RECIPES.find(r => r.slug === slug)

/** Món của hôm nay: đổi mỗi ngày theo giờ VN, lần lượt qua thư viện. */
export function recipeOfTheDay(vnDayStr: string): Recipe {
  const n = Math.round(Date.parse(vnDayStr + 'T00:00:00Z') / 86400000)
  return RECIPES[((n % RECIPES.length) + RECIPES.length) % RECIPES.length]
}

/** Tìm không phân biệt dấu: "xa xiu" khớp "xá xíu". */
export function searchRecipes(q: string, list: Recipe[] = RECIPES): Recipe[] {
  const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase()
  const k = norm(q.trim())
  if (!k) return list
  return list.filter(r => norm([r.title, r.summary, ...r.ingredients].join(' ')).includes(k))
}
