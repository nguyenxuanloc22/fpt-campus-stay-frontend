import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROLE_LABELS } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { PageHeader, SectionCard, Avatar, AppButton, useToast } from '@shared-ui';
import { StudentProfilePage } from '@pages/student/StudentProfilePage';

/** Hồ sơ & cài đặt tài khoản — sinh viên dùng hồ sơ đồng bộ SIS, các vai trò khác dùng hồ sơ cán bộ. */
export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  if (user?.role === 'STUDENT') return <StudentProfilePage />;
  return <StaffProfile />;
}

function StaffProfile() {
  const user = useAuthStore((s) => s.user);
  const [params] = useSearchParams();
  const { show, toastNode } = useToast();
  const [emailNotify, setEmailNotify] = useState(true);
  const [pushNotify, setPushNotify] = useState(true);

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Hồ sơ cá nhân" description="Thông tin tài khoản và cài đặt nhận thông báo" />
      <SectionCard>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <div className="text-base font-bold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{ROLE_LABELS[user.role]} · {user.email}</div>
            <div className="text-xs text-slate-500">Campus FPT Tân Uyên</div>
          </div>
        </div>
      </SectionCard>
      <SectionCard title="Cài đặt thông báo" className={params.get('tab') === 'settings' ? 'ring-2 ring-orange-100' : undefined}>
        <div className="space-y-3 text-sm">
          <label className="flex items-center justify-between gap-3">
            <span className="text-slate-700">Nhận thông báo qua email</span>
            <input type="checkbox" checked={emailNotify} onChange={(e) => setEmailNotify(e.target.checked)} className="w-4 h-4 accent-[#F26F21]" />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-slate-700">Thông báo trong ứng dụng</span>
            <input type="checkbox" checked={pushNotify} onChange={(e) => setPushNotify(e.target.checked)} className="w-4 h-4 accent-[#F26F21]" />
          </label>
        </div>
        <AppButton size="sm" className="mt-4" onClick={() => show('Đã lưu cài đặt')}>Lưu</AppButton>
      </SectionCard>
      {toastNode}
    </div>
  );
}
