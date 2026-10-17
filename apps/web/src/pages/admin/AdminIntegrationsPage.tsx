import { useState } from 'react';
import { RefreshCw, Link, GraduationCap, QrCode, Mail, MessageSquare, Bell, KeyRound, CheckCircle2, AlertTriangle, XCircle, Eye, EyeOff, Copy, Webhook, Settings2 } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, AppButton, Modal, StatusBadge, Sparkline, useToast } from '@shared-ui';

type IntStatus = 'connected' | 'degraded' | 'down' | 'disabled';

interface Integration {
  id: string;
  name: string;
  vendor: string;
  desc: string;
  icon: typeof Link;
  status: IntStatus;
  lastSync: string;
  calls24h: number;
  errorRate: number;
  trend: number[];
  endpoint: string;
}

const INTEGRATIONS: Integration[] = [
  { id: 'sis', name: 'FPT SIS', vendor: 'FPT Education', desc: 'Xác minh tình trạng học tập, năm học, ngành, địa chỉ thường trú', icon: GraduationCap, status: 'connected', lastSync: '17/10 07:03', calls24h: 18452, errorRate: 0.02, trend: [12, 14, 13, 18, 16, 18], endpoint: 'https://sis-api.fpt.edu.vn/v3' },
  { id: 'google', name: 'Google OAuth 2.0', vendor: 'Google', desc: 'Đăng nhập bằng tài khoản @fpt.edu.vn (giới hạn domain)', icon: KeyRound, status: 'connected', lastSync: 'Thời gian thực', calls24h: 6210, errorRate: 0.1, trend: [5, 6, 6, 7, 6, 6], endpoint: 'https://accounts.google.com/o/oauth2' },
  { id: 'vietqr', name: 'VietQR / NAPAS 247', vendor: 'Vietcombank', desc: 'Tạo mã QR động, webhook xác nhận thanh toán tự động', icon: QrCode, status: 'degraded', lastSync: '17/10 09:41', calls24h: 1830, errorRate: 2.4, trend: [2, 3, 2, 5, 8, 6], endpoint: 'https://api.vietqr.io/v2' },
  { id: 'email', name: 'Gmail API', vendor: 'Google', desc: 'Email mời đăng ký, nhắc hạn, biên nhận, hợp đồng', icon: Mail, status: 'connected', lastSync: '17/10 09:40', calls24h: 3402, errorRate: 0.3, trend: [3, 4, 3, 4, 4, 3], endpoint: 'https://gmail.googleapis.com/gmail/v1' },
  { id: 'sms', name: 'SMS Brandname', vendor: 'Viettel', desc: 'Tin nhắn khẩn cấp & OTP ký hợp đồng', icon: MessageSquare, status: 'connected', lastSync: '17/10 08:12', calls24h: 214, errorRate: 0.9, trend: [1, 1, 2, 1, 1, 2], endpoint: 'https://api.viettel-sms.vn' },
  { id: 'fcm', name: 'Firebase Cloud Messaging', vendor: 'Google', desc: 'Thông báo đẩy tới ứng dụng di động của sinh viên', icon: Bell, status: 'connected', lastSync: '17/10 09:38', calls24h: 5120, errorRate: 0.4, trend: [4, 5, 5, 6, 5, 6], endpoint: 'https://fcm.googleapis.com/v1' },
];

const WEBHOOKS = [
  { event: 'payment.succeeded', url: '/api/webhooks/vietqr', last: '09:41', status: 200 },
  { event: 'payment.failed', url: '/api/webhooks/vietqr', last: '08:55', status: 200 },
  { event: 'sis.student.updated', url: '/api/webhooks/sis', last: '07:03', status: 200 },
  
];

const STATUS_META: Record<IntStatus, { label: string; cls: string; icon: typeof CheckCircle2 }> = {
  connected: { label: 'Đã kết nối', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
  degraded: { label: 'Chậm / lỗi một phần', cls: 'bg-amber-50 text-amber-700', icon: AlertTriangle },
  down: { label: 'Mất kết nối', cls: 'bg-rose-50 text-rose-700', icon: XCircle },
  disabled: { label: 'Đã tắt', cls: 'bg-slate-100 text-slate-600', icon: XCircle },
};

export function AdminIntegrationsPage() {
  const { show, toastNode } = useToast();
  const [items, setItems] = useState(INTEGRATIONS);
  const [config, setConfig] = useState<Integration | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);

  const sync = (id: string) => {
    setSyncing(id);
    window.setTimeout(() => {
      setSyncing(null);
      setItems((all) => all.map((i) => (i.id === id ? { ...i, lastSync: 'Vừa xong', status: i.status === 'down' ? 'down' : 'connected' } : i)));
      const it = items.find((i) => i.id === id);
      show(it?.status === 'down' ? `${it.name}: vẫn không kết nối được` : `Đã đồng bộ ${it?.name}`, it?.status === 'down' ? 'warning' : 'success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Tích Hợp Hệ Thống" description="Kết nối FPT SIS (xác minh điều kiện), Google (đăng nhập & email), VietQR (thanh toán) và kênh thông báo" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tích hợp hoạt động" value={`${items.filter((i) => i.status === 'connected').length}/${items.length}`} icon={Link} tone="emerald" />
        <StatCard label="API calls 24h" value={items.reduce((s, i) => s + i.calls24h, 0).toLocaleString('vi-VN')} icon={Webhook} tone="navy" />
        <StatCard label="Cảnh báo" value={items.filter((i) => i.status === 'degraded').length} icon={AlertTriangle} tone="amber" />
        <StatCard label="Mất kết nối" value={items.filter((i) => i.status === 'down').length} icon={XCircle} tone="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((i) => {
          const m = STATUS_META[i.status];
          return (
            <div key={i.id} className={clsx('bg-white p-5 rounded-2xl border shadow-xs', i.status === 'down' ? 'border-rose-200' : i.status === 'degraded' ? 'border-amber-200' : 'border-slate-200')}>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#EBF2FB] text-[#1A365D] flex items-center justify-center"><i.icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-800">{i.name}</span>
                    <span className={clsx('text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1', m.cls)}><m.icon className="w-3 h-3" />{m.label}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{i.vendor} • {i.desc}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 my-4 text-xs">
                <div className="p-2 rounded-lg bg-slate-50"><div className="text-slate-400 text-[10px]">Đồng bộ cuối</div><div className="font-semibold">{i.lastSync}</div></div>
                <div className="p-2 rounded-lg bg-slate-50"><div className="text-slate-400 text-[10px]">Calls 24h</div><div className="font-semibold">{i.calls24h.toLocaleString('vi-VN')}</div></div>
                <div className="p-2 rounded-lg bg-slate-50"><div className="text-slate-400 text-[10px]">Tỷ lệ lỗi</div><div className={clsx('font-semibold', i.errorRate > 1 ? 'text-rose-600' : 'text-emerald-600')}>{i.errorRate}%</div></div>
              </div>
              <Sparkline points={i.trend} color={i.status === 'down' ? '#F43F5E' : i.status === 'degraded' ? '#F59E0B' : '#10B981'} />
              <div className="flex gap-2 mt-3">
                <AppButton size="sm" variant="outline" isLoading={syncing === i.id} leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => sync(i.id)}>Đồng bộ / kiểm tra</AppButton>
                <AppButton size="sm" variant="ghost" leftIcon={<Settings2 className="w-3.5 h-3.5" />} onClick={() => setConfig(i)}>Cấu hình</AppButton>
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard title={<span className="flex items-center gap-2"><Webhook className="w-4 h-4" /> Webhook nhận vào</span>} noPadding>
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500"><tr><th className="text-left px-5 py-3 font-semibold">Sự kiện</th><th className="text-left px-5 py-3 font-semibold">Endpoint</th><th className="text-left px-5 py-3 font-semibold">Lần cuối</th><th className="text-left px-5 py-3 font-semibold">HTTP</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {WEBHOOKS.map((w) => (
              <tr key={w.event}>
                <td className="px-5 py-3"><code className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100">{w.event}</code></td>
                <td className="px-5 py-3 text-slate-600">{w.url}</td>
                <td className="px-5 py-3 text-slate-500">{w.last}</td>
                <td className="px-5 py-3"><StatusBadge status={w.status === 200 ? 'SUCCESS' : 'FAILED'} customLabel={String(w.status)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <Modal open={!!config} onClose={() => { setConfig(null); setShowKey(false); }} size="lg" title={`Cấu hình ${config?.name ?? ''}`} subtitle={config?.vendor}
        footer={<><AppButton variant="outline" onClick={() => setConfig(null)}>Hủy</AppButton><AppButton onClick={() => { show('Đã lưu cấu hình tích hợp'); setConfig(null); }}>Lưu</AppButton></>}
      >
        {config && (
          <div className="space-y-4 text-xs">
            <div><label className="block font-semibold text-slate-700 mb-1">Endpoint</label><input defaultValue={config.endpoint} className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono" /></div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">API key / Client secret</label>
              <div className="flex gap-2">
                <input type={showKey ? 'text' : 'password'} defaultValue="sk_live_••••••••••••••••4f2a" readOnly className="flex-1 px-3 py-2 border border-slate-200 rounded-lg font-mono bg-slate-50" />
                <AppButton size="sm" variant="outline" onClick={() => setShowKey(!showKey)} aria-label="Hiện/ẩn">{showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</AppButton>
                <AppButton size="sm" variant="outline" onClick={() => show('Đã sao chép', 'info')} aria-label="Sao chép"><Copy className="w-4 h-4" /></AppButton>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Khóa được lưu mã hóa trong Vault. Xoay vòng khóa lần cuối: 01/09/2026.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block font-semibold text-slate-700 mb-1">Timeout (giây)</label><input type="number" defaultValue={30} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              <div><label className="block font-semibold text-slate-700 mb-1">Số lần thử lại</label><input type="number" defaultValue={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
            </div>
            <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-[#F26F21]" /> Gửi cảnh báo email cho quản trị viên khi mất kết nối &gt; 5 phút</label>
          </div>
        )}
      </Modal>

      {toastNode}
    </div>
  );
}
