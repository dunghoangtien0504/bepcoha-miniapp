# Bếp Cô Hạ — Mini App

Mini App cho khách của Bếp Cô Hạ (HACO Food): công thức nấu chi tiết, chế độ nấu có hẹn giờ, danh sách đi chợ,
điểm danh tích Hạt Cốm, khoá học xôi cốm, đặt hàng thẳng vào Pancake POS, sự kiện, hộp thư thông báo, Góc bếp chị em.
Một mã nguồn chạy được 2 chế độ: **web** (tại `/m` của [`bepcoha-platform`](https://github.com/dunghoangtien0504/bepcoha-platform))
và **Zalo Mini App** (zmp-ui + zmp-sdk).

> - **Không có khoá hay dữ liệu khách.** App chỉ gọi API `/api/mini/*` của bepcoha-platform; mọi khoá nằm ở server.
> - **Chạy thử:** `cd app && npm install && npm run dev:mock` (API giả, không cần server) → mở http://localhost:5173/m/.
>   Nối server thật: `npm run dev`; build và chép sang platform: `npm run build && npm run copy:haco`.
> - **Chính sách Zalo:** làm theo chính sách kiểm duyệt Zalo Mini App, gồm mục 4.6 (không có đăng bài, thả tim, bình luận trong app)
>   và mục 4.1 (không đưa khách ra link ngoài). Xem `THIET-KE-v3-CONG-DONG.md`.
> - **Bản quyền:** tên, logo (`brand/`, `app/public/brand/`), ảnh và công thức thuộc HACO Food, không dùng lại khi chưa được phép.
> - **Báo lỗi bảo mật:** nhắn riêng cho Bếp Cô Hạ qua Zalo 0965240587, đừng mở issue công khai.

Tài liệu thiết kế: `THIET-KE-MINI-APP-v1.md` → `NGHIEN-CUU-TOP5-VA-THIET-KE-v2.md` → `THIET-KE-v3-CONG-DONG.md` → `NANG-CAP-v4…v8`.
Hướng dẫn lập trình chi tiết: [`app/README.md`](app/README.md).
