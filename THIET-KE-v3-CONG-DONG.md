# Mini App HACO — Thiết kế v3: Cộng đồng, Bảng xếp hạng, Thông báo, Sự kiện

> **Yêu cầu (24/10/2026):**
> - Cho đi nhiều hơn: tặng thêm công thức.
> - Có cộng đồng: khách chụp và đăng ảnh món mình đã nấu, có bình luận và thả tim.
> - Có bảng xếp hạng thành viên. Đăng bài được nhiều Hạt Cốm nhất, bình luận ít hơn, thả tim ít hơn nữa.
> - App phải thành nơi chị em nội trợ vào xem **mỗi ngày**.
> - Màu theo thương hiệu (logo HC, ảnh bìa Cô Hạ). Ô "Group bếp" mở nhóm Zalo.
> - Có thông báo khi có sự kiện mới, và mục "Sự kiện sắp diễn ra".

---

## 1. Điều phải biết trước: chính sách Zalo cấm "đăng bài, like, comment"

Chính sách kiểm duyệt Zalo Mini App, **mục 4.6**: Mini App có *tính năng mạng xã hội* (đăng bài, video, **like, comment**) bị coi là **vi phạm**. Nguồn: [miniapp.zaloplatforms.com/documents/zalo-mini-app-censorship-policy](https://miniapp.zaloplatforms.com/documents/zalo-mini-app-censorship-policy/).

Cùng văn bản đó, các mục liên quan tới thiết kế này:

| Mục | Nội dung | Ảnh hưởng tới HACO |
|---|---|---|
| 4.1 | Không đưa người dùng ra liên kết ngoài | Bản Zalo không được mở trang sản phẩm web, Facebook hay YouTube. Đặt hàng đã nằm trong app (v2-B). Phải dùng nhóm **Zalo**, không dùng nhóm Facebook |
| 4.4 | Bán khoá học online là giao dịch số, bị coi là vi phạm | Khoá học **miễn phí** thì được. Khoá có phí (rau má, dưa cà muối, khởi nghiệp F&B) **không bán trong bản Zalo**, chỉ giới thiệu và mời nhắn tư vấn |
| 4.5 | Cấm rút tiền và trả thưởng | Hạt Cốm chỉ đổi sang giảm giá hoặc quà hiện vật, không đổi ra tiền |
| 6.1, 6.3 | Xin quyền (thông báo, camera, SĐT) phải có ngữ cảnh, khách được từ chối | Chỉ xin quyền thông báo khi khách bấm "Nhắc tôi" ở một sự kiện, không xin ngay lúc mở app |

**Luật Việt Nam** (Nghị định 147/2024, hiệu lực 25/12/2024):
- Dịch vụ cho người dùng đăng bài và bình luận có thể bị coi là **mạng xã hội**, phải có giấy phép hoặc giấy xác nhận thông báo.
- Ngưỡng lượt truy cập để phân biệt hai loại giấy (10.000 lượt hoặc 1.000 người dùng mỗi tháng) đang được các nguồn diễn giải khác nhau. **Cần hỏi luật sư trước khi bật bình luận công khai.**
- Tài khoản phải xác thực bằng SĐT mới được đăng bài hoặc bình luận.
- Chủ trang chịu trách nhiệm về nội dung, và phải gỡ nội dung vi phạm trong 24 giờ khi có yêu cầu.

Nguồn: [lsvn.vn](https://lsvn.vn/quy-dinh-moi-ve-quan-ly-trang-thong-tin-dien-tu-mang-xa-hoi-a150603.html), [KPMG](https://kpmg.com/vn/vi/home/phan-tich-chuyen-sau/2025/02/understanding-vietnam-new-internet-regulations.html).

**Khuyến mại** (Nghị định 81/2018, sửa bởi Nghị định 128/2024): tích điểm đổi quà là chương trình "khách hàng thường xuyên". Phát quà cho người đứng đầu bảng xếp hạng là một hình thức khuyến mại. Hai việc này cần thông báo hoặc đăng ký với Sở Công Thương, và phải công bố thể lệ công khai.

### Ba hướng để Cô Hạ chọn

| | **A. Tuân thủ Zalo (khuyên dùng)** | B. Có thả tim, không bình luận | C. Đủ tim và bình luận, chỉ ở bản web |
|---|---|---|---|
| Khoe món | Khách gửi ảnh, Cô Hạ duyệt rồi mới hiện trong **Góc bếp chị em** | Như A | Như A |
| Tương tác | "Cô Hạ khen" (nhân viên khen, khách nhận thông báo) và nút **"Khoe lên Nhật ký Zalo"** (`openPostFeed`). Tim và bình luận diễn ra ngay trên Zalo, trong **nhóm Zalo** và Nhật ký | Thêm nút tim trong app | Thêm tim và bình luận (có duyệt, có bộ lọc từ) |
| Bản Zalo có qua duyệt không | Có | **Rủi ro bị từ chối** (tim là "like" theo mục 4.6) | Bản Zalo dùng như A, bản web bật thêm |
| Pháp lý | Không phải mạng xã hội: nội dung do HACO chọn đăng | Như A, nhưng vướng chính sách Zalo | Cần giấy của Bộ TT&TT, hoặc ý kiến luật sư trước khi bật |
| Điểm thưởng | Ảnh được duyệt +30, được Cô khen +10, "Món của tuần" +100 | Thêm tim: người nhận +1 (giới hạn) | Bình luận +3 (tối đa 5 lần/ngày), tim +1 (tối đa 10 lần/ngày) |

**Khuyên dùng A**: vẫn đạt mục tiêu "chị em khoe món, được khen, được điểm, lên bảng xếp hạng", bản Zalo vẫn qua duyệt, và phần chuyện trò sôi nổi diễn ra trong nhóm Zalo của Cô Hạ, nơi Zalo cho phép. Code làm sẵn tim và bình luận dưới dạng **công tắc** (tắt mặc định), để bật trên bản web khi đã có ý kiến luật sư.

---

## 2. Màu thương hiệu (đã làm)

Màu lấy thẳng từ điểm ảnh của logo HC và ảnh bìa:

| Biến | Màu | Lấy từ | Dùng cho |
|---|---|---|---|
| `--haco-green` | `#006E32` | Logo HC | Nút chính, tab đang chọn, giá |
| `--haco-green-dark` | `#0B4A24` | Chữ "CÔ HẠ", nút "Nhắn tin" trên ảnh bìa | Tiêu đề, nút khi bấm |
| `--haco-gold` | `#C28A12` | Chữ "KHỞI NGHIỆP F&B" | Hạt Cốm, huy hiệu, bảng xếp hạng |
| `--haco-red` | `#C0261E` | Tạp dề đỏ | Chỉ cho nhãn "Mới" và "Sắp diễn ra" |
| `--haco-cream` | `#FBF6EE` | Nền bếp ảnh bìa | Nền app |

Logo HC nằm ở đầu trang chủ, làm favicon và icon khi lưu ra màn hình chính.

---

## 3. Tính năng v3

### 3.1 Góc bếp chị em (khoe món)
- Nút **"Mình đã nấu"** ở cuối mỗi công thức và ở cuối chế độ nấu. Khách chụp hoặc chọn 1–3 ảnh (`chooseImage` / `openMediaPicker` trên Zalo, ô chọn ảnh trên web), viết 1 câu ngắn, rồi chọn món.
- Ô **đồng ý cho Bếp Cô Hạ đăng ảnh** (không tick sẵn). Ảnh có mặt người là dữ liệu cá nhân (Luật 91/2025).
- Nhân viên duyệt trên CRM, rồi chọn **Duyệt** / **Duyệt và khen** / **Từ chối (kèm lý do)**. Ảnh duyệt rồi hiện ở trang công thức ("12 chị đã nấu món này") và ở trang Góc bếp. Tên hiển thị dạng "Chị Lan · Hà Nội", không lộ SĐT.
- Mỗi tuần Cô Hạ chọn **"Món của tuần"**: ghim lên trang chủ.
- Nút **"Khoe lên Nhật ký Zalo"** (bản Zalo, `openPostFeed`, kiểu image) và **"Gửi vào nhóm Zalo"**.

### 3.2 Hạt Cốm, danh hiệu, bảng xếp hạng
**Điểm thưởng** (đổi được trong `app_settings`, có giới hạn để chống gian lận):

| Việc | Hạt Cốm | Giới hạn |
|---|---|---|
| Ảnh khoe món **được duyệt** | +30 | Tính điểm 1 ảnh/ngày, 5 ảnh/tuần |
| Được Cô Hạ khen | +10 | — |
| Món của tuần | +100 | — |
| Điểm danh | +5 | 1 lần/ngày (đã có) |
| Giữ chuỗi 3, 7, 14, 30 ngày | +10, +30, +60, +150 | Đã có |
| Nấu xong một món (tới bước cuối của chế độ nấu) | +5 | 1 lần/ngày |
| Học xong một bài khoá học | +10 | 1 lần mỗi bài |
| Đố vui bếp, trả lời đúng | +5 (sai vẫn +1) | 1 câu/ngày |
| Mời bạn, bạn xác minh SĐT | +50 | 10 người/tháng |
| *(Hướng C)* Bình luận được duyệt | +3 | 5 lần/ngày |
| *(Hướng B, C)* Nhận tim | +1 | Mỗi người tặng tối đa 1 lần/ngày |

**Danh hiệu** theo tổng Hạt Cốm đã tích (không trừ khi tiêu):

| Danh hiệu | Từ (Hạt Cốm) |
|---|---|
| Tập sự | 0 |
| Đảm đang | 200 |
| Khéo tay | 600 |
| Bếp phó | 1.500 |
| Bếp trưởng | 4.000 |

**Bảng xếp hạng**:
- Gồm **Tuần này** (làm mới mỗi thứ Hai) và **Tháng này**. Bảng tuần cho người mới cơ hội lên top, tránh cảnh vài người dẫn đầu mãi khiến người khác nản.
- Chỉ tính điểm **tương tác**: không tính điểm điểm danh và không tính điểm mua hàng, để người chăm khoe món đứng đầu chứ không phải người mua nhiều.
- Hiện top 10 và **hạng của chính mình**, kèm "còn X hạt nữa để lên hạng Y".
- Chỉ phiên đã xác minh SĐT mới lên bảng. Ai muốn có thể ẩn tên.

Nguồn: [Octalysis: leaderboard](https://yukaichou.com/advanced-gamification/how-to-design-effective-leaderboards-boosting-motivation-and-engagement/), [Gainsight: người dùng lách hệ thống điểm](https://communities.gainsight.com/build-communities-11/help-users-are-gaming-my-point-system-what-advice-do-you-have-23931).

**Huy hiệu**: Khoe món đầu tiên · Chuỗi 7 ngày · Chuỗi 30 ngày · Học xong khoá xôi cốm · Món của tuần · Nấu 10 món.

### 3.3 Thông báo
- **Chuông** ở đầu trang chủ, có số tin chưa đọc. Trang **Thông báo** gồm:
  - sự kiện mới, công thức mới;
  - ảnh được duyệt hoặc được khen, Món của tuần;
  - đơn hàng đổi trạng thái, sắp mất chuỗi ngày, lên danh hiệu mới.
- **Đẩy ra ngoài app**:
  - Bản Zalo: xin quyền `requestSendNotification` đúng lúc khách bấm "Nhắc tôi", cộng tin OA cho người đã quan tâm (tối đa 4 tin truyền thông/tháng, tin tư vấn trong 48 giờ).
  - Bản web: chỉ có chuông trong app, cộng tin OA.
- Nhân viên soạn thông báo trên CRM: gửi cho tất cả, hoặc cho nhóm (đã xác minh, đã mua…).

### 3.4 Sự kiện
- Trang **Sự kiện** có 2 tab: **Sắp diễn ra** (thẻ có đếm ngược) và **Đã qua** (có ảnh hoặc video xem lại).
- Loại sự kiện: livestream nấu cùng Cô Hạ, workshop tại bếp, thử thách tuần ("Tuần này cùng làm xôi cốm": khoe món được nhân đôi điểm), mùa cốm, Rằm và Mùng 1, Tết, ưu đãi.
- Nút **"Nhắc tôi"**: báo trước 1 ngày và trước 1 giờ. Nút **"Thêm vào lịch"** (file .ics trên web). Sự kiện tại bếp có nút **"Đăng ký giữ chỗ"**.
- Trang chủ có thẻ "Sắp diễn ra" ngay dưới banner.
- Nhân viên tạo và sửa sự kiện trên CRM.

### 3.5 Tặng nhiều công thức hơn
- Chuyển thư viện công thức từ code sang **CRM**: nhân viên tự thêm món, gồm ảnh, nguyên liệu, các bước, thời gian từng bước và sản phẩm dùng kèm.
- **Nguồn nội dung cần Cô Hạ cấp**: video YouTube "Cô Hạ dạy nấu ăn" và các bài trong nhóm "Công thức Cô Hạ". Không tự bịa công thức.
- Mỗi tuần một món mới, có thông báo "Món mới tuần này".

### 3.6 Tính năng thêm để chị em mở app mỗi ngày
1. **Danh sách đi chợ**: bấm "Thêm vào danh sách đi chợ" ở công thức, rồi tick từng món khi mua. Món là sản phẩm Bếp Cô Hạ thì có nút đặt luôn.
2. **Hẹn giờ trong chế độ nấu**: bước nào có thời gian (ngâm 15 phút, ướp 2 tiếng) thì có nút hẹn giờ.
3. **Lịch Rằm và Mùng 1**: đếm ngày tới Rằm, Mùng 1, Tết, kèm gợi ý mâm cúng (cần công thức của Cô Hạ).
4. **"Hôm nay ăn gì?"**: chọn nguyên liệu đang có, app gợi ý món.
5. **Đố vui bếp**: 1 câu mỗi ngày về mẹo nấu, có giải thích. Là câu hỏi kiến thức, không may rủi.
6. **Thêm vào màn hình chính** (`createShortcut`) và **Ưa thích** (`favoriteApp`), mời khách sau lần điểm danh thứ 3.
7. **Lời chúc sinh nhật** kèm quà (khách tự nhập ngày sinh, không bắt buộc).

---

## 4. Dữ liệu mới (phiên CRM làm schema)

| Bảng | Mục đích |
|---|---|
| `member_profiles` | Tên hiển thị, khu vực, ẩn khỏi bảng xếp hạng, ngày sinh (tuỳ chọn), danh hiệu |
| `cook_posts` | Ảnh khoe món: phiên/khách, món, 1–3 ảnh, lời nhắn, đồng ý đăng, trạng thái (`cho_duyet` / `da_duyet` / `tu_choi`), được khen, món của tuần, người duyệt |
| `post_reactions`, `post_comments` | Chỉ dùng ở hướng B hoặc C. Có duyệt và công tắc bật/tắt |
| `points_ledger.reason` | Thêm `khoe_mon`, `duoc_khen`, `mon_cua_tuan`, `nau_xong`, `hoc_bai`, `do_vui`, `gioi_thieu` (+ `nhan_tim`, `binh_luan` nếu chọn B hoặc C) |
| `notifications`, `notification_reads` | Hộp thư trong app; gửi cho từng khách hoặc theo nhóm |
| `events`, `event_reminders` | Sự kiện; khách bấm "Nhắc tôi" hoặc giữ chỗ |
| `recipes` | Thư viện công thức do nhân viên sửa trên CRM (thay `src/recipes.ts`) |
| `quiz_questions`, `quiz_answers` | Đố vui bếp |
| `shopping_list` | Danh sách đi chợ (hoặc lưu trên máy) |

**Lưu ảnh:**
- Haco-OS chạy trên Vercel với database Supabase, hiện chưa có chỗ lưu file.
- Chọn **Supabase Storage** (cùng dự án, đặt ở Tokyo, lưu ý Luật 91/2025) hoặc **Vercel Blob**.
- Ảnh được thu nhỏ trên máy khách xuống tối đa 1280px trước khi gửi.
- Có bước lọc ảnh: chỉ nhận ảnh JPEG/PNG/WebP dưới 5MB.

---

## 5. Lộ trình đề xuất

| Đợt | Nội dung | Phụ thuộc |
|---|---|---|
| **v3-A** | Màu thương hiệu ✓, logo ✓, nhóm Zalo, **Sự kiện**, **Thông báo** (chuông + trang), danh sách đi chợ, hẹn giờ khi nấu, thêm vào màn hình chính | Link nhóm Zalo, danh sách sự kiện đầu tiên |
| **v3-B** | **Góc bếp chị em** (gửi ảnh, duyệt trên CRM, Cô Hạ khen, Món của tuần, khoe lên Nhật ký Zalo), điểm mới, **danh hiệu**, **bảng xếp hạng tuần/tháng**, huy hiệu | Chọn hướng A/B/C, chỗ lưu ảnh, người duyệt |
| **v3-C** | Công thức trên CRM, đố vui, lịch Rằm/Mùng 1, "Hôm nay ăn gì?", sinh nhật | Nội dung từ Cô Hạ |

---

## 6. Trạng thái (24/10/2026)

**Đã chọn hướng A.** Đợt **v3-A đã chạy** trên dev (`localhost:3030/m`), dùng API thật:
- **Màu thương hiệu và logo HC.** Ô "Group bếp" mở nhóm Zalo khi có biến `VITE_ZALO_GROUP_URL` (chờ link).
- **Sự kiện** (`/su-kien`, `/su-kien/:slug`):
  - nút "Nhắc tôi", "Giữ chỗ" có giới hạn số chỗ, "Thêm vào lịch" (file .ics, chỉ bản web);
  - thẻ "Sắp diễn ra" trên trang chủ.
- **Thông báo** (`/thong-bao`):
  - chuông có số tin chưa đọc;
  - nhắc sự kiện tự hiện trước 24 giờ (không cần cron);
  - tin chỉ được trỏ tới đường dẫn trong app (Zalo 4.1).
- **Danh sách đi chợ** (`/di-cho`): lưu trên máy, nhóm theo món, có nút đặt sản phẩm Bếp Cô Hạ.
- **Công thức chi tiết:**
  - 26 món (22 món mới, gắn `review: 'cho_co_ha_duyet'`, Cô Hạ cần đọc lại định lượng);
  - mỗi món chia Sơ chế → Nấu → Trình bày, có định lượng, số người ăn, độ khó;
  - món chưa có ảnh thật thì dùng ảnh minh hoạ.
- **Hẹn giờ trong chế độ nấu:** chạy suốt khi chuyển bước; hết giờ thì rung, kêu bíp, thẻ chuyển đỏ.
- **Thêm vào màn hình chính:**
  - Zalo dùng `createShortcut`, Android hiện hộp cài đặt, iPhone hiện hướng dẫn;
  - có `manifest.webmanifest`;
  - chỉ mời sau khi khách đã điểm danh.
- **Server:** `lib/mini/{events,notifications}.ts`, `/api/mini/events/**`, `/api/mini/notifications/**`, `/me` có thêm `unread_notifications`. Schema v12 do phiên CRM làm.
- **Phiên CRM làm:** màn tạo sự kiện và soạn thông báo trên CRM.

**Còn lại:** v3-B (Góc bếp chị em, bảng xếp hạng, danh hiệu), v3-C (công thức trên CRM, đố vui, lịch Rằm/Mùng 1).

## 7. Cần Cô Hạ quyết hoặc cung cấp
1. Chọn hướng **A / B / C** cho tim và bình luận.
2. **Link nhóm Zalo** "Group bếp" (dạng `https://zalo.me/g/…`).
3. Các **sự kiện sắp tới** (tên, ngày giờ, hình thức, ảnh).
4. **Quà** theo danh hiệu, cho top tuần và Món của tuần. Nếu có quà cho top thì cần thể lệ và đăng ký khuyến mại.
5. **Người duyệt ảnh** hằng ngày, và thời gian duyệt mong muốn (ví dụ trong 12 giờ).
6. **Nguồn công thức**: danh sách video hoặc bài muốn đưa vào app.
