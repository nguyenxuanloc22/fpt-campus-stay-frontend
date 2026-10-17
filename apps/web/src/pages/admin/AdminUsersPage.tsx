import { Plus } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminUsersPage() {
  const users = [
    { name: 'Nguyễn Xuân Lộc', email: 'locnx.se@fpt.edu.vn', role: 'STUDENT', status: 'Hoạt động' },
    { name: 'Trần Văn Cường', email: 'cuongtv.staff@fpt.edu.vn', role: 'STAFF', status: 'Hoạt động' },
    { name: 'ThS. Hoàng Nam', email: 'namh.mgr@fpt.edu.vn', role: 'MANAGER', status: 'Hoạt động' },
    { name: 'Quản Trị Viên', email: 'admin@fpt.edu.vn', role: 'ADMIN', status: 'Hoạt động' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Quản Trị Người Dùng & Phân Vai Trò</h1>
          <p className="text-xs text-slate-500 mt-1">Danh sách tài khoản sinh viên và cán bộ quản trị</p>
        </div>
        <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          Thêm tài khoản
        </AppButton>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 text-xs">
        {users.map((u, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800 text-sm">{u.name}</div>
              <div className="text-slate-400 mt-0.5">{u.email}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-slate-100 font-bold text-slate-700 rounded text-[11px]">{u.role}</span>
              <span className="text-emerald-600 font-semibold">{u.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
