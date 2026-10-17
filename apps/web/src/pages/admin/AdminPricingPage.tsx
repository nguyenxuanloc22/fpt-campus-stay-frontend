import { useState } from 'react';
import { Save, Zap, Droplets, Plus, History, Calculator } from 'lucide-react';
import { PageHeader, SectionCard, AppButton, Tabs, useToast } from '@shared-ui';

/**
 * Configure Room & Bed Pricing (Admin). Theo Phiếu đăng ký, KTX chỉ thu phí phòng/giường (tiền cọc + phần còn lại);
 * đơn giá điện nước là phần mở rộng Flow 6.
 */
type TabKey = 'room' | 'utility';

const ROOM_PRICES = [
  { id: 'VIP_2', name: 'Phòng 2 giường VIP', buildings: 'D, C', beds: 2, monthly: 2200000, semester: 8800000, deposit: 1000000 },
  { id: 'AC_4', name: 'Phòng 4 giường máy lạnh', buildings: 'A, C, D', beds: 4, monthly: 1200000, semester: 4800000, deposit: 500000 },
  { id: 'FAN_4', name: 'Phòng 4 giường quạt', buildings: 'A', beds: 4, monthly: 950000, semester: 3800000, deposit: 500000 },
  { id: 'STD_6', name: 'Phòng 6 giường tiêu chuẩn', buildings: 'B', beds: 6, monthly: 800000, semester: 3200000, deposit: 300000 },
];

const UTILITY = [
  { name: 'Điện sinh hoạt', unit: 'kWh', price: 3000, quota: '30 kWh/SV/tháng', over: 3500, icon: Zap },
  { name: 'Nước sinh hoạt', unit: 'm³', price: 15000, quota: '3 m³/SV/tháng', over: 18000, icon: Droplets },
];

const HISTORY = [
  { when: '01/10/2026', change: 'Điện 2.800 ₫ → 3.000 ₫/kWh (theo QĐ EVN)', by: 'Quản trị viên' },
  { when: '15/07/2026', change: 'Phòng 4 giường máy lạnh 1.100.000 → 1.200.000 ₫', by: 'ThS. Hoàng Nam' },
  { when: '15/07/2026', change: 'Thêm loại phòng 2 giường VIP', by: 'Quản trị viên' },
];

const fmt = (v: number) => v.toLocaleString('vi-VN');

export function AdminPricingPage() {
  const { show, toastNode } = useToast();
  const [tab, setTab] = useState<TabKey>('room');
  const [rooms, setRooms] = useState(ROOM_PRICES);
  const [effective, setEffective] = useState('2027-01-04');
  const [calcType, setCalcType] = useState('AC_4');
  const [calcMonths, setCalcMonths] = useState(4);
  const [calcKwh, setCalcKwh] = useState(30);

  const calcRoom = rooms.find((r) => r.id === calcType) ?? rooms[1]!;
  const calcTotal = calcRoom.monthly * calcMonths + calcKwh * 3000 * calcMonths + 3 * 15000 * calcMonths;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Loại phòng & giá"
        description="Đơn giá giường theo loại phòng và tiền cọc — thay đổi có hiệu lực cho đơn đăng ký mới, không cần triển khai lại"
        actions={
          <>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Hiệu lực từ</span>
              <input type="date" value={effective} onChange={(e) => setEffective(e.target.value)} className="px-2.5 py-1.5 border border-slate-200 rounded-lg" />
            </div>
            <AppButton size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={() => show(`Đã lưu bảng giá, hiệu lực từ ${effective.split('-').reverse().join('/')}`)}>Lưu bảng giá</AppButton>
          </>
        }
      />

      <Tabs<TabKey>
        items={[
          { value: 'room', label: 'Giá phòng', count: rooms.length },
          { value: 'utility', label: 'Điện nước (mở rộng)' },
        ]}
        value={tab}
        onChange={setTab}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {tab === 'room' && (
            <SectionCard title="Đơn giá loại phòng" subtitle="Giá đã bao gồm phí quản lý, Wi-Fi, vệ sinh khu vực chung" noPadding
              actions={<AppButton size="sm" variant="outline" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => show('Mở biểu mẫu thêm loại phòng', 'info')}>Thêm loại phòng</AppButton>}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="text-left px-5 py-3 font-semibold">Loại phòng</th>
                      <th className="text-left px-5 py-3 font-semibold">Tòa áp dụng</th>
                      <th className="text-right px-5 py-3 font-semibold">Giá / tháng (₫)</th>
                      <th className="text-right px-5 py-3 font-semibold">Giá / kỳ (₫)</th>
                      <th className="text-right px-5 py-3 font-semibold">Tiền cọc (₫)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rooms.map((r) => (
                      <tr key={r.id}>
                        <td className="px-5 py-3"><div className="font-semibold text-slate-800">{r.name}</div><div className="text-[11px] text-slate-400">{r.id} • {r.beds} giường</div></td>
                        <td className="px-5 py-3 text-slate-600">{r.buildings}</td>
                        <td className="px-5 py-3 text-right">
                          <input type="number" value={r.monthly} step={50000} onChange={(e) => setRooms(rooms.map((x) => (x.id === r.id ? { ...x, monthly: Number(e.target.value), semester: Number(e.target.value) * 4 } : x)))} className="w-28 px-2 py-1 text-right border border-slate-200 rounded" />
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-[#F26F21]">{fmt(r.semester)}</td>
                        <td className="px-5 py-3 text-right">
                          <input type="number" value={r.deposit} step={50000} onChange={(e) => setRooms(rooms.map((x) => (x.id === r.id ? { ...x, deposit: Number(e.target.value) } : x)))} className="w-24 px-2 py-1 text-right border border-slate-200 rounded" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {tab === 'utility' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {UTILITY.map((u) => (
                <SectionCard key={u.name} title={<span className="flex items-center gap-2"><u.icon className="w-4 h-4 text-[#F26F21]" /> {u.name}</span>}>
                  <div className="space-y-3 text-xs">
                    <div><label className="block text-slate-500 mb-1">Đơn giá trong định mức (₫/{u.unit})</label><input type="number" defaultValue={u.price} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
                    <div><label className="block text-slate-500 mb-1">Định mức miễn phụ thu</label><input defaultValue={u.quota} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
                    <div><label className="block text-slate-500 mb-1">Đơn giá vượt định mức (₫/{u.unit})</label><input type="number" defaultValue={u.over} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50"><span className="text-slate-500">Cách chia</span><span className="font-semibold">Chia đều số SV trong phòng</span></div>
                  </div>
                </SectionCard>
              ))}
              <div className="md:col-span-2 p-4 rounded-xl bg-[#EBF2FB] text-xs text-[#1A365D]">
                Phần mở rộng (Flow 6): cán bộ KTX ghi chỉ số công tơ ngày 01 hằng tháng; hệ thống tạo đợt hóa đơn điện nước ngày 05, hạn thanh toán ngày 20.
              </div>
            </div>
          )}

        </div>

        <div className="space-y-6">
          <SectionCard title={<span className="flex items-center gap-2"><Calculator className="w-4 h-4 text-[#F26F21]" /> Máy tính chi phí</span>} subtitle="Ước tính chi phí 1 sinh viên">
            <div className="space-y-3 text-xs">
              <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                {rooms.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-slate-500">Số tháng</label><input type="number" value={calcMonths} min={1} onChange={(e) => setCalcMonths(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
                <div><label className="text-slate-500">kWh / tháng</label><input type="number" value={calcKwh} onChange={(e) => setCalcKwh(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-200 rounded-lg" /></div>
              </div>
              <div className="space-y-1 pt-2 border-t">
                <div className="flex justify-between"><span className="text-slate-500">Phí phòng</span><span>{fmt(calcRoom.monthly * calcMonths)} ₫</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Điện</span><span>{fmt(calcKwh * 3000 * calcMonths)} ₫</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Nước (3m³)</span><span>{fmt(45000 * calcMonths)} ₫</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Tiền cọc</span><span>{fmt(calcRoom.deposit)} ₫</span></div>
                <div className="flex justify-between font-bold text-sm pt-1 border-t"><span>Tổng</span><span className="text-[#F26F21]">{fmt(calcTotal + calcRoom.deposit)} ₫</span></div>
              </div>
            </div>
          </SectionCard>
          <SectionCard title={<span className="flex items-center gap-2"><History className="w-4 h-4" /> Lịch sử thay đổi giá</span>} noPadding>
            <ul className="divide-y divide-slate-100">
              {HISTORY.map((h) => (
                <li key={h.change} className="px-5 py-3 text-xs"><div className="text-slate-800">{h.change}</div><div className="text-[11px] text-slate-400">{h.when} • {h.by}</div></li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      {toastNode}
    </div>
  );
}
