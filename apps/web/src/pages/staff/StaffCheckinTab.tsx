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
          <h2 className="text-base font-bold text-ink">Tiếp Nhận Check-In & Xác Minh Tình Trạng Phòng</h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Xác thực danh tính sinh viên tại quầy, kiểm tra biên bản hiện trạng trang thiết bị trước khi giao chìa khóa
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {checkins.map((chk) => (
          <div key={chk.id} className="bg-white rounded-2xl border border-line/80 p-5 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-ink">{chk.studentName}</h3>
                <div className="text-xs text-ink-muted mt-0.5">
                  MSSV: <strong className="text-ink">{chk.studentId}</strong> • Phòng:{' '}
                  <strong className="text-ink">{chk.assignedRoom} ({chk.bedCode})</strong>
                </div>
                <div className="text-label text-ink-subtle mt-1">
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

            <div className="space-y-2 pt-2 border-t border-line">
              <div className="text-xs font-bold text-ink">Biên bản kiểm tra trang thiết bị phòng:</div>
              <div className="space-y-1.5">
                {chk.inventoryItems.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-surface-muted border border-line text-xs text-ink cursor-pointer hover:bg-surface-sunken transition-colors"
                  >
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      disabled={chk.status === 'COMPLETED'}
                      className="rounded text-brand-ink focus:ring-brand-ink"
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-line">
              {chk.status !== 'COMPLETED' ? (
                <button
                  type="button"
                  onClick={() => onComplete(chk.id)}
                  className="bg-brand-ink hover:bg-brand-ink-hover text-white px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
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
