import { Fragment, useState } from 'react';
import { Plus, Search, ShieldCheck, Users, UserCog, Lock, Unlock, KeyRound, Download, MoreHorizontal, Check, Minus } from 'lucide-react';
import clsx from 'clsx';
import { PageHeader, StatCard, SectionCard, Tabs, StatusBadge, AppButton, Avatar, Modal, useToast } from '@shared-ui';

type Role = 'STUDENT' | 'STAFF' | 'MANAGER' | 'ADMIN';
type TabKey = 'users' | 'roles';

interface Account {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: string;
  lastLogin: string;
  status: 'ACTIVE' | 'LOCKED' | 'INACTIVE';
  mfa: boolean;
}

export const ACCOUNTS: Account[] = [
  { id: 'u1', name: 'Quản trị viên Hệ thống', email: 'admin@fpt.edu.vn', role: 'ADMIN', department: 'Phòng CNTT', lastLogin: '17/10/2026 08:01', status: 'ACTIVE', mfa: true },
  { id: 'u2', name: 'ThS. Hoàng Nam', email: 'namh@fpt.edu.vn', role: 'MANAGER', department: 'Ban Quản lý KTX', lastLogin: '17/10/2026 07:45', status: 'ACTIVE', mfa: true },
  { id: 'u3', name: 'Trần Văn Cường', email: 'cuongtv@fpt.edu.vn', role: 'STAFF', department: 'Ban Quản lý KTX', lastLogin: '17/10/2026 07:30', status: 'ACTIVE', mfa: true },
  { id: 'u4', name: 'Nguyễn Thu Hà', email: 'hant@fpt.edu.vn', role: 'STAFF', department: 'Ban Quản lý KTX', lastLogin: '17/10/2026 07:28', status: 'ACTIVE', mfa: false },
  { id: 'u5', name: 'Lê Minh Khoa', email: 'khoalm@fpt.edu.vn', role: 'STAFF', department: 'Ban Quản lý KTX', lastLogin: '16/10/2026 17:02', status: 'ACTIVE', mfa: false },
  { id: 'u6', name: 'Lê Văn Tài', email: 'tailv@fpt.edu.vn', role: 'STAFF', department: 'Tổ Kỹ thuật', lastLogin: '17/10/2026 06:55', status: 'ACTIVE', mfa: false },
  { id: 'u7', name: 'Phạm Thị Lan', email: 'lanpt@fpt.edu.vn', role: 'MANAGER', department: 'Phòng Tài chính', lastLogin: '15/10/2026 14:20', status: 'ACTIVE', mfa: true },
  { id: 'u8', name: 'Nguyễn Thị Mai Anh', email: 'anhntmse171234@fpt.edu.vn', role: 'STUDENT', department: 'K17 — SE', lastLogin: '17/10/2026 07:58', status: 'ACTIVE', mfa: true },
  { id: 'u9', name: 'Trương Gia Bảo', email: 'baotgai180990@fpt.edu.vn', role: 'STUDENT', department: 'K18 — AI', lastLogin: '10/10/2026 22:11', status: 'LOCKED', mfa: false },
  { id: 'u10', name: 'Đinh Quốc Việt', email: 'vietdq@fpt.edu.vn', role: 'STAFF', department: 'Ban Quản lý KTX', lastLogin: '02/06/2026 09:00', status: 'INACTIVE', mfa: false },
];

const ROLE_META: Record<Role, { label: string; cls: string }> = {
  ADMIN: { label: 'Quản trị viên', cls: 'bg-rose-50 text-rose-700' },
  MANAGER: { label: 'Trưởng ban', cls: 'bg-purple-50 text-purple-700' },
  STAFF: { label: 'Cán bộ', cls: 'bg-blue-50 text-blue-700' },
  STUDENT: { label: 'Sinh viên', cls: 'bg-emerald-50 text-emerald-700' },
};

const PERMISSIONS = [
  { group: 'Đăng ký & hồ sơ', items: [['Nộp đơn đăng ký', 1, 0, 0, 0], ['Duyệt đơn đăng ký', 0, 1, 1, 1], ['Duyệt ngoại lệ', 0, 0, 1, 1]] },
  { group: 'Phòng & xếp phòng', items: [['Xem sơ đồ phòng', 1, 1, 1, 1], ['Xếp phòng thủ công', 0, 1, 1, 1], ['Phê duyệt batch', 0, 0, 1, 1], ['Cấu hình engine', 0, 0, 0, 1]] },
  { group: 'Tài chính', items: [['Thanh toán hóa đơn', 1, 0, 0, 0], ['Xem báo cáo tài chính', 0, 0, 1, 1], ['Sửa bảng giá', 0, 0, 0, 1]] },
  { group: 'Hệ thống', items: [['Phát thông báo', 0, 1, 1, 1], ['Quản lý người dùng', 0, 0, 0, 1], ['Xem audit log', 0, 0, 1, 1]] },
] as const;

export function AdminUsersPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('users');
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [roleFilter, setRoleFilter] = useState<'ALL' | Role>('ALL');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);

  const filtered = accounts.filter((a) => (roleFilter === 'ALL' || a.role === roleFilter) && (!query || `${a.name} ${a.email}`.toLowerCase().includes(query.toLowerCase())));
  const count = (r: Role) => accounts.filter((a) => a.role === r).length;

  const setStatus = (id: string, status: Account['status']) => {
    setAccounts((all) => all.map((a) => (a.id === id ? { ...a, status } : a)));
    setMenu(null);
    show(status === 'LOCKED' ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản', 'info');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Người Dùng & Phân Quyền"
        description="Quản lý tài khoản, vai trò (RBAC) và chính sách bảo mật"
        actions={
          <>
            <AppButton size="sm" variant="outline" leftIcon={<Download className="w-4 h-4" />} onClick={() => show('Đã xuất danh sách tài khoản')}>Xuất CSV</AppButton>
            <AppButton size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setCreateOpen(true)}>Thêm tài khoản</AppButton>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng tài khoản" value="1.142" icon={Users} tone="navy" hint="1.075 SV • 67 nhân sự" />
        <StatCard label="Nhân sự quản trị" value={count('STAFF') + count('MANAGER') + count('ADMIN')} icon={UserCog} tone="blue" />
        <StatCard label="Bật xác thực 2 lớp" value={`${Math.round((accounts.filter((a) => a.mfa).length / accounts.length) * 100)}%`} icon={ShieldCheck} tone="emerald" hint="Bắt buộc với Admin/Manager" />
        <StatCard label="Tài khoản bị khóa" value={accounts.filter((a) => a.status === 'LOCKED').length} icon={Lock} tone="rose" />
      </div>

      <Tabs<TabKey> items={[{ value: 'users', label: 'Tài khoản' }, { value: 'roles', label: 'Ma trận phân quyền' }]} value={tab} onChange={setTab} />

      {tab === 'users' ? (
        <SectionCard noPadding>
          <div className="p-4 border-b border-line flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-ink-subtle absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên hoặc email..." className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-line" />
            </div>
            <div className="flex gap-1 bg-surface-sunken p-1 rounded-lg">
              {(['ALL', 'ADMIN', 'MANAGER', 'STAFF', 'STUDENT'] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRoleFilter(r)} className={clsx('px-2.5 py-1 rounded-md text-label font-semibold', roleFilter === r ? 'bg-white shadow-xs text-brand-ink' : 'text-ink-muted')}>
                  {r === 'ALL' ? 'Tất cả' : ROLE_META[r].label}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Người dùng</th>
                  <th className="text-left px-5 py-3 font-semibold">Vai trò</th>
                  <th className="text-left px-5 py-3 font-semibold">Đơn vị</th>
                  <th className="text-left px-5 py-3 font-semibold">2FA</th>
                  <th className="text-left px-5 py-3 font-semibold">Đăng nhập cuối</th>
                  <th className="text-left px-5 py-3 font-semibold">Trạng thái</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-muted">
                    <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar name={a.name} /><div><div className="font-semibold text-ink">{a.name}</div><div className="text-label text-ink-subtle">{a.email}</div></div></div></td>
                    <td className="px-5 py-3"><span className={clsx('px-2 py-0.5 rounded-full text-label font-semibold', ROLE_META[a.role].cls)}>{ROLE_META[a.role].label}</span></td>
                    <td className="px-5 py-3 text-ink-muted">{a.department}</td>
                    <td className="px-5 py-3">{a.mfa ? <ShieldCheck className="w-4 h-4 text-emerald-500" /> : <span className="text-ink-subtle">—</span>}</td>
                    <td className="px-5 py-3 text-ink-muted">{a.lastLogin}</td>
                    <td className="px-5 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-5 py-3 text-right relative">
                      <button type="button" onClick={() => setMenu(menu === a.id ? null : a.id)} className="p-1.5 rounded-md hover:bg-surface-sunken" aria-label="Thao tác"><MoreHorizontal className="w-4 h-4 text-ink-muted" /></button>
                      {menu === a.id && (
                        <div className="absolute right-5 top-10 z-10 w-48 bg-white rounded-xl shadow-lg border border-line py-1 text-left">
                          <button type="button" onClick={() => { setMenu(null); show(`Đã gửi email đặt lại mật khẩu tới ${a.email}`, 'info'); }} className="w-full px-3 py-2 text-xs hover:bg-surface-muted flex items-center gap-2"><KeyRound className="w-3.5 h-3.5" /> Đặt lại mật khẩu</button>
                          <button type="button" onClick={() => { setMenu(null); show('Mở hộp thoại đổi vai trò', 'info'); }} className="w-full px-3 py-2 text-xs hover:bg-surface-muted flex items-center gap-2"><UserCog className="w-3.5 h-3.5" /> Đổi vai trò</button>
                          {a.status === 'LOCKED' ? (
                            <button type="button" onClick={() => setStatus(a.id, 'ACTIVE')} className="w-full px-3 py-2 text-xs hover:bg-surface-muted flex items-center gap-2 text-emerald-700"><Unlock className="w-3.5 h-3.5" /> Mở khóa</button>
                          ) : (
                            <button type="button" onClick={() => setStatus(a.id, 'LOCKED')} className="w-full px-3 py-2 text-xs hover:bg-surface-muted flex items-center gap-2 text-rose-600"><Lock className="w-3.5 h-3.5" /> Khóa tài khoản</button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Ma trận quyền theo vai trò" subtitle="Đồng bộ với package @campusstay/permissions" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-surface-muted text-ink-muted">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Quyền</th>
                  {(['STUDENT', 'STAFF', 'MANAGER', 'ADMIN'] as Role[]).map((r) => (
                    <th key={r} className="px-5 py-3 font-semibold text-center"><span className={clsx('px-2 py-0.5 rounded-full text-label', ROLE_META[r].cls)}>{ROLE_META[r].label}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((g) => (
                  <Fragment key={g.group}>
                    <tr className="bg-surface-muted/60"><td colSpan={5} className="px-5 py-2 font-bold text-ink text-label uppercase">{g.group}</td></tr>
                    {g.items.map(([label, ...vals]) => (
                      <tr key={label} className="border-t border-line">
                        <td className="px-5 py-2.5 text-ink">{label}</td>
                        {vals.map((v, i) => (
                          <td key={i} className="px-5 py-2.5 text-center">
                            {v ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <Minus className="w-4 h-4 text-ink-subtle mx-auto" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Thêm tài khoản nhân sự" subtitle="Sinh viên được tạo tự động qua đồng bộ SIS"
        footer={<><AppButton variant="outline" onClick={() => setCreateOpen(false)}>Hủy</AppButton><AppButton onClick={() => { setCreateOpen(false); show('Đã tạo tài khoản và gửi email kích hoạt'); }}>Tạo tài khoản</AppButton></>}
      >
        <div className="space-y-3 text-xs">
          <div><label className="block font-semibold text-ink mb-1">Họ và tên</label><input className="w-full px-3 py-2 border border-line rounded-lg" /></div>
          <div><label className="block font-semibold text-ink mb-1">Email @fpt.edu.vn</label><input className="w-full px-3 py-2 border border-line rounded-lg" placeholder="ten@fpt.edu.vn" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block font-semibold text-ink mb-1">Vai trò</label><select className="w-full px-3 py-2 border border-line rounded-lg bg-white"><option>Cán bộ</option><option>Trưởng ban</option><option>Quản trị viên</option></select></div>
            <div><label className="block font-semibold text-ink mb-1">Đơn vị</label><select className="w-full px-3 py-2 border border-line rounded-lg bg-white"><option>Ban Quản lý KTX</option><option>Tổ Kỹ thuật</option><option>Phòng Tài chính</option><option>Phòng CNTT</option></select></div>
          </div>
          <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-brand-ink" /> Bắt buộc bật xác thực 2 lớp khi đăng nhập lần đầu</label>
        </div>
      </Modal>

      {toastNode}
    </div>
  );
}
