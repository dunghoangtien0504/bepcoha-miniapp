# Mini App Bếp Cô Hạ · Nâng cấp v5: giao diện theo chuẩn app F&B lớn (25/10/2026)

> **Phản hồi của Cô Hạ về v4:** "vẫn như cũ, có nâng cấp gì đâu". Đúng: v4 chủ yếu thêm thẻ chỉ hiện khi có điều kiện (có voucher, có đơn), nên trang chủ gần như không đổi.
> **v5** làm lại phần nhìn thấy được, theo những mẫu mà các app F&B dùng rộng rãi nhất đều có.

## 1. Học từ đâu

| App | Mẫu giao diện | Áp dụng ở HACO |
|---|---|---|
| **Starbucks** (app thành viên được dùng nhiều nhất, theo khảo sát 2018 Built In dẫn lại) | Thông tin thưởng nằm trên cùng trang chủ, bên dưới là nội dung tuyển chọn; dải "món yêu thích" cuộn ngang | **Thẻ thành viên** xanh đậm đầu trang: Hạt Cốm, hạng, thanh lên hạng, chuỗi ngày và nút điểm danh ngay trên thẻ |
| **McDonald's** | Ưu đãi và "đặt lại" ngay màn đầu, banner trượt, đặt món ít bước | **4 lối tắt chính** (Đặt hàng · Công thức · Ưu đãi · Sự kiện), **banner trượt** có chấm trang |
| **DoorDash / Uber Eats / Luckin** | Thẻ sản phẩm có ảnh, giá, nút + thêm nhanh; nút "xem giỏ" luôn ở đáy; lịch sử đơn dễ thấy | **Dải "Bán chạy"** có nút +, **thanh giỏ hàng nổi** (số món + tạm tính), tab Đặt hàng dạng **lưới ảnh 2 cột** có chip danh mục và bộ −/+ trên thẻ |
| **NYT Cooking / Kitchen Stories** | Chọn món bằng ảnh | Công thức thành **lưới ảnh 2 cột**; trang chủ có **dải công thức theo bữa** cuộn ngang |
| Chung | Màn chờ dạng khung xương thay chữ "đang tải" | **Khung xương** khi mở app và khi tải danh sách hàng |

## 2. Đã làm
- Trang chủ mới (`src/pages/Home.tsx`): đầu trang có lời chào theo bữa và ô tìm kiếm dạng viên thuốc → thẻ thành viên → 4 lối tắt → banner trượt → sự kiện sắp tới → ví ưu đãi → đặt lại → "Bán chạy ở Bếp Cô Hạ" → dải món theo bữa → món của hôm nay → lưới "Tiện ích" (khoá xôi cốm, Sổ tay, đi chợ, hỏi Cô Hạ, group bếp).
- Thẻ thành viên (`components/MemberCard.tsx`); khách chưa đăng ký thấy thẻ mời "Đăng ký thành viên" kèm 3 quyền lợi đã có thật trong app.
- Thanh giỏ hàng nổi (`components/CartBar.tsx`): hiện ở Trang chủ, Đặt hàng, Công thức, Đi chợ. Số tiền là **tạm tính**; tổng thật (voucher, Hạt Cốm) vẫn do server tính ở Giỏ hàng.
- Tab Đặt hàng (`pages/Shop.tsx`): chip danh mục (Xôi cốm · Sốt nấu · Dụng cụ, suy từ trang sản phẩm), lưới ảnh, chọn biến thể, nút + đổi thành bộ −/+ khi đã có trong giỏ.
- Công thức (`pages/Recipes.tsx`): lưới ảnh 2 cột; món chưa có ảnh thật hiện ảnh minh hoạ theo nhóm món.
- Bộ icon nét riêng (`components/Glyph.tsx`) cho giỏ hàng, ưu đãi, quà, chuỗi ngày (zmp-ui không có).
- Không đổi API, không đổi server, không đổi schema.

## 3. Kiểm tra (25/10/2026)
- Typecheck sạch, **69/69 test**.
- Chạy trên API thật `localhost:3030/m` ở khổ 375×812: thẻ thành viên, banner, dải sản phẩm (nút + thêm vào giỏ, thanh giỏ cập nhật 165.000đ / 2 món), lưới Đặt hàng (bộ −/+), lưới Công thức. Không có lỗi console từ app.
- Chưa thử trong Zalo.

## 4. Cần HACO cung cấp để đẹp hơn nữa
- **Ảnh thật cho 22 công thức gia đình** (đang là ảnh minh hoạ).
- **Ảnh banner riêng** tỷ lệ 2:1 cho từng chiến dịch.
- Ảnh sản phẩm nền sạch (ảnh hiện tại là ảnh quảng cáo có nhiều chữ).

## Nguồn
- [Built In: UX Design Lessons From the Starbucks App](https://builtin.com/design-ux/starbucks-mobile-loyalty-rewards-order-payment) · [Pratt: Design Critique Starbucks](https://ixd.prattsi.org/2020/02/design-critique-starbucks-iphone-app/) · [Contra: Starbucks redesign](https://contra.com/p/ONmQrcbX-starbucks)
- [Fueled: McDonald's mobile ordering](https://fueled.com/blog/mcdonalds-mobile-ordering-apps/) · [Robosoft: McDelivery](https://robosoftin.com/work/mcdelivery)
- [Baymard: grocery & food delivery](https://baymard.com/blog/grocery-food-delivery-orders) · [Boundev: food app UX guide](https://www.boundev.ai/blog/food-app-design-ux-guide) · [Cieden: food delivery UX mistakes](https://cieden.com/fixing-9-common-ux-mistakes-in-food-delivery-app-ux-upgrade)
