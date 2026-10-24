# Mini App HACO (v2-A · bản web)

Ngôi nhà của khách Bếp Cô Hạ: trang chủ có điểm danh hằng ngày + chuỗi ngày + Hạt Cốm, thư viện công thức (chế độ nấu, Sổ tay), khoá "Học làm xôi cốm cùng Cô Hạ", nhập mã đơn, ưu đãi. Thanh dưới 5 tab: Trang chủ · Công thức · Zalo OA · Đặt hàng · Của tôi.
Nghiên cứu TOP5 và thiết kế v2: [`../NGHIEN-CUU-TOP5-VA-THIET-KE-v2.md`](../NGHIEN-CUU-TOP5-VA-THIET-KE-v2.md).
Thiết kế và hợp đồng dữ liệu: [`../THIET-KE-MINI-APP-v1.md`](../THIET-KE-MINI-APP-v1.md) (mục 4–6).

Bộ chuẩn Zalo Mini App: React 18 + Vite 5 + zmp-ui 1.11.14 + zmp-sdk 2.53.0. zmp-ui chưa hỗ trợ React 19, và zmp-vite-plugin chỉ hỗ trợ Vite 4–5.

## Chạy

Node nằm ở `~/.local/node/bin`; thêm vào PATH nếu Terminal chưa có.

```bash
npm install
npm run dev:mock    # API giả trong trình duyệt → http://localhost:5173/m/
npm run dev         # API thật: proxy /api sang Haco-OS-v2 (http://localhost:3030)
npm test            # 42 test: SĐT, mở bài, chuỗi ngày, công thức, API giả, router bản production
npm run build       # bản web → dist/
npm run copy:haco   # chép dist/ vào Haco-OS-v2/public/m → mở http://localhost:3030/m?b=<MÃ_LÔ>
npm run build:zalo  # bản Zalo Mini App → www/ (Đợt C, cần Zalo App ID)
```

Bản build web cần các biến `VITE_*` trong `.env.production.local` (xem `.env.example`), gồm ID Zalo OA, link Messenger, link combo và link công khai. Thiếu biến nào thì nút tương ứng bị ẩn.

**Lưu ý router:** bản web dùng `src/router.tsx` (BrowserRouter, basename `/m`), không dùng `ZMPRouter`. Ở bản production, `ZMPRouter` luôn đặt basename `/zapps/<APP_ID>`, nên ngoài Zalo sẽ ra trang trắng mà không báo lỗi. Test `src/router.test.tsx` chặn lỗi này.

Cách thử nhanh với API giả:
- Thêm `?b=FB-2610-XOICOM` vào link để giả lập quét mã lô QR.
- Mã đơn bắt đầu bằng `TEST` sẽ khớp và xác minh phiên; mã khác chuyển sang chờ duyệt. Nhập sai 5 lần thì bị khoá.
- Mở `/m/dang-ky?mock_voucher=1` để thử cấp voucher.
- Tăng `localStorage.haco_mock_days` thêm 1 rồi điểm danh lại để thử chuỗi ngày và thưởng mốc.
- Đặt `localStorage.haco_mock_days = 3` để giả lập 3 ngày trôi qua, mở thêm bài.

## Cấu trúc

| Thư mục | Việc |
|---|---|
| `src/api/` | `types.ts` là hợp đồng `/api/mini/*`; `http.ts` gọi Haco-OS; `mock.ts` là API giả theo đúng quy tắc của hợp đồng |
| `src/platform/` | Lớp 2 chế độ. `web.ts`: form SĐT, link zalo.me, Web Share. `zalo.ts`: getPhoneNumber, followOA, openShareSheet; zmp-sdk chỉ nạp ở bản Zalo |
| `src/pages/` | Chào → Đăng ký → Khoá học → Bài học → Nhập mã đơn → Của tôi |
| `src/content.ts` | Tên bài, link (group, YouTube), banner, sản phẩm tab Đặt hàng, câu đồng ý. Chỗ ghi **[CHỜ HACO]** chờ nội dung thật |
| `src/recipes.ts` | Thư viện công thức — lấy từ "Hướng dẫn sử dụng" trên trang sản phẩm HACO, không tự bịa. Thêm món: thêm 1 mục, slug không đổi về sau |
| `src/lib/streak.ts` | Chuỗi ngày (giữ chuỗi 1 lần/7 ngày) — giống `Haco-OS-v2/lib/mini/checkin.ts`, sửa cả hai |

## Quy tắc đã chốt với phiên CRM (đừng đổi một phía)

- Không gửi `qr_scan` từ client: server tự ghi khi `/session` nhận mã lô hợp lệ.
- SĐT tự gõ trên web luôn ở trạng thái **chưa xác minh**. Màn hình chỉ hiện SĐT đã che.
- Ô đồng ý không tick sẵn. Không tick vẫn được học và vẫn nhận voucher. Câu đồng ý phải trùng từng chữ với `lib/mini-consent.ts` ở server, cho cùng `text_version`.
- Đơn đang chờ duyệt chỉ hiện "Cô Hạ đang kiểm tra…", không nói lý do (chống dò mã đơn).
- Luôn có đường "Nhắn Cô Hạ" (B4 K14): ở v2 là tab Zalo OA giữa thanh dưới, mở bảng chọn Zalo OA / Messenger.

## Còn thiếu

- API thật `/api/mini/*` đã có trong Haco-OS-v2 (nhánh `rebuild/crm-v2`, **chưa commit**): `app/api/mini/**`, `lib/mini/**`, `lib/mini-auth.ts`, `lib/mini-consent.ts`; test trong `tests/mini-*.test.ts` (`npm run test:db`).
- Bản Zalo (Đợt C) chưa thử trên máy thật: cần Zalo App ID, `ZALO_APP_SECRET` ở server, và Zalo duyệt quyền lấy SĐT.
- Video 8 bài, video chào, nguyên liệu từng bài, link combo, ID Zalo OA: chờ HACO cung cấp.
- Số tiền và hạn dùng voucher Đợt A: chờ Cô Hạ quyết. Server không cấp voucher khi chưa có giá trị.
- Cảnh báo `npm audit` (vite 5, vitest 2, react-router 6) chỉ ảnh hưởng máy dev, hoặc các API không dùng tới. Lên phiên bản mới thì phải chờ zmp-ui hỗ trợ React Router 7 và Vite 6.
