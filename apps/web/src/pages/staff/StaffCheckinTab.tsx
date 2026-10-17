// Tab “Check-in & Bàn giao” của StaffPortal — Process Manual/Late Check-In & Room-Condition Verify.
import { UserCheck, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import type { ManualCheckinItem } from './staffMockData';

interface StaffCheckinTabProps {
  checkins: ManualCheckinItem[];
  onComplete: (id: string) => void;
}

export function StaffCheckinTab({ checkins, onComplete }: StaffCheckinTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#1A365D]">Tiếp Nhận Check-In & Xác Minh Tình Trạng Phòng</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Xác thực danh tính sinh viên tại quầy, kiểm tra biên bản hiện trạng trang thiết bị trước khi giao chìa khóa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {checkins.map((chk) => (
          <div key={chk.id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{chk.studentName}</h3>
                <div className="text-xs text-slate-500 mt-0.5">
                  MSSV: <strong className="text-slate-700">{chk.studentId}</strong> • Phòng:{' '}
                  <strong className="text-slate-800">{chk.assignedRoom} ({chk.bedCode})</strong>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Hình thức: {chk.checkinType} • Lịch hẹn: {chk.scheduledTime}
                </div>
              </div>

              <span
                className={clsx(
                  'px-2.5 py-1 rounded-full text-xs font-semibold shrink-0',
                  chk.status === 'COMPLETED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                )}
              >
                {chk.status === 'COMPLETED' ? 'Đã nhận phòng' : 'Chờ kiểm tra biên bản'}
              </span>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700">Biên bản kiểm tra trang thiết bị phòng:</div>
              <div className="space-y-1.5">
                {chk.inventoryItems.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700 cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      disabled={chk.status === 'COMPLETED'}
                      className="rounded text-[#F26522] focus:ring-[#F26522]"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {chk.status !== 'COMPLETED' ? (
                <button
                  type="button"
                  onClick={() => onComplete(chk.id)}
                  className="bg-[#F26522] hover:bg-[#d95314] text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserCheck className="w-4 h-4" />
                  Xác nhận nhận phòng & Bàn giao
                </button>
              ) : (
                <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất biên bản bàn giao
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
