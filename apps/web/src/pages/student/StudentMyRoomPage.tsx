import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, PenLine, Wrench, Mail, Check } from 'lucide-react';
import clsx from 'clsx';
import { APP_ROUTES } from '@campusstay/constants';
import { assetsForRoom, roomTypeById } from '@features/rooms/roomCatalog';
import { RoomTypeIllustration } from '@features/rooms/RoomTypeIllustration';
import { SectionCard, StatusBadge, AppButton, Avatar, Modal, ProgressBar, maskPhone, useToast } from '@shared-ui';

/**
 * Phòng của tôi — View Room Assignment, bạn cùng phòng, tài sản trong phòng (có mã ID để báo hỏng)
 * và hợp đồng lưu trú số.
 */

const ROOM = {
  code: 'A204',
  bed: 'G1',
  building: 'Tòa A',
  floor: 2,
  typeId: 'ROOM_4' as const,
  term: 'Fall 2026',
  period: '01/09/2026 – 31/12/2026',
  daysStayed: 47,
  daysTotal: 122,
  contract: 'HD-KTX-0789',
};

const NEXT_CONTRACT = 'HD-KTX-1102';

/** Tình trạng tài sản — đồng bộ từ các yêu cầu bảo trì */
const ASSET_STATUS: Record<string, { label: string; tone: 'ok' | 'repair' }> = {
  'A204-DH-01': { label: 'Đang sửa · TK-10482', tone: 'repair' },
};

const ROOMMATES = [
  { name: 'Nguyễn Thị Mai Anh', id: 'SE171234', major: 'Kỹ thuật phần mềm', bed: 'G1', phone: '0901234567', isMe: true },
  { name: 'Võ Thị Bảo Ngọc', id: 'SE172211', major: 'Kỹ thuật phần mềm', bed: 'G2', phone: '0912456789', isMe: false },
  { name: 'Phạm Ngọc Hân', id: 'SS170789', major: 'Digital Marketing', bed: 'G3', phone: '0987112233', isMe: false },
  { name: 'Trần Khánh Linh', id: 'SE180321', major: 'Trí tuệ nhân tạo', bed: 'G4', phone: '0938777654', isMe: false },
];

const STAY = [
  { term: 'Summer 2026', semester: 4, status: 'CHECKED_OUT', room: 'A204-G1' },
  { term: 'Fall 2026', semester: 5, status: 'CHECKED_IN', room: 'A204-G1' },
  { term: 'Spring 2027', semester: 6, status: 'ASSIGNED', room: 'A204-G1' },
  { term: 'Summer 2027', semester: 7, status: 'PROCESSING', room: 'Chờ xếp phòng' },
];

export function StudentMyRoomPage() {
  const navigate = useNavigate();
  const { show, toastNode } = useToast();
  const [signOpen, setSignOpen] = useState(false);
  const [otp, setOtp] = useState('');
  const [signed, setSigned] = useState(false);

  const type = roomTypeById(ROOM.typeId);
  const assets = assetsForRoom(ROOM.code, ROOM.typeId);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Thẻ phòng */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-[280px_1fr]">
        <RoomTypeIllustration type={ROOM.typeId} className="w-full h-full min-h-[180px] bg-slate-50" />
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-500">Phòng của tôi · {ROOM.term}</div>
              <div className="flex items-baseline gap-3 mt-1">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{ROOM.code}</h1>
                <span className="text-lg font-semibold text-slate-500">Giường {ROOM.bed}</span>
              </div>
              <div className="text-sm text-slate-600 mt-1">{ROOM.building} · Tầng {ROOM.floor} · {type.name}</div>
            </div>
            <StatusBadge status="CHECKED_IN" customLabel="Đang ở" />
          </div>
          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{ROOM.period}</span>
              <span>{ROOM.daysStayed}/{ROOM.daysTotal} ngày</span>
            </div>
            <ProgressBar value={ROOM.daysStayed} max={ROOM.daysTotal} tone="navy" size="md" />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
            <div><div className="text-xs text-slate-500">Hợp đồng</div><div className="font-semibold text-slate-900">{ROOM.contract}</div></div>
            <div><div className="text-xs text-slate-500">Thành viên</div><div className="font-semibold text-slate-900">{ROOMMATES.length}/{type.capacity} người</div></div>
            <div><div className="text-xs text-slate-500">Phí kỳ</div><div className="font-semibold text-slate-900">{type.pricePerTerm.toLocaleString('vi-VN')} ₫</div></div>
          </div>
        </div>
      </div>

      {/* Việc cần làm cho kỳ tiếp theo */}
      {!signed && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 rounded-2xl bg-slate-900 text-white">
          <div className="flex-1">
            <div className="text-sm font-semibold">Đã xếp phòng Spring 2027: {ROOM.code} · Giường {ROOM.bed}</div>
            <div className="text-xs text-slate-300">Ký hợp đồng {NEXT_CONTRACT} trước khi check-in (02/01 – 05/01/2027).</div>
          </div>
          <AppButton leftIcon={<PenLine className="w-4 h-4" />} onClick={() => setSignOpen(true)}>Ký hợp đồng</AppButton>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tài sản */}
        <SectionCard className="lg:col-span-2" title="Tài sản trong phòng" subtitle="Mỗi thiết bị có mã riêng — dùng mã này khi báo hỏng" noPadding>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 bg-slate-50">
                <tr>
                  <th className="text-left font-medium px-5 py-2.5">Mã tài sản</th>
                  <th className="text-left font-medium px-5 py-2.5">Thiết bị</th>
                  <th className="text-left font-medium px-5 py-2.5">Tình trạng</th>
                  <th className="px-5 py-2.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((a) => {
                  const st = ASSET_STATUS[a.id];
                  return (
                    <tr key={a.id}>
                      <td className="px-5 py-2.5 whitespace-nowrap"><code className="text-xs text-slate-600">{a.id}</code></td>
                      <td className="px-5 py-2.5 text-slate-900">{a.name}</td>
                      <td className="px-5 py-2.5">
                        <span className={clsx('text-xs font-medium', st?.tone === 'repair' ? 'text-amber-600' : 'text-slate-500')}>{st?.label ?? 'Bình thường'}</span>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => navigate(APP_ROUTES.STUDENT.REQUESTS, { state: { assetId: a.id, assetName: a.name } })}
                          className="inline-flex items-center gap-1 whitespace-nowrap text-xs font-semibold text-slate-500 hover:text-[#F26F21]"
                        >
                          <Wrench className="w-3.5 h-3.5" /> Báo hỏng
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <div className="space-y-6">
          {/* Bạn cùng phòng */}
          <SectionCard title="Bạn cùng phòng" noPadding>
            <ul className="divide-y divide-slate-100">
              {ROOMMATES.map((m) => (
                <li key={m.id} className="px-5 py-3 flex items-center gap-3">
                  <Avatar name={m.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">{m.name}{m.isMe && <span className="text-slate-400 font-normal"> (bạn)</span>}</div>
                    <div className="text-xs text-slate-500 truncate">{m.major}{!m.isMe && ` · ${maskPhone(m.phone)}`}</div>
                  </div>
                  <span className="text-xs font-semibold text-slate-500">{m.bed}</span>
                  {!m.isMe && (
                    <a href={`mailto:${m.id.toLowerCase()}@fpt.edu.vn`} aria-label={`Gửi email cho ${m.name}`} className="text-slate-400 hover:text-slate-900">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Lịch lưu trú */}
          <SectionCard title="Lịch lưu trú">
            <ol className="space-y-3">
              {STAY.map((s) => (
                <li key={s.term} className="flex items-center gap-3">
                  <span className={clsx('w-2 h-2 rounded-full shrink-0', s.status === 'CHECKED_IN' ? 'bg-[#F26F21]' : 'bg-slate-300')} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">{s.term} <span className="text-xs font-normal text-slate-400">· Kỳ {s.semester}</span></div>
                    <div className="text-xs text-slate-500">{s.room}</div>
                  </div>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ol>
          </SectionCard>

          {/* Hợp đồng */}
          <SectionCard title="Hợp đồng" noPadding>
            <ul className="divide-y divide-slate-100">
              {[
                { code: NEXT_CONTRACT, term: 'Spring 2027', status: signed ? 'SIGNED' : 'DRAFT' },
                { code: ROOM.contract, term: 'Fall 2026', status: 'ACTIVE' },
              ].map((c) => (
                <li key={c.code} className="px-5 py-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-900">{c.code}</div>
                    <div className="text-xs text-slate-500">{c.term}</div>
                  </div>
                  <StatusBadge status={c.status} customLabel={c.status === 'DRAFT' ? 'Chờ ký' : undefined} />
                  <button type="button" aria-label={`Tải ${c.code}`} onClick={() => show(`Đang tải ${c.code}.pdf`)} className="text-slate-400 hover:text-slate-900">
                    <Download className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </div>

      <Modal
        open={signOpen}
        onClose={() => setSignOpen(false)}
        size="sm"
        title={`Ký hợp đồng ${NEXT_CONTRACT}`}
        subtitle="Mã OTP đã được gửi tới email sinh viên"
        footer={
          <>
            <AppButton variant="outline" onClick={() => setSignOpen(false)}>Hủy</AppButton>
            <AppButton
              disabled={otp.length !== 6}
              leftIcon={<Check className="w-4 h-4" />}
              onClick={() => { setSigned(true); setSignOpen(false); setOtp(''); show('Đã ký hợp đồng điện tử'); }}
            >
              Xác nhận ký
            </AppButton>
          </>
        }
      >
        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          aria-label="Mã OTP"
          placeholder="••••••"
          className="w-full px-3 py-3 text-center text-xl tracking-[0.6em] font-bold border border-slate-200 rounded-lg"
        />
        <p className="text-xs text-slate-500 mt-3">Chữ ký điện tử có giá trị pháp lý theo Luật Giao dịch điện tử 2023.</p>
      </Modal>
      {toastNode}
    </div>
  );
}
