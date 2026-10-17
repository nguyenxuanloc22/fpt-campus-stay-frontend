# QUY CHUẨN KỸ THUẬT & CODE CONVENTIONS
**CampusStay FPT – FPT University Tân Uyên**

---

## 1. QUY TẮC ĐỘ DÀI FILE (FILE LENGTH LIMIT)
- **Mục tiêu:** Mỗi file ≤ 150 dòng.
- **Giới hạn cứng (Hard Limit):** **200 dòng**.
- **Biện pháp xử lý:**
  - Nếu Component/Widget vượt quá 150 dòng: Bắt buộc tách thành các sub-components/sub-widgets nhỏ có tên tường minh.
  - Tách logic state sang Custom Hook (React) hoặc StateNotifier/Notifier (Riverpod).
  - Tách các hàm helper/formatter sang file util riêng.
  - **Flutter:** Không viết hàm `build()` dài hoặc lồng Widget quá 4 cấp. Mọi khối giao diện phức tạp phải được tách thành `StatelessWidget` độc lập.

---

## 2. QUY TẮC 4 TRẠNG THÁI GIAO DIỆN BẮT BUỘC (UI STATES)
Mọi màn hình danh sách dữ liệu (List) hoặc biểu mẫu (Form) đều bắt buộc phải hiện thực đủ 4 trạng thái:
1. **Loading State:**
   - Web: Sử dụng `<Skeleton />` hoặc `<TableSkeleton />` mô phỏng cấu trúc nội dung sắp tải.
   - Mobile: Sử dụng `LoadingView` hoặc hiệu ứng Shimmer.
2. **Empty State:**
   - Web: Sử dụng `<EmptyState title="..." description="..." actionText="..." />`.
   - Mobile: Sử dụng `EmptyView(title: ..., onAction: ...)`.
3. **Error State:**
   - Web: Sử dụng thông báo lỗi kèm nút "Thử lại" (Retry).
   - Mobile: Bắt lỗi qua `AsyncValue.when` hiển thị `ErrorView(onRetry: ...)`.
4. **Success State:**
   - Hiển thị dữ liệu hoàn chỉnh, có phân trang hoặc cuộn mượt mà.

---

## 3. PHÂN TÁCH TẦNG TRÁCH NHIỆM (STRICT LAYERING)
- **UI không được gọi HTTP Client trực tiếp:**
  - Web: `Page` → `Feature Component` → `Feature Hook` (`useQuery`/`useMutation`) → `api-client` (Axios).
  - Mobile: `Screen` → `Presentation Widget & Riverpod Provider` → `Domain Repository Interface` → `Data Repository Impl` → `DioClient`.
- **Cấm import chéo giữa các Feature (No Cross-Feature Imports):**
  - Web: Một feature chỉ được export API công khai qua file `index.ts`. Feature A không được truy cập file nội bộ của Feature B.
  - Mobile: Các feature chỉ giao tiếp với nhau qua Tầng Domain hoặc Shared Widgets.

---

## 4. QUẢN LÝ HTTP CLIENT & XỬ LÝ LỖI
- **Duy nhất MỘT HTTP Client mỗi nền tảng:**
  - Web: Axios instance trong `@campusstay/api-client` đọc `VITE_API_BASE_URL`.
  - Mobile: `DioClient` trong `lib/core/network/dio_client.dart` đọc `API_BASE_URL`.
- **Interceptors:**
  - Tự động đính kèm JWT Bearer Token.
  - Bắt lỗi 401: Xóa phiên làm việc và điều hướng về trang đăng nhập.
  - Bắt lỗi 403: Báo lỗi quyền truy cập.
  - Chuẩn hóa lỗi: Mọi response lỗi đều được chuyển thành `AppError` (Web) hoặc `AppFailure` (Mobile) với thông điệp tiếng Việt thân thiện.

---

## 5. BẢO ĐẢM TYPE-SAFETY (KHÔNG ANY / DYNAMIC)
- **Web (TypeScript):**
  - Chế độ `strict: true`.
  - Cấm sử dụng `any`. Toàn bộ dữ liệu phải có kiểu tường minh hoặc dùng `unknown` kèm Type Guard.
  - Linter: `@typescript-eslint/no-explicit-any: error`.
- **Mobile (Dart):**
  - Phân tích nghiêm ngặt trong `analysis_options.yaml`:
    - `strict-casts: true`
    - `strict-inference: true`
    - `strict-raw-types: true`
  - Cấm khai báo `dynamic` không kiểm soát.

---

## 6. QUY TẮC ĐẶT TÊN & ĐỊNH DẠNG MÃ (NAMING CONVENTIONS)

| Đối tượng | Web (TypeScript / React) | Mobile (Dart / Flutter) |
|---|---|---|
| **Thư mục (Directories)** | `kebab-case` (`shared-ui`, `student-registration`) | `snake_case` (`features`, `shared_widgets`) |
| **Tên tệp (Files)** | `kebab-case.ts/tsx` (`app-button.tsx`) hoặc `PascalCase.tsx` cho Component chính | `snake_case.dart` (`app_button.dart`, `dio_client.dart`) |
| **Component / Class** | `PascalCase` (`StudentDashboardPage`, `StatusBadge`) | `PascalCase` (`StudentHomeScreen`, `AppButton`) |
| **Hooks / Providers** | `useXxx` (`usePermission`, `useAuthStore`) | `xxxProvider` (`authProvider`, `roomsProvider`) |
| **Biến / Hàm** | `camelCase` (`handleSubmit`, `formatCurrency`) | `camelCase` (`handleSubmit`, `formatCurrency`) |
| **Hằng số / Enums** | `UPPER_SNAKE_CASE` (`ROLES`, `APP_ROUTES`) | `camelCase` hoặc `PascalCase` theo chuẩn Dart |

---

## 7. BỘ DESIGN TOKENS FPT (MÀU SẮC THƯƠNG HIỆU)
- **FPT Orange:** `#F26F21` (Chủ đạo: Nút bấm chính, điểm nhấn, biểu tượng).
- **FPT Orange Hover:** `#D95A12`.
- **FPT Orange Light (Background thẻ):** `#FFF2EA`.
- **FPT Navy Deep:** `#1A365D` (Chủ đạo: Tiêu đề, thanh điều hướng, nút phụ).
- **FPT Navy Dark:** `#0F2341`.
- **FPT Navy Light:** `#EBF2FB`.
- **Trạng thái:**
  - Thành công (Approved / Paid / Available): `#10B981` (Emerald).
  - Cảnh báo (Pending / Unpaid / Reviewing): `#F59E0B` (Amber).
  - Nguy hiểm / Từ chối (Rejected / Overdue / Faulty): `#EF4444` (Rose).
  - Thông tin: `#3B82F6` (Blue).
