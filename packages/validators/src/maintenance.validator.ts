import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  title: z
    .string()
    .min(5, 'Tiêu đề báo hỏng phải có ít nhất 5 ký tự')
    .max(100, 'Tiêu đề không quá 100 ký tự'),
  roomNumber: z.string().min(1, 'Vui lòng nhập số phòng gặp sự cố'),
  category: z.enum(['AIR_CONDITIONER', 'ELECTRICITY', 'PLUMBING', 'FURNITURE', 'OTHER'], {
    errorMap: () => ({ message: 'Vui lòng chọn danh mục hỏng hóc' }),
  }),
  description: z
    .string()
    .min(10, 'Vui lòng mô tả chi tiết sự cố ít nhất 10 ký tự'),
  photoUrl: z.string().optional(),
});

export type CreateMaintenanceFormData = z.infer<typeof createMaintenanceSchema>;
