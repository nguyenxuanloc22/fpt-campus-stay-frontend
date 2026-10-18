import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  IdCard,
  Calendar,
  Users,
  Shield,
  Bell,
  Lock,
  Smartphone,
  Pencil,
  Save,
  HeartPulse,
  Building2,
  Award,
  LogIn,
  RefreshCw,
} from 'lucide-react';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@features/auth';
import {
  PageHeader,
  SectionCard,
  Tabs,
  AppButton,
  Avatar,
  StatusBadge,
  ProgressBar,
  useToast,
} from '@shared-ui';

type TabKey = 'info' | 'emergency' | 'settings' | 'activity';

function Field({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-3">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-[11px] text-slate-400 font-medium">{label}</div>
        <div className="text-xs font-semibold text-slate-700 break-words">{value}</div>
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={clsx('w-10 h-6 rounded-full p-0.5 transition', checked ? 'bg-[#F26F21]' : 'bg-slate-300')}
    >
      <span className={clsx('block w-5 h-5 rounded-full bg-white shadow transition', checked && 'translate-x-4')} />
    </button>
  );
}

const ACTIVITY = [
  { time: '17/10/2026 07:58', text: 'Đăng nhập từ Chrome — Windows', ip: '14.161.22.x', icon: LogIn },
  { time: '16/10/2026 21:12', text: 'Gửi yêu cầu bảo trì TK-10482', ip: '14.161.22.x', icon: RefreshCw },
  { time: '15/10/2026 20:03', text: 'Đăng nhập từ ứng dụng CampusStay iOS', ip: '27.72.101.x', icon: Smartphone },
  { time: '12/10/2026 09:40', text: 'Cập nhật số điện thoại liên hệ', ip: '14.161.22.x', icon: Pencil },
  { time: '05/10/2026 18:25', text: 'Thanh toán hóa đơn INV-2026-0905', ip: '27.72.101.x', icon: RefreshCw },
];

export function StudentProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { show, toastNode } = useToast();
  const [params] = useSearchParams();
  const [tab, setTab] = useState<TabKey>(params.get('tab') === 'settings' ? 'settings' : 'info');
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState(user?.phoneNumber || '0901 234 567');
  const [personalEmail, setPersonalEmail] = useState('maianh.nguyen@gmail.com');
  const [emergency, setEmergency] = useState({
    name: 'Nguyễn Văn Hùng',
    relation: 'Bố',
    phone: '0913 556 778',
    address: 'Xã Phước Hòa, Huyện Phú Giáo, Tỉnh Bình Dương',
  });
  const [notify, setNotify] = useState({ email: true, push: true, sms: false, invoice: true, maintenance: true, events: false });
  const [twoFa, setTwoFa] = useState(true);

  return (
    <div className="space-y-6">
      <PageHeader title="Hồ Sơ Sinh Viên" description="Thông tin cá nhân đồng bộ từ hệ thống FPT SIS • Lần đồng bộ cuối 07:00 hôm nay" />

      {/* Header card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="h-20 bg-slate-100" />
        <div className="px-6 pb-6 -mt-10 flex flex-col md:flex-row md:items-end gap-4">
          <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow">
            <div className="w-full h-full rounded-xl bg-[#FFF2EA] text-[#F26F21] flex items-center justify-center font-bold text-3xl">
              {user?.name?.split(' ').pop()?.charAt(0) || 'A'}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-800">{user?.name}</h2>
              <StatusBadge status="ACTIVE" customLabel="Đang lưu trú" />
            </div>
            <div className="text-xs text-slate-500">
              MSSV: <strong>{user?.studentId || 'SE171234'}</strong> • {user?.major || 'Kỹ thuật phần mềm (SE)'} • Khóa K17
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              ['3', 'Học kỳ ở KTX'],
              ['96', 'Điểm nội quy'],
              ['0', 'Vi phạm'],
            ].map(([v, l]) => (
              <div key={l} className="px-3 py-2 rounded-xl bg-slate-50">
                <div className="text-lg font-bold text-slate-900">{v}</div>
                <div className="text-[10px] text-slate-500">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Tabs<TabKey>
        items={[
          { value: 'info', label: 'Thông tin cá nhân' },
          { value: 'emergency', label: 'Liên hệ khẩn cấp' },
          { value: 'settings', label: 'Cài đặt & bảo mật' },
          { value: 'activity', label: 'Hoạt động gần đây' },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'info' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <SectionCard title="Thông tin học vụ" subtitle="Chỉ đọc — chỉnh sửa tại Phòng Đào tạo">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={IdCard} label="Mã số sinh viên" value={user?.studentId || 'SE171234'} />
                <Field icon={GraduationCap} label="Chuyên ngành" value={user?.major || 'Kỹ thuật phần mềm (SE)'} />
                <Field icon={Calendar} label="Ngày sinh" value="14/03/2005" />
                <Field icon={Users} label="Giới tính" value={user?.gender === 'FEMALE' ? 'Nữ' : 'Nam'} />
                <Field icon={Building2} label="Cơ sở đào tạo" value="FPT University Tân Uyên (Bình Dương)" />
                <Field icon={Award} label="Học kỳ hiện tại" value="Kỳ 5 — GPA tích lũy 8.2" />
                <Field icon={IdCard} label="Số CCCD" value="074 305 xxx 912" />
                <Field icon={MapPin} label="Địa chỉ thường trú" value="Xã Phước Hòa, Huyện Phú Giáo, Tỉnh Bình Dương (> 50km)" />
              </div>
            </SectionCard>

            <SectionCard
              title="Thông tin liên hệ"
              subtitle="Bạn có thể tự cập nhật"
              actions={
                editing ? (
                  <AppButton
                    size="sm"
                    leftIcon={<Save className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setEditing(false);
                      show('Đã lưu thông tin liên hệ');
                    }}
                  >
                    Lưu
                  </AppButton>
                ) : (
                  <AppButton size="sm" variant="outline" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => setEditing(true)}>
                    Chỉnh sửa
                  </AppButton>
                )
              }
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field icon={Mail} label="Email sinh viên" value={user?.email} />
                {editing ? (
                  <>
                    <div>
                      <label className="text-[11px] text-slate-500">Số điện thoại</label>
                      <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">Email cá nhân</label>
                      <input value={personalEmail} onChange={(e) => setPersonalEmail(e.target.value)} className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg" />
                    </div>
                  </>
                ) : (
                  <>
                    <Field icon={Phone} label="Số điện thoại" value={phone} />
                    <Field icon={Mail} label="Email cá nhân" value={personalEmail} />
                  </>
                )}
                <Field icon={MapPin} label="Địa chỉ hiện tại" value="Phòng A204, Tòa A, KTX FPT Tân Uyên" />
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <SectionCard title="Mức độ hoàn thiện hồ sơ">
              <div className="flex items-end justify-between mb-2">
                <span className="text-2xl font-bold text-slate-900">85%</span>
                <span className="text-[11px] text-slate-500">Còn 2 mục</span>
              </div>
              <ProgressBar value={85} tone="emerald" size="md" />
              <ul className="mt-4 space-y-2 text-xs">
                {[
                  ['Thông tin cơ bản', true],
                  ['Ảnh chân dung', true],
                  ['Liên hệ khẩn cấp', true],
                  ['Thông tin y tế', false],
                  ['Tài khoản ngân hàng hoàn cọc', false],
                ].map(([l, ok]) => (
                  <li key={String(l)} className="flex items-center justify-between">
                    <span className="text-slate-600">{l}</span>
                    <span className={ok ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'}>{ok ? 'Đã có' : 'Thiếu'}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard title={<span className="flex items-center gap-2"><HeartPulse className="w-4 h-4 text-rose-500" /> Thông tin y tế</span>}>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-slate-500">Nhóm máu</span><span className="font-semibold">O+</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Dị ứng</span><span className="font-semibold">Phấn hoa</span></div>
                <div className="flex justify-between"><span className="text-slate-500">BHYT</span><span className="font-semibold">SV4 74 xxx 2210</span></div>
              </div>
              <AppButton size="sm" variant="outline" className="w-full mt-4" onClick={() => show('Đã mở biểu mẫu cập nhật y tế', 'info')}>
                Cập nhật
              </AppButton>
            </SectionCard>
          </div>
        </div>
      )}

      {tab === 'emergency' && (
        <SectionCard title="Người liên hệ khi khẩn cấp" subtitle="Ban quản lý KTX chỉ liên hệ trong trường hợp cần thiết">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {(
              [
                ['name', 'Họ và tên'],
                ['relation', 'Quan hệ'],
                ['phone', 'Số điện thoại'],
                ['address', 'Địa chỉ'],
              ] as const
            ).map(([k, label]) => (
              <div key={k} className={k === 'address' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{label}</label>
                <input
                  value={emergency[k]}
                  onChange={(e) => setEmergency({ ...emergency, [k]: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-5 p-3 rounded-xl bg-slate-50 max-w-3xl">
            <Avatar name={emergency.name} size="md" />
            <div className="flex-1 text-xs">
              <div className="font-semibold text-slate-800">{emergency.name}</div>
              <div className="text-slate-500">
                {emergency.relation} • {emergency.phone}
              </div>
            </div>
            <AppButton size="sm" onClick={() => show('Đã lưu người liên hệ khẩn cấp')}>
              Lưu thay đổi
            </AppButton>
          </div>
        </SectionCard>
      )}

      {tab === 'settings' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <SectionCard title={<span className="flex items-center gap-2"><Bell className="w-4 h-4 text-[#F26F21]" /> Thông báo</span>}>
            <ul className="divide-y divide-slate-100">
              {(
                [
                  ['email', 'Nhận thông báo qua email', 'anhntmse171234@fpt.edu.vn'],
                  ['push', 'Thông báo đẩy trên ứng dụng', 'CampusStay iOS / Android'],
                  ['sms', 'Tin nhắn SMS', 'Chỉ dùng cho tin khẩn cấp'],
                  ['invoice', 'Nhắc hạn thanh toán', 'Trước 3 ngày và đúng hạn'],
                  ['maintenance', 'Cập nhật yêu cầu bảo trì', 'Khi trạng thái thay đổi'],
                  ['events', 'Sự kiện & hoạt động KTX', 'Đêm nhạc, thể thao, CLB'],
                ] as const
              ).map(([k, label, desc]) => (
                <li key={k} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{label}</div>
                    <div className="text-[11px] text-slate-500">{desc}</div>
                  </div>
                  <Toggle checked={notify[k]} onChange={(v) => setNotify({ ...notify, [k]: v })} />
                </li>
              ))}
            </ul>
          </SectionCard>
          <div className="space-y-6">
            <SectionCard title={<span className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-900" /> Bảo mật tài khoản</span>}>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Xác thực 2 lớp (OTP)</div>
                    <div className="text-[11px] text-slate-500">Yêu cầu OTP khi ký hợp đồng & thanh toán</div>
                  </div>
                  <Toggle checked={twoFa} onChange={setTwoFa} />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-slate-800">Đăng nhập bằng FPT SSO</div>
                    <div className="text-[11px] text-slate-500">Mật khẩu được quản lý bởi FPT Education</div>
                  </div>
                  <AppButton size="sm" variant="outline" leftIcon={<Lock className="w-3.5 h-3.5" />} onClick={() => show('Chuyển hướng tới trang đổi mật khẩu FPT SSO', 'info')}>
                    Đổi mật khẩu
                  </AppButton>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Thiết bị đang đăng nhập" noPadding>
              <ul className="divide-y divide-slate-100">
                {[
                  { d: 'Chrome trên Windows 11', where: 'Bình Dương • Đang hoạt động', current: true },
                  { d: 'CampusStay iOS — iPhone 15', where: 'Bình Dương • 2 ngày trước', current: false },
                ].map((s) => (
                  <li key={s.d} className="px-5 py-3 flex items-center gap-3">
                    <Smartphone className="w-4 h-4 text-slate-400" />
                    <div className="flex-1 text-xs">
                      <div className="font-semibold text-slate-800">{s.d}</div>
                      <div className="text-slate-500">{s.where}</div>
                    </div>
                    {s.current ? (
                      <span className="text-[11px] font-semibold text-emerald-600">Thiết bị này</span>
                    ) : (
                      <button type="button" onClick={() => show('Đã đăng xuất thiết bị', 'info')} className="text-[11px] font-semibold text-rose-600 hover:underline">
                        Đăng xuất
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <SectionCard title="Nhật ký hoạt động tài khoản" subtitle="30 ngày gần nhất" noPadding>
          <ul className="divide-y divide-slate-100">
            {ACTIVITY.map((a) => (
              <li key={a.time} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <a.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-semibold text-slate-800">{a.text}</div>
                  <div className="text-slate-400">
                    {a.time} • IP {a.ip}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {toastNode}
    </div>
  );
}
