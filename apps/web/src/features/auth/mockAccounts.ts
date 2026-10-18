import type { User } from '@campusstay/types';
import { t } from '@shared-ui';

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
    major: t('Software Engineering (SE)'),
    phoneNumber: '0901234567',
    department: t('K17 · Term 5'),
  },
  staff: {
    id: 'usr-staff-001',
    name: 'Trần Văn Cường',
    email: 'cuongtv@fpt.edu.vn',
    role: 'STAFF',
    gender: 'MALE',
    department: t('Dormitory Management Board'),
  },
  manager: {
    id: 'usr-manager-001',
    name: 'ThS. Hoàng Nam',
    email: 'namh@fpt.edu.vn',
    role: 'MANAGER',
    gender: 'MALE',
    department: t('Dormitory Manager'),
  },
  admin: {
    id: 'usr-admin-001',
    name: t('System Administrator'),
    email: 'admin@fpt.edu.vn',
    role: 'ADMIN',
    gender: 'MALE',
    department: t('IT Department'),
  },
};
