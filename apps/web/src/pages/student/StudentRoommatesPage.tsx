import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function StudentRoommatesPage() {
  const pin = 'FPT-9821';
  const [copied, setCopied] = useState(false);
  const [friendId, setFriendId] = useState('');
  const [joinPin, setJoinPin] = useState('');

  const members = [
    { id: '1', name: 'Nguyễn Xuân Lộc', mssv: 'SE170123', isLeader: true },
    { id: '2', name: 'Trần Minh Quân', mssv: 'SE170456', isLeader: false },
    { id: '3', name: 'Lê Hoàng Nam', mssv: 'SE170789', isLeader: false },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Nhóm Bạn Cùng Phòng</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tạo nhóm hoặc nhập mã PIN để cùng nhau đăng ký chung một phòng tại KTX Tân Uyên
        </p>
      </div>

      {/* Group Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-orange-50/60 rounded-xl border border-orange-100">
          <div>
            <div className="text-xs font-semibold text-[#F26F21] uppercase tracking-wider">Mã PIN Mời Bạn</div>
            <div className="text-2xl font-black text-slate-800 tracking-wider mt-0.5">{pin}</div>
            <div className="text-[11px] text-slate-500">Chia sẻ mã này cho bạn cùng phòng để gia nhập nhóm</div>
          </div>
          <AppButton
            variant="outline"
            size="sm"
            onClick={handleCopy}
            leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          >
            {copied ? 'Đã sao chép' : 'Sao chép mã PIN'}
          </AppButton>
        </div>

        {/* Member List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Thành viên trong nhóm (3/4 sinh viên)</h3>
            <span className="text-xs text-slate-500">Tối đa: 4 thành viên</span>
          </div>

          <div className="space-y-2.5">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#1A365D] text-white flex items-center justify-center font-bold text-xs">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{m.name}</div>
                    <div className="text-[11px] text-slate-500">MSSV: {m.mssv}</div>
                  </div>
                </div>
                {m.isLeader ? (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-[#F26F21]">
                    Trưởng nhóm
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400">Thành viên</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Mời bạn bằng MSSV</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập MSSV (VD: SE170999)"
                value={friendId}
                onChange={(e) => setFriendId(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border rounded-lg"
              />
              <AppButton size="sm">Gửi lời mời</AppButton>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Gia nhập nhóm khác bằng mã PIN</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập mã PIN (VD: FPT-XXXX)"
                value={joinPin}
                onChange={(e) => setJoinPin(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border rounded-lg"
              />
              <AppButton variant="secondary" size="sm">Tham gia</AppButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
