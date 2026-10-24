// Nội dung Mini App. Phần đánh dấu [CHỜ HACO] là chỗ trống, chờ Cô Hạ/đội media cung cấp —
// không tự bịa công thức, giá hay lời hứa.

export const BRAND = {
  name: 'Bếp Cô Hạ',
  company: 'HACO Food',
  tagline: 'Tinh hoa từ hạt cốm Việt',
}

export const COURSE = {
  title: 'Học làm xôi cốm cùng Cô Hạ',
  subtitle: '8 bài ngắn, mỗi ngày mở 1 bài. Miễn phí cho khách của Bếp.',
  introVideoUrl: '', // [CHỜ HACO] video chào 20 giây của Cô Hạ
}

export interface Lesson {
  no: number
  title: string
  videoUrl: string // [CHỜ HACO]
  /** Nguyên liệu dùng trong bài — "hộp đen" (B4·9): sản phẩm nằm trong bài học, không chào bán riêng. */
  ingredients: string[]
}

// Tên bài theo HACO Funnel Map V1. Video và nguyên liệu: [CHỜ HACO].
export const LESSONS: Lesson[] = [
  { no: 1, title: 'Chọn nguyên liệu', videoUrl: '', ingredients: [] },
  { no: 2, title: 'Sơ chế cốm', videoUrl: '', ingredients: [] },
  { no: 3, title: 'Ngâm & xử lý', videoUrl: '', ingredients: [] },
  { no: 4, title: 'Đồ xôi', videoUrl: '', ingredients: [] },
  { no: 5, title: 'Trộn cốm', videoUrl: '', ingredients: [] },
  { no: 6, title: 'Các lỗi thường gặp', videoUrl: '', ingredients: [] },
  { no: 7, title: 'Bảo quản', videoUrl: '', ingredients: [] },
  { no: 8, title: 'Những món ngon khác từ cốm', videoUrl: '', ingredients: [] },
]

// Câu đồng ý: bản gốc nằm ở server (Haco-OS lib/mini-consent.ts, map text_version → text, có text_hash).
// Câu hiển thị ở đây PHẢI trùng từng chữ với bản ở server cho cùng text_version.
export const CONSENT = {
  textVersion: 'mini-2026-10-v1',
  text: 'Tôi đồng ý để HACO Food (Bếp Cô Hạ) lưu số điện thoại này và liên hệ qua Zalo/điện thoại để hướng dẫn nấu, chăm sóc sau mua và gửi ưu đãi. Tôi có thể huỷ bất cứ lúc nào.',
}

export const LINKS = {
  messenger: import.meta.env.VITE_MESSENGER_URL || '',
  zaloChat: import.meta.env.VITE_ZALO_CHAT_URL || '',
  combo: import.meta.env.VITE_COMBO_URL || '',
  publicUrl: import.meta.env.VITE_PUBLIC_URL || '',
  oaId: import.meta.env.VITE_ZALO_OA_ID || '',
  // Lấy từ trang /dua-ca-muoi của Haco-OS (kênh thật của Cô Hạ).
  group: import.meta.env.VITE_GROUP_URL || 'https://www.facebook.com/groups/congthuccoha',
  youtube: 'https://www.youtube.com/@Cohadaynauan8386/featured',
}

/** Ảnh nằm ở Haco-OS public/images. Chạy dưới /m thì cùng origin; bản mock trỏ sang Haco-OS dev qua VITE_ASSET_ORIGIN. */
export const asset = (path: string) => (import.meta.env.VITE_ASSET_ORIGIN || '') + path
/** Trang của Haco-OS (vd /sot-xa-xiu): cùng quy tắc với ảnh. */
export const siteUrl = asset

/** Banner trang chủ, đổi theo chiến dịch. [CHỜ HACO] ảnh banner riêng; tạm dùng ảnh sản phẩm có sẵn. */
export const BANNER = {
  title: 'Mùa cốm mới đã về',
  subtitle: 'Học làm xôi cốm cùng Cô Hạ — miễn phí',
  image: '/images/set-xoi-com/san-pham/617872378_1514279540421659_2701416559612899466_n.jpg',
  to: '/khoa-hoc',
}

/** Tab "Đặt hàng" ở v2-A: dẫn sang trang sản phẩm đang bán trên Haco-OS (giỏ hàng trong app là đợt v2-B). */
export const SHOP_ITEMS = [
  { name: 'Sét Nguyên Liệu Xôi Cốm Sen Dừa', href: '/set-xoi-com', image: '/images/set-xoi-com/san-pham/z7728489506719_b50b067d25c4d1ac0ef7f35b9a862580.jpg' },
  { name: 'Sốt Xá Xíu Bếp Cô Hạ', href: '/sot-xa-xiu', image: '/images/sot-xa-xiu/san-pham/hero-sot-xa-xiu.jpg' },
  { name: 'Sốt Trộn Nộm Bếp Cô Hạ', href: '/sot-tron-nom', image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg' },
  { name: 'Khăn đồ xôi Bếp Cô Hạ', href: '/khan-do-xoi', image: '/images/khan-do-xoi/san-pham/724597989_1683075906108439_2952143396022032152_n.jpg' },
]
