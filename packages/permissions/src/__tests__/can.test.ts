import { describe, it, expect } from 'vitest';
import { can, canAny, canAll } from '../can';
import { ROLES } from '@campusstay/constants';

describe('Permissions Matrix & can() Helper', () => {
  it('Student should have permission to create application but not review', () => {
    expect(can(ROLES.STUDENT, 'application:create')).toBe(true);
    expect(can(ROLES.STUDENT, 'application:review')).toBe(false);
  });

  it('Staff should have permission to review applications and manage inventory', () => {
    expect(can(ROLES.STAFF, 'application:review')).toBe(true);
    expect(can(ROLES.STAFF, 'inventory:manage')).toBe(true);
    expect(can(ROLES.STAFF, 'config:system')).toBe(false);
  });

  it('Manager should have permission to approve exceptions and batch assignments', () => {
    expect(can(ROLES.MANAGER, 'application:approve_exception')).toBe(true);
    expect(can(ROLES.MANAGER, 'assignment:approve_batch')).toBe(true);
    expect(can(ROLES.MANAGER, 'config:system')).toBe(false);
  });

  it('Admin should have full system configuration and audit view permissions', () => {
    expect(can(ROLES.ADMIN, 'config:system')).toBe(true);
    expect(can(ROLES.ADMIN, 'audit:view')).toBe(true);
    expect(can(ROLES.ADMIN, 'user:manage')).toBe(true);
  });

  it('canAny and canAll should work accurately', () => {
    expect(canAny(ROLES.STUDENT, ['application:create', 'config:system'])).toBe(true);
    expect(canAll(ROLES.STUDENT, ['application:create', 'config:system'])).toBe(false);
  });
});
