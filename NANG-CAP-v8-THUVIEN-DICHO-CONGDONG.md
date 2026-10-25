# Mini App Bếp Cô Hạ · v8 (25/10/2026)

## Yêu cầu của Cô Hạ
1. Phần công thức **không được có món Bếp đang bán hoặc đang dạy**.
2. Đi chợ tuần cần **nhiều lựa chọn hơn**: khách bấm chọn món nào thì app viết ra nguyên liệu của món đó thành danh sách đi chợ.
3. Tìm ảnh cho các món còn thiếu.
4. Cộng đồng cần **chỗ để khách đăng ảnh và caption**.

## 1. Thư viện công thức
- **Bỏ 11 món** (Cô Hạ chọn nhóm: xôi, chè, bánh khúc, gà ủ muối, cá kho tộ): xôi cốm sen dừa, xôi gấc, xôi đậu xanh, đồ xôi bằng khăn, chè cốm, chè cốm sen dừa, chè bưởi, chè đậu xanh, bánh khúc, gà ủ muối, cá kho tộ.
- Các sản phẩm này vẫn bán ở tab Đặt hàng, và hướng dẫn nấu có sẵn trên bao bì.
- **Giữ** thịt xá xíu và nộm vì Bếp bán sốt, không bán món; giữ chả cốm.
- **Thêm 6 món cơm nhà mới** (đều có giải thích từng bước và dòng "Món đạt khi"): Gà rang gừng, Thịt luộc chấm mắm tỏi, Canh mồng tơi thịt băm, Trứng chiên hành lá, Bắp cải xào cà chua, Đậu que xào thịt bò. Thư viện hiện có **25 món**.
- Test `v7.test.ts` chặn món có chữ xôi, chè, bánh khúc, gà ủ, cá kho, dưa cà, rau má, bánh mì quay lại thư viện.
- Mẹo vặt từ nhãn (cốm vo 30 giây, hạt sen luộc 2 lần…) vẫn giữ nhưng dẫn sang **sản phẩm**, không còn dẫn sang công thức.

## 2. Đi chợ tuần có nhiều lựa chọn (`/di-cho-tuan`)
- **3 thực đơn gợi ý**, mỗi thực đơn 7 bữa tối:
  - **Cơm nhà truyền thống:** ~186.000đ/bữa cho 4 người.
  - **Tiết kiệm:** ~135.000đ/bữa.
  - **Thanh đạm, nhiều rau:** ~122.000đ/bữa.
  - Giá có thể chênh vài nghìn đồng tuỳ phần làm tròn.
- **Tự chọn món:** lưới ảnh 25 món, bấm món nào thì món đó vào danh sách. Có lọc theo nhóm món.
- **Danh sách mua tự sinh** (`src/lib/ingredients.ts`):
  - đọc định lượng ("800g", "1/2 thìa cà phê", "50–80ml", "1 lít");
  - nhân theo **số người ăn (2/3/4/6)**;
  - **gộp thứ trùng** giữa các món (ví dụ ba chỉ của thịt kho + thịt rang), ghi rõ món nào dùng;
  - xếp theo quầy; gia vị khô ghi riêng, không tính tiền.
- **Ước tính giá** theo bảng Co.op Online (ngày 25/10/2026, ~35 loại). Đơn vị đếm quy ra gram trung bình, ví dụ 1 củ hành tím ≈ 12g.
  - Thứ chưa có giá thì ghi đích danh "chưa tính" (ví dụ thịt gà đùi, giá đỗ, đậu que). Không tự đoán.
- Sốt Bếp Cô Hạ mà các món cần (xá xíu, trộn nộm) có nút **"Thêm sốt vào giỏ"**.
- Có ô đánh dấu đã mua, nút chép danh sách sang Zalo, và tab sơ chế/bảo quản.

## 3. Ảnh món
- **Thêm 8 ảnh** có giấy phép **cho phép dùng thương mại** (tìm qua Openverse và Wikimedia Commons): canh bí đao, gỏi gà, gà rang gừng, trứng chiên, đậu que xào, nấm kho, thịt luộc, canh mồng tơi. Dưới mỗi ảnh ghi tác giả, giấy phép và nguồn.
- **Loại 6 ảnh** đã tải về:
  - đậu phụ sốt cà: giấy phép CC BY-ND, cấm chỉnh sửa;
  - sườn xào: có watermark;
  - canh cải: thật ra là súp hoành thánh;
  - bò xào: thật ra là mì xào;
  - trứng đúc: là đĩa cơm tấm;
  - tôm rim: chỉ có ảnh tay người đang nấu.
- Drive "Tư liệu đăng bài" chỉ có ảnh sản phẩm và hàng nhập.
- Hiện **16/25 món có ảnh**. 9 món còn dùng ảnh minh hoạ: sườn xào chua ngọt, trứng đúc thịt, tôm rim, bò xào hành tây, canh cải, chả cốm, đậu phụ sốt cà, đậu phụ chiên sả ớt, bắp cải xào cà chua. Cần ảnh từ bếp Cô Hạ.

## 4. Cộng đồng: khách đăng ảnh + caption (`/cong-dong`)
- **Form đăng:** chụp hoặc chọn ảnh (nén ngay trên máy về ≤1280px, ≤700KB), caption ≤300 chữ, chọn món đã nấu, tên hiển thị, khu vực. Ô **đồng ý cho Bếp đăng** không tick sẵn và bắt buộc tick.
- **Bài của tôi:** khách thấy bài mình đang chờ duyệt / đã đăng / chưa đăng được kèm lý do.
- **Món ngon của chị em:** chỉ hiện bài đã duyệt. Bài ghim hiện nhãn "Món của tuần", bài được khen hiện nhãn "Cô Hạ khen ❤", kèm link sang công thức.
- **CRM `/crm/cong-dong`** (quyền `su_kien.quan_ly`, có trong menu): Duyệt · Duyệt + khen · Từ chối (bắt buộc lý do, khách thấy lý do) · Ghim · Ẩn. Mọi thao tác ghi nhật ký.
- **Server:**
  - `lib/mini/community.ts`;
  - các route `/api/mini/community/posts` (GET, POST), `/posts/[id]/image`, `/mine`, `/api/crm/community`;
  - kiểm định dạng ảnh theo byte đầu file (JPEG, PNG, WebP), tối đa 800KB, 3 bài/ngày, 5 bài chờ duyệt;
  - bài chưa duyệt chỉ chủ bài xem được ảnh.
- **Bảng mới `cook_posts`:** phiên Mini App tạo (Cô Hạ đồng ý vì phiên CRM không chạy). Bảng tự tạo khi gọi lần đầu (`ensureCommunitySchema`). Ảnh lưu trong DB.
  - **Phiên CRM cần biết:** có thể chuyển phần tạo bảng vào `lib/crm/schema.ts`, giữ nguyên tên cột.
  - Khi lên Vercel/Supabase nên chuyển ảnh sang Supabase Storage nếu số bài lớn.
- **Chính sách Zalo 4.6:** không có thả tim, bình luận hay trang cá nhân; khách không thấy bài chưa duyệt của người khác; Bếp là bên chọn đăng.
  - Đây vẫn là "khách gửi nội dung", **có rủi ro người duyệt Zalo xem là tính năng mạng xã hội**.
  - Nếu Zalo yêu cầu, đặt `VITE_COMMUNITY_UPLOAD=off` để ẩn form; khi đó app chuyển sang nút "Gửi ảnh cho Bếp qua Zalo" (chat OA).

## Kiểm tra (25/10/2026)
- App 91/91 test, server 159/159 test (thêm 4 test `mini-community.integration.test.ts`).
- Chạy trên `localhost:3030/m` + CRM:
  - khách đăng ảnh thử → "Chờ Bếp duyệt" → CRM "Duyệt + khen" → hiện công khai có nhãn "Cô Hạ khen ❤" → CRM "Ẩn";
  - tự chọn 3 món → danh sách 19 dòng, 286.100đ cho 4 người;
  - không có lỗi console hay lỗi server.
- Chưa thử trong Zalo.
