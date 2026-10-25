// Mẹo vặt nấu ăn (yêu cầu của Cô Hạ 25/10: "nhiều người thích xem mẹo vặt").
// - source 'nhan': lấy đúng từ hướng dẫn in trên bao bì sản phẩm Bếp Cô Hạ.
// - Còn lại: kiến thức bếp phổ biến do app biên soạn, gắn review 'cho_co_ha_duyet' — Cô Hạ đọc lại trước khi mở cho khách thật.
// Mẹo nào gắn `product` thì có nút mua; gắn `recipe` thì có nút xem công thức. id không đổi về sau.
import type { ProductKey } from './products'

export type TipCategory = 'so_che' | 'khu_mui' | 'xoi_com' | 'bao_quan' | 'nau_nhanh' | 'an_toan'

export const TIP_CATEGORIES: { key: TipCategory; label: string; emoji: string }[] = [
  { key: 'so_che', label: 'Sơ chế', emoji: '🔪' },
  { key: 'khu_mui', label: 'Khử mùi tanh', emoji: '🐟' },
  { key: 'xoi_com', label: 'Xôi, cốm, chè', emoji: '🍚' },
  { key: 'nau_nhanh', label: 'Nấu nhanh, ngon hơn', emoji: '⏱' },
  { key: 'bao_quan', label: 'Bảo quản', emoji: '🧊' },
  { key: 'an_toan', label: 'An toàn bếp', emoji: '🛡' },
]

export interface Tip {
  id: string
  category: TipCategory
  title: string
  body: string
  product?: ProductKey
  recipe?: string
  source?: 'nhan'
  review?: 'cho_co_ha_duyet'
}

const R = 'cho_co_ha_duyet' as const

export const TIPS: Tip[] = [
  // Xôi, cốm, chè — phần lớn từ nhãn sản phẩm của Bếp
  { id: 'vo-com-30-giay', category: 'xoi_com', source: 'nhan', product: 'com-kho',
    title: 'Cốm khô chỉ vo nhanh 30 giây', body: 'Vo cốm khô nhanh trong nước khoảng 30 giây để loại bụi. Không ngâm lâu, cốm sẽ nhão và nở quá.' },
  { id: 'sen-luoc-2-lan', category: 'xoi_com', source: 'nhan', product: 'hat-sen',
    title: 'Hạt sen luộc 2 lần mới trắng và bùi', body: 'Luộc hạt sen 5 phút, đổ ra rửa lại, rồi luộc lần 2 đến khi chín mềm mà không nát.' },
  { id: 'dau-xanh-nghe', category: 'xoi_com', source: 'nhan', product: 'set-xoi-com',
    title: 'Đậu xanh vàng đẹp nhờ chút bột nghệ', body: 'Ngâm đậu xanh qua đêm, xóc cùng 1 chút muối và ít bột nghệ trước khi hấp, đậu lên màu vàng đẹp.' },
  { id: 'la-dua-xung-hap', category: 'xoi_com', source: 'nhan', product: 'set-xoi-com',
    title: 'Thả lá dứa vào nước hấp', body: 'Đun sôi nước trong xửng hấp rồi thả vài lá dứa, xôi dậy mùi thơm mà không cần hương liệu.' },
  { id: 'cui-buoi-vat-kho', category: 'xoi_com', source: 'nhan', product: 'set-che-buoi',
    title: 'Cùi bưởi càng khô càng giòn', body: 'Rửa cùi nhiều lần rồi vắt thật kiệt nước. Cùi càng khô càng dễ ngấm bột, xóc bột càng kỹ cùi càng giòn.' },
  { id: 'com-khong-nau-lau', category: 'xoi_com', source: 'nhan', product: 'set-che-com',
    title: 'Chè cốm chỉ đun 1–2 phút', body: 'Cho cốm vào nồi nước đường đang sôi, đun sôi lại 1–2 phút là đủ. Đun lâu cốm sẽ nát.' },
  { id: 'khan-do-xoi', category: 'xoi_com', product: 'khan-do-xoi', review: R,
    title: 'Lót khăn đồ xôi, xôi không dính, không đọng nước', body: 'Làm ẩm khăn (không ướt đẫm), lót đáy chõ và phủ một lớp lên trên. Khăn hút hơi nước đọng nên xôi ráo, hạt bóng.' },

  // Sơ chế
  { id: 'trung-de-boc', category: 'so_che', recipe: 'thit-kho-trung', review: R,
    title: 'Trứng luộc dễ bóc vỏ', body: 'Cho trứng vào nước lạnh rồi mới bật bếp. Luộc xong ngâm ngay vào nước lạnh 5 phút, vỏ tách ra dễ dàng.' },
  { id: 'rau-muong-xanh', category: 'so_che', recipe: 'rau-muong-xao-toi', review: R,
    title: 'Rau muống xào xanh giòn', body: 'Để rau thật ráo nước, chảo thật nóng, đảo nhanh tay. Rau vừa mềm là tắt bếp và bày ra đĩa ngay.' },
  { id: 'hanh-tay-khong-cay', category: 'so_che', review: R,
    title: 'Thái hành tây không cay mắt', body: 'Để hành tây vào ngăn mát 15–20 phút trước khi thái và dùng dao thật sắc. Thái xong ngâm nước đá cho bớt hăng, giòn hơn.' },
  { id: 'dau-phu-khong-ban', category: 'so_che', recipe: 'dau-phu-sot-ca-chua', review: R,
    title: 'Chiên đậu phụ không bắn dầu', body: 'Thấm thật khô mặt đậu bằng khăn sạch trước khi chiên. Dầu đủ nóng mới thả đậu, lật khi mặt dưới đã vàng.' },
  { id: 'com-nguoi-chien', category: 'nau_nhanh', recipe: 'com-chien-xa-xiu', review: R,
    title: 'Cơm chiên tơi ngon nhờ cơm nguội', body: 'Dùng cơm nguội để qua đêm, bóp tơi trước khi chiên. Lửa to, dàn mỏng cơm ra chảo, hạt săn lại là được.' },

  // Khử mùi tanh
  { id: 'ca-muoi-gung', category: 'khu_mui', recipe: 'canh-chua-ca', review: R,
    title: 'Khử tanh cá bằng muối và gừng', body: 'Chà cá với muối hạt và gừng đập dập, để 5 phút rồi rửa lại nước sạch cho hết nhớt.' },
  { id: 'chan-thit', category: 'khu_mui', recipe: 'thit-kho-trung', review: R,
    title: 'Chần thịt cho món kho trong, không hôi', body: 'Cho thịt vào nồi nước sôi 1–2 phút cho ra bọt bẩn, vớt ra rửa lại nước lạnh rồi mới ướp.' },
  { id: 'ga-muoi-hat', category: 'khu_mui', source: 'nhan', product: 'gia-vi-ga-u-muoi',
    title: 'Rửa gà với muối hạt, chà kỹ cổ và bụng', body: 'Rửa gà với muối hạt, chà kỹ phần cổ, bụng. Rửa lại 2–3 lần nước sạch, để gà ráo nước hoàn toàn trước khi ủ.' },
  { id: 'hot-bot-canh', category: 'khu_mui', recipe: 'canh-cai-thit-bam', review: R,
    title: 'Hớt bọt để canh trong', body: 'Khi nồi canh vừa sôi, hớt sạch lớp bọt nổi lên. Nước canh trong, ngọt và không có mùi.' },

  // Nấu nhanh, ngon hơn
  { id: 'kho-khong-day-vung', category: 'nau_nhanh', recipe: 'thit-kho-trung', review: R,
    title: 'Kho thịt mở hé vung', body: 'Kho lửa thật nhỏ, mở hé vung: nước kho trong, không đục, thịt mềm mà không nát.' },
  { id: 'ga-u-nhiet', category: 'nau_nhanh', source: 'nhan', product: 'gia-vi-ga-u-muoi',
    title: 'Gà ủ dùng nước 50–60°C, không phải nước sôi', body: 'Ủ gà trong nước rất nóng nhưng chưa sôi, đậy kín 20–30 phút cho da săn. Dùng nồi đáy dày để giữ nhiệt ổn định, không ủ quá lâu kẻo gà bở.' },
  { id: 'xa-xiu-lua-vua', category: 'nau_nhanh', product: 'sot-xa-xiu', recipe: 'thit-xa-xiu', review: R,
    title: 'Áp chảo xá xíu lửa vừa', body: 'Sốt xá xíu có đường nên dễ cháy. Áp chảo lửa vừa, mỗi mặt 1–2 phút, phết thêm nước sốt cho bóng.' },
  { id: 'hanh-phi-san', category: 'nau_nhanh', product: 'hanh-phi', review: R,
    title: 'Có hũ hành phi, món nào cũng thơm hơn', body: 'Rắc hành phi lên xôi, nộm, canh, cháo ngay trước khi ăn để còn giòn. Không phải đứng phi hành mỗi bữa.' },
  { id: 'nom-ngam-da', category: 'nau_nhanh', product: 'sot-tron-nom', recipe: 'nom-tron-5-phut', review: R,
    title: 'Nộm giòn nhờ ngâm nước đá', body: 'Ngâm rau củ thái sợi trong nước đá pha chút muối và giấm 15 phút, vớt ra để thật ráo rồi mới trộn sốt.' },

  // Bảo quản
  { id: 'rau-khan-giay', category: 'bao_quan', review: R,
    title: 'Rau lá tươi lâu: không rửa trước', body: 'Nhặt bỏ lá úa, bọc khăn giấy khô cho vào hộp kín ở ngăn rau. Chỉ rửa ngay trước khi nấu.' },
  { id: 'hanh-la-tuoi', category: 'bao_quan', review: R,
    title: 'Giữ hành lá tươi cả tuần', body: 'Cắt bớt rễ, cuộn khăn giấy hơi ẩm, cho vào hộp kín để ngăn mát.' },
  { id: 'chia-thit', category: 'bao_quan', review: R,
    title: 'Chia thịt theo bữa trước khi cấp đông', body: 'Mỗi bữa một túi, ép dẹt, ghi ngày. Rã đông bằng cách chuyển xuống ngăn mát từ tối hôm trước.' },

  // An toàn bếp
  { id: 'ra-dong-ngan-mat', category: 'an_toan', review: R,
    title: 'Rã đông ở ngăn mát, không để ngoài bàn', body: 'Rã đông thịt cá ở ngăn mát hoặc ngâm cả túi kín trong nước lạnh. Để ngoài nhiệt độ phòng lâu dễ sinh vi khuẩn.' },
  { id: 'thot-song-chin', category: 'an_toan', review: R,
    title: 'Tách thớt đồ sống và đồ chín', body: 'Dùng riêng thớt, dao cho thịt cá sống và cho đồ ăn chín, rau ăn sống.' },
]

/** Mẹo của hôm nay: đổi mỗi ngày theo giờ VN. */
export function tipOfTheDay(vnDayStr: string): Tip {
  const n = Math.round(Date.parse(vnDayStr + 'T00:00:00Z') / 86400000)
  return TIPS[((n % TIPS.length) + TIPS.length) % TIPS.length]
}
