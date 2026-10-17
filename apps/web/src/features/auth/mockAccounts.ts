import type { User } from '@campusstay/types';

/**
 * Tài khoản mẫu cho môi trường phát triển (chưa nối Backend).
 * Đăng nhập: student / staff / manager / admin — mật khẩu chung "123".
 * Khi nối API thật, file này bị thay bằng POST /auth/login.
 */
export const MOCK_PASSWORD = '123';

export const MOCK_ACCOUNTS: Record<string, User & { department: string }> = {
  student: {
    id: 'usr-student-001',
    studentId: 'SE171234',
    name: 'Nguyễn Thị Mai Anh',
    email: 'anhntmse171234@fpt.edu.vn',
    role: 'STUDENT',
    gender: 'FEMALE',
    major: 'Kỹ thuật phần mềm (SE)',
    phoneNumber: '0901234567',
    department: 'K17 · Kỳ 5',
  },
  staff: {
    id: 'usr-staff-001',
    name: 'Trần Văn Cường',
    email: 'cuongtv@fpt.edu.vn',
    role: 'STAFF',
    gender: 'MALE',
    department: 'Ban Quản lý KTX',
  },
  manager: {
    id: 'usr-manager-001',
    name: 'ThS. Hoàng Nam',
    email: 'namh@fpt.edu.vn',
    role: 'MANAGER',
    gender: 'MALE',
    department: 'Trưởng ban KTX',
  },
  admin: {
    id: 'usr-admin-001',
    name: 'Quản trị viên Hệ thống',
    email: 'admin@fpt.edu.vn',
    role: 'ADMIN',
    gender: 'MALE',
    department: 'Phòng CNTT',
  },
};
