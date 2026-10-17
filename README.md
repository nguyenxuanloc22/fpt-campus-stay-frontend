# CampusStay FPT – Dormitory Management & Room Allocation System
> **Đồ án Tốt nghiệp / Chuyên đề Kỹ thuật Phần mềm**  
> **Cơ sở triển khai:** Trường Đại học FPT – Phân hiệu Bình Dương (Campus Tân Uyên)  
> **Kiến trúc:** Frontend Monorepo (Web: React 19 + TypeScript Strict | Mobile: Flutter 3.41 + Dart Null-Safety)

---

## 1. Tổng quan Kiến trúc Hệ thống

Hệ thống **CampusStay FPT** được thiết kế nhằm giải quyết bài toán đăng ký, xét duyệt điều kiện, xếp bạn cùng phòng và bàn giao cơ sở vật chất Ký túc xá cho sinh viên FPT University Campus Tân Uyên.

```
fpt-campus-stay-frontend/
├── apps/
│   ├── web/                    # React 19 + TypeScript Strict + Vite + Tailwind CSS + TanStack Query + Zustand
│   └── mobile/                 # Flutter 3.41 (Dart 3.11) + Riverpod + go_router + Dio (Dành cho Sinh viên)
├── packages/                   # Thư viện dùng chung phía Web (TypeScript strict)
│   ├── constants/              # Enums (ROLES, STATUSES, ROUTES, QUERY_KEYS)
│   ├── permissions/            # Ma trận phân quyền RBAC, hàm can(), canAny(), canAll()
│   ├── types/                  # TypeScript Models & API Interfaces
│   ├── validators/             # Zod schemas với thông báo lỗi tiếng Việt
│   └── api-client/             # Axios client với JWT Bearer & Error Interceptors
├── docs/                       # Tài liệu Kiến trúc & Hợp đồng API
│   ├── api-contract/
│   │   └── openapi.yaml        # Single Source of Truth: OpenAPI 3.0.3 Spec
│   ├── ARCHITECTURE.md         # Rationale kiến trúc, bảo mật, và sơ đồ luồng
│   ├── PERMISSION_MATRIX.md    # Ma trận phân quyền RBAC chi tiết từng API/Route
│   └── CONVENTIONS.md          # Quy chuẩn code: File <= 150 dòng, 4 UI states
└── mock-server/
    └── run-mock.js             # Mock Server chạy Stoplight Prism (Cổng 4010)
```

---

## 2. Ma trận Phân quyền & Vai trò người dùng (RBAC)

| Vai trò | Nền tảng | Trách nhiệm chính trong hệ thống |
| :--- | :--- | :--- |
| **`STUDENT`** | **Web & Mobile** | Đăng ký KTX theo kỳ, tra cứu phòng, ghép nhóm bạn cùng phòng qua mã PIN, ký hợp đồng điện tử, quét mã VietQR nộp tiền, gửi báo hỏng thiết bị, đặt lịch Check-in/Check-out. |
| **`STAFF`** | **Chỉ Web** | Cán bộ quản lý: Duyệt đơn đăng ký, xếp phòng thủ công, xử lý chuyển phòng, kiểm tra biên bản nhận/trả phòng, phân công thợ sửa chữa, phát thông báo KTX. |
| **`MANAGER`** | **Chỉ Web** | Trưởng ban KTX: Xem Dashboard KPI/SLA, phê duyệt các đơn ngoại lệ (miễn giảm học phí, quá hạn), kích hoạt và duyệt thuật toán xếp phòng tự động hàng loạt. *(Tách riêng để giảm tải cho Cán bộ vận hành)*. |
| **`ADMIN`** | **Chỉ Web** | Quản trị viên: Quản lý học kỳ, biểu phí, trọng số thuật toán ghép phòng, tích hợp FPT SIS & VietQR NapAS 247, phân quyền tài khoản, audit logs. |

> **Lưu ý kiểm thử phân quyền:**  
> Hệ thống tích hợp sẵn **Role Simulator** trực quan trên thanh Header (Web) và màn hình Đăng nhập (Mobile) để Hội đồng Chấm có thể chuyển đổi nhanh giữa 4 vai trò mà không cần re-login.

---

## 3. Hướng dẫn Cài đặt & Khởi chạy nhanh

### Yêu cầu môi trường
- **Node.js**: >= 20.x (Khuyên dùng v22.x)
- **Package Manager**: `npm` hoặc `pnpm`
- **Flutter SDK**: >= 3.27.x (Phiên bản dự án: Flutter 3.41.9, Dart 3.11.5)

### Bước 1: Khởi chạy Mock API Server (Stoplight Prism)
API Mock tuân thủ chính xác hợp đồng `docs/api-contract/openapi.yaml`:
```bash
npm run mock
```
Mock Server sẽ chạy tại: `http://localhost:4010/api/v1` (Hỗ trợ CORS đầy đủ).

### Bước 2: Khởi chạy Ứng dụng Web (React + Vite)
```bash
# Cài đặt dependencies (đã cấu hình npm workspaces)
npm install

# Khởi chạy Web Dev Server (Mặc định: http://localhost:3000)
npm run dev

# Chạy Unit Tests kiểm tra phân quyền và hooks
npm run test

# Kiểm tra bản build production
npm run build
```

### Bước 3: Khởi chạy Ứng dụng Mobile (Flutter)
```bash
# Kiểm tra phân tích tĩnh (Strict Analysis - 0 errors/warnings)
npm run flutter:analyze

# Chạy Unit/Widget Tests
npm run flutter:test

# Khởi chạy trên Thiết bị / Giả lập (Android/iOS)
npm run flutter:run
```
*(Trên Android Emulator, ứng dụng tự động trỏ API về `http://10.0.2.2:4010/api/v1`)*.

---

## 4. Tiêu chuẩn Kỹ thuật & Cam kết Chất lượng Code

1. **Tuân thủ Độ dài File (≤ 150 dòng)**:
   - 100% các file code trong dự án Mobile (`apps/mobile/lib`) đều tuân thủ độ dài dưới 150 dòng.
   - Các logic phức tạp được chia nhỏ thành các Sub-widget độc lập (`widgets/*`) và Providers riêng biệt.
2. **Quy chuẩn 4 Trạng thái Giao diện (UI States)**:
   - Mọi màn hình danh sách và biểu mẫu đều hỗ trợ đủ 4 trạng thái: `loading` (Skeleton/Spinner), `empty` (EmptyState minh họa), `error` (ErrorView kèm nút Thử lại), và `success` (Dữ liệu hiển thị).
3. **TypeScript Strict & Dart Null-Safety**:
   - Phía Web bật `strict: true`, không sử dụng `any`.
   - Phía Mobile bật bộ linter gắt gao (`strict-casts`, `strict-inference`, `strict-raw-types`), 0 warning linter.
4. **Bộ nhận diện Thương hiệu FPT Tân Uyên**:
   - Sử dụng chuẩn mã màu: **FPT Orange** (`#F26F21`) và **FPT Navy Blue** (`#1A365D`).
