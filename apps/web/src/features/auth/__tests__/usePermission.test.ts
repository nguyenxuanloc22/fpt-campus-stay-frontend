import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/auth.store';
import { can } from '@campusstay/permissions';
import { ROLES } from '@campusstay/constants';

describe('Auth store & permissions', () => {
  beforeEach(() => useAuthStore.getState().logout());

  it('starts signed out', () => {
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('signs in each role with its account and shared password', () => {
    for (const [username, role] of [
      ['student', ROLES.STUDENT],
      ['staff', ROLES.STAFF],
      ['manager', ROLES.MANAGER],
      ['admin', ROLES.ADMIN],
    ] as const) {
      expect(useAuthStore.getState().loginWithCredentials(username, '123')).toBe(true);
      expect(useAuthStore.getState().user?.role).toBe(role);
    }
    expect(can(useAuthStore.getState().user?.role, 'config:system')).toBe(true);
  });

  it('rejects a wrong password or unknown account', () => {
    expect(useAuthStore.getState().loginWithCredentials('admin', 'wrong')).toBe(false);
    expect(useAuthStore.getState().loginWithCredentials('ghost', '123')).toBe(false);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it('student SSO signs in as a student who can apply but not configure', () => {
    useAuthStore.getState().loginWithStudentSso();
    const role = useAuthStore.getState().user?.role;
    expect(role).toBe(ROLES.STUDENT);
    expect(can(role, 'application:create')).toBe(true);
    expect(can(role, 'config:system')).toBe(false);
  });
});
