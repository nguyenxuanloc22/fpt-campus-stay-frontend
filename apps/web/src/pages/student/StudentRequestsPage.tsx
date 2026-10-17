import { useState } from 'react';
import { Plus } from 'lucide-react';
import { StatusBadge } from '@shared-ui/components/StatusBadge';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentRequestsPage() {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('AIR_CONDITIONER');
  const [description, setDescription] = useState('');

  const tickets = [
    {
      id: 'mt-01',
      title: 'Điều hòa phòng A204 không lạnh, kêu to',
      category: 'Máy lạnh',
      status: 'IN_PROGRESS',
      createdAt: '12/10/2026 09:15',
      note: 'Kỹ thuật viên Chú Ba đã tiếp nhận, hẹn sửa 14:00 chiều nay.',
    },
    {
      id: 'mt-02',
      title: 'Vòi sen phòng tắm bị rò rỉ nước',
      category: 'Cấp thoát nước',
      status: 'RESOLVED',
      createdAt: '05/10/2026 15:30',
      note: 'Đã thay thế ron cao su mới.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Yêu Cầu Báo Hỏng & Đổi Phòng</h1>
          <p className="text-xs text-slate-500 mt-1">Gửi ticket phản ánh sự cố cơ sở vật chất hoặc xin chuyển phòng</p>
        </div>
        <AppButton
          onClick={() => setShowForm(!showForm)}
          leftIcon={<Plus className="w-4 h-4" />}
          size="sm"
        >
          {showForm ? 'Đóng form' : 'Tạo yêu cầu mới'}
        </AppButton>
      </div>

      {showForm && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert('Đã gửi ticket báo hỏng thành công!');
            setShowForm(false);
          }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4"
        >
          <h3 className="text-sm font-bold text-slate-800">Thông tin phản ánh sự cố</h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề sự cố</label>
            <input
              type="text"
              placeholder="VD: Bóng đèn bàn học bị cháy..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Khu vực / Phòng</label>
              <input type="text" defaultValue="Phòng A204" disabled className="w-full px-3 py-2 text-xs bg-slate-100 border rounded-lg text-slate-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Loại thiết bị</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg bg-white">
                <option value="AIR_CONDITIONER">Điều hòa / Máy lạnh</option>
                <option value="ELECTRICITY">Điện / Bóng đèn / Ổ cắm</option>
                <option value="PLUMBING">Ống nước / Vòi sen / Bồn cầu</option>
                <option value="FURNITURE">Bàn ghế / Giường / Tủ</option>
                <option value="TRANSFER">Đơn xin đổi phòng</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Mô tả chi tiết</label>
            <textarea
              rows={3}
              placeholder="Mô tả hiện trạng sự cố..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <AppButton type="submit" size="sm">Gửi yêu cầu</AppButton>
          </div>
        </form>
      )}

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.map((t) => (
          <div key={t.id} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">{t.title}</span>
              <StatusBadge status={t.status} />
            </div>
            <div className="text-xs text-slate-500 flex gap-4">
              <span>Danh mục: {t.category}</span>
              <span>Thời gian: {t.createdAt}</span>
            </div>
            {t.note && (
              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                💬 <strong>Phản hồi từ KTX:</strong> {t.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
