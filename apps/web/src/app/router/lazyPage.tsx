import { lazy, Suspense, type ComponentType } from 'react';
import { TableSkeleton } from '@shared-ui/components/Skeleton';

/**
 * Tách chunk theo vai trò (CONVENTIONS §4.2): mỗi barrel `@pages/<role>` là một chunk riêng,
 * chỉ tải khi người dùng vào nhóm route đó.
 */
export function lazyPage<M extends Record<string, unknown>>(loader: () => Promise<M>, name: keyof M & string) {
  const Page = lazy(() => loader().then((m) => ({ default: m[name] as ComponentType })));
  return (
    <Suspense fallback={<TableSkeleton rows={6} />}>
      <Page />
    </Suspense>
  );
}
