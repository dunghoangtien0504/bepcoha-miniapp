# Mini App Bếp Cô Hạ · Nghiên cứu TOP3 mini app F&B thế giới và nâng cấp v4 (24/10/2026)

> **Yêu cầu:** đọc toàn bộ dự án Mini App, nghiên cứu 3 mini app F&B tốt nhất thế giới, rồi nâng cấp Mini App HACO.
> **Đã đọc:** thiết kế v1 (hợp đồng dữ liệu), nghiên cứu TOP5 v2 (Starbucks Rewards, Duolingo, Luckin, app công thức, Highlands), thiết kế v3 (cộng đồng, chính sách Zalo 4.1/4.4/4.5/4.6), toàn bộ `app/src` và `Haco-OS-v2/lib/mini/**`.
> **Lưu ý số liệu:** các con số dưới đây phần lớn là số doanh nghiệp tự công bố hoặc từ nguồn thứ cấp. Chỉ dùng để định hướng, không dùng làm KPI.

---

## 1. Vì sao chọn 3 cái tên này

"Mini app" theo đúng nghĩa (chạy trong một siêu ứng dụng chat, không cần tải) mạnh nhất thế giới ở **WeChat Mini Program** (Trung Quốc). Zalo Mini App là mô hình giống WeChat nhất, nên HACO học thẳng từ đây.

| # | Mini app | Vì sao đứng top | Bài học cốt lõi |
|---|---|---|---|
| 1 | **McDonald's China** (WeChat Mini Program) | QuestMobile: mini program F&B có **nhiều người dùng hoạt động hàng tháng nhất** (3/2025). ~70 triệu thành viên hoạt động ở Trung Quốc; kênh số chiếm trên 80% doanh số ở Trung Quốc (số tự công bố, mốc thời gian chưa rõ) | **Tiện nhất có thể**: thực đơn đổi theo bữa (sáng/trưa/tối), coupon nằm ngay màn đầu, "đặt lại đơn trước" 1 chạm |
| 2 | **Luckin Coffee** (WeChat Mini Program + cộng đồng riêng) | Mini program cà phê có lượng truy cập lớn nhất; đặt món, tuỳ chỉnh, thanh toán trọn trong mini program. Tăng trưởng nhờ "mời 1 bạn, cả 2 được 1 ly" và cộng đồng WeCom (~20 triệu khách, 2022) nhận coupon theo khẩu vị | **Mua lại nhanh + lan truyền**: đặt lại 1 chạm, quà khi mời bạn, nhãn khách theo món hay mua. **Cảnh báo:** từng gian lận số liệu và lệ thuộc trợ giá — đừng tăng trưởng bằng giảm giá |
| 3 | **Starbucks China** (Rewards + "Say it with Starbucks" trên WeChat) | Quà tặng xã hội: chọn quà, trả bằng WeChat Pay, kèm lời nhắn chữ/ảnh/video; người nhận đổi tại cửa hàng. **1,2 triệu quà trong 7 tuần đầu, hơn nửa đã được đổi** (2017). Rewards: hạng thành viên, luôn thấy "còn bao nhiêu sao để lên hạng" | **Biến khách thành người tặng quà**: món ăn là món quà (Tết, Trung Thu, mùa cốm). Hạng thành viên nhìn thấy được |

Có cân nhắc thêm **Heytea GO** (63 triệu thành viên mini program năm 2022, mini program từng chiếm ~50% đơn): bài học trùng với Starbucks (hạng thành viên) nên không tách riêng.

---

## 2. HACO đang có gì, còn thiếu gì so với TOP3

| Tính năng của TOP3 | Có trước v4? | v4 |
|---|---|---|
| Đặt hàng trọn trong app, giá do server tính (cả 3) | ✓ v2-B | — |
| Điểm thưởng, điểm danh, chuỗi ngày (Starbucks) | ✓ v2-A | — |
| Sự kiện, thông báo trong app (McDonald's) | ✓ v3-A | — |
| **Hạng thành viên nhìn thấy được** (Starbucks, Heytea, McDonald's) | ✗ (mới có trong thiết kế v3) | ✓ |
| **Thực đơn/gợi ý theo bữa** (McDonald's) | ✗ (chỉ "món của hôm nay") | ✓ |
| **Coupon ngay màn đầu, đếm ngày hết hạn** (McDonald's, Starbucks) | ✗ (voucher nằm sâu trong "Của tôi") | ✓ |
| **Đặt lại đơn trước 1 chạm** (Luckin, McDonald's) | ✗ | ✓ |
| **Gửi tặng kèm lời nhắn** (Starbucks "Say it with Starbucks") | ✗ | ✓ (bản đầu, xem mục 3.5) |
| Mời bạn, cả hai được quà (Luckin) | Một phần (link giới thiệu, chưa có quà) | Chờ Cô Hạ chốt quà (mục 4) |
| Coupon theo món hay mua (Luckin) | ✗ | Đợt sau, cần đủ dữ liệu đơn trong app |

---

## 3. Đã làm trong v4

### 3.1 Hạng thành viên (Starbucks / Heytea / McDonald's)
- Năm hạng theo **tổng Hạt Cốm đã tích** (mốc của thiết kế v3): Tập sự 0 · Đảm đang 200 · Khéo tay 600 · Bếp phó 1.500 · Bếp trưởng 4.000.
- **Dùng Hạt Cốm trừ tiền không làm tụt hạng.** Server trả thêm `points_earned` trong `/me` = tổng các khoản cộng, trừ khoản trả lại khi huỷ đơn (`hoan_don`). Nhờ vậy không thể "huỷ đơn để lên hạng".
- Thẻ hạng có thanh tiến độ và câu "Còn X Hạt Cốm nữa để lên …", hiện ở trang Hạt Cốm và Của tôi. Đầu trang chủ ghi hạng ngay sau lời chào.
- **Chưa gắn quà theo hạng**: quà theo hạng là chương trình khách hàng thường xuyên, cần thông báo khuyến mại (Nghị định 81/2018, sửa bởi 128/2024). Cô Hạ chốt quà thì mới bật.

### 3.2 Trang chủ theo bữa (McDonald's)
- Lời chào đổi theo giờ VN: "Chào buổi sáng/trưa/chiều/tối chị".
- Khối gợi ý đổi theo bữa: sáng → "Bữa trưa nay nấu gì?" (món mặn, canh, rau); trưa → "Món nhanh cho bữa trưa" (≤ 30 phút); chiều → "Tối nay nấu gì?"; tối → "Ngày mai nấu gì?". Món đổi mỗi ngày, không trùng "Món của hôm nay".

### 3.3 Ví ưu đãi trên trang chủ (McDonald's / Starbucks)
- Khách có voucher còn dùng được thì thấy ngay trên trang chủ: số tiền giảm, mã, "còn N ngày" (≤ 3 ngày ghi "chỉ còn"), nút **Dùng ngay** sang tab Đặt hàng.
- Sắp hết hạn đứng trước. Voucher hết hạn, đã dùng, hoặc không phải voucher thì ẩn.

### 3.4 Đặt lại 1 chạm (Luckin / McDonald's)
- Nút **Đặt lại** ở: thẻ "Đặt lại đơn …" trên trang chủ (đơn gần nhất chưa huỷ), từng đơn trong "Đơn của tôi", và trang cảm ơn.
- Bấm là bỏ đúng món + số lượng của đơn cũ vào giỏ rồi mở giỏ. Món đã ngừng bán thì bỏ qua và báo tên. Giá luôn tính lại ở server.

### 3.5 Gửi tặng người thân (Starbucks "Say it with Starbucks")
- Ở Giỏ hàng chọn **🎁 Gửi tặng**: nhập tên, SĐT, địa chỉ người nhận và **lời nhắn in thiệp** (tối đa 150 chữ).
- Sau khi đặt, trang cảm ơn có thẻ **"Báo quà cho …"**: gửi lời nhắn (không kèm giá) qua Zalo (`openShareSheet` kiểu text) hoặc Web Share/chép trên web.
- **Giới hạn của bản đầu:** server chưa có cột riêng cho quà tặng. Thông tin người nhận đi trong **ghi chú đơn**, phần quà đứng đầu: `[QUÀ TẶNG] Người nhận: … · SĐT … Gọi người nhận khi giao, không báo giá cho người nhận. Lời nhắn in thiệp: "…"`. Nhân viên đọc ghi chú trên POScake/CRM. SĐT đặt hàng (voucher khoá theo số) vẫn là SĐT người đặt.
- Tên và lời nhắn người nhận **không ghi vào máy** (localStorage), chỉ giữ trong bộ nhớ để hiện thẻ "Báo quà".

### 3.6 Đo lường
Event mới (đã thêm ở cả app và danh sách cho phép của server): `reorder`, `wallet_use`, `gift_order`, `gift_share`. Dùng để đo: tỷ lệ đơn đặt lại, voucher được dùng từ trang chủ, số đơn quà tặng.

### 3.7 File đã sửa
- Mini App: `src/lib/{tiers,daypart,wallet,gift}.ts` (+ `v4.test.ts`, 9 test), `src/components/{TierCard,WalletCard,Reorder}.tsx`, `src/pages/{Home,Points,Me,Orders,OrderDone,Cart}.tsx`, `src/platform/{types,web,zalo}.ts` (`shareText`), `src/api/{types,mock}.ts`, `src/lib/events.ts`, `src/styles.css`.
- Haco-OS-v2 (phần của phiên Mini App): `lib/mini/checkin.ts` (`pointsEarned`, `points_earned` trong `homeState`), `lib/mini/service.ts` (4 event mới), `tests/mini-checkin.integration.test.ts` (1 test mới). Bản build đã chép vào `public/m`.
- **Không đổi schema.** Không chạm `lib/crm/**`.

### 3.8 Kiểm tra (24/10/2026)
- Mini App: typecheck sạch, **68/68 test**.
- Haco-OS-v2: **155/155 test DB** (`TEST_DB_NAME=haco_test_mini`).
- Chạy thử bản API giả ở khổ điện thoại 375px: đăng ký → điểm danh → ví ưu đãi hiện trên trang chủ → đặt đơn quà tặng → trang cảm ơn có thẻ "Báo quà" và "Đặt lại" → đặt lại vào giỏ → thẻ "Đặt lại đơn 24/10" trên trang chủ → thẻ hạng "Tập sự · còn 195 Hạt Cốm".
- Chưa thử trên API thật (`localhost:3030/m`) và chưa thử trong Zalo.

---

## 4. Cần Cô Hạ quyết

1. **Quà theo hạng** (ví dụ Đảm đang: miễn ship 1 đơn; Bếp trưởng: quà sinh nhật). Có quà thì cần thể lệ và thông báo khuyến mại.
2. **Quà mời bạn kiểu Luckin**: ví dụ bạn mới xác minh SĐT thì cả hai cùng +50 Hạt Cốm. Phiên CRM cần thêm lý do `gioi_thieu` vào `points_ledger`.
3. **Gửi tặng có cần trường riêng không**: nếu đơn quà nhiều (Tết, Trung Thu), phiên CRM thêm cột `gift_to_name`, `gift_to_phone`, `gift_message` vào `mini_orders` và đẩy SĐT người nhận làm SĐT giao hàng trên POScake. Khi đó app chuyển từ ghi chú sang trường riêng.
4. **Gói quà / thiệp in thật**: có in lời nhắn lên thiệp khi đóng hàng không. App đang hứa "lời nhắn in thiệp", nếu chưa in được thì đổi chữ thành "lời nhắn kèm quà".

## 5. Đợt sau (gợi ý)
- **Coupon theo món hay mua** (Luckin): sau khoảng 3 tháng có đủ đơn trong app, gợi ý voucher cho đúng món khách hay mua.
- **Đặt lại theo chu kỳ dùng hết** (McDonald's, Luckin): nhắc "sốt xá xíu chị mua 30 ngày trước sắp hết". Đang hoãn vì mức mua lại hiện tại thấp (HACO-LOOP/09).
- **Thiệp quà dạng ảnh** (Starbucks): người nhận mở link thấy thiệp có ảnh Cô Hạ. Cần trang công khai `/m/qua/:ma` và xin phép phiên CRM.

## Nguồn
- McDonald's China: [Statista/QuestMobile: MAU mini program F&B 3/2025](https://www.statista.com/statistics/1484339/china-monthly-active-users-of-restaurant-or-catering-service-brand-mini-programs-on-wechat) · [Tiger: McDonald's China, giao hàng 48% doanh số Q4/2025](https://www-web.itiger.com/news/1159972154) · [Zacks: digital sales mix](https://www.zacks.com/stock/news/2896625/will-mcdonalds-digital-sales-mix-drive-its-next-phase-of-growth) · [Alizila: thành viên McDonald's China trên Ele.me](https://alizila.com/?p=1467)
- Luckin: [NPR 2019](https://www.npr.org/sections/goatsandsoda/2019/05/17/723193259/what-does-chinas-luckin-coffee-have-that-starbucks-doesnt) · [EqualOcean: mời 1 tặng 1](https://equalocean.com/news/201903311679-miss-fresh-is-nowing-serving-coffee-luckin-real-rival-is-coming) · [The Meditations: Luckin mini program](https://themeditations.substack.com/p/luckin-coffee-part-i) · [Dolphin Research 2025](https://longportapp.cn/topics/36439843) · [Brands Vietnam: từ voucher đến đơn hàng](https://www.brandsvietnam.com/congdong/topic/tu-reward-loyalty-den-instant-voucher-su-dich-chuyen-cua-hanh-vi-tieu-dung)
- Starbucks China: [Campaign Asia: Say it with Starbucks](https://www.campaignasia.com/article/starbucks-china-enables-social-gifting-via-wechat-to-brew-up-sales/433758) · [Inside Retail: 1,2 triệu quà / 7 tuần](https://insideretail.asia/2017/05/11/starbucks-china-thrives-with-wechat-partnership/) · [Mobile Marketing](https://mobilemarketingmagazine.com/starbucks-teams-with-wechat-for-social-gifting-feature/)
- Heytea: [CTMA: 63 triệu thành viên Heytea GO](https://en.ctma.com.cn/?p=2874) · [EqualOcean: Heytea GO 50% đơn](https://equalocean.com/news/2019052711120-chinas-tea-brand-heytea-add-social-network-function-heytea-go/amp) · [HKU ACRC case](https://www.acrc.hku.hk/Case/Detail/2189)
- Zalo: `openShareSheet` kiểu `text` (zmp-sdk 2.53.0, `index.d.ts`).
