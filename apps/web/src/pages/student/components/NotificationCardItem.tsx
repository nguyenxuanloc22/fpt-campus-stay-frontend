import { useState } from 'react';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@campusstay/constants';

export interface NotificationModel {
  id: string;
  category: 'KTX' | 'MAINTENANCE' | 'ACADEMIC';
  title: string;
  date: string;
  summary: string;
  isNew?: boolean;
  expanded?: boolean;
  ctaText?: string;
  ctaRoute?: string;
}

export function NotificationCardItem({ item }: { item: NotificationModel }) {
  const [isExpanded, setIsExpanded] = useState(item.expanded || false);
  const navigate = useNavigate();

  const getBadgeStyle = (cat: string) => {
    switch (cat) {
      case 'KTX':
        return 'bg-orange-50 text-[#F26F21] border-orange-200';
      case 'MAINTENANCE':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    }
  };

  const getCatLabel = (cat: string) => {
    switch (cat) {
      case 'KTX':
        return 'KTX';
      case 'MAINTENANCE':
        return 'Bảo trì';
      default:
        return 'Học vụ';
    }
  };

  return (
    <div className="py-4 border-b border-slate-100 last:border-0">
      <div
        className="flex items-start gap-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="pt-1.5 shrink-0">
          {item.isNew ? (
            <span className="block w-2.5 h-2.5 rounded-full bg-[#F26F21]" />
          ) : (
            <span className="block w-2.5 h-2.5 rounded-full bg-slate-200" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getBadgeStyle(item.category)}`}>
              {getCatLabel(item.category)}
            </span>
            <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#F26F21] transition">
              {item.title}
            </h4>
            {item.isNew && (
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-orange-100 text-[#F26F21]">
                Mới
              </span>
            )}
            <span className="text-[11px] text-slate-400 ml-auto shrink-0">{item.date}</span>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed line-clamp-1">{item.summary}</p>

          {/* Expanded Box */}
          {isExpanded && (
            <div className="mt-3 p-4 rounded-xl bg-orange-50/40 border border-orange-200/70 text-xs text-slate-700 space-y-3">
              <p className="leading-relaxed">{item.summary}</p>
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(item.ctaRoute || APP_ROUTES.STUDENT.REGISTRATION);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#F26F21] hover:bg-[#D95A12] text-white font-bold transition shadow-2xs"
                >
                  {item.ctaText || 'Tiến hành Đăng ký KTX ngay >'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(APP_ROUTES.STUDENT.DASHBOARD);
                  }}
                  className="text-xs font-semibold text-[#F26F21] hover:underline flex items-center gap-1"
                >
                  <span>Vào Cổng KTX Sinh Viên</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
