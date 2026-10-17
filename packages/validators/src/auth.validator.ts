import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Vui lòng nhập email trường FPT (@fpt.edu.vn)')
    .email('Định dạng email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có tối thiểu 6 ký tự'),
  role: z
    .enum(['STUDENT', 'STAFF', 'MANAGER', 'ADMIN'])
    .optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
