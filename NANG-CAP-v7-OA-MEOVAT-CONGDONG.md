# Mini App Bếp Cô Hạ · v7: nút OA, công thức chi tiết có sản phẩm, Mẹo vặt, Cộng đồng (25/10/2026)

## Yêu cầu của Cô Hạ
1. Phải có nút **Theo dõi OA** và **Chat OA** để khách chat ngay với Bếp.
2. Thêm mục **Mẹo vặt**.
3. Hướng dẫn sơ chế, nấu còn sơ sài. Cần công thức chi tiết để khách tự làm được, và lồng khéo **sản phẩm bán chạy** để khách chọn mua cho nhanh hơn, ngon hơn. Danh sách 15 nhóm: Sét Xôi Cốm, Cốm Khô, Bột Khúc Sấy Lạnh, Sốt Xá Xíu, Khăn đồ xôi, Sét Bánh/Xôi Khúc, Hạt Sen Khô, Sốt Ướp Nướng, Sét Chè Cốm, Sốt Trộn Nộm, Sét Chè Bưởi, Sốt Sườn Chua Ngọt, Cà Phê, Hành Phi, Gia Vị Gà Ủ Muối.
4. Cần phần **Cộng đồng** để khách chia sẻ món tự làm.
5. Mọi thứ phải **theo chính sách Zalo** để Mini App được duyệt.

## Đã làm
### 1. Quan tâm OA và Chat với Bếp
- Có thanh 2 nút ở **trang chủ** (ngay dưới ô tìm), cuối **mỗi công thức** ("Làm chưa được? Hỏi Cô Hạ"), ở **Mẹo vặt** và **Cộng đồng**. Tab dưới cùng đổi tên thành **Chat Bếp**.
- Có `VITE_ZALO_OA_ID`:
  - "Quan tâm OA" dùng `followOA`, "Chat với Bếp" dùng `openChat` của OA, điền sẵn câu hỏi theo món.
- Chưa có OA ID (hiện tại):
  - Bản web dùng Zalo của Bếp `zalo.me/0965240587` (số in trên nhãn sản phẩm) cho nút "Kết bạn Zalo Bếp" và "Chat với Bếp".
  - **Bản Zalo ẩn 2 nút** cho tới khi có OA ID, vì chính sách cấm đưa khách ra link ngoài.

### 2. Công thức chi tiết, lồng sản phẩm
- **5 công thức chép đúng hướng dẫn in trên bao bì** (ảnh nhãn trong Drive "ảnh sản phẩm vật lý (raw)"). App ghi rõ "✓ Công thức in trên bao bì sản phẩm Bếp Cô Hạ":
  - **Xôi cốm sen dừa:** viết lại đủ 9 bước thay cho 2 bước cũ.
  - **Chè cốm sen dừa:** mới, có cách nấu cốt dừa ăn kèm.
  - **Chè bưởi cùi giòn:** mới, 10 bước theo 3 phần trên nhãn.
  - **Bánh khúc (xôi khúc):** mới, đủ định lượng vỏ 30g, nhân 20g, gạo 2kg.
  - **Gà ủ muối thảo mộc:** mới, nhiệt độ nước 50–60°C, thời gian ủ.
- **Thịt xá xíu:** 8 bước (trước là 5 bước), đổi sang ảnh thành phẩm thật của Bếp. **Nộm 5 phút:** 6 bước có định lượng rau.
- **Thẻ "Nấu nhanh hơn với sản phẩm của Bếp"** gắn ở **18 món**: ảnh sản phẩm, giá ban hành 07/9/2026, lợi ích cụ thể (ví dụ "thay cả chục loại gia vị pha sốt bằng 1 hũ, tiết kiệm khoảng 20 phút").
  - Món đang bán trong app có nút **Thêm vào giỏ**.
  - Món chưa có trong app có nút **Nhắn Bếp đặt**, mở chat với câu soạn sẵn "Cô ơi, cháu muốn đặt … (giá)".
- Tab Đặt hàng có thêm khối **"Sản phẩm khác của Bếp"**: 11 sản phẩm chưa có trong giỏ app, kèm link sang các món làm được.

### 3. Mẹo vặt (`/meo-vat`)
- 26 mẹo, chia 6 nhóm: Sơ chế · Khử mùi tanh · Xôi, cốm, chè · Nấu nhanh · Bảo quản · An toàn bếp.
- 8 mẹo lấy từ nhãn sản phẩm. Ví dụ: cốm khô vo 30 giây; hạt sen luộc 2 lần; ủ gà bằng nước 50–60°C.
- Mỗi mẹo dẫn sang công thức và sản phẩm liên quan.
- Có lối tắt trên trang chủ, khối "Mẹo vặt hôm nay" (đổi mỗi ngày) và lối vào ở đầu tab Công thức.

### 4. Cộng đồng "Góc bếp chị em" (`/cong-dong`)
- **Thử thách tuần** (đang là: xôi cốm sen dừa), có nút "Xem công thức" và "Gửi ảnh cho Bếp".
- Cách khoe món: nấu → chụp → gửi ảnh qua chat Zalo → Bếp xin phép, khen và đăng. Tên hiển thị dạng "Chị Lan · Hà Nội".
- Nút **Khoe lên Nhật ký Zalo** dùng `openPostFeed` (tính năng chia sẻ chính thức của Zalo). Bản web là "Chia sẻ cho bạn bè".
- Thư viện **Món ngon của chị em**: hiện có 8 ảnh lấy từ các lớp học của Bếp (Drive "ẢNH KHÓA HỌC"), ghi rõ "Lớp học của Bếp Cô Hạ".
- Có nút vào nhóm của Cô (nhóm Zalo khi đã có link; bản web tạm mở nhóm Facebook và ghi đúng tên).

## Rà chính sách Zalo Mini App
| Mục | Quy định | Mini App HACO |
|---|---|---|
| 4.1 | Không đưa người dùng ra liên kết ngoài | Bản Zalo: không mở web sản phẩm, không mở Facebook, YouTube, Messenger, `zalo.me` số điện thoại; chat chỉ qua OA. Sản phẩm chưa bán trong app thì đặt qua chat OA |
| 4.4 | Không bán khoá học, nội dung số có phí | Khoá học miễn phí và đang ẩn (chưa có video). Không bán khoá có phí |
| 4.5 | Không rút tiền, không trả thưởng bằng tiền | Hạt Cốm chỉ trừ vào đơn (đang tắt). Không đổi ra tiền |
| 4.6 | Không có tính năng mạng xã hội (đăng bài, like, comment) | Cộng đồng không có đăng bài, tim hay bình luận trong app. Ảnh do Bếp duyệt rồi mới đăng. Trò chuyện diễn ra ở Nhóm Zalo, khoe món qua `openPostFeed` |
| 6.1, 6.3 | Xin quyền có ngữ cảnh, cho phép từ chối | Chỉ xin quyền SĐT khi khách bấm đăng ký; quyền thông báo khi bấm "Nhắc tôi". Không xin quyền camera (gửi ảnh qua chat) |
| Thanh toán | Phải dùng Checkout SDK | Server chặn đặt đơn ở bản Zalo (`checkout_required`) cho tới khi làm Checkout SDK |
| Khuyến mại (NĐ 81/2018, 128/2024) | Quay số may rủi phải đăng ký | Không có vòng quay hay bốc thăm. Thử thách tuần chỉ khen và đăng ảnh, không có giải thưởng |

## Kiểm tra (25/10/2026)
- App 84/84 test (thêm `v7.test.ts`: 15 sản phẩm, liên kết sản phẩm ↔ công thức ↔ mẹo, 5 công thức theo nhãn đủ bước và đủ dòng "Món đạt khi", mẹo tự viết đều có cờ duyệt). Server 155/155.
- Chạy trên `localhost:3030/m`, khổ 375px: trang chủ, xá xíu, chè bưởi, Mẹo vặt, Cộng đồng, Đặt hàng. Không có lỗi console.
- Chưa thử trong Zalo.

## Cần Cô Hạ
1. **ID Zalo OA** (`VITE_ZALO_OA_ID`). Có ID thì bản Zalo mới hiện được 2 nút OA và cho chat.
2. **Link nhóm Zalo** (`VITE_ZALO_GROUP_URL`).
3. Mã variation POScake để đưa Cốm khô, Bột khúc, Sét chè, Gà ủ muối… vào giỏ hàng trong app (hiện các món này đặt qua chat).
4. Đọc lại các mẹo và bước nấu do app viết (gắn `cho_co_ha_duyet`). Phần chép từ nhãn thì không cần duyệt lại.
5. Người nhận và duyệt ảnh khách gửi qua chat OA. Thêm ảnh đã duyệt vào `COMMUNITY.gallery` (sau này chuyển lên CRM).
6. Ảnh Sốt Sườn Chua Ngọt (Drive chưa có ảnh riêng).
