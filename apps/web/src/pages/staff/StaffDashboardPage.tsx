import {
  CheckSquare,
  Wrench,
  CalendarCheck,
  Layers,
  ArrowRight,
  Repeat,
  ClipboardList,
  Megaphone,
  AlertTriangle,
  Clock,
  Building2,
  UserCheck,
  LogOut,
  ShieldAlert,
  ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { useAuthStore } from '@features/auth';
import {
  AppButton,
  StatCard,
  SectionCard,
  StatusBadge,
  ProgressBar,
  Avatar,
  BarChart,
  DonutChart,
} from '@shared-ui';

const BUILDINGS = [
  { code: 'A', gender: 'Nữ', beds: 288, used: 271, maintenance: 4 },
  { code: 'B', gender: 'Nam', beds: 312, used: 298, maintenance: 6 },
  { code: 'C', gender: 'Nữ', beds: 320, used: 276, maintenance: 2 },
  { code: 'D', gender: 'Nam', beds: 280, used: 230, maintenance: 3 },
];

const TASKS = [
  { title: 'Đề xuất xếp phòng BR-SP27-02 có 6 xung đột', sub: 'Rà soát & điều chỉnh trước khi gửi Manager', priority: 'HIGH', route: APP_ROUTES.STAFF.ASSIGNMENT, cta: 'Điều chỉnh' },
  { title: '4 đơn đăng ký bị gắn cờ cần rà soát', sub: 'Dữ liệu SIS lệch / lý do đặc biệt', priority: 'HIGH', route: APP_ROUTES.STAFF.APPLICATIONS, cta: 'Rà soát' },
  { title: 'Ticket TK-10499: Mất điện tầng 3 Tòa D', sub: 'Đã quá SLA 0.9 giờ', priority: 'HIGH', route: APP_ROUTES.STAFF.MAINTENANCE, cta: 'Xử lý' },
  { title: '3 biên bản trả phòng chờ xác minh', sub: 'Đối chiếu với biên bản nhận phòng', priority: 'MEDIUM', route: APP_ROUTES.STAFF.CHECKIN_OUT, cta: 'Xác minh' },
  { title: 'Lên lịch kiểm tra phòng theo yêu cầu bảo trì', sub: '5 ticket đã duyệt chờ lịch', priority: 'LOW', route: APP_ROUTES.STAFF.MAINTENANCE, cta: 'Lên lịch' },
];

const SCHEDULE = [
  { time: '08:30', name: 'Lê Thị Hồng Nhung', id: 'SE190112', room: 'C305-G2', type: 'IN' },
  { time: '09:00', name: 'Đỗ Minh Quân', id: 'SE190455', room: 'B210-G4', type: 'IN' },
  { time: '09:30', name: 'Phan Thùy Dung', id: 'GD190087', room: 'A115-G1', type: 'IN' },
  { time: '10:30', name: 'Trương Gia Bảo', id: 'AI180990', room: 'D402-G2', type: 'OUT' },
  { time: '14:30', name: 'Hồ Tấn Phát', id: 'SE170321', room: 'B312-G3', type: 'OUT' },
  { time: '15:30', name: 'Mai Khánh Vy', id: 'SS190234', room: 'C210-G4', type: 'IN' },
];

const ACTIVITY = [
  { who: 'Nguyễn Thu Hà', what: 'đã duyệt đơn APP-SP27-004801', when: '5 phút trước' },
  { who: 'Lê Văn Tài', what: 'cập nhật ticket TK-10482 sang "Đang xử lý"', when: '18 phút trước' },
  { who: 'Hệ thống', what: 'ghi nhận thanh toán VietQR 285.000 ₫ từ SE171234', when: '32 phút trước' },
  { who: 'Trần Văn Cường', what: 'hoàn tất check-in cho SE190087 (A115)', when: '1 giờ trước' },
  { who: 'Lê Minh Khoa', what: 'đã gửi thông báo "Cắt nước Tòa A 19/10"', when: '2 giờ trước' },
];

export function StaffDashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const totalBeds = BUILDINGS.reduce((s, b) => s + b.beds, 0);
  const usedBeds = BUILDINGS.reduce((s, b) => s + b.used, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A365D]">Bàn Làm Việc Cán Bộ Ký Túc Xá</h1>
          <p className="text-xs text-slate-500 mt-1">
            Xin chào {user?.name} • Ca làm việc 07:30 – 17:00 • Thứ Bảy, 17/10/2026
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AppButton size="sm" variant="outline" leftIcon={<Megaphone className="w-4 h-4" />} onClick={() => navigate(APP_ROUTES.STAFF.BROADCAST)}>
            Gửi thông báo
          </AppButton>
          <AppButton size="sm" leftIcon={<CalendarCheck className="w-4 h-4" />} onClick={() => navigate(APP_ROUTES.STAFF.CHECKIN_OUT)}>
            Check-in thủ công
          </AppButton>
        </div>
      </div>

      {/* Alert strip */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <span>
            <strong>2 ticket khẩn cấp</strong> sắp vượt SLA: rò rỉ nước B108, mất điện tầng 3 Tòa D.
          </span>
        </div>
        <div className="flex-1 flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>37 hóa đơn</strong> đã bị hệ thống đánh dấu quá hạn — cần liên hệ sinh viên xử lý công nợ.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Đơn chờ duyệt" value="18 đơn" icon={CheckSquare} tone="amber" hint="Cần thẩm định trong 24h" trend={{ value: '+6 hôm nay', up: false }} />
        <StatCard label="Ticket bảo trì mở" value="23 ticket" icon={Wrench} tone="blue" hint="5 khẩn cấp • 11 đang xử lý" />
        <StatCard label="Check-in / out hôm nay" value="12 / 4" icon={CalendarCheck} tone="purple" hint="Phần lớn tự phục vụ qua QR" />
        <StatCard label="Giường trống khả dụng" value={`${totalBeds - usedBeds} / ${totalBeds.toLocaleString('vi-VN')}`} icon={Layers} tone="emerald" hint={`Lấp đầy ${((usedBeds / totalBeds) * 100).toFixed(1)}%`} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SectionCard title="Tác vụ cần giải quyết" subtitle="Sắp xếp theo mức độ ưu tiên" noPadding>
            <ul className="divide-y divide-slate-100">
              {TASKS.map((t) => (
                <li key={t.title} className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={t.priority} />
                      <span className="text-xs font-bold text-slate-800">{t.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">{t.sub}</div>
                  </div>
                  <AppButton size="sm" variant={t.priority === 'HIGH' ? 'primary' : 'outline'} onClick={() => navigate(t.route)}>
                    {t.cta}
                  </AppButton>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Công suất theo tòa nhà" subtitle="Cập nhật theo thời gian thực từ hệ thống thẻ từ & hợp đồng">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BUILDINGS.map((b) => {
                const pct = (b.used / b.beds) * 100;
                return (
                  <div key={b.code} className="p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#1A365D] text-white flex items-center justify-center font-bold text-sm">{b.code}</div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Tòa {b.code}</div>
                          <div className="text-[11px] text-slate-500">Khu {b.gender}</div>
                        </div>
                      </div>
                      <span className={clsx('text-sm font-bold', pct > 95 ? 'text-rose-600' : pct > 85 ? 'text-amber-600' : 'text-emerald-600')}>
                        {pct.toFixed(1)}%
                      </span>
                    </div>
                    <ProgressBar value={b.used} max={b.beds} tone={pct > 95 ? 'rose' : pct > 85 ? 'amber' : 'emerald'} size="md" />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                      <span>
                        {b.used}/{b.beds} giường
                      </span>
                      <span>{b.beds - b.used} trống • {b.maintenance} phòng bảo trì</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Ticket bảo trì 7 ngày qua" subtitle="Mới tạo so với đã hoàn thành">
            <BarChart
              data={[
                { label: 'T2', value: 9, secondary: 7 },
                { label: 'T3', value: 12, secondary: 10 },
                { label: 'T4', value: 7, secondary: 9 },
                { label: 'T5', value: 14, secondary: 11 },
                { label: 'T6', value: 10, secondary: 12 },
                { label: 'T7', value: 6, secondary: 4 },
                { label: 'CN', value: 3, secondary: 2 },
              ]}
              primaryLabel="Ticket mới"
              secondaryLabel="Đã hoàn thành"
            />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard
            title="Check-in / check-out gần đây"
            actions={
              <button type="button" onClick={() => navigate(APP_ROUTES.STAFF.CHECKIN_OUT)} className="text-[11px] font-semibold text-[#F26F21] hover:underline">
                Tất cả
              </button>
            }
            noPadding
          >
            <ul className="divide-y divide-slate-100">
              {SCHEDULE.map((s) => (
                <li key={s.id} className="px-5 py-3 flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 w-10">{s.time}</span>
                  <Avatar name={s.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-800 truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {s.id} • {s.room}
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1',
                      s.type === 'IN' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                    )}
                  >
                    {s.type === 'IN' ? <UserCheck className="w-3 h-3" /> : <LogOut className="w-3 h-3" />}
                    {s.type === 'IN' ? 'IN' : 'OUT'}
                  </span>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Ticket theo hạng mục">
            <DonutChart
              size={120}
              centerValue="23"
              centerLabel="đang mở"
              segments={[
                { label: 'Máy lạnh', value: 8, color: '#F26F21' },
                { label: 'Điện', value: 5, color: '#1A365D' },
                { label: 'Nước / WC', value: 6, color: '#3B82F6' },
                { label: 'Nội thất', value: 4, color: '#10B981' },
              ]}
            />
          </SectionCard>

          <SectionCard title="Hoạt động gần đây" noPadding>
            <ul className="divide-y divide-slate-100">
              {ACTIVITY.map((a) => (
                <li key={a.what} className="px-5 py-3 flex items-start gap-3">
                  <Avatar name={a.who} size="xs" className="mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-800">{a.who}</span> <span className="text-slate-600">{a.what}</span>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {a.when}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Truy cập nhanh">
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Phòng & giường', icon: Building2, to: APP_ROUTES.STAFF.INVENTORY },
                { label: 'Xếp phòng', icon: Layers, to: APP_ROUTES.STAFF.ASSIGNMENT },
                { label: 'Đổi phòng', icon: Repeat, to: APP_ROUTES.STAFF.ROOM_CHANGES },
                { label: 'Kiểm tra phòng', icon: ClipboardList, to: APP_ROUTES.STAFF.MAINTENANCE },
              ].map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => navigate(q.to)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-[#FFF2EA] text-left flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <q.icon className="w-4 h-4 text-[#1A365D]" /> {q.label}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#F26F21]" />
                </button>
              ))}
            </div>
            <AppButton variant="secondary" size="sm" className="w-full mt-3" rightIcon={<ArrowRight className="w-4 h-4" />} onClick={() => navigate(APP_ROUTES.STAFF.BROADCAST)}>
              Soạn thông báo phát loa / in-app
            </AppButton>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
