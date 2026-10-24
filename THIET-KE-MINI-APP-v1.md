# THIẾT KẾ MINI APP HACO · v1 (23/10/2026)

> Bản thiết kế Mini App cho khách HACO Food / Bếp Cô Hạ, dựng theo **HACO Funnel Map V1** (9 bước) và đối chiếu với:
> bài học phễu trong `Mau/` (Buổi 4), chính sách Zalo OA, tài liệu Zalo Mini App, số liệu thật trong `HACO-LOOP/09-BUOC-0.5-TY-LE-MUA-LAI.md`
> và kế hoạch CRM của phiên **CRM HACO Food**.
> Mini App **không có cơ sở dữ liệu riêng**: mọi dữ liệu đi qua API của Haco-OS (CRM). Mục 6 là hợp đồng dữ liệu giữa hai bên.

---

## 1. Bài học phễu nằm ở đâu

Phần "hệ thống phễu marketing" nằm ở **Buổi 4 (03/10)**, do 3 người trình bày:

| Bài | Người nói | Nội dung chính | Dùng cho HACO |
|---|---|---|---|
| B4·7 (1:07–1:20) | Dương Trọng Nghĩa (KP3) | Sales Funnel; sơ đồ "Hộp đen / Invisible Funnel"; bảng Sàn vs Funnel | Khung tổng |
| B4·8 (1:20–1:35) | Nghĩa | Phễu 8 bước của Challenge 21 ngày, đo từng bước (175 form → 116 đặt lịch → 42 gặp → 29 trả tiền) | Cách đo |
| B4·9 (1:35–1:49) | Nghĩa | Bậc thang giá trị LadyBoss; **5 bước cho sản phẩm vật lý ở Việt Nam** | **Khung chính cho HACO** |
| B4·14–15 (2:43–3:06) | Đỗ Chí Dũng | Quà tĩnh → quà động; 2 bẫy khi làm quà; trang cảm ơn 2 lựa chọn (chia sẻ 2 bạn / trả phí nhỏ) | Bước 4, 9 |
| B4·4 (0:35–0:46) | Đỗ Đăng Khoa (CNV) | PDTS 3 tầng Traffic → Automation → Scale; công thức 4T cho QR; 6 hệ thống | Bước 3, 6 |
| B1·3, B1·7 | Đỗ Chí Dũng | Phễu chẩn đoán; Content → Lead → CRM | Bước 4, 6 |

### 1.1 Năm điều rút ra cho một doanh nghiệp bán đồ ăn như HACO

1. **"Sàn cho mình đơn hàng, funnel cho mình khách hàng mãi mãi"** (Nghĩa, 1:19). Sàn vẫn giữ làm cửa vào; Mini App là nơi giữ khách.
2. **5 bước cho sản phẩm vật lý ở Việt Nam** (Nghĩa, 1:47):
   1. Câu chuyện thật của sản phẩm → **Cô Hạ và cốm**.
   2. Cửa vào giá thấp: một challenge nhỏ, ebook hoặc mẫu thử, rồi kéo khách về cộng đồng Zalo → **khoá "Học làm xôi cốm cùng Cô Hạ" miễn phí**.
   3. Đóng gói thành hệ thống: bán bộ nguyên liệu kèm cách làm, không bán lẻ từng món → **combo nguyên liệu xôi cốm**.
   4. Agent chăm sóc: nhắc dùng, hỏi kết quả → **hỏi "chị làm được chưa", xin ảnh thành phẩm**.
   5. Bán định kỳ, upsell, cộng đồng → **mua lại theo mùa và dịp lễ, group khách**.
3. **Hộp đen:** người mới vào không thấy mình bị bán hàng. Sản phẩm được lồng vào bài học. LadyBoss đưa sản phẩm vào ngày 10–11 của challenge. Với HACO, mỗi bài video có ô "nguyên liệu dùng trong bài này".
4. **Quà phải hẹp, và quà không được là điểm cuối** (Dũng, 2:51). Quà rộng chỉ thu về "thợ săn quà". Sau khi nhận quà luôn phải có bước tiếp theo: mua combo, đặt lịch, vào group. Trang cảm ơn luôn có 2 lựa chọn: *chia sẻ cho 2 người bạn* hoặc *mua gói nhỏ*.
5. **Đo từng bước** (Nghĩa, slide Salepage 21D). Mỗi bước trong 9 bước phải có số người vào và số người đi tiếp, nếu không thì không biết bước nào rò rỉ.

---

## 2. Funnel Map V1: chỉnh lại cho đúng thực tế

| # | Bước trên bản đồ | Giữ / Sửa | Lý do (nguồn) |
|---|---|---|---|
| 1 | Facebook Ads | Giữ. Mini App không thay thế | Đơn vẫn về Pancake (FB/TikTok/Shopee) |
| 2 | Đơn hàng 1 | Giữ. Đơn vẫn chốt qua chat | **60–70% khách Zalo vẫn chat để mua**, nên nút Chat luôn nổi (B4 K14) |
| 3 | Nhận hàng + QR | **Sửa:** mỗi lô in một mã; mỗi hộp chỉ **một** lời kêu gọi; truyền thông về QR **trước** khi khách mua | B4 K10, K11, 4T. KPI "quét >30%": bài nói 40–56% là khi làm đủ 4T; HACO ước 3–8% nếu chỉ in tờ giấy (file 04) |
| 4 | Landing page (form tên/SĐT/Zalo/Email) | **Sửa:** bỏ ô Email (email chỉ có ở 0,07% đơn sản phẩm). Bản Zalo dùng `getPhoneNumber` (bấm một lần). Thêm ô **mã đơn** để ghép với đơn sàn. Thêm ô **đồng ý nhận tin**, có lưu bằng chứng | File 04, B4 K17, Luật 91/2025 |
| 5 | Video hướng dẫn 8 bài | Giữ. Dùng **video của HACO** (không dùng video webinar: bản quyền Gbe AI Hub). Mỗi bài có ô nguyên liệu (hộp đen) | B4·9 |
| 6 | CRM + chuỗi tin 30–45 ngày | **Sửa theo luật tin của Zalo** (mục 3.2). Trần nội bộ tối đa 2 tin/tuần | Chính sách Zalo, kế hoạch CRM |
| 7 | Upsell / cross-sell | Giữ. Sản phẩm upsell **không đăng bán trên sàn**; deal trong 24 giờ | B4 K01, K02 |
| 8 | Mua lại ("nhắc 14–30 ngày") | **Sửa:** không sản phẩm nào đạt 15% mua lại; sốt chỉ 3–6%. Dùng **nhịp 4–6 tuần + dịp lễ**, luôn có nhóm đối chứng | File 09 |
| 9 | Giới thiệu (tặng 50K cả hai) | Giữ cơ chế. **Mục tiêu "Referral >10%" quá cao**: mức nền hiện = 0. Năm đầu đặt 2–3% | File 09 |

**KPI trên bản đồ, chỉnh cho có thể kiểm chứng:**

| Chỉ số | Bản đồ | Đề xuất v1 | Nền hiện tại |
|---|---|---|---|
| Tỷ lệ quét QR | >30% | Đo theo lô; mục tiêu 15% ở lô đầu, 30% sau khi làm đủ 4T | chưa đo |
| Tỷ lệ kích hoạt (để lại SĐT trong số người quét) | >40% | giữ | chưa đo |
| Mua lại | 20–30% | **Cao hơn nhóm đối chứng +3 điểm trong 90 ngày** | 9,6% / 90 ngày |
| LTV 60–90 ngày | ≥3× CAC | đo LTV theo kênh mua đầu | LTV gộp 341k; CAC chưa đo |
| Giới thiệu | >10% | 2–3% số khách đã mua | 0 |

---

## 3. Chính sách Zalo đã đọc (ảnh hưởng thiết kế)

### 3.1 Tài khoản OA ([chính sách đăng ký](https://oa.zalo.me/home/documents/vie/policy/dang-ky-va-su-dung-tai-khoan-zalo-official-account-doanh-nghiep))
- Tên OA = Tiền tố + Tên chính + Hậu tố. Tên chính phải là tên doanh nghiệp/cửa hàng, hoặc **thương hiệu đã được Cục SHTT cấp văn bằng bảo hộ**. Muốn dùng tên "Bếp Cô Hạ" phải kiểm tra văn bằng; nếu chưa có thì dùng tên doanh nghiệp.
- Phải **nộp hồ sơ xác thực trong 14 ngày** kể từ khi tạo OA, nếu không OA bị khoá vĩnh viễn. Duyệt mất 2–3 ngày làm việc. Mỗi lần đổi tên, ảnh hay giới thiệu đều bị duyệt lại.
- Doanh nghiệp chịu trách nhiệm toàn bộ nội dung gửi đi. Link phải rõ ràng và hợp pháp.

### 3.2 Loại tin và phí ([chính sách gửi tin](https://oa.zalo.me/home/resources/news/thong-bao-chinh-sach-gui-tin-va-quy-dinh-phi-gui-tin_1433049880779375099), áp dụng từ 20/06/2023)

| Loại tin | Gửi cho ai | Điều kiện | Phí |
|---|---|---|---|
| Tư vấn | Có hoặc chưa quan tâm OA | Khách tương tác trong **7 ngày** gần nhất | 8 tin đầu trong 48 giờ miễn phí, sau đó 55đ/tin |
| Giao dịch | Có hoặc chưa quan tâm OA | Có tương tác hoặc cho phép | 165đ/tin |
| Truyền thông | **Chỉ người quan tâm OA** | — | Miễn phí trong hạn mức gói; **tối đa 4 tin/tháng/người** (gói Premium từ 01/02/2024) |
| ZBS Template (thay cho ZNS) | Theo SĐT hoặc UID | Mẫu tin phải được duyệt; tag TRANSACTION / CUSTOMER_CARE / PROMOTION | Bên thứ ba ghi khoảng 200đ/tin CSKH, cộng phí nút và ảnh. **Cần xem giá trong tài khoản ZBS** |
| **Tin nhắn hành trình (Mini App)** | Khách vừa **thanh toán qua Checkout SDK** | OA đã xác thực cho Mini App | **0đ**, 2 tin/token, token dùng được 15 ngày, mẫu "Thanh toán thành công" |

**Hệ quả cho bước 6 và 8:** chuỗi "30–45 ngày" chỉ chạy miễn phí với người **đã quan tâm OA**, tối đa 4 tin/tháng. Người chỉ có SĐT thì phải dùng ZBS trả phí. Vì vậy, việc quan trọng nhất của Mini App là **đổi lượt quét QR thành một lượt quan tâm OA**.

**Gói OA:** theo các bài viết bên thứ ba ([miniai.vn](https://miniai.vn/so-sanh-goi-zalo-oa-cu-va-moi/), [smsthuonghieu](https://www.smsthuonghieu.com/goi-zalo-oa/)), từ 1/6/2026 Zalo đổi sang 4 gói: Cơ bản 0đ, Tiêu chuẩn 1tr/năm, Tăng trưởng 2,5tr/năm, Toàn diện 6tr/năm. Gói Tăng trưởng có 4 lượt truyền thông/người/tháng, 500 tin tư vấn ngoài khung và giới hạn 100 request/phút. **Chưa có nguồn chính thức. Phải xem trong trang quản trị OA khi mua.** Dự kiến dùng gói Tăng trưởng (khớp mức 2,5tr/năm ghi trong file 04).

### 3.3 Zalo Mini App ([docs.zaloplatforms.com](https://docs.zaloplatforms.com/docs/MA/api/intro), cập nhật 22/10/2026)
- `getPhoneNumber`: trả về token **dùng 1 lần, hết hạn sau 2 phút**. Server đổi token lấy số qua `GET graph.zalo.me/v2.0/me/info` với header `access_token`, `code` và `secret_key`. Khóa bí mật **chỉ được nằm ở server**. Đây là API cần **xin duyệt**: nộp sau khi gửi bản đầu tiên. Mini App nào xin quyền mà không giải thích rõ mục đích sẽ bị từ chối, nên chỉ xin SĐT đúng lúc khách bấm "Nhận khoá học" hoặc "Đặt hàng".
- `getUserID`: ID riêng theo Zalo App, không cần khách xác nhận. Dùng làm định danh phụ.
- `followOA` / **`showOAWidget`**: widget "Quan tâm" cho phép khách quan tâm OA **không cần bảng xin quyền**.
- `openShareSheet`: chia sẻ link, ảnh hoặc OA cho bạn bè Zalo. Dùng cho bước 9.
- `requestSendNotification`: xin quyền nhận thông báo qua OA Mini App.
- **Checkout SDK là bắt buộc** khi Mini App có thanh toán. Hỗ trợ **COD** và **chuyển khoản ngân hàng** (cùng ZaloPay, MoMo, VNPay…). Đơn đặt trong Mini App phải đi qua Checkout SDK; đổi lại được dùng tin nhắn hành trình 0đ.

### 3.4 Dữ liệu cá nhân
- **Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15, có hiệu lực từ 01/01/2026.** Theo các bài phân tích, lưu dữ liệu trên máy chủ ở nước ngoài được tính là chuyển dữ liệu xuyên biên giới: phải có hồ sơ đánh giá tác động và thông báo cho Bộ Công an (Nghị định 356/2025). **Supabase đang đặt ở Tokyo**, nên cần luật sư xác nhận trước khi mở rộng thu thập.
- Mini App phải lưu **bằng chứng đồng ý**: nội dung câu đồng ý (có phiên bản), thời điểm và kênh. Khách phải rút lại được.

---

## 4. Hành trình khách trên Mini App (MVP)

```
[Thùng hàng] QR lô (vd HX-2611-COMXOI)
   │ quét
   ▼
① Trang chào Cô Hạ (video 20s) — "Cô tặng chị khoá Học làm xôi cốm 8 bài"
   │ bấm Nhận
   ▼
② Xác nhận SĐT (Zalo: getPhoneNumber · Web: nhập SĐT + OTP Zalo/SMS*)
   + ô mã đơn (không bắt buộc) + ô đồng ý nhận tin [lưu bằng chứng]
   │
   ├─► widget Quan tâm OA  ("để Cô gửi bài tiếp theo và theo dõi đơn")
   ▼
③ Khoá học: 8 bài, bài 1 mở ngay, mỗi ngày mở 1 bài (giữ khách quay lại 8 ngày)
   mỗi bài: video + ô "Nguyên liệu trong bài" → [Mua combo]  (hộp đen)
   │
   ├─► Đơn upsell 24 giờ: combo không bán trên sàn, giảm sâu, có đồng hồ đếm ngược (B4 K01, K02)
   ▼
④ Đặt hàng: Checkout SDK (COD / chuyển khoản SePay) → đơn tạo vào Pancake
   → tin hành trình 0đ "Thanh toán thành công"
   ▼
⑤ Trang cảm ơn 2 lựa chọn: [Gửi khoá học cho 2 người bạn] hoặc [Thêm 1 món nữa giảm X%]
   ▼
⑥ "Của tôi": đơn hàng, ưu đãi/ví, tiến độ học, mã giới thiệu, nút Chat luôn nổi
```
\* Bản web: chỉ xác minh SĐT khi cần (đặt hàng, nhận thưởng). OTP qua ZBS có tính phí, nên lúc đầu dùng xác nhận qua chat.

**Không làm trong MVP:** vòng quay may mắn, chấm điểm hay quà động, nhắc "dùng hết" theo từng SKU, đặt mua định kỳ. Thêm sau khi có số đo.

---

## 5. Kiến trúc

- **Một backend:** Haco-OS (Next.js + Supabase), do phiên CRM xây. Mini App chỉ gọi `/api/mini/*`, không chạm thẳng vào database và không giữ khóa bí mật.
- **Một codebase giao diện, chạy 2 chế độ:** React + Vite (đúng chuẩn Zalo Mini App, dùng `zmp-ui`). Một lớp `platform/` gồm 4 phần:

| Phần | Bản web (làm trước) | Bản Zalo Mini App |
|---|---|---|
| Định danh | Form SĐT | `getPhoneNumber` → server đổi token |
| Quan tâm OA | Link `zalo.me/<oa_id>` | `showOAWidget` / `followOA` |
| Chia sẻ | Web Share API, link Zalo/Messenger | `openShareSheet` |
| Thanh toán | QR SePay / COD | Checkout SDK (COD, chuyển khoản) |

- Danh tính chính = **SĐT đã chuẩn hoá** (`lib/phone.ts`) → `customers.phone`. Zalo UID, OA user id và Pancake id là các định danh phụ.
- Phiên đăng nhập: token riêng cho khách (`lib/mini-auth.ts`, xem 6.2), có cờ `verified`. Không lưu dữ liệu cá nhân trong `localStorage`.
- 9 viên gạch (B2 Z03): Mini App kế thừa phân quyền, nhật ký và sao lưu của Haco-OS. Riêng phía Mini App phải có thêm giới hạn tần suất cho `/api/mini/*`, chống quét mã hàng loạt, và chống gian lận giới thiệu (mỗi SĐT nhận quà 1 lần; chỉ trả thưởng khi **đơn của người được giới thiệu đã giao thành công**).

---

## 6. Hợp đồng dữ liệu Mini App ↔ CRM (cần phiên CRM xác nhận)

> **v1.1 (23/10):** đã sửa theo phản hồi của phiên CRM, đối chiếu với `lib/db.ts`, `loop-db.ts`, `crm-db.ts` bản tháng 9. Repo Duacamuoi chưa clone xong nên có thể còn đổi nhẹ.

**Quy ước của Haco-OS (áp cho mọi bảng mới):**
- Schema nằm trong `initDb()` ở `lib/db.ts`, viết dạng `CREATE TABLE IF NOT EXISTS` và `ADD COLUMN IF NOT EXISTS`, chạy lại nhiều lần không hỏng. Phiên CRM viết phần này.
- Khoá chính `SERIAL INT`, khoá ngoại `customer_id INT REFERENCES customers(id)`.
- Enum dùng `TEXT + CHECK`, giá trị viết thường, không dấu, snake_case.
- Tiền `BIGINT` (đồng); thời gian `TIMESTAMPTZ DEFAULT NOW()`; JSON `JSONB NOT NULL DEFAULT '{}'`.
- ID Pancake là `TEXT`.

### 6.1 Bảng mới

| Bảng | Cột chính | Đợt |
|---|---|---|
| `qr_batches` | code (PK), sku, channel CHECK('shopee','tiktok','facebook','bep'), cta, landing_variant, printed_qty, created_at | A |
| `funnel_events` | id **BIGSERIAL**, customer_id NULL, anon_id, name, step INT (chỉ để sắp xếp), batch_code, props, created_at | A |
| `consents` | id, customer_id, channel, purpose, text_version, **text_hash**, granted_at, revoked_at, source, evidence | A |
| `order_claims` | id, customer_id, order_ref, platform (cùng tập giá trị với qr_batches.channel), status CHECK('cho_duyet','da_khop','tu_choi'), matched_pancake_order_id TEXT, reviewed_by, reviewed_at, **UNIQUE(platform, order_ref)** | A |
| `lesson_progress` | PK(customer_id, lesson_no), unlocked_at, watched_pct SMALLINT 0–100, completed_at | A |
| `reward_ledger` | id, customer_id, **program**, kind CHECK('voucher','hoan_tien','gioi_thieu'), amount, code, expires_at, order_id, referral_reward_id NULL → referral_rewards, status CHECK('da_cap','da_dung','het_han','huy'), **UNIQUE(customer_id, program)** | A (chỉ voucher) |
| `customer_identities` | customer_id, kind CHECK('zalo_app_uid','zalo_oa_uid'), value, UNIQUE(kind, value) | B (cần OA) |

**Quy tắc đi kèm:**
- **Khách chưa có SĐT không được tạo trong `customers`**, vì cột `phone` là NOT NULL UNIQUE. Trước bước identify, khách chỉ tồn tại qua `funnel_events.anon_id`. Khi identify xong thì gán `customer_id` cho các event có cùng `anon_id`.
- `customers.opted_out_at` là **công tắc chặn liên hệ duy nhất**. `consents` chỉ là sổ bằng chứng. Khi khách thu hồi mọi kênh thì ghi `revoked_at` và set `opted_out_at` trong cùng một transaction. Phiên CRM sẽ chép các lượt đồng ý cũ từ `gift_leads` sang (source = 'gift_form_legacy').
- **"Mỗi SĐT nhận quà một lần" chặn bằng unique index trong database**, không dựa vào giới hạn tần suất (`lib/ratelimit.ts` chỉ lưu trong bộ nhớ, chỉ dùng chống spam).
- Chống thưởng giới thiệu trùng: dùng `referral_rewards` (referred_id UNIQUE) và `loop-db`. `reward_ledger` chỉ ghi tiền thưởng.
- Mã voucher sinh mới, không dùng `lib/promo.ts` (file này chỉ dành cho khuyến mãi 239k).
- Chỉ ghi các mốc quan trọng sang `customer_activities`: `qr_scan`, `oa_follow`, `order_claim_matched`, `lesson_done`.

**Bảng có sẵn cần đổi (Giai đoạn 0 của CRM):**
- `customers.source` thêm giá trị `'mini'`.
- `audit_logs`: bỏ các CHECK đang giới hạn table_name và action, cho `user_id` NULL, thêm `actor_type` CHECK('staff','customer','system','agent') và `actor_id`. Mini App ghi `actor_type = 'customer'`.
- Việc tự sinh từ Mini App dùng `crm_tasks.auto_key` dạng `mini:lesson3:<customer_id>`.

### 6.2 Đăng nhập cho khách (lib/mini-auth.ts, file mới)
- **Không dùng `lib/auth.ts`**, vì token nhân viên ký bằng `JWT_SECRET`; dùng chung secret thì token khách có thể bị coi là nhân viên.
- Token khách: jose HS256, secret riêng `MINI_SESSION_SECRET`, `aud = 'mini'`, `sub = customer_id`, hạn 30 ngày. Bản web lưu trong cookie httpOnly (SameSite=Lax); bản Zalo gửi qua header Authorization. Token nhân viên cũng được thêm `aud = 'staff'`, và cả hai phía đều kiểm tra `aud`.
- **Cờ `verified`:**
  - SĐT tự gõ trên web (chưa có OTP) cho `verified = false`. Khi đó `/me` **chỉ trả dữ liệu do chính phiên này tạo ra** (đơn vừa nhận, voucher vừa cấp, tiến độ học). **Không bao giờ trả lịch sử đơn Pancake, địa chỉ hay tổng chi tiêu**, vì ai cũng gõ được số của người khác.
  - Chỉ `zalo_phone_token` hoặc OTP mới cho `verified = true`.
- **Bảng `mini_sessions`** (chốt 23/10): id, anon_id, phone (đã chuẩn hoá), verified, verified_via CHECK('zalo_phone_token','otp','staff','order_match'), customer_id NULL, batch_code, created_at, verified_at.
  - `funnel_events`, `order_claims`, `lesson_progress`, `consents` và `reward_ledger` đều có `mini_session_id NOT NULL`.
  - `customer_id` chỉ được điền khi phiên đã xác minh. `lesson_progress` đổi khoá chính thành (mini_session_id, lesson_no).
  - Khi phiên được xác minh, hàm `promoteMiniSession()` chạy trong 1 transaction: gán customer_id, gộp tiến độ học (lấy mức lớn hơn), ghi các mốc vào `customer_activities`, áp đồng ý hoặc rút đồng ý vào `opted_out_at`, ghi `audit_logs`.
- **SĐT chưa xác minh trùng với khách đã có:** `mini_sessions.customer_id = NULL`. Không ghi `customer_activities`, không đổi thông tin khách, không cấp ưu đãi vào hồ sơ đó.
  - Nhân viên duyệt một `order_claim` thì chỉ chuyển đơn đó. Muốn chuyển cả phiên thì nhân viên bấm "xác minh phiên" riêng (`verified_via = 'staff'`).
- **SĐT mới chưa xác minh (phương án B có giới hạn):**
  - Vẫn tạo customer (source 'mini', stage 'moi') và cấp voucher, mỗi SĐT 1 lần.
  - **Voucher chỉ dùng được khi đặt đơn bằng đúng SĐT đó.**
  - **Chưa gửi tin chủ động** cho tới khi xác minh. CRM hiện nhãn "chưa xác minh" trên hồ sơ.
- **Xác minh bằng khớp đơn (`order_match`):**
  - Khi mã đơn và SĐT của phiên khớp **đúng 1** đơn Pancake, hệ thống tự đặt `order_claims = 'da_khop'`, xác minh phiên và chạy `promoteMiniSession()` (actor 'system').
  - Không khớp hoặc khớp nhiều đơn: chuyển sang chờ nhân viên duyệt.
  - Giới hạn, đếm trong database: tối đa 5 lần không khớp mỗi phiên trong 24 giờ; tối đa 10 lần mỗi SĐT trong 24 giờ. Vượt thì trả lỗi 429 và khoá chức năng nhận đơn của phiên 24 giờ. Mỗi lần thử ghi một event `claim_attempt`.
  - Tra trên bảng đồng bộ **`pancake_orders`** (pos_order_id, platform, platform_order_ref, tracking_code, phone_norm, status, inserted_at). Bảng cập nhật mỗi đêm, và mỗi giờ cho đơn 14 ngày gần nhất.
  - **Đơn Shopee và TikTok đều bị che SĐT** (HACO-LOOP/01), nên tự khớp chỉ chạy được cho đơn Facebook, web và bếp (khoảng 76% đơn). Đơn hai sàn chờ nhân viên duyệt tay.
  - **Ô nhập (chốt 23/10):** nhãn "Mã đơn". Gợi ý dưới ô: "TikTok/Shopee: xem trong app sàn · Facebook: số in trên phiếu giao hàng". Khách không phải chọn kênh.
    - Dạng mã đếm trên 47.970 đơn export:
      - TikTok: mã 18 số (9.047/9.471 đơn).
      - Shopee: mã chữ và số, phần lớn đơn.
      - Facebook: 5 số (27.340 đơn), dạng chữ + số có dấu chấm (6.982 đơn), 4 số (2.243 đơn).
    - Mã vận đơn: bản export không có, nên tạm để làm phương án phụ.
    - Server chuẩn hoá mã: viết hoa, bỏ khoảng trắng, gạch ngang và dấu #. Sau đó tra lần lượt `tracking_code`, `platform_order_ref`, `pos_order_id` trong `pancake_orders`, rồi tự suy ra kênh từ đơn tìm được.
    - Khớp đúng 1 đơn và đúng SĐT: tự xác minh. Khớp nhiều đơn, không có SĐT để so (sàn), hoặc không tìm thấy: chuyển sang chờ duyệt. Lưu cả mã gốc khách gõ (`order_ref_raw`) và loại mã khớp được (`ref_kind`).
    - Một đơn Pancake chỉ được nhận một lần: unique theo `matched_pancake_order_id` khi trạng thái là `da_khop`.
    - Tra **cả 3 cột rồi mới quyết**. Nếu gom được nhiều hơn 1 đơn khác nhau thì để chờ duyệt (mã POS ngắn dễ trùng tình cờ).
    - `order_claims.lookup_result` ghi lý do đang chờ: 'khop_sdt' / 'don_san' / 'nhieu_don' / 'sai_sdt' / 'chua_thay'. Nhóm 'sai_sdt' cần nhân viên xem kỹ, vì có thể có người tranh nhận.
    - Kết quả 'chua_thay' được tra lại sau mỗi lần đồng bộ hàng giờ, trong 24 giờ (`retry_until`). Hết hạn mới chuyển cho nhân viên.
    - **Màn hình cho khách** khi đơn đang chờ: "Cô Hạ đang kiểm tra đơn của chị, sẽ báo trong vòng 24 giờ". Không nói lý do, để không lộ việc mã đơn đó có tồn tại hay không.
- `customers.phone_verified_at`: điền sẵn cho khách cũ; để NULL với khách `mini` chưa xác minh (CRM hiện nhãn); `promoteMiniSession()` sẽ điền.
- `reward_ledger.locked_phone`: voucher chỉ áp dụng khi SĐT trên đơn trùng số này.
- Gửi tin chủ động chỉ khi `consents.verified = true` **và** `customers.phone_verified_at IS NOT NULL`.
- **Đồng ý từ phiên chưa xác minh:** `consents.verified = false`. Không đổi `opted_out_at` và không được tính là đồng ý khi gửi tin chủ động.

### 6.3 API Haco-OS cho Mini App

| Method | Đường dẫn | Việc | Đợt |
|---|---|---|---|
| POST | `/api/mini/session` | Ghi lượt quét `{batch, anon_id}` → trả nội dung trang chào | A |
| POST | `/api/mini/event` | Ghi `funnel_events` | A |
| POST | `/api/mini/identify` | `{phone \| zalo_phone_token, consent{text_version}}` → ghi thẳng `customers` + `consents` (**không đi qua `/api/gift-form`**, vì route đó kích hoạt chuỗi 5 email), trả token kèm `verified` | A |
| POST | `/api/mini/claim-order` | `{order_ref, platform}` → `order_claims`; nhân viên duyệt trên CRM | A |
| GET | `/api/mini/me` | Bản giới hạn theo `verified` | A |
| POST | `/api/mini/lesson/:no/progress` | Cập nhật tiến độ xem | A |
| POST | `/api/mini/order` | `createPancakeOrderGeneric` + `generatePaymentRef` (tiền tố `MINI`) + handler mới trong `payment-handlers.ts` | B |
| POST | `/api/zalo/oa-webhook` | follow/unfollow, tin khách gửi → `customer_identities`, `customer_activities` | B |
| POST | `/api/zalo/checkout-callback` | Kết quả thanh toán (HMAC-SHA256), nhận `oaMessageToken` | C |

Hiện **chưa có route nào Mini App gọi được ngay**: `/api/customers/*` đòi đăng nhập nhân viên, còn `/api/unsubscribe` và `/api/confirm-optin` đã mất mã nguồn.

Thư viện dùng lại: `normalizePhone`, `createPancakeOrderGeneric`, `generatePaymentRef` / `buildQRPayload`, `loop-db` (`ensureReferralCodes`, `resolveReferrals`). Muốn "chỉ trả thưởng giới thiệu khi đơn đã giao" thì bước đồng bộ Pancake phải lấy thêm trạng thái đơn.

### 6.4 CRM nhận được gì từ Mini App
- Mỗi khách có thêm: lô QR đã quét, đã quan tâm OA chưa, tiến độ khoá học, đơn đã ghép, ưu đãi, người giới thiệu.
- Màn duyệt `order_claims` (Đợt A). Việc tự sinh "học tới bài 3 nhưng chưa mua combo" (Đợt B).
- Bảng thứ Hai cho Cô Hạ: số khách qua từng bước 1–9 theo lô và kênh, so với nhóm đối chứng. Làm cuối Đợt A, khi đã có dữ liệu.

---

## 7. Lộ trình (hạn chót: chạm 14.379 khách lâu không mua **trước đầu tháng 12**)

| Đợt | Thời gian | Kết quả | Phụ thuộc |
|---|---|---|---|
| A · Web | 27/10 – 09/11 | Bước ①②③⑤⑥ chạy trên web; QR lô đầu in vào thùng; `funnel_events` đo được. Nút mua dẫn sang Messenger hoặc landing page đang có | CRM Giai đoạn 0 xong trước 27/10 (phụ thuộc Duacamuoi); video bài 1–3 |
| B · Đặt hàng | 10/11 – 16/11 | Bước ④ trên web (Pancake + SePay/COD, tiền tố `MINI`); upsell 24 giờ; việc tự sinh "học tới bài 3" | Chốt combo và giá |
| C · Zalo | khi OA đã xác thực (dự kiến ~20/11) | Đóng gói Zalo Mini App: getPhoneNumber, widget OA, Checkout SDK, tin hành trình | OA, Zalo App, duyệt Mini App và quyền SĐT (cộng thêm vài ngày) |
| D · Tăng trưởng | tháng 12 | Ví hoàn tiền, giới thiệu 50K, mẫu ZBS cho nhịp 4–6 tuần (có nhóm đối chứng), chúc sinh nhật | Ngân sách thưởng; luật sư xác nhận dữ liệu |

---

## 8. Việc cần Cô Hạ / người phụ trách làm (máy không làm thay được)

1. **Tạo và xác thực Zalo OA ngay:** chọn tên theo đúng công thức và nộp giấy tờ trong 14 ngày. Kiểm tra văn bằng bảo hộ nếu muốn dùng tên "Bếp Cô Hạ".
2. Tạo **Zalo App + Mini App** trên developers.zalo.me và **tài khoản ZBS**; liên kết với OA.
3. Chọn gói OA, sau khi xem giá và hạn mức trong trang quản trị.
4. Chốt **lời mời trong thùng** (khoá học xôi cốm hay 21 món: chỉ chọn 1), **combo upsell không bán trên sàn**, mức giảm 24 giờ, ngân sách thưởng giới thiệu.
5. **Video khoá học 8 bài** của HACO: có thể dùng skill `cooking-curriculum-video` để lên kịch bản.
6. Nhờ luật sư xem việc lưu dữ liệu khách trên Supabase Tokyo theo Luật 91/2025.
7. Phân công người quản trị OA và group (blueprint vẫn ghi "đang trống").
