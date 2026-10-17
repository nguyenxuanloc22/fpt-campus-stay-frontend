import { useAuthStore } from '@features/auth';

export function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Hồ Sơ Sinh Viên</h1>
        <p className="text-xs text-slate-500 mt-1">Thông tin cá nhân đồng bộ từ hệ thống FPT SIS</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFF2EA] text-[#F26F21] flex items-center justify-center font-bold text-2xl">
            {user?.name?.charAt(0) || 'L'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
            <div className="text-xs text-slate-500">Mã số sinh viên: <strong>{user?.studentId || 'SE170123'}</strong></div>
            <div className="text-xs text-[#F26F21] font-semibold mt-0.5">{user?.major || 'Kỹ thuật phần mềm (SE)'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Email sinh viên:</span>
            <div className="font-semibold text-slate-700">{user?.email}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Số điện thoại:</span>
            <div className="font-semibold text-slate-700">{user?.phoneNumber || '0901 234 567'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Giới tính:</span>
            <div className="font-semibold text-slate-700">{user?.gender === 'FEMALE' ? 'Nữ' : 'Nam'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1">
            <span className="text-slate-400 font-medium">Cơ sở đào tạo:</span>
            <div className="font-semibold text-slate-700">FPT University Tân Uyên (Bình Dương)</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl space-y-1 sm:col-span-2">
            <span className="text-slate-400 font-medium">Địa chỉ thường trú:</span>
            <div className="font-semibold text-slate-700">Xã Phước Hòa, Huyện Phú Giáo, Tỉnh Bình Dương (&gt; 50km)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
