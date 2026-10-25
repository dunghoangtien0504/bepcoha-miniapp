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
  // Zalo của Bếp (số in trên nhãn sản phẩm và trang Set xôi cốm). Bản Zalo không dùng link này, chỉ dùng OA.
  zaloChat: import.meta.env.VITE_ZALO_CHAT_URL || 'https://zalo.me/0965240587',
  combo: import.meta.env.VITE_COMBO_URL || '',
  publicUrl: import.meta.env.VITE_PUBLIC_URL || '',
  oaId: import.meta.env.VITE_ZALO_OA_ID || '',
  // Ô "Group bếp" mở nhóm Zalo của Cô Hạ (link dạng https://zalo.me/g/…). [CHỜ HACO] gửi link nhóm.
  zaloGroup: import.meta.env.VITE_ZALO_GROUP_URL || '',
  // Nhóm Facebook (lấy từ trang /dua-ca-muoi của Haco-OS) — chỉ dùng khi chưa có nhóm Zalo.
  facebookGroup: 'https://www.facebook.com/groups/congthuccoha',
  youtube: 'https://www.youtube.com/@Cohadaynauan8386/featured',
}

/** Ảnh nằm ở Haco-OS public/images (cùng origin dưới /m; bản mock trỏ sang Haco-OS dev qua VITE_ASSET_ORIGIN). Link https (ảnh sự kiện do CRM nhập) giữ nguyên. */
export const asset = (path: string) => (/^https:\/\//.test(path) ? path : (import.meta.env.VITE_ASSET_ORIGIN || '') + path)
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

/** Banner trượt trang chủ (v5). Slide đầu là chiến dịch đang chạy; chữ lấy từ nội dung đã có, không tự hứa thêm. [CHỜ HACO] ảnh banner riêng. */
export const BANNERS = [
  BANNER,
  {
    title: 'Sốt Xá Xíu Bếp Cô Hạ',
    subtitle: 'Lên màu đỏ đẹp, thơm như tiệm',
    image: '/images/sot-xa-xiu/san-pham/hero-sot-xa-xiu.jpg',
    to: '/dat-hang',
  },
  {
    title: 'Cơm nhà mỗi ngày',
    subtitle: 'Công thức từng bước, có hẹn giờ khi nấu',
    image: '/images/cong-thuc/thit-kho-trung.jpg',
    to: '/cong-thuc',
  },
]

/** Khoá học chỉ hiện khi đã có ít nhất 1 video bài học (phản biện CEO: đừng dẫn khách vào khoá rỗng). */
export const COURSE_READY = LESSONS.some(l => !!l.videoUrl)

/**
 * Cộng đồng "Góc bếp chị em" (v7). Theo chính sách Zalo Mini App mục 4.6: KHÔNG có đăng bài, thả tim, bình luận trong app.
 * Khách gửi ảnh cho Bếp qua chat OA → nhân viên chọn ảnh, xin phép, rồi thêm vào GALLERY dưới đây (ảnh để ở Haco-OS public/images/cong-dong).
 * Trò chuyện sôi nổi diễn ra trong Nhóm Zalo của Cô và Nhật ký Zalo (nơi Zalo cho phép).
 */
export const COMMUNITY = {
  challenge: {
    title: 'Thử thách tuần: Thịt kho trứng',
    body: 'Tuần này cùng nấu thịt kho trứng nước dừa. Đăng ảnh nồi thịt kho của chị — Cô chọn những nồi đẹp nhất để khen và ghim lên đầu Góc bếp.',
    recipe: 'thit-kho-trung',
  },
  /** Ảnh đã được duyệt. `by` để trống thì ghi "Lớp học của Bếp Cô Hạ". */
  gallery: [
    { image: '/images/cong-dong/lop-104.jpg', caption: 'Xôi ngũ sắc', by: '' },
    { image: '/images/cong-dong/lop-142.jpg', caption: 'Mẹt xôi lá chuối', by: '' },
    { image: '/images/cong-dong/lop-131.jpg', caption: 'Xôi màu', by: '' },
    { image: '/images/cong-dong/lop-206.jpg', caption: 'Bánh khúc nhân đỗ thịt', by: '' },
    { image: '/images/cong-dong/lop-10.jpg', caption: 'Chè caramen dừa', by: '' },
    { image: '/images/cong-dong/lop-26.jpg', caption: 'Chè thập cẩm', by: '' },
    { image: '/images/cong-dong/lop-22.jpg', caption: 'Chè khoai dẻo', by: '' },
    { image: '/images/cong-dong/lop-61.jpg', caption: 'Chè nhiều vị', by: '' },
  ] as { image: string; caption: string; by: string }[],
}
