import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../stores/auth.store';
import { can } from '@campusstay/permissions';
import { ROLES } from '@campusstay/constants';

describe('usePermission and Auth Store', () => {
  it('default user should be Student with appropriate permissions', () => {
    const user = useAuthStore.getState().user;
    expect(user?.role).toBe(ROLES.STUDENT);
    expect(can(user?.role, 'application:create')).toBe(true);
    expect(can(user?.role, 'config:system')).toBe(false);
  });

  it('switchRole should successfully change user role and permissions', () => {
    useAuthStore.getState().switchRole(ROLES.ADMIN);
    const updatedUser = useAuthStore.getState().user;
    expect(updatedUser?.role).toBe(ROLES.ADMIN);
    expect(can(updatedUser?.role, 'config:system')).toBe(true);

    // Reset back to STUDENT
    useAuthStore.getState().switchRole(ROLES.STUDENT);
  });
});
