import { useState } from 'react';
import { Play, CheckCircle2 } from 'lucide-react';
import { AppButton } from '@shared-ui/components/AppButton';

export function AdminAllocationEnginePage() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSimulate = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setResult('Chạy mô phỏng hoàn tất: 340/350 sinh viên được xếp thành công. 0 xung đột.');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1A365D]">Cấu Hình Thuật Toán Xếp Phòng (Allocation Engine)</h1>
        <p className="text-xs text-slate-500 mt-1">Cài đặt trọng số ghép nhóm bạn, cùng ngành, khóa học và chạy mô phỏng giả lập</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-800 text-sm">Trọng số ưu tiên (Weight Matrix)</h3>
        
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Ưu tiên nhóm bạn cùng phòng (Roommate Group PIN)</label>
          <input type="range" min="1" max="100" defaultValue="90" className="w-full accent-[#F26F21]" />
          <span className="text-slate-400">Trọng số: 90/100 (Ưu tiên cao nhất)</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Cùng ngành đào tạo (Major)</label>
          <input type="range" min="1" max="100" defaultValue="60" className="w-full accent-[#F26F21]" />
          <span className="text-slate-400">Trọng số: 60/100</span>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Cùng khóa học (K18, K19, K20)</label>
          <input type="range" min="1" max="100" defaultValue="40" className="w-full accent-[#F26F21]" />
          <span className="text-slate-400">Trọng số: 40/100</span>
        </div>

        {result && (
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{result}</span>
          </div>
        )}

        <div className="pt-4 border-t flex justify-end gap-2">
          <AppButton
            variant="secondary"
            size="sm"
            isLoading={isRunning}
            onClick={handleSimulate}
            leftIcon={<Play className="w-4 h-4" />}
          >
            Chạy mô phỏng giả lập (Dry-run)
          </AppButton>
        </div>
      </div>
    </div>
  );
}
