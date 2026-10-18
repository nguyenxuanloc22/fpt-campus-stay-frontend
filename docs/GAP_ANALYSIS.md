# RÀ SOÁT ĐỘ LỆCH: MÃ NGUỒN ↔ ĐỀ TÀI & MAIN FLOW
**CampusStay FPT** · Ngày rà soát: 17/10/2026 · Phạm vi: `apps/web`, `packages/*`, `docs/*`
**Căn cứ:** **Use Case Diagram v2** ([`diagrams/usecase-diagram-v2.webp`](diagrams/usecase-diagram-v2.webp) — ưu tiên cao nhất), Phiếu đăng ký FA26SE260, Context Diagram, 5 Activity Diagram, 3 State Diagram, ERD F0–F6.

Mức độ: 🔴 sai nghiệp vụ (phải sửa trước bảo vệ) · 🟠 thiếu chức năng có trong đề tài · 🟡 dư thừa / không có nguồn gốc · 🟢 đã đúng.

---

## 1. ĐÃ SỬA TRONG ĐỢT NÀY

| Hạng mục | Thay đổi |
|---|---|
| Phân quyền (`packages/permissions`) | Theo Use Case v2: thêm `room_change:*`, `checkin:self`, `checkin:process_manual` (Staff), `checkout:verify` (Staff), `maintenance:view_schedule`, `maintenance:approve_schedule`, `assignment:adjust_proposal` (Staff), `assignment:configure_engine`, `assignment:monitor_engine`, `notification:view_own`; Manager có `report:financial`; bỏ `assignment:run_batch`, `assignment:manual` (engine là actor System; điều chỉnh thủ công nằm trong `adjust_proposal`). Thêm test. |
| Trạng thái (`packages/constants/statuses.ts`) | Viết lại theo State Diagram + Use Case v2: đơn đăng ký (thêm hủy do chưa đóng cọc), đổi phòng, bảo trì; thêm cửa sổ đăng ký, proposal, phân bổ (`NO_SHOW`), loại hóa đơn, cọc bị giữ (`FORFEITED`). |
| Sơ đồ nguồn | Lưu Use Case Diagram v2 vào `docs/diagrams/usecase-diagram-v2.webp`; mọi tài liệu tham chiếu bản này. |
| Tài liệu | Viết lại `ARCHITECTURE`, `CONVENTIONS`, `PERMISSION_MATRIX`; thêm `BUSINESS_FLOWS`, `GAP_ANALYSIS`. |
| Quy tắc độ dài file | Đổi từ 200 dòng sang 600 (trang) / 400 (file khác) — ESLint đã cập nhật. |

### 1.1. Đợt 2 — sửa giao diện (17/10/2026)

| Nhóm | Đã xử lý |
|---|---|
| Chung | Sitemap 30 trang (`APP_ROUTES`, Sidebar), code-splitting theo vai trò (`lazyPage`), route guard cho Student (G13) và guard theo quyền từng trang Manager, `StatusBadge` đủ nhãn trạng thái mới (G3), `VietQrCode` + `formatVnd`/`maskPhone` dùng chung |
| Đăng nhập | Chỉ “Đăng nhập với Google” @fpt.edu.vn; bỏ form mật khẩu; khối chọn vai trò chỉ ở chế độ demo (`VITE_DEMO_MODE`) — **G1** |
| Student | Đăng ký theo F1: cửa sổ đăng ký, giữ chỗ 15 phút có đồng hồ, bạn cùng phòng bằng mã SV/tiêu chí, kiểm tra điều kiện, đóng cọc VietQR — **G2, G22, G23** · Check-in tự quét QR, thanh toán phần còn lại, biên bản hiện trạng; ngoài khung → Staff; check-out có biên bản — **G5** · Yêu cầu: bảo trì 9 trạng thái + xác nhận hoàn tất, hoán đổi phòng + phản hồi lời mời, lịch bảo trì — **G4, G7, G9** · “Phòng của tôi” gộp phân bổ + bạn cùng phòng + hợp đồng (ký OTP) — **G18, G19** · Hóa đơn: tiền cọc / phí phòng / điện nước (mở rộng) — **G8** · Dashboard bỏ điểm nội quy, quỹ phòng — **G17** |
| Staff | Đơn đăng ký: chỉ rà soát đơn bị gắn cờ, chuyển Manager · Xếp phòng: rà soát & điều chỉnh đề xuất có cảnh báo xung đột, tab vòng 2 — **G10, G25** · Đổi phòng: theo dõi & xác minh (Manager duyệt) — **G4** · Check-in: theo dõi tiến độ, sắp no-show, check-in thủ công/trễ, xác minh trả phòng — **G6** · Bảo trì & kiểm tra gộp một trang theo state diagram, đề xuất lịch định kỳ — **G7** |
| Manager | Trung tâm phê duyệt 3 tab (đơn đăng ký, đổi phòng, lịch bảo trì) · Duyệt xếp phòng = duyệt/trả về Staff — **G11, G24** · Xóa Hiệu suất Staff — **G14** |
| Admin | Engine: trọng số theo Phiếu (ngày nộp, nguyện vọng, bạn cùng phòng, ngành/năm), chỉ chạy thử, lịch sử chạy & xung đột; xóa trang Batch runs — **G15** · Tích hợp: FPT SIS, Google OAuth, Gmail API, VietQR, FCM, SMS — **G16** · Báo cáo: công suất/doanh thu/luân chuyển/dự báo thay Báo cáo tài chính — **G20** · Luật điều kiện chỉ còn điều kiện lưu trú (bỏ khung phạt) · Bảng giá bỏ dịch vụ phụ & giảm giá · Kỳ học có mốc giữ chỗ, vòng 1/2, khung check-in |

### 1.2. Đợt 3 — tinh chỉnh theo góp ý (Student trước)

| Nhóm | Thay đổi |
|---|---|
| Đăng nhập | Quay lại bố cục 2 tab: **Student** (Google / FEID) và **Staff / Admin** (tài khoản + mật khẩu). Bỏ hoàn toàn chế độ demo và bộ chọn vai trò; vai trò lấy từ tài khoản. Tài khoản mẫu `student/staff/manager/admin` — mật khẩu `123` |
| Header & Sidebar | Chuông thông báo cá nhân + menu tài khoản gọn (hồ sơ, đổi mật khẩu, cài đặt, đăng xuất); Sidebar thu gọn/mở rộng, “Thông báo chung” ở cuối cho mọi vai trò |
| Thông báo | Trang “Thông báo chung” dùng chung `/notifications` (thông báo hệ thống), bỏ nút “Trạng thái rỗng”; thông báo cá nhân chuyển vào chuông |
| Đăng ký | Thứ tự: kiểm tra điều kiện (bắt buộc sinh viên FPTU) → thời gian lưu trú (đến kỳ 9) → 3 loại phòng 2/4/6 người có hình minh họa & mã tiện nghi → bạn cùng phòng (chỉ phòng 2 người) → xác nhận chi phí (cọc % + cọc điện nước, có tổng) → VietQR |
| Student | Bỏ trang Tra cứu phòng; Tổng quan rút gọn; Hóa đơn bỏ thẻ thống kê, thông tin chuyển khoản, điện nước — chỉ VietQR; Phòng của tôi thiết kế lại (tài sản có mã ID, báo hỏng theo mã) |
| Admin | “Loại phòng & giá”: 3 loại phòng, giá theo kỳ, cấu hình % cọc và cọc điện nước |
| Giao diện | Tông trung tính, cam là màu nhấn duy nhất (đã thay ở Đợt 4) |

### 1.3. Đợt 4 — bố cục kiểu FAP, đơn từ, màu sắc

| Nhóm | Thay đổi |
|---|---|
| Bố cục chung | Sidebar toàn chiều cao, nhóm chức năng có tiêu đề in hoa màu cam, mục có ô icon; Header có nút thu gọn, tiêu đề + breadcrumb, cơ sở |
| Thông báo quan trọng | Popup sau đăng nhập cho mọi vai trò (thông báo ghim), “Không hiển thị lại trong phiên đăng nhập này”; dữ liệu chung `systemAnnouncements.ts` cho popup, trang Thông báo chung và Tổng quan |
| Đơn từ (Student) | Thay trang “Yêu cầu” bằng **Gửi đơn** (6 loại: báo hỏng, đổi phòng, hoàn tiền, gia hạn thanh toán, xác nhận cư trú, khác) và **Đơn của tôi** (lọc, chi tiết, tiến trình, lời mời hoán đổi, lịch bảo trì) — BUSINESS_FLOWS F3.5 |
| Tổng quan Student | Thẻ “Xin chào” gradient cam + ô thông tin, tin mới nhất có lọc danh mục, menu nhanh, việc cần làm |
| Màu sắc | Chuyển từ đơn sắc sang cam – trắng có sắc nhấn nhẹ (CONVENTIONS §8.3); StatCard, SectionCard, PageHeader có vạch / ô màu |

**Còn lại:** thiết kế lại Tổng quan Staff / Manager / Admin theo bố cục mới; gộp nhánh `openapi.yaml` theo trạng thái/quyền mới (kế hoạch bước 1) · cập nhật 3 Activity Diagram (G26) · nối API thật thay dữ liệu mẫu.

---

## 2. ĐỘ LỆCH NGHIỆP VỤ ĐÃ GHI NHẬN (BAN ĐẦU)

| # | Mức | Hiện trạng trong code | Theo đề tài / main flow | Cách sửa |
|---|---|---|---|---|
| G1 | 🔴 | Đăng nhập bằng mật khẩu “123” / FPT SSO (Azure AD) | Context Diagram: xác thực qua **Google** | Trang Login: nút “Đăng nhập với Google” (@fpt.edu.vn); giữ chọn vai trò chỉ ở chế độ demo |
| G2 | 🔴 | Đăng ký: chọn đối tượng ưu tiên + **tải minh chứng**, chấm điểm ưu tiên tay; ghép nhóm bằng **mã PIN** | F1: chọn **thời gian lưu trú → loại phòng → bạn cùng phòng bằng mã SV (email xác nhận) hoặc tiêu chí vùng/học kỳ/ngành → xác nhận → đóng cọc VietQR** | Viết lại wizard 4 bước theo F1; điều kiện tự kiểm tra từ SIS; bỏ upload minh chứng và mã PIN |
| G3 | 🔴 | Trạng thái đơn `SUBMITTED/UNDER_REVIEW/APPROVED/REJECTED` trên các trang | State Diagram đơn đăng ký (Draft → Pending → Processing → Assigned / Waiting vòng 2 → Cancelled → Refunded) | Dùng `APPLICATION_STATUS` mới; thêm nhãn tiếng Việt vào `StatusBadge` |
| G4 | 🔴 | Staff **duyệt** đổi phòng (`/staff/room-transfers`) | F4 + Use Case: **Manager** duyệt; Staff chỉ rà soát; có lời mời & phản hồi của Student B | Staff: rà soát & chuyển. Manager: tab “Đổi phòng” trong Trung tâm phê duyệt. Student: tạo yêu cầu hoán đổi + phản hồi lời mời |
| G5 | 🔴 | Student check-in = **đặt lịch hẹn khung giờ** tại quầy | F3: **tự quét QR**, kiểm tra khung check-in, **thanh toán phần còn lại**, nhận thông tin truy cập, **biên bản hiện trạng số** | Viết lại trang Check-in của Student theo F3; Staff là dashboard giám sát + xử lý ngoại lệ, không phải quầy tiếp nhận tuần tự |
| G6 | 🔴 | Staff check-in theo lịch hẹn tuần tự; không có **no-show** | Use Case v2: Staff **Process Manual / Late Check-in**; System **Cancel No-show & Forfeit Deposit** | Trang Check-in Staff: danh sách cần check-in thủ công/trễ + danh sách sắp no-show; Student thấy cảnh báo hạn check-in |
| G7 | 🔴 | Ticket bảo trì 3 trạng thái (Chờ / Đang xử lý / Hoàn thành) | State Diagram: Sent → Pending → Processing → Approved → Scheduled → In Progress → Resolved → Closed (+ Cancelled) | Bảng Kanban theo nhóm trạng thái mới; Student xác nhận hoàn tất (Resolved → Closed) |
| G8 | 🔴 | Thanh toán: hóa đơn chủ yếu là điện nước, phí lưu trú thu một lần | F1 + F3 + F6: **cọc khi đăng ký**, **phần còn lại khi check-in**, hóa đơn phí KTX đầu kỳ; điện nước là **mở rộng** | Trang Hóa đơn ưu tiên DEPOSIT/ROOM_FEE; UTILITY để tab phụ “Điện nước (mở rộng)” |
| G9 | 🟠 | Không có **lịch bảo trì định kỳ** (Student xem, Manager duyệt) | Use Case: View Maintenance Schedule; Approve Periodic Maintenance Schedules | Tab “Lịch bảo trì” trong trang Yêu cầu (Student) và Trung tâm phê duyệt (Manager) |
| G10 | 🟠 | Xếp phòng chưa có **vòng 2** (ứng viên vòng 2 → đồng ý → xếp ngẫu nhiên / từ chối → hoàn cọc) | F2 | Thêm trạng thái “Chờ vòng 2” ở Student; Staff/Manager thấy danh sách vòng 2 |
| G11 | 🟠 | Engine chưa hiển thị **xung đột** (giường gán 2 lần, cặp bạn bị tách tòa) và **dự báo công suất** | Phiếu §3.2.c Intelligent Engine | Proposal hiển thị danh sách xung đột; Báo cáo có biểu đồ dự báo |
| G12 | 🟠 | Manager không xem được **báo cáo tài chính** | Use Case: Review Financial & Operation Reports | Đã cấp `report:financial`; trang Báo cáo Manager thêm tab Tài chính (đã có) |
| G13 | 🟠 | Route Student không có `<RequirePermission>` | PERMISSION_MATRIX §2 | Bọc nhóm `/student/*` bằng `application:create` |
| G14 | 🟡 | Trang **Hiệu suất Staff** (KPI, bảng vinh danh) | Không có trong Phiếu và Use Case | **Xóa** |
| G15 | 🟡 | Trang **Giám sát Batch runs** (sis-sync, backup, cron…) tách riêng | Use Case chỉ có Monitor Assignment Engine | **Gộp** lịch sử chạy engine vào trang Engine; bỏ phần job hạ tầng |
| G16 | 🟡 | Tích hợp **cửa từ Hikvision**, SSO Azure AD | Không có trong Phiếu / Context | **Xóa**; trang Tích hợp chỉ còn FPT SIS, VietQR, Google (+ FCM) |
| G17 | 🟡 | Điểm rèn luyện nội trú, quỹ phòng, lịch trực nhật, khảo sát hài lòng, khung phạt vi phạm | Không có nguồn gốc nghiệp vụ | **Xóa** khỏi Dashboard / Bạn cùng phòng / Luật |
| G18 | 🟡 | Trang Bạn cùng phòng riêng (ghép nhóm, gợi ý tương thích %) | Roommate thuộc bước đăng ký (F1); xem bạn cùng phòng thuộc View Room Assignment | **Gộp** vào “Đăng ký lưu trú” và “Phòng của tôi” |
| G19 | 🟡 | Trang Hợp đồng riêng | Hợp đồng sinh ra từ kết quả xếp phòng (F2) | **Gộp** vào “Phòng của tôi” (tab Hợp đồng) |
| G20 | 🟡 | Trang Admin “Báo cáo tài chính” với hoàn tiền/công nợ chi tiết | Admin: Generate Occupancy, Revenue & Turnover Reports | **Đổi** thành “Báo cáo” (công suất / doanh thu / luân chuyển / dự báo); công nợ quá hạn thuộc Staff (F6) |
| G22 | 🟠 | Không hiển thị **cửa sổ đăng ký** (chưa mở / đang mở / đã đóng) và email mời | System: Open / Close Registration Window, Send Registration Invitation Email | Trang Đăng ký khóa form khi cửa sổ chưa mở/đã đóng, hiển thị đếm ngược |
| G23 | 🟠 | Không có **giữ chỗ có thời hạn** | System: Release Expired Room Hold, Cancel Unpaid Registration | Bước đóng cọc hiển thị đồng hồ giữ chỗ; hết hạn → báo đơn đã hủy |
| G24 | 🟠 | Engine chưa có bước **chốt ghép bạn cùng phòng** | System: Finalize Roommate Matching | Trang Engine (Admin) và Duyệt xếp phòng hiển thị số cặp/nhóm đã chốt, cặp bị tách |
| G25 | 🟠 | Staff chỉ xếp phòng thủ công từ hàng đợi | Use Case v2: Staff **Review / Adjust Room Assignment Proposal** | Trang Xếp phòng Staff mở proposal của engine, sửa từng dòng có cảnh báo rồi gửi Manager |
| G26 | 🟡 | Activity Diagram *Check-in* có Manager duyệt check-in trễ; *Assignment* có “Staff manually allocate”; *Maintenance* đặt “Inspect Room” ở lane Manager | Use Case v2 đã đổi các bước này | **Cập nhật lại 3 Activity Diagram** cho khớp Use Case v2 trước khi nộp báo cáo (xem BUSINESS_FLOWS, mục “Điều chỉnh theo Use Case v2”) |
| G21 | 🟢 | Tồn kho phòng, cấu hình kỳ học, luật điều kiện, bảng giá, người dùng & vai trò, audit log, VietQR, thông báo diện rộng, 4 vai trò | Khớp đề tài | Giữ, tinh chỉnh dữ liệu mẫu theo luồng |

---

## 3. ÁNH XẠ TRANG: HIỆN TẠI → MỤC TIÊU (34 → 30)

| Vai trò | Giữ / tinh chỉnh | Viết lại theo flow | Gộp | Xóa |
|---|---|---|---|---|
| Student (10 → 9) | Tổng quan, Tra cứu phòng, Thông báo, Hồ sơ | Đăng ký lưu trú (G2), Hóa đơn (G8), Yêu cầu (G4, G9), Check-in (G5) | Bạn cùng phòng + Hợp đồng → **Phòng của tôi** | — |
| Staff (9 → 8) | Tổng quan, Phòng & giường, Thông báo | Đơn đăng ký (G3), Đổi phòng → rà soát (G4), Check-in/out → thủ công/trễ + no-show + xác minh trả phòng (G5, G6) | Xếp phòng thủ công → **Xếp phòng** (rà soát & điều chỉnh proposal, vòng 2 — G25); Bảo trì + Kiểm tra → **Bảo trì & kiểm tra** (G7) | — |
| Manager (5 → 4) | Tổng quan, Báo cáo | Duyệt xếp phòng (G10, G11, G24) | Duyệt ngoại lệ → **Trung tâm phê duyệt** 3 tab (đơn đăng ký, đổi phòng, lịch bảo trì định kỳ) | Hiệu suất Staff (G14) |
| Admin (10 → 9) | Tổng quan, Kỳ học, Luật điều kiện, Loại phòng & giá, Người dùng, Audit log | Tích hợp (G16), Báo cáo (G20) | Batch runs → **Engine xếp phòng** (G15) | — |

---

## 4. KẾ HOẠCH THỰC HIỆN ĐỀ XUẤT

| Thứ tự | Việc | Phụ thuộc | Ước lượng |
|---|---|---|---|
| 1 | Cập nhật `openapi.yaml` theo trạng thái & quyền mới (application, room-change, check-in, maintenance, proposal) | Tài liệu này | 1 ngày |
| 2 | Student: Đăng ký (G2, G22, G23), Check-in (G5), Yêu cầu (G4, G9), Phòng của tôi (G18, G19), Hóa đơn (G8) | 1 | 3 ngày |
| 3 | Staff: Xếp phòng — rà soát/điều chỉnh proposal + vòng 2 (G25), Bảo trì & kiểm tra, Check-in thủ công/trễ + no-show (G6), Đổi phòng rà soát | 1 | 2,5 ngày |
| 4 | Manager: Trung tâm phê duyệt 3 tab, Duyệt xếp phòng có xung đột & ghép bạn (G24); xóa Hiệu suất Staff | 1 | 1,5 ngày |
| 5 | Admin: gộp Engine + lịch sử chạy, Tích hợp tinh gọn, Báo cáo + dự báo | 1 | 1,5 ngày |
| 6 | Login Google (G1), route guard Student (G13), Sidebar & router theo sitemap mới, code-splitting theo vai trò | 2–5 | 1 ngày |
| 7 | Kiểm thử: 4 trạng thái UI cho từng trang, test phân quyền, E2E 7 luồng F0–F7 | 6 | 2 ngày |
| 8 | Cập nhật 3 Activity Diagram theo Use Case v2 (G26) | — | 0,5 ngày |
