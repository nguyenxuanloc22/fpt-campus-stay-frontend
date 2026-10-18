# QUY CHUẨN KỸ THUẬT & CODE CONVENTIONS
**CampusStay FPT – Hệ thống quản lý đăng ký KTX và sắp xếp phòng, FPT University Tân Uyên**
**Phiên bản:** 2.0 (17/10/2026) — thay thế bản 1.0

Tài liệu liên quan: [ARCHITECTURE.md](ARCHITECTURE.md) · [BUSINESS_FLOWS.md](BUSINESS_FLOWS.md) · [PERMISSION_MATRIX.md](PERMISSION_MATRIX.md) · [GAP_ANALYSIS.md](GAP_ANALYSIS.md)

---

## 0. NGUYÊN TẮC CHUNG

1. **Bám đề tài, không vẽ thêm.** Mọi trang, nút bấm và API phải truy được về một use case trong **Use Case Diagram v2** ([`diagrams/usecase-diagram-v2.webp`](diagrams/usecase-diagram-v2.webp)) hoặc Phiếu đăng ký đồ án (FA26SE260). Chức năng không có nguồn gốc → không làm. Use case của actor **System** không có trang riêng; kết quả của chúng hiển thị trong trang nghiệp vụ liên quan.
2. **Đủ dùng, dễ đọc.** Ưu tiên một file gắn kết theo nghiệp vụ hơn là nhiều file vụn. Chỉ tách khi việc tách làm code dễ hiểu hơn.
3. **Một nguồn sự thật.** Dữ liệu nghiệp vụ → `openapi.yaml`; phân quyền → `packages/permissions`; trạng thái → `packages/constants/statuses.ts`; màu sắc → design tokens.

---

## 1. QUY TẮC ĐỘ DÀI & TỔ CHỨC FILE

Bản 1.0 giới hạn cứng 200 dòng. Thực tế một trang nghiệp vụ (bảng + bộ lọc + modal chi tiết) dễ vượt 200 dòng, và việc chia thành hàng chục file nhỏ làm luồng đọc code bị đứt đoạn, khó quản lý. Bản 2.0 đổi sang **giới hạn theo trách nhiệm**, kèm ngưỡng dòng rộng hơn.

| Loại file | Mục tiêu | Giới hạn cứng (ESLint `max-lines`, bỏ dòng trống & comment) |
|---|---|---|
| `pages/**` (màn hình) | ≤ 400 dòng | **600 dòng** |
| Component, hook, util, package | ≤ 250 dòng | **400 dòng** |

**Khi nào phải tách (bất kể số dòng):**
- Một khối UI được dùng lại ở **≥ 2 trang** → đưa vào `shared-ui/` hoặc `features/<domain>/components/`.
- Logic gọi API / trạng thái phức tạp → tách sang hook `features/<domain>/hooks/useXxx.ts`.
- Dữ liệu mẫu (mock) dài > 80 dòng → tách sang `features/<domain>/mocks.ts` (sẽ bị xóa khi nối API thật).
- Hàm định dạng dùng chung (tiền, ngày) → `shared-ui/utils/format.ts`.

**Không tách khi:** sub-component chỉ dùng trong đúng một trang và không có state riêng — giữ lại trong cùng file, đặt bên dưới component chính.

**Mobile (Flutter):** `build()` không lồng quá 4 cấp widget; khối phức tạp tách thành `StatelessWidget` riêng; file ≤ 400 dòng.

---

## 2. BỐN TRẠNG THÁI GIAO DIỆN BẮT BUỘC

Mọi màn hình danh sách (List) hoặc biểu mẫu (Form) phải hiện thực đủ 4 trạng thái:

| Trạng thái | Web | Mobile |
|---|---|---|
| Loading | `<Skeleton />`, `<TableSkeleton />` đúng hình dạng nội dung | `LoadingView` / Shimmer |
| Empty | `<EmptyState title description actionText />` | `EmptyView` |
| Error | Thông báo tiếng Việt + nút **Thử lại** | `AsyncValue.when` → `ErrorView(onRetry)` |
| Success | Dữ liệu đầy đủ, phân trang hoặc cuộn mượt | như Web |

Ngoài ra: thao tác ghi (mutation) phải có trạng thái **đang xử lý** (`AppButton isLoading`) và phản hồi **thành công/thất bại** (toast). Thao tác không thể hoàn tác (duyệt batch, hủy đơn, khóa tài khoản) phải có **modal xác nhận**.

---

## 3. PHÂN TẦNG TRÁCH NHIỆM

- **Web:** `Page` → `Feature Component` → `Feature Hook` (TanStack Query `useQuery` / `useMutation`) → `@campusstay/api-client` (Axios).
- **Mobile:** `Screen` → `Widget + Riverpod Provider` → `Repository Interface` → `Repository Impl` → `DioClient`.
- UI **không** gọi HTTP trực tiếp. Feature A **không** import file nội bộ của Feature B — chỉ qua `index.ts`.
- Page chỉ ghép bố cục và điều phối; không chứa phép tính nghiệp vụ (tính phí, chấm điểm ưu tiên, kiểm tra điều kiện — những việc này thuộc Backend).

---

## 4. YÊU CẦU PHI CHỨC NĂNG — QUY TẮC THỰC THI Ở FRONTEND

Bốn nhóm yêu cầu phi chức năng trong Phiếu đăng ký (mục 3.2.d) được cụ thể hóa thành quy tắc code như sau. Chi tiết kiến trúc xem [ARCHITECTURE.md §6](ARCHITECTURE.md).

### 4.1. Bảo mật & quyền riêng tư (Nghị định 13/2023/NĐ-CP)
- Không lưu dữ liệu cá nhân (CCCD, SĐT, địa chỉ, tài khoản ngân hàng) vào `localStorage`/`sessionStorage`. Chỉ lưu token phiên.
- Che dữ liệu nhạy cảm khi hiển thị danh sách: CCCD `074 3xx xxx 912`, SĐT `0901 *** 567`. Chỉ hiện đầy đủ ở màn hình chi tiết khi có quyền.
- Không đưa dữ liệu cá nhân vào URL / query string; dùng ID.
- Ẩn/hiện UI theo quyền bằng `<Can>` / `usePermission()` — đây là **UX**, Backend vẫn bắt buộc kiểm tra quyền mọi request.
- Xuất file (Excel/PDF) chứa dữ liệu cá nhân phải ghi audit log (Backend) và chỉ dành cho vai trò được phép.
- Không `console.log` dữ liệu người dùng trong code commit.

### 4.2. Hiệu năng & mượt mà dữ liệu (quy mô 4.000 sinh viên)
- **Phân trang phía server** cho mọi danh sách có thể vượt 100 bản ghi (đơn đăng ký, giường, hóa đơn, audit log). Mặc định 20 dòng/trang.
- **Tìm kiếm** debounce 300 ms; lọc gửi lên server qua query params.
- **Cache** bằng TanStack Query: `staleTime` 30 s cho danh sách vận hành, 5 phút cho danh mục (tòa, loại phòng, bảng giá), `refetchOnWindowFocus` chỉ bật cho dashboard.
- **Optimistic update** cho thao tác nhanh (đánh dấu đã đọc, chuyển trạng thái ticket); rollback khi lỗi.
- **Code-splitting** theo vai trò: mỗi nhóm route (`student`, `staff`, `manager`, `admin`) là một chunk `React.lazy` riêng. Chunk khởi tạo ≤ 250 KB gzip.
- Danh sách > 200 dòng hiển thị cùng lúc phải dùng ảo hóa (virtualization).
- Ảnh phòng / minh chứng: nén phía client ≤ 1 MB, `loading="lazy"`.

### 4.3. Khả năng cấu hình
- **Không hard-code** kỳ học, giá phòng, loại phòng, luật điều kiện, trọng số engine trong UI. Mọi giá trị nghiệp vụ lấy từ API cấu hình.
- Văn bản hiển thị gom về một chỗ theo feature để sẵn sàng dùng lại cho campus khác.

### 4.4. Khả năng tích hợp
- Mọi giao tiếp ngoài (FPT SIS, VietQR, Google) đi qua Backend; Frontend **không** gọi trực tiếp đối tác thứ ba và **không** giữ API key.
- Trạng thái thanh toán cập nhật theo webhook từ Backend; Frontend chỉ polling `GET /invoices/{id}` mỗi 5 s trong khi modal VietQR đang mở (tối đa 15 phút).

---

## 5. HTTP CLIENT & XỬ LÝ LỖI

- Duy nhất **một** HTTP client mỗi nền tảng: Web — Axios trong `@campusstay/api-client` (đọc `VITE_API_BASE_URL`); Mobile — `DioClient` (đọc `API_BASE_URL`).
- Interceptor: gắn `Authorization: Bearer`; `401` → xóa phiên, về `/login`; `403` → trang `/403`; timeout 15 s; tự retry 1 lần cho `GET` khi lỗi mạng.
- Mọi lỗi chuẩn hóa thành `AppError` (Web) / `AppFailure` (Mobile) với thông điệp tiếng Việt thân thiện; không hiển thị stack trace hay mã lỗi kỹ thuật cho người dùng.

---

## 6. TYPE-SAFETY

- TypeScript `strict: true`, `noUncheckedIndexedAccess: true`. Cấm `any` (`@typescript-eslint/no-explicit-any: error`); dùng `unknown` + type guard.
- Kiểu dữ liệu API sinh từ / bám sát `openapi.yaml`. Trạng thái dùng hằng số trong `@campusstay/constants`, không viết chuỗi rời rạc.
- Dart: `strict-casts`, `strict-inference`, `strict-raw-types`; cấm `dynamic` không kiểm soát.

---

## 7. ĐẶT TÊN

| Đối tượng | Web (TypeScript / React) | Mobile (Dart / Flutter) |
|---|---|---|
| Thư mục | `kebab-case` (`shared-ui`, `room-change`) | `snake_case` |
| File | `PascalCase.tsx` cho component; `camelCase.ts` cho hook/util | `snake_case.dart` |
| Component / Class | `PascalCase` (`StudentDashboardPage`) | `PascalCase` |
| Hook / Provider | `useXxx` | `xxxProvider` |
| Biến / Hàm | `camelCase` | `camelCase` |
| Hằng số / Enum | `UPPER_SNAKE_CASE` (`ROLES`, `APPLICATION_STATUS`) | theo chuẩn Dart |
| Quyền | `resource:action` (`room_change:approve`) | như Web |

---

## 8. HỆ THỐNG THIẾT KẾ GIAO DIỆN (UI)

### 8.1. Design tokens FPT
- **FPT Orange** `#F26F21` (hành động chính) · hover `#D95A12` · nền nhạt `#FFF2EA`.
- **FPT Navy** `#1A365D` (tiêu đề, điều hướng, hành động phụ) · đậm `#0F2341` · nền nhạt `#EBF2FB`.
- Trạng thái: thành công `#10B981` · cảnh báo `#F59E0B` · nguy hiểm `#EF4444` · thông tin `#3B82F6`.

### 8.2. Bộ component dùng chung (`shared-ui`) — bắt buộc dùng, không tự dựng lại
`AppButton`, `StatusBadge`, `PageHeader`, `StatCard`, `SectionCard`, `Tabs`, `Modal`, `ProgressBar`, `Avatar`, `EmptyState`, `Skeleton`, `BarChart`/`DonutChart`/`Sparkline`, `useToast`.

### 8.3. Màu sắc: cam – trắng FPTU, điểm nhấn nhẹ (bắt buộc)
- **Chủ đạo cam – trắng:** nền trang `slate-100`, thẻ trắng bo `rounded-2xl`, chữ `slate-900` / `slate-500`. Cam FPT `#F26F21` cho hành động chính, mục đang chọn, tiêu đề nhóm Sidebar, vạch nhấn tiêu đề (PageHeader, SectionCard). Khối nổi bật (thẻ chào mừng, banner việc cần làm, popup thông báo quan trọng) dùng gradient cam `#F26F21 → #FF9A4D`.
- **Không đơn sắc:** mỗi loại thông tin có **một sắc nhẹ riêng** (nền `*-50/100`, chữ `*-600/700`) để dễ phân biệt — loại đơn (báo hỏng cam, đổi phòng xanh trời, hoàn tiền xanh lá, gia hạn vàng, xác nhận cư trú tím), danh mục thông báo, ô thông tin sinh viên, menu nhanh. `StatCard` có ô icon gradient theo `tone` và vạch màu trên đầu thẻ.
- **Giới hạn:** tối đa ~5 sắc nhấn trên một màn hình, luôn ở mức nhạt; không dùng nền đậm ngoài cam. Màu trạng thái vẫn theo `StatusBadge`.
- **Icon có chủ đích:** icon đặt trong ô màu bo góc (Sidebar, ô thông tin, loại đơn, menu nhanh); không rải icon trang trí trong đoạn văn.
- Chỉ hiển thị số liệu tổng quan khi người dùng cần ra quyết định từ nó; trang thao tác (hóa đơn, yêu cầu) không cần hàng thẻ thống kê.

### 8.4. Quy tắc bố cục để giao diện không rối
- Mỗi trang theo khung: **PageHeader** (tiêu đề + 1–2 hành động chính) → **tối đa 4 StatCard** (nếu thật sự cần) → nội dung chính → cột phụ (nếu có).
- Header: logo + breadcrumb bên trái; **chuông thông báo cá nhân** và **menu tài khoản** (hồ sơ, đổi mật khẩu, cài đặt, đăng xuất) bên phải.
- Sidebar thu gọn / mở rộng được (nút trên Header), ghi nhớ lựa chọn; chức năng chia nhóm với tiêu đề in hoa màu cam; nhóm “Thông tin” (Tổng quan, Thông báo chung) luôn đứng đầu cho mọi vai trò.
- Mỗi trang **tối đa 1 nút primary** (màu cam). Các hành động khác dùng `outline`/`ghost`.
- Gom chức năng liên quan vào **Tabs** trong cùng một trang thay vì tạo trang mới (ví dụ: “Bảo trì” và “Kiểm tra phòng”).
- Chi tiết bản ghi mở bằng **Modal**; chỉ tạo route riêng khi cần chia sẻ link.
- Màu trạng thái chỉ dùng qua `StatusBadge`; nhãn trạng thái là tiếng Việt và khớp State Diagram.
- Responsive: hoạt động tốt từ 360 px (mobile web) đến 1440 px; bảng rộng cuộn ngang trong khung, không cuộn cả trang.
- Khả năng truy cập: mọi nút chỉ có icon phải có `aria-label`; tương phản chữ ≥ 4.5:1; modal đóng được bằng `Esc`.
