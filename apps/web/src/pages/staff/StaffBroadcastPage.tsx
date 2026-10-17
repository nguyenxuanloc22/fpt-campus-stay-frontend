import { useState } from 'react';
import { Send } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StaffBroadcastPage() {
  const [target, setTarget] = useState('ALL');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Phát Thông Báo Ký Túc Xá</h1>
        <p className="text-xs text-slate-500 mt-1">Soạn thảo và gửi thông báo tới sinh viên qua ứng dụng và email</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert('Đã phát thông báo thành công!');
          setTitle('');
          setContent('');
        }}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4"
      >
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Phạm vi người nhận</label>
          <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg bg-white">
            <option value="ALL">Toàn bộ sinh viên ký túc xá Tân Uyên</option>
            <option value="DOM-A">Chỉ sinh viên Tòa A</option>
            <option value="DOM-B">Chỉ sinh viên Tòa B</option>
            <option value="DOM-C">Chỉ sinh viên Tòa C</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề thông báo</label>
          <input
            type="text"
            placeholder="VD: Lịch cúp nước bảo trì hệ thống..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung chi tiết</label>
          <textarea
            rows={4}
            placeholder="Nội dung gửi đến sinh viên..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 text-xs border rounded-lg"
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <AppButton type="submit" leftIcon={<Send className="w-4 h-4" />}>
            Phát thông báo ngay
          </AppButton>
        </div>
      </form>
    </div>
  );
}
