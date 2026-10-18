import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@shared-ui/components/AppButton';
import { APP_ROUTES } from '@campusstay/constants';
import { t } from '@shared-ui';

export function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="max-w-md w-full text-center bg-surface p-8 rounded-2xl shadow-sm border border-line">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">{t('403 - Access denied')}</h1>
        <p className="text-ink-muted text-sm mb-6">
          {t('Your account does not have permission to use this feature of CampusStay FPT.')}
        </p>
        <div className="flex gap-3 justify-center">
          <AppButton
            variant="outline"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(-1)}
          >
            {t('Go back')}
          </AppButton>
          <AppButton onClick={() => navigate(APP_ROUTES.STUDENT.DASHBOARD)}>
            {t('Go to home page')}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
