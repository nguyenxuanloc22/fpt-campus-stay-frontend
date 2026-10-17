# MA TRẬN PHÂN QUYỀN (PERMISSION MATRIX)
**CampusStay FPT – Ký Túc Xá FPT University Tân Uyên**  
**Nguồn sự thật mã nguồn:** `packages/permissions/src/matrix.ts`

---

> [!IMPORTANT]
> **NGUYÊN TẮC BẢO MẬT CỐT LÕI:**  
> Toàn bộ logic phân quyền ở tầng Frontend (ẩn/hiện nút bấm, bảo vệ route, render sidebar) **chỉ phục vụ trải nghiệm người dùng (UX) và điều hướng mượt mà**.  
> Bảo mật thực tế bắt buộc phải do **Backend kiểm tra và xác thực JWT cùng Permission trên mọi request API**.

---

## 1. BẢNG MA TRẬN PHÂN QUYỀN CHI TIẾT

| Quyền hạn (Resource:Action) | STUDENT | STAFF | MANAGER | ADMIN | Mô tả hành động nghiệp vụ |
|---|:---:|:---:|:---:|:---:|---|
| **Đơn đăng ký (Application)** | | | | | |
| `application:create` | ✅ | ❌ | ❌ | ❌ | Nộp đơn đăng ký phòng KTX mới |
| `application:view_own` | ✅ | ❌ | ❌ | ❌ | Xem đơn đăng ký của chính mình |
| `application:cancel_own` | ✅ | ❌ | ❌ | ❌ | Hủy đơn đăng ký khi chưa được duyệt |
| `application:review` | ❌ | ✅ | ❌ | ❌ | Thẩm định, duyệt hoặc từ chối đơn theo barem |
| `application:approve_exception`| ❌ | ❌ | ✅ | ❌ | Phê duyệt đặc cách các hồ sơ ngoại lệ |
| **Tồn kho & Phòng ở (Inventory)** | | | | | |
| `inventory:view_public` | ✅ | ✅ | ✅ | ✅ | Xem danh mục tòa, tầng, phòng, tiện ích |
| `inventory:manage` | ❌ | ✅ | ❌ | ❌ | Cập nhật tình trạng giường (trống, ở, hỏng) |
| `inventory:configure` | ❌ | ❌ | ❌ | ✅ | Cấu hình tòa nhà mới, thêm loại phòng |
| **Xếp phòng (Assignment)** | | | | | |
| `assignment:view_own` | ✅ | ❌ | ❌ | ❌ | Xem kết quả phân phòng cá nhân |
| `assignment:manual` | ❌ | ✅ | ❌ | ❌ | Xếp phòng, chuyển giường thủ công từng ca |
| `assignment:run_batch` | ❌ | ❌ | ❌ | ✅ | Kích hoạt engine xếp phòng tự động hàng loạt |
| `assignment:approve_batch` | ❌ | ❌ | ✅ | ❌ | Ký duyệt nghiệm thu kết quả xếp phòng tự động |
| **Hợp đồng lưu trú (Contract)** | | | | | |
| `contract:view_own` | ✅ | ❌ | ❌ | ❌ | Xem hợp đồng lưu trú cá nhân |
| `contract:sign_own` | ✅ | ❌ | ❌ | ❌ | Ký tên điện tử (e-sign) vào hợp đồng |
| `contract:manage_all` | ❌ | ✅ | ✅ | ❌ | Tra cứu toàn bộ hợp đồng sinh viên trong KTX |
| **Hóa đơn & Thanh toán (Invoice)**| | | | | |
| `invoice:view_own` | ✅ | ❌ | ❌ | ❌ | Xem danh sách hóa đơn tiền phòng & tiền cọc |
| `invoice:pay_vietqr` | ✅ | ❌ | ❌ | ❌ | Sinh mã VietQR động để chuyển khoản ngân hàng |
| `invoice:manage` | ❌ | ✅ | ❌ | ❌ | Lập phiếu thu bổ sung, kiểm tra trạng thái |
| `invoice:reconcile` | ❌ | ❌ | ❌ | ✅ | Đối soát dòng tiền thanh toán với sao kê ngân hàng |
| **Bảo trì & Báo hỏng (Maintenance)** | | | | | |
| `maintenance:create_own` | ✅ | ❌ | ❌ | ❌ | Gửi ticket báo hỏng cơ sở vật chất kèm ảnh |
| `maintenance:view_own` | ✅ | ❌ | ❌ | ❌ | Xem tiến độ và phản hồi từ thợ kỹ thuật |
| `maintenance:process` | ❌ | ✅ | ❌ | ❌ | Phân công thợ, cập nhật chi phí và đóng ticket |
| **Kiểm tra & Vận hành (Operations)**| | | | | |
| `inspection:conduct` | ❌ | ✅ | ❌ | ❌ | Thực hiện thanh tra phòng, lập biên bản vi phạm |
| `broadcast:send` | ❌ | ✅ | ❌ | ❌ | Soạn và gửi thông báo diện rộng tới KTX |
| `report:operational` | ❌ | ❌ | ✅ | ✅ | Xem báo cáo tỷ lệ lấp đầy, SLA, luân chuyển |
| `report:financial` | ❌ | ❌ | ❌ | ✅ | Xem báo cáo doanh thu lũy kế và công nợ |
| **Cấu hình & Quản trị (Admin)** | | | | | |
| `config:system` | ❌ | ❌ | ❌ | ✅ | Cấu hình kỳ học, bảng giá, trọng số engine |
| `integration:manage` | ❌ | ❌ | ❌ | ✅ | Quản lý kết nối API FPT SIS & Cổng VietQR |
| `user:manage` | ❌ | ❌ | ❌ | ✅ | Quản lý danh sách tài khoản và phân quyền |
| `audit:view` | ❌ | ❌ | ❌ | ✅ | Tra cứu nhật ký hệ thống (Audit Trail) |

---

## 2. HƯỚNG DẪN SỬ DỤNG PHÂN QUYỀN TRÊN CODE WEB

### 2.1. Kiểm tra quyền trực tiếp bằng hàm `can()`
```typescript
import { can } from '@campusstay/permissions';
import { ROLES } from '@campusstay/constants';

if (can(user.role, 'application:review')) {
  // Thực hiện thẩm định hồ sơ
}
```

### 2.2. Kiểm tra bằng Hook `usePermission()`
```tsx
import { usePermission } from '@features/auth';

export function ApplicationActionBar() {
  const { can } = usePermission();

  return (
    <div>
      {can('application:review') && <button>Duyệt đơn</button>}
      {can('application:approve_exception') && <button>Duyệt ngoại lệ</button>}
    </div>
  );
}
```

### 2.3. Ẩn/Hiện UI bằng Component `<Can>`
```tsx
import { Can } from '@features/auth';

<Can permission="inventory:manage" fallback={<p>Chỉ xem thông tin</p>}>
  <Button onClick={handleEditBed}>Chỉnh sửa trạng thái giường</Button>
</Can>
```

### 2.4. Bảo vệ Route bằng `<RequirePermission>`
```tsx
<Route
  path="/manager/batch-approval"
  element={
    <RequirePermission permission="assignment:approve_batch">
      <ManagerBatchApprovalPage />
    </RequirePermission>
  }
/>
```

---

## 3. CƠ CHẾ PHÂN QUYỀN TRÊN MOBILE (FLUTTER)
- Phân hệ Mobile được thiết kế chuyên biệt và duy nhất cho vai trò **STUDENT**.
- Tầng điều hướng `GoRouter` kiểm tra trạng thái xác thực: Nếu tài khoản đăng nhập có vai trò là `STAFF`, `MANAGER` hoặc `ADMIN`, ứng dụng sẽ tự động đăng xuất và điều hướng người dùng tới màn hình `WebOnlyRoleNoticeScreen` để hướng dẫn sử dụng phiên bản Web.
