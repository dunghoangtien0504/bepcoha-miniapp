// 15 nhóm sản phẩm bán chạy của Bếp Cô Hạ (danh sách Cô Hạ gửi 25/10/2026) — để lồng vào công thức, mẹo vặt, tab Đặt hàng.
// Giá: "Giá ban hành 07/9/26" trong HACO-LOOP/06-DANH-MUC-TOP30.md (giá lẻ). Ảnh: Google Drive của HACO.
// `sku` = mã đang bán được trong giỏ hàng Mini App (catalog của server). Không có `sku` thì khách đặt qua chat Zalo với Bếp
// (đúng chính sách Zalo: không đưa khách ra trang ngoài). Thêm mã vào catalog server thì điền `sku` ở đây.

export type ProductKey =
  | 'set-xoi-com' | 'com-kho' | 'bot-khuc' | 'sot-xa-xiu' | 'khan-do-xoi' | 'set-banh-khuc' | 'hat-sen' | 'sot-nuong'
  | 'set-che-com' | 'sot-tron-nom' | 'set-che-buoi' | 'sot-suon' | 'ca-phe' | 'hanh-phi' | 'gia-vi-ga-u-muoi'

export interface Product {
  key: ProductKey
  name: string
  price: string
  image?: string
  /** Lợi ích ngắn, dùng ở thẻ sản phẩm trong công thức. */
  benefit: string
  sku?: string
  /** Công thức trong app dùng sản phẩm này (slug). */
  recipes?: string[]
}

export const PRODUCTS: Product[] = [
  { key: 'set-xoi-com', name: 'Sét Xôi Cốm Sen Dừa', price: '148.000đ/sét', image: '/images/set-xoi-com/san-pham/z7728489506719_b50b067d25c4d1ac0ef7f35b9a862580.jpg',
    benefit: 'Đủ cốm, đậu xanh, hạt sen, cốt dừa cho 1 mẻ xôi, có sẵn hướng dẫn', sku: 'sxc-set' },
  { key: 'com-kho', name: 'Cốm Khô Bếp Cô Hạ', price: '80.000đ/kg', image: '/images/cong-thuc/com-kho.jpg',
    benefit: 'Cốm khô để được lâu, làm xôi, chè, chả cốm quanh năm (hướng dẫn in trên gói)', recipes: ['cha-com'] },
  { key: 'bot-khuc', name: 'Bột Khúc Sấy Lạnh', price: '100.000đ/100g', image: '/images/cong-thuc/bot-khuc.jpg',
    benefit: 'Lá khúc sấy lạnh, xanh và thơm, không phải đi hái, sơ chế lá' },
  { key: 'sot-xa-xiu', name: 'Sốt Xá Xíu Bếp Cô Hạ', price: '100.000đ/500g', image: '/images/sot-xa-xiu/san-pham/hero-sot-xa-xiu.jpg',
    benefit: 'Ướp 1 lần là đủ vị, lên màu đỏ đẹp, không cần pha thêm', sku: 'sxx-500g', recipes: ['thit-xa-xiu', 'com-chien-xa-xiu'] },
  { key: 'khan-do-xoi', name: 'Khăn Đồ Xôi', price: '49.000đ/chiếc', image: '/images/khan-do-xoi/san-pham/724597989_1683075906108439_2952143396022032152_n.jpg',
    benefit: 'Lót chõ đồ xôi, xôi không dính, không nhão, dùng được nhiều lần', sku: 'kdx' },
  { key: 'set-banh-khuc', name: 'Sét Bánh/Xôi Khúc', price: '148.000đ/sét', image: '/images/san-pham-haco/set-banh-khuc.jpg',
    benefit: 'Bột khúc, bột nếp, đỗ xanh, gia vị nhân, có hướng dẫn trên gói' },
  { key: 'hat-sen', name: 'Hạt Sen Khô', price: '185.000đ/500g', image: '/images/san-pham-haco/hat-sen.jpg',
    benefit: 'Hạt sen bùi, thêm vào xôi, chè cho bữa ngon và đẹp mắt' },
  { key: 'sot-nuong', name: 'Sốt Ướp Nướng', price: '105.000đ/500g', image: '/images/san-pham-haco/sot-nuong.jpg',
    benefit: 'Ướp thịt nướng, nồi chiên không dầu nhanh gọn, đậm vị' },
  { key: 'set-che-com', name: 'Sét Chè Cốm Sen Dừa', price: '148.000đ/sét', image: '/images/san-pham-haco/set-che-com.jpg',
    benefit: 'Cốm, hạt sen, bột khuấy, vani, cốt dừa — chỉ cần thêm dừa sợi, lá nếp' },
  { key: 'sot-tron-nom', name: 'Sốt Trộn Nộm Bếp Cô Hạ', price: '65.000đ/500g', image: '/images/sot-tron-nom/san-pham/710331986_1632696845246594_3341255585345294524_n.jpg',
    benefit: 'Nộm, gỏi chua ngọt vừa vị trong 5 phút', sku: 'stn-500g', recipes: ['nom-tron-5-phut', 'goi-ga-bap-cai'] },
  { key: 'set-che-buoi', name: 'Sét Chè Bưởi', price: '148.000đ/sét', image: '/images/san-pham-haco/set-che-buoi.jpg',
    benefit: 'Cùi bưởi khô, đỗ xanh, đường thốt nốt, bột áo cùi, cốt dừa — đủ cho 1 nồi' },
  { key: 'sot-suon', name: 'Sốt Sườn Chua Ngọt', price: '75.000đ/500g',
    benefit: 'Rim sườn chua ngọt không phải pha nước sốt', recipes: ['suon-xao-chua-ngot'] },
  { key: 'ca-phe', name: 'Cà Phê Phin Hảo Hạng', price: '265.000đ/gói', image: '/images/san-pham-haco/ca-phe.jpg',
    benefit: 'Cà phê phin cho buổi sáng' },
  { key: 'hanh-phi', name: 'Hành Phi Bếp Cô Hạ', price: '135.000đ/500g', image: '/images/san-pham-haco/hanh-phi.jpg',
    benefit: 'Hành phi giòn thơm sẵn, rắc xôi, nộm, canh không phải phi', recipes: ['goi-ga-bap-cai', 'nom-tron-5-phut'] },
  { key: 'gia-vi-ga-u-muoi', name: 'Gia Vị Gà Ủ Muối', price: '135.000đ/gói 350g', image: '/images/san-pham-haco/gia-vi-ga-u-muoi.jpg',
    benefit: '1 gói ủ được 2–3 con gà, da vàng giòn, thịt đậm vị' },
]

export const findProduct = (k: ProductKey) => PRODUCTS.find(p => p.key === k)!

/** Tin nhắn soạn sẵn khi khách bấm "Nhắn Bếp đặt" (mở chat Zalo OA / Zalo của Bếp). */
export const orderMessage = (p: Product) => `Cô ơi, cháu muốn đặt ${p.name} (${p.price}) ạ`
