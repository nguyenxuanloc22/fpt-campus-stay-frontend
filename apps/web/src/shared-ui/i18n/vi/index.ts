import { ADMIN1 } from './admin1';
import { ADMIN2 } from './admin2';
import { COMMON } from './common';
import { DATA } from './data';
import { MANAGER } from './manager';
import { PUBLIC } from './public';
import { SHELL } from './shell';
import { STAFF1 } from './staff1';
import { STAFF2 } from './staff2';
import { STUDENT1 } from './student1';
import { STUDENT2 } from './student2';
import { MANUAL } from './manual';

/** Từ điển tiếng Việt, chia theo khu vực (khung, dùng chung, dữ liệu mẫu, từng vai trò). Sinh lại bằng công cụ i18n; bổ sung tay vào manual.ts. */
export const VI: Record<string, string> = { ...ADMIN1, ...ADMIN2, ...COMMON, ...DATA, ...MANAGER, ...PUBLIC, ...SHELL, ...STAFF1, ...STAFF2, ...STUDENT1, ...STUDENT2, ...MANUAL };
