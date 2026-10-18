import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ROLE_LABELS } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import { PageHeader, SectionCard, Avatar, AppButton, useToast, t } from '@shared-ui';
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
      <PageHeader title={t('Profile')} description={t('Account information and notification settings')} />
      <SectionCard>
        <div className="flex items-center gap-4">
          <Avatar name={user.name} size="lg" />
          <div>
            <div className="text-base font-bold text-ink">{user.name}</div>
            <div className="text-xs text-ink-muted">{t(ROLE_LABELS[user.role])} · {user.email}</div>
            <div className="text-xs text-ink-muted">{t('FPT Tan Uyen campus')}</div>
          </div>
        </div>
      </SectionCard>
      <SectionCard title={t('Notification settings')} className={params.get('tab') === 'settings' ? 'ring-2 ring-orange-100' : undefined}>
        <div className="space-y-3 text-sm">
          <label className="flex items-center justify-between gap-3">
            <span className="text-ink">{t('Email notifications')}</span>
            <input type="checkbox" checked={emailNotify} onChange={(e) => setEmailNotify(e.target.checked)} className="w-4 h-4 accent-brand-ink" />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span className="text-ink">{t('In-app notifications')}</span>
            <input type="checkbox" checked={pushNotify} onChange={(e) => setPushNotify(e.target.checked)} className="w-4 h-4 accent-brand-ink" />
          </label>
        </div>
        <AppButton size="sm" className="mt-4" onClick={() => show(t('Settings saved'))}>{t('Save')}</AppButton>
      </SectionCard>
      {toastNode}
    </div>
  );
}
