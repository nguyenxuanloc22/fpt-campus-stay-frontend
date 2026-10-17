import { z } from 'zod';

export const submitApplicationSchema = z.object({
  semesterId: z.string().min(1, 'Vui lòng chọn kỳ học đăng ký'),
  roomTypePreferred: z.string().min(1, 'Vui lòng chọn loại phòng mong muốn'),
  buildingPreferred: z.string().optional(),
  roommateGroupId: z.string().optional(),
  agreeToRegulations: z
    .boolean()
    .refine((val) => val === true, 'Bạn phải đọc và đồng ý với nội quy KTX'),
});

export type SubmitApplicationFormData = z.infer<typeof submitApplicationSchema>;

export const reviewApplicationSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT', 'REQUEST_EXCEPTION']),
  note: z.string().min(1, 'Vui lòng nhập ghi chú phê duyệt hoặc lý do từ chối'),
});

export type ReviewApplicationFormData = z.infer<typeof reviewApplicationSchema>;
