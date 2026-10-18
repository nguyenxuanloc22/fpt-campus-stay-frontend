import { Compass, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppButton } from '@shared-ui/components/AppButton';
import { t } from '@shared-ui';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
      <div className="max-w-md w-full text-center bg-surface p-8 rounded-2xl shadow-sm border border-line">
        <div className="w-16 h-16 bg-amber-50 text-brand-ink rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">{t('404 - Page not found')}</h1>
        <p className="text-ink-muted text-sm mb-6">
          {t('The page you requested does not exist or has moved to a new address.')}
        </p>
        <AppButton
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/')}
        >
          {t('Go to main page')}
        </AppButton>
      </div>
    </div>
  );
}
