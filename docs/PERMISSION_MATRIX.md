# MA TRẬN PHÂN QUYỀN (PERMISSION MATRIX)
**CampusStay FPT – Ký túc xá FPT University Tân Uyên**
**Phiên bản:** 2.0 (17/10/2026) · **Nguồn sự thật trong code:** `packages/permissions/src/matrix.ts` (test: `packages/permissions/src/__tests__/can.test.ts`)

> [!IMPORTANT]
> Phân quyền ở Frontend (ẩn/hiện nút, chặn route, dựng sidebar) **chỉ phục vụ trải nghiệm**. Bảo mật thật do **Backend** kiểm tra JWT + quyền trên **mọi** request.

**Nguồn:** Use Case Diagram v2 — [`diagrams/usecase-diagram-v2.webp`](diagrams/usecase-diagram-v2.webp). Mỗi quyền truy được về ít nhất một use case (cột cuối). Quy tắc phân định: **Staff thao tác – Manager phê duyệt – Admin cấu hình – System tự động**.

---

## 1. MA TRẬN

| Quyền (`resource:action`) | STU | STA | MGR | ADM | Use case tương ứng |
|---|:-:|:-:|:-:|:-:|---|
| **Đơn đăng ký** | | | | | |
| `application:create` | ✅ | | | | Submit Dormitory Application (+ Validate Eligibility, Pay Deposit, Select Room Types, Select Roommate) |
| `application:view_own` | ✅ | | | | Track Request Status |
| `application:cancel_own` | ✅ | | | | Hủy đơn khi đang chờ vòng 2 → hoàn cọc |
| `application:review` | | ✅ | | | Review Dormitory Applications |
| `application:approve_exception` | | | ✅ | | Approve / Reject Dormitory Applications (đơn Staff chuyển lên) |
| **Phòng & giường** | | | | | |
| `inventory:view_public` | ✅ | ✅ | ✅ | ✅ | Duyệt tòa, loại phòng, giường trống |
| `inventory:manage` | | ✅ | | | Update Room & Bed Status |
| `inventory:configure` | | | | ✅ | Thêm tòa/phòng/loại phòng (đi kèm Configure Room & Bed Pricing) |
| **Xếp phòng** | | | | | |
| `assignment:view_own` | ✅ | | | | View Room Assignment |
| `assignment:adjust_proposal` | | ✅ | | | Review / Adjust Room Assignment Proposal (gồm điều chỉnh thủ công) |
| `assignment:approve_batch` | | | ✅ | | Review / Approve Room Assignment Proposals |
| `assignment:configure_engine` | | | | ✅ | Configure Assignment Rules & Priorities |
| `assignment:monitor_engine` | | | | ✅ | Monitor Assignment Engine |
| **Hợp đồng** | | | | | |
| `contract:view_own` / `contract:sign_own` | ✅ | | | | Nhận hợp đồng số sau khi được xếp phòng |
| `contract:manage_all` | | ✅ | ✅ | | Tra cứu hợp đồng phục vụ vận hành |
| **Hóa đơn & thanh toán** | | | | | |
| `invoice:view_own` / `invoice:pay_vietqr` | ✅ | | | | View Payment, Pay Deposit, Pay Invoice |
| `invoice:manage` | | ✅ | | | Xử lý công nợ quá hạn sau Mark Overdue Invoices, nhập chỉ số điện nước (Flow 6 mở rộng) |
| `invoice:reconcile` | | | | ✅ | Đối soát giao dịch VietQR |
| **Đổi phòng** | | | | | |
| `room_change:create_own` | ✅ | | | | Submit Room Change Request, Initiate Mutual Room Swap |
| `room_change:respond_invitation` | ✅ | | | | Respond to Swap Invitation |
| `room_change:verify` | | ✅ | | | Theo dõi & rà soát đơn trước khi Manager quyết định (hỗ trợ vận hành, không phải use case riêng) |
| `room_change:approve` | | | ✅ | | Approve / Reject Room Change Requests |
| **Check-in / Check-out** | | | | | |
| `checkin:self` | ✅ | | | | Self Check-in, Self Check-out, Submit Digital Room-Condition Report |
| `checkin:process_manual` | | ✅ | | | Process Manual / Late Check-in |
| `checkout:verify` | | ✅ | | | Verify Room Condition at Check-out |
| **Bảo trì & kiểm tra** | | | | | |
| `maintenance:create_own` / `maintenance:view_own` | ✅ | | | | Submit Maintenance Request, Track Request Status |
| `maintenance:view_schedule` | ✅ | | | | View Maintenance Schedule |
| `maintenance:process` | | ✅ | | | Handle Maintenance Requests, Record Maintenance Follow-ups |
| `inspection:conduct` | | ✅ | | | Schedule Room Inspections, Inspect Room / Equipment |
| `maintenance:approve_schedule` | | | ✅ | | Approve Periodic Maintenance Schedules |
| **Thông báo** | | | | | |
| `notification:view_own` | ✅ | | | | View Notifications |
| `broadcast:send` | | ✅ | | | Communicate with residents (in-app, email, SMS) |
| **Báo cáo** | | | | | |
| `report:operational` | | | ✅ | ✅ | Monitor Occupancy & Operations; Generate Occupancy & Turnover Reports |
| `report:financial` | | | ✅ | ✅ | Review Financial Reports; Generate Revenue Reports |
| **Quản trị** | | | | | |
| `config:system` | | | | ✅ | Configure Academic Terms, Eligibility Rules, Room & Bed Pricing |
| `integration:manage` | | | | ✅ | Tích hợp FPT SIS, VietQR, Google |
| `user:manage` | | | | ✅ | Manage User Accounts & Roles |
| `audit:view` | | | | ✅ | Truy vết theo NĐ 13/2023 |

### 1.1. Actor System (không cấp quyền người dùng)
13 use case của actor System (Open/Close Registration Window, Send Registration Invitation Email, Release Expired Room Hold, Finalize Roommate Matching, Execute Room Assignment Algorithm, Cancel Unpaid Registration, Detect Assignment Conflicts, Forecast Occupancy Trends, Send Automated Reminders, Cancel No-show & Forfeit Deposit, Mark Overdue Invoices, Generate Invoice, Open Round 2 & Backfill Students) chạy bằng **tài khoản dịch vụ nội bộ** ở Backend:
- Không có trong `matrix.ts`, không có route Frontend.
- Mọi thay đổi dữ liệu do System thực hiện vẫn ghi **audit log** với actor = `SYSTEM`.
- Người dùng chỉ thấy **kết quả** (trạng thái, thông báo, cảnh báo) qua các quyền `*:view_own`, `report:*`, `assignment:monitor_engine`.

---

## 2. QUYỀN THEO TRANG (ROUTE GUARD)

| Nhóm route | Quyền kiểm tra tại `<RequirePermission>` |
|---|---|
| `/student/*` | `application:create` |
| `/staff/*` | `inventory:manage` |
| `/manager/*` | `report:operational` + từng trang kiểm tra quyền phê duyệt tương ứng |
| `/admin/*` | `config:system` |

Bên trong trang, từng nút hành động bọc bằng `<Can permission="…">` theo cột quyền ở bảng trên.

---

## 3. CÁCH DÙNG TRONG CODE

```typescript
import { can } from '@campusstay/permissions';
if (can(user.role, 'room_change:approve')) { /* hiển thị nút Duyệt */ }
```

```tsx
import { Can, usePermission } from '@features/auth';

const { can } = usePermission();
{can('assignment:approve_batch') && <AppButton>Phê duyệt batch</AppButton>}

<Can permission="checkin:process_manual" fallback={null}>
  <AppButton>Check-in thủ công</AppButton>
</Can>
```

```tsx
<Route
  path="/manager/assignment-approval"
  element={
    <RequirePermission permission="assignment:approve_batch">
      <ManagerAssignmentApprovalPage />
    </RequirePermission>
  }
/>
```

---

## 4. MOBILE (FLUTTER)
Ứng dụng di động chỉ dành cho **STUDENT**. `GoRouter.redirect` kiểm tra vai trò sau đăng nhập; vai trò khác bị đăng xuất và chuyển tới `WebOnlyRoleNoticeScreen`.

---

## 5. QUY TRÌNH THAY ĐỔI QUYỀN
1. Cập nhật use case / lý do nghiệp vụ trong [BUSINESS_FLOWS.md](BUSINESS_FLOWS.md).
2. Sửa `permissions.ts` + `matrix.ts` và test tương ứng.
3. Sửa bảng ở tài liệu này và `security` của endpoint trong `openapi.yaml`.
